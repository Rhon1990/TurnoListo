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
const qrImage = document.querySelector("#clientQrImage");
const qrValue = document.querySelector("#clientQrValue");
const qrHint = document.querySelector("#clientQrHint");
const readyBanner = document.querySelector("#clientReadyBanner");
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
let lastRenderedStatus = null;
let currentOrder = null;
let pendingLowRatingScore = null;
const progressStatusOrder = ["received", "preparing", "ready", "delivered"];

renderClient();
onOrdersChanged(renderClient);

loadButton.addEventListener("click", () => {
  const nextId = orderInput.value.trim().toUpperCase();
  if (!getOrderByPublicId(nextId)) {
    orderInput.setCustomValidity("Ese QR no existe en la demo.");
    orderInput.reportValidity();
    return;
  }

  orderInput.setCustomValidity("");
  selectedOrderId = nextId;
  lastRenderedStatus = null;
  renderClient();
});

showQrButton.addEventListener("click", () => {
  if (showQrButton.disabled) return;
  qrModal.hidden = false;
});

qrBackdrop.addEventListener("click", closeQrModal);
qrCloseButton.addEventListener("click", closeQrModal);
ratingActions.addEventListener("click", handleRatingClick);
commentSaveButton.addEventListener("click", handleCommentSave);

function renderClient() {
  const order = getPublicOrderByPublicId(selectedOrderId);
  if (!order) {
    lastRenderedStatus = null;
    currentOrder = null;
    renderMissingOrder();
    return;
  }

  currentOrder = order;
  const queue = getQueueBefore(order.id);
  const meta = statusMeta[order.status];
  const publicOrderId = order.sourceOrderId || order.id;

  selectedOrderId = publicOrderId;
  orderInput.value = publicOrderId;
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

  triggerReadyCelebration(order.status);
  maybeSendNotification(order);
  lastRenderedStatus = order.status;
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

function triggerReadyCelebration(status) {
  if (status !== "ready") {
    document.body.classList.remove("celebration-active");
    return;
  }

  if (lastRenderedStatus === "ready") {
    return;
  }

  document.body.classList.remove("celebration-active");

  window.requestAnimationFrame(() => {
    document.body.classList.add("celebration-active");
  });

  window.setTimeout(() => {
    document.body.classList.remove("celebration-active");
  }, 3200);
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
  feedbackComment.hidden = !needsComment;
  commentInput.value = order.rating?.comment || "";
  commentInput.disabled = hasSubmittedComment;
  commentSaveButton.disabled = hasSubmittedComment || !pendingLowRatingScore;
  commentSentMessage.hidden = !hasSubmittedComment;
}

function handleCommentSave() {
  if (!currentOrder || !pendingLowRatingScore || pendingLowRatingScore > 2) {
    return;
  }

  submitOrderRatingFeedback(currentOrder.id, pendingLowRatingScore, commentInput.value);
  pendingLowRatingScore = null;
  renderClient();
}
