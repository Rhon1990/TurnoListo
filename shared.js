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
const dataReadyPromise = initializeDataStore();

const statusMeta = {
  received: { label: "Recibido", color: "#8f3513", bg: "rgba(216, 95, 49, 0.12)", progress: 18 },
  preparing: { label: "En preparación", color: "#8c6403", bg: "rgba(239, 184, 76, 0.18)", progress: 58 },
  ready: { label: "Listo para recoger", color: "#1f7a63", bg: "rgba(31, 122, 99, 0.14)", progress: 100 },
  delivered: { label: "Entregado", color: "#0c5b75", bg: "rgba(12, 91, 117, 0.12)", progress: 100 },
  cancelled: { label: "Cancelado", color: "#7f1d1d", bg: "rgba(127, 29, 29, 0.12)", progress: 100 },
};

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

    if (remoteTracking.length) {
      applyTrackingSnapshot(remoteTracking);
    } else if (backend.isAuthenticated()) {
      await backend.replaceCollection(
        FIREBASE_TRACKING_COLLECTION,
        normalizePublicTracking(cachedOrders.map((order) => buildPublicTrackingRecord(order))),
      );
    }

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
    const [remoteOrders, remoteRestaurants] = await Promise.all([
      firebaseBackend.loadCollection(FIREBASE_ORDERS_COLLECTION),
      firebaseBackend.loadCollection(FIREBASE_RESTAURANTS_COLLECTION),
    ]);

    if (remoteOrders.length) {
      applyOrdersSnapshot(remoteOrders);
    } else {
      await firebaseBackend.replaceCollection(FIREBASE_ORDERS_COLLECTION, cachedOrders);
    }

    if (remoteRestaurants.length) {
      applyRestaurantsSnapshot(remoteRestaurants);
    } else {
      await firebaseBackend.replaceCollection(FIREBASE_RESTAURANTS_COLLECTION, cachedRestaurants);
    }

    disconnectPrivateFirebaseSubscriptions();

    ordersUnsubscribe = firebaseBackend.subscribeCollection(FIREBASE_ORDERS_COLLECTION, (orders) => {
      applyOrdersSnapshot(orders.length ? orders : []);
      broadcastOrdersChanged();
    });

    restaurantsUnsubscribe = firebaseBackend.subscribeCollection(FIREBASE_RESTAURANTS_COLLECTION, (restaurants) => {
      applyRestaurantsSnapshot(restaurants.length ? restaurants : []);
      broadcastOrdersChanged();
    });
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
    const remoteOrders = await firebaseBackend.loadCollection(FIREBASE_ORDERS_COLLECTION);
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

function syncOrdersToBackend() {
  if (!firebaseBackend?.enabled) return;
  firebaseBackend.replaceCollection(FIREBASE_ORDERS_COLLECTION, cachedOrders).catch((error) => {
    console.error("No se pudieron sincronizar los pedidos con Firebase.", error);
    notifyFirebaseError(error, "No se pudieron guardar los pedidos en Firebase.");
  });
}

function syncRestaurantsToBackend() {
  if (!firebaseBackend?.enabled) return;
  firebaseBackend.replaceCollection(FIREBASE_RESTAURANTS_COLLECTION, cachedRestaurants).catch((error) => {
    console.error("No se pudieron sincronizar los restaurantes con Firebase.", error);
    notifyFirebaseError(error, "No se pudieron guardar los restaurantes en Firebase.");
  });
}

function syncTrackingToBackend() {
  if (!firebaseBackend?.enabled) return;

  const trackingRecords = normalizePublicTracking(cachedOrders.map((order) => buildPublicTrackingRecord(order)));
  applyTrackingSnapshot(trackingRecords);
  firebaseBackend.replaceCollection(FIREBASE_TRACKING_COLLECTION, trackingRecords).catch((error) => {
    console.error("No se pudo sincronizar el tracking publico con Firebase.", error);
    notifyFirebaseError(error, "No se pudo guardar el seguimiento publico.");
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
      password: "demo123",
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
  const password = generateRestaurantPassword();

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
    planName: String(accountData.planName || "").trim() || "Mensual",
    notes: String(accountData.notes || "").trim(),
    activatedAt,
    activatedUntil,
    username,
    password,
    createdAt: new Date().toISOString(),
  };

  saveRestaurants([...restaurants, restaurant]);
  return restaurant;
}

function deleteRestaurantAccount(restaurantId) {
  const nextRestaurants = loadRestaurants().filter((restaurant) => restaurant.id !== restaurantId);
  const nextOrders = loadOrders().filter((order) => order.restaurantId !== restaurantId);
  const currentSession = getCurrentRestaurantSession();

  applyOrdersSnapshot(nextOrders);
  applyRestaurantsSnapshot(nextRestaurants);
  syncOrdersToBackend();
  syncRestaurantsToBackend();

  if (currentSession?.restaurantId === restaurantId) {
    clearCurrentRestaurantSession();
    return;
  }

  broadcastOrdersChanged();
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

function buildOrderTrackingId(restaurantId, sourceOrderId) {
  return normalizeSourceOrderId(sourceOrderId);
}

function authenticateRestaurant(username, password) {
  const normalizedUsername = normalizeRestaurantUsername(username);
  const restaurant =
    loadRestaurants().find(
      (item) =>
        normalizeRestaurantUsername(item.username) === normalizedUsername &&
        item.password === String(password || ""),
    ) || null;

  if (!restaurant || !isRestaurantAccessActive(restaurant)) return null;
  return restaurant;
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
      status: "received",
      notes: "Sin cebolla",
      rating: null,
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
      status: "preparing",
      notes: "",
      rating: null,
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
      status: "ready",
      notes: "Avisar cuando llegue",
      rating: null,
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
      status: "delivered",
      notes: "",
      rating: {
        score: 5,
        comment: "",
        createdAt: new Date(now - 8 * 60000).toISOString(),
      },
      createdAt: new Date(now - 40 * 60000).toISOString(),
      archivedAt: new Date(now - 3 * 60000).toISOString(),
    },
  ];
}

function saveOrders(orders) {
  applyOrdersSnapshot(orders);
  syncOrdersToBackend();
  syncTrackingToBackend();
  broadcastOrdersChanged();
}

function normalizeOrders(orders) {
  return [...orders]
    .map((order) => ({
      restaurantId: DEFAULT_RESTAURANT_ID,
      sourceOrderId: "",
      sourceSystem: "Alta manual",
      notes: "",
      rating: null,
      archivedAt: null,
      statusDurations: {},
      statusStartedAt: order?.createdAt || new Date().toISOString(),
      ...order,
      id:
        order.id ||
        buildOrderTrackingId(order.restaurantId || DEFAULT_RESTAURANT_ID, order.sourceOrderId || order.orderNumber || ""),
    }))
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
}

function getOrderById(id) {
  return loadOrders().find((order) => order.id === id);
}

function getOrderByPublicId(value) {
  const normalized = normalizeSourceOrderId(value);
  if (!normalized) return null;

  return (
    loadOrders().find(
      (order) => normalizeSourceOrderId(order.sourceOrderId) === normalized || normalizeSourceOrderId(order.id) === normalized,
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
  const normalized = normalizeSourceOrderId(value);
  if (!normalized) return null;

  return (
    loadPublicOrders().find((order) => {
      const matchesPublicId = normalizeSourceOrderId(order.sourceOrderId) === normalized;
      const matchesLegacyId = normalizeSourceOrderId(order.id) === normalized;
      if (!matchesPublicId && !matchesLegacyId) return false;
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

function createOrder(orderData) {
  const orders = loadOrders();
  const normalizedSourceOrderId = normalizeSourceOrderId(orderData.sourceOrderId);
  const currentRestaurantId =
    String(orderData.restaurantId || "").trim() || getCurrentRestaurantSession()?.restaurantId || DEFAULT_RESTAURANT_ID;

  if (sourceOrderIdExists(normalizedSourceOrderId)) {
    throw new Error("duplicate-source-order");
  }

  const nextIndex = getNextOrderIndex(orders);
  const order = {
    restaurantId: currentRestaurantId,
    id: buildOrderTrackingId(currentRestaurantId, normalizedSourceOrderId),
    orderNumber: `#${nextIndex}`,
    sourceOrderId: normalizedSourceOrderId,
    sourceSystem: String(orderData.sourceSystem || "").trim() || "Alta manual",
    customerName: String(orderData.customerName || "").trim() || "Cliente mostrador",
    items: String(orderData.items || "").trim() || "Pedido rápido",
    pickupPoint: String(orderData.pickupPoint || "").trim() || "Mostrador 1",
    status: "received",
    notes: String(orderData.notes || "").trim(),
    rating: null,
    createdAt: new Date().toISOString(),
    archivedAt: null,
    statusDurations: {},
    statusStartedAt: new Date().toISOString(),
  };

  const nextOrders = normalizeOrders([...orders, order]);
  saveOrders(nextOrders);
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

  const nextOrders = loadOrders().map((order) => (order.id === id ? { ...order, ...nextUpdates } : order));
  saveOrders(nextOrders);
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
      orderCount: restaurantOrders.length,
      activeOrderCount: restaurantOrders.filter((order) => !order.archivedAt).length,
      deliveredCount: deliveredOrders.length,
      avgDeliveryMinutes,
    };
  });

  const topRestaurant =
    [...restaurantsWithOrders].sort((left, right) => right.orderCount - left.orderCount)[0] || null;
  const soonToExpire = restaurants
    .filter((restaurant) => {
      const remainingDays = getRestaurantRemainingDays(restaurant);
      return remainingDays !== null && remainingDays >= 0 && remainingDays <= 7;
    })
    .length;

  return {
    totalRestaurants: restaurants.length,
    activeRestaurants: activeRestaurants.length,
    expiredRestaurants: expiredRestaurants.length,
    totalOrders: orders.length,
    activeOrders: orders.filter((order) => !order.archivedAt).length,
    deliveredOrders: orders.filter((order) => order.status === "delivered").length,
    cancelledOrders: orders.filter((order) => order.status === "cancelled").length,
    soonToExpire,
    topRestaurant,
  };
}

function buildRestaurantCredentialsEmail(restaurant) {
  const subject = `Acceso TurnoListo - ${restaurant.name}`;
  const body = [
    `Hola ${restaurant.ownerName || restaurant.name},`,
    "",
    "Te compartimos los datos de acceso a tu panel de restaurante en TurnoListo:",
    "",
    `Restaurante: ${restaurant.name}`,
    `Correo de acceso: ${restaurant.username}`,
    `Contrasena: ${restaurant.password}`,
    `Acceso activo hasta: ${formatAdminEmailDate(restaurant.activatedUntil)}`,
    "",
    "Importante: este correo debe existir en Firebase Authentication y su documento users/{uid} debe apuntar al restaurantId correcto.",
    "",
    "Enlace de acceso:",
    "./restaurant.html",
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

function formatAdminEmailDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function buildClientUrl(orderId) {
  const url = new URL("./client.html", window.location.href);
  url.searchParams.set("order", orderId);
  return url.toString();
}

function buildQrUrl(orderId) {
  const cacheKey = normalizeSourceOrderId(orderId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(buildClientUrl(orderId))}&cb=${encodeURIComponent(cacheKey)}`;
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

function broadcastOrdersChanged() {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { at: Date.now() } }));
  const channel = getSyncChannel();
  if (channel) {
    channel.postMessage({ type: "orders-updated", at: Date.now() });
  }
}

function getTrackingLookupKey(value) {
  const candidate = typeof value === "string" ? value : value?.sourceOrderId || value?.id;
  return normalizeSourceOrderId(candidate);
}

function buildTrackingLookup(trackingRecords) {
  return new Map(
    normalizePublicTracking(trackingRecords).flatMap((tracking) => {
      const keys = [getTrackingLookupKey(tracking.id), getTrackingLookupKey(tracking.sourceOrderId)].filter(Boolean);
      return keys.map((key) => [key, tracking]);
    }),
  );
}

function buildPublicTrackingRecord(order) {
  const existingTracking = buildTrackingLookup(cachedTracking).get(getTrackingLookupKey(order));

  return {
    id: order.id,
    restaurantId: order.restaurantId,
    sourceOrderId: order.sourceOrderId,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    pickupPoint: order.pickupPoint,
    status: order.status,
    rating: existingTracking?.rating || order.rating || null,
    createdAt: order.createdAt,
    archivedAt: order.archivedAt,
  };
}

function normalizePublicTracking(trackingRecords) {
  return [...trackingRecords]
    .map((tracking) => ({
      sourceOrderId: "",
      customerName: "",
      pickupPoint: "Mostrador 1",
      rating: null,
      archivedAt: null,
      ...tracking,
    }))
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
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
