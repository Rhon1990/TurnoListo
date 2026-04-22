const restaurantLoginView = document.querySelector("#restaurantLoginView");
const restaurantWorkspace = document.querySelector("#restaurantWorkspace");
const restaurantLoginForm = document.querySelector("#restaurantLoginForm");
const restaurantLoginFeedback = document.querySelector("#restaurantLoginFeedback");
const restaurantLoginUsername = document.querySelector("#restaurantLoginUsername");
const restaurantLoginPassword = document.querySelector("#restaurantLoginPassword");
const restaurantLoginTogglePassword = document.querySelector("#restaurantLoginTogglePassword");
const restaurantHeroEyebrow = document.querySelector("#restaurantHeroEyebrow");
const restaurantSessionLabel = document.querySelector("#restaurantSessionLabel");
const restaurantAccountButton = document.querySelector("#restaurantAccountButton");
const restaurantAccountPanel = document.querySelector("#restaurantAccountPanel");
const restaurantAccountAvatarImage = document.querySelector("#restaurantAccountAvatarImage");
const restaurantAccountAvatarFallback = document.querySelector("#restaurantAccountAvatarFallback");
const restaurantAccountName = document.querySelector("#restaurantAccountName");
const restaurantAccountMeta = document.querySelector("#restaurantAccountMeta");
const restaurantMenuProfile = document.querySelector("#restaurantMenuProfile");
const restaurantMenuLogout = document.querySelector("#restaurantMenuLogout");
const restaurantList = document.querySelector("#restaurantOrders");
const restaurantHeroMetricLabel = document.querySelector("#restaurantHeroMetricLabel");
const restaurantHeroMetricValue = document.querySelector("#restaurantHeroMetricValue");
const restaurantHeroMetricHint = document.querySelector("#restaurantHeroMetricHint");
const restaurantTotalTodayChip = document.querySelector("#restaurantTotalTodayChip");
const restaurantDeliveredTodayChip = document.querySelector("#restaurantDeliveredTodayChip");
const restaurantCancelledTodayChip = document.querySelector("#restaurantCancelledTodayChip");
const restaurantHistoryQuickFilters = document.querySelectorAll("[data-restaurant-history-filter]");
const restaurantSpotlightTitle = document.querySelector("#restaurantSpotlightTitle");
const restaurantSpotlightBody = document.querySelector("#restaurantSpotlightBody");
const restaurantSpotlightChipPrimary = document.querySelector("#restaurantSpotlightChipPrimary");
const restaurantSpotlightChipSecondary = document.querySelector("#restaurantSpotlightChipSecondary");
const archivedList = document.querySelector("#restaurantArchivedOrders");
const quickCreateForm = document.querySelector("#quickCreateForm");
const quickCreateFeedback = document.querySelector("#quickCreateFeedback");
const restaurantCreateDemoHint = document.querySelector("#restaurantCreateDemoHint");
const restaurantPlaybook = document.querySelector("#restaurantPlaybook");
const restaurantPlaybookEyebrow = document.querySelector("#restaurantPlaybookEyebrow");
const restaurantPlaybookTitle = document.querySelector("#restaurantPlaybookTitle");
const restaurantPlaybookList = document.querySelector("#restaurantPlaybookList");
const restaurantPlaybookDismiss = document.querySelector("#restaurantPlaybookDismiss");
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
const archivedPeriodFilter = document.querySelector("#archivedPeriodFilter");
const sectionTabs = document.querySelectorAll("[data-section]");
const sectionPanels = document.querySelectorAll("[data-section-panel]");
const restaurantHomeButton = document.querySelector('.workspace-home-button[href="./restaurant.html"]');
const restaurantProfileForm = document.querySelector("#restaurantProfileForm");
const restaurantProfileLogoInput = document.querySelector("#restaurantProfileLogoInput");
const restaurantProfileLogoPreview = document.querySelector("#restaurantProfileLogoPreview");
const restaurantProfileLogoPreviewImage = document.querySelector("#restaurantProfileLogoPreviewImage");
const restaurantProfileName = document.querySelector("#restaurantProfileName");
const restaurantProfileOwnerName = document.querySelector("#restaurantProfileOwnerName");
const restaurantProfileEmail = document.querySelector("#restaurantProfileEmail");
const restaurantProfilePhone = document.querySelector("#restaurantProfilePhone");
const restaurantProfilePhoneField = document.querySelector("#restaurantProfilePhoneField");
const restaurantProfilePhoneCountryTrigger = document.querySelector("#restaurantProfilePhoneCountryTrigger");
const restaurantProfilePhoneCountryPanel = document.querySelector("#restaurantProfilePhoneCountryPanel");
const restaurantProfilePhoneCountryFlag = document.querySelector("#restaurantProfilePhoneCountryFlag");
const restaurantProfilePhoneCountryDial = document.querySelector("#restaurantProfilePhoneCountryDial");
const restaurantProfilePhoneCountryName = document.querySelector("#restaurantProfilePhoneCountryName");
const restaurantProfilePhoneCountrySearch = document.querySelector("#restaurantProfilePhoneCountrySearch");
const restaurantProfilePhoneCountryList = document.querySelector("#restaurantProfilePhoneCountryList");
const restaurantProfilePhoneLocal = document.querySelector("#restaurantProfilePhoneLocal");
const restaurantProfilePhoneHint = document.querySelector("#restaurantProfilePhoneHint");
const restaurantProfilePhoneError = document.querySelector("#restaurantProfilePhoneError");
const restaurantProfileCity = document.querySelector("#restaurantProfileCity");
const restaurantProfileAddress = document.querySelector("#restaurantProfileAddress");
const restaurantProfileNotes = document.querySelector("#restaurantProfileNotes");
const restaurantProfilePlanName = document.querySelector("#restaurantProfilePlanName");
const restaurantProfileActivatedUntil = document.querySelector("#restaurantProfileActivatedUntil");
const restaurantProfileFeedback = document.querySelector("#restaurantProfileFeedback");
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
const dashboardAiConfidence = document.querySelector("#dashboardAiConfidence");
const dashboardAiConfidenceHint = document.querySelector("#dashboardAiConfidenceHint");
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
const translateRuntimeText = (value) =>
  window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
const translateRuntimeKey = (key, fallback = "") =>
  window.TurnoListoI18n?.translateKey ? window.TurnoListoI18n.translateKey(key, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const formatRuntimeKey = (key, params = {}, fallback = "") =>
  window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const setDynamicRuntimeAttribute = window.TurnoListoDom?.setDynamicAttribute;
const setDynamicRuntimeText = window.TurnoListoDom?.setDynamicText;
const dashboardHeroRating = document.querySelector("#dashboardHeroRating");
const restaurantDashboardPeriod = document.querySelector("#restaurantDashboardPeriod");
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
const aiModal = document.querySelector("#restaurantAiModal");
const aiBackdrop = document.querySelector("#restaurantAiBackdrop");
const aiClose = document.querySelector("#restaurantAiClose");
const aiTitle = document.querySelector("#restaurantAiTitle");
const aiMeta = document.querySelector("#restaurantAiMeta");
const aiBody = document.querySelector("#restaurantAiBody");

let expandedOrderId = null;
let editingOrderId = null;
let pendingCancelOrderId = null;
let pendingCancelOrderLabel = "";
let activeSection = "orders";
let lastRenderedRestaurantId = "";
let lastDashboardStats = null;
let restaurantAuthRequestToken = 0;
let restaurantDisplayMode = window.localStorage.getItem("turnolisto-restaurant-display-mode") || "standard";
let activeRestaurantDashboardPeriod = normalizeDashboardPeriod(
  window.localStorage.getItem("turnolisto-restaurant-dashboard-period") || "day",
);
let activeArchivedPeriod = normalizeDashboardPeriod(
  window.localStorage.getItem("turnolisto-restaurant-archived-period") || "day",
);
let restaurantModeTooltipTimer = 0;
let restaurantTermTooltipTimer = 0;
let selectedRestaurantProfileLogoUrl = "";
let lastAiTriggerButton = null;
let activeCommentOrderId = null;
let activeAiOrderId = null;
const EMPTY_DATA_LABEL = "Sin datos cargados";
const EMPTY_STATUS_LABEL = "No disponible";
const EMPTY_AVATAR_LABEL = "?";
const SHARED_DEFAULT_PHONE_COUNTRY_ISO = window.TurnoListoPhoneFields?.defaultCountryIso || "ES";
const restaurantProfilePhoneController = window.TurnoListoPhoneFields?.create({
  elements: {
    field: restaurantProfilePhoneField,
    countryTrigger: restaurantProfilePhoneCountryTrigger,
    countryPanel: restaurantProfilePhoneCountryPanel,
    countryFlag: restaurantProfilePhoneCountryFlag,
    countryDial: restaurantProfilePhoneCountryDial,
    countryName: restaurantProfilePhoneCountryName,
    countrySearch: restaurantProfilePhoneCountrySearch,
    countryList: restaurantProfilePhoneCountryList,
    localInput: restaurantProfilePhoneLocal,
    hiddenInput: restaurantProfilePhone,
    hintElement: restaurantProfilePhoneHint,
    errorElement: restaurantProfilePhoneError,
  },
  translateText: translateRuntimeText,
  translateKey: translateRuntimeKey,
  formatKey: formatRuntimeKey,
  isRequired: () => false,
});

initializeRestaurantFirebaseAuth();
bootRestaurantPage();
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
restaurantAccountButton?.addEventListener("click", toggleRestaurantAccountMenu);
restaurantMenuLogout?.addEventListener("click", async () => {
  closeRestaurantAccountMenu();
  await handleRestaurantLogout();
});
restaurantProfileForm?.addEventListener("submit", handleRestaurantProfileSubmit);
restaurantProfileLogoInput?.addEventListener("change", handleRestaurantProfileLogoSelection);
restaurantHistoryQuickFilters.forEach((button) => {
  button.addEventListener("click", () => {
    if (button === restaurantTotalTodayChip) return;
    activeArchivedPeriod = "day";
    if (archivedPeriodFilter) archivedPeriodFilter.value = activeArchivedPeriod;
    window.localStorage.setItem("turnolisto-restaurant-archived-period", activeArchivedPeriod);
    goToHistoryView({ status: button.dataset.restaurantHistoryFilter || "all", rating: "all", search: "" });
  });
});
window.addEventListener("click", handleRestaurantAccountOutsideClick);
window.addEventListener("turnolisto:language-change", () => {
  window.requestAnimationFrame(() => {
    restaurantProfilePhoneController?.refreshLanguage();
    if (getCurrentRestaurantSession()) {
      renderRestaurant();
      refreshOpenRestaurantModals();
    }
  });
});
initializeRestaurantProfilePhoneField();
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
restaurantPlaybookDismiss?.addEventListener("click", hideRestaurantPlaybook);
restaurantDashboardPeriod?.addEventListener("change", (event) => {
  activeRestaurantDashboardPeriod = normalizeDashboardPeriod(event.target.value || "day");
  window.localStorage.setItem("turnolisto-restaurant-dashboard-period", activeRestaurantDashboardPeriod);
  renderRestaurant();
});
archivedPeriodFilter?.addEventListener("change", (event) => {
  activeArchivedPeriod = normalizeDashboardPeriod(event.target.value || "day");
  window.localStorage.setItem("turnolisto-restaurant-archived-period", activeArchivedPeriod);
  renderRestaurant();
});
commentBackdrop.addEventListener("click", closeCommentModal);
commentClose.addEventListener("click", closeCommentModal);
cancelBackdrop.addEventListener("click", closeCancelModal);
cancelClose.addEventListener("click", closeCancelModal);
cancelBack.addEventListener("click", closeCancelModal);
cancelConfirm.addEventListener("click", confirmCancelOrder);
aiBackdrop.addEventListener("click", closeAiModal);
aiClose.addEventListener("click", closeAiModal);
window.addEventListener("keydown", handleRestaurantGlobalKeydown);
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
  if (restaurantDashboardPeriod) {
    restaurantDashboardPeriod.value = activeRestaurantDashboardPeriod;
  }
  if (archivedPeriodFilter) {
    archivedPeriodFilter.value = activeArchivedPeriod;
  }
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
      const requestToken = ++restaurantAuthRequestToken;
      if (!user?.email) {
        if (requestToken !== restaurantAuthRequestToken) return;
        clearCurrentUserProfile();
        clearCurrentRestaurantSession();
        syncRestaurantAccess();
        return;
      }

      try {
        const profile = await loadCurrentUserProfileFromBackend();
        if (requestToken !== restaurantAuthRequestToken) return;

        const cachedRestaurant =
          profile?.role === "restaurant" && profile.restaurantId ? getRestaurantById(profile.restaurantId) : null;

        if (cachedRestaurant && isRestaurantAccessActive(cachedRestaurant)) {
          setCurrentRestaurantSession(cachedRestaurant);
          restaurantLoginFeedback.hidden = true;
          restaurantLoginFeedback.textContent = "";
          syncRestaurantAccess();
          renderRestaurant();
        }

        void reconnectDataStoreToFirebase().then((result) => {
          if (requestToken !== restaurantAuthRequestToken) return;
          const nextProfile = result?.profile || getCurrentUserProfile() || profile;
          const restaurant =
            nextProfile?.role === "restaurant" && nextProfile.restaurantId ? getRestaurantById(nextProfile.restaurantId) : null;

          if (!restaurant || !isRestaurantAccessActive(restaurant)) {
            clearCurrentRestaurantSession();
            restaurantLoginFeedback.textContent =
              nextProfile?.role && nextProfile.role !== "restaurant"
                ? translateRuntimeText("Esta ventana ha heredado una sesion que no es de restaurante. Inicia sesion aqui con la cuenta del local.")
                : translateRuntimeText("Tu cuenta no tiene un perfil valido en users/{uid} o el restaurante asignado no esta activo.");
            restaurantLoginFeedback.className = "form-feedback form-feedback--error";
            restaurantLoginFeedback.hidden = false;
            showTurnoAlert(
              nextProfile?.role && nextProfile.role !== "restaurant"
                ? translateRuntimeText("Esta ventana necesita una sesion propia del restaurante y no cerrara la sesion del admin.")
                : translateRuntimeText("Tu cuenta no tiene acceso valido al restaurante asignado."),
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
      } catch (error) {
        if (requestToken !== restaurantAuthRequestToken) return;
        console.error("No se pudo restaurar la sesion del restaurante.", error);
        restaurantLoginFeedback.textContent = translateRuntimeText("No se pudo restaurar la sesión del restaurante. Inténtalo de nuevo.");
        restaurantLoginFeedback.className = "form-feedback form-feedback--error";
        restaurantLoginFeedback.hidden = false;
        syncRestaurantAccess();
      }
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
    restaurantHeroEyebrow.textContent = translateRuntimeText(isDemoRestaurant(restaurant) ? "Demo restaurante" : "Panel restaurante");
    return;
  }

  if (restaurantSessionLabel) restaurantSessionLabel.textContent = translateRuntimeText(EMPTY_DATA_LABEL);
  restaurantHeroEyebrow.textContent = translateRuntimeText("Panel restaurante");
}

function renderRestaurant() {
  const session = getCurrentRestaurantSession();
  if (!session) {
    lastRenderedRestaurantId = "";
    activeSection = "orders";
    syncRestaurantAccess();
    return;
  }

  const restaurant = getRestaurantById(session.restaurantId);
  const restaurantId = String(restaurant?.id || "");
  if (restaurantId && restaurantId !== lastRenderedRestaurantId) {
    activeSection = isDemoRestaurant(restaurant) ? "create" : "orders";
    lastRenderedRestaurantId = restaurantId;
  }
  renderRestaurantAccount(restaurant);
  renderRestaurantProfile(restaurant);

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
  const quickStats = getDashboardStats({ period: "day" });
  const dashboard = getDashboardStats({ period: activeRestaurantDashboardPeriod });
  lastDashboardStats = dashboard;

  restaurantList.innerHTML = "";
  archivedList.innerHTML = "";
  renderRestaurantHeroSignals(dashboard, restaurant, allOrders);
  renderRestaurantCreateHints(restaurant, allOrders);
  renderRestaurantPlaybook(restaurant, allOrders);
  restaurantTotalTodayChip.textContent = translateRuntimeText(`${quickStats.uniqueOperationalTodayCount} total hoy`);
  restaurantDeliveredTodayChip.textContent = translateRuntimeText(`${quickStats.deliveredToday} entregados hoy`);
  restaurantCancelledTodayChip.textContent = translateRuntimeText(`${quickStats.cancelledToday} cancelados hoy`);
  syncRestaurantHistoryQuickFilters();
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

function renderRestaurantHeroSignals(stats, restaurant = null, allOrders = loadOrders()) {
  if (!restaurantHeroMetricValue || !restaurantHeroMetricLabel || !restaurantHeroMetricHint) return;

  if (isDemoRestaurant(restaurant)) {
    const demoUsage = getRestaurantDemoUsage(restaurant, allOrders);
    restaurantHeroMetricLabel.textContent = translateRuntimeText("Demo en uso");
    restaurantHeroMetricValue.textContent = `${demoUsage.usedOrders}/${demoUsage.maxOrders}`;
    restaurantHeroMetricHint.textContent =
      demoUsage.remainingOrders > 0
        ? translateRuntimeText("Esta demo ya permite probar pedidos reales, lectura inteligente e IA adaptativa con un limite comercial.")
        : translateRuntimeText("La demo ha alcanzado su limite de pedidos. Es el momento perfecto para activar el plan completo.");
  } else if (stats.aiHighRiskCount >= 1) {
    restaurantHeroMetricLabel.textContent = translateRuntimeText("Pedidos en riesgo");
    restaurantHeroMetricValue.textContent = String(stats.aiHighRiskCount);
    restaurantHeroMetricHint.textContent = translateRuntimeText("Requieren intervención antes de impactar espera, recogida o experiencia.");
  } else if (stats.onTimeTrackedCount > 0) {
    restaurantHeroMetricLabel.textContent = translateRuntimeText("Cumplimiento de promesa");
    restaurantHeroMetricValue.textContent = `${stats.onTimeRate}%`;
    restaurantHeroMetricHint.textContent = translateRuntimeText("Porcentaje de pedidos que estuvieron listos dentro del tiempo prometido al cliente.");
  } else {
    restaurantHeroMetricLabel.textContent = translateRuntimeText("Pedidos activos");
    restaurantHeroMetricValue.textContent = String(stats.activeNow);
    restaurantHeroMetricHint.textContent = translateRuntimeText("Recibido, en preparación o listos para recoger con lectura adaptativa.");
  }

  renderRestaurantSpotlight(stats, restaurant, allOrders);
}

function renderRestaurantSpotlight(stats, restaurant = null, allOrders = loadOrders()) {
  if (!restaurantSpotlightTitle || !restaurantSpotlightBody) return;
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
  if (isDemoRestaurant(restaurant)) {
    const demoUsage = getRestaurantDemoUsage(restaurant, allOrders);
    const confidenceLabel =
      stats.aiModelSampleSize >= 8 ? translateRuntimeText(`IA ${stats.aiModelConfidenceLabel}`) : translateRuntimeText("IA aprendiendo del local");

    if (demoUsage.remainingOrders <= 0) {
      restaurantSpotlightTitle.textContent = translateText("La demo ya demostro el valor");
      restaurantSpotlightBody.textContent =
        translateText(
          "Ya has probado el flujo de pedidos, la lectura inteligente de la cola y el aprendizaje adaptativo del restaurante. Activa el plan completo para seguir operando sin limite y convertir esta prueba en rutina.",
        );
      restaurantSpotlightChipPrimary.textContent = translateRuntimeText(`Demo ${demoUsage.usedOrders}/${demoUsage.maxOrders}`);
      restaurantSpotlightChipSecondary.textContent = translateText("Activa el plan completo");
      return;
    }

    restaurantSpotlightTitle.textContent =
      demoUsage.usedOrders >= Math.max(2, demoUsage.maxOrders - 2)
        ? translateText("Estas a un paso de cerrar la demo")
        : translateText("Demo lista para impresionar al equipo");
    restaurantSpotlightBody.textContent =
      demoUsage.usedOrders >= Math.max(2, demoUsage.maxOrders - 2)
        ? translateText(
            `Ya has consumido ${demoUsage.usedOrders} de ${demoUsage.maxOrders} pedidos. Aprovecha esta recta final para mostrar como TurnoListo reduce esperas, prioriza mejor y aprende del ritmo real del local.`,
          )
        : translateText(
            `Puedes crear hasta ${demoUsage.maxOrders} pedidos de prueba con QR, priorizacion e inteligencia adaptativa. La demo esta pensada para que el restaurante vea valor desde el primer servicio y quiera escalar al plan real.`,
          );
    restaurantSpotlightChipPrimary.textContent = translateRuntimeText(`Demo ${demoUsage.usedOrders}/${demoUsage.maxOrders}`);
    restaurantSpotlightChipSecondary.textContent = confidenceLabel;
    return;
  }

  if (stats.aiNextAction) {
    restaurantSpotlightTitle.textContent = translateRuntimeText(stats.aiNextAction.title);
    restaurantSpotlightBody.textContent = translateRuntimeText(stats.aiNextAction.body);
    restaurantSpotlightChipPrimary.textContent = translateRuntimeText(stats.aiNextAction.primary);
    restaurantSpotlightChipSecondary.textContent = translateRuntimeText(stats.aiNextAction.secondary);
    return;
  }

  if (stats.aiFocusOrder) {
    restaurantSpotlightTitle.textContent = translateRuntimeText(`Prioriza ${stats.aiFocusOrder.orderNumber} ahora`);
    restaurantSpotlightBody.textContent =
      stats.aiFocusOrder.aiRiskLevel === "high"
        ? translateText(
            "La IA detecta que este pedido puede deteriorar la experiencia o romper la promesa de tiempo si no entra primero en foco.",
          )
        : translateText("Es el pedido con mayor retorno operativo inmediato segun carga actual, riesgo y aprendizaje historico del local.");
    restaurantSpotlightChipPrimary.textContent = formatAiRiskLabel(stats.aiFocusOrder.aiRiskLevel);
    restaurantSpotlightChipSecondary.textContent = formatAiEta(stats.aiFocusOrder);
    return;
  }

  if (stats.activeNow > 0) {
    restaurantSpotlightTitle.textContent =
      stats.aiModelSampleSize >= 8
        ? translateText("La IA ya se esta adaptando a este local")
        : translateText("La operacion mantiene buen pulso");
    restaurantSpotlightBody.textContent =
      stats.aiModelSampleSize >= 8
        ? translateText(
            `El modelo ya aprende de ${stats.aiModelSampleSize} cierres reales y ahora ajusta ETAs, riesgo y prioridades segun el comportamiento de este restaurante.`,
          )
        : translateText(
            "No hay pedidos en riesgo alto ahora mismo. Puedes usar esta vista para mantener ritmo y anticiparte antes del siguiente pico de demanda.",
          );
    restaurantSpotlightChipPrimary.textContent =
      stats.aiModelSampleSize >= 8
        ? translateRuntimeText(`IA ${stats.aiModelConfidenceLabel}`)
        : translateRuntimeText(`Activos ${stats.activeNow}`);
    restaurantSpotlightChipSecondary.textContent =
      stats.aiModelSampleSize >= 8
        ? translateRuntimeText(`Error medio ${stats.aiModelMeanAbsoluteError ?? "--"} min`)
        : translateRuntimeText(`Listos ${stats.readyNow}`);
    return;
  }

  restaurantSpotlightTitle.textContent = translateText("Listo para entrenar con nuevos pedidos");
  restaurantSpotlightBody.textContent =
    translateText("Cuando entren nuevos pedidos, TurnoListo seguirá afinando tiempos y prioridades con el comportamiento real del local.");
  restaurantSpotlightChipPrimary.textContent = translateText("Operacion estable");
  restaurantSpotlightChipSecondary.textContent = translateText("Listo para escalar");
}

function renderRestaurantCreateHints(restaurant, allOrders = loadOrders()) {
  if (!restaurantCreateDemoHint) return;
  if (!isDemoRestaurant(restaurant)) {
    restaurantCreateDemoHint.hidden = true;
    restaurantCreateDemoHint.textContent = "";
    return;
  }

  const demoUsage = getRestaurantDemoUsage(restaurant, allOrders);
  restaurantCreateDemoHint.hidden = false;
  restaurantCreateDemoHint.textContent =
    demoUsage.remainingOrders > 0
      ? translateRuntimeText(
        `Demo comercial activa: te quedan ${demoUsage.remainingOrders} de ${demoUsage.maxOrders} pedidos para enseñar QR, seguimiento e IA adaptativa en una prueba real.`,
      )
      : translateRuntimeText(
        `Demo comercial completada: ya has consumido ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos. Activa el plan completo para seguir operando sin limite.`,
      );
}

function renderRestaurantPlaybook(restaurant, allOrders = loadOrders()) {
  if (!restaurantPlaybook || !restaurantPlaybookList) return;
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;

  const restaurantId = String(restaurant?.id || "");
  const restaurantOrders = allOrders.filter((order) => String(order.restaurantId || "") === restaurantId);
  const hasCreatedOrder = restaurantOrders.length > 0;
  const hasReadyOrder = restaurantOrders.some((order) => order.status === "ready" || order.status === "delivered");
  const hasClosedLoop = restaurantOrders.some((order) => order.status === "delivered" || order.archivedAt);
  const hasRatedOrder = restaurantOrders.some((order) => Number(order.rating?.score || 0) > 0);
  const isDemo = isDemoRestaurant(restaurant);
  const completionUnlocked = hasCreatedOrder && hasReadyOrder && hasClosedLoop && hasRatedOrder;

  if (isDemo && isRestaurantPlaybookDismissed(restaurant) && completionUnlocked) {
    restaurantPlaybook.hidden = true;
    restaurantPlaybookList.innerHTML = "";
    if (restaurantPlaybookDismiss) {
      restaurantPlaybookDismiss.hidden = true;
    }
    return;
  }

  if (restaurantPlaybookEyebrow) {
    restaurantPlaybookEyebrow.textContent = translateText(isDemo ? "Recorrido demo" : "Playbook operativo");
  }

  if (restaurantPlaybookTitle) {
    restaurantPlaybookTitle.textContent = isDemo
      ? translateText("Cómo enseñar valor en menos de 10 minutos")
      : translateText("Cómo activar más valor en el flujo diario");
  }

  const steps = isDemo
    ? [
        {
          done: hasCreatedOrder,
          text: hasCreatedOrder
            ? "Primer pedido creado. Ya puedes enseñar cómo TurnoListo captura el pedido y genera seguimiento QR."
            : "1. Crea el primer pedido de prueba para activar el QR y empezar a enseñar el flujo real.",
        },
        {
          done: hasReadyOrder,
          text: hasReadyOrder
            ? "Pedido movido a listo. El restaurante ya puede mostrar cómo baja la fricción en recogida."
            : "2. Cambia un pedido a Listo para recoger y enseña cómo el equipo gana visibilidad en mostrador.",
        },
        {
          done: hasClosedLoop,
          text: hasClosedLoop
            ? "Ciclo operativo completado. Ya tienes una demostración real de principio a fin."
            : "3. Completa un pedido hasta entregado para demostrar el ciclo entero y alimentar el aprendizaje del local.",
        },
        {
          done: hasRatedOrder,
          text: hasRatedOrder
            ? "Feedback capturado. Ya puedes enseñar cómo el producto conecta operación y experiencia cliente."
            : "4. Si puedes, recoge una valoración para mostrar el cierre de experiencia y el valor analítico.",
        },
      ]
    : [
        {
          done: hasCreatedOrder,
          text: hasCreatedOrder
            ? "Ya hay pedidos creados. El equipo tiene el flujo base activo."
            : "1. Crea el primer pedido desde tu operativa real para activar el flujo completo en TurnoListo.",
        },
        {
          done: hasReadyOrder,
          text: hasReadyOrder
            ? "Ya gestionas pedidos listos para recoger con visibilidad operativa."
            : "2. Mueve pedidos a Listo para recoger para reducir fricción en mostrador y ordenar mejor la retirada.",
        },
        {
          done: hasClosedLoop,
          text: hasClosedLoop
            ? "Ya existe histórico cerrado. La IA puede aprender mejor del ritmo real del local."
            : "3. Completa varios pedidos de principio a fin para mejorar histórico, métricas e IA adaptativa.",
        },
        {
          done: hasRatedOrder,
          text: hasRatedOrder
            ? "Ya tienes feedback de clientes para detectar mejora de experiencia."
            : "4. Recoge valoraciones para conectar operación, experiencia cliente y oportunidades de mejora.",
        },
      ];

  restaurantPlaybook.hidden = false;
  restaurantPlaybookList.innerHTML = "";
  if (restaurantPlaybookDismiss) {
    restaurantPlaybookDismiss.hidden = !(isDemo && completionUnlocked);
  }
  steps.forEach((step) => {
    const item = document.createElement("article");
    item.className = `dashboard-insight playbook-step${step.done ? " playbook-step--done" : ""}`;

    const icon = document.createElement("span");
    icon.className = "playbook-step__icon material-symbols-rounded";
    icon.setAttribute("aria-hidden", "true");
    icon.dataset.icon = step.done ? "check" : "radio_button_unchecked";

    const content = document.createElement("div");
    content.className = "playbook-step__content";

    const status = document.createElement("strong");
    status.className = "playbook-step__status";
    status.textContent = translateText(step.done ? "Completado" : "Pendiente");

    const text = document.createElement("span");
    text.className = "playbook-step__text";
    text.textContent = translateText(step.text);

    content.append(status, text);
    item.append(icon, content);
    restaurantPlaybookList.append(item);
  });
}

function getRestaurantPlaybookStorageKey(restaurant) {
  const restaurantId = String(restaurant?.id || "").trim();
  return restaurantId ? `turnolisto-demo-playbook-dismissed:${restaurantId}` : "";
}

function isRestaurantPlaybookDismissed(restaurant) {
  const key = getRestaurantPlaybookStorageKey(restaurant);
  return Boolean(key && window.localStorage.getItem(key) === "true");
}

function hideRestaurantPlaybook() {
  const session = getCurrentRestaurantSession();
  const restaurant = session ? getRestaurantById(session.restaurantId) : null;
  if (!restaurant || !isDemoRestaurant(restaurant)) return;

  const allOrders = loadOrders();
  const restaurantOrders = allOrders.filter((order) => String(order.restaurantId || "") === String(restaurant.id || ""));
  const completionUnlocked =
    restaurantOrders.length > 0 &&
    restaurantOrders.some((order) => order.status === "ready" || order.status === "delivered") &&
    restaurantOrders.some((order) => order.status === "delivered" || order.archivedAt) &&
    restaurantOrders.some((order) => Number(order.rating?.score || 0) > 0);

  if (!completionUnlocked) return;

  const key = getRestaurantPlaybookStorageKey(restaurant);
  if (key) {
    window.localStorage.setItem(key, "true");
  }
  renderRestaurant();
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

function renderRestaurantAccount(restaurant) {
  if (!restaurantAccountName) return;
  const restaurantName = String(restaurant?.name || "").trim();
  const logoUrl = String(restaurant?.logoUrl || "").trim();
  const hasRestaurantData = Boolean(restaurantName);
  const demoUsage = hasRestaurantData ? getRestaurantDemoUsage(restaurant) : null;
  const accountName = restaurantName || translateRuntimeText(EMPTY_DATA_LABEL);
  const accountMeta = hasRestaurantData
    ? isDemoRestaurant(restaurant)
      ? translateRuntimeText(`Demo activa · ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos usados`)
      : translateRuntimeText("Acceso verificado")
    : translateRuntimeText("Cuenta no cargada");

  if (setDynamicRuntimeText) {
    setDynamicRuntimeText(restaurantAccountName, accountName);
    setDynamicRuntimeText(restaurantAccountMeta, accountMeta);
  } else {
    restaurantAccountName.textContent = accountName;
    restaurantAccountMeta.textContent = accountMeta;
  }

  restaurantAccountAvatarFallback.textContent = restaurantName.charAt(0).toUpperCase() || EMPTY_AVATAR_LABEL;

  if (logoUrl) {
    restaurantAccountAvatarImage.src = logoUrl;
    restaurantAccountAvatarImage.hidden = false;
    restaurantAccountAvatarFallback.hidden = true;
  } else {
    restaurantAccountAvatarImage.hidden = true;
    restaurantAccountAvatarImage.removeAttribute("src");
    restaurantAccountAvatarFallback.hidden = false;
  }
}

function renderRestaurantProfile(restaurant) {
  if (!restaurantProfileForm) return;
  if (!restaurant) {
    restaurantProfileName.value = "";
    restaurantProfileOwnerName.value = "";
    setDynamicRuntimeAttribute(restaurantProfileEmail, "value", "");
    restaurantProfileCity.value = "";
    restaurantProfileAddress.value = "";
    restaurantProfileNotes.value = "";
    setDynamicRuntimeAttribute(restaurantProfilePlanName, "value", translateRuntimeText(EMPTY_STATUS_LABEL));
    setDynamicRuntimeAttribute(restaurantProfileActivatedUntil, "value", translateRuntimeText(EMPTY_STATUS_LABEL));
    applyRestaurantProfilePhoneValue("");
    syncRestaurantProfilePreview("");
    return;
  }
  const demoUsage = getRestaurantDemoUsage(restaurant);
  restaurantProfileName.value = restaurant.name || "";
  restaurantProfileOwnerName.value = restaurant.ownerName || "";
  setDynamicRuntimeAttribute(restaurantProfileEmail, "value", restaurant.email || "");
  restaurantProfileCity.value = restaurant.city || "";
  restaurantProfileAddress.value = restaurant.address || "";
  restaurantProfileNotes.value = restaurant.notes || "";
  setDynamicRuntimeAttribute(restaurantProfilePlanName, "value", restaurant.planName || translateRuntimeText(EMPTY_STATUS_LABEL));
  setDynamicRuntimeAttribute(
    restaurantProfileActivatedUntil,
    "value",
    restaurant.activatedUntil ? formatProfileDate(restaurant.activatedUntil) : translateRuntimeText(EMPTY_STATUS_LABEL),
  );
  applyRestaurantProfilePhoneValue(restaurant.phone || "");
  if (isDemoRestaurant(restaurant) && restaurantProfileNotes && !restaurantProfileNotes.value.trim()) {
    restaurantProfileNotes.value = translateRuntimeText(`Demo comercial activa · ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos usados.`);
  }
  syncRestaurantProfilePreview(selectedRestaurantProfileLogoUrl || restaurant.logoUrl || "");
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
    restaurantLoginFeedback.textContent = translateRuntimeText("El acceso está vencido. Debe renovarse desde administración.");
    restaurantLoginFeedback.className = "form-feedback form-feedback--error";
    restaurantLoginFeedback.hidden = false;
    showTurnoAlert(translateRuntimeText("El acceso de este restaurante esta vencido."), "warning");
    return;
  }

  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.signIn !== "function") {
    restaurantLoginFeedback.textContent = translateRuntimeText("Firebase Authentication no está disponible en esta configuración.");
    restaurantLoginFeedback.className = "form-feedback form-feedback--error";
    restaurantLoginFeedback.hidden = false;
    showTurnoAlert(translateRuntimeText("Firebase Authentication no esta disponible en esta configuracion."), "error");
    return;
  }

  try {
    await backend.signIn(username, password, { persistence: "local" });
    restaurantLoginForm.reset();
    restaurantLoginUsername.focus();
  } catch (error) {
    console.error("No se pudo iniciar sesion con Firebase Authentication.", error);
    const errorCode = String(error?.code || "");
    const errorMessage = String(error?.message || "").trim().toLowerCase();
    const isCredentialError = [
      "auth/invalid-credential",
      "auth/user-not-found",
      "auth/wrong-password",
      "auth/invalid-login-credentials",
      "auth/invalid-email",
    ].includes(errorCode)
      || errorMessage.includes("incorrect username or password")
      || errorMessage.includes("invalid login credentials")
      || errorMessage.includes("wrong-password")
      || errorMessage.includes("wrong password")
      || errorMessage.includes("user-not-found")
      || errorMessage.includes("user not found");

    restaurantLoginFeedback.textContent =
      isCredentialError
        ? translateRuntimeText("Usuario o contrasena incorrectos.")
        : knownRestaurant
        ? translateRuntimeText("No se pudo iniciar sesion. Verifica que la cuenta del restaurante exista en Firebase Authentication y que la clave coincida.")
        : translateRuntimeText("Usuario o contrasena incorrectos.");
    restaurantLoginFeedback.className = "form-feedback form-feedback--error";
    restaurantLoginFeedback.hidden = false;

    if (!isCredentialError) {
      showTurnoAlert(translateRuntimeText("No se pudo iniciar sesion. Revisa credenciales, dominio autorizado y el perfil users/{uid}."), "error");
    }
  }
}

async function handleRestaurantLogout() {
  const backend = await waitForFirebaseBackend();
  preparePrivateFirebaseSignOut();
  clearCurrentRestaurantSession();
  lastRenderedRestaurantId = "";
  activeSection = "orders";
  syncRestaurantAccess();

  if (backend?.enabled && typeof backend.signOut === "function") {
    await backend.signOut();
  }
}

function formatProfileDate(value) {
  if (!value) return translateRuntimeText(EMPTY_STATUS_LABEL);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function syncRestaurantProfilePreview(logoUrl) {
  if (!restaurantProfileLogoPreview || !restaurantProfileLogoPreviewImage) return;
  const normalized = String(logoUrl || "").trim();
  if (!normalized) {
    restaurantProfileLogoPreview.hidden = true;
    restaurantProfileLogoPreviewImage.removeAttribute("src");
    return;
  }
  restaurantProfileLogoPreviewImage.src = normalized;
  restaurantProfileLogoPreview.hidden = false;
}

async function handleRestaurantProfileLogoSelection(event) {
  const file = event.target.target?.files?.[0] || event.target.files?.[0] || null;
  if (!file) {
    selectedRestaurantProfileLogoUrl = "";
    const currentRestaurant = getCurrentRestaurantSession()
      ? getRestaurantById(getCurrentRestaurantSession().restaurantId)
      : null;
    syncRestaurantProfilePreview(currentRestaurant?.logoUrl || "");
    return;
  }

  try {
    selectedRestaurantProfileLogoUrl = await optimizeAccountImage(file);
    syncRestaurantProfilePreview(selectedRestaurantProfileLogoUrl);
  } catch (error) {
    const message = error instanceof Error ? translateRuntimeText(error.message) : translateRuntimeText("No se pudo preparar el logo del restaurante.");
    showTurnoAlert(message, "error");
  }
}

function handleRestaurantProfileSubmit(event) {
  event.preventDefault();
  const session = getCurrentRestaurantSession();
  if (!session) return;

  const phoneValidation = validateRestaurantProfilePhoneNumber({ report: true });
  if (!phoneValidation.valid) {
    restaurantProfileFeedback.textContent = phoneValidation.message;
    restaurantProfileFeedback.className = "form-feedback form-feedback--error";
    restaurantProfileFeedback.hidden = false;
    return;
  }

  const currentRestaurant = getRestaurantById(session.restaurantId);
  const nextRestaurant = updateRestaurantAccount(session.restaurantId, {
    name: restaurantProfileName?.value || currentRestaurant?.name || "",
    ownerName: restaurantProfileOwnerName?.value || "",
    phone: restaurantProfilePhone?.value || "",
    city: restaurantProfileCity?.value || "",
    address: restaurantProfileAddress?.value || "",
    notes: restaurantProfileNotes?.value || "",
    logoUrl: selectedRestaurantProfileLogoUrl || currentRestaurant?.logoUrl || "",
  });

  if (!nextRestaurant) {
    restaurantProfileFeedback.textContent = translateRuntimeText("No se pudo guardar el perfil del restaurante.");
    restaurantProfileFeedback.className = "form-feedback form-feedback--error";
    restaurantProfileFeedback.hidden = false;
    return;
  }

  selectedRestaurantProfileLogoUrl = "";
  restaurantProfileFeedback.textContent = translateRuntimeText("Perfil actualizado correctamente.");
  restaurantProfileFeedback.className = "form-feedback form-feedback--success";
  restaurantProfileFeedback.hidden = false;
  renderRestaurant();
}

function setRestaurantProfilePhoneError(message = "") {
  return restaurantProfilePhoneController?.setError(message);
}

function renderRestaurantProfilePhoneCountryState() {
  return restaurantProfilePhoneController?.renderState();
}

function buildRestaurantProfilePhoneNumber() {
  return restaurantProfilePhoneController?.buildPhoneNumber() || "";
}

function syncRestaurantProfilePhoneHiddenValue() {
  return restaurantProfilePhoneController?.syncHiddenValue() || "";
}

function validateRestaurantProfilePhoneNumber(options = {}) {
  return restaurantProfilePhoneController?.validate(options) || { valid: true, phone: "", message: "" };
}

function renderRestaurantProfilePhoneCountryList() {
  return restaurantProfilePhoneController?.renderList();
}

function openRestaurantProfilePhoneCountryPanel() {
  return restaurantProfilePhoneController?.openPanel();
}

function closeRestaurantProfilePhoneCountryPanel() {
  return restaurantProfilePhoneController?.closePanel();
}

function toggleRestaurantProfilePhoneCountryPanel() {
  return restaurantProfilePhoneController?.togglePanel();
}

function handleRestaurantProfilePhoneOutsideClick(event) {
  if (!restaurantProfilePhoneField || restaurantProfilePhoneCountryPanel?.hidden) return;
  if (restaurantProfilePhoneField.contains(event.target)) return;
  closeRestaurantProfilePhoneCountryPanel();
}

function handleRestaurantProfilePhoneKeydown(event) {
  if (event.key !== "Escape" || restaurantProfilePhoneCountryPanel?.hidden) return;
  closeRestaurantProfilePhoneCountryPanel();
  restaurantProfilePhoneCountryTrigger?.focus();
}

function initializeRestaurantProfilePhoneField() {
  return restaurantProfilePhoneController?.initialize();
}

function splitRestaurantProfilePhoneValue(value) {
  return restaurantProfilePhoneController?.splitValue(value) || { iso: SHARED_DEFAULT_PHONE_COUNTRY_ISO, local: "" };
}

function applyRestaurantProfilePhoneValue(value) {
  return restaurantProfilePhoneController?.setValue(value);
}

async function optimizeAccountImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen valida.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("La imagen pesa demasiado. Usa una de menos de 5 MB.");
  }

  const image = await loadLocalImage(file);
  const canvas = document.createElement("canvas");
  const maxSide = 220;
  const scale = Math.min(maxSide / image.width, maxSide / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const optimizedPng = canvas.toDataURL("image/png");
  if (optimizedPng.length <= 350000) return optimizedPng;
  const optimizedJpeg = canvas.toDataURL("image/jpeg", 0.9);
  if (optimizedJpeg.length <= 350000) return optimizedJpeg;
  throw new Error("La imagen sigue siendo grande. Usa una más simple o recortada.");
}

function loadLocalImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("No se pudo abrir la imagen."));
      image.onload = () => resolve(image);
      image.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
}

function togglePasswordVisibility(input, button) {
  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.setAttribute("aria-label", translateRuntimeText(shouldShow ? "Ocultar contraseña" : "Mostrar contraseña"));
  button.classList.toggle("is-active", shouldShow);
  const icon = button.querySelector(".material-symbols-rounded");
  if (icon) {
    icon.dataset.icon = shouldShow ? "visibility_off" : "visibility";
  }
}

function toggleRestaurantAccountMenu(event) {
  event?.stopPropagation();
  if (!restaurantAccountPanel || !restaurantAccountButton) return;
  const shouldOpen = restaurantAccountPanel.hidden;
  restaurantAccountPanel.hidden = !shouldOpen;
  restaurantAccountButton.setAttribute("aria-expanded", String(shouldOpen));
}

function closeRestaurantAccountMenu() {
  if (!restaurantAccountPanel || !restaurantAccountButton) return;
  restaurantAccountPanel.hidden = true;
  restaurantAccountButton.setAttribute("aria-expanded", "false");
}

function handleRestaurantAccountOutsideClick(event) {
  if (!restaurantAccountPanel || restaurantAccountPanel.hidden) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest("#restaurantAccountMenu")) return;
  closeRestaurantAccountMenu();
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

function syncRestaurantHistoryQuickFilters() {
  const isTodayHistory = activeSection === "history" && activeArchivedPeriod === "day";
  restaurantHistoryQuickFilters.forEach((button) => {
    const matchesStatus = (button.dataset.restaurantHistoryFilter || "all") === String(archivedStatusFilter?.value || "all");
    button.classList.toggle("is-active", isTodayHistory && matchesStatus);
  });
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

  if (restaurantHomeButton) {
    restaurantHomeButton.classList.add("is-active");
    restaurantHomeButton.setAttribute("aria-current", "page");
  }

  sectionPanels.forEach((panel) => {
    const isActive = panel.dataset.sectionPanel === activeSection;
    panel.hidden = !isActive;
    panel.classList.toggle("restaurant-section--active", isActive);
  });
}

function renderDashboard(stats) {
  if (restaurantDashboardPeriod) {
    restaurantDashboardPeriod.value = stats.period;
  }
  dashboardTotalToday.textContent = stats.totalToday;
  dashboardDeliveredToday.textContent = stats.deliveredToday;
  dashboardOnTimeRate.textContent = `${stats.onTimeRate}%`;
  dashboardDelayedActive.textContent = stats.delayedActive;
  dashboardDelayedActiveAction.textContent = stats.delayedActive;
  dashboardLongestWait.textContent = formatDurationMinutes(stats.longestActiveMinutes);
  dashboardSlowestOrder.textContent = stats.slowestOrder ? stats.slowestOrder.orderNumber : translateRuntimeText("Sin datos");
  dashboardSlowestOrderHint.textContent = stats.slowestOrder
    ? translateRuntimeText(`${stats.slowestOrder.customerName} · ${formatDurationMinutes(getOrderDurationMinutes(stats.slowestOrder))}`)
    : translateRuntimeText("Pedido con mayor espera activa");
  dashboardSlowestStatus.textContent = stats.slowestStatus ? translateRuntimeText(stats.slowestStatus.label) : translateRuntimeText("Sin datos");
  dashboardSlowestStatusHint.textContent = stats.slowestStatus
    ? translateRuntimeText(`Promedio ${formatStatusDurationLabel(stats.slowestStatus.averageMinutes)}`)
    : translateRuntimeText("Promedio por estado");
  dashboardFeedbackCountCard.textContent = stats.feedbackCount;
  dashboardAiHighRisk.textContent = stats.aiHighRiskCount;
  dashboardAiPressure.textContent = stats.aiPressureLabel;
  dashboardAiEtaGap.textContent = translateRuntimeText(`${stats.aiAverageExtraMinutes} min`);
  dashboardAiConfidence.textContent = stats.aiModelConfidenceLabel;
  dashboardAiConfidence.classList.toggle(
    "dashboard-card__value--compact",
    String(stats.aiModelConfidenceLabel || "").trim().length >= 10,
  );
  dashboardAiConfidenceHint.textContent =
    stats.aiModelSampleSize >= 1
      ? translateRuntimeText(
        `${stats.aiModelSampleSize} cierres reales del local${stats.aiModelMeanAbsoluteError !== null ? ` · error medio ${stats.aiModelMeanAbsoluteError} min` : ""}`,
      )
      : translateRuntimeText("Todavia reuniendo muestras del local");
  dashboardFeedbackCount.textContent = stats.feedbackCount;
  dashboardLowRatingCount.textContent = stats.lowRatingCount;
  dashboardPeakHour.textContent = translateRuntimeText(`Hora pico ${stats.peakHour}`);
  dashboardCancellationRate.textContent = `${stats.cancellationRate}%`;
  dashboardAvgResolution.textContent = stats.deliveredCount ? formatDurationMinutes(stats.avgResolutionMinutes) : "--:--";
  dashboardAiFocusOrder.textContent = stats.aiFocusOrder
    ? translateRuntimeText(`${stats.aiFocusOrder.orderNumber} · ${formatAiRiskLabel(stats.aiFocusOrder.aiRiskLevel)}`)
    : translateRuntimeText("Sin datos");
  dashboardHeroLeadMetric.textContent = stats.readyInPeriod ? formatDurationMinutes(stats.avgReadyMinutes) : "--:--";
  dashboardHeroLeadHint.textContent = stats.readyInPeriod
    ? translateRuntimeText(
      `${stats.onTimeRate}% de pedidos listos dentro de la promesa ${stats.periodScopeLabel}${stats.avgReadyDelayMinutes > 0 ? ` · desvío medio +${stats.avgReadyDelayMinutes} min` : ""} · modelo ${stats.aiModelConfidenceLabel.toLowerCase()}`,
    )
    : translateRuntimeText(`En cuanto cierres pedidos ${stats.periodScopeLabel}, aquí verás la velocidad real y el aprendizaje del local`);
  dashboardHeroActiveNow.textContent = stats.activeNow;
  dashboardHeroReadyNow.textContent = stats.readyNow;
  dashboardHeroRating.textContent = stats.averageRating ? `${stats.averageRating} / 5` : translateRuntimeText("Sin datos");

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
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
  container.innerHTML = "";
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const maxValue = safeItems.reduce((max, item) => Math.max(max, Number(item.count || 0)), 0);

  if (!safeItems.length || maxValue <= 0) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight";
    empty.textContent = translateText(emptyMessage);
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

    label.textContent = translateText(item.label);
    value.textContent = item.valueLabel ? translateText(item.valueLabel) : String(item.count || 0);
    fill.style.width = `${Math.max(10, Math.round((Number(item.count || 0) / maxValue) * 100))}%`;
    fill.style.background = item.color || "#ec7c0d";
    track.append(fill);
    row.append(label, track, value);
    container.append(row);
  });
}

function renderDashboardDonut(container, items, centerLabel) {
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
  container.innerHTML = "";
  const safeItems = Array.isArray(items) ? items.filter((item) => Number(item?.count || 0) > 0) : [];
  const total = safeItems.reduce((sum, item) => sum + Number(item.count || 0), 0);

  if (!total) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight dashboard-insight--empty-chart";
    empty.textContent = translateText("Sin datos suficientes por ahora.");
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
  const centerCopy = document.createElement("span");
  const centerValue = document.createElement("strong");
  centerCopy.textContent = translateText(centerLabel);
  centerValue.textContent = String(total);
  center.append(centerCopy, centerValue);
  chart.append(center);

  legend.className = "dashboard-donut__legend";
  safeItems.forEach((item) => {
    const row = document.createElement("div");
    const dot = document.createElement("span");
    const label = document.createElement("span");
    const value = document.createElement("strong");
    row.className = "dashboard-donut__legend-row";
    dot.className = "dashboard-donut__dot";
    dot.style.background = item.color || "#ec7c0d";
    label.textContent = translateText(item.label);
    value.textContent = String(item.count);
    row.append(dot, label, value);
    legend.append(row);
  });

  container.append(chart, legend);
}

function buildImprovementInsights(stats) {
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
  const insights = [];

  if (stats.aiModelSampleSize >= 8) {
    insights.push(translateText(`La IA ya aprende de ${stats.aiModelSampleSize} cierres reales del local y opera con confianza ${stats.aiModelConfidenceLabel.toLowerCase()}.`));
  } else {
    insights.push(translateText("La IA todavia esta aprendiendo este restaurante. Cuantos mas pedidos cierres, mejor ajustara ETAs, prioridades y decisiones de servicio."));
  }

  if (stats.aiDominantBottleneck) {
    insights.push(translateText(`Cuello dominante ${stats.periodScopeLabel}: ${stats.aiDominantBottleneck.label}. Afecta a ${stats.aiDominantBottleneck.count} pedido${stats.aiDominantBottleneck.count === 1 ? "" : "s"} activos.`));
  }

  if (stats.aiHighRiskCount >= 1) {
    insights.push(translateText(`La IA adaptativa detecta ${stats.aiHighRiskCount} pedido${stats.aiHighRiskCount === 1 ? "" : "s"} en riesgo alto. Conviene actuar antes de que impacten en experiencia o cancelaciones.`));
  } else if (stats.aiAttentionCount >= 2) {
    insights.push(translateText("La IA ve varios pedidos bajo presion. Aun no estan fuera de tiempo, pero la cola empieza a tensarse."));
  }

  if (stats.aiAverageExtraMinutes >= 4) {
    insights.push(translateText("La prediccion adaptativa ya añade varios minutos sobre la promesa actual. Hay señales de saturacion en cocina o recogida."));
  }

  if (stats.avgReadyDelayMinutes >= 4) {
    insights.push(translateText("El tiempo real hasta dejar el pedido listo está por encima de la promesa media. Conviene reajustar promesas o descargar el cuello operativo."));
  } else if (stats.readyInPeriod > 0) {
    insights.push(translateText("El tiempo real hasta dejar el pedido listo está alineado con la promesa media. Eso refuerza confianza y percepción de control."));
  }

  if (stats.delayedActive >= 2) {
    insights.push(translateText("Hay varios pedidos activos fuera de promesa. Priorizar estos pedidos puede evitar reclamaciones y proteger la experiencia."));
  }

  if (stats.onTimeRate > 0 && stats.onTimeRate < 70) {
    insights.push(translateText("Menos del 70% de los pedidos cumplen la promesa al cliente. Aquí hay margen directo para mejorar operación y credibilidad."));
  }

  if (stats.cancellationRate >= 10) {
    insights.push(translateText("La tasa de cancelación es relevante. Merece revisar retrasos, stock o comunicación con el cliente."));
  }

  if (stats.averageRating && Number(stats.averageRating) < 4) {
    insights.push(translateText("La valoración media está por debajo de 4. Revisar comentarios bajos puede señalar fallos repetidos."));
  } else if (stats.ratedCount > 0) {
    insights.push(translateText("La satisfacción del cliente es sólida. Pedir más valoraciones puede reforzar esta métrica."));
  }

  if (stats.lowRatingCount >= 2) {
    insights.push(translateText(`Hay varias valoraciones bajas ${stats.periodScopeLabel}. Conviene revisar esos casos antes de que se repitan en más clientes.`));
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
  const sortOrder = activeSortOrder.value || "all";
  if (sortOrder === "all") {
    return 0;
  }

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

  if (!isWithinDashboardPeriod(order.archivedAt, activeArchivedPeriod)) return false;

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
  text.textContent = translateRuntimeText(message);
  card.append(text);
  return card;
}

function translateBuiltInOrderText(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return "";

  if (["Pedido rápido", "Alta manual", "Cliente mostrador"].includes(normalized)) {
    return translateRuntimeText(normalized);
  }

  return normalized;
}

function buildAiRiskHint(label, level) {
  const translatedLabel = String(label || "").trim();
  const explanation =
    level === "high"
      ? translateRuntimeText("este pedido necesita atencion inmediata porque esta bloqueado, retrasado o claramente comprometido.")
      : level === "medium"
        ? translateRuntimeText("el pedido aun esta bajo control, pero ya muestra señales reales de tension o espera anomala.")
        : translateRuntimeText("el pedido sigue una secuencia temporal consistente con la operativa actual del local.");

  return `${translatedLabel}: ${explanation}`;
}

function getOrderByAnyId(orderId) {
  const normalized = String(orderId || "").trim();
  if (!normalized) return null;
  const allOrders = loadOrders();
  const rawOrder = allOrders.find((order) => String(order.id || "").trim() === normalized) || null;
  if (!rawOrder) return null;

  const restaurantOrders = allOrders.filter(
    (order) => !order.archivedAt && String(order.restaurantId || "") === String(rawOrder.restaurantId || ""),
  );
  const enrichedOrder = enrichOrdersWithIntelligence(restaurantOrders, { allOrders }).find(
    (order) => String(order.id || "").trim() === normalized,
  );
  return enrichedOrder || rawOrder;
}

function refreshOpenRestaurantModals() {
  if (!commentModal.hidden && activeCommentOrderId) {
    const order = getOrderByAnyId(activeCommentOrderId);
    if (order) openCommentModal(order);
  }

  if (!aiModal.hidden && activeAiOrderId) {
    const order = getOrderByAnyId(activeAiOrderId);
    if (order) openAiModal(order, lastAiTriggerButton);
  }

  if (!cancelModal.hidden && pendingCancelOrderId) {
    const order = getOrderByAnyId(pendingCancelOrderId);
    if (order) openCancelModal(order);
  }
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
  const intelligenceInfo = document.createElement("button");
  const compactSide = document.createElement("div");
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
  intelligenceInfo.className = "order-card__intelligence-info";
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

  compactTitle.textContent = `${order.orderNumber} · ${translateBuiltInOrderText(order.customerName)}`;
  compactLine.append(document.createTextNode(translateBuiltInOrderText(order.items)));
  if (order.sourceOrderId) {
    compactLine.append(document.createTextNode(translateRuntimeText(` · Ticket ${order.sourceOrderId}`)));
  }
  compactLine.append(document.createTextNode(" · "), buildEtaHintElement(order));
  intelligenceLabel.textContent = translateRuntimeText("IA TurnoListo");
  intelligenceBadge.textContent = formatAiRiskLabel(order.aiRiskLevel);
  intelligenceEta.textContent = formatAiEta(order);
  const shouldShowIntelligenceReason = Boolean(order.aiReason || order.aiRecommendation) && !(order.aiRiskLevel === "low" && order.status !== "ready");
  intelligenceInfo.type = "button";
  intelligenceInfo.textContent = "!";
  intelligenceInfo.setAttribute("aria-label", translateRuntimeText("Ver detalle de TurnoListo Intelligence"));
  intelligenceInfo.setAttribute("title", translateRuntimeText("Ver detalle de TurnoListo Intelligence"));
  intelligenceInfo.hidden = !shouldShowIntelligenceReason;
  intelligenceInfo.addEventListener("click", (event) => {
    event.stopPropagation();
    openAiModal(order, intelligenceInfo);
  });
  intelligenceLabel.dataset.termHint =
    translateRuntimeText("Capa de inteligencia operativa que estima tiempos, detecta riesgo y ayuda a priorizar pedidos en tiempo real.");
  intelligenceBadge.dataset.termHint = buildAiRiskHint(intelligenceBadge.textContent, order.aiRiskLevel);
  intelligenceEta.dataset.termHint =
    buildAiEtaHint(order, intelligenceEta.textContent) +
    (order.aiBottleneckLabel ? ` ${translateRuntimeText("Cuello principal detectado:")} ${translateRuntimeText(order.aiBottleneckLabel)}.` : "");
  intelligenceLabel.setAttribute("title", intelligenceLabel.dataset.termHint);
  intelligenceLabel.setAttribute("aria-label", intelligenceLabel.dataset.termHint);
  intelligenceBadge.setAttribute("title", intelligenceBadge.dataset.termHint);
  intelligenceBadge.setAttribute("aria-label", intelligenceBadge.dataset.termHint);
  intelligenceEta.setAttribute("title", intelligenceEta.dataset.termHint);
  intelligenceEta.setAttribute("aria-label", intelligenceEta.dataset.termHint);
  compactTime.textContent = translateRuntimeText(`Creado ${formatOrderTime(order.createdAt)}`);
  elapsedTime.className = `order-card__elapsed order-card__elapsed--${getElapsedOrderTone(order)}`;
  elapsedTime.textContent = getElapsedOrderTime(order);
  rating.className = "order-card__rating";
  rating.textContent = order.rating ? formatRating(order.rating.score) : translateRuntimeText("Sin valorar");
  commentButton.type = "button";
  commentButton.className = "comment-button";
  commentButton.textContent = translateRuntimeText("Ver comentario");
  commentButton.hidden = !(order.rating && order.rating.comment);
  commentButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openCommentModal(order);
  });
  badge.textContent = translateRuntimeText(statusMeta[order.status].label);
  badge.style.background = statusMeta[order.status].bg;
  badge.style.color = statusMeta[order.status].color;

  compactTop.append(elapsedTime);
  compactMeta.append(compactTop, compactTitle, compactLine);
  if (!isArchived) {
    intelligence.append(intelligenceLabel, intelligenceBadge, intelligenceEta, intelligenceInfo);
    compactMeta.append(intelligence);
  }
  compactMeta.append(compactTime);
  buildQuickStatusButtons(order, quickStatusActions, isArchived, isCounterMode);
  compactMain.append(compactMeta);
  ratingRow.append(rating, commentButton);
  compactSide.append(ratingRow, badge, quickStatusActions);
  compactButton.append(compactMain, compactSide);
  compactButton.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".term-hint")) return;
    if (isCounterMode) return;
    expandedOrderId = expandedOrderId === order.id ? null : order.id;
    renderRestaurant();
  });

  qr.src = buildQrUrl(order.publicTrackingToken || order.sourceOrderId || order.id);
  qr.alt = translateRuntimeText(`QR del pedido ${order.orderNumber}`);
  qr.className = "order-card__qr";

  const estimatedEtaField = getDisplayEstimatedReadyMinutes(order);
  grid.append(
    buildFieldWithOptions(translateRuntimeText("Código factura / ticket"), "sourceOrderId", order.sourceOrderId, !isEditing, {
      wide: true,
      className: "field--priority",
    }),
    buildFieldWithOptions(translateRuntimeText("Pedido"), "items", translateBuiltInOrderText(order.items), !isEditing, {
      wide: true,
      className: "field--priority",
    }),
    buildField(translateRuntimeText("Cliente"), "customerName", translateBuiltInOrderText(order.customerName), !isEditing),
    buildField(translateRuntimeText("Origen"), "sourceSystem", translateBuiltInOrderText(order.sourceSystem), !isEditing),
    buildFieldWithOptions(estimatedEtaField.label, "estimatedReadyMinutes", estimatedEtaField.value, !isEditing, {
      type: "number",
      placeholder: estimatedEtaField.placeholder,
    }),
    buildField(translateRuntimeText("Diligencias opcionales"), "notes", order.notes, !isEditing, true),
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    try {
      updateOrder(order.id, {
        sourceOrderId: String(formData.get("sourceOrderId") || "").trim(),
        sourceSystem: String(formData.get("sourceSystem") || "").trim() || "Alta manual",
        customerName: String(formData.get("customerName") || "").trim() || "Cliente mostrador",
        estimatedReadyMinutes: String(formData.get("estimatedReadyMinutes") || "").trim(),
        items: String(formData.get("items") || "").trim() || "Pedido rápido",
        notes: String(formData.get("notes") || "").trim(),
      });
      editingOrderId = null;
      renderRestaurant();
    } catch (error) {
      if (error instanceof Error && error.message === "duplicate-source-order") {
        showTurnoAlert(translateRuntimeText("Ese pedido original ya existe."), "warning");
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
  link.textContent = translateRuntimeText("Abrir vista cliente");

  editButton.type = "button";
  editButton.className = "button-secondary";
  editButton.textContent = translateRuntimeText("Editar información");
  editButton.hidden = isArchived || isEditing || isCounterMode;
  editButton.addEventListener("click", () => {
    editingOrderId = order.id;
    renderRestaurant();
  });

  saveButton.type = "submit";
  saveButton.className = "button-secondary";
  saveButton.textContent = translateRuntimeText("Guardar cambios");
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
    label.textContent = translateRuntimeText(statusMeta[status].label);
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
  return buildFieldWithOptions(label, name, value, disabled, { wide, type });
}

function buildFieldWithOptions(label, name, value, disabled, options = {}) {
  const wrapper = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");
  const { wide = false, type = "text", placeholder = "", className = "" } = options;

  wrapper.className = `field${wide ? " field--wide" : ""}${className ? ` ${className}` : ""}`;
  text.textContent = label;
  input.name = name;
  input.type = type;
  input.value = value;
  input.disabled = disabled;
  input.placeholder = placeholder;

  wrapper.append(text, input);
  return wrapper;
}

function getDisplayEstimatedReadyMinutes(order) {
  const manualEta = Number.parseInt(String(order?.estimatedReadyMinutes || ""), 10);
  if (Number.isFinite(manualEta) && manualEta > 0) {
    return { label: translateRuntimeText("Tiempo estimado (min)"), value: String(manualEta), placeholder: "" };
  }

  const aiEta = Number.parseInt(String(order?.aiEtaMinutes || ""), 10);
  if (Number.isFinite(aiEta) && aiEta > 0) {
    return { label: translateRuntimeText("ETA IA (min)"), value: "", placeholder: String(aiEta) };
  }

  return { label: translateRuntimeText("Tiempo estimado (min)"), value: "", placeholder: "" };
}

function formatOrderEtaSummary(order) {
  if (order.status === "ready") return translateRuntimeText("Listo para recoger");
  if (order.status === "delivered") return translateRuntimeText("Entregado");
  if (order.status === "cancelled") return translateRuntimeText("Cancelado / desistio");

  const remainingMinutes = getRemainingEstimatedMinutes(order);
  if (remainingMinutes === null) {
    const aiEta = Number(order.aiEtaMinutes || 0);
    if (Number.isFinite(aiEta) && aiEta > 0) {
      return translateRuntimeText(`ETA IA ${aiEta} min`);
    }
    return translateRuntimeText("Sin ETA");
  }
  if (remainingMinutes <= 0) return translateRuntimeText("Retrasado");
  if (remainingMinutes === 1) return translateRuntimeText("ETA 1 min");
  return translateRuntimeText(`ETA ${remainingMinutes} min`);
}

function formatAiRiskLabel(level) {
  if (level === "high") return translateRuntimeText("Critico");
  if (level === "medium") return translateRuntimeText("Atencion");
  return translateRuntimeText("Saludable");
}

function formatAiEta(order) {
  if (order.status === "ready") return translateRuntimeText("ETA IA 0 min");
  const eta = Number(order.aiEtaMinutes || 0);
  if (!Number.isFinite(eta) || eta <= 0) return translateRuntimeText("ETA IA --");
  return translateRuntimeText(`ETA IA ${eta} min`);
}

function buildAiEtaHint(order, visibleLabel) {
  if (order.status === "ready") {
    return `${visibleLabel}: ${translateRuntimeText("el pedido ya esta listo para recoger, asi que la prioridad pasa a ser evitar esperas innecesarias en recogida.")}`;
  }

  const eta = Number(order.aiEtaMinutes || 0);
  if (!Number.isFinite(eta) || eta <= 0) {
    return `${visibleLabel}: ${translateRuntimeText("TurnoListo todavia no tiene una estimacion fiable para este pedido.")}`;
  }

  const modelSuffix =
    Number(order.aiModelSampleSize || 0) >= 8
      ? ` ${translateRuntimeText(`Ya incorpora ${order.aiModelSampleSize} cierres reales de este restaurante.`)}`
      : "";
  return `${visibleLabel}: ${translateRuntimeText("TurnoListo estima este tiempo restante segun la carga actual, el historico del local y los atascos detectados por etapa.")}${modelSuffix}`;
}

function buildEtaHintElement(order) {
  const summary = formatOrderEtaSummary(order);
  const element = document.createElement("span");
  element.textContent = summary;
  const aiEta = Number(order.aiEtaMinutes || 0);
  const hasAiEta = Number.isFinite(aiEta) && aiEta > 0;
  const remainingMinutes = getRemainingEstimatedMinutes(order);
  const hasManualEtaSummary = order.status !== "ready" && order.status !== "delivered" && order.status !== "cancelled" && (remainingMinutes === null || remainingMinutes >= 0);

  if (!hasAiEta || hasManualEtaSummary) {
    element.className = "term-hint";
    const hint =
      !hasAiEta
        ? translateRuntimeText("ETA significa tiempo estimado para que el pedido este listo. En este caso todavia no hay una estimacion cargada.")
        : translateRuntimeText("ETA significa tiempo estimado para que el pedido este listo segun el ritmo actual del local.");
    element.dataset.termHint = hint;
    element.setAttribute("title", hint);
    element.setAttribute("aria-label", hint);
  }

  if (hasAiEta) {
    element.className = "term-hint";
    const hint = translateRuntimeText("ETA IA es la estimacion de TurnoListo cuando el pedido no tiene un tiempo manual cargado.");
    element.dataset.termHint = hint;
    element.setAttribute("title", hint);
    element.setAttribute("aria-label", hint);
  }

  return element;
}

function setQuickCreateFeedback(message, type = "success", action = null) {
  if (!quickCreateFeedback) return;
  quickCreateFeedback.textContent = message;
  quickCreateFeedback.className = `form-feedback form-feedback--${type}`;
  quickCreateFeedback.hidden = false;

  if (action?.label && action?.href) {
    quickCreateFeedback.append(document.createTextNode(" "));
    const link = document.createElement("a");
    link.className = "button-secondary button-secondary--primary form-feedback__action";
    link.href = action.href;
    link.textContent = action.label;
    quickCreateFeedback.append(link);
  }
}

function clearQuickCreateFeedback() {
  if (!quickCreateFeedback) return;
  quickCreateFeedback.hidden = true;
  quickCreateFeedback.textContent = "";
}

function buildActivationRequestUrl(restaurant, demoUsage) {
  const params = new URLSearchParams();
  const restaurantName = String(restaurant?.name || "Restaurante demo").trim();
  params.set("interest", "Seguimiento de cuenta");
  params.set(
    "message",
    translateRuntimeText(
      `Hola, hemos alcanzado el limite de la demo (${demoUsage.usedOrders}/${demoUsage.maxOrders}) y queremos activar la cuenta de ${restaurantName}. Por favor, contactadnos para completar la activacion del plan.`,
    ),
  );
  params.set("activationRequest", "1");
  return `./contact.html?${params.toString()}`;
}

function handleCreateOrder(event) {
  event.preventDefault();
  const formData = new FormData(quickCreateForm);
  let order = null;

  try {
    order = createOrder({
      sourceOrderId: String(formData.get("sourceOrderId") || ""),
      estimatedReadyMinutes: String(formData.get("estimatedReadyMinutes") || "").trim(),
      customerName: String(formData.get("customerName") || ""),
      items: String(formData.get("items") || ""),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "missing-source-order") {
      setQuickCreateFeedback(translateRuntimeText("Necesitas pegar el codigo de factura o ticket."), "error");
      return;
    }

    if (error instanceof Error && error.message === "duplicate-source-order") {
      setQuickCreateFeedback(translateRuntimeText("Ese pedido ya existe."), "error");
      return;
    }

    if (error instanceof Error && error.message === "demo-order-limit") {
      const session = getCurrentRestaurantSession();
      const restaurant = session ? getRestaurantById(session.restaurantId) : null;
      const demoUsage = getRestaurantDemoUsage(restaurant);
      setQuickCreateFeedback(
        translateRuntimeText(
          `Has alcanzado el limite de la demo (${demoUsage.maxOrders} pedidos). Activa el plan completo para seguir operando con pedidos reales, historico e IA sin tope.`,
        ),
        "error",
        {
          label: translateRuntimeText("Solicitar activacion"),
          href: buildActivationRequestUrl(restaurant, demoUsage),
        },
      );
      return;
    }

    throw error;
  }

  quickCreateForm.reset();
  const session = getCurrentRestaurantSession();
  const restaurant = session ? getRestaurantById(session.restaurantId) : null;
  if (isDemoRestaurant(restaurant)) {
    const demoUsage = getRestaurantDemoUsage(restaurant);
    if (demoUsage.remainingOrders > 0) {
      setQuickCreateFeedback(
        translateRuntimeText(
          `Pedido creado. La demo ya va por ${demoUsage.usedOrders}/${demoUsage.maxOrders}. Quedan ${demoUsage.remainingOrders} pedidos para seguir mostrando el valor del producto.`,
        ),
        "success",
      );
    } else {
      setQuickCreateFeedback(
        translateRuntimeText(
          `Pedido creado. Has completado ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos de demo. Es un gran momento para activar el plan completo.`,
        ),
        "success",
        {
          label: translateRuntimeText("Solicitar activacion"),
          href: buildActivationRequestUrl(restaurant, demoUsage),
        },
      );
    }
  } else {
    clearQuickCreateFeedback();
  }
  expandedOrderId = order.id;
  editingOrderId = null;
  activeSection = "orders";
  renderRestaurant();
}

function openCommentModal(order) {
  activeCommentOrderId = order.id;
  commentTitle.textContent = `${order.orderNumber} · ${translateBuiltInOrderText(order.customerName)}`;
  commentMeta.textContent = translateRuntimeText(`Valoración ${formatRating(order.rating?.score || 0)} · ${translateBuiltInOrderText(order.items)}`);
  commentBody.textContent = order.rating?.comment || translateRuntimeText("Sin comentario");
  commentModal.hidden = false;
}

function closeCommentModal() {
  commentModal.hidden = true;
  activeCommentOrderId = null;
}

function openAiModal(order, triggerButton = null) {
  activeAiOrderId = order.id;
  lastAiTriggerButton = triggerButton;
  aiTitle.textContent = `${order.orderNumber} · ${translateBuiltInOrderText(order.customerName)}`;
  aiMeta.textContent = [formatAiRiskLabel(order.aiRiskLevel), formatAiEta(order), order.aiBottleneckLabel ? `${translateRuntimeText("Cuello:")} ${translateRuntimeText(order.aiBottleneckLabel)}` : ""]
    .filter(Boolean)
    .join(" · ");
  aiBody.textContent = [order.aiReason, "", order.aiRecommendation]
    .filter(Boolean)
    .map((line) => translateRuntimeText(line))
    .join("\n");
  aiModal.hidden = false;
  aiClose.focus();
}

function closeAiModal() {
  aiModal.hidden = true;
  lastAiTriggerButton?.focus?.();
  lastAiTriggerButton = null;
  activeAiOrderId = null;
}

function openCancelModal(order) {
  pendingCancelOrderId = order.id;
  pendingCancelOrderLabel = `${order.orderNumber} · ${translateBuiltInOrderText(order.customerName)}`;
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

function handleRestaurantGlobalKeydown(event) {
  if (event.key !== "Escape") return;
  if (!aiModal.hidden) {
    closeAiModal();
    return;
  }
  if (!commentModal.hidden) {
    closeCommentModal();
    return;
  }
  if (!cancelModal.hidden) {
    closeCancelModal();
  }
}
