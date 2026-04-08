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
const clientManifestLink = document.querySelector("#clientManifestLink");

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

waitForDataReady().then(renderClient);
onOrdersChanged(() => {
  waitForDataReady().then(renderClient);
});
window.setInterval(() => {
  if (document.visibilityState !== "visible") return;
  if (!String(window.__turnoDataBackendMode || "").startsWith("firebase")) return;
  if (!shouldAutoRefreshClient()) return;
  refreshPublicTrackingFromBackend();
}, CLIENT_REFRESH_INTERVAL_MS);

loadButton.addEventListener("click", () => {
  const nextId = orderInput.value.trim().toUpperCase();
  if (!getPublicOrderByPublicId(nextId)) {
    orderInput.setCustomValidity("Ese QR no existe en la demo.");
    orderInput.reportValidity();
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

  const targetUrl = buildClientUrl(nextId);
  window.open(targetUrl, "_blank", "noopener,noreferrer");
  syncOrderInputValue(selectedOrderId);
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
ratingActions.addEventListener("click", handleRatingClick);
commentSaveButton.addEventListener("click", handleCommentSave);
enableAlertsButton.addEventListener("click", handleEnableAlerts);
iosInstallButton.addEventListener("click", toggleIosInstallSteps);
copyLinkButton.addEventListener("click", handleCopyCurrentOrderLink);

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
  ticketCustomer.textContent = order.customerName;
  statusPill.textContent = meta.label;
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
  qrHint.textContent = order.status === "delivered" ? "Este QR ya no está activo." : "Enseña este QR si lo necesitas.";
  readyBanner.hidden = order.status !== "ready";
  feedbackCard.hidden = order.status !== "delivered";
  clientTicket.classList.toggle("ticket--ready", order.status === "ready");
  clientTicket.classList.toggle("ticket--delivered", order.status === "delivered");
  showQrButton.disabled = order.status === "delivered";
  showQrButton.textContent = order.status === "delivered" ? "QR desactivado" : "Ver mi QR";
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

  if (!lastRenderedStatus || lastRenderedStatus === order.status) {
    return;
  }

  new Notification(`Estado actualizado: ${statusMeta[order.status].label}`, {
    body: buildNotificationBody(order),
  });
}

function renderMissingOrder() {
  ticketOrderId.textContent = "Pedido no disponible";
  ticketCustomer.textContent = "Este seguimiento ya no está activo o fue archivado.";
  renderClientBrand(null);
  statusPill.textContent = "No disponible";
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
  qrHint.textContent = "Este QR ya no está disponible.";
  readyBanner.hidden = true;
  feedbackCard.hidden = true;
  clientTicket.classList.remove("ticket--ready");
  showQrButton.disabled = true;
  showQrButton.textContent = "QR no disponible";
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

function syncClientInstallManifest(orderId) {
  if (!clientManifestLink) return;

  if (IS_IOS_DEVICE) {
    clientManifestLink.remove();
    return;
  }

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
    return `${order.orderNumber} ya está listo para recoger.`;
  }

  if (order.status === "delivered") {
    return `${order.orderNumber} ya figura como entregado.`;
  }

  if (order.status === "cancelled") {
    return `${order.orderNumber} ha sido cancelado por el restaurante.`;
  }

  return `${order.orderNumber} ahora está en estado ${statusMeta[order.status].label.toLowerCase()}.`;
}

function formatClientEta(order) {
  if (!order) return "--";
  if (order.status === "ready") return "Listo ahora";
  if (order.status === "delivered") return "Entregado";
  if (order.status === "cancelled") return "Cancelado";

  const remainingMinutes = getRemainingEstimatedMinutes(order);
  if (remainingMinutes === null) return "Sin dato";
  if (remainingMinutes <= 0) return "Con retraso";
  if (remainingMinutes === 1) return "1 min";
  return `${remainingMinutes} min`;
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
    alertsStatusOverride =
      "No se pudieron activar las notificaciones en este dispositivo. El sonido local seguira disponible en esta pantalla.";
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
      clientUrl: buildClientUrl(currentOrder.publicTrackingToken || currentOrder.sourceOrderId || currentOrder.id),
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
      alertsStatusOverride = "Falta configurar los avisos para que funcionen aunque uses otras apps en este dispositivo.";
    } else if (result?.reason === "permission-denied") {
      alertsStatusOverride = "Has bloqueado las notificaciones del navegador. Activalas en los permisos del sitio.";
    } else if (result?.reason === "permission-dismissed") {
      alertsStatusOverride = "No se activaron las notificaciones. Puedes volver a intentarlo cuando quieras.";
    } else if (result?.reason === "unsupported-ios-browser") {
      alertsStatusOverride =
        "No te preocupes: TurnoListo sigue funcionando; solo no cierres ni minimices esta pantalla si quieres seguir escuchando el aviso cuando tu pedido este listo, y si quieres que te avise mientras usas otras apps, sigue los pasos de abajo y abre TurnoListo desde Safari en la pantalla de inicio.";
      alertsButtonLockedReason = "unsupported-ios-browser";
    } else if (result?.reason === "unsupported") {
      alertsStatusOverride =
        "No te preocupes: TurnoListo sigue funcionando; solo no cierres ni minimices esta pantalla si quieres seguir escuchando el aviso cuando tu pedido este listo, y si quieres que te avise mientras usas otras apps, sigue los pasos de abajo.";
      alertsButtonLockedReason = "unsupported";
    } else if (result?.reason === "service-worker-timeout" || result?.reason === "token-timeout") {
      alertsStatusOverride =
        "La activacion de avisos tardo demasiado en este dispositivo. Puedes seguir usando TurnoListo sin problema mientras dejes esta pantalla abierta.";
    } else if (result?.reason === "missing-token" && options.retryAfterGrant) {
      alertsStatusOverride =
        "Estamos terminando de activar las notificaciones en este navegador. Intenta de nuevo en unos segundos si no se completa.";
    } else {
      alertsStatusOverride =
        "No se pudo activar el aviso para cuando uses otras apps en este dispositivo. Aun asi, TurnoListo seguira funcionando en esta pantalla.";
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
  const hasGrantedNotificationPermission = typeof Notification !== "undefined" && Notification.permission === "granted";
  const notificationsActive = pushNotificationsEnabled && hasGrantedNotificationPermission;
  const alertsActive = readyToneEnabled && notificationsActive;
  alertsDismissed = alertsActive;
  const shouldHideBanner = alertsDismissed || ["delivered", "cancelled"].includes(currentOrder?.status || "");
  alertsBanner.hidden = shouldHideBanner;
  alertsConfirmation.hidden = !(notificationsActive && !["delivered", "cancelled"].includes(currentOrder?.status || ""));
  alertsConfirmation.textContent =
    notificationsActive && !readyTonePrimed
      ? "Tienes las notificaciones activadas. Toca una vez la pantalla para activar el sonido."
      : "Tienes las notificaciones activadas.";

  if (alertsBanner.hidden) {
    enableAlertsButton.classList.remove("is-pending");
    enableAlertsButton.classList.remove("is-success");
    return;
  }

  if (pushNotificationBusy) {
    enableAlertsButton.disabled = true;
    enableAlertsButton.textContent = "Activando...";
    enableAlertsButton.classList.add("is-pending");
    return;
  }

  if (alertsActive) {
    alertsTitle.textContent = "Avisos activados.";
    alertsStatus.textContent = alertLocked
      ? "Este pedido ya quedó configurado para avisarte."
      : getDefaultAlertsCopy({ pageWord: "pagina" });
    enableAlertsButton.textContent = "Avisos activados";
    enableAlertsButton.disabled = true;
    enableAlertsButton.classList.remove("is-pending");
    enableAlertsButton.classList.add("is-success");
    return;
  }

  alertsTitle.textContent = "Activa los avisos del pedido.";
  if (alertsStatusOverride) {
    alertsStatus.textContent = alertsStatusOverride;
  } else if (Notification.permission === "denied") {
    alertsStatus.textContent = "Las notificaciones están bloqueadas en este navegador. Actívalas en los permisos del sitio.";
  } else {
    alertsStatus.textContent = getDefaultAlertsCopy({ pageWord: "app" });
  }
  if (alertsButtonLockedReason === "unsupported-ios-browser") {
    alertsTitle.textContent = "Los avisos no estan disponibles aqui.";
    enableAlertsButton.textContent = "Usa Safari y pantalla de inicio";
    enableAlertsButton.disabled = true;
  } else if (alertsButtonLockedReason === "unsupported") {
    alertsTitle.textContent = "Los avisos no estan disponibles aqui.";
    enableAlertsButton.textContent = "Avisos no disponibles aqui";
    enableAlertsButton.disabled = true;
  } else {
    enableAlertsButton.textContent = "Activar avisos";
    enableAlertsButton.disabled = alertLocked;
  }
  enableAlertsButton.classList.remove("is-pending");
  enableAlertsButton.classList.remove("is-success");
}

function getDefaultAlertsCopy(options = {}) {
  const pageWord = options.pageWord === "pagina" ? "pagina" : "app";
  const appReference = pageWord === "pagina" ? "la pagina abierta" : "la app abierta";

  if (IS_IOS_DEVICE) {
    return `Recibiras sonido si tienes ${appReference}, y notificacion si el movil esta bloqueado.`;
  }

  return `Recibiras sonido y vibracion si tienes ${appReference}, y notificacion si el movil esta bloqueado.`;
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

  iosInstallTitle.textContent = "Mejora los avisos en tu iPhone.";
  iosInstallText.textContent = IS_IOS_CHROME
    ? "Abre este pedido en Safari, borra cualquier icono anterior de TurnoListo y anadelo de nuevo a pantalla de inicio. Desde ahi podra avisarte mejor con sonido y notificaciones."
    : "Borra cualquier icono anterior de TurnoListo, anade este pedido a pantalla de inicio y abrelo desde ese icono. Asi los avisos en iPhone funcionaran mejor.";
  iosInstallButton.textContent = iosInstallSteps.hidden ? "Como activarlo en iPhone" : "Ocultar pasos";
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
    showTurnoAlert("Enlace copiado. Ahora puedes pegarlo en Safari.", "success", { timeoutMs: 3200 });
  } catch {
    showTurnoAlert("No se pudo copiar automaticamente. Copia la URL desde la barra del navegador.", "warning", {
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

function handleRatingClick(event) {
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
  submitOrderRating(currentOrder.id, score);
  renderClient();
}

function renderRating(order) {
  const displayedScore = pendingLowRatingScore || order.rating?.score || 0;

  ratingValue.textContent = order.rating
    ? `Tu valoración: ${formatRating(order.rating.score)}`
    : pendingLowRatingScore
      ? `Valoración seleccionada: ${formatRating(pendingLowRatingScore)}`
      : "Selecciona una puntuación del 1 al 5";

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
    ? "Comentario enviado"
    : isSubmittingComment
      ? "Enviando..."
      : "Enviar comentario";
  commentSaveButton.classList.toggle("is-success", hasSubmittedComment);
  commentSentMessage.hidden = !hasSubmittedComment;
}

function handleCommentSave() {
  if (!currentOrder || !pendingLowRatingScore || pendingLowRatingScore > 2 || isSubmittingComment) {
    return;
  }

  isSubmittingComment = true;
  renderCommentPrompt(currentOrder);
  submitOrderRatingFeedback(currentOrder.id, pendingLowRatingScore, commentInput.value);
  isSubmittingComment = false;
  pendingLowRatingScore = null;
  renderClient();
}
