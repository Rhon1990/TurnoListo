const admin = require("firebase-admin");
const { HttpsError, onCall } = require("firebase-functions/https");

admin.initializeApp();

const firestore = admin.firestore();
const auth = admin.auth();

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function trimValue(value) {
  return String(value || "").trim();
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
  const planName = trimValue(data.planName) || "Mensual";
  const notes = trimValue(data.notes);
  const activationDays = Math.max(1, Number.parseInt(String(data.activationDays || "30"), 10) || 30);

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
    planName,
    notes,
    activatedAt,
    activatedUntil,
    username,
    password,
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

  return {
    restaurant,
    authUser: {
      uid: userRecord.uid,
      email: userRecord.email,
    },
  };
});
