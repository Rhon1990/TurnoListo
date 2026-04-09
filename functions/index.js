const crypto = require("crypto");
const admin = require("firebase-admin");
const { HttpsError, onCall } = require("firebase-functions/https");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");

admin.initializeApp();

const firestore = admin.firestore();
const auth = admin.auth();
const messaging = admin.messaging();
const CLIENT_PUSH_SUBSCRIPTIONS_COLLECTION = "clientPushSubscriptions";
const CONTACT_INQUIRIES_COLLECTION = "contactInquiries";

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function trimValue(value) {
  return String(value || "").trim();
}

function formatPickupPointForPush(value) {
  const pickupPoint = trimValue(value);
  if (!pickupPoint) return "el mostrador";
  if (/^mostrador\s*1$/i.test(pickupPoint)) return "Mostrador";
  return pickupPoint;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function normalizeLogoUrl(value) {
  const logoUrl = String(value || "").trim();
  if (!logoUrl) return "";
  if (!logoUrl.startsWith("data:image/")) {
    throw new HttpsError("invalid-argument", "El logo debe ser una imagen valida.");
  }
  if (logoUrl.length > 350000) {
    throw new HttpsError("invalid-argument", "El logo es demasiado grande. Usa una imagen mas ligera.");
  }
  return logoUrl;
}

function normalizeAppUrl(value) {
  const appUrl = trimValue(value);
  if (!appUrl) return "";

  try {
    const parsed = new URL(appUrl);
    return parsed.toString();
  } catch {
    throw new HttpsError("invalid-argument", "La URL de acceso del restaurante no es valida.");
  }
}

function isValidEmail(value) {
  const email = normalizeEmail(value);
  return Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

function generateRestaurantPassword(length = 14) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%*_-";
  const all = `${upper}${lower}${digits}${symbols}`;
  const chars = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  while (chars.length < length) {
    chars.push(all[Math.floor(Math.random() * all.length)]);
  }

  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
  }

  return chars.join("");
}

async function assertAdmin(authUid) {
  if (!authUid) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesion para crear restaurantes.");
  }

  const profileSnapshot = await firestore.collection("users").doc(authUid).get();
  if (!profileSnapshot.exists || profileSnapshot.data()?.role !== "admin") {
    throw new HttpsError("permission-denied", "Solo un administrador puede crear restaurantes.");
  }
}

exports.createRestaurantAccount = onCall(async (request) => {
  const authUid = request.auth?.uid || null;
  await assertAdmin(authUid);

  const data = request.data || {};
  const email = normalizeEmail(data.email);
  if (!email) {
    throw new HttpsError("invalid-argument", "El correo del restaurante es obligatorio.");
  }

  const name = trimValue(data.name) || "Nuevo restaurante";
  const ownerName = trimValue(data.ownerName);
  const phone = trimValue(data.phone);
  const city = trimValue(data.city);
  const address = trimValue(data.address);
  const logoUrl = normalizeLogoUrl(data.logoUrl);
  const planName = trimValue(data.planName) || "Mensual";
  const notes = trimValue(data.notes);
  const activationDays = Math.max(1, Number.parseInt(String(data.activationDays || "30"), 10) || 30);
  const appUrl = normalizeAppUrl(data.appUrl);

  const username = email;
  const password = generateRestaurantPassword();
  const now = new Date();
  const restaurantId = `rest-${Date.now()}`;
  const activatedAt = now.toISOString();
  const activatedUntil = new Date(now.getTime() + activationDays * 24 * 60 * 60 * 1000).toISOString();

  const existingRestaurantQuery = await firestore
    .collection("restaurants")
    .where("username", "==", username)
    .limit(1)
    .get();

  if (!existingRestaurantQuery.empty) {
    throw new HttpsError("already-exists", "Ya existe un restaurante con ese correo.");
  }

  let userRecord;
  try {
    userRecord = await auth.createUser({
      email,
      password,
      displayName: ownerName || name,
    });
  } catch (error) {
    if (error?.code === "auth/email-already-exists") {
      throw new HttpsError("already-exists", "Ese correo ya existe en Firebase Authentication.");
    }
    throw new HttpsError("internal", "No se pudo crear el usuario en Authentication.");
  }

  const restaurant = {
    id: restaurantId,
    name,
    ownerName,
    email,
    phone,
    city,
    address,
    logoUrl,
    planName,
    notes,
    activatedAt,
    activatedUntil,
    username,
    authUid: userRecord.uid,
    createdAt: activatedAt,
  };

  const batch = firestore.batch();
  batch.set(firestore.collection("restaurants").doc(restaurantId), restaurant);
  batch.set(firestore.collection("users").doc(userRecord.uid), {
    role: "restaurant",
    restaurantId,
    email,
    createdAt: activatedAt,
  });

  try {
    await batch.commit();
  } catch (error) {
    await auth.deleteUser(userRecord.uid).catch(() => null);
    throw new HttpsError("internal", "No se pudo guardar el restaurante en Firestore.");
  }

  let accessLink = "";
  if (appUrl) {
    try {
      accessLink = await auth.generatePasswordResetLink(email, {
        url: appUrl,
        handleCodeInApp: false,
      });
    } catch (error) {
      console.error("No se pudo generar el enlace inicial de acceso.", error);
    }
  }

  return {
    restaurant,
    accessLink,
    authUser: {
      uid: userRecord.uid,
      email: userRecord.email,
    },
  };
});

exports.createRestaurantAccessLink = onCall(async (request) => {
  const authUid = request.auth?.uid || null;
  await assertAdmin(authUid);

  const restaurantId = trimValue(request.data?.restaurantId);
  const appUrl = normalizeAppUrl(request.data?.appUrl);

  if (!restaurantId) {
    throw new HttpsError("invalid-argument", "Falta el restaurante para generar el acceso.");
  }

  if (!appUrl) {
    throw new HttpsError("invalid-argument", "Falta la URL de acceso del restaurante.");
  }

  const restaurantSnapshot = await firestore.collection("restaurants").doc(restaurantId).get();
  if (!restaurantSnapshot.exists) {
    throw new HttpsError("not-found", "No se encontro el restaurante solicitado.");
  }

  const restaurant = restaurantSnapshot.data() || {};
  const email = normalizeEmail(restaurant.email);
  if (!email) {
    throw new HttpsError("failed-precondition", "El restaurante no tiene un correo valido.");
  }

  let accessLink = "";
  try {
    accessLink = await auth.generatePasswordResetLink(email, {
      url: appUrl,
      handleCodeInApp: false,
    });
  } catch (error) {
    console.error("No se pudo generar el enlace de acceso del restaurante.", error);
    throw new HttpsError("internal", "No se pudo generar el enlace de acceso del restaurante.");
  }

  return {
    restaurantId,
    email,
    accessLink,
  };
});

exports.submitContactInquiry = onCall(async (request) => {
  const data = request.data || {};
  const name = trimValue(data.name);
  const company = trimValue(data.company);
  const email = normalizeEmail(data.email);
  const phone = trimValue(data.phone);
  const interest = trimValue(data.interest) || "Consulta general";
  const message = trimValue(data.message);
  const sourcePage = trimValue(data.sourcePage) || "contact.html";
  const referrer = trimValue(data.referrer);

  if (!name || name.length < 2) {
    throw new HttpsError("invalid-argument", "El nombre es obligatorio.");
  }

  if (!isValidEmail(email)) {
    throw new HttpsError("invalid-argument", "El correo es invalido.");
  }

  if (!message || message.length < 12) {
    throw new HttpsError("invalid-argument", "El mensaje es demasiado corto.");
  }

  if (message.length > 2000) {
    throw new HttpsError("invalid-argument", "El mensaje es demasiado largo.");
  }

  const submittedAt = new Date().toISOString();
  const inquiry = {
    name,
    company,
    email,
    phone,
    interest,
    message,
    sourcePage,
    referrer,
    submittedAt,
    status: "unread",
    isRead: false,
    readAt: "",
    channel: "contact-form",
  };

  const docRef = await firestore.collection(CONTACT_INQUIRIES_COLLECTION).add(inquiry);

  return {
    ok: true,
    inquiryId: docRef.id,
    stored: true,
  };
});

exports.registerClientPushSubscription = onCall(async (request) => {
  const data = request.data || {};
  const token = trimValue(data.token);
  const orderId = trimValue(data.orderId);

  if (!token || !orderId) {
    throw new HttpsError("invalid-argument", "Faltan el token push o el pedido a notificar.");
  }

  const orderSnapshot = await firestore.collection("orders").doc(orderId).get();
  if (!orderSnapshot.exists) {
    throw new HttpsError("not-found", "No se ha encontrado el pedido para registrar la notificacion.");
  }

  const order = orderSnapshot.data() || {};
  const clientUrl = trimValue(data.clientUrl) || "";
  const orderPublicId = trimValue(data.orderPublicId) || trimValue(order.sourceOrderId) || orderId;
  const orderNumber = trimValue(data.orderNumber) || trimValue(order.orderNumber) || orderPublicId;
  const subscriptionId = hashToken(token);
  const nowIso = new Date().toISOString();

  await firestore.collection(CLIENT_PUSH_SUBSCRIPTIONS_COLLECTION).doc(subscriptionId).set({
    token,
    orderId,
    orderPublicId,
    orderNumber,
    clientUrl,
    updatedAt: nowIso,
    createdAt: nowIso,
  }, { merge: true });

  return {
    ok: true,
    orderId,
  };
});

exports.unregisterClientPushSubscription = onCall(async (request) => {
  const token = trimValue(request.data?.token);
  if (!token) {
    throw new HttpsError("invalid-argument", "Falta el token push a eliminar.");
  }

  await firestore.collection(CLIENT_PUSH_SUBSCRIPTIONS_COLLECTION).doc(hashToken(token)).delete();
  return { ok: true };
});

exports.notifyClientOrderReady = onDocumentUpdated("orders/{orderId}", async (event) => {
  const before = event.data?.before?.data() || null;
  const after = event.data?.after?.data() || null;

  if (!before || !after || before.status === after.status || after.status !== "ready") {
    return null;
  }

  const subscriptionsSnapshot = await firestore
    .collection(CLIENT_PUSH_SUBSCRIPTIONS_COLLECTION)
    .where("orderId", "==", event.params.orderId)
    .get();

  if (subscriptionsSnapshot.empty) {
    return null;
  }

  const subscriptions = subscriptionsSnapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  }));

  const body = `${after.orderNumber || after.sourceOrderId || "Tu pedido"} ya puede recogerse en ${formatPickupPointForPush(after.pickupPoint)}.`;
  const messages = subscriptions
    .filter((subscription) => trimValue(subscription.token))
    .map((subscription) => ({
      token: subscription.token,
      data: {
        title: "Tu pedido ya está listo para recoger",
        body,
        orderId: event.params.orderId,
        orderPublicId: trimValue(after.sourceOrderId) || event.params.orderId,
        link: trimValue(subscription.clientUrl),
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcmOptions: {
          link: trimValue(subscription.clientUrl) || undefined,
        },
      },
    }));

  if (!messages.length) {
    return null;
  }

  const response = await messaging.sendEach(messages);
  const docsToDelete = [];

  response.responses.forEach((messageResponse, index) => {
    if (messageResponse.success) return;

    const errorCode = messageResponse.error?.code || "";
    if (errorCode === "messaging/registration-token-not-registered" || errorCode === "messaging/invalid-registration-token") {
      docsToDelete.push(subscriptions[index].id);
    }
  });

  if (docsToDelete.length) {
    const batch = firestore.batch();
    docsToDelete.forEach((docId) => {
      batch.delete(firestore.collection(CLIENT_PUSH_SUBSCRIPTIONS_COLLECTION).doc(docId));
    });
    await batch.commit();
  }

  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
  };
});
