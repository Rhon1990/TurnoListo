const params = new URLSearchParams(window.location.search);
const initialOrderId = (params.get("order") || "POS-801").toUpperCase();

const orderInput = document.querySelector("#clientOrderInput");
const loadButton = document.querySelector("#clientLoadButton");
const ticketOrderId = document.querySelector("#clientOrderNumber");
const ticketCustomer = document.querySelector("#clientCustomer");
const statusPill = document.querySelector("#clientStatus");
const progressFill = document.querySelector("#clientProgress");
const progressSteps = document.querySelectorAll("#clientProgressSteps [data-step]");
const statsBlock = document.querySelector("#clientStats");
const queueCount = document.querySelector("#clientQueueCount");
const clientBrand = document.querySelector("#clientBrand");
const clientBrandLogo = document.querySelector("#clientBrandLogo");
const qrImage = document.querySelector("#clientQrImage");
const qrValue = document.querySelector("#clientQrValue");
const qrHint = document.querySelector("#clientQrHint");
const readyBanner = document.querySelector("#clientReadyBanner");
const alertsBanner = document.querySelector("#clientAlertsBanner");
const alertsTitle = document.querySelector("#clientAlertsTitle");
const alertsStatus = document.querySelector("#clientAlertsStatus");
const enableAlertsButton = document.querySelector("#clientEnableAlertsButton");
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
let lastReadyAlertMarker = "";
let pushNotificationsEnabled = false;
let pushNotificationToken = "";
let pushRegistrationOrderId = "";
let pushNotificationBusy = false;
let alertsDismissed = false;
const SOUND_ENABLED_STORAGE_KEY = "turnolisto-client-ready-sound-enabled";
const PUSH_ENABLED_STORAGE_KEY = "turnolisto-client-push-enabled";
const PUSH_TOKEN_STORAGE_KEY = "turnolisto-client-push-token";
const PUSH_ORDER_STORAGE_KEY = "turnolisto-client-push-order";
const progressStatusOrder = ["received", "preparing", "ready", "delivered"];
const CLIENT_REFRESH_INTERVAL_MS = 4000;

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
  const publicOrderId = order.sourceOrderId || order.id;
  const restaurant = getRestaurantById(order.restaurantId);

  selectedOrderId = publicOrderId;
  syncOrderInputValue(publicOrderId);
  renderClientBrand(restaurant);
  ticketOrderId.textContent = order.orderNumber;
  ticketCustomer.textContent = order.customerName;
  statusPill.textContent = meta.label;
  statusPill.style.background = meta.bg;
  statusPill.style.color = meta.color;
  progressFill.style.width = `${getProgressWidth(order.status)}%`;
  renderProgressSteps(order.status);
  statsBlock.hidden = order.status === "delivered";
  queueCount.textContent = queue.length;
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
  queueCount.textContent = "0";
  qrImage.removeAttribute("src");
  qrValue.textContent = selectedOrderId;
  qrHint.textContent = "Este QR ya no está disponible.";
  readyBanner.hidden = true;
  feedbackCard.hidden = true;
  clientTicket.classList.remove("ticket--ready");
  showQrButton.disabled = true;
  showQrButton.textContent = "QR no disponible";
  renderAlertsBanner();
}

function renderClientBrand(restaurant) {
  const logoUrl = String(restaurant?.logoUrl || "").trim();
  clientBrand.hidden = !logoUrl;

  if (!logoUrl) {
    clientBrandLogo.removeAttribute("src");
    return;
  }

  clientBrandLogo.src = logoUrl;
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
    return `${order.orderNumber} ya puede recogerse en ${order.pickupPoint}.`;
  }

  if (order.status === "delivered") {
    return `${order.orderNumber} ya figura como entregado.`;
  }

  if (order.status === "cancelled") {
    return `${order.orderNumber} ha sido cancelado por el restaurante.`;
  }

  return `${order.orderNumber} ahora está en estado ${statusMeta[order.status].label.toLowerCase()}.`;
}

function triggerReadyCelebration(previousStatus, nextStatus) {
  const nextReadyMarker = nextStatus === "ready" ? String(currentOrder?.statusStartedAt || currentOrder?.updatedAt || "") : "";

  if (nextStatus !== "ready") {
    lastReadyAlertMarker = "";
    stopReadyTonePlayback();
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
    let activationResult = await syncPushRegistrationForCurrentOrder({ force: true });
    if (!activationResult?.enabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      activationResult = await syncPushRegistrationForCurrentOrder({ force: true, retryAfterGrant: true });
    }
    syncReadyTonePrimedState();
    alertsDismissed = readyToneEnabled && pushNotificationsEnabled;
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

  const result = await backend.enableClientPushNotifications({
    orderId: currentOrder.id,
    orderPublicId: currentOrder.sourceOrderId || currentOrder.id,
    orderNumber: currentOrder.orderNumber,
    clientUrl: buildClientUrl(currentOrder.sourceOrderId || currentOrder.id),
  });

  if (!result?.enabled) {
    pushNotificationsEnabled = false;
    window.localStorage.setItem(PUSH_ENABLED_STORAGE_KEY, "false");
    alertsDismissed = false;

    if (result?.reason === "missing-vapid-key") {
      alertsStatus.textContent = "Falta configurar la clave web push de Firebase para activar avisos en segundo plano.";
    } else if (result?.reason === "permission-denied") {
      alertsStatus.textContent = "Has bloqueado las notificaciones del navegador. Actívalas en los permisos del sitio.";
    } else if (result?.reason === "permission-dismissed") {
      alertsStatus.textContent = "No se activaron las notificaciones. Puedes volver a intentarlo cuando quieras.";
    } else if (result?.reason === "missing-token" && options.retryAfterGrant) {
      alertsStatus.textContent = "Estamos terminando de activar las notificaciones en este navegador. Intenta de nuevo en unos segundos si no se completa.";
    } else {
      alertsStatus.textContent = "No se pudo activar la notificación en segundo plano en este dispositivo.";
    }
    return { enabled: false, reason: result?.reason || "unknown" };
  }

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
      : "Recibirás sonido si tienes la página abierta y notificación si el móvil está bloqueado.";
    enableAlertsButton.textContent = "Avisos activados";
    enableAlertsButton.disabled = true;
    enableAlertsButton.classList.remove("is-pending");
    enableAlertsButton.classList.add("is-success");
    return;
  }

  alertsTitle.textContent = "Activa los avisos del pedido.";
  if (Notification.permission === "denied") {
    alertsStatus.textContent = "Las notificaciones están bloqueadas en este navegador. Actívalas en los permisos del sitio.";
  } else {
    alertsStatus.textContent = "Recibirás sonido si tienes la app abierta y notificación si el móvil está bloqueado.";
  }
  enableAlertsButton.textContent = "Activar avisos";
  enableAlertsButton.disabled = alertLocked;
  enableAlertsButton.classList.remove("is-pending");
  enableAlertsButton.classList.remove("is-success");
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
