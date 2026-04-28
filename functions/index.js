const crypto = require("crypto");
const admin = require("firebase-admin");
const { HttpsError, onCall } = require("firebase-functions/https");
const { onDocumentUpdated, onDocumentWritten } = require("firebase-functions/v2/firestore");

admin.initializeApp();

const firestore = admin.firestore();
const auth = admin.auth();
const messaging = admin.messaging();
const CLIENT_PUSH_SUBSCRIPTIONS_COLLECTION = "clientPushSubscriptions";
const CONTACT_INQUIRIES_COLLECTION = "contactInquiries";
const PHONE_COUNTRY_RULES = {
  ES: { name: "España", dialCode: "+34", minDigits: 9, maxDigits: 9 },
  PT: { name: "Portugal", dialCode: "+351", minDigits: 9, maxDigits: 9 },
  FR: { name: "Francia", dialCode: "+33", minDigits: 9, maxDigits: 9 },
  IT: { name: "Italia", dialCode: "+39", minDigits: 9, maxDigits: 10 },
  DE: { name: "Alemania", dialCode: "+49", minDigits: 10, maxDigits: 11 },
  GB: { name: "Reino Unido", dialCode: "+44", minDigits: 10, maxDigits: 10 },
  IE: { name: "Irlanda", dialCode: "+353", minDigits: 9, maxDigits: 9 },
  NL: { name: "Países Bajos", dialCode: "+31", minDigits: 9, maxDigits: 9 },
  BE: { name: "Bélgica", dialCode: "+32", minDigits: 9, maxDigits: 9 },
  CH: { name: "Suiza", dialCode: "+41", minDigits: 9, maxDigits: 9 },
  AT: { name: "Austria", dialCode: "+43", minDigits: 10, maxDigits: 11 },
  US: { name: "Estados Unidos", dialCode: "+1", minDigits: 10, maxDigits: 10 },
  MX: { name: "México", dialCode: "+52", minDigits: 10, maxDigits: 10 },
  AR: { name: "Argentina", dialCode: "+54", minDigits: 10, maxDigits: 10 },
  CL: { name: "Chile", dialCode: "+56", minDigits: 9, maxDigits: 9 },
  CO: { name: "Colombia", dialCode: "+57", minDigits: 10, maxDigits: 10 },
  PE: { name: "Perú", dialCode: "+51", minDigits: 9, maxDigits: 9 },
  EC: { name: "Ecuador", dialCode: "+593", minDigits: 9, maxDigits: 9 },
  UY: { name: "Uruguay", dialCode: "+598", minDigits: 8, maxDigits: 9 },
  BR: { name: "Brasil", dialCode: "+55", minDigits: 11, maxDigits: 11 },
};

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function trimValue(value) {
  return String(value || "").trim();
}

function normalizePublicTrackingLookupId(value) {
  return trimValue(value).toUpperCase();
}

function assertValidPublicTrackingLookupId(value) {
  const normalizedValue = normalizePublicTrackingLookupId(value);
  if (!normalizedValue || !/^[A-Z0-9-]{4,40}$/.test(normalizedValue)) {
    throw new HttpsError("invalid-argument", "El identificador publico del pedido no es valido.");
  }
  return normalizedValue;
}

function assertMaxLength(value, maxLength, message) {
  if (trimValue(value).length > maxLength) {
    throw new HttpsError("invalid-argument", message);
  }
}

function normalizePhoneCountry(value) {
  const iso = String(value?.iso || "").trim().toUpperCase();
  if (!iso) return null;
  const knownCountry = PHONE_COUNTRY_RULES[iso];
  if (!knownCountry) {
    throw new HttpsError("invalid-argument", "El país del móvil no es válido.");
  }

  return {
    iso,
    name: knownCountry.name,
    dialCode: knownCountry.dialCode,
  };
}

function normalizeRestaurantPhone(phoneValue, phoneCountry) {
  const phone = trimValue(phoneValue);
  if (!phone) {
    return { phone: "", country: "", phoneCountry: null };
  }

  if (!phoneCountry) {
    throw new HttpsError("invalid-argument", "Falta el país del móvil.");
  }

  const countryRule = PHONE_COUNTRY_RULES[phoneCountry.iso];
  const phoneDigits = phone.replace(/\D/g, "");
  const dialDigits = countryRule.dialCode.replace(/\D/g, "");

  if (!phoneDigits.startsWith(dialDigits)) {
    throw new HttpsError("invalid-argument", "El móvil no coincide con el indicativo del país seleccionado.");
  }

  const localDigits = phoneDigits.slice(dialDigits.length);
  if (localDigits.length < countryRule.minDigits || localDigits.length > countryRule.maxDigits) {
    const digitsMessage =
      countryRule.minDigits === countryRule.maxDigits
        ? `${countryRule.minDigits} dígitos`
        : `entre ${countryRule.minDigits} y ${countryRule.maxDigits} dígitos`;
    throw new HttpsError(
      "invalid-argument",
      `El móvil de ${countryRule.name} debe tener ${digitsMessage} sin contar el prefijo.`,
    );
  }

  return {
    phone: `${countryRule.dialCode} ${localDigits}`.trim(),
    country: countryRule.name,
    phoneCountry: {
      iso: phoneCountry.iso,
      name: countryRule.name,
      dialCode: countryRule.dialCode,
    },
  };
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

function pickRandomChar(characters) {
  return characters[crypto.randomInt(0, characters.length)];
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

function normalizeProfileImage(value) {
  return normalizeLogoUrl(value);
}

function toAuthPhotoUrl(value) {
  const avatarUrl = String(value || "").trim();
  if (!avatarUrl || avatarUrl.startsWith("data:image/")) {
    return undefined;
  }

  return avatarUrl;
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

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calculateMedian(values) {
  const safeValues = [...values]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0)
    .sort((left, right) => left - right);

  if (!safeValues.length) return 0;
  const middle = Math.floor(safeValues.length / 2);
  if (safeValues.length % 2) return safeValues[middle];
  return Math.round((safeValues[middle - 1] + safeValues[middle]) / 2);
}

function toMinutesBetween(from, to) {
  if (!from || !to) return null;
  return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000));
}

function getStatusDurationMinutes(order, status) {
  const savedMinutes = Number(order?.statusDurations?.[status] || 0);
  if (order?.status !== status) return savedMinutes;

  const archivedAt = order?.archivedAt || null;
  const endTime = archivedAt ? new Date(archivedAt).getTime() : Date.now();
  const startedAt = new Date(order?.statusStartedAt || order?.createdAt || Date.now()).getTime();
  const liveMinutes = Math.max(0, Math.floor((endTime - startedAt) / 60000));
  return savedMinutes + liveMinutes;
}

async function syncRestaurantAiModelSummary(restaurantId) {
  const safeRestaurantId = trimValue(restaurantId);
  if (!safeRestaurantId) return null;

  const [restaurantSnapshot, ordersSnapshot] = await Promise.all([
    firestore.collection("restaurants").doc(safeRestaurantId).get(),
    firestore.collection("orders").where("restaurantId", "==", safeRestaurantId).get(),
  ]);

  if (!restaurantSnapshot.exists) return null;

  const orders = ordersSnapshot.docs.map((docSnapshot) => docSnapshot.data() || {});
  const readyExamples = orders
    .map((order) => {
      const minutesToReady =
        Number(order?.predictionTrainingRecord?.minutesToReady) ||
        toMinutesBetween(order?.createdAt, order?.lifecycleMilestones?.readyAt);
      return Number.isFinite(minutesToReady) && minutesToReady > 0 ? minutesToReady : null;
    })
    .filter((value) => value !== null);
  const deliveredExamples = orders
    .map((order) => {
      const minutesToDelivered =
        Number(order?.predictionTrainingRecord?.minutesToDelivered) ||
        toMinutesBetween(order?.createdAt, order?.lifecycleMilestones?.deliveredAt);
      return Number.isFinite(minutesToDelivered) && minutesToDelivered > 0 ? minutesToDelivered : null;
    })
    .filter((value) => value !== null);
  const estimationErrors = orders
    .map((order) => {
      const estimatedReadyMinutes = Number(order?.estimatedReadyMinutes || 0);
      const actualReadyMinutes =
        Number(order?.predictionTrainingRecord?.minutesToReady) ||
        toMinutesBetween(order?.createdAt, order?.lifecycleMilestones?.readyAt);
      if (!Number.isFinite(estimatedReadyMinutes) || estimatedReadyMinutes <= 0) return null;
      if (!Number.isFinite(actualReadyMinutes) || actualReadyMinutes <= 0) return null;
      return Math.abs(actualReadyMinutes - estimatedReadyMinutes);
    })
    .filter((value) => value !== null);

  const volumeScore = clampNumber(readyExamples.length / 24, 0, 1);
  const meanAbsoluteError = estimationErrors.length
    ? Math.round((estimationErrors.reduce((total, value) => total + value, 0) / estimationErrors.length) * 10) / 10
    : null;
  const accuracyScore = meanAbsoluteError === null ? 0 : clampNumber(1 - meanAbsoluteError / 18, 0, 1);
  const confidenceScore = Math.round((volumeScore * 0.55 + accuracyScore * 0.45) * 100);
  const confidenceLabel =
    readyExamples.length < 5
      ? "Aprendiendo"
      : confidenceScore >= 78
        ? "Alta"
        : confidenceScore >= 52
          ? "Media"
          : "Aprendiendo";

  const summary = {
    updatedAt: new Date().toISOString(),
    sampleCount: readyExamples.length,
    readySampleCount: readyExamples.length,
    deliveredSampleCount: deliveredExamples.length,
    confidenceScore,
    confidenceLabel,
    meanAbsoluteError,
    adaptiveWeight: readyExamples.length >= 6 ? clampNumber(0.35 + readyExamples.length / 70, 0.35, 0.82) : 0,
    stageBaselines: {
      received: calculateMedian(orders.map((order) => getStatusDurationMinutes(order, "received")).filter((value) => value > 0)),
      preparing: calculateMedian(orders.map((order) => getStatusDurationMinutes(order, "preparing")).filter((value) => value > 0)),
      ready: calculateMedian(orders.map((order) => getStatusDurationMinutes(order, "ready")).filter((value) => value > 0)),
    },
  };

  await restaurantSnapshot.ref.set({ aiModelSummary: summary }, { merge: true });
  return summary;
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
    pickRandomChar(upper),
    pickRandomChar(lower),
    pickRandomChar(digits),
    pickRandomChar(symbols),
  ];

  while (chars.length < length) {
    chars.push(pickRandomChar(all));
  }

  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.randomInt(0, index + 1);
    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
  }

  return chars.join("");
}

function sanitizePublicTrackingRecord(record) {
  if (!record) return null;

  return {
    id: trimValue(record.id),
    restaurantId: trimValue(record.restaurantId),
    restaurantName: trimValue(record.restaurantName),
    restaurantLogoUrl: trimValue(record.restaurantLogoUrl),
    publicTrackingToken: normalizePublicTrackingLookupId(record.publicTrackingToken),
    sourceOrderId: normalizePublicTrackingLookupId(record.sourceOrderId),
    orderNumber: trimValue(record.orderNumber),
    customerName: trimValue(record.customerName),
    pickupPoint: trimValue(record.pickupPoint),
    estimatedReadyMinutes: Number.isFinite(Number(record.estimatedReadyMinutes))
      ? Number(record.estimatedReadyMinutes)
      : null,
    promisedReadyAt: trimValue(record.promisedReadyAt),
    status: trimValue(record.status),
    rating: record.rating && typeof record.rating === "object"
      ? {
          score: Number(record.rating.score) || 0,
          comment: trimValue(record.rating.comment),
          createdAt: trimValue(record.rating.createdAt),
        }
      : null,
    createdAt: trimValue(record.createdAt),
    archivedAt: trimValue(record.archivedAt),
  };
}

function buildClientPath(publicId) {
  const normalizedPublicId = assertValidPublicTrackingLookupId(publicId);
  return `/client.html?order=${encodeURIComponent(normalizedPublicId)}`;
}

async function findTrackingRecordByPublicId(publicId, options = {}) {
  const normalizedPublicId = normalizePublicTrackingLookupId(publicId);
  if (!normalizedPublicId) {
    return null;
  }

  const trackingCollection = firestore.collection("tracking");
  const allowLegacyIdFallback = options.allowLegacyIdFallback !== false;
  const tokenSnapshot = await trackingCollection.where("publicTrackingToken", "==", normalizedPublicId).limit(1).get();
  if (!tokenSnapshot.empty) {
    const docSnapshot = tokenSnapshot.docs[0];
    return {
      id: docSnapshot.id,
      data: docSnapshot.data() || {},
    };
  }

  if (!allowLegacyIdFallback) {
    return null;
  }

  const legacyLookups = [
    trackingCollection.doc(normalizedPublicId).get(),
    trackingCollection.where("sourceOrderId", "==", normalizedPublicId).limit(1).get(),
  ];

  for (const lookup of legacyLookups) {
    const snapshot = await lookup;
    if (!snapshot) continue;

    if ("exists" in snapshot && snapshot.exists) {
      const snapshotData = snapshot.data() || {};
      if (normalizePublicTrackingLookupId(snapshotData.publicTrackingToken)) continue;
      return {
        id: snapshot.id,
        data: snapshotData,
      };
    }

    if ("empty" in snapshot && !snapshot.empty) {
      const docSnapshot = snapshot.docs[0];
      const snapshotData = docSnapshot.data() || {};
      if (normalizePublicTrackingLookupId(snapshotData.publicTrackingToken)) continue;
      return {
        id: docSnapshot.id,
        data: snapshotData,
      };
    }
  }

  return null;
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

function resolveAdminSnapshotCreatedAt(snapshot) {
  const createdAt = snapshot?.data?.()?.createdAt;
  const parsedCreatedAt = new Date(createdAt || "").getTime();
  if (Number.isFinite(parsedCreatedAt)) {
    return parsedCreatedAt;
  }

  const fallbackCreatedAt = snapshot?.createTime?.toMillis?.();
  if (Number.isFinite(fallbackCreatedAt)) {
    return fallbackCreatedAt;
  }

  return Number.POSITIVE_INFINITY;
}

async function findOldestAdminUserId() {
  const adminSnapshots = await firestore.collection("users").where("role", "==", "admin").get();
  if (adminSnapshots.empty) return "";

  return [...adminSnapshots.docs]
    .sort((left, right) => {
      const createdAtDiff = resolveAdminSnapshotCreatedAt(left) - resolveAdminSnapshotCreatedAt(right);
      if (createdAtDiff !== 0) return createdAtDiff;
      return String(left.id).localeCompare(String(right.id));
    })[0]
    ?.id;
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
  const phoneCountry = normalizePhoneCountry(data.phoneCountry);
  const normalizedPhone = normalizeRestaurantPhone(data.phone, phoneCountry);
  const phone = normalizedPhone.phone;
  const country = normalizedPhone.country;
  const city = trimValue(data.city);
  const address = trimValue(data.address);
  const logoUrl = normalizeLogoUrl(data.logoUrl);
  const demoMode = Boolean(data.demoMode);
  const planName = demoMode ? "Demo" : trimValue(data.planName) || "Mensual";
  const notes = trimValue(data.notes);
  const activationDays = demoMode ? 7 : Math.max(1, Number.parseInt(String(data.activationDays || "30"), 10) || 30);
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
    country,
    phoneCountry: normalizedPhone.phoneCountry,
    city,
    address,
    logoUrl,
    planName,
    demoMode,
    demoConfig: demoMode
      ? {
          maxOrders: 8,
          activationDays: 7,
        }
      : null,
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

exports.updateCurrentAdminProfile = onCall(async (request) => {
  const authUid = request.auth?.uid || null;
  await assertAdmin(authUid);

  const data = request.data || {};
  const displayName = trimValue(data.displayName);
  const phone = trimValue(data.phone);
  const title = trimValue(data.title);
  const avatarUrl = normalizeProfileImage(data.avatarUrl);
  const nowIso = new Date().toISOString();

  await firestore.collection("users").doc(authUid).set(
    {
      displayName,
      phone,
      title,
      avatarUrl,
      updatedAt: nowIso,
    },
    { merge: true },
  );

  await auth.updateUser(authUid, {
    displayName: displayName || undefined,
    photoURL: toAuthPhotoUrl(avatarUrl),
  });

  const updatedProfile = await firestore.collection("users").doc(authUid).get();
  return {
    ok: true,
    profile: {
      id: updatedProfile.id,
      ...updatedProfile.data(),
    },
  };
});

exports.createAdminAccount = onCall(async (request) => {
  const authUid = request.auth?.uid || null;
  await assertAdmin(authUid);

  const data = request.data || {};
  const email = normalizeEmail(data.email);
  if (!email) {
    throw new HttpsError("invalid-argument", "El correo del admin es obligatorio.");
  }

  const displayName = trimValue(data.displayName) || "Administrador";
  const phoneCountry = normalizePhoneCountry(data.phoneCountry);
  const normalizedPhone = normalizeRestaurantPhone(data.phone, phoneCountry);
  const phone = normalizedPhone.phone;
  const country = normalizedPhone.country;
  const title = trimValue(data.title) || "Administrador";
  const avatarUrl = normalizeProfileImage(data.avatarUrl);
  const appUrl = normalizeAppUrl(data.appUrl);
  const nowIso = new Date().toISOString();
  const password = generateRestaurantPassword();

  let userRecord;
  try {
    userRecord = await auth.createUser({
      email,
      password,
      displayName,
      photoURL: toAuthPhotoUrl(avatarUrl),
    });
  } catch (error) {
    if (error?.code === "auth/email-already-exists") {
      throw new HttpsError("already-exists", "Ese correo ya existe en Firebase Authentication.");
    }
    throw new HttpsError("internal", "No se pudo crear el usuario administrador.");
  }

  try {
    await firestore.collection("users").doc(userRecord.uid).set({
      role: "admin",
      email,
      displayName,
      phone,
      country,
      phoneCountry: normalizedPhone.phoneCountry,
      title,
      avatarUrl,
      createdAt: nowIso,
      initialAccessPending: true,
      updatedAt: nowIso,
    });
  } catch (error) {
    await auth.deleteUser(userRecord.uid).catch(() => null);
    throw new HttpsError("internal", "No se pudo guardar el perfil admin en Firestore.");
  }

  let accessLink = "";
  if (appUrl) {
    try {
      accessLink = await auth.generatePasswordResetLink(email, {
        url: appUrl,
        handleCodeInApp: false,
      });
    } catch (error) {
      console.error("No se pudo generar el acceso inicial del admin.", error);
    }
  }

  return {
    ok: true,
    adminUser: {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName,
      phone,
      title,
      avatarUrl,
      initialAccessPending: true,
    },
    accessLink,
  };
});

exports.completeCurrentAdminInitialAccess = onCall(async (request) => {
  const authUid = request.auth?.uid || null;
  await assertAdmin(authUid);

  const profileRef = firestore.collection("users").doc(authUid);
  const profileSnapshot = await profileRef.get();
  if (!profileSnapshot.exists) {
    throw new HttpsError("not-found", "No se encontró el perfil admin actual.");
  }

  const profile = profileSnapshot.data() || {};
  if (profile.initialAccessPending !== true) {
    return {
      ok: true,
      profile: {
        id: profileSnapshot.id,
        ...profile,
      },
    };
  }

  const nowIso = new Date().toISOString();
  await profileRef.set(
    {
      initialAccessPending: false,
      initialAccessCompletedAt: nowIso,
      updatedAt: nowIso,
    },
    { merge: true },
  );

  const updatedProfile = await profileRef.get();
  return {
    ok: true,
    profile: {
      id: updatedProfile.id,
      ...updatedProfile.data(),
    },
  };
});

exports.createAdminAccessLink = onCall(async (request) => {
  const authUid = request.auth?.uid || null;
  await assertAdmin(authUid);

  const adminUserId = trimValue(request.data?.adminUserId);
  const appUrl = normalizeAppUrl(request.data?.appUrl);

  if (!adminUserId) {
    throw new HttpsError("invalid-argument", "Falta el administrador para generar el acceso.");
  }

  if (!appUrl) {
    throw new HttpsError("invalid-argument", "Falta la URL de acceso del administrador.");
  }

  const adminUserSnapshot = await firestore.collection("users").doc(adminUserId).get();
  if (!adminUserSnapshot.exists) {
    throw new HttpsError("not-found", "No se encontró el administrador solicitado.");
  }

  const adminUser = adminUserSnapshot.data() || {};
  if (adminUser.role !== "admin") {
    throw new HttpsError("failed-precondition", "El usuario solicitado no tiene rol admin.");
  }

  const oldestAdminUserId = await findOldestAdminUserId();
  const email = normalizeEmail(adminUser.email);
  if (!email) {
    throw new HttpsError("failed-precondition", "El administrador no tiene un correo válido.");
  }

  if (oldestAdminUserId && adminUserSnapshot.id === oldestAdminUserId) {
    return {
      adminUserId,
      email,
      available: false,
      reason: "oldest-admin",
      accessLink: "",
    };
  }

  if (adminUser.initialAccessPending !== true) {
    return {
      adminUserId,
      email,
      available: false,
      reason: "initial-access-completed",
      accessLink: "",
    };
  }

  let accessLink = "";
  try {
    accessLink = await auth.generatePasswordResetLink(email, {
      url: appUrl,
      handleCodeInApp: false,
    });
  } catch (error) {
    console.error("No se pudo generar el enlace de acceso del administrador.", error);
    throw new HttpsError("internal", "No se pudo generar el enlace de acceso del administrador.");
  }

  return {
    adminUserId,
    email,
    available: true,
    reason: "initial-access-pending",
    accessLink,
  };
});

exports.getPublicTrackingOrder = onCall(async (request) => {
  const publicId = assertValidPublicTrackingLookupId(request.data?.publicId || request.data?.id);

  const trackingRecord = await findTrackingRecordByPublicId(publicId);
  if (!trackingRecord) {
    throw new HttpsError("not-found", "No se encontro el seguimiento solicitado.");
  }

  return {
    tracking: sanitizePublicTrackingRecord({
      id: trackingRecord.id,
      ...trackingRecord.data,
    }),
  };
});

exports.submitPublicTrackingRating = onCall(async (request) => {
  const publicId = assertValidPublicTrackingLookupId(request.data?.publicId || request.data?.id);
  const score = Number.parseInt(String(request.data?.score || ""), 10);
  const comment = trimValue(request.data?.comment);

  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new HttpsError("invalid-argument", "La valoracion debe ser un numero entero entre 1 y 5.");
  }

  if (comment.length > 160) {
    throw new HttpsError("invalid-argument", "El comentario es demasiado largo.");
  }

  const trackingRecord = await findTrackingRecordByPublicId(publicId);
  if (!trackingRecord) {
    throw new HttpsError("not-found", "No se encontro el seguimiento solicitado.");
  }

  const currentData = trackingRecord.data || {};
  if (trimValue(currentData.status) !== "delivered") {
    throw new HttpsError("failed-precondition", "Solo se puede valorar un pedido entregado.");
  }

  const existingRating = currentData.rating && typeof currentData.rating === "object" ? currentData.rating : null;
  if (existingRating) {
    const sameScore = Number(existingRating.score) === score;
    const sameComment = trimValue(existingRating.comment) === comment;
    if (!sameScore || !sameComment) {
      throw new HttpsError("already-exists", "Este pedido ya tiene una valoracion registrada.");
    }

    return {
      ok: true,
      tracking: sanitizePublicTrackingRecord({
        id: trackingRecord.id,
        ...currentData,
      }),
    };
  }

  const rating = {
    score,
    comment,
    createdAt: new Date().toISOString(),
  };

  await firestore.collection("tracking").doc(trackingRecord.id).set({ rating }, { merge: true });

  return {
    ok: true,
    tracking: sanitizePublicTrackingRecord({
      id: trackingRecord.id,
      ...currentData,
      rating,
    }),
  };
});

exports.submitContactInquiry = onCall(async (request) => {
  const data = request.data || {};
  const name = trimValue(data.name);
  const website = trimValue(data.website);
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

  if (website) {
    throw new HttpsError("invalid-argument", "La solicitud no es valida.");
  }

  assertMaxLength(name, 120, "El nombre es demasiado largo.");
  assertMaxLength(company, 120, "La empresa es demasiado larga.");
  assertMaxLength(phone, 40, "El telefono es demasiado largo.");
  assertMaxLength(interest, 80, "El motivo es demasiado largo.");
  assertMaxLength(sourcePage, 80, "La pagina de origen no es valida.");
  assertMaxLength(referrer, 600, "La referencia es demasiado larga.");

  if (!isValidEmail(email)) {
    throw new HttpsError("invalid-argument", "El correo es invalido.");
  }

  if (!message || message.length < 5) {
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
  const requestedPublicId = trimValue(data.orderPublicId)
    ? assertValidPublicTrackingLookupId(data.orderPublicId)
    : null;

  if (!token || !orderId || !requestedPublicId) {
    throw new HttpsError("invalid-argument", "Faltan el token push o el pedido a notificar.");
  }

  const orderSnapshot = await firestore.collection("orders").doc(orderId).get();
  if (!orderSnapshot.exists) {
    throw new HttpsError("not-found", "No se ha encontrado el pedido para registrar la notificacion.");
  }

  const order = orderSnapshot.data() || {};
  const securePublicId = normalizePublicTrackingLookupId(order.publicTrackingToken);
  if (securePublicId) {
    if (requestedPublicId !== securePublicId) {
      throw new HttpsError("invalid-argument", "El identificador publico del pedido no coincide con el pedido indicado.");
    }
  } else {
    const expectedLegacyIds = new Set(
      [
        normalizePublicTrackingLookupId(order.sourceOrderId),
        normalizePublicTrackingLookupId(orderId),
      ].filter(Boolean),
    );

    if (!expectedLegacyIds.has(requestedPublicId)) {
      throw new HttpsError("invalid-argument", "El identificador publico del pedido no coincide con el pedido indicado.");
    }
  }

  const orderPublicId = securePublicId || requestedPublicId;
  const orderNumber = trimValue(data.orderNumber) || trimValue(order.orderNumber) || orderPublicId;
  const clientPath = buildClientPath(orderPublicId);
  const subscriptionId = hashToken(token);
  const nowIso = new Date().toISOString();

  await firestore.collection(CLIENT_PUSH_SUBSCRIPTIONS_COLLECTION).doc(subscriptionId).set({
    token,
    orderId,
    orderPublicId,
    orderNumber,
    clientPath,
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
    .map((subscription) => {
      const orderPublicId =
        trimValue(subscription.orderPublicId) ||
        normalizePublicTrackingLookupId(after.publicTrackingToken) ||
        normalizePublicTrackingLookupId(after.sourceOrderId) ||
        event.params.orderId;
      const clientPath = trimValue(subscription.clientPath) || buildClientPath(orderPublicId);

      return {
        token: subscription.token,
        data: {
          title: "Tu pedido ya está listo para recoger",
          body,
          orderId: event.params.orderId,
          orderPublicId,
          link: clientPath,
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
        },
      };
    });

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

exports.syncRestaurantAiModelSummary = onDocumentWritten("orders/{orderId}", async (event) => {
  const before = event.data?.before?.data() || null;
  const after = event.data?.after?.data() || null;
  const restaurantId = trimValue(after?.restaurantId || before?.restaurantId);

  if (!restaurantId) {
    return null;
  }

  const meaningfulChange =
    JSON.stringify(before?.predictionTrainingRecord || null) !== JSON.stringify(after?.predictionTrainingRecord || null) ||
    JSON.stringify(before?.statusDurations || null) !== JSON.stringify(after?.statusDurations || null) ||
    before?.status !== after?.status ||
    before?.archivedAt !== after?.archivedAt;

  if (!meaningfulChange) {
    return null;
  }

  const summary = await syncRestaurantAiModelSummary(restaurantId);
  return {
    restaurantId,
    sampleCount: summary?.sampleCount || 0,
    confidenceLabel: summary?.confidenceLabel || "Aprendiendo",
  };
});
