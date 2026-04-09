const restaurantLoginView = document.querySelector("#restaurantLoginView");
const restaurantWorkspace = document.querySelector("#restaurantWorkspace");
const restaurantLoginForm = document.querySelector("#restaurantLoginForm");
const restaurantLoginFeedback = document.querySelector("#restaurantLoginFeedback");
const restaurantLoginUsername = document.querySelector("#restaurantLoginUsername");
const restaurantLoginPassword = document.querySelector("#restaurantLoginPassword");
const restaurantLoginTogglePassword = document.querySelector("#restaurantLoginTogglePassword");
const restaurantBrand = document.querySelector("#restaurantBrand");
const restaurantBrandLogo = document.querySelector("#restaurantBrandLogo");
const restaurantBrandName = document.querySelector("#restaurantBrandName");
const restaurantHeroEyebrow = document.querySelector("#restaurantHeroEyebrow");
const restaurantSessionLabel = document.querySelector("#restaurantSessionLabel");
const restaurantLogoutButton = document.querySelector("#restaurantLogoutButton");
const restaurantList = document.querySelector("#restaurantOrders");
const activeCount = document.querySelector("#restaurantActiveCount");
const readyCount = document.querySelector("#restaurantReadyCount");
const archivedCount = document.querySelector("#restaurantArchivedCount");
const archivedList = document.querySelector("#restaurantArchivedOrders");
const quickCreateForm = document.querySelector("#quickCreateForm");
const quickCreateFeedback = document.querySelector("#quickCreateFeedback");
const restaurantModeStrip = document.querySelector(".mode-strip");
const restaurantModeStandard = document.querySelector("#restaurantModeStandard");
const restaurantModeCounter = document.querySelector("#restaurantModeCounter");
const restaurantModeTooltip = document.querySelector("#restaurantModeTooltip");
const restaurantTermTooltip = document.querySelector("#restaurantTermTooltip");
const activeSearchInput = document.querySelector("#activeSearchInput");
const activeStatusFilter = document.querySelector("#activeStatusFilter");
const activePriorityFilter = document.querySelector("#activePriorityFilter");
const activeSortOrder = document.querySelector("#activeSortOrder");
const focusChipCritical = document.querySelector("#focusChipCritical");
const focusChipDueSoon = document.querySelector("#focusChipDueSoon");
const focusChipReady = document.querySelector("#focusChipReady");
const focusChipCriticalValue = document.querySelector("#focusChipCriticalValue");
const focusChipDueSoonValue = document.querySelector("#focusChipDueSoonValue");
const focusChipReadyValue = document.querySelector("#focusChipReadyValue");
const archivedSearchInput = document.querySelector("#archivedSearchInput");
const archivedStatusFilter = document.querySelector("#archivedStatusFilter");
const archivedRatingFilter = document.querySelector("#archivedRatingFilter");
const sectionTabs = document.querySelectorAll("[data-section]");
const sectionPanels = document.querySelectorAll("[data-section-panel]");
const dashboardTotalToday = document.querySelector("#dashboardTotalToday");
const dashboardDeliveredToday = document.querySelector("#dashboardDeliveredToday");
const dashboardOnTimeRate = document.querySelector("#dashboardOnTimeRate");
const dashboardDelayedActive = document.querySelector("#dashboardDelayedActive");
const dashboardDelayedActiveAction = document.querySelector("#dashboardDelayedActiveAction");
const dashboardLongestWait = document.querySelector("#dashboardLongestWait");
const dashboardSlowestOrder = document.querySelector("#dashboardSlowestOrder");
const dashboardSlowestOrderHint = document.querySelector("#dashboardSlowestOrderHint");
const dashboardSlowestStatus = document.querySelector("#dashboardSlowestStatus");
const dashboardSlowestStatusHint = document.querySelector("#dashboardSlowestStatusHint");
const dashboardFeedbackCountCard = document.querySelector("#dashboardFeedbackCountCard");
const dashboardAiHighRisk = document.querySelector("#dashboardAiHighRisk");
const dashboardAiPressure = document.querySelector("#dashboardAiPressure");
const dashboardAiEtaGap = document.querySelector("#dashboardAiEtaGap");
const dashboardFeedbackCount = document.querySelector("#dashboardFeedbackCount");
const dashboardLowRatingCount = document.querySelector("#dashboardLowRatingCount");
const dashboardPeakHour = document.querySelector("#dashboardPeakHour");
const dashboardCancellationRate = document.querySelector("#dashboardCancellationRate");
const dashboardAvgResolution = document.querySelector("#dashboardAvgResolution");
const dashboardAiFocusOrder = document.querySelector("#dashboardAiFocusOrder");
const dashboardHeroLeadMetric = document.querySelector("#dashboardHeroLeadMetric");
const dashboardHeroLeadHint = document.querySelector("#dashboardHeroLeadHint");
const dashboardHeroActiveNow = document.querySelector("#dashboardHeroActiveNow");
const dashboardHeroReadyNow = document.querySelector("#dashboardHeroReadyNow");
const dashboardHeroRating = document.querySelector("#dashboardHeroRating");
const dashboardStatusDonut = document.querySelector("#dashboardStatusDonut");
const dashboardStatusBars = document.querySelector("#dashboardStatusBars");
const dashboardStatusPerformanceBars = document.querySelector("#dashboardStatusPerformanceBars");
const dashboardFeedbackDonut = document.querySelector("#dashboardFeedbackDonut");
const dashboardFeedbackBars = document.querySelector("#dashboardFeedbackBars");
const dashboardInsights = document.querySelector("#dashboardInsights");
const dashboardCardActiveNowHero = document.querySelector("#dashboardCardActiveNowHero");
const dashboardCardReadyNowHero = document.querySelector("#dashboardCardReadyNowHero");
const dashboardCardDelayedActive = document.querySelector("#dashboardCardDelayedActive");
const dashboardCardLongestWait = document.querySelector("#dashboardCardLongestWait");
const dashboardCardSlowestOrder = document.querySelector("#dashboardCardSlowestOrder");
const dashboardCardSlowestStatus = document.querySelector("#dashboardCardSlowestStatus");
const dashboardSignalFeedback = document.querySelector("#dashboardSignalFeedback");
const dashboardSignalFeedbackHero = document.querySelector("#dashboardSignalFeedbackHero");
const dashboardSignalLowRating = document.querySelector("#dashboardSignalLowRating");
const dashboardSignalCancellation = document.querySelector("#dashboardSignalCancellation");
const commentModal = document.querySelector("#restaurantCommentModal");
const commentBackdrop = document.querySelector("#restaurantCommentBackdrop");
const commentClose = document.querySelector("#restaurantCommentClose");
const commentTitle = document.querySelector("#restaurantCommentTitle");
const commentMeta = document.querySelector("#restaurantCommentMeta");
const commentBody = document.querySelector("#restaurantCommentBody");
const cancelModal = document.querySelector("#restaurantCancelModal");
const cancelBackdrop = document.querySelector("#restaurantCancelBackdrop");
const cancelClose = document.querySelector("#restaurantCancelClose");
const cancelBack = document.querySelector("#restaurantCancelBack");
const cancelConfirm = document.querySelector("#restaurantCancelConfirm");
const cancelMeta = document.querySelector("#restaurantCancelMeta");

let expandedOrderId = null;
let editingOrderId = null;
let pendingCancelOrderId = null;
let pendingCancelOrderLabel = "";
let activeSection = "orders";
let lastDashboardStats = null;
let restaurantDisplayMode = window.localStorage.getItem("turnolisto-restaurant-display-mode") || "standard";
let restaurantModeTooltipTimer = 0;
let restaurantTermTooltipTimer = 0;

initializeRestaurantFirebaseAuth();
waitForDataReady().then(bootRestaurantPage);
window.setInterval(() => {
  if (getCurrentRestaurantSession()) {
    waitForDataReady().then(renderRestaurant);
  }
}, 1000);
onOrdersChanged(() => {
  waitForDataReady().then(renderRestaurant);
});
quickCreateForm.addEventListener("submit", handleCreateOrder);
restaurantModeStandard.addEventListener("click", () => setRestaurantDisplayMode("standard"));
restaurantModeCounter.addEventListener("click", () => setRestaurantDisplayMode("counter"));
[restaurantModeStandard, restaurantModeCounter].forEach((button) => {
  button.addEventListener("mouseenter", () => scheduleRestaurantModeTooltip(button));
  button.addEventListener("mouseleave", hideRestaurantModeTooltip);
});
restaurantLoginForm.addEventListener("submit", handleRestaurantLogin);
restaurantLoginTogglePassword.addEventListener("click", (event) => {
  event.preventDefault();
  togglePasswordVisibility(restaurantLoginPassword, restaurantLoginTogglePassword);
});
restaurantLogoutButton.addEventListener("click", handleRestaurantLogout);
[
  activeSearchInput,
  activeStatusFilter,
  activePriorityFilter,
  activeSortOrder,
  archivedSearchInput,
  archivedStatusFilter,
  archivedRatingFilter,
].forEach((control) => {
  control.addEventListener("input", renderRestaurant);
  control.addEventListener("change", renderRestaurant);
});
sectionTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.section || "orders");
  });
});
commentBackdrop.addEventListener("click", closeCommentModal);
commentClose.addEventListener("click", closeCommentModal);
cancelBackdrop.addEventListener("click", closeCancelModal);
cancelClose.addEventListener("click", closeCancelModal);
cancelBack.addEventListener("click", closeCancelModal);
cancelConfirm.addEventListener("click", confirmCancelOrder);
bindDashboardAction(dashboardCardActiveNowHero, () => goToOrdersView({ status: "all", priority: "all", search: "" }));
bindDashboardAction(dashboardCardReadyNowHero, () => goToOrdersView({ status: "ready", priority: "all", search: "" }));
bindDashboardAction(dashboardCardDelayedActive, () => goToOrdersView({ status: "all", priority: "delayed", search: "" }));
bindDashboardAction(dashboardCardLongestWait, () => focusSlowestOrder());
bindDashboardAction(dashboardCardSlowestOrder, () => focusSlowestOrder());
bindDashboardAction(dashboardCardSlowestStatus, () => focusSlowestStatus());
bindDashboardAction(dashboardSignalFeedback, () => goToHistoryView({ status: "all", rating: "commented", search: "" }));
bindDashboardAction(dashboardSignalFeedbackHero, () =>
  goToHistoryView({ status: "all", rating: "commented", search: "" }),
);
bindDashboardAction(dashboardSignalLowRating, () => goToHistoryView({ status: "all", rating: "low", search: "" }));
bindDashboardAction(dashboardSignalCancellation, () => goToHistoryView({ status: "cancelled", rating: "all", search: "" }));
focusChipCritical.addEventListener("click", () => goToOrdersView({ status: "all", priority: "critical", search: "" }));
focusChipDueSoon.addEventListener("click", () => goToOrdersView({ status: "all", priority: "due-soon", search: "" }));
focusChipReady.addEventListener("click", () => goToOrdersView({ status: "ready", priority: "ready-waiting", search: "" }));

function bootRestaurantPage() {
  initializeRestaurantTermHints(document.querySelector("#restaurantWorkspace"));
  syncRestaurantAccess();
  if (getCurrentRestaurantSession()) {
    renderRestaurant();
  }
}

function initializeRestaurantTermHints(root = document) {
  if (!root) return;
  root.querySelectorAll(".term-hint[data-term-hint]").forEach((element) => {
    const hint = String(element.dataset.termHint || "").trim();
    if (hint) {
      element.setAttribute("title", hint);
      element.setAttribute("aria-label", hint);
    }
  });
}

function bindDashboardAction(element, handler) {
  if (!element) return;
  element.addEventListener("click", handler);
  if (!["BUTTON", "A"].includes(element.tagName)) {
    element.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handler();
    });
  }
}

function initializeRestaurantFirebaseAuth() {
  waitForFirebaseBackend().then((backend) => {
    if (!backend?.enabled || typeof backend.onAuthStateChanged !== "function") return;

    backend.onAuthStateChanged(async (user) => {
      if (!user?.email) {
        clearCurrentUserProfile();
        clearCurrentRestaurantSession();
        syncRestaurantAccess();
        return;
      }

      await reconnectDataStoreToFirebase();
      const profile = await loadCurrentUserProfileFromBackend();
      const restaurant =
        profile?.role === "restaurant" && profile.restaurantId ? getRestaurantById(profile.restaurantId) : null;

      if (!restaurant || !isRestaurantAccessActive(restaurant)) {
        clearCurrentRestaurantSession();
        restaurantLoginFeedback.textContent =
          profile?.role && profile.role !== "restaurant"
            ? "Esta ventana ha heredado una sesion que no es de restaurante. Inicia sesion aqui con la cuenta del local."
            : "Tu cuenta no tiene un perfil valido en users/{uid} o el restaurante asignado no esta activo.";
        restaurantLoginFeedback.className = "form-feedback form-feedback--error";
        restaurantLoginFeedback.hidden = false;
        showTurnoAlert(
          profile?.role && profile.role !== "restaurant"
            ? "Esta ventana necesita una sesion propia del restaurante y no cerrara la sesion del admin."
            : "Tu cuenta no tiene acceso valido al restaurante asignado.",
          "error",
        );
        syncRestaurantAccess();
        return;
      }

      setCurrentRestaurantSession(restaurant);
      restaurantLoginFeedback.hidden = true;
      restaurantLoginFeedback.textContent = "";
      syncRestaurantAccess();
      renderRestaurant();
    });
  });
}

function syncRestaurantAccess() {
  const session = getCurrentRestaurantSession();
  const restaurant = session ? getRestaurantById(session.restaurantId) : null;
  const isAuthenticated = Boolean(session && restaurant && isRestaurantAccessActive(restaurant));

  if (session && (!restaurant || !isRestaurantAccessActive(restaurant))) {
    clearCurrentRestaurantSession();
  }

  restaurantLoginView.hidden = isAuthenticated;
  restaurantWorkspace.hidden = !isAuthenticated;

  if (restaurant) {
    restaurantSessionLabel.textContent = restaurant.name;
    renderRestaurantBrand(restaurant);
    return;
  }

  renderRestaurantBrand(null);
}

function renderRestaurant() {
  const session = getCurrentRestaurantSession();
  if (!session) {
    syncRestaurantAccess();
    return;
  }

  const restaurant = getRestaurantById(session.restaurantId);
  renderRestaurantBrand(restaurant);

  const allOrders = loadOrders();
  const orders = enrichOrdersWithIntelligence(
    [...getOperationalOrders()].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    { allOrders },
  );
  const archivedOrders = getArchivedOrders();
  const filteredOrders = orders
    .filter((order) => matchesActiveFilters(order))
    .sort(compareActiveOrders);
  const filteredArchivedOrders = archivedOrders.filter((order) => matchesArchivedFilters(order));
  const dashboard = getDashboardStats();
  lastDashboardStats = dashboard;

  restaurantList.innerHTML = "";
  archivedList.innerHTML = "";
  activeCount.textContent = getActiveOrderCount();
  readyCount.textContent = `${orders.filter((order) => order.status === "ready").length} listos`;
  archivedCount.textContent = `${archivedOrders.length} archivados`;
  syncRestaurantDisplayMode();
  renderFocusStrip(orders);
  syncSectionView();
  renderDashboard(dashboard);

  filteredOrders.forEach((order) => {
    restaurantList.append(buildOrderCard(order, false));
  });

  if (!filteredOrders.length) {
    restaurantList.append(buildEmptyState("No hay pedidos activos que coincidan con esos filtros."));
  }

  filteredArchivedOrders
    .sort((left, right) => new Date(right.archivedAt) - new Date(left.archivedAt))
    .forEach((order) => {
      archivedList.append(buildOrderCard(order, true));
    });

  if (!filteredArchivedOrders.length) {
    const hasArchivedFilters =
      String(archivedSearchInput.value || "").trim() ||
      (archivedStatusFilter.value || "all") !== "all" ||
      (archivedRatingFilter.value || "all") !== "all";
    archivedList.append(
      buildEmptyState(
        hasArchivedFilters
          ? "No hay pedidos archivados que coincidan con esos filtros."
          : "Aqui apareceran los pedidos entregados o cancelados.",
      ),
    );
  }
}

function setRestaurantDisplayMode(mode) {
  restaurantDisplayMode = mode === "counter" ? "counter" : "standard";
  window.localStorage.setItem("turnolisto-restaurant-display-mode", restaurantDisplayMode);

  if (restaurantDisplayMode === "counter") {
    activeSection = "orders";
    activeSortOrder.value = "urgency";
  }

  renderRestaurant();
}

function syncRestaurantDisplayMode() {
  const isCounterMode = restaurantDisplayMode === "counter";
  restaurantWorkspace.classList.toggle("restaurant-workspace--counter", isCounterMode);
  restaurantModeStandard.classList.toggle("is-active", !isCounterMode);
  restaurantModeCounter.classList.toggle("is-active", isCounterMode);
}

function scheduleRestaurantModeTooltip(button) {
  window.clearTimeout(restaurantModeTooltipTimer);
  restaurantModeTooltipTimer = window.setTimeout(() => {
    showRestaurantModeTooltip(button);
  }, 3000);
}

function showRestaurantModeTooltip(button) {
  const hint = String(button?.dataset.modeHint || "").trim();
  if (!hint) return;

  const rect = button.getBoundingClientRect();
  const stripRect = restaurantModeStrip.getBoundingClientRect();
  restaurantModeTooltip.textContent = hint;
  restaurantModeTooltip.hidden = false;
  restaurantModeTooltip.style.left = `${rect.left - stripRect.left + rect.width / 2}px`;
  restaurantModeTooltip.style.top = `${restaurantModeStrip.offsetHeight + 4}px`;
}

function hideRestaurantModeTooltip() {
  window.clearTimeout(restaurantModeTooltipTimer);
  restaurantModeTooltip.hidden = true;
  restaurantModeTooltip.textContent = "";
}

function renderRestaurantBrand(restaurant) {
  const logoUrl = String(restaurant?.logoUrl || "").trim();
  const hasLogo = Boolean(logoUrl);

  restaurantBrand.hidden = !hasLogo;
  restaurantHeroEyebrow.hidden = hasLogo;
  restaurantBrandName.textContent = restaurant?.name || "";

  if (!hasLogo) {
    restaurantBrandLogo.removeAttribute("src");
    return;
  }

  restaurantBrandLogo.src = logoUrl;
}

async function handleRestaurantLogin(event) {
  event.preventDefault();
  const formData = new FormData(restaurantLoginForm);
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const knownRestaurant = loadRestaurants().find(
    (item) => normalizeRestaurantUsername(item.username) === normalizeRestaurantUsername(username),
  );

  if (knownRestaurant && !isRestaurantAccessActive(knownRestaurant)) {
    restaurantLoginFeedback.textContent = "El acceso está vencido. Debe renovarse desde administración.";
    restaurantLoginFeedback.className = "form-feedback form-feedback--error";
    restaurantLoginFeedback.hidden = false;
    showTurnoAlert("El acceso de este restaurante esta vencido.", "warning");
    return;
  }

  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.signIn !== "function") {
    restaurantLoginFeedback.textContent = "Firebase Authentication no está disponible en esta configuración.";
    restaurantLoginFeedback.className = "form-feedback form-feedback--error";
    restaurantLoginFeedback.hidden = false;
    showTurnoAlert("Firebase Authentication no esta disponible en esta configuracion.", "error");
    return;
  }

  try {
    await backend.signIn(username, password, { persistence: "session" });
    restaurantLoginForm.reset();
    restaurantLoginUsername.focus();
  } catch (error) {
    console.error("No se pudo iniciar sesion con Firebase Authentication.", error);
    restaurantLoginFeedback.textContent =
      knownRestaurant
        ? "No se pudo iniciar sesion. Verifica que este correo exista en Firebase Authentication y que la clave coincida."
        : "Usuario o contrasena incorrectos.";
    restaurantLoginFeedback.className = "form-feedback form-feedback--error";
    restaurantLoginFeedback.hidden = false;
    showTurnoAlert("No se pudo iniciar sesion. Revisa credenciales, dominio autorizado y el perfil users/{uid}.", "error");
  }
}

async function handleRestaurantLogout() {
  const backend = await waitForFirebaseBackend();
  preparePrivateFirebaseSignOut();
  clearCurrentRestaurantSession();
  syncRestaurantAccess();

  if (backend?.enabled && typeof backend.signOut === "function") {
    await backend.signOut();
  }
}

function togglePasswordVisibility(input, button) {
  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.setAttribute("aria-label", shouldShow ? "Ocultar contraseña" : "Mostrar contraseña");
  button.classList.toggle("is-active", shouldShow);
}

function setActiveSection(section) {
  activeSection = section;
  syncSectionView();
}

function goToOrdersView({ status = "all", priority = "all", search = "" }) {
  activeSection = "orders";
  activeStatusFilter.value = status;
  activePriorityFilter.value = priority;
  activeSearchInput.value = search;
  renderRestaurant();
}

function goToHistoryView({ status = "all", rating = "all", search = "" }) {
  activeSection = "history";
  archivedStatusFilter.value = status;
  archivedRatingFilter.value = rating;
  archivedSearchInput.value = search;
  renderRestaurant();
}

function focusSlowestOrder() {
  const order = lastDashboardStats?.slowestOrder;
  if (!order) return;

  if (order.archivedAt) {
    goToHistoryView({
      status: order.status === "cancelled" ? "cancelled" : order.status === "delivered" ? "delivered" : "all",
      rating: "all",
      search: order.orderNumber,
    });
    return;
  }

  goToOrdersView({
    status: ["received", "preparing", "ready"].includes(order.status) ? order.status : "all",
    priority: "all",
    search: order.orderNumber,
  });
}

function focusSlowestStatus() {
  const slowestStatus = lastDashboardStats?.slowestStatus?.status;
  if (!slowestStatus) return;

  goToOrdersView({
    status: slowestStatus,
    priority: "all",
    search: "",
  });
}

function syncSectionView() {
  sectionTabs.forEach((button) => {
    const isActive = button.dataset.section === activeSection;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  sectionPanels.forEach((panel) => {
    const isActive = panel.dataset.sectionPanel === activeSection;
    panel.hidden = !isActive;
    panel.classList.toggle("restaurant-section--active", isActive);
  });
}

function renderDashboard(stats) {
  dashboardTotalToday.textContent = stats.totalToday;
  dashboardDeliveredToday.textContent = stats.deliveredToday;
  dashboardOnTimeRate.textContent = `${stats.onTimeRate}%`;
  dashboardDelayedActive.textContent = stats.delayedActive;
  dashboardDelayedActiveAction.textContent = stats.delayedActive;
  dashboardLongestWait.textContent = formatDurationMinutes(stats.longestActiveMinutes);
  dashboardSlowestOrder.textContent = stats.slowestOrder ? stats.slowestOrder.orderNumber : "Sin datos";
  dashboardSlowestOrderHint.textContent = stats.slowestOrder
    ? `${stats.slowestOrder.customerName} · ${formatDurationMinutes(getOrderDurationMinutes(stats.slowestOrder))}`
    : "Pedido con mayor espera activa";
  dashboardSlowestStatus.textContent = stats.slowestStatus ? stats.slowestStatus.label : "Sin datos";
  dashboardSlowestStatusHint.textContent = stats.slowestStatus
    ? `Promedio ${formatStatusDurationLabel(stats.slowestStatus.averageMinutes)}`
    : "Promedio por estado";
  dashboardFeedbackCountCard.textContent = stats.feedbackCount;
  dashboardAiHighRisk.textContent = stats.aiHighRiskCount;
  dashboardAiPressure.textContent = stats.aiPressureLabel;
  dashboardAiEtaGap.textContent = `${stats.aiAverageExtraMinutes} min`;
  dashboardFeedbackCount.textContent = stats.feedbackCount;
  dashboardLowRatingCount.textContent = stats.lowRatingCount;
  dashboardPeakHour.textContent = `Hora pico ${stats.peakHour}`;
  dashboardCancellationRate.textContent = `${stats.cancellationRate}%`;
  dashboardAvgResolution.textContent = stats.deliveredCount ? formatDurationMinutes(stats.avgResolutionMinutes) : "--:--";
  dashboardAiFocusOrder.textContent = stats.aiFocusOrder
    ? `${stats.aiFocusOrder.orderNumber} · ${formatAiRiskLabel(stats.aiFocusOrder.aiRiskLevel)}`
    : "Sin datos";
  dashboardHeroLeadMetric.textContent = stats.deliveredCount ? formatDurationMinutes(stats.avgDeliveredMinutes) : "--:--";
  dashboardHeroLeadHint.textContent = stats.deliveredCount
    ? `${stats.onTimeRate}% de pedidos entregados en 15 min o menos`
    : "En cuanto cierres pedidos aquí verás la velocidad real del local";
  dashboardHeroActiveNow.textContent = stats.activeNow;
  dashboardHeroReadyNow.textContent = stats.readyNow;
  dashboardHeroRating.textContent = stats.averageRating ? `${stats.averageRating} / 5` : "Sin datos";

  dashboardStatusDonut.innerHTML = "";
  dashboardStatusBars.innerHTML = "";
  dashboardStatusPerformanceBars.innerHTML = "";
  dashboardFeedbackDonut.innerHTML = "";
  dashboardFeedbackBars.innerHTML = "";
  dashboardInsights.innerHTML = "";

  renderDashboardDonut(
    dashboardStatusDonut,
    stats.throughputMix.map((item) => ({
      label: item.label,
      count: item.count,
      color: item.color,
    })),
    "Pedidos",
  );
  renderDashboardBarChart(
    dashboardStatusBars,
    stats.statusCounts.map((item) => ({
      label: item.label,
      count: item.count,
      color: item.color,
      valueLabel: String(item.count),
    })),
  );
  renderDashboardBarChart(
    dashboardStatusPerformanceBars,
    stats.statusPerformance
      .filter((item) => item.count > 0)
      .map((item) => ({
        label: item.label,
        count: item.averageMinutes,
        color: "#ec7c0d",
        valueLabel: formatStatusDurationLabel(item.averageMinutes),
      })),
    "Aún no hay suficiente histórico para medir tiempos por estado.",
  );
  renderDashboardBarChart(
    dashboardFeedbackBars,
    stats.feedbackMix.map((item) => ({
      label: item.label,
      count: item.count,
      color: item.color,
      valueLabel: String(item.count),
    })),
    "Todavía no hay feedback suficiente para construir esta lectura.",
  );
  renderDashboardDonut(
    dashboardFeedbackDonut,
    stats.feedbackMix.map((item) => ({
      label: item.label,
      count: item.count,
      color: item.color,
    })),
    "Feedback",
  );

  buildImprovementInsights(stats).forEach((message) => {
    const item = document.createElement("article");
    item.className = "dashboard-insight";
    item.textContent = message;
    dashboardInsights.append(item);
  });
}

function renderDashboardBarChart(container, items, emptyMessage = "Sin datos suficientes por ahora.") {
  container.innerHTML = "";
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const maxValue = safeItems.reduce((max, item) => Math.max(max, Number(item.count || 0)), 0);

  if (!safeItems.length || maxValue <= 0) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight";
    empty.textContent = emptyMessage;
    container.append(empty);
    return;
  }

  safeItems.forEach((item) => {
    const row = document.createElement("div");
    const label = document.createElement("div");
    const track = document.createElement("div");
    const fill = document.createElement("span");
    const value = document.createElement("strong");

    row.className = "dashboard-bar";
    label.className = "dashboard-bar__label";
    track.className = "dashboard-bar__track";
    value.className = "dashboard-bar__value";

    label.textContent = item.label;
    value.textContent = item.valueLabel || String(item.count || 0);
    fill.style.width = `${Math.max(10, Math.round((Number(item.count || 0) / maxValue) * 100))}%`;
    fill.style.background = item.color || "#ec7c0d";
    track.append(fill);
    row.append(label, track, value);
    container.append(row);
  });
}

function renderDashboardDonut(container, items, centerLabel) {
  container.innerHTML = "";
  const safeItems = Array.isArray(items) ? items.filter((item) => Number(item?.count || 0) > 0) : [];
  const total = safeItems.reduce((sum, item) => sum + Number(item.count || 0), 0);

  if (!total) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight dashboard-insight--empty-chart";
    empty.textContent = "Sin datos suficientes por ahora.";
    container.append(empty);
    return;
  }

  const chart = document.createElement("div");
  const center = document.createElement("div");
  const legend = document.createElement("div");
  let accumulated = 0;
  const segments = safeItems.map((item) => {
    const start = accumulated;
    const size = (Number(item.count || 0) / total) * 360;
    accumulated += size;
    return `${item.color || "#ec7c0d"} ${start}deg ${accumulated}deg`;
  });

  chart.className = "dashboard-donut__chart";
  chart.style.background = `conic-gradient(${segments.join(", ")})`;
  center.className = "dashboard-donut__center";
  center.innerHTML = `<span>${centerLabel}</span><strong>${total}</strong>`;
  chart.append(center);

  legend.className = "dashboard-donut__legend";
  safeItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "dashboard-donut__legend-row";
    row.innerHTML = `<span class="dashboard-donut__dot" style="background:${item.color || "#ec7c0d"}"></span><span>${item.label}</span><strong>${item.count}</strong>`;
    legend.append(row);
  });

  container.append(chart, legend);
}

function buildImprovementInsights(stats) {
  const insights = [];

  if (stats.aiHighRiskCount >= 1) {
    insights.push(
      `TurnoListo Intelligence detecta ${stats.aiHighRiskCount} pedido${stats.aiHighRiskCount === 1 ? "" : "s"} en riesgo alto. Conviene actuar antes de que impacten en experiencia o cancelaciones.`,
    );
  } else if (stats.aiAttentionCount >= 2) {
    insights.push("La IA ve varios pedidos bajo presión. Aun no están fuera de tiempo, pero la cola se está tensando.");
  }

  if (stats.aiAverageExtraMinutes >= 4) {
    insights.push("La predicción inteligente ya añade varios minutos sobre la promesa actual. Hay señales de saturación en cocina o entrega.");
  }

  if (stats.avgDeliveredMinutes >= 20) {
    insights.push("El tiempo medio de entrega está alto. Conviene revisar preparación y retirada para bajar la espera.");
  } else if (stats.deliveredCount > 0) {
    insights.push("El promedio de entrega va bien. Mantener este ritmo ayuda a reducir colas y mejorar percepción.");
  }

  if (stats.delayedActive >= 2) {
    insights.push("Hay varios pedidos activos con más de 15 minutos. Priorizar estos pedidos puede evitar reclamaciones.");
  }

  if (stats.onTimeRate > 0 && stats.onTimeRate < 70) {
    insights.push("Menos del 70% de los pedidos se entregan en 15 minutos. Aquí hay margen directo para mejorar la operación.");
  }

  if (stats.cancellationRate >= 10) {
    insights.push("La tasa de cancelación es relevante. Merece revisar retrasos, stock o comunicación con el cliente.");
  }

  if (stats.averageRating && Number(stats.averageRating) < 4) {
    insights.push("La valoración media está por debajo de 4. Revisar comentarios bajos puede señalar fallos repetidos.");
  } else if (stats.ratedCount > 0) {
    insights.push("La satisfacción del cliente es sólida. Pedir más valoraciones puede reforzar esta métrica.");
  }

  if (stats.lowRatingCount >= 2) {
    insights.push("Hay varias valoraciones bajas hoy. Conviene revisar esos casos antes de que se repitan en más clientes.");
  }

  if (!insights.length) {
    insights.push("Todavía hay pocos datos para detectar mejoras. En cuanto entren más pedidos, aquí verás patrones útiles.");
  }

  return insights.slice(0, 3);
}

function renderFocusStrip(orders) {
  const criticalOrders = orders.filter((order) => getOrderUrgencyLevel(order) === "critical").length;
  const dueSoonOrders = orders.filter((order) => getOrderUrgencyLevel(order) === "due-soon").length;
  const readyWaitingOrders = orders.filter((order) => order.status === "ready").length;

  focusChipCriticalValue.textContent = criticalOrders;
  focusChipDueSoonValue.textContent = dueSoonOrders;
  focusChipReadyValue.textContent = readyWaitingOrders;

  focusChipCritical.classList.toggle("is-active", activePriorityFilter.value === "critical");
  focusChipDueSoon.classList.toggle("is-active", activePriorityFilter.value === "due-soon");
  focusChipReady.classList.toggle("is-active", activePriorityFilter.value === "ready-waiting");
}

function matchesActiveFilters(order) {
  const search = String(activeSearchInput.value || "").trim().toLowerCase();
  const status = activeStatusFilter.value || "all";
  const priority = activePriorityFilter.value || "all";
  const orderTone = getElapsedOrderTone(order);
  const urgencyLevel = getOrderUrgencyLevel(order);

  if (search) {
    const haystack = [
      order.orderNumber,
      order.id,
      order.sourceOrderId,
      order.customerName,
      order.items,
      order.notes,
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) return false;
  }

  if (status !== "all" && order.status !== status) return false;
  if (priority === "delayed" && !["warning", "danger"].includes(orderTone)) return false;
  if (priority === "critical" && orderTone !== "danger") return false;
  if (priority === "due-soon" && urgencyLevel !== "due-soon") return false;
  if (priority === "ready-waiting" && order.status !== "ready") return false;
  if (priority === "normal" && orderTone !== "safe") return false;

  return true;
}

function compareActiveOrders(left, right) {
  const sortOrder = activeSortOrder.value || "urgency";
  if (sortOrder === "newest") {
    return new Date(right.createdAt) - new Date(left.createdAt);
  }

  if (sortOrder === "oldest") {
    return new Date(left.createdAt) - new Date(right.createdAt);
  }

  const aiPriorityDiff = Number(right.aiPriorityScore || 0) - Number(left.aiPriorityScore || 0);
  if (aiPriorityDiff !== 0) return aiPriorityDiff;

  const urgencyDiff = getOrderUrgencyRank(left) - getOrderUrgencyRank(right);
  if (urgencyDiff !== 0) return urgencyDiff;

  const etaLeft = getRemainingEstimatedMinutes(left);
  const etaRight = getRemainingEstimatedMinutes(right);
  const safeLeft = etaLeft === null ? Number.POSITIVE_INFINITY : etaLeft;
  const safeRight = etaRight === null ? Number.POSITIVE_INFINITY : etaRight;
  if (safeLeft !== safeRight) return safeLeft - safeRight;

  return new Date(left.createdAt) - new Date(right.createdAt);
}

function getOrderUrgencyLevel(order) {
  if (order.status === "ready") return "ready-waiting";
  if (!["received", "preparing"].includes(order.status)) return "inactive";

  const remainingMinutes = getRemainingEstimatedMinutes(order);
  if (remainingMinutes === null) {
    return getElapsedOrderTone(order) === "danger" ? "critical" : "normal";
  }

  if (remainingMinutes <= 0) return "critical";
  if (remainingMinutes <= 5) return "due-soon";
  return "normal";
}

function getOrderUrgencyRank(order) {
  const urgency = getOrderUrgencyLevel(order);
  if (urgency === "critical") return 0;
  if (urgency === "due-soon") return 1;
  if (urgency === "ready-waiting") return 2;
  return 3;
}

function matchesArchivedFilters(order) {
  const search = String(archivedSearchInput.value || "").trim().toLowerCase();
  const status = archivedStatusFilter.value || "all";
  const rating = archivedRatingFilter.value || "all";
  const score = Number(order.rating?.score || 0);
  const hasComment = Boolean(String(order.rating?.comment || "").trim());
  const hasRating = score > 0;

  if (search) {
    const haystack = [
      order.orderNumber,
      order.id,
      order.sourceOrderId,
      order.customerName,
      order.items,
      order.notes,
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) return false;
  }

  if (status !== "all" && order.status !== status) return false;
  if (rating === "low" && !(hasRating && score <= 2)) return false;
  if (rating === "rated" && !hasRating) return false;
  if (rating === "unrated" && hasRating) return false;
  if (rating === "commented" && !hasComment) return false;

  return true;
}

function buildEmptyState(message) {
  const card = document.createElement("article");
  const text = document.createElement("p");

  card.className = "empty-state";
  text.textContent = message;
  card.append(text);
  return card;
}

function buildOrderCard(order, isArchived) {
  const card = document.createElement("article");
  const compactButton = document.createElement("button");
  const compactMain = document.createElement("div");
  const compactMeta = document.createElement("div");
  const compactTop = document.createElement("div");
  const elapsedTime = document.createElement("span");
  const compactTitle = document.createElement("strong");
  const compactLine = document.createElement("span");
  const compactTime = document.createElement("span");
  const intelligence = document.createElement("div");
  const intelligenceLabel = document.createElement("span");
  const intelligenceBadge = document.createElement("span");
  const intelligenceEta = document.createElement("span");
  const intelligenceReason = document.createElement("p");
  const compactSide = document.createElement("div");
  const qrCode = document.createElement("strong");
  const ratingRow = document.createElement("div");
  const rating = document.createElement("span");
  const commentButton = document.createElement("button");
  const badge = document.createElement("span");
  const quickStatusActions = document.createElement("div");
  const details = document.createElement("div");
  const detailsTop = document.createElement("div");
  const qr = document.createElement("img");
  const form = document.createElement("form");
  const grid = document.createElement("div");
  const footer = document.createElement("div");
  const link = document.createElement("a");
  const editButton = document.createElement("button");
  const saveButton = document.createElement("button");
  const isExpanded = expandedOrderId === order.id;
  const isEditing = editingOrderId === order.id && !isArchived;
  const isCounterMode = restaurantDisplayMode === "counter" && !isArchived;
  const urgencyLevel = getOrderUrgencyLevel(order);

  card.className = "order-card order-card--compact";
  if (isArchived) card.classList.add("order-card--archived");
  if (isCounterMode) card.classList.add("order-card--counter");
  if (urgencyLevel === "critical") card.classList.add("order-card--critical");
  if (urgencyLevel === "due-soon") card.classList.add("order-card--due-soon");
  if (urgencyLevel === "ready-waiting") card.classList.add("order-card--ready-waiting");
  compactButton.type = "button";
  compactButton.className = "order-card__summary";
  compactMain.className = "order-card__summary-main";
  compactMeta.className = "order-card__summary-meta";
  compactTop.className = "order-card__summary-top";
  compactTime.className = "order-card__summary-time";
  intelligence.className = "order-card__intelligence";
  intelligenceLabel.className = "order-card__intelligence-label term-hint";
  intelligenceBadge.className = `order-card__intelligence-badge order-card__intelligence-badge--${order.aiRiskLevel || "low"} term-hint`;
  intelligenceEta.className = "order-card__intelligence-eta term-hint";
  intelligenceReason.className = "order-card__intelligence-reason";
  compactSide.className = "order-card__summary-side";
  ratingRow.className = "order-card__rating-row";
  badge.className = "status-pill";
  quickStatusActions.className = "status-actions status-actions--compact";
  details.className = "order-card__details";
  if (isExpanded) details.classList.add("is-open");
  detailsTop.className = "order-card__details-top";
  form.className = "order-edit-form";
  grid.className = "order-edit-grid";
  footer.className = "order-card__footer";

  compactTitle.textContent = `${order.orderNumber} · ${order.customerName}`;
  compactLine.append(
    document.createTextNode(`${order.items} · ${order.pickupPoint} · `),
    buildEtaHintElement(order),
  );
  intelligenceLabel.textContent = "TurnoListo Intelligence";
  intelligenceBadge.textContent = formatAiRiskLabel(order.aiRiskLevel);
  intelligenceEta.textContent = formatAiEta(order);
  intelligenceReason.textContent = order.aiReason || "Sin lectura inteligente todavía.";
  intelligenceLabel.dataset.termHint =
    "Capa de inteligencia operativa que estima tiempos, detecta riesgo y ayuda a priorizar pedidos en tiempo real.";
  intelligenceBadge.dataset.termHint =
    order.aiRiskLevel === "high"
      ? `${intelligenceBadge.textContent}: este pedido necesita atencion inmediata porque puede desviarse o ya esta comprometido.`
      : order.aiRiskLevel === "medium"
        ? `${intelligenceBadge.textContent}: el pedido aun esta controlado, pero ya muestra señales de tension operativa.`
        : `${intelligenceBadge.textContent}: el pedido va dentro de una ventana saludable segun la lectura actual del local.`;
  intelligenceEta.dataset.termHint = buildAiEtaHint(order, intelligenceEta.textContent);
  intelligenceLabel.setAttribute("title", intelligenceLabel.dataset.termHint);
  intelligenceLabel.setAttribute("aria-label", intelligenceLabel.dataset.termHint);
  intelligenceBadge.setAttribute("title", intelligenceBadge.dataset.termHint);
  intelligenceBadge.setAttribute("aria-label", intelligenceBadge.dataset.termHint);
  intelligenceEta.setAttribute("title", intelligenceEta.dataset.termHint);
  intelligenceEta.setAttribute("aria-label", intelligenceEta.dataset.termHint);
  compactTime.textContent = `Creado ${formatOrderTime(order.createdAt)}`;
  elapsedTime.className = `order-card__elapsed order-card__elapsed--${getElapsedOrderTone(order)}`;
  elapsedTime.textContent = getElapsedOrderTime(order);
  qrCode.textContent = order.publicTrackingToken || order.sourceOrderId || order.id;
  rating.className = "order-card__rating";
  rating.textContent = order.rating ? formatRating(order.rating.score) : "Sin valorar";
  commentButton.type = "button";
  commentButton.className = "comment-button";
  commentButton.textContent = "Ver comentario";
  commentButton.hidden = !(order.rating && order.rating.comment);
  commentButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openCommentModal(order);
  });
  badge.textContent = statusMeta[order.status].label;
  badge.style.background = statusMeta[order.status].bg;
  badge.style.color = statusMeta[order.status].color;

  compactTop.append(elapsedTime);
  compactMeta.append(compactTop, compactTitle, compactLine);
  if (!isArchived) {
    intelligence.append(intelligenceLabel, intelligenceBadge, intelligenceEta);
    compactMeta.append(intelligence, intelligenceReason);
  }
  compactMeta.append(compactTime);
  buildQuickStatusButtons(order, quickStatusActions, isArchived, isCounterMode);
  compactMain.append(compactMeta);
  ratingRow.append(rating, commentButton);
  compactSide.append(qrCode, ratingRow, badge, quickStatusActions);
  compactButton.append(compactMain, compactSide);
  compactButton.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".term-hint")) return;
    if (isCounterMode) return;
    expandedOrderId = expandedOrderId === order.id ? null : order.id;
    renderRestaurant();
  });

  qr.src = buildQrUrl(order.publicTrackingToken || order.sourceOrderId || order.id);
  qr.alt = `QR del pedido ${order.orderNumber}`;
  qr.className = "order-card__qr";

  grid.append(
    buildField("Código factura / ticket", "sourceOrderId", order.sourceOrderId, !isEditing),
    buildField("Origen", "sourceSystem", order.sourceSystem, !isEditing),
    buildField("Cliente", "customerName", order.customerName, !isEditing),
    buildField("Recogida", "pickupPoint", order.pickupPoint, !isEditing),
    buildField("Tiempo estimado (min)", "estimatedReadyMinutes", String(order.estimatedReadyMinutes || 15), !isEditing, false, "number"),
    buildField("Pedido", "items", order.items, !isEditing, true),
    buildField("Diligencias opcionales", "notes", order.notes, !isEditing, true),
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    try {
      updateOrder(order.id, {
        sourceOrderId: String(formData.get("sourceOrderId") || "").trim(),
        sourceSystem: String(formData.get("sourceSystem") || "").trim() || "Alta manual",
        customerName: String(formData.get("customerName") || "").trim() || "Cliente mostrador",
        pickupPoint: String(formData.get("pickupPoint") || "").trim() || "Mostrador 1",
        estimatedReadyMinutes: String(formData.get("estimatedReadyMinutes") || "15"),
        items: String(formData.get("items") || "").trim() || "Pedido rápido",
        notes: String(formData.get("notes") || "").trim(),
      });
      editingOrderId = null;
      renderRestaurant();
    } catch (error) {
      if (error instanceof Error && error.message === "duplicate-source-order") {
        showTurnoAlert("Ese pedido original ya existe.", "warning");
        return;
      }

      throw error;
    }
  });

  initializeRestaurantTermHints(card);

  link.href = buildClientUrl(order.publicTrackingToken || order.sourceOrderId || order.id);
  link.target = "_blank";
  link.rel = "noreferrer";
  link.className = "qr-link";
  link.textContent = "Abrir vista cliente";

  editButton.type = "button";
  editButton.className = "button-secondary";
  editButton.textContent = "Editar información";
  editButton.hidden = isArchived || isEditing || isCounterMode;
  editButton.addEventListener("click", () => {
    editingOrderId = order.id;
    renderRestaurant();
  });

  saveButton.type = "submit";
  saveButton.className = "button-secondary";
  saveButton.textContent = "Guardar cambios";
  saveButton.hidden = !isEditing;
  details.hidden = isCounterMode;

  detailsTop.append(qr);
  footer.append(link, editButton, saveButton);
  form.append(grid, footer);
  details.append(detailsTop, form);
  card.append(compactButton, details);
  return card;
}

function buildQuickStatusButtons(order, container, disabled, isCounterMode = false) {
  ORDER_STATUSES.forEach((status) => {
    const button = document.createElement("button");
    const label = document.createElement("span");
    const duration = document.createElement("span");
    button.type = "button";
    button.className = "status-action status-action--compact";
    if (isCounterMode) button.classList.add("status-action--counter");
    if (order.status === status) button.classList.add("is-active");
    label.className = "status-action__label";
    duration.className = "status-action__time";
    label.textContent = statusMeta[status].label;
    duration.textContent = formatStatusDurationLabel(getStatusDurationMinutes(order, status));
    button.disabled = disabled;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (status === "cancelled") {
        openCancelModal(order);
        return;
      }
      updateOrderStatus(order.id, status);
      renderRestaurant();
    });
    button.append(label, duration);
    container.append(button);
  });
}

function buildField(label, name, value, disabled, wide = false, type = "text") {
  const wrapper = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");

  wrapper.className = `field${wide ? " field--wide" : ""}`;
  text.textContent = label;
  input.name = name;
  input.type = type;
  input.value = value;
  input.disabled = disabled;

  wrapper.append(text, input);
  return wrapper;
}

function formatOrderEtaSummary(order) {
  if (order.status === "ready") return "Listo para recoger";
  if (order.status === "delivered") return "Entregado";
  if (order.status === "cancelled") return "Cancelado / desistio";

  const remainingMinutes = getRemainingEstimatedMinutes(order);
  if (remainingMinutes === null) return "Sin ETA";
  if (remainingMinutes <= 0) return "Retrasado";
  if (remainingMinutes === 1) return "ETA 1 min";
  return `ETA ${remainingMinutes} min`;
}

function formatAiRiskLabel(level) {
  if (level === "high") return "Riesgo alto";
  if (level === "medium") return "Atención";
  return "Estable";
}

function formatAiEta(order) {
  if (order.status === "ready") return "ETA IA 0 min";
  const eta = Number(order.aiEtaMinutes || 0);
  if (!Number.isFinite(eta) || eta <= 0) return "ETA IA --";
  return `ETA IA ${eta} min`;
}

function buildAiEtaHint(order, visibleLabel) {
  if (order.status === "ready") {
    return `${visibleLabel}: el pedido ya esta listo para recoger.`;
  }

  const eta = Number(order.aiEtaMinutes || 0);
  if (!Number.isFinite(eta) || eta <= 0) {
    return `${visibleLabel}: TurnoListo todavia no tiene una estimacion fiable para este pedido.`;
  }

  return `${visibleLabel}: TurnoListo estima este tiempo restante segun la carga actual, el historico del local y el riesgo de retraso.`;
}

function buildEtaHintElement(order) {
  const summary = formatOrderEtaSummary(order);
  const element = document.createElement("span");
  element.textContent = summary;

  if (summary === "Sin ETA" || summary.startsWith("ETA ")) {
    element.className = "term-hint";
    const hint =
      summary === "Sin ETA"
        ? "ETA significa tiempo estimado para que el pedido este listo. En este caso todavia no hay una estimacion cargada."
        : "ETA significa tiempo estimado para que el pedido este listo segun el ritmo actual del local.";
    element.dataset.termHint = hint;
    element.setAttribute("title", hint);
    element.setAttribute("aria-label", hint);
  }

  return element;
}

function handleCreateOrder(event) {
  event.preventDefault();
  const formData = new FormData(quickCreateForm);
  let order = null;

  try {
    order = createOrder({
      sourceOrderId: String(formData.get("sourceOrderId") || ""),
      customerName: String(formData.get("customerName") || ""),
      items: String(formData.get("items") || ""),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "missing-source-order") {
      quickCreateFeedback.textContent = "Necesitas pegar el codigo de factura o ticket.";
      quickCreateFeedback.className = "form-feedback form-feedback--error";
      quickCreateFeedback.hidden = false;
      return;
    }

    if (error instanceof Error && error.message === "duplicate-source-order") {
      quickCreateFeedback.textContent = "Ese pedido ya existe.";
      quickCreateFeedback.className = "form-feedback form-feedback--error";
      quickCreateFeedback.hidden = false;
      return;
    }

    throw error;
  }

  quickCreateForm.reset();
  quickCreateFeedback.hidden = true;
  quickCreateFeedback.textContent = "";
  expandedOrderId = order.id;
  editingOrderId = null;
  activeSection = "orders";
  renderRestaurant();
}

function openCommentModal(order) {
  commentTitle.textContent = `${order.orderNumber} · ${order.customerName}`;
  commentMeta.textContent = `Valoración ${formatRating(order.rating?.score || 0)} · ${order.items}`;
  commentBody.textContent = order.rating?.comment || "Sin comentario";
  commentModal.hidden = false;
}

function closeCommentModal() {
  commentModal.hidden = true;
}

function openCancelModal(order) {
  pendingCancelOrderId = order.id;
  pendingCancelOrderLabel = `${order.orderNumber} · ${order.customerName}`;
  cancelMeta.textContent = pendingCancelOrderLabel;
  cancelModal.hidden = false;
}

function closeCancelModal() {
  cancelModal.hidden = true;
  pendingCancelOrderId = null;
  pendingCancelOrderLabel = "";
}

function confirmCancelOrder() {
  if (!pendingCancelOrderId) return;
  updateOrderStatus(pendingCancelOrderId, "cancelled");
  closeCancelModal();
  renderRestaurant();
}
