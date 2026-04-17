const adminLoginView = document.querySelector("#adminLoginView");
const adminWorkspace = document.querySelector("#adminWorkspace");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminLoginFeedback = document.querySelector("#adminLoginFeedback");
const adminLoginUsername = adminLoginForm.querySelector('[name="username"]');
const adminLoginPassword = document.querySelector("#adminLoginPassword");
const adminLoginTogglePassword = document.querySelector("#adminLoginTogglePassword");
const adminCreateRestaurantForm = document.querySelector("#adminCreateRestaurantForm");
const adminCreateFeedback = document.querySelector("#adminCreateFeedback");
const adminRestaurantLogoInput = document.querySelector("#adminRestaurantLogoInput");
const adminRestaurantLogoFilename = document.querySelector("#adminRestaurantLogoFilename");
const adminRestaurantLogoPreview = document.querySelector("#adminRestaurantLogoPreview");
const adminRestaurantLogoPreviewImage = document.querySelector("#adminRestaurantLogoPreviewImage");
const adminPlanSelect = document.querySelector("#adminPlanSelect");
const adminActivationDays = document.querySelector("#adminActivationDays");
const adminPlanHint = document.querySelector("#adminPlanHint");
const adminCreateRestaurantName = adminCreateRestaurantForm.querySelector('[name="name"]');
const adminCreateRestaurantOwner = adminCreateRestaurantForm.querySelector('[name="ownerName"]');
const adminCreateRestaurantPhone = document.querySelector("#adminRestaurantPhoneFull");
const adminPhoneField = document.querySelector("#adminPhoneField");
const adminPhoneCountryTrigger = document.querySelector("#adminPhoneCountryTrigger");
const adminPhoneCountryPanel = document.querySelector("#adminPhoneCountryPanel");
const adminPhoneCountryFlag = document.querySelector("#adminPhoneCountryFlag");
const adminPhoneCountryDial = document.querySelector("#adminPhoneCountryDial");
const adminPhoneCountryName = document.querySelector("#adminPhoneCountryName");
const adminPhoneCountrySearch = document.querySelector("#adminPhoneCountrySearch");
const adminPhoneCountryList = document.querySelector("#adminPhoneCountryList");
const adminRestaurantPhoneLocal = document.querySelector("#adminRestaurantPhoneLocal");
const adminPhoneHint = document.querySelector("#adminPhoneHint");
const adminPhoneError = document.querySelector("#adminPhoneError");
const adminRestaurantList = document.querySelector("#adminRestaurantList");
const adminRestaurantCount = document.querySelector("#adminRestaurantCount");
const adminTabs = document.querySelectorAll("[data-admin-section]");
const adminPanels = document.querySelectorAll("[data-admin-panel]");
const adminDashboardLinks = document.querySelectorAll('.workspace-brand--link[href="./admin.html"], .workspace-home-button[href="./admin.html"]');
const adminHomeButton = document.querySelector('.workspace-home-button[href="./admin.html"]');
const adminHeaderMessagesButton = document.querySelector('.workspace-mail-button[data-admin-section="messages"]');
const adminSearchInput = document.querySelector("#adminSearchInput");
const adminStatusFilter = document.querySelector("#adminStatusFilter");
const adminActivityFilter = document.querySelector("#adminActivityFilter");
const adminLifecycleFilter = document.querySelector("#adminLifecycleFilter");
const adminStatRestaurants = document.querySelector("#adminStatRestaurants");
const adminStatExpiredRestaurants = document.querySelector("#adminStatExpiredRestaurants");
const adminStatTotalOrders = document.querySelector("#adminStatTotalOrders");
const adminStatActiveOrders = document.querySelector("#adminStatActiveOrders");
const adminStatDelivered = document.querySelector("#adminStatDelivered");
const adminStatDemoRestaurants = document.querySelector("#adminStatDemoRestaurants");
const adminStatDemoReady = document.querySelector("#adminStatDemoReady");
const adminDashboardPeriod = document.querySelector("#adminDashboardPeriod");
const adminHeroActiveBase = document.querySelector("#adminHeroActiveBase");
const adminHeroActiveBaseHint = document.querySelector("#adminHeroActiveBaseHint");
const adminHeroWeeklyActivity = document.querySelector("#adminHeroWeeklyActivity");
const adminHeroWeeklyActivityHint = document.querySelector("#adminHeroWeeklyActivityHint");
const adminHeroRenewal = document.querySelector("#adminHeroRenewal");
const adminHeroRenewalHint = document.querySelector("#adminHeroRenewalHint");
const adminHeroRisk = document.querySelector("#adminHeroRisk");
const adminHeroRiskHint = document.querySelector("#adminHeroRiskHint");
const adminActionRenewal = document.querySelector("#adminActionRenewal");
const adminActionOnboarding = document.querySelector("#adminActionOnboarding");
const adminActionRisk = document.querySelector("#adminActionRisk");
const adminActionHealthy = document.querySelector("#adminActionHealthy");
const adminActionRenewalCount = document.querySelector("#adminActionRenewalCount");
const adminActionOnboardingCount = document.querySelector("#adminActionOnboardingCount");
const adminActionRiskCount = document.querySelector("#adminActionRiskCount");
const adminActionHealthyCount = document.querySelector("#adminActionHealthyCount");
const adminActionRenewalHint = document.querySelector("#adminActionRenewalHint");
const adminActionOnboardingHint = document.querySelector("#adminActionOnboardingHint");
const adminActionRiskHint = document.querySelector("#adminActionRiskHint");
const adminActionHealthyHint = document.querySelector("#adminActionHealthyHint");
const adminTopRestaurantPanel = document.querySelector("#adminTopRestaurantPanel");
const adminAccessDonut = document.querySelector("#adminAccessDonut");
const adminOrderOutcomeDonut = document.querySelector("#adminOrderOutcomeDonut");
const adminAccessMix = document.querySelector("#adminAccessMix");
const adminOrderOutcomeMix = document.querySelector("#adminOrderOutcomeMix");
const adminAdoptionMix = document.querySelector("#adminAdoptionMix");
const adminTopRestaurantsBars = document.querySelector("#adminTopRestaurantsBars");
const adminInsights = document.querySelector("#adminInsights");
const adminExportDatasetButton = document.querySelector("#adminExportDatasetButton");
const adminDatasetTotal = document.querySelector("#adminDatasetTotal");
const adminDatasetDelivered = document.querySelector("#adminDatasetDelivered");
const adminDatasetReady = document.querySelector("#adminDatasetReady");
const adminDatasetAdaptive = document.querySelector("#adminDatasetAdaptive");
const adminDatasetAdaptiveHint = document.querySelector("#adminDatasetAdaptiveHint");
const adminDatasetInsights = document.querySelector("#adminDatasetInsights");
const adminTermTooltip = document.querySelector("#adminTermTooltip");
const adminDeleteModal = document.querySelector("#adminDeleteModal");
const adminDeleteBackdrop = document.querySelector("#adminDeleteBackdrop");
const adminDeleteClose = document.querySelector("#adminDeleteClose");
const adminDeleteBack = document.querySelector("#adminDeleteBack");
const adminDeleteConfirm = document.querySelector("#adminDeleteConfirm");
const adminDeleteMeta = document.querySelector("#adminDeleteMeta");
const adminActivatePlanModal = document.querySelector("#adminActivatePlanModal");
const translateRuntimeText = (value) =>
  window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
const translateRuntimeKey = (key, fallback = "") =>
  window.TurnoListoI18n?.translateKey ? window.TurnoListoI18n.translateKey(key, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const formatRuntimeKey = (key, params = {}, fallback = "") =>
  window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const setDynamicRuntimeAttribute = window.TurnoListoDom?.setDynamicAttribute;
const setDynamicRuntimeText = window.TurnoListoDom?.setDynamicText;
const adminActivatePlanBackdrop = document.querySelector("#adminActivatePlanBackdrop");
const adminActivatePlanClose = document.querySelector("#adminActivatePlanClose");
const adminActivatePlanBack = document.querySelector("#adminActivatePlanBack");
const adminActivatePlanConfirm = document.querySelector("#adminActivatePlanConfirm");
const adminActivatePlanMeta = document.querySelector("#adminActivatePlanMeta");
const adminActivatePlanSelect = document.querySelector("#adminActivatePlanSelect");
const adminActivatePlanDays = document.querySelector("#adminActivatePlanDays");
const adminRenewPlanModal = document.querySelector("#adminRenewPlanModal");
const adminRenewPlanBackdrop = document.querySelector("#adminRenewPlanBackdrop");
const adminRenewPlanClose = document.querySelector("#adminRenewPlanClose");
const adminRenewPlanBack = document.querySelector("#adminRenewPlanBack");
const adminRenewPlanConfirm = document.querySelector("#adminRenewPlanConfirm");
const adminRenewPlanMeta = document.querySelector("#adminRenewPlanMeta");
const adminRenewPlanCurrentStatus = document.querySelector("#adminRenewPlanCurrentStatus");
const adminRenewPlanSelect = document.querySelector("#adminRenewPlanSelect");
const adminRenewPlanDays = document.querySelector("#adminRenewPlanDays");
const adminRenewPlanStartsAt = document.querySelector("#adminRenewPlanStartsAt");
const adminRenewPlanEndsAt = document.querySelector("#adminRenewPlanEndsAt");
const adminEmailTemplatesModal = document.querySelector("#adminEmailTemplatesModal");
const adminEmailTemplatesBackdrop = document.querySelector("#adminEmailTemplatesBackdrop");
const adminEmailTemplatesClose = document.querySelector("#adminEmailTemplatesClose");
const adminEmailTemplatesMeta = document.querySelector("#adminEmailTemplatesMeta");
const adminEmailTemplateOptions = document.querySelector("#adminEmailTemplateOptions");
const adminEmailTemplateTo = document.querySelector("#adminEmailTemplateTo");
const adminEmailTemplateSubject = document.querySelector("#adminEmailTemplateSubject");
const adminEmailTemplateBody = document.querySelector("#adminEmailTemplateBody");
const adminEmailCopySubject = document.querySelector("#adminEmailCopySubject");
const adminEmailCopyBody = document.querySelector("#adminEmailCopyBody");
const adminEmailCopyAll = document.querySelector("#adminEmailCopyAll");
const adminEmailOpenMail = document.querySelector("#adminEmailOpenMail");
const adminUnreadMessagesBadge = document.querySelector("#adminUnreadMessagesBadge");
const adminMessageList = document.querySelector("#adminMessageList");
const adminMessageSearchInput = document.querySelector("#adminMessageSearchInput");
const adminMessageStatusFilter = document.querySelector("#adminMessageStatusFilter");
const adminMessageInterestFilter = document.querySelector("#adminMessageInterestFilter");
const adminMessageSortOrder = document.querySelector("#adminMessageSortOrder");
const adminMessagesTotalChip = document.querySelector("#adminMessagesTotalChip");
const adminMessagesUnreadChip = document.querySelector("#adminMessagesUnreadChip");
const adminMessagesReadChip = document.querySelector("#adminMessagesReadChip");
const adminMessageQuickFilters = document.querySelectorAll("[data-message-quick-filter]");
const adminAccountButton = document.querySelector("#adminAccountButton");
const adminAccountPanel = document.querySelector("#adminAccountPanel");
const adminAccountAvatarImage = document.querySelector("#adminAccountAvatarImage");
const adminAccountAvatarFallback = document.querySelector("#adminAccountAvatarFallback");
const adminAccountName = document.querySelector("#adminAccountName");
const adminAccountMeta = document.querySelector("#adminAccountMeta");
const adminMenuProfile = document.querySelector("#adminMenuProfile");
const adminMenuLogout = document.querySelector("#adminMenuLogout");
const adminProfileForm = document.querySelector("#adminProfileForm");
const adminProfileAvatarInput = document.querySelector("#adminProfileAvatarInput");
const adminProfileAvatarPreview = document.querySelector("#adminProfileAvatarPreview");
const adminProfileAvatarPreviewImage = document.querySelector("#adminProfileAvatarPreviewImage");
const adminProfileDisplayName = document.querySelector("#adminProfileDisplayName");
const adminProfileEmail = document.querySelector("#adminProfileEmail");
const adminProfilePhone = document.querySelector("#adminProfilePhone");
const adminProfileTitle = document.querySelector("#adminProfileTitle");
const adminProfileFeedback = document.querySelector("#adminProfileFeedback");
const adminCreateAdminForm = document.querySelector("#adminCreateAdminForm");
const adminCreateAdminFeedback = document.querySelector("#adminCreateAdminFeedback");
const adminCreateAdminPhone = document.querySelector("#adminCreateAdminPhoneFull");
const adminCreateAdminPhoneField = document.querySelector("#adminCreateAdminPhoneField");
const adminCreateAdminPhoneCountryTrigger = document.querySelector("#adminCreateAdminPhoneCountryTrigger");
const adminCreateAdminPhoneCountryPanel = document.querySelector("#adminCreateAdminPhoneCountryPanel");
const adminCreateAdminPhoneCountryFlag = document.querySelector("#adminCreateAdminPhoneCountryFlag");
const adminCreateAdminPhoneCountryDial = document.querySelector("#adminCreateAdminPhoneCountryDial");
const adminCreateAdminPhoneCountryName = document.querySelector("#adminCreateAdminPhoneCountryName");
const adminCreateAdminPhoneCountrySearch = document.querySelector("#adminCreateAdminPhoneCountrySearch");
const adminCreateAdminPhoneCountryList = document.querySelector("#adminCreateAdminPhoneCountryList");
const adminCreateAdminPhoneLocal = document.querySelector("#adminCreateAdminPhoneLocal");
const adminCreateAdminPhoneHint = document.querySelector("#adminCreateAdminPhoneHint");
const adminCreateAdminPhoneError = document.querySelector("#adminCreateAdminPhoneError");
const adminUsersList = document.querySelector("#adminUsersList");

let activeAdminSection = "dashboard";
let pendingDeleteRestaurantId = null;
let pendingDeleteRestaurantName = "";
let pendingActivatePlanRestaurantId = null;
let pendingActivatePlanRestaurantName = "";
let pendingRenewPlanRestaurantId = null;
let pendingRenewPlanRestaurantName = "";
let pendingEmailTemplateRestaurantId = null;
let activeEmailTemplateKey = "credentials";
let activeEmailTemplateDraft = null;
let selectedRestaurantLogoUrl = "";
let selectedAdminAvatarUrl = "";
let adminTermTooltipTimer = 0;
let adminContactInquiries = [];
let adminMessagesUnsubscribe = null;
let adminUsers = [];
let adminAuthRequestToken = 0;
let activeAdminDashboardPeriod = normalizeDashboardPeriod(
  window.localStorage.getItem("turnolisto-admin-dashboard-period") || "day",
);
const SHARED_PLAN_CATALOG = window.TurnoListoPlans?.catalog || [];
const PLAN_DURATIONS = Object.freeze(
  SHARED_PLAN_CATALOG.length
    ? Object.fromEntries(SHARED_PLAN_CATALOG.map((plan) => [plan.name, plan.activationDays]))
    : {
      Demo: 7,
      Quincenal: 15,
      Mensual: 30,
      Trimestral: 90,
      Semestral: 180,
      Anual: 365,
    },
);
const RENEWABLE_PLAN_NAMES = window.TurnoListoPlans?.renewablePlanNames || ["Quincenal", "Mensual", "Trimestral", "Semestral", "Anual"];
const CONTACT_INQUIRIES_COLLECTION = "contactInquiries";
const adminRestaurantPhoneController = window.TurnoListoPhoneFields?.create({
  elements: {
    field: adminPhoneField,
    countryTrigger: adminPhoneCountryTrigger,
    countryPanel: adminPhoneCountryPanel,
    countryFlag: adminPhoneCountryFlag,
    countryDial: adminPhoneCountryDial,
    countryName: adminPhoneCountryName,
    countrySearch: adminPhoneCountrySearch,
    countryList: adminPhoneCountryList,
    localInput: adminRestaurantPhoneLocal,
    hiddenInput: adminCreateRestaurantPhone,
    hintElement: adminPhoneHint,
    errorElement: adminPhoneError,
  },
  translateText: translateRuntimeText,
  translateKey: translateRuntimeKey,
  formatKey: formatRuntimeKey,
  isRequired: () => String(adminPlanSelect?.value || "") !== "Demo",
});
const adminCreateAdminPhoneController = window.TurnoListoPhoneFields?.create({
  elements: {
    field: adminCreateAdminPhoneField,
    countryTrigger: adminCreateAdminPhoneCountryTrigger,
    countryPanel: adminCreateAdminPhoneCountryPanel,
    countryFlag: adminCreateAdminPhoneCountryFlag,
    countryDial: adminCreateAdminPhoneCountryDial,
    countryName: adminCreateAdminPhoneCountryName,
    countrySearch: adminCreateAdminPhoneCountrySearch,
    countryList: adminCreateAdminPhoneCountryList,
    localInput: adminCreateAdminPhoneLocal,
    hiddenInput: adminCreateAdminPhone,
    hintElement: adminCreateAdminPhoneHint,
    errorElement: adminCreateAdminPhoneError,
  },
  translateText: translateRuntimeText,
  translateKey: translateRuntimeKey,
  formatKey: formatRuntimeKey,
  isRequired: () => false,
});

initializeAdminFirebaseAuth();
bootAdminPage();
onOrdersChanged(() => {
  waitForDataReady().then(renderAdminWorkspace);
});
adminLoginForm.addEventListener("submit", handleAdminLogin);
adminLoginTogglePassword.addEventListener("click", (event) => {
  event.preventDefault();
  togglePasswordVisibility(adminLoginPassword, adminLoginTogglePassword);
});
adminCreateRestaurantForm.addEventListener("submit", handleCreateRestaurant);
adminRestaurantLogoInput.addEventListener("change", handleRestaurantLogoSelection);
adminPlanSelect.addEventListener("change", syncActivationDaysWithPlan);
adminDeleteBackdrop.addEventListener("click", closeDeleteModal);
adminDeleteClose.addEventListener("click", closeDeleteModal);
adminDeleteBack.addEventListener("click", closeDeleteModal);
adminDeleteConfirm.addEventListener("click", confirmDeleteRestaurant);
adminActivatePlanBackdrop?.addEventListener("click", closeActivatePlanModal);
adminActivatePlanClose?.addEventListener("click", closeActivatePlanModal);
adminActivatePlanBack?.addEventListener("click", closeActivatePlanModal);
adminActivatePlanConfirm?.addEventListener("click", confirmActivateRestaurantPlan);
adminActivatePlanSelect?.addEventListener("change", syncActivatePlanDays);
adminRenewPlanBackdrop?.addEventListener("click", closeRenewPlanModal);
adminRenewPlanClose?.addEventListener("click", closeRenewPlanModal);
adminRenewPlanBack?.addEventListener("click", closeRenewPlanModal);
adminRenewPlanConfirm?.addEventListener("click", confirmRenewRestaurantPlan);
adminRenewPlanSelect?.addEventListener("change", syncRenewPlanDays);
adminEmailTemplatesBackdrop?.addEventListener("click", closeEmailTemplatesModal);
adminEmailTemplatesClose?.addEventListener("click", closeEmailTemplatesModal);
adminEmailCopySubject?.addEventListener("click", () => copyEmailTemplatePart("subject"));
adminEmailCopyBody?.addEventListener("click", () => copyEmailTemplatePart("body"));
adminEmailCopyAll?.addEventListener("click", () => copyEmailTemplatePart("all"));
adminEmailOpenMail?.addEventListener("click", openSelectedEmailTemplateInMailApp);
adminExportDatasetButton?.addEventListener("click", handleExportPredictionDataset);
adminDashboardPeriod?.addEventListener("change", (event) => {
  activeAdminDashboardPeriod = normalizeDashboardPeriod(event.target.value || "day");
  window.localStorage.setItem("turnolisto-admin-dashboard-period", activeAdminDashboardPeriod);
  renderAdminWorkspace();
});
bindAdminActionQueue(adminActionRenewal, "renewal");
bindAdminActionQueue(adminActionOnboarding, "onboarding");
bindAdminActionQueue(adminActionRisk, "at-risk");
bindAdminActionQueue(adminActionHealthy, "healthy");
adminTabs.forEach((button) => {
  button.addEventListener("click", () => {
    navigateAdminSection(button.dataset.adminSection || "dashboard");
  });
});
adminDashboardLinks.forEach((link) => {
  link.addEventListener("click", handleAdminDashboardShortcut);
});
[adminSearchInput, adminStatusFilter, adminActivityFilter, adminLifecycleFilter].forEach((control) => {
  control.addEventListener("input", renderAdminWorkspace);
  control.addEventListener("change", renderAdminWorkspace);
});
[adminMessageSearchInput, adminMessageStatusFilter, adminMessageInterestFilter, adminMessageSortOrder].forEach((control) => {
  if (!control) return;
  control.addEventListener("input", renderAdminMessagesPanel);
  control.addEventListener("change", renderAdminMessagesPanel);
});
adminMessageQuickFilters.forEach((button) => {
  button.addEventListener("click", () => {
    if (!adminMessageStatusFilter) return;
    adminMessageStatusFilter.value = button.dataset.messageQuickFilter || "all";
    renderAdminMessagesPanel();
  });
});
adminAccountButton?.addEventListener("click", toggleAdminAccountMenu);
adminMenuLogout?.addEventListener("click", async () => {
  closeAdminAccountMenu();
  await handleAdminLogout();
});
adminProfileForm?.addEventListener("submit", handleAdminProfileSubmit);
adminProfileAvatarInput?.addEventListener("change", handleAdminAvatarSelection);
adminCreateAdminForm?.addEventListener("submit", handleCreateAdminAccount);
window.addEventListener("click", handleAdminAccountOutsideClick);
window.addEventListener("turnolisto:language-change", () => {
  adminRestaurantPhoneController?.refreshLanguage();
  adminCreateAdminPhoneController?.refreshLanguage();
  syncActivationDaysWithPlan();
  if (isAdminAuthenticated()) {
    renderAdminWorkspace();
    void refreshOpenAdminModals();
  }
});
window.addEventListener("hashchange", () => {
  syncAdminSectionFromHash();
  if (isAdminAuthenticated()) {
    syncAdminSections();
  }
});

function bootAdminPage() {
  syncAdminSectionFromHash();
  initializeTermHints(document.querySelector("#adminWorkspace"));
  initializeAdminPhoneField();
  initializeAdminCreateAdminPhoneField();
  syncAdminAccess();
  syncActivationDaysWithPlan();
  if (isAdminAuthenticated()) {
    initializeAdminInbox();
    refreshAdminUsers();
    renderAdminWorkspace();
  }
}

function initializeTermHints(root) {
  if (!root) return;
  root.querySelectorAll(".term-hint[data-term-hint]").forEach((element) => {
    const hint = String(element.dataset.termHint || "").trim();
    if (hint) {
      element.setAttribute("title", hint);
      element.setAttribute("aria-label", hint);
    }
  });
}

function getPlanDefinition(planName, fallbackName = "Mensual") {
  if (window.TurnoListoPlans?.getDefinition) {
    return window.TurnoListoPlans.getDefinition(planName, fallbackName);
  }

  const normalizedPlanName = String(planName || "").trim();
  return {
    name: PLAN_DURATIONS[normalizedPlanName] ? normalizedPlanName : fallbackName,
    activationDays: PLAN_DURATIONS[normalizedPlanName] || PLAN_DURATIONS[fallbackName] || 30,
    salesHint: "",
  };
}

function buildPlanHint(plan) {
  if (!plan) return "";
  if (plan.salesHint) return translateRuntimeText(plan.salesHint);
  return translateRuntimeText(`${plan.name}: ${plan.activationDays} días de acceso para este ciclo comercial.`);
}

function syncDynamicFieldValue(element, value) {
  setDynamicRuntimeAttribute(element, "value", value);
}

function syncDynamicFieldPlaceholder(element, value) {
  setDynamicRuntimeAttribute(element, "placeholder", value);
}

function syncActivationDaysWithPlan() {
  const plan = getPlanDefinition(adminPlanSelect.value || "Mensual");
  const isDemo = plan.name === "Demo";

  syncDynamicFieldValue(adminActivationDays, String(plan.activationDays));
  setDynamicRuntimeText(adminPlanHint, buildPlanHint(plan));

  adminActivationDays.readOnly = true;
  if (adminCreateRestaurantOwner) adminCreateRestaurantOwner.required = !isDemo;
  if (adminRestaurantPhoneLocal) adminRestaurantPhoneLocal.required = !isDemo;
  if (adminCreateRestaurantName) {
    syncDynamicFieldPlaceholder(adminCreateRestaurantName, translateRuntimeText(isDemo ? "Ej. Demo Kebab Centro" : "Ej. Burger Centro"));
  }
  validateAdminPhoneNumber({ report: false });
}

function handleAdminPhoneCountryOutsideClick(event) {
  if (!adminPhoneField || adminPhoneCountryPanel?.hidden) return;
  if (adminPhoneField.contains(event.target)) return;
  closeAdminPhoneCountryPanel();
}

function handleAdminPhoneCountryKeydown(event) {
  if (event.key !== "Escape" || adminPhoneCountryPanel?.hidden) return;
  closeAdminPhoneCountryPanel();
  adminPhoneCountryTrigger?.focus();
}

function handleAdminCreateAdminPhoneCountryOutsideClick(event) {
  if (!adminCreateAdminPhoneField || adminCreateAdminPhoneCountryPanel?.hidden) return;
  if (adminCreateAdminPhoneField.contains(event.target)) return;
  closeAdminCreateAdminPhoneCountryPanel();
}

function handleAdminCreateAdminPhoneKeydown(event) {
  if (event.key !== "Escape" || adminCreateAdminPhoneCountryPanel?.hidden) return;
  closeAdminCreateAdminPhoneCountryPanel();
  adminCreateAdminPhoneCountryTrigger?.focus();
}

function isAdminAuthenticated() {
  return getCurrentUserProfile()?.role === "admin";
}

function syncAdminAccess() {
  const authenticated = isAdminAuthenticated();
  adminLoginView.hidden = authenticated;
  adminWorkspace.hidden = !authenticated;
}

function syncAdminSections() {
  adminTabs.forEach((button) => {
    const isActive = button.dataset.adminSection === activeAdminSection;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (adminHomeButton) {
    const isHomeSection = activeAdminSection !== "messages";
    adminHomeButton.classList.toggle("is-active", isHomeSection);
    adminHomeButton.setAttribute("aria-current", isHomeSection ? "page" : "false");
  }

  if (adminHeaderMessagesButton) {
    const isMessagesSection = activeAdminSection === "messages";
    adminHeaderMessagesButton.classList.toggle("is-active", isMessagesSection);
    adminHeaderMessagesButton.setAttribute("aria-pressed", String(isMessagesSection));
  }

  adminPanels.forEach((panel) => {
    const isActive = panel.dataset.adminPanel === activeAdminSection;
    panel.hidden = !isActive;
    panel.classList.toggle("restaurant-section--active", isActive);
  });
}

function syncAdminSectionFromHash() {
  const section = String(window.location.hash || "").replace(/^#/, "").trim();
  const allowed = new Set(["dashboard", "create", "restaurants", "messages"]);
  activeAdminSection = allowed.has(section) ? section : "dashboard";
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.signIn !== "function") {
    adminLoginFeedback.textContent = translateRuntimeText("Firebase Authentication no está disponible en esta configuración.");
    adminLoginFeedback.className = "form-feedback form-feedback--error";
    adminLoginFeedback.hidden = false;
    return;
  }

  try {
    await backend.signIn(username, password);
    adminLoginForm.reset();
    adminLoginFeedback.hidden = true;
    adminLoginFeedback.textContent = "";
  } catch (error) {
    console.error("No se pudo iniciar sesion como administrador.", error);
    adminLoginFeedback.textContent = translateRuntimeText("Credenciales incorrectas o la cuenta no tiene un perfil admin en users/{uid}.");
    adminLoginFeedback.className = "form-feedback form-feedback--error";
    adminLoginFeedback.hidden = false;
    showTurnoAlert(translateRuntimeText("No se pudo iniciar sesion como administrador. Verifica credenciales, dominio autorizado y el perfil users/{uid}."), "error");
  }
}

async function handleAdminLogout() {
  adminMessagesUnsubscribe?.();
  adminMessagesUnsubscribe = null;
  adminContactInquiries = [];
  adminUsers = [];
  selectedAdminAvatarUrl = "";
  const backend = await waitForFirebaseBackend();
  preparePrivateFirebaseSignOut();
  clearCurrentUserProfile();
  syncAdminAccess();
  closeAdminAccountMenu();

  if (backend?.enabled && typeof backend.signOut === "function") {
    await backend.signOut();
  }
}

async function handleCreateRestaurant(event) {
  event.preventDefault();
  const formData = new FormData(adminCreateRestaurantForm);
  const backend = await waitForFirebaseBackend();

  if (!backend?.enabled || typeof backend.createRestaurantAccount !== "function") {
    adminCreateFeedback.textContent = translateRuntimeText("La automatizacion del alta no esta disponible. Revisa Firebase Functions.");
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(translateRuntimeText("La automatizacion del alta no esta disponible. Revisa Firebase Functions."), "error");
    return;
  }

  try {
    const phoneValidation = validateAdminPhoneNumber({ report: true });
    if (!phoneValidation.valid) {
      adminRestaurantPhoneLocal?.focus();
      showTurnoAlert(phoneValidation.message, "error");
      return;
    }
    const result = await backend.createRestaurantAccount({
      name: formData.get("name"),
      ownerName: formData.get("ownerName"),
      email: formData.get("email"),
      phone: phoneValidation.phone,
      country: phoneValidation.countryName,
      phoneCountry: phoneValidation.phoneCountry,
      city: formData.get("city"),
      address: formData.get("address"),
      logoUrl: selectedRestaurantLogoUrl,
      demoMode: String(formData.get("planName") || "") === "Demo",
      planName: formData.get("planName"),
      activationDays: formData.get("activationDays"),
      notes: formData.get("notes"),
      appUrl: buildRestaurantAccessUrl(),
    });
    const restaurant = {
      ...(result?.restaurant || {}),
      accessLink: String(result?.accessLink || "").trim(),
    };

    adminCreateRestaurantForm.reset();
    resetRestaurantLogoPreview();
    resetAdminPhoneField();
    syncActivationDaysWithPlan();
    await reconnectDataStoreToFirebase();
    adminCreateFeedback.textContent =
      restaurant.demoMode
        ? translateRuntimeText(`DEMO creada para ${restaurant.name}. Queda lista para probar pedidos, QR e IA adaptativa con límites comerciales.`)
        : translateRuntimeText(`Acceso creado para ${restaurant.name}. Se preparó un enlace seguro para definir la contraseña.`);
    adminCreateFeedback.className = "form-feedback form-feedback--success";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(
      restaurant.demoMode
        ? translateRuntimeText(`Demo comercial de ${restaurant.name} creada correctamente.`)
        : translateRuntimeText(`Restaurante ${restaurant.name} creado correctamente.`),
      "success",
    );
    await openCredentialsEmail(restaurant);
    activeAdminSection = "restaurants";
    renderAdminWorkspace();
  } catch (error) {
    console.error("No se pudo crear el restaurante automaticamente.", error);
    const message =
      error?.code === "functions/already-exists"
        ? translateRuntimeText("Ese correo ya existe para otro restaurante o en Firebase Authentication.")
        : translateRuntimeText("No se pudo crear el restaurante. Revisa Firebase Functions, permisos y configuracion.");
    adminCreateFeedback.textContent = message;
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(message, "error");
  }
}

function setAdminPhoneError(message = "") {
  return adminRestaurantPhoneController?.setError(message);
}

function renderAdminPhoneCountryState() {
  return adminRestaurantPhoneController?.renderState();
}

function buildAdminPhoneNumber() {
  return adminRestaurantPhoneController?.buildPhoneNumber() || "";
}

function syncAdminPhoneHiddenValue() {
  return adminRestaurantPhoneController?.syncHiddenValue() || "";
}

function validateAdminPhoneNumber(options = {}) {
  return adminRestaurantPhoneController?.validate(options) || { valid: true, phone: "", message: "" };
}

function renderAdminPhoneCountryList() {
  return adminRestaurantPhoneController?.renderList();
}

function openAdminPhoneCountryPanel() {
  return adminRestaurantPhoneController?.openPanel();
}

function closeAdminPhoneCountryPanel() {
  return adminRestaurantPhoneController?.closePanel();
}

function toggleAdminPhoneCountryPanel() {
  return adminRestaurantPhoneController?.togglePanel();
}

function resetAdminPhoneField() {
  return adminRestaurantPhoneController?.reset();
}

function initializeAdminPhoneField() {
  return adminRestaurantPhoneController?.initialize();
}

function setAdminCreateAdminPhoneError(message = "") {
  return adminCreateAdminPhoneController?.setError(message);
}

function renderAdminCreateAdminPhoneCountryState() {
  return adminCreateAdminPhoneController?.renderState();
}

function buildAdminCreateAdminPhoneNumber() {
  return adminCreateAdminPhoneController?.buildPhoneNumber() || "";
}

function syncAdminCreateAdminPhoneHiddenValue() {
  return adminCreateAdminPhoneController?.syncHiddenValue() || "";
}

function validateAdminCreateAdminPhoneNumber(options = {}) {
  return adminCreateAdminPhoneController?.validate(options) || { valid: true, phone: "", message: "" };
}

function renderAdminCreateAdminPhoneCountryList() {
  return adminCreateAdminPhoneController?.renderList();
}

function openAdminCreateAdminPhoneCountryPanel() {
  return adminCreateAdminPhoneController?.openPanel();
}

function closeAdminCreateAdminPhoneCountryPanel() {
  return adminCreateAdminPhoneController?.closePanel();
}

function toggleAdminCreateAdminPhoneCountryPanel() {
  return adminCreateAdminPhoneController?.togglePanel();
}

function resetAdminCreateAdminPhoneField() {
  return adminCreateAdminPhoneController?.reset();
}

function initializeAdminCreateAdminPhoneField() {
  return adminCreateAdminPhoneController?.initialize();
}

function resetAdminRestaurantLogoFilename() {
  if (!adminRestaurantLogoFilename) return;
  adminRestaurantLogoFilename.setAttribute("data-i18n-key", "profile.file.empty");
  adminRestaurantLogoFilename.textContent = translateRuntimeText("Ningún archivo seleccionado");
  if (window.TurnoListoI18n?.translateDocument) {
    window.TurnoListoI18n.translateDocument(window.TurnoListoI18n.getLanguage?.());
  }
}

function setAdminRestaurantLogoFilename(file) {
  if (!adminRestaurantLogoFilename) return;
  const safeName = String(file?.name || "").trim();
  if (!safeName) {
    resetAdminRestaurantLogoFilename();
    return;
  }
  adminRestaurantLogoFilename.removeAttribute("data-i18n-key");
  adminRestaurantLogoFilename.textContent = safeName;
}

async function handleRestaurantLogoSelection(event) {
  const file = event.target.files?.[0] || null;
  if (!file) {
    resetRestaurantLogoPreview();
    return;
  }

  try {
    setAdminRestaurantLogoFilename(file);
    selectedRestaurantLogoUrl = await optimizeRestaurantLogo(file);
    adminRestaurantLogoPreviewImage.src = selectedRestaurantLogoUrl;
    adminRestaurantLogoPreview.hidden = false;
    adminCreateFeedback.hidden = true;
    adminCreateFeedback.textContent = "";
  } catch (error) {
    console.error("No se pudo preparar el logo del restaurante.", error);
    resetRestaurantLogoPreview();
    adminCreateFeedback.textContent =
      error instanceof Error ? translateRuntimeText(error.message) : translateRuntimeText("No se pudo procesar el logo. Usa una imagen JPG, PNG o WebP mas ligera.");
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(adminCreateFeedback.textContent, "error");
  }
}

function resetRestaurantLogoPreview() {
  selectedRestaurantLogoUrl = "";
  adminRestaurantLogoInput.value = "";
  resetAdminRestaurantLogoFilename();
  adminRestaurantLogoPreviewImage.removeAttribute("src");
  adminRestaurantLogoPreview.hidden = true;
}

async function optimizeRestaurantLogo(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen valida para el logo.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("El logo pesa demasiado. Usa una imagen de menos de 5 MB.");
  }

  const image = await loadImageFile(file);
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
  if (optimizedPng.length <= 350000) {
    return optimizedPng;
  }

  const optimizedJpeg = canvas.toDataURL("image/jpeg", 0.9);
  if (optimizedJpeg.length <= 350000) {
    return optimizedJpeg;
  }

  throw new Error("El logo sigue siendo grande. Usa una imagen mas simple o recortada.");
}

function loadImageFile(file) {
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

function initializeAdminFirebaseAuth() {
  waitForFirebaseBackend().then((backend) => {
    if (!backend?.enabled || typeof backend.onAuthStateChanged !== "function") return;

    backend.onAuthStateChanged(async (user) => {
      const requestToken = ++adminAuthRequestToken;
      if (!user?.uid) {
        if (requestToken !== adminAuthRequestToken) return;
        clearCurrentUserProfile();
        syncAdminAccess();
        return;
      }

      try {
        const profile = await loadCurrentUserProfileFromBackend();
        if (requestToken !== adminAuthRequestToken) return;

        if (!profile || profile.role !== "admin") {
          clearCurrentUserProfile();
          adminLoginFeedback.textContent = !profile
            ? translateRuntimeText("No se encontró el perfil admin en users/{uid}.")
            : translateRuntimeText("La cuenta autenticada no tiene role=admin en users/{uid}.");
          adminLoginFeedback.className = "form-feedback form-feedback--error";
          adminLoginFeedback.hidden = false;
          showTurnoAlert(
            !profile
              ? translateRuntimeText("No se pudo restaurar el perfil administrador autenticado.")
              : translateRuntimeText("La cuenta autenticada no tiene permisos de administrador."),
            "error",
          );
          await backend.signOut();
          return;
        }

        adminLoginFeedback.hidden = true;
        adminLoginFeedback.textContent = "";
        syncAdminAccess();
        renderAdminWorkspace();

        void reconnectDataStoreToFirebase().then(async (result) => {
          if (requestToken !== adminAuthRequestToken) return;
          if (result?.reason === "role-mismatch" && result?.currentRole && result.currentRole !== "admin") {
            clearCurrentUserProfile();
            syncAdminAccess();
            await backend.signOut();
            return;
          }
          initializeAdminInbox();
          await refreshAdminUsers();
          syncAdminAccess();
          renderAdminWorkspace();
        });
      } catch (error) {
        if (requestToken !== adminAuthRequestToken) return;
        clearCurrentUserProfile();
        console.error("No se pudo restaurar la sesion del administrador.", error);
        adminLoginFeedback.textContent = translateRuntimeText("No se pudo restaurar la sesión del administrador. Inténtalo de nuevo.");
        adminLoginFeedback.className = "form-feedback form-feedback--error";
        adminLoginFeedback.hidden = false;
        syncAdminAccess();
      }
    });
  });
}

function navigateAdminSection(section) {
  closeAdminAccountMenu();
  activeAdminSection = section;
  const nextHash = section === "dashboard" ? "" : `#${section}`;
  if (window.location.hash !== nextHash) {
    history.replaceState(null, "", `${window.location.pathname}${nextHash}`);
  }
  syncAdminSections();
}

function handleAdminDashboardShortcut(event) {
  const currentPath = String(window.location.pathname || "").trim();
  if (!currentPath.endsWith("/admin.html") && currentPath !== "/admin.html") {
    return;
  }

  event.preventDefault();
  navigateAdminSection("dashboard");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleAdminAccountMenu(event) {
  event?.stopPropagation();
  if (!adminAccountPanel || !adminAccountButton) return;
  const shouldOpen = adminAccountPanel.hidden;
  adminAccountPanel.hidden = !shouldOpen;
  adminAccountButton.setAttribute("aria-expanded", String(shouldOpen));
}

function closeAdminAccountMenu() {
  if (!adminAccountPanel || !adminAccountButton) return;
  adminAccountPanel.hidden = true;
  adminAccountButton.setAttribute("aria-expanded", "false");
}

function handleAdminAccountOutsideClick(event) {
  if (!adminAccountPanel || adminAccountPanel.hidden) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest("#adminAccountMenu")) return;
  closeAdminAccountMenu();
}

function activateRestaurantPlan(restaurantId, planName = "Mensual") {
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return null;

  const plan = getPlanDefinition(planName, "Mensual");
  const normalizedPlanName = plan.name;
  const activationDays = plan.activationDays;
  const activatedAt = new Date().toISOString();
  const activatedUntil = new Date(Date.now() + activationDays * 24 * 60 * 60 * 1000).toISOString();

  return updateRestaurantAccount(restaurantId, {
    demoMode: false,
    demoConfig: null,
    planName: normalizedPlanName,
    activatedAt,
    activatedUntil,
  });
}

function syncActivatePlanDays() {
  if (!adminActivatePlanSelect || !adminActivatePlanDays) return;
  const plan = getPlanDefinition(adminActivatePlanSelect.value || "Mensual", "Mensual");
  syncDynamicFieldValue(adminActivatePlanDays, String(plan.activationDays));
}

function renewRestaurantPlan(restaurantId, planName = "Mensual") {
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return null;

  const normalizedPlanName = resolveRenewablePlanName(restaurant, planName);
  const renewalWindow = buildRenewPlanWindow(restaurant, normalizedPlanName);
  const activatedUntil = renewalWindow.endDate.toISOString();

  return updateRestaurantAccount(restaurantId, {
    demoMode: false,
    demoConfig: null,
    planName: normalizedPlanName,
    activatedUntil,
  });
}

function syncRenewPlanDays() {
  if (!adminRenewPlanSelect || !adminRenewPlanDays) return;
  const restaurant = pendingRenewPlanRestaurantId ? getRestaurantById(pendingRenewPlanRestaurantId) : null;
  const plan = adminRenewPlanSelect.value || resolveRenewablePlanName(restaurant);
  const renewalWindow = buildRenewPlanWindow(restaurant, plan);
  syncDynamicFieldValue(adminRenewPlanDays, String(renewalWindow.days));
  if (adminRenewPlanStartsAt) syncDynamicFieldValue(adminRenewPlanStartsAt, formatAdminDate(renewalWindow.startDate));
  if (adminRenewPlanEndsAt) syncDynamicFieldValue(adminRenewPlanEndsAt, formatAdminDate(renewalWindow.endDate));
}

function buildRenewPlanWindow(restaurant, planName = "Mensual") {
  const normalizedPlanName = resolveRenewablePlanName(restaurant, planName);
  const days = getPlanDefinition(normalizedPlanName, "Mensual").activationDays;
  const now = Date.now();
  const currentUntil = restaurant?.activatedUntil ? new Date(restaurant.activatedUntil).getTime() : now;
  const startTime = Math.max(now, currentUntil);
  const endTime = startTime + days * 24 * 60 * 60 * 1000;

  return {
    planName: normalizedPlanName,
    days,
    startDate: new Date(startTime),
    endDate: new Date(endTime),
  };
}

function resolveRenewablePlanName(restaurant, preferredPlanName = "") {
  const preferred = String(preferredPlanName || "").trim();
  if (RENEWABLE_PLAN_NAMES.includes(preferred)) return preferred;

  const current = String(restaurant?.planName || "").trim();
  if (RENEWABLE_PLAN_NAMES.includes(current)) return current;

  const previous = String(restaurant?.previousPlanName || "").trim();
  if (RENEWABLE_PLAN_NAMES.includes(previous)) return previous;

  return "Mensual";
}

async function initializeAdminInbox() {
  if (!isAdminAuthenticated()) return;
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled) return;

  adminMessagesUnsubscribe?.();
  adminMessagesUnsubscribe = null;

  try {
    const inquiries = await backend.loadCollection(CONTACT_INQUIRIES_COLLECTION);
    applyAdminInquiries(inquiries);
    adminMessagesUnsubscribe = backend.subscribeCollection(CONTACT_INQUIRIES_COLLECTION, (items) => {
      applyAdminInquiries(items);
      renderAdminMessagesPanel();
    });
  } catch (error) {
    console.error("No se pudo cargar la bandeja de contacto.", error);
    showTurnoAlert(translateRuntimeText("No se pudo cargar la bandeja de mensajes."), "error");
  }
}

function applyAdminInquiries(items) {
  adminContactInquiries = (Array.isArray(items) ? items : [])
    .map(normalizeAdminInquiry)
    .sort((left, right) => new Date(right.submittedAt) - new Date(left.submittedAt));
  updateAdminInboxBadge();
}

function normalizeAdminInquiry(inquiry) {
  const submittedAt = String(inquiry?.submittedAt || inquiry?.createdAt || new Date().toISOString());
  const isRead = inquiry?.isRead === true || String(inquiry?.status || "").trim().toLowerCase() === "read";
  return {
    ...inquiry,
    id: String(inquiry?.id || ""),
    name: String(inquiry?.name || "Sin nombre").trim(),
    company: String(inquiry?.company || "").trim(),
    email: String(inquiry?.email || "").trim(),
    phone: String(inquiry?.phone || "").trim(),
    interest: String(inquiry?.interest || "Consulta general").trim(),
    message: String(inquiry?.message || "").trim(),
    submittedAt,
    readAt: String(inquiry?.readAt || "").trim(),
    status: isRead ? "read" : "unread",
    isRead,
  };
}

function updateAdminInboxBadge() {
  if (!adminUnreadMessagesBadge) return;
  const unreadCount = adminContactInquiries.filter((item) => !item.isRead).length;
  adminUnreadMessagesBadge.textContent = String(unreadCount);
  adminUnreadMessagesBadge.hidden = unreadCount <= 0;
}

function renderAdminWorkspace() {
  if (!isAdminAuthenticated()) return;
  if (adminDashboardPeriod) {
    adminDashboardPeriod.value = activeAdminDashboardPeriod;
  }

  syncAdminSections();
  renderAdminAccount();
  renderAdminProfile();
  renderAdminUsersList();
  const stats = getAdminDashboardStats({ period: activeAdminDashboardPeriod });
  const restaurants = loadRestaurants();
  const orders = loadOrders();
  const enrichedRestaurants = restaurants
    .map((restaurant) => {
      const restaurantOrders = orders.filter((order) => order.restaurantId === restaurant.id);
      const deliveredOrders = restaurantOrders.filter((order) => order.status === "delivered");

      return {
        ...restaurant,
        status: getRestaurantAccessStatus(restaurant),
        remainingDays: getRestaurantRemainingDays(restaurant),
        orderCount: restaurantOrders.length,
        recent7dOrderCount: restaurantOrders.filter((order) => isWithinLastDays(order.createdAt, 7)).length,
        lastOrderAt: [...restaurantOrders]
          .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))[0]?.createdAt || "",
        activeOrderCount: restaurantOrders.filter((order) => !order.archivedAt).length,
        deliveredCount: deliveredOrders.length,
        cancelledCount: restaurantOrders.filter((order) => order.status === "cancelled").length,
        avgDeliveryMinutes: deliveredOrders.length
          ? Math.round(
              deliveredOrders.reduce((total, order) => total + getOrderDurationMinutes(order), 0) / deliveredOrders.length,
            )
          : 0,
        onboardingStage: getRestaurantOnboardingStage(restaurant, restaurantOrders),
        healthSegment: getRestaurantHealthSegment(restaurant, restaurantOrders),
      };
    })
    .filter(matchesAdminFilters)
    .sort((left, right) => {
      const priorityDifference = getHealthSegmentPriority(left.healthSegment) - getHealthSegmentPriority(right.healthSegment);
      if (priorityDifference !== 0) return priorityDifference;
      return new Date(right.createdAt) - new Date(left.createdAt);
    });

  renderAdminDashboard(stats);
  renderRestaurantDirectory(enrichedRestaurants);
  renderAdminMessagesPanel();
}

function renderAdminAccount() {
  const profile = getCurrentUserProfile() || {};
  const displayName = String(profile.displayName || profile.email || "").trim();
  const title = String(profile.title || "").trim();
  const avatarUrl = String(profile.avatarUrl || "").trim();

  if (adminAccountName) {
    adminAccountName.textContent = displayName || translateRuntimeText("Sin datos cargados");
  }

  if (adminAccountMeta) {
  adminAccountMeta.textContent = displayName
    ? (title ? translateRuntimeText(`${title} · Acceso verificado`) : translateRuntimeText("Acceso verificado"))
    : translateRuntimeText("Cuenta no cargada");
  }

  if (adminAccountAvatarFallback) {
    adminAccountAvatarFallback.textContent = displayName.charAt(0).toUpperCase() || "?";
  }

  if (adminAccountAvatarImage) {
    if (avatarUrl) {
      adminAccountAvatarImage.src = avatarUrl;
      adminAccountAvatarImage.hidden = false;
      adminAccountAvatarFallback.hidden = true;
    } else {
      adminAccountAvatarImage.hidden = true;
      adminAccountAvatarImage.removeAttribute("src");
      adminAccountAvatarFallback.hidden = false;
    }
  }
}

function renderAdminProfile() {
  if (!adminProfileForm) return;
  const profile = getCurrentUserProfile() || {};
  adminProfileDisplayName.value = profile.displayName || "";
  adminProfileEmail.value = profile.email || "";
  adminProfilePhone.value = profile.phone || "";
  adminProfileTitle.value = profile.title || "";
  syncAdminAvatarPreview(selectedAdminAvatarUrl || profile.avatarUrl || "");
}

function syncAdminAvatarPreview(avatarUrl) {
  if (!adminProfileAvatarPreview || !adminProfileAvatarPreviewImage) return;
  const normalized = String(avatarUrl || "").trim();
  if (!normalized) {
    adminProfileAvatarPreview.hidden = true;
    adminProfileAvatarPreviewImage.removeAttribute("src");
    return;
  }

  adminProfileAvatarPreviewImage.src = normalized;
  adminProfileAvatarPreview.hidden = false;
}

async function handleAdminAvatarSelection(event) {
  const file = event.target.files?.[0] || null;
  if (!file) {
    selectedAdminAvatarUrl = "";
    syncAdminAvatarPreview(getCurrentUserProfile()?.avatarUrl || "");
    return;
  }

  try {
    selectedAdminAvatarUrl = await optimizeRestaurantLogo(file);
    syncAdminAvatarPreview(selectedAdminAvatarUrl);
    if (adminProfileFeedback) {
      adminProfileFeedback.hidden = true;
      adminProfileFeedback.textContent = "";
    }
  } catch (error) {
    const message = error instanceof Error ? translateRuntimeText(error.message) : translateRuntimeText("No se pudo preparar la foto del administrador.");
    if (adminProfileFeedback) {
      adminProfileFeedback.textContent = message;
      adminProfileFeedback.className = "form-feedback form-feedback--error";
      adminProfileFeedback.hidden = false;
    }
    showTurnoAlert(message, "error");
  }
}

async function handleAdminProfileSubmit(event) {
  event.preventDefault();
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.updateCurrentAdminProfile !== "function") {
    adminProfileFeedback.textContent = translateRuntimeText("No se pudo guardar el perfil admin en esta configuración.");
    adminProfileFeedback.className = "form-feedback form-feedback--error";
    adminProfileFeedback.hidden = false;
    return;
  }

  try {
    await backend.updateCurrentAdminProfile({
      displayName: adminProfileDisplayName?.value || "",
      phone: adminProfilePhone?.value || "",
      title: adminProfileTitle?.value || "",
      avatarUrl: selectedAdminAvatarUrl || getCurrentUserProfile()?.avatarUrl || "",
    });

    await loadCurrentUserProfileFromBackend();
    selectedAdminAvatarUrl = "";
    adminProfileFeedback.textContent = translateRuntimeText("Perfil administrador actualizado correctamente.");
    adminProfileFeedback.className = "form-feedback form-feedback--success";
    adminProfileFeedback.hidden = false;
    refreshAdminUsers();
    renderAdminWorkspace();
  } catch (error) {
    console.error("No se pudo actualizar el perfil admin.", error);
    adminProfileFeedback.textContent = translateRuntimeText("No se pudo guardar el perfil administrador.");
    adminProfileFeedback.className = "form-feedback form-feedback--error";
    adminProfileFeedback.hidden = false;
    showTurnoAlert(translateRuntimeText("No se pudo guardar el perfil administrador."), "error");
  }
}

async function handleCreateAdminAccount(event) {
  event.preventDefault();
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.createAdminAccount !== "function") {
    adminCreateAdminFeedback.textContent = translateRuntimeText("No se pudo crear el usuario administrador en esta configuración.");
    adminCreateAdminFeedback.className = "form-feedback form-feedback--error";
    adminCreateAdminFeedback.hidden = false;
    return;
  }

  const formData = new FormData(adminCreateAdminForm);
  const phoneValidation = validateAdminCreateAdminPhoneNumber({ report: true });
  if (!phoneValidation.valid) {
    adminCreateAdminFeedback.textContent = phoneValidation.message;
    adminCreateAdminFeedback.className = "form-feedback form-feedback--error";
    adminCreateAdminFeedback.hidden = false;
    showTurnoAlert(phoneValidation.message, "error");
    return;
  }
  try {
    const result = await backend.createAdminAccount({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      phone: phoneValidation.phone,
      title: formData.get("title"),
      appUrl: buildAdminAccessUrl(),
    });
    adminCreateAdminForm.reset();
    resetAdminCreateAdminPhoneField();
    adminCreateAdminFeedback.textContent = result?.accessLink
      ? translateRuntimeText("Administrador creado. Se generó un enlace seguro para definir contraseña.")
      : translateRuntimeText("Administrador creado correctamente.");
    adminCreateAdminFeedback.className = "form-feedback form-feedback--success";
    adminCreateAdminFeedback.hidden = false;
    await refreshAdminUsers();
    renderAdminWorkspace();
    showTurnoAlert(translateRuntimeText("Nuevo administrador creado correctamente."), "success");
  } catch (error) {
    console.error("No se pudo crear el usuario admin.", error);
    const message =
      error?.code === "functions/already-exists"
        ? translateRuntimeText("Ese correo ya existe en Firebase Authentication.")
        : translateRuntimeText("No se pudo crear el nuevo administrador.");
    adminCreateAdminFeedback.textContent = message;
    adminCreateAdminFeedback.className = "form-feedback form-feedback--error";
    adminCreateAdminFeedback.hidden = false;
    showTurnoAlert(message, "error");
  }
}

async function refreshAdminUsers() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.loadCollection !== "function") {
    adminUsers = [];
    renderAdminUsersList();
    return;
  }

  try {
    const users = await backend.loadCollection("users");
    adminUsers = (Array.isArray(users) ? users : [])
      .filter((user) => String(user?.role || "").trim() === "admin")
      .sort((left, right) =>
        String(left.displayName || left.email || "").localeCompare(String(right.displayName || right.email || ""), "es"),
      );
    renderAdminUsersList();
  } catch (error) {
    console.error("No se pudo cargar el equipo admin.", error);
    if (adminUsersList) {
      adminUsersList.innerHTML = "";
      const card = document.createElement("article");
      card.className = "dashboard-insight";
      card.textContent = translateRuntimeText("No se pudo cargar el equipo administrador por ahora.");
      adminUsersList.append(card);
    }
  }
}

function renderAdminUsersList() {
  if (!adminUsersList) return;
  adminUsersList.innerHTML = "";

  if (!adminUsers.length) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight";
    empty.textContent = translateRuntimeText("Aquí verás el equipo administrador con acceso activo.");
    adminUsersList.append(empty);
    return;
  }

  adminUsers.forEach((user) => {
    const card = document.createElement("article");
    const top = document.createElement("div");
    const identity = document.createElement("div");
    const name = document.createElement("h4");
    const meta = document.createElement("p");
    const avatar = document.createElement("span");
    const avatarImage = document.createElement("img");
    const avatarFallback = document.createElement("span");

    card.className = "admin-user-card";
    top.className = "admin-user-card__top";
    identity.className = "admin-user-card__identity";
    avatar.className = "admin-user-card__avatar";
    avatarFallback.textContent = String(user.displayName || user.email || "?").trim().charAt(0).toUpperCase() || "?";
    name.textContent = user.displayName || user.email || translateRuntimeText("Sin datos cargados");
    meta.textContent = [user.title || translateRuntimeText("No disponible"), user.email || translateRuntimeText("Sin correo"), user.phone || translateRuntimeText("Sin teléfono")].join(" · ");

    const avatarUrl = String(user.avatarUrl || "").trim();
    if (avatarUrl) {
      avatarImage.src = avatarUrl;
      avatarImage.alt = translateRuntimeText(`Avatar de ${name.textContent}`);
      avatar.append(avatarImage);
    } else {
      avatar.append(avatarFallback);
    }

    identity.append(name, meta);
    top.append(avatar, identity);
    card.append(top);
    adminUsersList.append(card);
  });
}

function renderAdminMessagesPanel() {
  if (!adminMessageList) return;

  const search = String(adminMessageSearchInput?.value || "").trim().toLowerCase();
  const statusFilter = String(adminMessageStatusFilter?.value || "all");
  const interestFilter = String(adminMessageInterestFilter?.value || "all");
  const sortOrder = String(adminMessageSortOrder?.value || "newest");

  const filtered = adminContactInquiries
    .filter((item) => {
      if (statusFilter === "read" && !item.isRead) return false;
      if (statusFilter === "unread" && item.isRead) return false;
      if (interestFilter !== "all" && item.interest !== interestFilter) return false;
      if (search) {
        const haystack = [item.name, item.company, item.email, item.phone, item.interest, item.message].join(" ").toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    })
    .sort((left, right) => {
      const factor = sortOrder === "oldest" ? 1 : -1;
      return factor * (new Date(left.submittedAt) - new Date(right.submittedAt));
    });

  adminMessagesTotalChip.textContent = translateRuntimeText(`${adminContactInquiries.length} mensajes`);
  adminMessagesUnreadChip.textContent = translateRuntimeText(`${adminContactInquiries.filter((item) => !item.isRead).length} sin leer`);
  adminMessagesReadChip.textContent = translateRuntimeText(`${adminContactInquiries.filter((item) => item.isRead).length} leídos`);
  adminMessageQuickFilters.forEach((button) => {
    button.classList.toggle("is-active", (button.dataset.messageQuickFilter || "all") === statusFilter);
  });
  adminMessageList.innerHTML = "";

  if (!filtered.length) {
    const empty = document.createElement("article");
    empty.className = "empty-state";
    empty.textContent = translateRuntimeText("No hay mensajes que coincidan con esos filtros.");
    adminMessageList.append(empty);
    return;
  }

  const grouped = groupInquiriesByDay(filtered);
  grouped.forEach((group) => {
    const section = document.createElement("section");
    const heading = document.createElement("div");
    const title = document.createElement("h3");
    const hint = document.createElement("p");
    const stack = document.createElement("div");

    section.className = "admin-inbox-group";
    heading.className = "admin-inbox-group__heading";
    title.textContent = group.label;
    hint.textContent = translateRuntimeText(`${group.items.length} mensajes`);
    stack.className = "admin-inbox-group__stack";
    heading.append(title, hint);

    group.items.forEach((item) => {
      stack.append(buildAdminInquiryCard(item));
    });

    section.append(heading, stack);
    adminMessageList.append(section);
  });
}

function groupInquiriesByDay(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = formatAdminDayLabel(item.submittedAt);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  });

  return Array.from(map.entries()).map(([label, groupedItems]) => ({
    label,
    items: groupedItems,
  }));
}

function buildAdminInquiryCard(item) {
  const card = document.createElement("article");
  const top = document.createElement("div");
  const identity = document.createElement("div");
  const title = document.createElement("h4");
  const meta = document.createElement("p");
  const statusWrap = document.createElement("div");
  const interest = document.createElement("span");
  const state = document.createElement("span");
  const body = document.createElement("p");
  const footer = document.createElement("div");
  const submitted = document.createElement("p");
  const actions = document.createElement("div");
  const toggle = document.createElement("button");

  card.className = `admin-inbox-card${item.isRead ? "" : " is-unread"}`;
  top.className = "admin-inbox-card__top";
  statusWrap.className = "admin-inbox-card__status";
  interest.className = "summary-chip";
  state.className = `status-pill ${item.isRead ? "admin-inbox-card__pill--read" : "admin-inbox-card__pill--unread"}`;
  body.className = "admin-inbox-card__message";
  footer.className = "admin-inbox-card__footer";
  actions.className = "admin-inbox-card__actions";

  title.textContent = item.name;
  meta.textContent = [item.company || translateRuntimeText("Sin empresa"), item.email || translateRuntimeText("Sin correo"), item.phone || translateRuntimeText("Sin teléfono")].join(" · ");
  interest.textContent = item.interest;
  state.textContent = item.isRead ? translateRuntimeText("Leído") : translateRuntimeText("Sin leer");
  renderTextWithClickableLinks(body, item.message || translateRuntimeText("Sin mensaje"));
  submitted.textContent = translateRuntimeText(`Recibido ${formatAdminDateTime(item.submittedAt)}`);

  toggle.type = "button";
  toggle.className = "comment-button";
  toggle.textContent = item.isRead ? translateRuntimeText("Marcar sin leer") : translateRuntimeText("Marcar leído");
  toggle.addEventListener("click", async () => {
    await toggleAdminInquiryRead(item);
  });

  identity.append(title, meta);
  statusWrap.append(interest, state);
  top.append(identity, statusWrap);
  actions.append(toggle);
  footer.append(submitted, actions);
  card.append(top, body, footer);
  return card;
}

async function toggleAdminInquiryRead(item) {
  if (!item?.id) return;
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.setDocument !== "function") {
    showTurnoAlert(translateRuntimeText("No se pudo actualizar el estado del mensaje."), "error");
    return;
  }

  const nextIsRead = !item.isRead;
  try {
    await backend.setDocument(CONTACT_INQUIRIES_COLLECTION, item.id, {
      ...item,
      isRead: nextIsRead,
      status: nextIsRead ? "read" : "unread",
      readAt: nextIsRead ? new Date().toISOString() : "",
    });
  } catch (error) {
    console.error("No se pudo actualizar el mensaje.", error);
    showTurnoAlert(translateRuntimeText("No se pudo actualizar el estado del mensaje."), "error");
  }
}

function renderAdminDashboard(stats) {
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
  const formatKey = (key, params = {}, fallback = "") =>
    window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
  if (adminDashboardPeriod) {
    adminDashboardPeriod.value = stats.period;
  }
  adminRestaurantCount.textContent = stats.totalRestaurants;
  adminStatRestaurants.textContent = stats.totalRestaurants;
  adminStatExpiredRestaurants.textContent = stats.expiredRestaurants;
  adminStatTotalOrders.textContent = stats.totalOrders;
  adminStatActiveOrders.textContent = stats.activeOrders;
  adminStatDelivered.textContent = stats.deliveredOrders;
  if (adminStatDemoRestaurants) adminStatDemoRestaurants.textContent = stats.demoRestaurantCount;
  if (adminStatDemoReady) adminStatDemoReady.textContent = stats.demoReadyToConvertCount;
  const activeBaseRate = stats.totalRestaurants
    ? Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100)
    : 0;
  const weeklyActivityRate = stats.totalRestaurants
    ? Math.round((stats.recentlyActiveRestaurants / stats.totalRestaurants) * 100)
    : 0;
  const riskCount = stats.dormantRestaurants + stats.restaurantsWithoutOrders;
  adminHeroActiveBase.textContent = stats.activeRestaurants;
  adminHeroActiveBaseHint.textContent = formatKey("admin.dynamic.base_active_rate", { count: activeBaseRate });
  adminHeroWeeklyActivity.textContent = `${weeklyActivityRate}%`;
  adminHeroWeeklyActivityHint.textContent = formatKey(`admin.dynamic.orders_recorded.${stats.period}`, {
    count: stats.recentlyActiveRestaurants,
  });
  adminHeroRenewal.textContent = stats.expiredRestaurants + stats.soonToExpire;
  adminHeroRenewalHint.textContent = formatKey("admin.dynamic.renewal_status", {
    expired: stats.expiredRestaurants,
    soon: stats.soonToExpire,
  });
  adminHeroRisk.textContent = riskCount;
  adminHeroRiskHint.textContent = formatKey(`admin.dynamic.risk_status.${stats.period}`, {
    dormant: stats.dormantRestaurants,
    inactive: stats.restaurantsWithoutOrders,
  });
  const actionQueues = getAdminActionQueues({ period: stats.period });
  adminActionRenewalCount.textContent = actionQueues.renewal;
  adminActionOnboardingCount.textContent = actionQueues.onboarding;
  adminActionRiskCount.textContent = actionQueues["at-risk"];
  adminActionHealthyCount.textContent = actionQueues.healthy;
  adminActionRenewalHint.textContent = actionQueues.renewal
    ? formatKey("admin.dynamic.queue.renewal", { count: actionQueues.renewal })
    : "No hay cuentas urgentes de renovación ahora mismo";
  adminActionOnboardingHint.textContent = actionQueues.onboarding
    ? formatKey("admin.dynamic.queue.onboarding", { count: actionQueues.onboarding })
    : "No hay onboarding bloqueado en este momento";
  adminActionRiskHint.textContent = actionQueues["at-risk"]
    ? formatKey("admin.dynamic.queue.risk", { count: actionQueues["at-risk"] })
    : "No hay señales de riesgo relevantes ahora";
  adminActionHealthyHint.textContent = actionQueues.healthy
    ? formatKey("admin.dynamic.queue.healthy", { count: actionQueues.healthy })
    : "Aún no hay base sana suficiente para empujar upsell";

  adminTopRestaurantPanel.innerHTML = "";
  adminAccessDonut.innerHTML = "";
  adminOrderOutcomeDonut.innerHTML = "";
  adminAccessMix.innerHTML = "";
  adminOrderOutcomeMix.innerHTML = "";
  adminAdoptionMix.innerHTML = "";
  adminTopRestaurantsBars.innerHTML = "";
  adminInsights.innerHTML = "";
  adminDatasetInsights.innerHTML = "";

  const dataset = exportPredictionDataset({ period: stats.period });
  const deliveredDataset = dataset.filter((item) => Number.isFinite(item.minutesToDelivered));
  const readyDataset = dataset.filter((item) => Number.isFinite(item.minutesToReady));
  adminDatasetTotal.textContent = dataset.length;
  adminDatasetDelivered.textContent = deliveredDataset.length;
  adminDatasetReady.textContent = readyDataset.length;
  adminDatasetAdaptive.textContent = stats.trainedRestaurantCount;
  adminDatasetAdaptiveHint.textContent =
    stats.trainedRestaurantCount > 0
      ? formatKey("admin.dynamic.dataset_adaptive_hint", {
          count: stats.highConfidenceModelCount,
          error: stats.averageModelError,
        })
      : "Aun no hay locales con suficiente historico para adaptar el modelo";

  const topBox = document.createElement("article");
  topBox.className = "dashboard-insight";
  if (stats.topRestaurant) {
    topBox.textContent = formatKey(`admin.dynamic.top_restaurant.${stats.period}`, {
      name: stats.topRestaurant.restaurant.name,
      orders: stats.topRestaurant.orderCount,
      avg: formatDurationMinutes(stats.topRestaurant.avgDeliveryMinutes),
    });
  } else {
    topBox.textContent = formatKey(`admin.dynamic.top_restaurant.empty.${stats.period}`);
  }
  adminTopRestaurantPanel.append(topBox);

  renderDashboardDonut(adminAccessDonut, stats.accessMix, "Cuentas");
  renderDashboardDonut(adminOrderOutcomeDonut, stats.orderOutcomeMix, "Pedidos");
  renderAdminBarChart(adminAccessMix, stats.accessMix);
  renderAdminBarChart(adminOrderOutcomeMix, stats.orderOutcomeMix);
  renderAdminBarChart(adminAdoptionMix, stats.adoptionMix);
  renderAdminBarChart(
    adminTopRestaurantsBars,
    stats.topRestaurantsByOrders.map((item) => ({
      label: item.restaurant.name,
      count: item.orderCount,
      color: "#ec7c0d",
      valueLabelKey: "common.count.orders",
      valueLabelParams: { count: item.orderCount },
    })),
    formatKey("admin.dynamic.ranking.empty"),
  );

  buildAdminInsights(stats).forEach((message) => {
    const card = document.createElement("article");
    card.className = "dashboard-insight";
    card.textContent = message;
    adminInsights.append(card);
  });

  buildDatasetInsights(dataset, deliveredDataset, readyDataset, stats).forEach((message) => {
    const card = document.createElement("article");
    card.className = "dashboard-insight";
    card.textContent = message;
    adminDatasetInsights.append(card);
  });
}

function buildDatasetInsights(dataset, deliveredDataset, readyDataset, stats) {
  const formatKey = (key, params = {}, fallback = "") =>
    window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
  const insights = [];

  if (!dataset.length) {
    insights.push(formatKey("admin.dynamic.dataset.empty"));
    return insights;
  }

  insights.push(formatKey("admin.dynamic.dataset.captured", { count: dataset.length }));

  if (deliveredDataset.length > 0) {
    insights.push(formatKey("admin.dynamic.dataset.delivered", { count: deliveredDataset.length }));
  }

  if (readyDataset.length > 0) {
    insights.push(formatKey("admin.dynamic.dataset.ready", { count: readyDataset.length }));
  }

  if (stats?.trainedRestaurantCount > 0) {
    insights.push(formatKey("admin.dynamic.dataset.trained", { count: stats.trainedRestaurantCount, error: stats.averageModelError }));
  }

  if (!deliveredDataset.length && !readyDataset.length) {
    insights.push(formatKey("admin.dynamic.dataset.pending"));
  }

  return insights.slice(0, 3);
}

function handleExportPredictionDataset() {
  const dataset = exportPredictionDataset({
    includeCancelled: true,
    period: activeAdminDashboardPeriod,
  });
  const payload = JSON.stringify(dataset, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);

  anchor.href = url;
  anchor.download = `turnolisto-prediction-dataset-${stamp}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showTurnoAlert(translateRuntimeText("Dataset IA exportado en formato JSON."), "success");
}

function renderAdminBarChart(container, items, emptyMessage = "Sin datos suficientes por ahora.") {
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
  const formatKey = (key, params = {}, fallback = "") =>
    window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
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
    const label = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("span");
    const value = document.createElement("span");

    row.className = "dashboard-bar";
    label.className = "dashboard-bar__label";
    track.className = "dashboard-bar__track";
    value.className = "dashboard-bar__value";

    label.textContent = item.labelKey ? formatKey(item.labelKey, item.labelParams) : translateText(item.label);
    fill.style.width = `${Math.max(10, Math.round((Number(item.count || 0) / maxValue) * 100))}%`;
    fill.style.background = item.color || "#ec7c0d";
    value.textContent = item.valueLabelKey
      ? formatKey(item.valueLabelKey, item.valueLabelParams)
      : item.valueLabel
        ? translateText(item.valueLabel)
        : String(item.count || 0);

    track.append(fill);
    row.append(label, track, value);
    container.append(row);
  });
}

function renderDashboardDonut(container, items, centerLabel) {
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
  const formatKey = (key, params = {}, fallback = "") =>
    window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
  container.innerHTML = "";
  const safeItems = Array.isArray(items) ? items.filter((item) => Number(item?.count || 0) > 0) : [];
  const total = safeItems.reduce((sum, item) => sum + Number(item.count || 0), 0);

  if (!total) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight";
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
    label.textContent = item.labelKey ? formatKey(item.labelKey, item.labelParams) : translateText(item.label);
    value.textContent = String(item.count);
    row.append(dot, label, value);
    legend.append(row);
  });

  container.append(chart, legend);
}

function buildAdminInsights(stats) {
  const formatKey = (key, params = {}, fallback = "") =>
    window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
  const insights = [];

  if (stats.expiredRestaurants > 0) {
    insights.push(formatKey("admin.dynamic.insight.expired", { count: stats.expiredRestaurants }));
  }

  if (stats.soonToExpire > 0) {
    insights.push(formatKey("admin.dynamic.insight.expiring_soon", { count: stats.soonToExpire }));
  }

  if (stats.activeOrders > stats.deliveredOrders) {
    insights.push(formatKey(`admin.dynamic.insight.open_vs_delivered.${stats.period}`));
  }

  if (stats.aiPortfolioAction) {
    insights.push(
      formatKey("admin.dynamic.insight.ai_signal.prefix", {
        message: formatKey(stats.aiPortfolioAction.key, stats.aiPortfolioAction.params),
      }),
    );
  }

  if (stats.dominantPortfolioBottleneck) {
    insights.push(formatKey("admin.dynamic.insight.bottleneck", {
      label: formatKey(stats.dominantPortfolioBottleneck.labelKey),
      count: stats.dominantPortfolioBottleneck.count,
    }));
  }

  if (stats.restaurantsWithoutOrders > 0) {
    insights.push(formatKey("admin.dynamic.insight.without_orders", { count: stats.restaurantsWithoutOrders }));
  }

  if (stats.demoRestaurantCount > 0) {
    insights.push(formatKey("admin.dynamic.insight.demo_ready", {
      count: stats.demoRestaurantCount,
      ready: stats.demoReadyToConvertCount,
    }));
  }

  if (stats.dormantRestaurants > 0) {
    insights.push(formatKey(`admin.dynamic.insight.dormant.${stats.period}`, { count: stats.dormantRestaurants }));
  }

  if (stats.trainedRestaurantCount > 0) {
    insights.push(formatKey("admin.dynamic.insight.trained", {
      count: stats.trainedRestaurantCount,
      high: stats.highConfidenceModelCount,
    }));
  }

  if (stats.expiredRestaurants === 0 && stats.soonToExpire === 0 && stats.restaurantsWithoutOrders === 0) {
    insights.push(formatKey("admin.dynamic.insight.healthy_base"));
  }

  if (!insights.length) {
    insights.push(formatKey("admin.dynamic.insight.stable"));
  }

  return insights.slice(0, 3);
}

function matchesAdminFilters(restaurant) {
  const search = String(adminSearchInput.value || "").trim().toLowerCase();
  const status = adminStatusFilter.value || "all";
  const activity = adminActivityFilter.value || "all";
  const lifecycle = adminLifecycleFilter.value || "all";

  if (search) {
    const haystack = [
      restaurant.name,
      restaurant.ownerName,
      restaurant.username,
      restaurant.email,
      restaurant.phone,
      restaurant.city,
      restaurant.address,
      restaurant.planName,
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) return false;
  }

  if (status === "active" && restaurant.status !== "active") return false;
  if (status === "expired" && restaurant.status !== "expired") return false;
  if (status === "expiring" && !(restaurant.remainingDays !== null && restaurant.remainingDays >= 0 && restaurant.remainingDays <= 7)) {
    return false;
  }

  if (activity === "with-orders" && restaurant.orderCount === 0) return false;
  if (activity === "without-orders" && restaurant.orderCount > 0) return false;

  if (lifecycle !== "all" && restaurant.healthSegment !== lifecycle) return false;

  return true;
}

function bindAdminActionQueue(element, segment) {
  if (!element) return;
  const trigger = () => {
    applyAdminQueueFilter(segment);
  };

  element.addEventListener("click", trigger);
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    trigger();
  });
}

function applyAdminQueueFilter(segment) {
  activeAdminSection = "restaurants";
  adminSearchInput.value = "";
  adminStatusFilter.value = "all";
  adminActivityFilter.value = "all";
  adminLifecycleFilter.value = segment;
  renderAdminWorkspace();
}

function renderRestaurantDirectory(restaurants) {
  adminRestaurantList.innerHTML = "";

  if (!restaurants.length) {
    const empty = document.createElement("article");
    empty.className = "empty-state";
    empty.textContent = translateRuntimeText("No hay restaurantes que coincidan con esos filtros.");
    adminRestaurantList.append(empty);
    return;
  }

  restaurants.forEach((restaurant) => {
    const demoUsage = getRestaurantDemoUsage(restaurant);
    const card = document.createElement("article");
    const top = document.createElement("div");
    const brand = document.createElement("div");
    const brandLogoWrap = document.createElement("div");
    const brandLogo = document.createElement("img");
    const brandFallback = document.createElement("span");
    const brandText = document.createElement("div");
    const title = document.createElement("h3");
    const meta = document.createElement("div");
    const status = document.createElement("span");
    const health = document.createElement("span");
    const demoBadge = document.createElement("span");
    const grid = document.createElement("div");
    const owner = document.createElement("p");
    const contact = document.createElement("p");
    const address = document.createElement("p");
    const activation = document.createElement("p");
    const orders = document.createElement("p");
    const usage = document.createElement("p");
    const notesSummary = document.createElement("div");
    const notesSummaryLabel = document.createElement("span");
    const onboarding = document.createElement("p");
    const notes = document.createElement("p");
    const playbook = document.createElement("div");
    const playbookLabel = document.createElement("span");
    const playbookText = document.createElement("strong");
    const accountStack = document.createElement("div");
    const login = document.createElement("p");
    const logoField = document.createElement("label");
    const logoFieldLabel = document.createElement("span");
    const logoHint = document.createElement("span");
    const logoPreview = document.createElement("div");
    const logoPreviewImage = document.createElement("img");
    const accessWrap = document.createElement("div");
    const accessLabel = document.createElement("span");
    const accessValue = document.createElement("strong");
    const priorityAction = document.createElement("section");
    const priorityActionCopy = document.createElement("div");
    const priorityActionLabel = document.createElement("span");
    const priorityActionTitle = document.createElement("strong");
    const priorityActionText = document.createElement("p");
    const actions = document.createElement("div");
    const primaryActions = document.createElement("div");
    const secondaryActions = document.createElement("div");
    const link = document.createElement("a");
    const logoInput = document.createElement("input");
    const logoPicker = document.createElement("span");
    const logoPickerButton = document.createElement("span");
    const logoPickerName = document.createElement("span");
    const templatesButton = document.createElement("button");
    const activatePlan = document.createElement("button");
    const renewPlan = document.createElement("button");
    const remove = document.createElement("button");

    card.className = "admin-card";
    top.className = "admin-card__top";
    brand.className = "admin-card__brand";
    brandLogoWrap.className = "admin-card__brand-logo";
    brandText.className = "admin-card__brand-text";
    meta.className = "admin-card__meta";
    accessWrap.className = "admin-card__password";
    accessLabel.className = "admin-card__password-label";
    accessValue.className = "admin-card__password-value";
    priorityAction.className = "admin-card__priority-action";
    priorityActionCopy.className = "admin-card__priority-copy";
    priorityActionLabel.className = "admin-card__priority-label";
    priorityActionTitle.className = "admin-card__priority-title";
    priorityActionText.className = "admin-card__priority-text";
    actions.className = "admin-card__actions";
    primaryActions.className = "admin-card__actions-group admin-card__actions-group--primary";
    secondaryActions.className = "admin-card__actions-group admin-card__actions-group--secondary";
    status.className = "status-pill";
    health.className = "status-pill admin-card__health-pill";
    demoBadge.className = "status-pill admin-card__demo-pill";
    playbook.className = "admin-card__playbook";
    playbookLabel.className = "admin-card__playbook-label";
    playbookText.className = "admin-card__playbook-text";
    status.textContent = translateRuntimeText(restaurant.status === "active" ? "Activo" : "Vencido");
    status.style.background = restaurant.status === "active" ? "rgba(31, 122, 99, 0.12)" : "rgba(127, 29, 29, 0.12)";
    status.style.color = restaurant.status === "active" ? "#1f7a63" : "#7f1d1d";
    syncRestaurantHealthPill(health, restaurant.healthSegment);
    demoBadge.hidden = !isDemoRestaurant(restaurant);
    demoBadge.textContent = isDemoRestaurant(restaurant)
      ? translateRuntimeText(`DEMO ${demoUsage.usedOrders}/${demoUsage.maxOrders}`)
      : "";
    grid.className = "admin-card__grid";
    brandFallback.className = "admin-card__brand-fallback";
    accountStack.className = "admin-card__account-stack";
    logoField.className = "field field--wide admin-card__logo-field";
    logoHint.className = "field__hint";
    logoPicker.className = "file-picker";
    logoPickerButton.className = "file-picker__button";
    logoPickerName.className = "file-picker__name";
    logoPreview.className = "logo-upload-preview admin-card__logo-preview";
    notesSummary.className = "admin-card__notes";
    notesSummaryLabel.className = "admin-card__notes-label";
    title.textContent = restaurant.name;
    login.textContent = translateRuntimeText(`Correo auth: ${restaurant.username}`);
    owner.textContent = translateRuntimeText(`Responsable: ${restaurant.ownerName || "Sin definir"}`);
    contact.textContent = translateRuntimeText(`Contacto: ${restaurant.email || "Sin correo"} · ${restaurant.phone || "Sin móvil"}`);
    address.textContent = translateRuntimeText(`Dirección: ${restaurant.address || "Sin dirección"} · ${restaurant.city || "Sin ciudad"}`);
    activation.textContent = isDemoRestaurant(restaurant)
      ? translateRuntimeText(`Demo activa hasta: ${formatAdminDate(restaurant.activatedUntil)} · ${demoUsage.remainingOrders} pedidos disponibles`)
      : translateRuntimeText(`Activado hasta: ${formatAdminDate(restaurant.activatedUntil)} · ${buildRemainingAccessLabel(restaurant)}`);
    orders.textContent =
      translateRuntimeText(`Pedidos: ${restaurant.orderCount} · Activos: ${restaurant.activeOrderCount} · Entregados: ${restaurant.deliveredCount}`);
    usage.textContent = isDemoRestaurant(restaurant)
      ? restaurant.orderCount
        ? translateRuntimeText(`Uso demo: ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos consumidos · Último movimiento ${formatAdminDate(restaurant.lastOrderAt)}`)
        : translateRuntimeText(`Uso demo: aún sin pedidos. Conviene guiar el primer flujo para que vea valor en menos de 10 minutos.`)
      : restaurant.orderCount
        ? translateRuntimeText(`Uso: ${restaurant.recent7dOrderCount} pedidos en 7 días · Último movimiento ${formatAdminDate(restaurant.lastOrderAt)}`)
        : translateRuntimeText("Uso: todavía sin pedidos. Conviene activar el onboarding del local.");
    onboarding.textContent = isDemoRestaurant(restaurant)
      ? translateRuntimeText(`Onboarding demo: ${restaurant.orderCount ? "ya esta probando el flujo real y la IA adaptativa." : "pendiente del primer pedido para disparar el momento wow."}`)
      : translateRuntimeText(`Onboarding: ${buildOnboardingSummary(restaurant)}`);
    notes.textContent = isDemoRestaurant(restaurant)
      ? restaurant.notes
        ? translateRuntimeText(`Notas demo: ${restaurant.notes}`)
        : translateRuntimeText("Notas demo: enfocada en enseñar pedidos, QR e IA adaptativa con limite comercial.")
      : restaurant.notes
        ? translateRuntimeText(`Notas: ${restaurant.notes}`)
        : translateRuntimeText("Notas: sin observaciones");
    notesSummaryLabel.textContent = translateRuntimeText("Contexto");
    playbookLabel.textContent = translateRuntimeText("Siguiente paso");
    playbookText.textContent = isDemoRestaurant(restaurant)
      ? demoUsage.usedOrders >= demoUsage.maxOrders
        ? translateRuntimeText("Cerrar conversion al plan completo: ya probo valor y ha llegado al limite comercial.")
        : demoUsage.usedOrders > 0
          ? translateRuntimeText("Acompanarlo hasta completar un ciclo y cerrar upgrade antes de que termine la demo.")
          : translateRuntimeText("Lanzar primer pedido guiado para activar el momento wow en la primera sesion.")
      : translateRuntimeText(buildRestaurantPlaybook(restaurant));
    logoFieldLabel.textContent = translateRuntimeText("Logo del restaurante");
    logoHint.textContent = translateRuntimeText("Sube un logo cuadrado o rectangular. Lo optimizaremos para restaurante y cliente.");
    accessLabel.textContent = translateRuntimeText("Acceso:");
    accessValue.textContent = translateRuntimeText("Gestionado con enlace seguro");
    priorityAction.hidden = !isDemoRestaurant(restaurant);
    priorityActionLabel.textContent = translateRuntimeText("Acción prioritaria");
    priorityActionTitle.textContent = translateRuntimeText("Activar plan comercial");
    priorityActionText.textContent =
      demoUsage.usedOrders >= demoUsage.maxOrders
        ? translateRuntimeText("La cuenta ya alcanzó su límite actual. Conviene convertirla ahora para no frenar la operación.")
        : translateRuntimeText("Esta cuenta ya está en fase de conversión. Lleva la activación al frente para que no se pierda entre acciones secundarias.");
    link.className = "qr-link";
    link.href = "#";
    link.textContent = translateRuntimeText("Abrir acceso restaurante");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.open("./restaurant.html", "_blank", "noopener,noreferrer");
    });
    logoInput.type = "file";
    logoInput.className = "file-picker__input";
    logoInput.accept = "image/*";
    logoPickerButton.setAttribute("data-i18n-key", "profile.file.choose");
    logoPickerButton.textContent = translateRuntimeText("Seleccionar imagen");
    logoPickerName.setAttribute("data-i18n-key", "profile.file.empty");
    logoPickerName.textContent = translateRuntimeText("Ningún archivo seleccionado");
    logoPicker.append(logoPickerButton, logoPickerName);
    logoInput.addEventListener("change", async () => {
      const file = logoInput.files?.[0] || null;
      if (!file) return;

      logoInput.disabled = true;
      logoPickerName.removeAttribute("data-i18n-key");
      logoPickerName.textContent = file.name;

      try {
        const logoUrl = await optimizeRestaurantLogo(file);
        updateRestaurantAccount(restaurant.id, { logoUrl });
        adminCreateFeedback.textContent = translateRuntimeText(`Logo actualizado para ${restaurant.name}.`);
        adminCreateFeedback.className = "form-feedback form-feedback--success";
        adminCreateFeedback.hidden = false;
        showTurnoAlert(translateRuntimeText(`Logo actualizado para ${restaurant.name}.`), "success");
        renderAdminWorkspace();
      } catch (error) {
        console.error("No se pudo actualizar el logo del restaurante.", error);
        const message =
          error instanceof Error ? translateRuntimeText(error.message) : translateRuntimeText("No se pudo actualizar el logo del restaurante.");
        adminCreateFeedback.textContent = message;
        adminCreateFeedback.className = "form-feedback form-feedback--error";
        adminCreateFeedback.hidden = false;
        showTurnoAlert(message, "error");
      } finally {
        logoInput.value = "";
        logoInput.disabled = false;
        logoPickerName.setAttribute("data-i18n-key", "profile.file.empty");
        logoPickerName.textContent = translateRuntimeText("Ningún archivo seleccionado");
        if (window.TurnoListoI18n?.translateDocument) {
          window.TurnoListoI18n.translateDocument(window.TurnoListoI18n.getLanguage?.());
        }
      }
    });
    templatesButton.type = "button";
    templatesButton.className = "comment-button";
    templatesButton.textContent = translateRuntimeText("Plantillas");
    templatesButton.disabled = !restaurant.email;
    templatesButton.addEventListener("click", async () => {
      await openEmailTemplatesModal(restaurant);
    });
    activatePlan.type = "button";
    activatePlan.className = "launcher admin-card__priority-button";
    activatePlan.textContent = translateRuntimeText("Activar plan");
    activatePlan.hidden = !isDemoRestaurant(restaurant);
    activatePlan.addEventListener("click", () => {
      openActivatePlanModal(restaurant);
    });
    renewPlan.type = "button";
    renewPlan.className = "comment-button";
    renewPlan.textContent = translateRuntimeText("Renovar plan");
    renewPlan.addEventListener("click", () => {
      openRenewPlanModal(restaurant);
    });
    remove.type = "button";
    remove.className = "comment-button admin-card__action-delete";
    remove.textContent = translateRuntimeText("Eliminar");
    remove.setAttribute("aria-label", translateRuntimeText(`Eliminar restaurante ${restaurant.name}`));
    remove.addEventListener("click", () => {
      openDeleteModal(restaurant);
    });

    if (restaurant.logoUrl) {
      brandLogo.src = restaurant.logoUrl;
      brandLogo.alt = translateRuntimeText(`Logo de ${restaurant.name}`);
      brandLogoWrap.append(brandLogo);
      logoPreviewImage.src = restaurant.logoUrl;
      logoPreviewImage.alt = translateRuntimeText(`Vista previa del logo de ${restaurant.name}`);
      logoPreview.append(logoPreviewImage);
    } else {
      brandFallback.textContent = String(restaurant.name || "?").trim().charAt(0).toUpperCase() || "R";
      brandLogoWrap.append(brandFallback);
      logoPreview.hidden = true;
    }
    brandText.append(title, meta);
    brand.append(brandLogoWrap, brandText);
    meta.append(status, health, demoBadge);
    logoField.append(logoFieldLabel, logoInput, logoPicker, logoHint);
    accessWrap.append(accessLabel, accessValue);
    primaryActions.append(link, templatesButton, renewPlan);
    secondaryActions.append(remove);
    actions.append(primaryActions, secondaryActions);
    priorityAction.append(priorityActionCopy, activatePlan);
    priorityActionCopy.append(priorityActionLabel, priorityActionTitle, priorityActionText);
    notesSummary.append(notesSummaryLabel, onboarding, notes);
    accountStack.append(logoField, logoPreview, login, accessWrap);
    playbook.append(playbookLabel, playbookText);
    grid.append(owner, contact, address, activation, orders, usage, priorityAction, playbook, notesSummary, accountStack);
    card.append(top, grid, actions);
    top.append(brand);
    adminRestaurantList.append(card);
  });
}

function getRestaurantOnboardingStage(restaurant, restaurantOrders) {
  if (!restaurant.logoUrl) return "pendiente-logo";
  if (!restaurantOrders.length) return "pendiente-primer-pedido";
  if (!restaurantOrders.some((order) => order.status === "ready" || order.status === "delivered")) {
    return "sin-ciclo-completo";
  }
  if (!restaurantOrders.some((order) => order.rating?.score)) {
    return "sin-feedback";
  }
  return "activo";
}

function buildOnboardingSummary(restaurant) {
  if (restaurant.onboardingStage === "pendiente-logo") {
    return "falta logo y personalización básica.";
  }

  if (restaurant.onboardingStage === "pendiente-primer-pedido") {
    return "sin primer pedido. Hace falta activación del equipo.";
  }

  if (restaurant.onboardingStage === "sin-ciclo-completo") {
    return "ya usa la app, pero aún no cerró un ciclo completo.";
  }

  if (restaurant.onboardingStage === "sin-feedback") {
    return "operación activa, falta validar feedback del cliente.";
  }

  return "activado y usando el flujo principal.";
}

function getRestaurantHealthSegment(restaurant, restaurantOrders, options = {}) {
  const remainingDays = getRestaurantRemainingDays(restaurant);
  const safeOrders = Array.isArray(restaurantOrders) ? restaurantOrders : [];
  const historicalOrders = Array.isArray(options.historicalOrders) ? options.historicalOrders : safeOrders;
  const dashboardPeriod = options.period ? normalizeDashboardPeriod(options.period) : null;
  const onboardingStage = getRestaurantOnboardingStage(restaurant, historicalOrders);
  const hadOrders = historicalOrders.length > 0;
  const activeLast7Days = safeOrders.some((order) => isWithinLastDays(order.createdAt, 7));
  const activeLast14Days = safeOrders.some((order) => isWithinLastDays(order.createdAt, 14));
  const activeInPeriod = safeOrders.length > 0;

  if (!isRestaurantAccessActive(restaurant)) return "renewal";
  if (remainingDays !== null && remainingDays <= 7) return "renewal";
  if (onboardingStage !== "activo") return "onboarding";
  if (dashboardPeriod) {
    if (hadOrders && !activeInPeriod) return "at-risk";
    return "healthy";
  }
  if (hadOrders && !activeLast14Days) return "at-risk";
  if (hadOrders && !activeLast7Days) return "at-risk";
  return "healthy";
}

function syncRestaurantHealthPill(element, segment) {
  const meta = {
    healthy: {
      label: "Sano",
      background: "rgba(31, 122, 99, 0.12)",
      color: "#1f7a63",
    },
    onboarding: {
      label: "Onboarding",
      background: "rgba(236, 124, 13, 0.12)",
      color: "#ec7c0d",
    },
    renewal: {
      label: "Renovación",
      background: "rgba(127, 29, 29, 0.12)",
      color: "#7f1d1d",
    },
    "at-risk": {
      label: "En riesgo",
      background: "rgba(180, 83, 9, 0.14)",
      color: "#9a4a10",
    },
  }[segment] || {
    label: "Seguimiento",
    background: "rgba(29, 26, 22, 0.08)",
    color: "var(--muted)",
  };

  element.textContent = translateRuntimeText(meta.label);
  element.style.background = meta.background;
  element.style.color = meta.color;
}

function buildRestaurantPlaybook(restaurant) {
  if (restaurant.healthSegment === "renewal") {
    if (restaurant.status !== "active") {
      return translateRuntimeText("Renueva acceso y reenvía el enlace seguro antes de perder la cuenta.");
    }
    return translateRuntimeText("Activa recordatorio de renovación y deja cerrado el siguiente periodo comercial.");
  }

  if (restaurant.healthSegment === "onboarding") {
    if (restaurant.onboardingStage === "pendiente-logo") {
      return translateRuntimeText("Completa logo y personalización para que el local sienta el producto como propio.");
    }
    if (restaurant.onboardingStage === "pendiente-primer-pedido") {
      return translateRuntimeText("Agenda activación con el equipo y acompaña el primer pedido real en hora pico.");
    }
    if (restaurant.onboardingStage === "sin-ciclo-completo") {
      return translateRuntimeText("Empuja un ciclo completo hasta estado listo o entregado para crear hábito operativo.");
    }
    return translateRuntimeText("Pide feedback del cliente y úsalo como prueba de valor para la renovación.");
  }

  if (restaurant.healthSegment === "at-risk") {
    if (Number(restaurant.aiModelSummary?.sampleCount || 0) >= 8) {
      return translateRuntimeText("Reactiva el local antes de que pierda el valor acumulado de su IA y ofrécele seguimiento operativo.");
    }
    return translateRuntimeText("Revisa por qué cayó el uso y ofrece ayuda en mostrador o una reactivación con seguimiento.");
  }

  if (restaurant.healthSegment === "healthy" && Number(restaurant.aiModelSummary?.sampleCount || 0) >= 12) {
    const dominantStage = restaurant.aiModelSummary?.stageBaselines?.preparing >= restaurant.aiModelSummary?.stageBaselines?.received &&
      restaurant.aiModelSummary?.stageBaselines?.preparing >= restaurant.aiModelSummary?.stageBaselines?.ready
      ? "preparacion"
      : restaurant.aiModelSummary?.stageBaselines?.ready >= restaurant.aiModelSummary?.stageBaselines?.received
        ? "recogida"
        : "entrada a cocina";
    return translateRuntimeText(`Usa este local como caso de exito: ya tiene una IA adaptada y suficiente histórico para demostrar valor. Cuello dominante aprendido: ${dominantStage}.`);
  }

  return translateRuntimeText("Mantén frecuencia, pide valoraciones y prepara upsell a más locales o más tiempo de plan.");
}

function getHealthSegmentPriority(segment) {
  if (segment === "renewal") return 0;
  if (segment === "onboarding") return 1;
  if (segment === "at-risk") return 2;
  if (segment === "healthy") return 3;
  return 4;
}

function getCurrentUiLocale() {
  const language = window.TurnoListoI18n?.getLanguage?.() || "es";
  if (language === "en") return "en-US";
  if (language === "fr") return "fr-FR";
  return "es-ES";
}

function getAdminActionQueues(options = {}) {
  const period = options.period ? normalizeDashboardPeriod(options.period) : null;
  const restaurants = loadRestaurants();
  const orders = loadOrders();
  const filteredOrders = period ? filterOrdersByDashboardPeriod(orders, period) : orders;
  const counts = {
    renewal: 0,
    onboarding: 0,
    "at-risk": 0,
    healthy: 0,
  };

  restaurants.forEach((restaurant) => {
    const historicalOrders = orders.filter((order) => order.restaurantId === restaurant.id);
    const restaurantOrders = filteredOrders.filter((order) => order.restaurantId === restaurant.id);
    const segment = getRestaurantHealthSegment(restaurant, restaurantOrders, {
      period,
      historicalOrders,
    });
    counts[segment] = (counts[segment] || 0) + 1;
  });

  return counts;
}

function formatAdminDate(value) {
  if (!value) return translateRuntimeText("No disponible");
  return new Intl.DateTimeFormat(getCurrentUiLocale(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatAdminDateTime(value) {
  if (!value) return translateRuntimeText("No disponible");
  return new Intl.DateTimeFormat(getCurrentUiLocale(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatAdminDayLabel(value) {
  if (!value) return translateRuntimeText("No disponible");
  return new Intl.DateTimeFormat(getCurrentUiLocale(), {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function renderTextWithClickableLinks(element, value) {
  if (!element) return;
  const text = String(value || "");
  const fragment = document.createDocumentFragment();
  const urlPattern = /((?:https?:\/\/|www\.)[^\s<]+)/gi;
  let lastIndex = 0;
  let match = urlPattern.exec(text);

  while (match) {
    const startIndex = match.index;
    const matchedUrl = match[0];
    let displayUrl = matchedUrl;
    let trailingText = "";

    while (/[),.;:!?]$/.test(displayUrl)) {
      trailingText = `${displayUrl.slice(-1)}${trailingText}`;
      displayUrl = displayUrl.slice(0, -1);
    }

    if (startIndex > lastIndex) {
      fragment.append(document.createTextNode(text.slice(lastIndex, startIndex)));
    }

    if (displayUrl) {
      const link = document.createElement("a");
      link.href = /^https?:\/\//i.test(displayUrl) ? displayUrl : `https://${displayUrl}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "inline-message-link";
      link.textContent = displayUrl;
      fragment.append(link);
    }

    if (trailingText) {
      fragment.append(document.createTextNode(trailingText));
    }

    lastIndex = startIndex + matchedUrl.length;
    match = urlPattern.exec(text);
  }

  if (lastIndex < text.length) {
    fragment.append(document.createTextNode(text.slice(lastIndex)));
  }

  if (!fragment.childNodes.length) {
    fragment.append(document.createTextNode(text));
  }

  element.replaceChildren(fragment);
}

function buildRemainingAccessLabel(restaurant) {
  const days =
    typeof restaurant?.remainingDays === "number" && Number.isFinite(restaurant.remainingDays)
      ? restaurant.remainingDays
      : getRestaurantRemainingDays(restaurant);
  if (days === null) return translateRuntimeText("Sin vencimiento");
  if (days < 0) return translateRuntimeText("Acceso bloqueado");
  if (days === 0) return translateRuntimeText("Vence hoy");
  if (days === 1) return translateRuntimeText("Vence en 1 día");
  return translateRuntimeText(`Vence en ${days} días`);
}

function buildRestaurantAccessUrl() {
  return new URL("./restaurant.html", window.location.href).toString();
}

function buildAdminAccessUrl() {
  return new URL("./admin.html", window.location.href).toString();
}

async function openCredentialsEmail(restaurant) {
  const email = await buildAdminEmailDraft("credentials", restaurant);
  if (!email) return;
  window.location.href = email.href;
}

async function openOnboardingEmail(restaurant) {
  const email = await buildAdminEmailDraft("onboarding", restaurant);
  if (!email) return;
  window.location.href = email.href;
}

function openRenewalEmail(restaurant) {
  const email = buildRestaurantRenewalEmail(restaurant, {
    accessUrl: buildRestaurantAccessUrl(),
  });
  window.location.href = email.href;
}

function openDemoUpgradeEmail(restaurant) {
  if (!restaurant.email) return;
  const email = buildRestaurantDemoUpgradeEmail(restaurant, {
    accessUrl: buildRestaurantAccessUrl(),
  });
  window.location.href = email.href;
}

async function ensureRestaurantAccessLinkForEmail(restaurant, options = {}) {
  const emailRestaurant = { ...restaurant };
  if (emailRestaurant.accessLink) return emailRestaurant;

  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.createRestaurantAccessLink !== "function") {
    if (options.requireLink) {
      adminCreateFeedback.textContent = translateRuntimeText("No hay enlace seguro disponible para este restaurante.");
      adminCreateFeedback.className = "form-feedback form-feedback--error";
      adminCreateFeedback.hidden = false;
    }
    return options.requireLink ? null : emailRestaurant;
  }

  try {
    const result = await backend.createRestaurantAccessLink({
      restaurantId: restaurant.id,
      appUrl: buildRestaurantAccessUrl(),
    });
    emailRestaurant.accessLink = String(result?.accessLink || "").trim();
    return emailRestaurant;
  } catch (error) {
    console.error("No se pudo preparar el enlace seguro del restaurante.", error);
    if (options.requireLink) {
      adminCreateFeedback.textContent = translateRuntimeText("No se pudo generar el enlace seguro del restaurante.");
      adminCreateFeedback.className = "form-feedback form-feedback--error";
      adminCreateFeedback.hidden = false;
      showTurnoAlert(translateRuntimeText("No se pudo generar el enlace seguro del restaurante."), "error");
      return null;
    }
    return emailRestaurant;
  }
}

async function buildAdminEmailDraft(kind, restaurant) {
  if (!restaurant?.email) return null;
  const accessUrl = buildRestaurantAccessUrl();

  if (kind === "credentials") {
    const emailRestaurant = await ensureRestaurantAccessLinkForEmail(restaurant, { requireLink: true });
    if (!emailRestaurant?.accessLink) return null;
    return buildRestaurantCredentialsEmail(emailRestaurant, { accessUrl });
  }

  if (kind === "onboarding") {
    const emailRestaurant = await ensureRestaurantAccessLinkForEmail(restaurant, { requireLink: false });
    return buildRestaurantOnboardingEmail(emailRestaurant || restaurant, { accessUrl });
  }

  if (kind === "renewal") {
    return buildRestaurantRenewalEmail(restaurant, { accessUrl });
  }

  if (kind === "upgrade") {
    return buildRestaurantDemoUpgradeEmail(restaurant, { accessUrl });
  }

  return null;
}

function getAdminEmailTemplateDefinitions(restaurant) {
  const templates = [
    { key: "credentials", label: "Acceso" },
    { key: "onboarding", label: "Onboarding" },
    { key: "renewal", label: "Renovación" },
  ];

  if (isDemoRestaurant(restaurant)) {
    templates.push({ key: "upgrade", label: "Upgrade" });
  }

  return templates;
}

async function openEmailTemplatesModal(restaurant) {
  return openEmailTemplatesModalWithOptions(restaurant, { preserveSelection: false });
}

async function openEmailTemplatesModalWithOptions(restaurant, options = {}) {
  if (!restaurant?.email || !adminEmailTemplatesModal) return;
  const preserveSelection = Boolean(options.preserveSelection);
  pendingEmailTemplateRestaurantId = restaurant.id;
  if (!preserveSelection || !activeEmailTemplateKey) {
    activeEmailTemplateKey = "credentials";
  }
  adminEmailTemplatesMeta.textContent = `${restaurant.name} · ${restaurant.email}`;
  adminEmailTemplatesModal.hidden = false;
  await renderEmailTemplateSelector(restaurant);
  await selectEmailTemplate(activeEmailTemplateKey);
}

async function refreshOpenAdminModals() {
  if (!adminDeleteModal.hidden && pendingDeleteRestaurantId) {
    const restaurant = getRestaurantById(pendingDeleteRestaurantId);
    if (restaurant) openDeleteModal(restaurant);
  }

  if (!adminActivatePlanModal?.hidden && pendingActivatePlanRestaurantId) {
    const restaurant = getRestaurantById(pendingActivatePlanRestaurantId);
    if (restaurant) openActivatePlanModal(restaurant);
  }

  if (!adminRenewPlanModal?.hidden && pendingRenewPlanRestaurantId) {
    const restaurant = getRestaurantById(pendingRenewPlanRestaurantId);
    if (restaurant) openRenewPlanModal(restaurant);
  }

  if (!adminEmailTemplatesModal?.hidden && pendingEmailTemplateRestaurantId) {
    const restaurant = getRestaurantById(pendingEmailTemplateRestaurantId);
    if (restaurant) {
      await openEmailTemplatesModalWithOptions(restaurant, { preserveSelection: true });
    }
  }
}

async function renderEmailTemplateSelector(restaurant) {
  if (!adminEmailTemplateOptions) return;
  adminEmailTemplateOptions.innerHTML = "";

  getAdminEmailTemplateDefinitions(restaurant).forEach((template) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "email-template-switcher__button";
    button.textContent = translateRuntimeText(template.label);
    button.dataset.templateKey = template.key;
    button.addEventListener("click", async () => {
      await selectEmailTemplate(template.key);
    });
    adminEmailTemplateOptions.append(button);
  });
}

async function selectEmailTemplate(templateKey) {
  const restaurant = pendingEmailTemplateRestaurantId ? getRestaurantById(pendingEmailTemplateRestaurantId) : null;
  if (!restaurant) return;
  activeEmailTemplateKey = templateKey;
  renderTextWithClickableLinks(adminEmailTemplateBody, translateRuntimeText("Preparando plantilla..."));
  adminEmailTemplateSubject.textContent = "-";
  adminEmailTemplateTo.textContent = restaurant.email || "-";

  const draft = await buildAdminEmailDraft(templateKey, restaurant);
  if (!draft) {
    activeEmailTemplateDraft = null;
    adminEmailTemplateSubject.textContent = translateRuntimeText("No disponible");
    renderTextWithClickableLinks(adminEmailTemplateBody, translateRuntimeText("No se pudo preparar esta plantilla."));
  } else {
    activeEmailTemplateDraft = draft;
    adminEmailTemplateTo.textContent = draft.to || restaurant.email || "-";
    adminEmailTemplateSubject.textContent = draft.subject || "-";
    renderTextWithClickableLinks(adminEmailTemplateBody, draft.body || "");
  }

  adminEmailTemplateOptions?.querySelectorAll(".email-template-switcher__button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.templateKey === templateKey);
  });
}

function closeEmailTemplatesModal() {
  if (!adminEmailTemplatesModal) return;
  adminEmailTemplatesModal.hidden = true;
  pendingEmailTemplateRestaurantId = null;
  activeEmailTemplateDraft = null;
  activeEmailTemplateKey = "credentials";
}

async function copyEmailTemplatePart(part) {
  if (!activeEmailTemplateDraft) return;
  const text =
    part === "subject"
      ? activeEmailTemplateDraft.subject
      : part === "body"
        ? activeEmailTemplateDraft.body
        : `Para: ${activeEmailTemplateDraft.to}\nAsunto: ${activeEmailTemplateDraft.subject}\n\n${activeEmailTemplateDraft.body}`;
  try {
    await navigator.clipboard.writeText(text);
    showTurnoAlert(
      part === "subject"
        ? translateRuntimeText("Asunto copiado.")
        : part === "body"
          ? translateRuntimeText("Texto copiado.")
          : translateRuntimeText("Correo completo copiado."),
      "success",
    );
  } catch (error) {
    console.error("No se pudo copiar la plantilla.", error);
    showTurnoAlert(translateRuntimeText("No se pudo copiar el contenido."), "error");
  }
}

function openSelectedEmailTemplateInMailApp() {
  if (!activeEmailTemplateDraft?.href) return;
  window.location.href = activeEmailTemplateDraft.href;
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

function openDeleteModal(restaurant) {
  pendingDeleteRestaurantId = restaurant.id;
  pendingDeleteRestaurantName = restaurant.name;
  adminDeleteMeta.textContent = `${restaurant.name} · ${restaurant.email || translateRuntimeText("Sin correo")}`;
  adminDeleteModal.hidden = false;
}

function closeDeleteModal() {
  adminDeleteModal.hidden = true;
  pendingDeleteRestaurantId = null;
  pendingDeleteRestaurantName = "";
}

function openActivatePlanModal(restaurant) {
  pendingActivatePlanRestaurantId = restaurant.id;
  pendingActivatePlanRestaurantName = restaurant.name;
  if (adminActivatePlanMeta) {
    adminActivatePlanMeta.textContent = `${restaurant.name} · ${restaurant.email || translateRuntimeText("Sin correo")}`;
  }
  if (adminActivatePlanSelect) {
    adminActivatePlanSelect.value = "Mensual";
  }
  syncActivatePlanDays();
  if (adminActivatePlanModal) {
    adminActivatePlanModal.hidden = false;
  }
}

function closeActivatePlanModal() {
  if (adminActivatePlanModal) {
    adminActivatePlanModal.hidden = true;
  }
  pendingActivatePlanRestaurantId = null;
  pendingActivatePlanRestaurantName = "";
}

function openRenewPlanModal(restaurant) {
  pendingRenewPlanRestaurantId = restaurant.id;
  pendingRenewPlanRestaurantName = restaurant.name;
  if (adminRenewPlanMeta) {
    adminRenewPlanMeta.textContent = `${restaurant.name} · ${restaurant.email || translateRuntimeText("Sin correo")}`;
  }
  if (adminRenewPlanCurrentStatus) {
    const currentPlanLabel = String(restaurant.planName || translateRuntimeText("No disponible")).trim() || translateRuntimeText("No disponible");
    const currentEndLabel = restaurant.activatedUntil ? formatAdminDate(restaurant.activatedUntil) : translateRuntimeText("No disponible");
    adminRenewPlanCurrentStatus.textContent = translateRuntimeText(`Estado actual: ${currentPlanLabel} · Vigente hasta ${currentEndLabel}.`);
  }
  if (adminRenewPlanSelect) {
    const currentPlan = resolveRenewablePlanName(restaurant);
    adminRenewPlanSelect.value = currentPlan;
  }
  syncRenewPlanDays();
  if (adminRenewPlanModal) {
    adminRenewPlanModal.hidden = false;
  }
}

function closeRenewPlanModal() {
  if (adminRenewPlanModal) {
    adminRenewPlanModal.hidden = true;
  }
  pendingRenewPlanRestaurantId = null;
  pendingRenewPlanRestaurantName = "";
}

function confirmDeleteRestaurant() {
  if (!pendingDeleteRestaurantId) return;

  deleteRestaurantAccount(pendingDeleteRestaurantId);
  adminCreateFeedback.textContent = translateRuntimeText(`Se eliminó ${pendingDeleteRestaurantName}.`);
  adminCreateFeedback.className = "form-feedback form-feedback--success";
  adminCreateFeedback.hidden = false;
  closeDeleteModal();
  renderAdminWorkspace();
}

function confirmActivateRestaurantPlan() {
  if (!pendingActivatePlanRestaurantId) return;
  const selectedPlan = adminActivatePlanSelect?.value || "Mensual";
  const updatedRestaurant = activateRestaurantPlan(pendingActivatePlanRestaurantId, selectedPlan);
  if (!updatedRestaurant) return;

  adminCreateFeedback.textContent = translateRuntimeText(`${pendingActivatePlanRestaurantName} pasó de demo a plan ${selectedPlan}.`);
  adminCreateFeedback.className = "form-feedback form-feedback--success";
  adminCreateFeedback.hidden = false;
  showTurnoAlert(translateRuntimeText(`${pendingActivatePlanRestaurantName} activado en plan ${selectedPlan}.`), "success");
  closeActivatePlanModal();
  renderAdminWorkspace();
}

function confirmRenewRestaurantPlan() {
  if (!pendingRenewPlanRestaurantId) return;
  const selectedPlan = adminRenewPlanSelect?.value || "Mensual";
  const updatedRestaurant = renewRestaurantPlan(pendingRenewPlanRestaurantId, selectedPlan);
  if (!updatedRestaurant) return;

  adminCreateFeedback.textContent = translateRuntimeText(`${pendingRenewPlanRestaurantName} quedó renovado en plan ${selectedPlan} hasta ${formatAdminDate(updatedRestaurant.activatedUntil)}.`);
  adminCreateFeedback.className = "form-feedback form-feedback--success";
  adminCreateFeedback.hidden = false;
  showTurnoAlert(translateRuntimeText(`${pendingRenewPlanRestaurantName} renovado en plan ${selectedPlan} hasta ${formatAdminDate(updatedRestaurant.activatedUntil)}.`), "success");
  closeRenewPlanModal();
  renderAdminWorkspace();
}
