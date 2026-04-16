const LAST_CLIENT_ORDER_STORAGE_KEY = "turnolisto-client-last-order";
const params = new URLSearchParams(window.location.search);
const initialOrderId = resolveInitialOrderId();

const orderInput = document.querySelector("#clientOrderInput");
const loadButton = document.querySelector("#clientLoadButton");
const ticketOrderId = document.querySelector("#clientOrderNumber");
const ticketCustomer = document.querySelector("#clientCustomer");
const statusPill = document.querySelector("#clientStatus");
const progressFill = document.querySelector("#clientProgress");
const progressSteps = document.querySelectorAll("#clientProgressSteps [data-step]");
const statsBlock = document.querySelector("#clientStats");
const queueCount = document.querySelector("#clientQueueCount");
const metaStrip = document.querySelector("#clientMetaStrip");
const etaValue = document.querySelector("#clientEtaValue");
const etaStat = document.querySelector("#clientEtaStat");
const clientBrand = document.querySelector("#clientBrand");
const clientBrandLogo = document.querySelector("#clientBrandLogo");
const clientBrandName = document.querySelector("#clientBrandName");
const qrImage = document.querySelector("#clientQrImage");
const qrValue = document.querySelector("#clientQrValue");
const qrHint = document.querySelector("#clientQrHint");
const readyBanner = document.querySelector("#clientReadyBanner");
const alertsBanner = document.querySelector("#clientAlertsBanner");
const alertsTitle = document.querySelector("#clientAlertsTitle");
const alertsStatus = document.querySelector("#clientAlertsStatus");
const enableAlertsButton = document.querySelector("#clientEnableAlertsButton");
const iosInstallBanner = document.querySelector("#clientIosInstallBanner");
const iosInstallTitle = document.querySelector("#clientIosInstallTitle");
const iosInstallText = document.querySelector("#clientIosInstallText");
const iosInstallButton = document.querySelector("#clientIosInstallButton");
const iosInstallSteps = document.querySelector("#clientIosInstallSteps");
const copyLinkButton = document.querySelector("#clientCopyLinkButton");
const iosStepCopy = document.querySelector("#clientIosStepCopy");
const iosStepSafari = document.querySelector("#clientIosStepSafari");
const iosStepShare = document.querySelector("#clientIosStepShare");
const iosStepInstall = document.querySelector("#clientIosStepInstall");
const iosStepOpen = document.querySelector("#clientIosStepOpen");
const alertsConfirmation = document.querySelector("#clientAlertsConfirmation");
const clientTicket = document.querySelector("#clientTicket");
const showQrButton = document.querySelector("#clientShowQrButton");
const qrModal = document.querySelector("#clientQrModal");
const qrBackdrop = document.querySelector("#clientQrBackdrop");
const qrCloseButton = document.querySelector("#clientQrClose");
const feedbackCard = document.querySelector("#clientFeedbackCard");
const ratingActions = document.querySelector("#clientRatingActions");
const ratingValue = document.querySelector("#clientRatingValue");
const feedbackComment = document.querySelector("#clientFeedbackComment");
const commentInput = document.querySelector("#clientCommentInput");
const commentSaveButton = document.querySelector("#clientCommentSave");
const commentSentMessage = document.querySelector("#clientCommentSentMessage");

let selectedOrderId = initialOrderId;
let orderInputDirty = false;
let lastRenderedStatus = null;
let currentOrder = null;
let pendingLowRatingScore = null;
let isSubmittingComment = false;
let readyToneAudioContext = null;
let readyToneEnabled = false;
let readyTonePrimed = false;
let readyToneStopTimer = 0;
let readyToneNodes = [];
let readyVibrationTimer = 0;
let lastReadyAlertMarker = "";
let pushNotificationsEnabled = false;
let pushNotificationToken = "";
let pushRegistrationOrderId = "";
let pushNotificationBusy = false;
let alertsDismissed = false;
let alertsStatusOverride = "";
let alertsButtonLockedReason = "";
let dynamicClientManifestUrl = "";
const SOUND_ENABLED_STORAGE_KEY = "turnolisto-client-ready-sound-enabled";
const PUSH_ENABLED_STORAGE_KEY = "turnolisto-client-push-enabled";
const PUSH_TOKEN_STORAGE_KEY = "turnolisto-client-push-token";
const PUSH_ORDER_STORAGE_KEY = "turnolisto-client-push-order";
const progressStatusOrder = ["received", "preparing", "ready", "delivered"];
const CLIENT_REFRESH_INTERVAL_MS = 4000;
const IS_IOS_DEVICE = /iPhone|iPad|iPod/i.test(String(window.navigator?.userAgent || ""));
const IS_IOS_STANDALONE =
  IS_IOS_DEVICE &&
  (window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator?.standalone === true);
const IS_IOS_CHROME = /CriOS/i.test(String(window.navigator?.userAgent || ""));
const translateText = (value) =>
  window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
const translateKey = (key, fallback = "") =>
  window.TurnoListoI18n?.translateKey ? window.TurnoListoI18n.translateKey(key, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const formatKey = (key, params = {}, fallback = "") =>
  window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;

function translateBuiltInOrderText(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return "";

  if (["Pedido rápido", "Alta manual", "Cliente mostrador"].includes(normalized)) {
    return translateText(normalized);
  }

  return normalized;
}

const CLIENT_STATUS_KEY_BY_STATUS = {
  received: "client.status.received",
  preparing: "client.status.preparing",
  ready: "client.status.ready",
  delivered: "client.status.delivered",
  cancelled: "client.dynamic.eta.cancelled",
};

const clientManifestLink = ensureClientManifestLink();

readyToneEnabled = window.localStorage.getItem(SOUND_ENABLED_STORAGE_KEY) === "true";
pushNotificationsEnabled = window.localStorage.getItem(PUSH_ENABLED_STORAGE_KEY) === "true";
pushNotificationToken = String(window.localStorage.getItem(PUSH_TOKEN_STORAGE_KEY) || "");
pushRegistrationOrderId = String(window.localStorage.getItem(PUSH_ORDER_STORAGE_KEY) || "");
alertsDismissed =
  readyToneEnabled &&
  pushNotificationsEnabled &&
  typeof Notification !== "undefined" &&
  Notification.permission === "granted";

["pointerdown", "touchstart", "keydown", "click"].forEach((eventName) => {
  window.addEventListener(
    eventName,
    () => {
      if (!readyToneEnabled) return;
      warmUpReadyTone().then(() => renderAlertsBanner());
    },
    { passive: true },
  );
});

initializeClientView();
onOrdersChanged(() => {
  waitForDataReady().then(renderClient);
});
window.addEventListener("turnolisto:language-change", () => {
  renderClient();
});
window.setInterval(() => {
  if (document.visibilityState !== "visible") return;
  if (!String(window.__turnoDataBackendMode || "").startsWith("firebase")) return;
  if (!shouldAutoRefreshClient()) return;
  refreshPublicTrackingFromBackend(selectedOrderId);
}, CLIENT_REFRESH_INTERVAL_MS);

loadButton.addEventListener("click", () => {
  void handleLoadOrder();
});
orderInput.addEventListener("focus", () => {
  orderInputDirty = true;
});
orderInput.addEventListener("input", () => {
  orderInputDirty = true;
  orderInput.setCustomValidity("");
});
orderInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadButton.click();
    return;
  }

  if (event.key === "Escape") {
    orderInputDirty = false;
    syncOrderInputValue(selectedOrderId);
    orderInput.blur();
  }
});
orderInput.addEventListener("blur", () => {
  const normalizedValue = orderInput.value.trim().toUpperCase();
  if (!normalizedValue || normalizedValue === selectedOrderId) {
    orderInputDirty = false;
    syncOrderInputValue(selectedOrderId);
  }
});

showQrButton.addEventListener("click", () => {
  if (showQrButton.disabled) return;
  qrModal.hidden = false;
});

qrBackdrop.addEventListener("click", closeQrModal);
qrCloseButton.addEventListener("click", closeQrModal);
ratingActions.addEventListener("click", (event) => {
  void handleRatingClick(event);
});
commentSaveButton.addEventListener("click", () => {
  void handleCommentSave();
});
enableAlertsButton.addEventListener("click", handleEnableAlerts);
iosInstallButton.addEventListener("click", toggleIosInstallSteps);
copyLinkButton.addEventListener("click", handleCopyCurrentOrderLink);

async function initializeClientView() {
  await waitForDataReady();

  if (String(window.__turnoDataBackendMode || "").startsWith("firebase")) {
    await refreshPublicTrackingFromBackend(selectedOrderId);
  }

  renderClient();
}

function setClientOrderLookupPending(isPending) {
  loadButton.disabled = isPending;
  loadButton.textContent = isPending
    ? translateKey("client.dynamic.order.loading", "Buscando...")
    : translateKey("client.tools.load", "Abrir");
}

function renderClient() {
  const order = getPublicOrderByPublicId(selectedOrderId);
  if (!order) {
    lastRenderedStatus = null;
    currentOrder = null;
    renderMissingOrder();
    return;
  }

  currentOrder = order;
  const previousStatus = lastRenderedStatus;
  const queue = getQueueBefore(order.id);
  const meta = statusMeta[order.status];
  const publicOrderId = order.publicTrackingToken || order.sourceOrderId || order.id;
  const sourceOrder = getOrderById(order.id) || getOrderByPublicId(publicOrderId);
  const restaurant = getRestaurantById(order.restaurantId || sourceOrder?.restaurantId);
  const publicRestaurantBrand = {
    ...restaurant,
    name: String(order.restaurantName || restaurant?.name || "").trim(),
    logoUrl: String(order.restaurantLogoUrl || restaurant?.logoUrl || "").trim(),
  };

  selectedOrderId = publicOrderId;
  rememberClientOrder(publicOrderId);
  syncClientInstallManifest(publicOrderId);
  syncOrderInputValue(publicOrderId);
  renderClientBrand(publicRestaurantBrand);
  ticketOrderId.textContent = order.orderNumber;
  ticketCustomer.textContent = translateBuiltInOrderText(order.customerName);
  statusPill.textContent = translateText(meta.label);
  statusPill.style.background = meta.bg;
  statusPill.style.color = meta.color;
  progressFill.style.width = `${getProgressWidth(order.status)}%`;
  renderProgressSteps(order.status);
  statsBlock.hidden = order.status === "delivered";
  queueCount.textContent = queue.length;
  const shouldShowEta = hasClientEta(order);
  metaStrip.hidden = !shouldShowEta;
  etaStat.hidden = !shouldShowEta;
  etaValue.textContent = shouldShowEta ? formatClientEta(order) : "--";
  qrImage.src = buildQrUrl(publicOrderId);
  qrValue.textContent = publicOrderId;
  qrHint.textContent =
    order.status === "delivered"
      ? translateKey("client.dynamic.qr.inactive.delivered", "Este QR ya no está activo.")
      : translateKey("client.dynamic.qr.hint", "Enseña este QR si lo necesitas.");
  readyBanner.hidden = order.status !== "ready";
  feedbackCard.hidden = order.status !== "delivered";
  clientTicket.classList.toggle("ticket--ready", order.status === "ready");
  clientTicket.classList.toggle("ticket--delivered", order.status === "delivered");
  showQrButton.disabled = order.status === "delivered";
  showQrButton.textContent =
    order.status === "delivered"
      ? translateKey("client.dynamic.qr.disabled", "QR desactivado")
      : translateKey("client.dynamic.qr.show", "Ver mi QR");
  renderRating(order);
  renderCommentPrompt(order);
  renderAlertsBanner();
  renderIosInstallBanner();
  syncPushRegistrationForCurrentOrder();

  triggerReadyCelebration(previousStatus, order.status);
  maybeSendNotification(order);
  lastRenderedStatus = order.status;
}

function shouldAutoRefreshClient() {
  const order = getPublicOrderByPublicId(selectedOrderId);
  if (!order) return true;
  return !["delivered", "cancelled"].includes(order.status);
}

function maybeSendNotification(order) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  if (!lastRenderedStatus || lastRenderedStatus === order.status || order.status !== "ready") {
    return;
  }

  new Notification(translateKey("client.dynamic.notification.ready.title", "Tu pedido ya esta listo para recoger"), {
    body: buildNotificationBody(order),
  });
}

async function handleLoadOrder() {
  const nextId = orderInput.value.trim().toUpperCase();
  let order = getPublicOrderByPublicId(nextId);

  if (!order && String(window.__turnoDataBackendMode || "").startsWith("firebase")) {
    setClientOrderLookupPending(true);
    try {
      await refreshPublicTrackingFromBackend(nextId);
      order = getPublicOrderByPublicId(nextId);
    } finally {
      setClientOrderLookupPending(false);
    }
  }

  if (!order) {
    const invalidOrderMessage = translateKey("client.dynamic.order.invalid", "Ese QR no existe o ya no está disponible.");
    orderInput.setCustomValidity(invalidOrderMessage);
    orderInput.reportValidity();
    showTurnoAlert(invalidOrderMessage, "warning", { timeoutMs: 3200 });
    return;
  }

  orderInput.setCustomValidity("");
  orderInputDirty = false;
  orderInput.value = nextId;
  if (nextId === selectedOrderId) {
    lastRenderedStatus = null;
    renderClient();
    return;
  }

  window.location.assign(buildClientUrl(nextId));
}

function renderMissingOrder() {
  ticketOrderId.textContent = translateKey("client.dynamic.order.unavailable.title", "Pedido no disponible");
  ticketCustomer.textContent = translateKey(
    "client.dynamic.order.unavailable.text",
    "Este seguimiento ya no está activo o fue archivado.",
  );
  renderClientBrand(null);
  statusPill.textContent = translateKey("client.dynamic.status.unavailable", "No disponible");
  statusPill.style.background = "rgba(29, 26, 22, 0.08)";
  statusPill.style.color = "#6e6258";
  progressFill.style.width = "0%";
  renderProgressSteps(null);
  statsBlock.hidden = false;
  metaStrip.hidden = false;
  etaStat.hidden = false;
  queueCount.textContent = "0";
  etaValue.textContent = "--";
  qrImage.removeAttribute("src");
  qrValue.textContent = selectedOrderId;
  qrHint.textContent = translateKey("client.dynamic.qr.unavailable", "Este QR ya no está disponible.");
  readyBanner.hidden = true;
  feedbackCard.hidden = true;
  clientTicket.classList.remove("ticket--ready");
  showQrButton.disabled = true;
  showQrButton.textContent = translateKey("client.dynamic.qr.unavailable.button", "QR no disponible");
  renderAlertsBanner();
  renderIosInstallBanner();
}

function renderClientBrand(restaurant) {
  const restaurantName = String(restaurant?.name || "").trim();
  const logoUrl = String(restaurant?.logoUrl || "").trim();
  clientBrand.hidden = !logoUrl && !restaurantName;

  if (!logoUrl) {
    clientBrandLogo.removeAttribute("src");
  } else {
    clientBrandLogo.src = logoUrl;
  }

  clientBrandName.textContent = restaurantName;
}

function syncOrderInputValue(value) {
  const normalizedValue = String(value || "").trim().toUpperCase();
  if (orderInputDirty && document.activeElement === orderInput) {
    return;
  }

  if (orderInput.value !== normalizedValue) {
    orderInput.value = normalizedValue;
  }
}

function resolveInitialOrderId() {
  const orderFromUrl = normalizePublicTrackingToken(params.get("order") || "");
  if (orderFromUrl) {
    rememberClientOrder(orderFromUrl);
    return orderFromUrl;
  }

  const isIosStandalone =
    /iPhone|iPad|iPod/i.test(String(window.navigator?.userAgent || "")) &&
    (window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator?.standalone === true);
  const storedOrderId = normalizePublicTrackingToken(window.localStorage.getItem(LAST_CLIENT_ORDER_STORAGE_KEY) || "");
  if (isIosStandalone && storedOrderId) {
    return storedOrderId;
  }

  return normalizePublicTrackingToken("TL-ANA2048Q2Z9");
}

function rememberClientOrder(orderId) {
  const normalizedOrderId = normalizePublicTrackingToken(orderId || "");
  if (!normalizedOrderId) return;
  window.localStorage.setItem(LAST_CLIENT_ORDER_STORAGE_KEY, normalizedOrderId);
}

function ensureClientManifestLink() {
  if (IS_IOS_DEVICE) return null;

  let manifestLink = document.querySelector("#clientManifestLink");
  if (manifestLink) return manifestLink;

  manifestLink = document.createElement("link");
  manifestLink.id = "clientManifestLink";
  manifestLink.rel = "manifest";
  manifestLink.href = "./manifest.webmanifest";
  document.head.append(manifestLink);
  return manifestLink;
}

function syncClientInstallManifest(orderId) {
  if (!clientManifestLink) return;

  const normalizedOrderId = normalizePublicTrackingToken(orderId || "");
  if (!normalizedOrderId) {
    clientManifestLink.href = "./manifest.webmanifest";
    return;
  }

  const manifest = {
    name: "TurnoListo",
    short_name: "TurnoListo",
    description: "Seguimiento de pedidos para cliente y restaurante en tiempo real.",
    start_url: buildClientUrl(normalizedOrderId),
    scope: "./",
    display: "standalone",
    background_color: "#f6efe6",
    theme_color: "#1f7a63",
    orientation: "portrait",
    icons: [
      {
        src: "./turnolisto-brand.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "./turnolisto-brand.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  if (dynamicClientManifestUrl) {
    URL.revokeObjectURL(dynamicClientManifestUrl);
  }

  dynamicClientManifestUrl = URL.createObjectURL(
    new Blob([JSON.stringify(manifest)], {
      type: "application/manifest+json",
    }),
  );
  clientManifestLink.href = dynamicClientManifestUrl;
}

function renderProgressSteps(status) {
  const currentIndex = status ? progressStatusOrder.indexOf(status) : -1;

  progressSteps.forEach((step, index) => {
    step.classList.toggle("is-complete", currentIndex >= index && currentIndex !== -1);
    step.classList.toggle("is-current", step.dataset.step === status);
  });
}

function getProgressWidth(status) {
  const currentIndex = progressStatusOrder.indexOf(status);
  if (currentIndex <= 0) return 0;
  return (currentIndex / (progressStatusOrder.length - 1)) * 100;
}

function buildNotificationBody(order) {
  if (order.status === "ready") {
    return formatKey("client.dynamic.notification.ready.body", { orderNumber: order.orderNumber }, `${order.orderNumber} ya está listo para recoger.`);
  }

  if (order.status === "delivered") {
    return formatKey("client.dynamic.notification.delivered.body", { orderNumber: order.orderNumber }, `${order.orderNumber} ya figura como entregado.`);
  }

  if (order.status === "cancelled") {
    return formatKey("client.dynamic.notification.cancelled.body", { orderNumber: order.orderNumber }, `${order.orderNumber} ha sido cancelado por el restaurante.`);
  }

  return formatKey(
    "client.dynamic.notification.status.body",
    {
      orderNumber: order.orderNumber,
      status: translateText(statusMeta[order.status].label).toLowerCase(),
    },
    `${order.orderNumber} ahora está en estado ${statusMeta[order.status].label.toLowerCase()}.`,
  );
}

function formatClientEta(order) {
  if (!order) return "--";
  if (order.status === "ready") return translateKey("client.dynamic.eta.ready", "Listo ahora");
  if (order.status === "delivered") return translateKey("client.dynamic.eta.delivered", "Entregado");
  if (order.status === "cancelled") return translateKey("client.dynamic.eta.cancelled", "Cancelado");

  const remainingMinutes = getRemainingEstimatedMinutes(order);
  if (remainingMinutes === null) return translateKey("client.dynamic.eta.empty", "Sin dato");
  if (remainingMinutes <= 0) return translateKey("client.dynamic.eta.late", "Con retraso");
  if (remainingMinutes === 1) return translateKey("client.dynamic.eta.minute", "1 min");
  return formatKey("client.dynamic.eta.minutes", { count: remainingMinutes }, `${remainingMinutes} min`);
}

function hasClientEta(order) {
  return Boolean(String(order?.promisedReadyAt || "").trim());
}

function triggerReadyCelebration(previousStatus, nextStatus) {
  const nextReadyMarker = nextStatus === "ready" ? String(currentOrder?.statusStartedAt || currentOrder?.updatedAt || "") : "";

  if (nextStatus !== "ready") {
    lastReadyAlertMarker = "";
    stopReadyTonePlayback();
    stopReadyVibration();
    document.body.classList.remove("celebration-active");
    return;
  }

  if (!previousStatus) {
    lastReadyAlertMarker = nextReadyMarker;
    return;
  }

  if (previousStatus === nextStatus && nextReadyMarker && nextReadyMarker === lastReadyAlertMarker) {
    return;
  }

  lastReadyAlertMarker = nextReadyMarker;
  playReadyTone();
  playReadyVibration();
  document.body.classList.remove("celebration-active");

  window.requestAnimationFrame(() => {
    document.body.classList.add("celebration-active");
  });

  window.setTimeout(() => {
    document.body.classList.remove("celebration-active");
  }, 3200);
}

function syncReadyTonePrimedState() {
  readyTonePrimed = Boolean(readyToneAudioContext && readyToneAudioContext.state === "running");
  return readyTonePrimed;
}

async function warmUpReadyTone() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  if (!readyToneAudioContext) {
    readyToneAudioContext = new AudioContextClass();
  }

  if (readyToneAudioContext.state === "suspended") {
    try {
      await readyToneAudioContext.resume();
    } catch {
      readyTonePrimed = false;
      return false;
    }
  }

  readyToneEnabled = true;
  syncReadyTonePrimedState();
  window.localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, "true");
  return readyTonePrimed;
}

async function handleEnableAlerts() {
  if (pushNotificationBusy) return;
  pushNotificationBusy = true;
  renderAlertsBanner();

  try {
    await warmUpReadyTone();
    alertsStatusOverride = "";
    alertsButtonLockedReason = "";
    let activationResult = await syncPushRegistrationForCurrentOrder({ force: true });
    if (
      !activationResult?.enabled &&
      activationResult?.reason === "missing-token" &&
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      activationResult = await syncPushRegistrationForCurrentOrder({ force: true, retryAfterGrant: true });
    }
    syncReadyTonePrimedState();
    alertsDismissed = readyToneEnabled && pushNotificationsEnabled;
  } catch (error) {
    console.error("No se pudieron activar los avisos del pedido.", error);
    pushNotificationsEnabled = false;
    alertsDismissed = false;
    alertsStatusOverride = translateKey(
      "client.dynamic.alerts.error.activation",
      "No se pudieron activar las notificaciones en este dispositivo. El sonido local seguira disponible en esta pantalla.",
    );
    alertsButtonLockedReason = "";
  } finally {
    pushNotificationBusy = false;
    renderAlertsBanner();
  }
}

async function syncPushRegistrationForCurrentOrder(options = {}) {
  if (!pushNotificationsEnabled && !options.force) return { enabled: false, reason: "not-requested" };
  if (!currentOrder || ["delivered", "cancelled"].includes(currentOrder.status)) {
    return { enabled: false, reason: "inactive-order" };
  }

  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.enableClientPushNotifications !== "function") {
    return { enabled: false, reason: "backend-unavailable" };
  }
  if (!options.force && pushRegistrationOrderId === currentOrder.id && pushNotificationToken) {
    return { enabled: true, token: pushNotificationToken, reused: true };
  }

  let result;
  try {
    result = await backend.enableClientPushNotifications({
      orderId: currentOrder.id,
      orderPublicId: currentOrder.publicTrackingToken || currentOrder.sourceOrderId || currentOrder.id,
      orderNumber: currentOrder.orderNumber,
    });
  } catch (error) {
    console.error("Fallo al registrar las notificaciones push del cliente.", error);
    result = { enabled: false, reason: "setup-failed" };
  }

  if (!result?.enabled) {
    pushNotificationsEnabled = false;
    window.localStorage.setItem(PUSH_ENABLED_STORAGE_KEY, "false");
    alertsDismissed = false;
    alertsButtonLockedReason = "";

    if (result?.reason === "missing-vapid-key") {
      alertsStatusOverride = translateKey(
        "client.dynamic.alerts.error.missing_vapid",
        "Falta configurar los avisos para que funcionen aunque uses otras apps en este dispositivo.",
      );
    } else if (result?.reason === "permission-denied") {
      alertsStatusOverride = translateKey(
        "client.dynamic.alerts.error.permission_denied",
        "Has bloqueado las notificaciones del navegador. Activalas en los permisos del sitio.",
      );
    } else if (result?.reason === "permission-dismissed") {
      alertsStatusOverride = translateKey(
        "client.dynamic.alerts.error.permission_dismissed",
        "No se activaron las notificaciones. Puedes volver a intentarlo cuando quieras.",
      );
    } else if (result?.reason === "unsupported-ios-browser") {
      alertsStatusOverride = translateKey(
        "client.dynamic.alerts.error.unsupported_ios",
        "TurnoListo sigue funcionando aqui. Si quieres avisos mientras usas otras apps, sigue los pasos de abajo en Safari.",
      );
      alertsButtonLockedReason = "unsupported-ios-browser";
    } else if (result?.reason === "unsupported") {
      alertsStatusOverride = translateKey(
        "client.dynamic.alerts.error.unsupported",
        "TurnoListo sigue funcionando aqui. Si quieres avisos mientras usas otras apps, sigue los pasos de abajo.",
      );
      alertsButtonLockedReason = "unsupported";
    } else if (result?.reason === "service-worker-timeout" || result?.reason === "token-timeout") {
      alertsStatusOverride = translateKey(
        "client.dynamic.alerts.error.timeout",
        "La activacion de avisos tardo demasiado en este dispositivo. Puedes seguir usando TurnoListo sin problema mientras dejes esta pantalla abierta.",
      );
    } else if (result?.reason === "missing-token" && options.retryAfterGrant) {
      alertsStatusOverride = translateKey(
        "client.dynamic.alerts.error.retry",
        "Estamos terminando de activar las notificaciones en este navegador. Intenta de nuevo en unos segundos si no se completa.",
      );
    } else {
      alertsStatusOverride = translateKey(
        "client.dynamic.alerts.error.generic",
        "No se pudo activar el aviso para cuando uses otras apps en este dispositivo. Aun asi, TurnoListo seguira funcionando en esta pantalla.",
      );
    }
    return { enabled: false, reason: result?.reason || "unknown" };
  }

  alertsStatusOverride = "";
  alertsButtonLockedReason = "";
  pushNotificationsEnabled = true;
  pushNotificationToken = String(result.token || "");
  pushRegistrationOrderId = currentOrder.id;
  window.localStorage.setItem(PUSH_ENABLED_STORAGE_KEY, "true");
  window.localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, pushNotificationToken);
  window.localStorage.setItem(PUSH_ORDER_STORAGE_KEY, pushRegistrationOrderId);
  alertsDismissed = readyToneEnabled && pushNotificationsEnabled;
  return { enabled: true, token: pushNotificationToken };
}

function renderAlertsBanner() {
  const alertLocked = ["ready", "delivered", "cancelled"].includes(currentOrder?.status || "");
  const hasNotificationApi = typeof Notification !== "undefined";
  const hasGrantedNotificationPermission = hasNotificationApi && Notification.permission === "granted";
  const notificationsActive = pushNotificationsEnabled && hasGrantedNotificationPermission;
  const alertsActive = readyToneEnabled && notificationsActive;
  alertsDismissed = alertsActive;
  const shouldHideBanner = alertsDismissed || ["delivered", "cancelled"].includes(currentOrder?.status || "");
  alertsBanner.hidden = shouldHideBanner;
  alertsConfirmation.hidden = !(notificationsActive && !["delivered", "cancelled"].includes(currentOrder?.status || ""));
  alertsConfirmation.textContent =
    notificationsActive && !readyTonePrimed
      ? translateKey("client.dynamic.alerts.confirmation.sound", "Tienes las notificaciones activadas. Toca una vez la pantalla para activar el sonido.")
      : translateKey("client.dynamic.alerts.confirmation.ready", "Tienes las notificaciones activadas.");

  if (alertsBanner.hidden) {
    enableAlertsButton.classList.remove("is-pending");
    enableAlertsButton.classList.remove("is-success");
    return;
  }

  if (pushNotificationBusy) {
    enableAlertsButton.disabled = true;
    enableAlertsButton.textContent = translateKey("client.dynamic.alerts.activating", "Activando...");
    enableAlertsButton.classList.add("is-pending");
    return;
  }

  if (alertsActive) {
    alertsTitle.textContent = translateKey("client.dynamic.alerts.enabled.title", "Avisos activados.");
    alertsStatus.textContent = alertLocked
      ? translateKey("client.dynamic.alerts.enabled.locked", "Este pedido ya quedó configurado para avisarte.")
      : getDefaultAlertsCopy({ pageWord: "pagina" });
    enableAlertsButton.textContent = translateKey("client.dynamic.alerts.button.enabled", "Avisos activados");
    enableAlertsButton.disabled = true;
    enableAlertsButton.classList.remove("is-pending");
    enableAlertsButton.classList.add("is-success");
    return;
  }

  alertsTitle.textContent = translateKey("client.alerts.title", "Activa los avisos del pedido.");
  if (alertsStatusOverride) {
    alertsStatus.textContent = alertsStatusOverride;
  } else if (hasNotificationApi && Notification.permission === "denied") {
    alertsStatus.textContent = translateKey(
      "client.dynamic.alerts.permission_denied",
      "Las notificaciones están bloqueadas en este navegador. Actívalas en los permisos del sitio.",
    );
  } else {
    alertsStatus.textContent = getDefaultAlertsCopy({ pageWord: "app" });
  }
  if (alertsButtonLockedReason === "unsupported-ios-browser") {
    alertsTitle.textContent = translateKey("client.dynamic.alerts.unsupported.title", "Los avisos no estan disponibles aqui.");
    enableAlertsButton.textContent = translateKey("client.dynamic.alerts.button.unsupported_ios", "Usa Safari y pantalla de inicio");
    enableAlertsButton.disabled = true;
  } else if (alertsButtonLockedReason === "unsupported") {
    alertsTitle.textContent = translateKey("client.dynamic.alerts.unsupported.title", "Los avisos no estan disponibles aqui.");
    enableAlertsButton.textContent = translateKey("client.dynamic.alerts.button.unsupported", "Avisos no disponibles aqui");
    enableAlertsButton.disabled = true;
  } else {
    enableAlertsButton.textContent = translateKey("client.alerts.button", "Activar avisos");
    enableAlertsButton.disabled = alertLocked;
  }
  enableAlertsButton.classList.remove("is-pending");
  enableAlertsButton.classList.remove("is-success");
}

function getDefaultAlertsCopy(options = {}) {
  const pageWord = options.pageWord === "pagina" ? "page" : "app";
  const deviceWord = IS_IOS_DEVICE ? "ios" : "other";
  return translateKey(
    `client.dynamic.alerts.default.${pageWord}.${deviceWord}`,
    pageWord === "page"
      ? IS_IOS_DEVICE
        ? "Recibiras sonido si tienes la pagina abierta, y notificacion si el movil esta bloqueado."
        : "Recibiras sonido y vibracion si tienes la pagina abierta, y notificacion si el movil esta bloqueado."
      : IS_IOS_DEVICE
        ? "Recibiras sonido si tienes la app abierta, y notificacion si el movil esta bloqueado."
        : "Recibiras sonido y vibracion si tienes la app abierta, y notificacion si el movil esta bloqueado.",
  );
}

function renderIosInstallBanner() {
  if (!iosInstallBanner) return;

  const isInactiveOrder = ["delivered", "cancelled"].includes(currentOrder?.status || "");
  const shouldShow = IS_IOS_DEVICE && !IS_IOS_STANDALONE && !isInactiveOrder;
  iosInstallBanner.hidden = !shouldShow;

  if (!shouldShow) {
    iosInstallSteps.hidden = true;
    return;
  }

  const iosInstallMode = getIosInstallMode();
  iosInstallTitle.textContent = translateKey("client.ios.title", "Mejora los avisos en tu iPhone.");
  iosInstallText.textContent =
    iosInstallMode === "chrome"
      ? translateKey("client.dynamic.ios.text.chrome", "Si quieres que TurnoListo te avise mientras usas otras apps, primero abre este pedido en Safari.")
      : translateKey("client.dynamic.ios.text.safari", "Si quieres que TurnoListo te avise mientras usas otras apps, anade este pedido a pantalla de inicio y abrelo desde ese icono.");
  iosInstallButton.textContent =
    iosInstallSteps.hidden
      ? iosInstallMode === "chrome"
        ? translateKey("client.dynamic.ios.button.chrome", "Abrir paso a paso en iPhone")
        : translateKey("client.dynamic.ios.button.safari", "Como anadirlo a pantalla de inicio")
      : translateKey("client.dynamic.ios.button.hide", "Ocultar pasos");

  if (copyLinkButton) {
    copyLinkButton.hidden = iosInstallMode !== "chrome";
  }
  if (iosStepCopy) {
    iosStepCopy.hidden = iosInstallMode !== "chrome";
    iosStepCopy.textContent = translateKey("client.dynamic.ios.step.copy", "1. Copia el enlace de este pedido.");
  }
  if (iosStepSafari) {
    iosStepSafari.hidden = iosInstallMode !== "chrome";
    iosStepSafari.textContent = translateKey("client.dynamic.ios.step.safari", "2. Abre Safari y pega el enlace.");
  }
  if (iosStepShare) {
    iosStepShare.hidden = iosInstallMode === "chrome";
    iosStepShare.textContent = translateKey("client.dynamic.ios.step.share", "1. Toca Compartir.");
  }
  if (iosStepInstall) {
    iosStepInstall.hidden = iosInstallMode === "chrome";
    iosStepInstall.textContent = translateKey("client.dynamic.ios.step.install", '2. Elige "Anadir a pantalla de inicio".');
  }
  if (iosStepOpen) {
    iosStepOpen.hidden = iosInstallMode === "chrome";
    iosStepOpen.textContent = translateKey("client.dynamic.ios.step.open", '3. Abre TurnoListo desde el nuevo icono y toca "Activar avisos".');
  }
}

function getIosInstallMode() {
  if (IS_IOS_CHROME) return "chrome";
  return "safari";
}

function toggleIosInstallSteps() {
  if (!iosInstallSteps || iosInstallBanner.hidden) return;
  iosInstallSteps.hidden = !iosInstallSteps.hidden;
  renderIosInstallBanner();
}

async function handleCopyCurrentOrderLink() {
  const orderId = currentOrder?.publicTrackingToken || currentOrder?.sourceOrderId || selectedOrderId;
  const linkToCopy = buildClientUrl(orderId);

  try {
    await navigator.clipboard.writeText(linkToCopy);
    showTurnoAlert(translateKey("client.dynamic.link.copied", "Enlace copiado. Ahora puedes pegarlo en Safari."), "success", { timeoutMs: 3200 });
  } catch {
    showTurnoAlert(translateKey("client.dynamic.link.copy_failed", "No se pudo copiar automaticamente. Copia la URL desde la barra del navegador."), "warning", {
      timeoutMs: 4200,
    });
  }
}

async function playReadyTone() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!readyToneAudioContext) {
    readyToneAudioContext = new AudioContextClass();
  }

  if (!readyToneEnabled || readyToneAudioContext.state !== "running") {
    syncReadyTonePrimedState();
    renderAlertsBanner();
    return;
  }
  syncReadyTonePrimedState();
  stopReadyTonePlayback();

  const now = readyToneAudioContext.currentTime;
  const noteFrequencies = [659.25, 880.0, 987.77, 880.0, 659.25, 880.0, 987.77, 1046.5, 987.77];
  const noteSpacing = 0.24;
  const noteDuration = 0.58;
  const finalStopAt = now + noteSpacing * (noteFrequencies.length - 1) + noteDuration + 0.2;
  const masterGain = readyToneAudioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
  masterGain.gain.setValueAtTime(0.12, finalStopAt - 0.18);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, finalStopAt);
  masterGain.connect(readyToneAudioContext.destination);
  readyToneNodes = [masterGain];

  noteFrequencies.forEach((frequency, index) => {
    const oscillator = readyToneAudioContext.createOscillator();
    const gain = readyToneAudioContext.createGain();
    const startAt = now + index * noteSpacing;
    const peakAt = startAt + 0.04;
    const endAt = startAt + noteDuration;

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(index % 3 === 0 ? 0.2 : 0.16, peakAt);
    gain.gain.exponentialRampToValueAtTime(0.03, startAt + noteDuration * 0.72);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(startAt);
    oscillator.stop(endAt);
    readyToneNodes.push(oscillator, gain);
  });

  readyToneStopTimer = window.setTimeout(() => {
    readyToneNodes = [];
    readyToneStopTimer = 0;
  }, (finalStopAt - now) * 1000 + 120);
}

function playReadyVibration() {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }

  stopReadyVibration();
  navigator.vibrate([220, 120, 220, 120, 320]);
  readyVibrationTimer = window.setTimeout(() => {
    readyVibrationTimer = 0;
  }, 1000);
}

function stopReadyTonePlayback() {
  if (readyToneStopTimer) {
    window.clearTimeout(readyToneStopTimer);
    readyToneStopTimer = 0;
  }

  readyToneNodes.forEach((node) => {
    try {
      if (typeof node.stop === "function") {
        node.stop();
      }
    } catch {}

    try {
      if (typeof node.disconnect === "function") {
        node.disconnect();
      }
    } catch {}
  });

  readyToneNodes = [];
}

function stopReadyVibration() {
  if (readyVibrationTimer) {
    window.clearTimeout(readyVibrationTimer);
    readyVibrationTimer = 0;
  }

  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }

  navigator.vibrate(0);
}

function closeQrModal() {
  qrModal.hidden = true;
}

async function handleRatingClick(event) {
  const button = event.target.closest("[data-score]");
  if (!button || !currentOrder || currentOrder.status !== "delivered") {
    return;
  }

  const score = Number(button.dataset.score);
  if (currentOrder.rating?.comment) {
    return;
  }

  if (score <= 2) {
    pendingLowRatingScore = score;
    renderRating(currentOrder);
    renderCommentPrompt(currentOrder);
    return;
  }

  pendingLowRatingScore = null;
  await submitOrderRating(currentOrder.id, score);
  renderClient();
}

function renderRating(order) {
  const displayedScore = pendingLowRatingScore || order.rating?.score || 0;

  ratingValue.textContent = order.rating
    ? formatKey("client.dynamic.rating.current", { rating: formatRating(order.rating.score) }, `Tu valoración: ${formatRating(order.rating.score)}`)
    : pendingLowRatingScore
      ? formatKey("client.dynamic.rating.selected", { rating: formatRating(pendingLowRatingScore) }, `Valoración seleccionada: ${formatRating(pendingLowRatingScore)}`)
      : translateKey("client.dynamic.rating.prompt", "Selecciona una puntuación del 1 al 5");

  ratingActions.querySelectorAll("[data-score]").forEach((button) => {
    const score = Number(button.dataset.score);
    button.classList.toggle("is-active", displayedScore === score);
    button.disabled = Boolean(order.rating?.comment);
  });
}

function renderCommentPrompt(order) {
  const currentScore = order.rating?.score || pendingLowRatingScore || 0;
  const hasSubmittedComment = Boolean(order.rating) && order.rating.score <= 2 && !pendingLowRatingScore;
  const needsComment = currentScore > 0 && currentScore <= 2;
  const shouldPreserveDraft = Boolean(pendingLowRatingScore) && !hasSubmittedComment;
  feedbackComment.hidden = !needsComment;
  if (!shouldPreserveDraft) {
    commentInput.value = order.rating?.comment || "";
  }
  commentInput.disabled = hasSubmittedComment;
  commentSaveButton.disabled = hasSubmittedComment || !pendingLowRatingScore || isSubmittingComment;
  commentSaveButton.textContent = hasSubmittedComment
    ? translateKey("client.dynamic.comment.sent", "Comentario enviado")
    : isSubmittingComment
      ? translateKey("client.dynamic.comment.sending", "Enviando...")
      : translateKey("client.dynamic.comment.button", "Enviar comentario");
  commentSaveButton.classList.toggle("is-success", hasSubmittedComment);
  commentSentMessage.hidden = !hasSubmittedComment;
}

async function handleCommentSave() {
  if (!currentOrder || !pendingLowRatingScore || pendingLowRatingScore > 2 || isSubmittingComment) {
    return;
  }

  isSubmittingComment = true;
  renderCommentPrompt(currentOrder);
  await submitOrderRatingFeedback(currentOrder.id, pendingLowRatingScore, commentInput.value);
  isSubmittingComment = false;
  pendingLowRatingScore = null;
  renderClient();
}
