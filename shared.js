const STORAGE_KEY = "turnolisto-orders-v6";
const RESTAURANT_STORAGE_KEY = "turnolisto-restaurants-v1";
const TRACKING_STORAGE_KEY = "turnolisto-tracking-v1";
const RESTAURANT_SESSION_KEY = "turnolisto-restaurant-session-v1";
const SYNC_CHANNEL_NAME = "turnolisto-sync";
const SYNC_EVENT_NAME = "turnolisto:orders-changed";
const DEFAULT_RESTAURANT_ID = "rest-demo";
const FIREBASE_ORDERS_COLLECTION = "orders";
const FIREBASE_RESTAURANTS_COLLECTION = "restaurants";
const FIREBASE_TRACKING_COLLECTION = "tracking";
const FIREBASE_USERS_COLLECTION = "users";

const ORDER_STATUSES = ["received", "preparing", "ready", "delivered", "cancelled"];
const QUEUE_ACTIVE_STATUSES = ["received", "preparing"];

const defaultOrders = createDefaultOrders();
const defaultRestaurants = createDefaultRestaurants();
let cachedOrders = [];
let cachedRestaurants = [];
let cachedTracking = [];
let firebaseBackend = null;
let dataBackendMode = "local";
let ordersUnsubscribe = null;
let restaurantsUnsubscribe = null;
let trackingUnsubscribe = null;
let currentUserProfile = null;

const statusMeta = {
  received: { label: "Recibido", color: "#ec7c0d", bg: "rgba(236, 124, 13, 0.12)", progress: 18 },
  preparing: { label: "En preparación", color: "#ec7c0d", bg: "rgba(236, 124, 13, 0.18)", progress: 58 },
  ready: { label: "Listo para recoger", color: "#1f7a63", bg: "rgba(31, 122, 99, 0.14)", progress: 100 },
  delivered: { label: "Entregado", color: "#0c5b75", bg: "rgba(12, 91, 117, 0.12)", progress: 100 },
  cancelled: { label: "Cancelado", color: "#7f1d1d", bg: "rgba(127, 29, 29, 0.12)", progress: 100 },
};

const PUBLIC_TRACKING_TOKEN_PREFIX = "TL";
const PUBLIC_TRACKING_TOKEN_LENGTH = 12;
const dataReadyPromise = initializeDataStore();

initializeTurnoAlerts();

function readOrdersFromLocalStorage() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return normalizeOrders(defaultOrders);
  }

  try {
    return normalizeOrders(JSON.parse(stored));
  } catch {
    return normalizeOrders(defaultOrders);
  }
}

function readRestaurantsFromLocalStorage() {
  const stored = window.localStorage.getItem(RESTAURANT_STORAGE_KEY);
  if (!stored) {
    return normalizeRestaurants(defaultRestaurants);
  }

  try {
    return normalizeRestaurants(JSON.parse(stored));
  } catch {
    return normalizeRestaurants(defaultRestaurants);
  }
}

function readTrackingFromLocalStorage() {
  const stored = window.localStorage.getItem(TRACKING_STORAGE_KEY);
  if (!stored) {
    return normalizePublicTracking(defaultOrders.map((order) => buildPublicTrackingRecord(order)));
  }

  try {
    return normalizePublicTracking(JSON.parse(stored));
  } catch {
    return normalizePublicTracking(defaultOrders.map((order) => buildPublicTrackingRecord(order)));
  }
}

function loadOrders() {
  const trackingLookup = buildTrackingLookup(cachedTracking);
  return normalizeOrders(cachedOrders).map((order) => ({
    ...order,
    rating: trackingLookup.get(getTrackingLookupKey(order))?.rating || order.rating || null,
  }));
}

function loadRestaurants() {
  return normalizeRestaurants(cachedRestaurants);
}

function loadPublicOrders() {
  return normalizePublicTracking(cachedTracking);
}

function persistOrdersToLocalStorage(orders) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function persistRestaurantsToLocalStorage(restaurants) {
  window.localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(restaurants));
}

function persistTrackingToLocalStorage(tracking) {
  window.localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(tracking));
}

function applyOrdersSnapshot(orders) {
  cachedOrders = normalizeOrders(orders);
  persistOrdersToLocalStorage(cachedOrders);
}

function applyRestaurantsSnapshot(restaurants) {
  cachedRestaurants = normalizeRestaurants(restaurants);
  persistRestaurantsToLocalStorage(cachedRestaurants);
}

function applyTrackingSnapshot(tracking) {
  cachedTracking = normalizePublicTracking(tracking);
  persistTrackingToLocalStorage(cachedTracking);
}

async function initializeDataStore() {
  applyOrdersSnapshot(readOrdersFromLocalStorage());
  applyRestaurantsSnapshot(readRestaurantsFromLocalStorage());
  applyTrackingSnapshot(readTrackingFromLocalStorage());

  await connectPublicTrackingToFirebase();
  await connectPrivateDataStoreToFirebase();
  broadcastOrdersChanged();
  return { mode: dataBackendMode };
}

function disconnectPrivateFirebaseSubscriptions() {
  ordersUnsubscribe?.();
  restaurantsUnsubscribe?.();
  ordersUnsubscribe = null;
  restaurantsUnsubscribe = null;
}

function preparePrivateFirebaseSignOut() {
  disconnectPrivateFirebaseSubscriptions();
  clearCurrentUserProfile();
  updateDataBackendMode();
}

function disconnectPublicFirebaseSubscriptions() {
  trackingUnsubscribe?.();
  trackingUnsubscribe = null;
}

function updateDataBackendMode() {
  if (!firebaseBackend?.enabled) {
    dataBackendMode = "local";
  } else if (firebaseBackend.isAuthenticated()) {
    dataBackendMode = "firebase-private";
  } else {
    dataBackendMode = "firebase-public";
  }

  window.__turnoDataBackendMode = dataBackendMode;
}

function getRequiredPrivateRole() {
  return String(window.TURNO_LISTO_PRIVATE_ROLE || "").trim();
}

function getPrivateCollectionFilters(collectionName, profile = currentUserProfile) {
  if (!profile?.role || profile.role === "admin") {
    return [];
  }

  if (profile.role === "restaurant") {
    if (collectionName === FIREBASE_ORDERS_COLLECTION) {
      return profile.restaurantId ? [{ field: "restaurantId", value: profile.restaurantId }] : [];
    }

    if (collectionName === FIREBASE_RESTAURANTS_COLLECTION) {
      return profile.restaurantId ? [{ field: "id", value: profile.restaurantId }] : [];
    }
  }

  return [];
}

async function connectPublicTrackingToFirebase() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled) {
    disconnectPublicFirebaseSubscriptions();
    firebaseBackend = null;
    updateDataBackendMode();
    return { mode: dataBackendMode };
  }

  firebaseBackend = backend;
  updateDataBackendMode();

  try {
    const remoteTracking = await backend.loadCollection(FIREBASE_TRACKING_COLLECTION);

    applyTrackingSnapshot(remoteTracking);

    disconnectPublicFirebaseSubscriptions();
    trackingUnsubscribe = backend.subscribeCollection(FIREBASE_TRACKING_COLLECTION, (tracking) => {
      applyTrackingSnapshot(tracking.length ? tracking : []);
      broadcastOrdersChanged();
    });
  } catch (error) {
    console.error("No se pudo inicializar el tracking publico desde Firebase.", error);
    notifyFirebaseError(error, "No se pudo cargar el seguimiento publico.");
    disconnectPublicFirebaseSubscriptions();
  }

  return { mode: dataBackendMode };
}

async function connectPrivateDataStoreToFirebase() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled) {
    disconnectPrivateFirebaseSubscriptions();
    firebaseBackend = null;
    updateDataBackendMode();
    console.warn("TurnoListo funcionando en localStorage.", {
      reason: backend?.reason || "firebase-disabled",
      origin: window.location.origin,
      protocol: window.location.protocol,
    });
    return { mode: dataBackendMode };
  }

  if (!backend.isAuthenticated()) {
    disconnectPrivateFirebaseSubscriptions();
    firebaseBackend = backend;
    currentUserProfile = null;
    updateDataBackendMode();
    console.info("Firebase disponible, pendiente de autenticacion para acceder a Firestore.");
    return { mode: dataBackendMode, reason: "auth-required" };
  }

  firebaseBackend = backend;
  updateDataBackendMode();
  console.info("TurnoListo conectado a Firebase.");

  try {
    const user = firebaseBackend.getCurrentUser?.();
    const requiredRole = getRequiredPrivateRole();

    if (user?.uid) {
      currentUserProfile = await firebaseBackend.getDocument(FIREBASE_USERS_COLLECTION, user.uid);
    } else {
      currentUserProfile = null;
    }

    if (requiredRole && currentUserProfile?.role !== requiredRole) {
      disconnectPrivateFirebaseSubscriptions();
      console.info("Sesion autenticada sin acceso privado para esta vista.", {
        requiredRole,
        currentRole: currentUserProfile?.role || null,
      });
      return { mode: dataBackendMode, reason: "role-mismatch", requiredRole, currentRole: currentUserProfile?.role || null };
    }

    const [remoteOrders, remoteRestaurants] = await Promise.all([
      firebaseBackend.loadCollection(FIREBASE_ORDERS_COLLECTION, {
        filters: getPrivateCollectionFilters(FIREBASE_ORDERS_COLLECTION, currentUserProfile),
      }),
      firebaseBackend.loadCollection(FIREBASE_RESTAURANTS_COLLECTION, {
        filters: getPrivateCollectionFilters(FIREBASE_RESTAURANTS_COLLECTION, currentUserProfile),
      }),
    ]);

    applyOrdersSnapshot(remoteOrders);

    applyRestaurantsSnapshot(remoteRestaurants);
    repairMissingPublicTrackingTokens(loadOrders());
    repairPublicTrackingRecordsFromOrders(loadOrders());

    disconnectPrivateFirebaseSubscriptions();

    ordersUnsubscribe = firebaseBackend.subscribeCollection(
      FIREBASE_ORDERS_COLLECTION,
      (orders) => {
        applyOrdersSnapshot(orders.length ? orders : []);
        broadcastOrdersChanged();
      },
      { filters: getPrivateCollectionFilters(FIREBASE_ORDERS_COLLECTION, currentUserProfile) },
    );

    restaurantsUnsubscribe = firebaseBackend.subscribeCollection(
      FIREBASE_RESTAURANTS_COLLECTION,
      (restaurants) => {
        applyRestaurantsSnapshot(restaurants.length ? restaurants : []);
        broadcastOrdersChanged();
      },
      { filters: getPrivateCollectionFilters(FIREBASE_RESTAURANTS_COLLECTION, currentUserProfile) },
    );
  } catch (error) {
    console.error("No se pudo inicializar Firebase. Se mantiene localStorage.", error);
    notifyFirebaseError(error, "No se pudo cargar la informacion privada de Firestore.");
    disconnectPrivateFirebaseSubscriptions();
    firebaseBackend = backend;
    updateDataBackendMode();
  }

  return { mode: dataBackendMode };
}

async function waitForFirebaseBackend() {
  const maxAttempts = 50;
  let attempt = 0;

  while (!window.__turnoFirebaseReadyPromise && attempt < maxAttempts) {
    attempt += 1;
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  if (!window.__turnoFirebaseReadyPromise) return { enabled: false, reason: "firebase-timeout" };

  try {
    return await window.__turnoFirebaseReadyPromise;
  } catch (error) {
    console.error("Error preparando Firebase.", error);
    return { enabled: false, error };
  }
}

function waitForDataReady() {
  return dataReadyPromise;
}

async function reconnectDataStoreToFirebase() {
  await connectPublicTrackingToFirebase();
  const result = await connectPrivateDataStoreToFirebase();
  broadcastOrdersChanged();
  return result;
}

async function reconnectPublicTrackingToFirebase() {
  const result = await connectPublicTrackingToFirebase();
  broadcastOrdersChanged();
  return result;
}

async function refreshOrdersFromBackend() {
  if (!firebaseBackend?.enabled) return { enabled: false, reason: "firebase-disabled" };

  try {
    const remoteOrders = await firebaseBackend.loadCollection(FIREBASE_ORDERS_COLLECTION, {
      filters: getPrivateCollectionFilters(FIREBASE_ORDERS_COLLECTION),
    });
    applyOrdersSnapshot(remoteOrders.length ? remoteOrders : []);
    broadcastOrdersChanged();
    return { enabled: true, refreshed: true };
  } catch (error) {
    console.error("No se pudieron refrescar los pedidos desde Firebase.", error);
    notifyFirebaseError(error, "No se pudieron refrescar los pedidos.");
    return { enabled: true, refreshed: false, error };
  }
}

async function refreshPublicTrackingFromBackend() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled) return { enabled: false, reason: "firebase-disabled" };

  try {
    const remoteTracking = await backend.loadCollection(FIREBASE_TRACKING_COLLECTION);
    applyTrackingSnapshot(remoteTracking.length ? remoteTracking : []);
    broadcastOrdersChanged();
    return { enabled: true, refreshed: true };
  } catch (error) {
    console.error("No se pudo refrescar el tracking publico desde Firebase.", error);
    notifyFirebaseError(error, "No se pudo refrescar el seguimiento publico.");
    return { enabled: true, refreshed: false, error };
  }
}

function syncRestaurantsToBackend() {
  if (!firebaseBackend?.enabled) return;
}

function persistOrderDocument(order, previousOrderId = "") {
  if (!firebaseBackend?.enabled || typeof firebaseBackend.setDocument !== "function") return;

  const nextOrderId = String(order?.id || "").trim();
  if (!nextOrderId) return;

  firebaseBackend.setDocument(FIREBASE_ORDERS_COLLECTION, nextOrderId, order).catch((error) => {
    console.error("No se pudo guardar el pedido en Firebase.", error);
    notifyFirebaseError(error, "No se pudo guardar el pedido en Firebase.");
  });

  if (previousOrderId && previousOrderId !== nextOrderId && typeof firebaseBackend.deleteDocument === "function") {
    firebaseBackend.deleteDocument(FIREBASE_ORDERS_COLLECTION, previousOrderId).catch((error) => {
      console.error("No se pudo limpiar el pedido anterior en Firebase.", error);
      notifyFirebaseError(error, "No se pudo actualizar el identificador del pedido.");
    });
  }
}

function persistTrackingDocumentForOrder(order, previousOrderId = "") {
  if (!firebaseBackend?.enabled || typeof firebaseBackend.setDocument !== "function") return;

  const nextTrackingRecord = buildPublicTrackingRecord(order);
  firebaseBackend.setDocument(FIREBASE_TRACKING_COLLECTION, nextTrackingRecord.id, nextTrackingRecord).catch((error) => {
    console.error("No se pudo guardar el seguimiento publico del pedido.", error);
    notifyFirebaseError(error, "No se pudo guardar el seguimiento publico.");
  });

  if (previousOrderId && previousOrderId !== nextTrackingRecord.id && typeof firebaseBackend.deleteDocument === "function") {
    firebaseBackend.deleteDocument(FIREBASE_TRACKING_COLLECTION, previousOrderId).catch((error) => {
      console.error("No se pudo limpiar el seguimiento anterior del pedido.", error);
      notifyFirebaseError(error, "No se pudo actualizar el seguimiento publico.");
    });
  }
}

function deleteOrderDocumentsForRestaurant(orders) {
  if (!firebaseBackend?.enabled || typeof firebaseBackend.deleteDocument !== "function") return;

  orders
    .forEach((order) => {
      firebaseBackend.deleteDocument(FIREBASE_ORDERS_COLLECTION, order.id).catch((error) => {
        console.error("No se pudo eliminar un pedido del restaurante en Firebase.", error);
        notifyFirebaseError(error, "No se pudo eliminar uno de los pedidos del restaurante.");
      });

      firebaseBackend.deleteDocument(FIREBASE_TRACKING_COLLECTION, order.id).catch((error) => {
        console.error("No se pudo eliminar el tracking publico del pedido.", error);
        notifyFirebaseError(error, "No se pudo eliminar el seguimiento publico del restaurante.");
      });
    });
}

function generatePublicTrackingToken(length = PUBLIC_TRACKING_TOKEN_LENGTH) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = [];

  if (window.crypto?.getRandomValues) {
    const buffer = new Uint32Array(length);
    window.crypto.getRandomValues(buffer);
    buffer.forEach((value) => {
      values.push(alphabet[value % alphabet.length]);
    });
  } else {
    while (values.length < length) {
      values.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
  }

  return `${PUBLIC_TRACKING_TOKEN_PREFIX}-${values.join("")}`;
}

function normalizePublicTrackingToken(value) {
  return String(value || "").trim().toUpperCase();
}

function getOrderPublicTrackingToken(order) {
  const explicitToken = normalizePublicTrackingToken(order?.publicTrackingToken);
  if (explicitToken) return explicitToken;

  const legacySourceId = normalizeSourceOrderId(order?.sourceOrderId);
  if (legacySourceId) return legacySourceId;

  return normalizeSourceOrderId(order?.id);
}

function repairMissingPublicTrackingTokens(orders) {
  orders
    .filter((order) => !normalizePublicTrackingToken(order.publicTrackingToken))
    .forEach((order) => {
      persistOrderDocument(order);
      persistTrackingDocumentForOrder(order);
    });
}

function saveRestaurants(restaurants) {
  applyRestaurantsSnapshot(restaurants);
  syncRestaurantsToBackend();
  broadcastOrdersChanged();
}

function createDefaultRestaurants() {
  const activatedUntil = new Date(Date.now() + 30 * 24 * 60 * 60000).toISOString();

  return [
    {
      id: DEFAULT_RESTAURANT_ID,
      name: "Restaurante Demo",
      ownerName: "Laura Gómez",
      email: "demo@turnolisto.com",
      phone: "+34 600 123 456",
      city: "Madrid",
      address: "Calle Mayor 18",
      planName: "Mensual",
      notes: "Cuenta demo para pruebas comerciales",
      activatedAt: new Date().toISOString(),
      activatedUntil,
      username: "demo@turnolisto.com",
      createdAt: new Date().toISOString(),
    },
  ];
}

function normalizeRestaurants(restaurants) {
  return [...restaurants]
    .map((restaurant) => ({
      ownerName: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      logoUrl: "",
      planName: "Mensual",
      notes: "",
      activatedAt: restaurant?.createdAt || new Date().toISOString(),
      activatedUntil: new Date(Date.now() + 30 * 24 * 60 * 60000).toISOString(),
      ...restaurant,
    }))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

function getCurrentRestaurantSession() {
  const stored = window.localStorage.getItem(RESTAURANT_SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function setCurrentRestaurantSession(restaurant) {
  const session = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    username: restaurant.username,
    activatedUntil: restaurant.activatedUntil,
  };

  window.localStorage.setItem(RESTAURANT_SESSION_KEY, JSON.stringify(session));
  broadcastOrdersChanged();
  return session;
}

function clearCurrentRestaurantSession() {
  window.localStorage.removeItem(RESTAURANT_SESSION_KEY);
  broadcastOrdersChanged();
}

function getRestaurantById(restaurantId) {
  return loadRestaurants().find((restaurant) => restaurant.id === restaurantId) || null;
}

function isRestaurantAccessActive(restaurant) {
  if (!restaurant?.activatedUntil) return true;
  return new Date(restaurant.activatedUntil).getTime() >= Date.now();
}

function getRestaurantAccessStatus(restaurant) {
  return isRestaurantAccessActive(restaurant) ? "active" : "expired";
}

function getRestaurantRemainingDays(restaurant) {
  if (!restaurant?.activatedUntil) return null;
  const diff = new Date(restaurant.activatedUntil).getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

function extendRestaurantActivation(restaurantId, daysToAdd) {
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return null;

  const normalizedDays = Math.max(1, Number.parseInt(String(daysToAdd || "30"), 10) || 30);
  const currentUntil = restaurant.activatedUntil ? new Date(restaurant.activatedUntil).getTime() : Date.now();
  const baseTime = Math.max(currentUntil, Date.now());
  const nextActivatedUntil = new Date(baseTime + normalizedDays * 24 * 60 * 60 * 1000).toISOString();

  return updateRestaurantAccount(restaurantId, {
    activatedUntil: nextActivatedUntil,
  });
}

function normalizeRestaurantUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function restaurantUsernameExists(username) {
  const normalized = normalizeRestaurantUsername(username);
  if (!normalized) return false;
  return loadRestaurants().some((restaurant) => normalizeRestaurantUsername(restaurant.username) === normalized);
}

function createRestaurantAccount(accountData) {
  const restaurants = loadRestaurants();
  const activationDays = Math.max(1, Number.parseInt(String(accountData.activationDays || "30"), 10) || 30);
  const activatedAt = new Date().toISOString();
  const activatedUntil = new Date(Date.now() + activationDays * 24 * 60 * 60000).toISOString();
  const restaurantId = `rest-${Date.now()}`;
  const username = normalizeRestaurantUsername(accountData.email);
  if (!username) {
    throw new Error("missing-restaurant-username");
  }

  if (restaurantUsernameExists(username)) {
    throw new Error("duplicate-restaurant-username");
  }

  const restaurant = {
    id: restaurantId,
    name: String(accountData.name || "").trim() || "Nuevo restaurante",
    ownerName: String(accountData.ownerName || "").trim(),
    email: String(accountData.email || "").trim(),
    phone: String(accountData.phone || "").trim(),
    city: String(accountData.city || "").trim(),
    address: String(accountData.address || "").trim(),
    logoUrl: String(accountData.logoUrl || "").trim(),
    planName: String(accountData.planName || "").trim() || "Mensual",
    notes: String(accountData.notes || "").trim(),
    activatedAt,
    activatedUntil,
    username,
    createdAt: new Date().toISOString(),
  };

  saveRestaurants([...restaurants, restaurant]);
  return restaurant;
}

function updateRestaurantAccount(restaurantId, updates) {
  const currentRestaurant = getRestaurantById(restaurantId);
  if (!currentRestaurant) return null;

  const nextRestaurant = {
    ...currentRestaurant,
    ...updates,
    logoUrl: Object.prototype.hasOwnProperty.call(updates || {}, "logoUrl")
      ? String(updates.logoUrl || "").trim()
      : String(currentRestaurant.logoUrl || "").trim(),
  };

  const nextRestaurants = loadRestaurants().map((restaurant) => (restaurant.id === restaurantId ? nextRestaurant : restaurant));
  saveRestaurants(nextRestaurants);
  const restaurantOrders = loadOrders().filter((order) => order.restaurantId === restaurantId);
  applyTrackingSnapshot(normalizePublicTracking(loadOrders().map((order) => buildPublicTrackingRecord(order))));
  restaurantOrders.forEach((order) => {
    persistTrackingDocumentForOrder(order);
  });

  if (firebaseBackend?.enabled) {
    firebaseBackend
      .setDocument(FIREBASE_RESTAURANTS_COLLECTION, restaurantId, nextRestaurant)
      .catch((error) => {
        console.error("No se pudo actualizar el restaurante en Firebase.", error);
        notifyFirebaseError(error, "No se pudo actualizar la informacion del restaurante.");
      });
  }

  return nextRestaurant;
}

function deleteRestaurantAccount(restaurantId) {
  const nextRestaurants = loadRestaurants().filter((restaurant) => restaurant.id !== restaurantId);
  const removedOrders = loadOrders().filter((order) => order.restaurantId === restaurantId);
  const nextOrders = loadOrders().filter((order) => order.restaurantId !== restaurantId);
  const currentSession = getCurrentRestaurantSession();

  applyOrdersSnapshot(nextOrders);
  applyRestaurantsSnapshot(nextRestaurants);
  applyTrackingSnapshot(normalizePublicTracking(nextOrders.map((order) => buildPublicTrackingRecord(order))));
  deleteOrderDocumentsForRestaurant(removedOrders);
  if (firebaseBackend?.enabled && typeof firebaseBackend.deleteDocument === "function") {
    firebaseBackend.deleteDocument(FIREBASE_RESTAURANTS_COLLECTION, restaurantId).catch((error) => {
      console.error("No se pudo eliminar el restaurante en Firebase.", error);
      notifyFirebaseError(error, "No se pudo eliminar el restaurante en Firebase.");
    });
  }

  if (currentSession?.restaurantId === restaurantId) {
    clearCurrentRestaurantSession();
    return;
  }

  broadcastOrdersChanged();
}

function buildOrderTrackingId(restaurantId, sourceOrderId) {
  return normalizeSourceOrderId(sourceOrderId);
}

async function loadCurrentUserProfileFromBackend() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.getDocument !== "function") {
    currentUserProfile = null;
    return null;
  }

  const user = backend.getCurrentUser?.();
  if (!user?.uid) {
    currentUserProfile = null;
    return null;
  }

  currentUserProfile = await backend.getDocument(FIREBASE_USERS_COLLECTION, user.uid);
  return currentUserProfile;
}

function getCurrentUserProfile() {
  return currentUserProfile;
}

function clearCurrentUserProfile() {
  currentUserProfile = null;
}

function createDefaultOrders() {
  const now = Date.now();

  return [
    {
      restaurantId: DEFAULT_RESTAURANT_ID,
      id: buildOrderTrackingId(DEFAULT_RESTAURANT_ID, "POS-801"),
      orderNumber: "#2048",
      sourceOrderId: "POS-801",
      sourceSystem: "TPV mostrador",
      customerName: "Ana",
      items: "Burger doble + patatas",
      pickupPoint: "Mostrador 2",
      estimatedReadyMinutes: 12,
      promisedReadyAt: new Date(now + 6 * 60000).toISOString(),
      status: "received",
      notes: "Sin cebolla",
      rating: null,
      publicTrackingToken: "TL-ANA2048Q2Z9",
      createdAt: new Date(now - 6 * 60000).toISOString(),
      archivedAt: null,
    },
    {
      restaurantId: DEFAULT_RESTAURANT_ID,
      id: buildOrderTrackingId(DEFAULT_RESTAURANT_ID, "POS-802"),
      orderNumber: "#2049",
      sourceOrderId: "POS-802",
      sourceSystem: "Glovo manual",
      customerName: "Luis",
      items: "Poke salmon",
      pickupPoint: "Mostrador 1",
      estimatedReadyMinutes: 20,
      promisedReadyAt: new Date(now + 2 * 60000).toISOString(),
      status: "preparing",
      notes: "",
      rating: null,
      publicTrackingToken: "TL-LUIS2049R7MX",
      createdAt: new Date(now - 18 * 60000).toISOString(),
      archivedAt: null,
    },
    {
      restaurantId: DEFAULT_RESTAURANT_ID,
      id: buildOrderTrackingId(DEFAULT_RESTAURANT_ID, "POS-803"),
      orderNumber: "#2050",
      sourceOrderId: "POS-803",
      sourceSystem: "TPV mostrador",
      customerName: "Marta",
      items: "Pizza trufa",
      pickupPoint: "Pickup express",
      estimatedReadyMinutes: 25,
      promisedReadyAt: new Date(now - 7 * 60000).toISOString(),
      status: "ready",
      notes: "Avisar cuando llegue",
      rating: null,
      publicTrackingToken: "TL-MARTA2050K4P",
      createdAt: new Date(now - 32 * 60000).toISOString(),
      archivedAt: null,
    },
    {
      restaurantId: DEFAULT_RESTAURANT_ID,
      id: buildOrderTrackingId(DEFAULT_RESTAURANT_ID, "POS-799"),
      orderNumber: "#2051",
      sourceOrderId: "POS-799",
      sourceSystem: "Uber Eats manual",
      customerName: "Pablo",
      items: "Menu veggie",
      pickupPoint: "Mostrador 3",
      estimatedReadyMinutes: 18,
      promisedReadyAt: new Date(now - 22 * 60000).toISOString(),
      status: "delivered",
      notes: "",
      rating: {
        score: 5,
        comment: "",
        createdAt: new Date(now - 8 * 60000).toISOString(),
      },
      publicTrackingToken: "TL-PABLO2051N8W",
      createdAt: new Date(now - 40 * 60000).toISOString(),
      archivedAt: new Date(now - 3 * 60000).toISOString(),
    },
  ];
}

function saveOrders(orders) {
  applyOrdersSnapshot(orders);
  applyTrackingSnapshot(normalizePublicTracking(orders.map((order) => buildPublicTrackingRecord(order))));
  broadcastOrdersChanged();
}

function normalizeOrders(orders) {
  return [...orders]
    .map((order) => ({
      restaurantId: DEFAULT_RESTAURANT_ID,
      sourceOrderId: "",
      sourceSystem: "Alta manual",
      pickupPoint: "Mostrador 1",
      estimatedReadyMinutes: 15,
      promisedReadyAt: order?.createdAt || new Date().toISOString(),
      notes: "",
      rating: null,
      publicTrackingToken: generatePublicTrackingToken(),
      archivedAt: null,
      statusDurations: {},
      statusStartedAt: order?.createdAt || new Date().toISOString(),
      timelineEvents: [],
      lifecycleMilestones: {
        createdAt: order?.createdAt || new Date().toISOString(),
        receivedAt: order?.createdAt || new Date().toISOString(),
        preparingAt: null,
        readyAt: null,
        deliveredAt: null,
        cancelledAt: null,
        archivedAt: order?.archivedAt || null,
      },
      aiTrainingSnapshot: null,
      predictionTrainingRecord: null,
      ...order,
      id:
        order.id ||
        buildOrderTrackingId(order.restaurantId || DEFAULT_RESTAURANT_ID, order.sourceOrderId || order.orderNumber || ""),
    }))
    .map((order) => ({
      ...order,
      lifecycleMilestones: buildLifecycleMilestones(
        order,
        { status: order.status, archivedAt: order.archivedAt },
        order.statusStartedAt || order.createdAt,
      ),
      predictionTrainingRecord: order.predictionTrainingRecord || buildPredictionTrainingRecord(order),
    }))
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
}

function getOrderById(id) {
  return loadOrders().find((order) => order.id === id);
}

function getOrderByPublicId(value) {
  const normalized = normalizePublicTrackingToken(value);
  if (!normalized) return null;

  return (
    loadOrders().find(
      (order) =>
        getOrderPublicTrackingToken(order) === normalized ||
        normalizeSourceOrderId(order.sourceOrderId) === normalized ||
        normalizeSourceOrderId(order.id) === normalized,
    ) || null
  );
}

function getPublicOrderById(id) {
  return loadPublicOrders().find((order) => {
    if (order.id !== id) return false;
    if (!order.archivedAt) return true;
    return order.status === "delivered";
  });
}

function getPublicOrderByPublicId(value) {
  const normalized = normalizePublicTrackingToken(value);
  if (!normalized) return null;

  return (
    loadPublicOrders().find((order) => {
      const matchesToken = normalizePublicTrackingToken(order.publicTrackingToken) === normalized;
      const matchesPublicId = normalizeSourceOrderId(order.sourceOrderId) === normalized;
      const matchesLegacyId = normalizeSourceOrderId(order.id) === normalized;
      if (!matchesToken && !matchesPublicId && !matchesLegacyId) return false;
      if (!order.archivedAt) return true;
      return order.status === "delivered";
    }) || null
  );
}

function normalizeSourceOrderId(value) {
  return String(value || "").trim().toUpperCase();
}

function sourceOrderIdExists(sourceOrderId, excludedOrderId = null) {
  const normalized = normalizeSourceOrderId(sourceOrderId);
  if (!normalized) return false;

  return loadOrders().some((order) => {
    if (excludedOrderId && order.id === excludedOrderId) return false;
    return normalizeSourceOrderId(order.sourceOrderId) === normalized;
  });
}

function buildPromisedReadyAt(createdAt, estimatedReadyMinutes) {
  const parsedMinutes = Number.parseInt(String(estimatedReadyMinutes || ""), 10);
  if (!Number.isFinite(parsedMinutes) || parsedMinutes <= 0) {
    return "";
  }

  const normalizedMinutes = Math.max(1, parsedMinutes);
  const baseDate = new Date(createdAt || new Date().toISOString());
  return new Date(baseDate.getTime() + normalizedMinutes * 60000).toISOString();
}

function getRemainingEstimatedMinutes(order) {
  const promisedReadyAt = String(order?.promisedReadyAt || "").trim();
  if (!promisedReadyAt) return null;
  return Math.ceil((new Date(promisedReadyAt).getTime() - Date.now()) / 60000);
}

function buildAiTrainingSnapshot(order, allOrders = loadOrders(), eventTime = new Date().toISOString()) {
  const restaurantId = String(order?.restaurantId || DEFAULT_RESTAURANT_ID);
  const eventDate = new Date(eventTime || new Date().toISOString());
  const activeOrders = allOrders.filter(
    (item) => String(item?.restaurantId || DEFAULT_RESTAURANT_ID) === restaurantId && !item?.archivedAt,
  );
  const preparingOrders = activeOrders.filter((item) => item.status === "preparing").length;
  const readyOrders = activeOrders.filter((item) => item.status === "ready").length;
  const overdueOrders = activeOrders.filter((item) => {
    const remaining = getRemainingEstimatedMinutes(item);
    return remaining !== null ? remaining <= 0 : getOrderDurationMinutes(item) >= 16;
  }).length;

  return {
    capturedAt: eventDate.toISOString(),
    restaurantId,
    activeOrders: activeOrders.length,
    preparingOrders,
    readyOrders,
    overdueOrders,
    hourOfDay: eventDate.getHours(),
    dayOfWeek: eventDate.getDay(),
    peakLoadScore: getPeakDemandLoad(eventDate),
    estimatedReadyMinutes: Number(order?.estimatedReadyMinutes || 0) || null,
    currentStatus: String(order?.status || ""),
  };
}

function appendOrderTimelineEvent(order, event) {
  const timeline = Array.isArray(order?.timelineEvents) ? [...order.timelineEvents] : [];
  timeline.push(event);
  return timeline.sort((left, right) => new Date(left.at) - new Date(right.at));
}

function buildLifecycleMilestones(order, updates = {}, eventTime = new Date().toISOString()) {
  const nextMilestones = {
    createdAt: order?.lifecycleMilestones?.createdAt || order?.createdAt || eventTime,
    receivedAt: order?.lifecycleMilestones?.receivedAt || order?.createdAt || eventTime,
    preparingAt: order?.lifecycleMilestones?.preparingAt || null,
    readyAt: order?.lifecycleMilestones?.readyAt || null,
    deliveredAt: order?.lifecycleMilestones?.deliveredAt || null,
    cancelledAt: order?.lifecycleMilestones?.cancelledAt || null,
    archivedAt: order?.lifecycleMilestones?.archivedAt || null,
  };

  const nextStatus = String(updates.status || order?.status || "");
  if (nextStatus === "preparing" && !nextMilestones.preparingAt) nextMilestones.preparingAt = eventTime;
  if (nextStatus === "ready" && !nextMilestones.readyAt) nextMilestones.readyAt = eventTime;
  if (nextStatus === "delivered") {
    nextMilestones.deliveredAt = eventTime;
    if (!nextMilestones.readyAt) nextMilestones.readyAt = eventTime;
  }
  if (nextStatus === "cancelled") {
    nextMilestones.cancelledAt = eventTime;
  }

  const nextArchivedAt = updates.archivedAt ?? order?.archivedAt ?? null;
  if (nextArchivedAt) nextMilestones.archivedAt = nextArchivedAt;

  return nextMilestones;
}

function buildPredictionTrainingRecord(order) {
  const milestones = order?.lifecycleMilestones || {};
  const createdAt = order?.createdAt || milestones.createdAt || null;
  const toMinutes = (from, to) => {
    if (!from || !to) return null;
    return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000));
  };

  return {
    createdAt,
    readyAt: milestones.readyAt || null,
    deliveredAt: milestones.deliveredAt || null,
    cancelledAt: milestones.cancelledAt || null,
    minutesToReady: toMinutes(createdAt, milestones.readyAt),
    minutesToDelivered: toMinutes(createdAt, milestones.deliveredAt),
    finalStatus: order?.status || "",
    estimatedReadyMinutes: Number(order?.estimatedReadyMinutes || 0) || null,
  };
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getPeakDemandLoad(dateLike = new Date()) {
  const hour = new Date(dateLike).getHours();
  if ([12, 13, 14, 20, 21].includes(hour)) return 2;
  if ([11, 15, 19, 22].includes(hour)) return 1;
  return 0;
}

function enrichOrdersWithIntelligence(orders, options = {}) {
  const safeOrders = Array.isArray(orders) ? [...orders] : [];
  const allOrders = Array.isArray(options.allOrders) ? options.allOrders : loadOrders();
  const groupedByRestaurant = safeOrders.reduce((accumulator, order) => {
    const restaurantId = String(order?.restaurantId || DEFAULT_RESTAURANT_ID);
    if (!accumulator.has(restaurantId)) accumulator.set(restaurantId, []);
    accumulator.get(restaurantId).push(order);
    return accumulator;
  }, new Map());

  return safeOrders.map((order) => {
    const restaurantId = String(order?.restaurantId || DEFAULT_RESTAURANT_ID);
    const restaurantOrders = groupedByRestaurant.get(restaurantId) || [];
    const history = allOrders.filter((item) => String(item?.restaurantId || DEFAULT_RESTAURANT_ID) === restaurantId);
    const intelligence = buildOrderIntelligence(order, restaurantOrders, history);
    return {
      ...order,
      aiEtaMinutes: intelligence.aiEtaMinutes,
      aiRiskLevel: intelligence.aiRiskLevel,
      aiPriorityScore: intelligence.aiPriorityScore,
      aiReason: intelligence.aiReason,
      aiPressureScore: intelligence.aiPressureScore,
      aiPressureLabel: intelligence.aiPressureLabel,
      aiUpdatedAt: intelligence.aiUpdatedAt,
    };
  });
}

function buildOrderIntelligence(order, activeOrders = [], history = []) {
  const status = String(order?.status || "");
  const elapsedMinutes = getOrderDurationMinutes(order);
  const estimatedReadyMinutes = Number.parseInt(String(order?.estimatedReadyMinutes || ""), 10);
  const safeEstimatedReadyMinutes = Number.isFinite(estimatedReadyMinutes) && estimatedReadyMinutes > 0 ? estimatedReadyMinutes : null;
  const promisedRemainingMinutes = getRemainingEstimatedMinutes(order);
  const currentActiveOrders = activeOrders.filter((item) => !item?.archivedAt && !["delivered", "cancelled"].includes(item?.status));
  const preparingOrders = currentActiveOrders.filter((item) => item.status === "preparing").length;
  const overdueOrders = currentActiveOrders.filter((item) => {
    const remaining = getRemainingEstimatedMinutes(item);
    return remaining !== null ? remaining <= 0 : getOrderDurationMinutes(item) >= 16;
  }).length;
  const deliveredHistory = history.filter((item) => item?.status === "delivered");
  const historicalDelayMinutes = deliveredHistory.length
    ? Math.round(
        deliveredHistory.reduce((total, item) => {
          const estimatedMinutes = Number.parseInt(String(item?.estimatedReadyMinutes || ""), 10);
          if (!Number.isFinite(estimatedMinutes) || estimatedMinutes <= 0) return total;
          return total + Math.max(0, getOrderDurationMinutes(item) - estimatedMinutes);
        }, 0) / deliveredHistory.length,
      )
    : 0;
  const peakDemandLoad = getPeakDemandLoad(new Date());
  const loadPressure = currentActiveOrders.length >= 8 ? 4 : currentActiveOrders.length >= 6 ? 3 : currentActiveOrders.length >= 4 ? 2 : currentActiveOrders.length >= 2 ? 1 : 0;
  const prepPressure = preparingOrders >= 4 ? 2 : preparingOrders >= 2 ? 1 : 0;
  const overduePressure = overdueOrders >= 3 ? 3 : overdueOrders >= 1 ? 1 : 0;
  const historyPressure = clampNumber(Math.round(historicalDelayMinutes * 0.6), 0, 6);
  const queuePressure = loadPressure + prepPressure + overduePressure + peakDemandLoad + historyPressure;
  const fallbackRemaining = safeEstimatedReadyMinutes ? Math.max(1, safeEstimatedReadyMinutes - elapsedMinutes) : 6;
  const baseRemainingMinutes =
    promisedRemainingMinutes === null ? fallbackRemaining : Math.max(0, promisedRemainingMinutes);
  let aiEtaMinutes = status === "ready" ? 0 : Math.max(1, baseRemainingMinutes + queuePressure + (status === "received" ? 1 : 0));
  let aiRiskLevel = "low";
  let aiReason = "Va dentro de una ventana operativa estable.";

  if (status === "ready") {
    aiReason = "Pedido listo para retirar; conviene entregarlo cuanto antes.";
  } else if (promisedRemainingMinutes !== null && promisedRemainingMinutes <= 0) {
    aiRiskLevel = "high";
    aiReason = "Ya supero el tiempo prometido y necesita atencion inmediata.";
  } else if (
    aiEtaMinutes >= 20 ||
    overduePressure >= 2 ||
    (safeEstimatedReadyMinutes && elapsedMinutes >= safeEstimatedReadyMinutes + 8)
  ) {
    aiRiskLevel = "high";
    aiReason = "Se detecta acumulacion de pedidos y este ticket esta entrando en zona critica.";
  } else if (
    aiEtaMinutes >= 12 ||
    (promisedRemainingMinutes !== null && promisedRemainingMinutes <= 5) ||
    historyPressure >= 3 ||
    loadPressure >= 2
  ) {
    aiRiskLevel = "medium";
    aiReason =
      loadPressure >= 2
        ? "La carga del local esta subiendo y conviene vigilar este pedido de cerca."
        : promisedRemainingMinutes !== null && promisedRemainingMinutes <= 5
          ? "Esta cerca de la hora comprometida y puede desviarse si entra mas carga."
          : "El local viene cerrando pedidos por encima de lo prometido.";
  } else if (peakDemandLoad >= 2) {
    aiReason = "Esta dentro de una franja de alta demanda, aunque por ahora va en ventana.";
  }

  if (!["received", "preparing", "ready"].includes(status)) {
    aiEtaMinutes = 0;
    aiRiskLevel = "low";
    aiReason = status === "delivered" ? "Pedido ya entregado." : "Pedido fuera de la cola operativa.";
  }

  const aiPriorityScore =
    (aiRiskLevel === "high" ? 120 : aiRiskLevel === "medium" ? 70 : 25) +
    Math.min(elapsedMinutes, 45) +
    Math.max(0, 8 - (promisedRemainingMinutes ?? 8)) * 4 +
    queuePressure * 6 +
    (status === "ready" ? 35 : 0) +
    (status === "preparing" ? 8 : 0);

  const aiPressureScore = clampNumber(queuePressure, 0, 15);
  const aiPressureLabel = aiPressureScore >= 8 ? "Alta" : aiPressureScore >= 4 ? "Media" : "Baja";

  return {
    aiEtaMinutes,
    aiRiskLevel,
    aiPriorityScore,
    aiReason,
    aiPressureScore,
    aiPressureLabel,
    aiUpdatedAt: new Date().toISOString(),
  };
}

function createOrder(orderData) {
  const orders = loadOrders();
  const normalizedSourceOrderId = normalizeSourceOrderId(orderData.sourceOrderId);
  const currentRestaurantId =
    String(orderData.restaurantId || "").trim() || getCurrentRestaurantSession()?.restaurantId || DEFAULT_RESTAURANT_ID;

  if (!normalizedSourceOrderId) {
    throw new Error("missing-source-order");
  }

  if (sourceOrderIdExists(normalizedSourceOrderId)) {
    throw new Error("duplicate-source-order");
  }

  const nextIndex = getNextOrderIndex(orders);
  const normalizedPickupPoint = String(orderData.pickupPoint || "").trim();
  const parsedEstimatedReadyMinutes = Number.parseInt(String(orderData.estimatedReadyMinutes || ""), 10);
  const normalizedEstimatedReadyMinutes =
    Number.isFinite(parsedEstimatedReadyMinutes) && parsedEstimatedReadyMinutes > 0
      ? Math.max(1, parsedEstimatedReadyMinutes)
      : null;
  const createdAt = new Date().toISOString();
  const order = {
    restaurantId: currentRestaurantId,
    createdAt,
    id: buildOrderTrackingId(currentRestaurantId, normalizedSourceOrderId),
    orderNumber: `#${nextIndex}`,
    sourceOrderId: normalizedSourceOrderId,
    publicTrackingToken: generatePublicTrackingToken(),
    sourceSystem: String(orderData.sourceSystem || "").trim() || "Alta manual",
    customerName: String(orderData.customerName || "").trim() || "Cliente mostrador",
    items: String(orderData.items || "").trim() || "Pedido rápido",
    pickupPoint: normalizedPickupPoint,
    estimatedReadyMinutes: normalizedEstimatedReadyMinutes,
    status: "received",
    notes: String(orderData.notes || "").trim(),
    rating: null,
    archivedAt: null,
    statusDurations: {},
    statusStartedAt: createdAt,
  };
  order.promisedReadyAt = buildPromisedReadyAt(order.createdAt, order.estimatedReadyMinutes);
  order.aiTrainingSnapshot = buildAiTrainingSnapshot(order, orders, createdAt);
  order.timelineEvents = [
    {
      type: "created",
      at: createdAt,
      status: order.status,
      snapshot: order.aiTrainingSnapshot,
    },
  ];
  order.lifecycleMilestones = buildLifecycleMilestones(order, { status: order.status, archivedAt: order.archivedAt }, createdAt);
  order.predictionTrainingRecord = buildPredictionTrainingRecord(order);

  const nextOrders = normalizeOrders([...orders, order]);
  saveOrders(nextOrders);
  persistOrderDocument(order);
  persistTrackingDocumentForOrder(order);
  return order;
}

function updateOrder(id, updates) {
  const currentOrder = getOrderById(id);
  if (!currentOrder) return null;

  const nextUpdates = { ...updates };

  if (Object.prototype.hasOwnProperty.call(nextUpdates, "sourceOrderId")) {
    const normalizedSourceOrderId = normalizeSourceOrderId(nextUpdates.sourceOrderId);

    if (normalizedSourceOrderId && sourceOrderIdExists(normalizedSourceOrderId, id)) {
      throw new Error("duplicate-source-order");
    }

    nextUpdates.sourceOrderId = normalizedSourceOrderId;
    nextUpdates.id = normalizedSourceOrderId
      ? buildOrderTrackingId(currentOrder.restaurantId, normalizedSourceOrderId)
      : currentOrder.id;
  }

  if (Object.prototype.hasOwnProperty.call(nextUpdates, "estimatedReadyMinutes")) {
    const parsedEstimatedReadyMinutes = Number.parseInt(String(nextUpdates.estimatedReadyMinutes || ""), 10);
    nextUpdates.estimatedReadyMinutes =
      Number.isFinite(parsedEstimatedReadyMinutes) && parsedEstimatedReadyMinutes > 0
        ? Math.max(1, parsedEstimatedReadyMinutes)
        : null;
  }

  if (
    Object.prototype.hasOwnProperty.call(nextUpdates, "estimatedReadyMinutes") ||
    Object.prototype.hasOwnProperty.call(nextUpdates, "createdAt")
  ) {
    nextUpdates.promisedReadyAt = buildPromisedReadyAt(
      nextUpdates.createdAt || currentOrder.createdAt,
      nextUpdates.estimatedReadyMinutes || currentOrder.estimatedReadyMinutes,
    );
  }

  const eventTime = new Date().toISOString();
  const nextOrder = { ...currentOrder, ...nextUpdates };
  const stagedOrders = loadOrders().map((order) => (order.id === id ? nextOrder : order));
  const snapshot = buildAiTrainingSnapshot(nextOrder, stagedOrders, eventTime);
  const changedKeys = Object.keys(nextUpdates);

  nextOrder.aiTrainingSnapshot = snapshot;
  nextOrder.lifecycleMilestones = buildLifecycleMilestones(currentOrder, nextUpdates, eventTime);
  nextOrder.predictionTrainingRecord = buildPredictionTrainingRecord(nextOrder);
  nextOrder.timelineEvents = changedKeys.length
    ? appendOrderTimelineEvent(currentOrder, {
        type: changedKeys.includes("status") ? "status-updated" : "order-updated",
        at: eventTime,
        status: nextOrder.status,
        changedKeys,
        snapshot,
      })
    : Array.isArray(currentOrder.timelineEvents)
      ? [...currentOrder.timelineEvents]
      : [];

  const nextOrders = stagedOrders.map((order) => (order.id === id ? nextOrder : order));
  saveOrders(nextOrders);
  persistOrderDocument(nextOrder, currentOrder.id);
  persistTrackingDocumentForOrder(nextOrder, currentOrder.id);
  return getOrderById(nextUpdates.id || id);
}

function updateOrderStatus(id, status) {
  const order = getOrderById(id);
  if (!order || order.status === status) return order;

  const nowIso = new Date().toISOString();
  const currentStatus = order.status;
  const elapsedMinutes = Math.max(
    0,
    Math.floor((new Date(nowIso).getTime() - new Date(order.statusStartedAt || order.createdAt).getTime()) / 60000),
  );
  const nextDurations = {
    ...(order.statusDurations || {}),
    [currentStatus]: (order.statusDurations?.[currentStatus] || 0) + elapsedMinutes,
  };
  const nextArchivedAt = status === "delivered" || status === "cancelled" ? nowIso : null;

  return updateOrder(id, {
    status,
    archivedAt: nextArchivedAt,
    statusDurations: nextDurations,
    statusStartedAt: nowIso,
  });
}

function submitOrderRating(id, score) {
  return updatePublicTrackingRating(id, score, "");
}

function updatePublicTrackingRating(id, score, comment = "") {
  const trackingOrder = getPublicOrderById(id);
  if (!trackingOrder) return null;

  const nextTracking = loadPublicOrders().map((order) =>
    order.id === id
      ? {
          ...order,
          rating: {
            score,
            comment: comment.trim(),
            createdAt: new Date().toISOString(),
          },
        }
      : order,
  );

  applyTrackingSnapshot(nextTracking);
  if (firebaseBackend?.enabled) {
    const nextRecord = nextTracking.find((order) => order.id === id);
    firebaseBackend
      .setDocument(FIREBASE_TRACKING_COLLECTION, id, nextRecord)
      .catch((error) => {
        console.error("No se pudo guardar la valoracion publica del pedido.", error);
        notifyFirebaseError(error, "No se pudo guardar la valoracion del cliente.");
      });
  }
  broadcastOrdersChanged();
  return nextTracking.find((order) => order.id === id) || null;
}

function submitOrderRatingFeedback(id, score, comment) {
  return updatePublicTrackingRating(id, score, comment);
}

function archiveOrder(id) {
  return updateOrder(id, { archivedAt: new Date().toISOString() });
}

function restoreOrder(id) {
  return updateOrder(id, { archivedAt: null });
}

function getOperationalOrders() {
  const currentRestaurantId = getCurrentRestaurantSession()?.restaurantId;
  return loadOrders().filter((order) => {
    if (order.archivedAt) return false;
    if (!currentRestaurantId) return true;
    return order.restaurantId === currentRestaurantId;
  });
}

function getArchivedOrders() {
  const currentRestaurantId = getCurrentRestaurantSession()?.restaurantId;
  return loadOrders().filter((order) => {
    if (!order.archivedAt) return false;
    if (!currentRestaurantId) return true;
    return order.restaurantId === currentRestaurantId;
  });
}

function getQueueBefore(orderId) {
  const currentOrder = getPublicOrderById(orderId);
  if (!currentOrder) return [];

  const orders = loadPublicOrders().filter(
    (order) => !order.archivedAt && order.restaurantId === currentOrder.restaurantId,
  );
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) return [];

  return orders.slice(0, index).filter((order) => QUEUE_ACTIVE_STATUSES.includes(order.status));
}

function getActiveOrderCount() {
  return getOperationalOrders().filter((order) => QUEUE_ACTIVE_STATUSES.includes(order.status)).length;
}

function formatOrderTime(value) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getElapsedOrderTime(value) {
  const order = typeof value === "string" ? { createdAt: value, archivedAt: null } : value;
  const endTime = order.archivedAt ? new Date(order.archivedAt).getTime() : Date.now();
  const elapsedMs = Math.max(0, endTime - new Date(order.createdAt).getTime());
  const totalMinutes = Math.floor(elapsedMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getElapsedOrderTone(value) {
  const order = typeof value === "string" ? { createdAt: value, archivedAt: null } : value;
  const endTime = order.archivedAt ? new Date(order.archivedAt).getTime() : Date.now();
  const elapsedMinutes = Math.floor(Math.max(0, endTime - new Date(order.createdAt).getTime()) / 60000);

  if (elapsedMinutes >= 30) return "danger";
  if (elapsedMinutes >= 16) return "warning";
  return "safe";
}

function getOrderDurationMinutes(order) {
  const endTime = order.archivedAt ? new Date(order.archivedAt).getTime() : Date.now();
  return Math.max(0, Math.floor((endTime - new Date(order.createdAt).getTime()) / 60000));
}

function formatDurationMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatStatusDurationLabel(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!minutes) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function getStatusDurationMinutes(order, status) {
  const savedMinutes = Number(order.statusDurations?.[status] || 0);

  if (order.status !== status) return savedMinutes;

  const endTime = order.archivedAt ? new Date(order.archivedAt).getTime() : Date.now();
  const startedAt = new Date(order.statusStartedAt || order.createdAt).getTime();
  const liveMinutes = Math.max(0, Math.floor((endTime - startedAt) / 60000));

  if (!order.statusDurations && status === order.status) {
    return Math.max(savedMinutes, getOrderDurationMinutes(order));
  }

  return savedMinutes + liveMinutes;
}

function isSameLocalDay(value) {
  const today = new Date();
  const current = new Date(value);
  return (
    today.getFullYear() === current.getFullYear() &&
    today.getMonth() === current.getMonth() &&
    today.getDate() === current.getDate()
  );
}

function isWithinLastDays(value, days) {
  if (!value) return false;
  const diffMs = Date.now() - new Date(value).getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

function getDashboardStats() {
  const currentRestaurantId = getCurrentRestaurantSession()?.restaurantId;
  const todayOrders = loadOrders().filter((order) => {
    if (!isSameLocalDay(order.createdAt)) return false;
    if (!currentRestaurantId) return true;
    return order.restaurantId === currentRestaurantId;
  });
  const deliveredOrders = todayOrders.filter((order) => order.status === "delivered");
  const archivedOrders = todayOrders.filter((order) => Boolean(order.archivedAt));
  const activeOrders = todayOrders.filter((order) => !order.archivedAt);
  const intelligentActiveOrders = enrichOrdersWithIntelligence(activeOrders, { allOrders: loadOrders() });
  const ratedOrders = todayOrders.filter((order) => order.rating && order.rating.score);
  const delayedActiveOrders = activeOrders.filter((order) => getOrderDurationMinutes(order) >= 16);
  const onTimeDeliveredOrders = deliveredOrders.filter((order) => getOrderDurationMinutes(order) <= 15);
  const lowRatedOrders = ratedOrders.filter((order) => Number(order.rating.score || 0) <= 2);
  const commentedOrders = ratedOrders.filter((order) => String(order.rating.comment || "").trim());
  const longestActiveMinutes = activeOrders.length
    ? Math.max(...activeOrders.map((order) => getOrderDurationMinutes(order)))
    : 0;
  const slowestOrder =
    [...todayOrders].sort((left, right) => getOrderDurationMinutes(right) - getOrderDurationMinutes(left))[0] || null;

  const ordersByHour = todayOrders.reduce((accumulator, order) => {
    const hour = new Date(order.createdAt).getHours();
    accumulator[hour] = (accumulator[hour] || 0) + 1;
    return accumulator;
  }, {});

  const peakHourEntry = Object.entries(ordersByHour).sort((left, right) => right[1] - left[1])[0] || null;

  const averageDeliveredMinutes = deliveredOrders.length
    ? Math.round(
        deliveredOrders.reduce((total, order) => total + getOrderDurationMinutes(order), 0) /
          deliveredOrders.length,
      )
    : 0;

  const averageResolutionMinutes = archivedOrders.length
    ? Math.round(
        archivedOrders.reduce((total, order) => total + getOrderDurationMinutes(order), 0) / archivedOrders.length,
      )
    : 0;

  const averageRating = ratedOrders.length
    ? (
        ratedOrders.reduce((total, order) => total + Number(order.rating.score || 0), 0) / ratedOrders.length
      ).toFixed(1)
    : null;

  const cancellationRate = todayOrders.length
    ? Math.round((todayOrders.filter((order) => order.status === "cancelled").length / todayOrders.length) * 100)
    : 0;

  const onTimeRate = deliveredOrders.length ? Math.round((onTimeDeliveredOrders.length / deliveredOrders.length) * 100) : 0;

  const peakHour = peakHourEntry
    ? `${String(Number(peakHourEntry[0])).padStart(2, "0")}:00`
    : "--:--";

  const dashboardStatuses = ORDER_STATUSES.filter((status) => !["delivered", "cancelled"].includes(status));

  const statusPerformance = dashboardStatuses.map((status) => {
    const relevantOrders = todayOrders.filter(
      (order) => Number(order.statusDurations?.[status] || 0) > 0 || order.status === status,
    );
    const totalMinutes = relevantOrders.reduce((total, order) => total + getStatusDurationMinutes(order, status), 0);
    const averageMinutes = relevantOrders.length ? Math.round(totalMinutes / relevantOrders.length) : 0;

    return {
      status,
      label: statusMeta[status].label,
      totalMinutes,
      averageMinutes,
      count: relevantOrders.length,
    };
  });

  const slowestStatus =
    [...statusPerformance]
      .filter((item) => item.count > 0)
      .sort((left, right) => right.averageMinutes - left.averageMinutes)[0] || null;

  const aiHighRiskOrders = intelligentActiveOrders.filter((order) => order.aiRiskLevel === "high");
  const aiAttentionOrders = intelligentActiveOrders.filter((order) => order.aiRiskLevel === "medium");
  const aiAverageExtraMinutes = intelligentActiveOrders.length
    ? Math.round(
        intelligentActiveOrders.reduce((total, order) => {
          const promisedRemainingMinutes = getRemainingEstimatedMinutes(order);
          const baseline =
            promisedRemainingMinutes === null
              ? Number.parseInt(String(order.estimatedReadyMinutes || ""), 10) || 0
              : Math.max(0, promisedRemainingMinutes);
          return total + Math.max(0, Number(order.aiEtaMinutes || 0) - baseline);
        }, 0) / intelligentActiveOrders.length,
      )
    : 0;
  const aiPressureScore = intelligentActiveOrders.length
    ? Math.round(
        intelligentActiveOrders.reduce((total, order) => total + Number(order.aiPressureScore || 0), 0) /
          intelligentActiveOrders.length,
      )
    : 0;
  const aiPressureLabel = aiPressureScore >= 8 ? "Alta" : aiPressureScore >= 4 ? "Media" : "Baja";
  const aiFocusOrder =
    [...intelligentActiveOrders].sort((left, right) => Number(right.aiPriorityScore || 0) - Number(left.aiPriorityScore || 0))[0] ||
    null;

  return {
    totalToday: todayOrders.length,
    activeNow: activeOrders.length,
    readyNow: activeOrders.filter((order) => order.status === "ready").length,
    deliveredToday: deliveredOrders.length,
    delayedActive: delayedActiveOrders.length,
    avgDeliveredMinutes: averageDeliveredMinutes,
    avgResolutionMinutes: averageResolutionMinutes,
    averageRating,
    cancellationRate,
    onTimeRate,
    longestActiveMinutes,
    slowestOrder,
    lowRatingCount: lowRatedOrders.length,
    feedbackCount: commentedOrders.length,
    peakHour,
    slowestStatus,
    aiHighRiskCount: aiHighRiskOrders.length,
    aiAttentionCount: aiAttentionOrders.length,
    aiAverageExtraMinutes,
    aiPressureScore,
    aiPressureLabel,
    aiFocusOrder,
    ratedCount: ratedOrders.length,
    deliveredCount: deliveredOrders.length,
    statusPerformance,
    statusCounts: ORDER_STATUSES.map((status) => ({
      status,
      label: statusMeta[status].label,
      count: todayOrders.filter((order) => order.status === status).length,
      color: statusMeta[status].color,
      bg: statusMeta[status].bg,
    })),
    feedbackMix: [
      { label: "Valoradas", count: ratedOrders.length, color: "#1f7a63" },
      { label: "Bajas", count: lowRatedOrders.length, color: "#b42318" },
      { label: "Comentadas", count: commentedOrders.length, color: "#0c5b75" },
    ],
    throughputMix: [
      { label: "Activos", count: activeOrders.length, color: "#ec7c0d" },
      { label: "Listos", count: activeOrders.filter((order) => order.status === "ready").length, color: "#1f7a63" },
      { label: "Entregados", count: deliveredOrders.length, color: "#0c5b75" },
      { label: "Cancelados", count: todayOrders.filter((order) => order.status === "cancelled").length, color: "#b42318" },
    ],
  };
}

function getAdminDashboardStats() {
  const restaurants = loadRestaurants();
  const orders = loadOrders();
  const activeRestaurants = restaurants.filter((restaurant) => isRestaurantAccessActive(restaurant));
  const expiredRestaurants = restaurants.filter((restaurant) => !isRestaurantAccessActive(restaurant));
  const restaurantsWithOrders = restaurants.map((restaurant) => {
    const restaurantOrders = orders.filter((order) => order.restaurantId === restaurant.id);
    const deliveredOrders = restaurantOrders.filter((order) => order.status === "delivered");
    const avgDeliveryMinutes = deliveredOrders.length
      ? Math.round(
          deliveredOrders.reduce((total, order) => total + getOrderDurationMinutes(order), 0) / deliveredOrders.length,
        )
      : 0;

    return {
      restaurant,
      restaurantOrders,
      orderCount: restaurantOrders.length,
      activeOrderCount: restaurantOrders.filter((order) => !order.archivedAt).length,
      deliveredCount: deliveredOrders.length,
      avgDeliveryMinutes,
    };
  });

  const topRestaurant =
    [...restaurantsWithOrders].sort((left, right) => right.orderCount - left.orderCount)[0] || null;
  const recentlyActiveRestaurants = restaurantsWithOrders.filter((item) =>
    item.restaurantOrders?.some((order) => isWithinLastDays(order.createdAt, 7)),
  ).length;
  const dormantRestaurants = restaurantsWithOrders.filter((item) => item.orderCount > 0 && !item.restaurantOrders?.some((order) => isWithinLastDays(order.createdAt, 14))).length;
  const restaurantsWithoutOrders = restaurantsWithOrders.filter((item) => item.orderCount === 0).length;
  const soonToExpire = restaurants
    .filter((restaurant) => {
      const remainingDays = getRestaurantRemainingDays(restaurant);
      return remainingDays !== null && remainingDays >= 0 && remainingDays <= 7;
    })
    .length;
  const topRestaurantsByOrders = [...restaurantsWithOrders]
    .filter((item) => item.orderCount > 0)
    .sort((left, right) => right.orderCount - left.orderCount)
    .slice(0, 5);

  return {
    totalRestaurants: restaurants.length,
    activeRestaurants: activeRestaurants.length,
    expiredRestaurants: expiredRestaurants.length,
    totalOrders: orders.length,
    activeOrders: orders.filter((order) => !order.archivedAt).length,
    deliveredOrders: orders.filter((order) => order.status === "delivered").length,
    cancelledOrders: orders.filter((order) => order.status === "cancelled").length,
    soonToExpire,
    recentlyActiveRestaurants,
    dormantRestaurants,
    restaurantsWithoutOrders,
    topRestaurant,
    topRestaurantsByOrders,
    accessMix: [
      { label: "Activos", count: activeRestaurants.length, color: "#1f7a63" },
      { label: "Vencen pronto", count: soonToExpire, color: "#ec7c0d" },
      { label: "Vencidos", count: expiredRestaurants.length, color: "#b42318" },
    ],
    adoptionMix: [
      { label: "Activos 7d", count: recentlyActiveRestaurants, color: "#1f7a63" },
      { label: "Dormidos 14d", count: dormantRestaurants, color: "#ec7c0d" },
      { label: "Sin pedidos", count: restaurantsWithoutOrders, color: "#ec7c0d" },
    ],
    orderOutcomeMix: [
      { label: "Activos", count: orders.filter((order) => !order.archivedAt).length, color: "#ec7c0d" },
      { label: "Entregados", count: orders.filter((order) => order.status === "delivered").length, color: "#1f7a63" },
      { label: "Cancelados", count: orders.filter((order) => order.status === "cancelled").length, color: "#b42318" },
    ],
  };
}

function buildRestaurantCredentialsEmail(restaurant, options = {}) {
  const accessUrl = String(options.accessUrl || "./restaurant.html").trim() || "./restaurant.html";
  const subject = `Acceso TurnoListo - ${restaurant.name}`;
  const body = [
    `Hola ${restaurant.ownerName || restaurant.name},`,
    "",
    "Te compartimos el acceso seguro a tu panel de restaurante en TurnoListo:",
    "",
    `Restaurante: ${restaurant.name}`,
    `Correo de acceso: ${restaurant.username}`,
    `Acceso activo hasta: ${formatAdminEmailDate(restaurant.activatedUntil)}`,
    "",
    "Define tu contrasena desde este enlace seguro:",
    restaurant.accessLink || "Solicita un nuevo enlace al administrador si este correo ya no contiene uno activo.",
    "",
    "Enlace de acceso:",
    accessUrl,
    "",
    "Si necesitas soporte o renovar el acceso, responde a este mensaje.",
  ].join("\n");

  return {
    to: restaurant.email,
    subject,
    body,
    href: `mailto:${encodeURIComponent(restaurant.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

function buildRestaurantOnboardingEmail(restaurant, options = {}) {
  const accessUrl = String(options.accessUrl || "./restaurant.html").trim() || "./restaurant.html";
  const subject = `Activacion TurnoListo - ${restaurant.name}`;
  const body = [
    `Hola ${restaurant.ownerName || restaurant.name},`,
    "",
    "Queremos dejar TurnoListo activo cuanto antes para que tu equipo gestione recogidas con menos esperas y menos preguntas en mostrador.",
    "",
    "Siguiente paso recomendado:",
    restaurant.accessLink
      ? `1. Activa tu acceso desde este enlace seguro: ${restaurant.accessLink}`
      : "1. Pide a soporte un nuevo enlace seguro de acceso si no lo tienes a mano.",
    `2. Entra al panel del restaurante: ${accessUrl}`,
    "3. Crea tu primer pedido de prueba y marca el flujo hasta Listo.",
    "",
    "Con esto tu equipo podrá:",
    "- avisar mejor al cliente",
    "- reducir saturacion en mostrador",
    "- controlar pedidos urgentes con mas claridad",
    "",
    "Si quieres, te ayudamos a dejarlo configurado en una llamada corta.",
  ].join("\n");

  return {
    to: restaurant.email,
    subject,
    body,
    href: `mailto:${encodeURIComponent(restaurant.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

function buildRestaurantRenewalEmail(restaurant, options = {}) {
  const accessUrl = String(options.accessUrl || "./restaurant.html").trim() || "./restaurant.html";
  const subject = `Renovacion TurnoListo - ${restaurant.name}`;
  const body = [
    `Hola ${restaurant.ownerName || restaurant.name},`,
    "",
    `Tu acceso a TurnoListo esta ${restaurant.remainingDays < 0 ? "vencido" : "proximo a vencer"}.`,
    `Estado actual: ${buildRemainingAccessLabel(restaurant)}.`,
    `Acceso vigente hasta: ${formatAdminEmailDate(restaurant.activatedUntil)}`,
    "",
    "Si quieres mantener activo el flujo de seguimiento de pedidos y avisos al cliente, podemos renovarlo de inmediato.",
    "",
    "Enlace de acceso al panel:",
    accessUrl,
    "",
    "Si confirmas la renovacion, dejamos el acceso activo y continuas sin interrupciones.",
  ].join("\n");

  return {
    to: restaurant.email,
    subject,
    body,
    href: `mailto:${encodeURIComponent(restaurant.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

function formatAdminEmailDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function buildClientUrl(orderId) {
  const url = new URL("./client-launch.html", window.location.href);
  const publicOrderId = typeof orderId === "string" ? orderId : getOrderPublicTrackingToken(orderId);
  url.hash = `order=${encodeURIComponent(publicOrderId)}`;
  return url.toString();
}

function buildQrUrl(orderId) {
  const publicOrderId = typeof orderId === "string" ? orderId : getOrderPublicTrackingToken(orderId);
  const cacheKey = normalizePublicTrackingToken(publicOrderId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(buildClientUrl(publicOrderId))}&cb=${encodeURIComponent(cacheKey)}`;
}

function getNextOrderIndex(orders) {
  const values = orders
    .map((order) => Number.parseInt(String(order.orderNumber || "").replace("#", ""), 10))
    .filter((value) => Number.isFinite(value));

  return Math.max(2047, ...values) + 1;
}

function formatRating(score) {
  if (!score) return "Sin valorar";
  return `${"★".repeat(score)}${"☆".repeat(5 - score)}`;
}

function getSyncChannel() {
  if (!("BroadcastChannel" in window)) return null;
  if (!window.__turnoListoSyncChannel) {
    window.__turnoListoSyncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
  return window.__turnoListoSyncChannel;
}

function onOrdersChanged(callback) {
  window.addEventListener(SYNC_EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  window.addEventListener("focus", callback);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") callback();
  });

  const channel = getSyncChannel();
  if (channel) {
    channel.addEventListener("message", callback);
  }
}

function shouldRepairTrackingRecord(order, trackingRecord) {
  if (!trackingRecord) return true;

  const expectedTracking = buildPublicTrackingRecord(order);
  const trackedKeys = [
    "restaurantId",
    "restaurantName",
    "restaurantLogoUrl",
    "publicTrackingToken",
    "sourceOrderId",
    "orderNumber",
    "customerName",
    "pickupPoint",
    "estimatedReadyMinutes",
    "promisedReadyAt",
    "status",
    "createdAt",
    "archivedAt",
  ];

  return trackedKeys.some((key) => {
    const expectedValue = expectedTracking[key] ?? null;
    const currentValue = trackingRecord[key] ?? null;
    return expectedValue !== currentValue;
  });
}

function repairPublicTrackingRecordsFromOrders(orders) {
  if (!firebaseBackend?.enabled || typeof firebaseBackend.setDocument !== "function") return;

  const trackingLookup = buildTrackingLookup(loadPublicOrders());

  orders.forEach((order) => {
    const trackingRecord = trackingLookup.get(getTrackingLookupKey(order));
    if (!shouldRepairTrackingRecord(order, trackingRecord)) return;
    persistTrackingDocumentForOrder(order);
  });
}

function broadcastOrdersChanged() {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { at: Date.now() } }));
  const channel = getSyncChannel();
  if (channel) {
    channel.postMessage({ type: "orders-updated", at: Date.now() });
  }
}

function getTrackingLookupKey(value) {
  const candidate =
    typeof value === "string"
      ? value
      : value?.publicTrackingToken || value?.sourceOrderId || value?.id;
  return normalizePublicTrackingToken(candidate);
}

function buildTrackingLookup(trackingRecords) {
  return new Map(
    normalizePublicTracking(trackingRecords).flatMap((tracking) => {
      const keys = [
        getTrackingLookupKey(tracking.publicTrackingToken),
        getTrackingLookupKey(tracking.id),
        getTrackingLookupKey(tracking.sourceOrderId),
      ].filter(Boolean);
      return keys.map((key) => [key, tracking]);
    }),
  );
}

function buildPublicTrackingRecord(order) {
  const existingTracking = buildTrackingLookup(cachedTracking).get(getTrackingLookupKey(order));
  const restaurant = getRestaurantById(order.restaurantId);

  return {
    id: order.id,
    restaurantId: order.restaurantId,
    restaurantName: String(restaurant?.name || existingTracking?.restaurantName || "").trim(),
    restaurantLogoUrl: String(restaurant?.logoUrl || existingTracking?.restaurantLogoUrl || "").trim(),
    publicTrackingToken: getOrderPublicTrackingToken(order),
    sourceOrderId: order.sourceOrderId,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    pickupPoint: order.pickupPoint,
    estimatedReadyMinutes: order.estimatedReadyMinutes,
    promisedReadyAt: order.promisedReadyAt,
    status: order.status,
    rating: existingTracking?.rating || order.rating || null,
    createdAt: order.createdAt,
    archivedAt: order.archivedAt,
  };
}

function normalizePublicTracking(trackingRecords) {
  return [...trackingRecords]
    .map((tracking) => ({
      restaurantName: "",
      restaurantLogoUrl: "",
      publicTrackingToken: "",
      sourceOrderId: "",
      customerName: "",
      pickupPoint: "",
      estimatedReadyMinutes: null,
      promisedReadyAt: "",
      rating: null,
      archivedAt: null,
      ...tracking,
    }))
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
}

function buildPredictionDatasetRow(order, allOrders = loadOrders()) {
  const snapshot = order?.aiTrainingSnapshot || buildAiTrainingSnapshot(order, allOrders, order?.statusStartedAt || order?.createdAt);
  const record = order?.predictionTrainingRecord || buildPredictionTrainingRecord(order);

  return {
    orderId: order?.id || "",
    restaurantId: order?.restaurantId || "",
    sourceSystem: order?.sourceSystem || "",
    createdAt: order?.createdAt || null,
    finalStatus: record.finalStatus || order?.status || "",
    estimatedReadyMinutes: record.estimatedReadyMinutes,
    minutesToReady: record.minutesToReady,
    minutesToDelivered: record.minutesToDelivered,
    activeOrdersAtCapture: snapshot.activeOrders,
    preparingOrdersAtCapture: snapshot.preparingOrders,
    readyOrdersAtCapture: snapshot.readyOrders,
    overdueOrdersAtCapture: snapshot.overdueOrders,
    hourOfDay: snapshot.hourOfDay,
    dayOfWeek: snapshot.dayOfWeek,
    peakLoadScore: snapshot.peakLoadScore,
    currentStatusAtCapture: snapshot.currentStatus,
    hasReadyMilestone: Boolean(order?.lifecycleMilestones?.readyAt),
    hasDeliveredMilestone: Boolean(order?.lifecycleMilestones?.deliveredAt),
    timelineEventsCount: Array.isArray(order?.timelineEvents) ? order.timelineEvents.length : 0,
  };
}

function exportPredictionDataset(options = {}) {
  const orders = loadOrders();
  const safeOptions = { deliveredOnly: false, includeCancelled: false, ...options };
  const filteredOrders = orders.filter((order) => {
    if (safeOptions.deliveredOnly && order.status !== "delivered") return false;
    if (!safeOptions.includeCancelled && order.status === "cancelled") return false;
    return true;
  });

  return filteredOrders.map((order) => buildPredictionDatasetRow(order, orders));
}

function initializeTurnoAlerts() {
  if (window.__turnoAlertsInitialized) return;
  window.__turnoAlertsInitialized = true;
  window.showTurnoAlert = showTurnoAlert;
}

function getTurnoAlertRoot() {
  let root = document.querySelector("#turnoAlertRoot");
  if (root) return root;

  root = document.createElement("div");
  root.id = "turnoAlertRoot";
  root.className = "turno-alert-root";
  document.body.append(root);
  return root;
}

function showTurnoAlert(message, type = "error", options = {}) {
  const root = getTurnoAlertRoot();
  const alert = document.createElement("article");
  const title = document.createElement("strong");
  const body = document.createElement("p");
  const close = document.createElement("button");
  const timeoutMs = options.timeoutMs ?? 6000;

  alert.className = `turno-alert turno-alert--${type}`;
  title.className = "turno-alert__title";
  body.className = "turno-alert__body";
  close.className = "turno-alert__close";
  close.type = "button";
  close.setAttribute("aria-label", "Cerrar alerta");
  close.textContent = "Cerrar";
  title.textContent =
    type === "success" ? "Todo correcto" : type === "warning" ? "Revisa esto" : "Algo ha fallado";
  body.textContent = String(message || "Ha ocurrido un error inesperado.");

  close.addEventListener("click", () => {
    alert.remove();
  });

  alert.append(title, body, close);
  root.append(alert);

  window.setTimeout(() => {
    alert.remove();
  }, timeoutMs);
}

function notifyFirebaseError(error, fallbackMessage) {
  const code = error?.code || "";
  const message = mapFirebaseErrorMessage(code, fallbackMessage);
  showTurnoAlert(message, "error");
}

function mapFirebaseErrorMessage(code, fallbackMessage) {
  switch (code) {
    case "permission-denied":
      return "No tienes permiso para acceder a estos datos. Revisa el rol del usuario o las reglas de Firestore.";
    case "unauthenticated":
      return "Tu sesion no es valida o ha expirado. Inicia sesion de nuevo.";
    case "auth/unauthorized-domain":
      return "Este dominio no esta autorizado en Firebase Authentication.";
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Las credenciales no son validas. Revisa correo y contrasena.";
    case "auth/network-request-failed":
      return "No se pudo conectar con Firebase. Comprueba tu conexion e intentalo otra vez.";
    default:
      return fallbackMessage || "Ha ocurrido un error al comunicar con Firebase.";
  }
}
