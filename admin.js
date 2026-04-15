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
const adminRestaurantLogoPreview = document.querySelector("#adminRestaurantLogoPreview");
const adminRestaurantLogoPreviewImage = document.querySelector("#adminRestaurantLogoPreviewImage");
const adminPlanSelect = document.querySelector("#adminPlanSelect");
const adminActivationDays = document.querySelector("#adminActivationDays");
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
const adminPhoneError = document.querySelector("#adminPhoneError");
const adminRestaurantList = document.querySelector("#adminRestaurantList");
const adminRestaurantCount = document.querySelector("#adminRestaurantCount");
const adminTabs = document.querySelectorAll("[data-admin-section]");
const adminPanels = document.querySelectorAll("[data-admin-panel]");
const adminDashboardLinks = document.querySelectorAll('.workspace-brand--link[href="./admin.html"], .workspace-home-button[href="./admin.html"]');
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
let activeAdminDashboardPeriod = normalizeDashboardPeriod(
  window.localStorage.getItem("turnolisto-admin-dashboard-period") || "day",
);
const PLAN_DURATIONS = {
  Demo: 7,
  Quincenal: 15,
  Mensual: 30,
  Trimestral: 90,
  Semestral: 180,
  Anual: 365,
};
const RENEWABLE_PLAN_NAMES = ["Quincenal", "Mensual", "Trimestral", "Semestral", "Anual"];
const CONTACT_INQUIRIES_COLLECTION = "contactInquiries";
const PHONE_COUNTRIES = [
  { iso: "ES", flag: "🇪🇸", name: "España", dialCode: "+34", placeholder: "600 000 000", minDigits: 9, maxDigits: 9 },
  { iso: "PT", flag: "🇵🇹", name: "Portugal", dialCode: "+351", placeholder: "912 345 678", minDigits: 9, maxDigits: 9 },
  { iso: "FR", flag: "🇫🇷", name: "Francia", dialCode: "+33", placeholder: "6 12 34 56 78", minDigits: 9, maxDigits: 9 },
  { iso: "IT", flag: "🇮🇹", name: "Italia", dialCode: "+39", placeholder: "312 345 6789", minDigits: 9, maxDigits: 10 },
  { iso: "DE", flag: "🇩🇪", name: "Alemania", dialCode: "+49", placeholder: "1512 3456789", minDigits: 10, maxDigits: 11 },
  { iso: "GB", flag: "🇬🇧", name: "Reino Unido", dialCode: "+44", placeholder: "7400 123456", minDigits: 10, maxDigits: 10 },
  { iso: "IE", flag: "🇮🇪", name: "Irlanda", dialCode: "+353", placeholder: "85 123 4567", minDigits: 9, maxDigits: 9 },
  { iso: "NL", flag: "🇳🇱", name: "Países Bajos", dialCode: "+31", placeholder: "6 12345678", minDigits: 9, maxDigits: 9 },
  { iso: "BE", flag: "🇧🇪", name: "Bélgica", dialCode: "+32", placeholder: "470 12 34 56", minDigits: 9, maxDigits: 9 },
  { iso: "CH", flag: "🇨🇭", name: "Suiza", dialCode: "+41", placeholder: "78 123 45 67", minDigits: 9, maxDigits: 9 },
  { iso: "AT", flag: "🇦🇹", name: "Austria", dialCode: "+43", placeholder: "664 1234567", minDigits: 10, maxDigits: 11 },
  { iso: "US", flag: "🇺🇸", name: "Estados Unidos", dialCode: "+1", placeholder: "(201) 555 0123", minDigits: 10, maxDigits: 10 },
  { iso: "MX", flag: "🇲🇽", name: "México", dialCode: "+52", placeholder: "55 1234 5678", minDigits: 10, maxDigits: 10 },
  { iso: "AR", flag: "🇦🇷", name: "Argentina", dialCode: "+54", placeholder: "11 2345 6789", minDigits: 10, maxDigits: 10 },
  { iso: "CL", flag: "🇨🇱", name: "Chile", dialCode: "+56", placeholder: "9 6123 4567", minDigits: 9, maxDigits: 9 },
  { iso: "CO", flag: "🇨🇴", name: "Colombia", dialCode: "+57", placeholder: "320 123 4567", minDigits: 10, maxDigits: 10 },
  { iso: "PE", flag: "🇵🇪", name: "Perú", dialCode: "+51", placeholder: "912 345 678", minDigits: 9, maxDigits: 9 },
  { iso: "EC", flag: "🇪🇨", name: "Ecuador", dialCode: "+593", placeholder: "99 123 4567", minDigits: 9, maxDigits: 9 },
  { iso: "UY", flag: "🇺🇾", name: "Uruguay", dialCode: "+598", placeholder: "94 123 456", minDigits: 8, maxDigits: 9 },
  { iso: "BR", flag: "🇧🇷", name: "Brasil", dialCode: "+55", placeholder: "11 91234 5678", minDigits: 11, maxDigits: 11 },
];
const DEFAULT_PHONE_COUNTRY_ISO = "ES";

let selectedPhoneCountryIso = DEFAULT_PHONE_COUNTRY_ISO;

initializeAdminFirebaseAuth();
waitForDataReady().then(bootAdminPage);
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
adminPhoneCountryTrigger?.addEventListener("click", toggleAdminPhoneCountryPanel);
adminPhoneCountrySearch?.addEventListener("input", renderAdminPhoneCountryList);
adminRestaurantPhoneLocal?.addEventListener("input", () => {
  syncAdminPhoneHiddenValue();
  if (adminPhoneError && !adminPhoneError.hidden) {
    validateAdminPhoneNumber({ report: true });
  }
});
adminRestaurantPhoneLocal?.addEventListener("blur", () => {
  validateAdminPhoneNumber({ report: Boolean(adminRestaurantPhoneLocal?.value.trim()) });
});
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
adminAccountButton?.addEventListener("click", toggleAdminAccountMenu);
adminMenuLogout?.addEventListener("click", async () => {
  closeAdminAccountMenu();
  await handleAdminLogout();
});
adminProfileForm?.addEventListener("submit", handleAdminProfileSubmit);
adminProfileAvatarInput?.addEventListener("change", handleAdminAvatarSelection);
adminCreateAdminForm?.addEventListener("submit", handleCreateAdminAccount);
window.addEventListener("click", handleAdminAccountOutsideClick);
window.addEventListener("click", handleAdminPhoneCountryOutsideClick);
window.addEventListener("keydown", handleAdminPhoneCountryKeydown);
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

function syncActivationDaysWithPlan() {
  const plan = adminPlanSelect.value || "Mensual";
  const isDemo = plan === "Demo";

  if (isDemo) {
    adminActivationDays.value = PLAN_DURATIONS.Demo;
  }

  if (!isDemo) {
    adminActivationDays.value = PLAN_DURATIONS[plan] || 30;
  }

  adminActivationDays.readOnly = true;
  if (adminCreateRestaurantOwner) adminCreateRestaurantOwner.required = !isDemo;
  if (adminRestaurantPhoneLocal) adminRestaurantPhoneLocal.required = !isDemo;
  if (adminCreateRestaurantName) adminCreateRestaurantName.placeholder = isDemo ? "Ej. Demo Kebab Centro" : "Ej. Burger Centro";
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
    adminLoginFeedback.textContent = "Firebase Authentication no está disponible en esta configuración.";
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
    adminLoginFeedback.textContent = "Credenciales incorrectas o la cuenta no tiene un perfil admin en users/{uid}.";
    adminLoginFeedback.className = "form-feedback form-feedback--error";
    adminLoginFeedback.hidden = false;
    showTurnoAlert("No se pudo iniciar sesion como administrador. Verifica credenciales, dominio autorizado y el perfil users/{uid}.", "error");
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
    adminCreateFeedback.textContent = "La automatizacion del alta no esta disponible. Revisa Firebase Functions.";
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert("La automatizacion del alta no esta disponible. Revisa Firebase Functions.", "error");
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
        ? `DEMO creada para ${restaurant.name}. Queda lista para probar pedidos, QR e IA adaptativa con límites comerciales.`
        : `Acceso creado para ${restaurant.name}. Se preparó un enlace seguro para definir la contraseña.`;
    adminCreateFeedback.className = "form-feedback form-feedback--success";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(
      restaurant.demoMode
        ? `Demo comercial de ${restaurant.name} creada correctamente.`
        : `Restaurante ${restaurant.name} creado correctamente.`,
      "success",
    );
    await openCredentialsEmail(restaurant);
    activeAdminSection = "restaurants";
    renderAdminWorkspace();
  } catch (error) {
    console.error("No se pudo crear el restaurante automaticamente.", error);
    const message =
      error?.code === "functions/already-exists"
        ? "Ese correo ya existe para otro restaurante o en Firebase Authentication."
        : "No se pudo crear el restaurante. Revisa Firebase Functions, permisos y configuracion.";
    adminCreateFeedback.textContent = message;
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(message, "error");
  }
}

function getPhoneCountryByIso(iso) {
  return PHONE_COUNTRIES.find((country) => country.iso === iso) || PHONE_COUNTRIES[0];
}

function formatPhoneDigitsRule(country) {
  if (country.minDigits === country.maxDigits) {
    return `${country.minDigits} dígitos`;
  }
  return `entre ${country.minDigits} y ${country.maxDigits} dígitos`;
}

function setAdminPhoneError(message = "") {
  const safeMessage = String(message || "").trim();
  if (adminPhoneError) {
    adminPhoneError.textContent = safeMessage;
    adminPhoneError.hidden = !safeMessage;
  }
  adminPhoneField?.classList.toggle("has-error", Boolean(safeMessage));
  if (adminRestaurantPhoneLocal) {
    adminRestaurantPhoneLocal.setCustomValidity(safeMessage);
  }
}

function renderAdminPhoneCountryState() {
  const country = getPhoneCountryByIso(selectedPhoneCountryIso);
  if (adminPhoneCountryFlag) adminPhoneCountryFlag.textContent = country.flag;
  if (adminPhoneCountryDial) adminPhoneCountryDial.textContent = country.dialCode;
  if (adminPhoneCountryName) adminPhoneCountryName.textContent = country.name;
  if (adminRestaurantPhoneLocal && !adminRestaurantPhoneLocal.value.trim()) {
    adminRestaurantPhoneLocal.placeholder = country.placeholder;
  }
}

function buildAdminPhoneNumber() {
  const country = getPhoneCountryByIso(selectedPhoneCountryIso);
  const localValue = String(adminRestaurantPhoneLocal?.value || "")
    .replace(/[^\d\s()-]/g, "")
    .trim();

  if (!localValue) {
    if (adminCreateRestaurantPhone) adminCreateRestaurantPhone.value = "";
    return "";
  }

  const digitsOnly = localValue.replace(/\D/g, "");
  const dialDigits = country.dialCode.replace(/\D/g, "");
  const normalizedLocal =
    digitsOnly.startsWith(dialDigits) && localValue.replace(/\s+/g, "").startsWith(dialDigits)
      ? digitsOnly.slice(dialDigits.length)
      : localValue;
  const fullPhone = `${country.dialCode} ${String(normalizedLocal).trim()}`.trim();
  if (adminCreateRestaurantPhone) adminCreateRestaurantPhone.value = fullPhone;
  return fullPhone;
}

function syncAdminPhoneHiddenValue() {
  if (adminRestaurantPhoneLocal?.value.trim()) {
    setAdminPhoneError("");
  }
  return buildAdminPhoneNumber();
}

function validateAdminPhoneNumber(options = {}) {
  const country = getPhoneCountryByIso(selectedPhoneCountryIso);
  const isDemoPlan = String(adminPlanSelect?.value || "") === "Demo";
  const rawValue = String(adminRestaurantPhoneLocal?.value || "").trim();
  const digitsOnly = rawValue.replace(/\D/g, "");
  const dialDigits = country.dialCode.replace(/\D/g, "");
  let localDigits = digitsOnly;

  if (!rawValue) {
    if (isDemoPlan) {
      setAdminPhoneError("");
      if (adminCreateRestaurantPhone) adminCreateRestaurantPhone.value = "";
      return {
        valid: true,
        phone: "",
        countryName: country.name,
        phoneCountry: {
          iso: country.iso,
          name: country.name,
          dialCode: country.dialCode,
        },
        message: "",
      };
    }

    const message = `Introduce un número móvil de ${formatPhoneDigitsRule(country)} para ${country.name}.`;
    if (options.report) setAdminPhoneError(message);
    return { valid: false, message };
  }

  if (localDigits.startsWith(dialDigits)) {
    localDigits = localDigits.slice(dialDigits.length);
  }

  if (localDigits.length < country.minDigits || localDigits.length > country.maxDigits) {
    const message =
      country.minDigits === country.maxDigits
        ? `El móvil de ${country.name} debe tener ${country.minDigits} dígitos sin contar el prefijo ${country.dialCode}.`
        : `El móvil de ${country.name} debe tener entre ${country.minDigits} y ${country.maxDigits} dígitos sin contar el prefijo ${country.dialCode}.`;
    if (options.report) setAdminPhoneError(message);
    return { valid: false, message };
  }

  const formattedPhone = `${country.dialCode} ${localDigits}`.trim();
  if (adminCreateRestaurantPhone) adminCreateRestaurantPhone.value = formattedPhone;
  setAdminPhoneError("");
  return {
    valid: true,
    phone: formattedPhone,
    countryName: country.name,
    phoneCountry: {
      iso: country.iso,
      name: country.name,
      dialCode: country.dialCode,
    },
    message: "",
  };
}

function renderAdminPhoneCountryList() {
  if (!adminPhoneCountryList) return;
  const query = String(adminPhoneCountrySearch?.value || "")
    .trim()
    .toLowerCase();
  adminPhoneCountryList.innerHTML = "";

  const filteredCountries = PHONE_COUNTRIES.filter((country) => {
    if (!query) return true;
    return (
      country.name.toLowerCase().includes(query) ||
      country.dialCode.toLowerCase().includes(query) ||
      country.iso.toLowerCase().includes(query)
    );
  });

  if (!filteredCountries.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "phone-country-list__empty";
    emptyState.textContent = "No encontramos ningún país con esa búsqueda.";
    adminPhoneCountryList.append(emptyState);
    return;
  }

  filteredCountries.forEach((country) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "phone-country-option";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(country.iso === selectedPhoneCountryIso));
    if (country.iso === selectedPhoneCountryIso) option.classList.add("is-active");
    option.addEventListener("click", () => {
      selectedPhoneCountryIso = country.iso;
      renderAdminPhoneCountryState();
      syncAdminPhoneHiddenValue();
      validateAdminPhoneNumber({ report: Boolean(adminRestaurantPhoneLocal?.value.trim()) });
      closeAdminPhoneCountryPanel();
    });

    const flag = document.createElement("span");
    flag.className = "phone-country-option__flag";
    flag.textContent = country.flag;

    const meta = document.createElement("span");
    meta.className = "phone-country-option__meta";

    const name = document.createElement("span");
    name.className = "phone-country-option__name";
    name.textContent = country.name;

    const dial = document.createElement("span");
    dial.className = "phone-country-option__dial";
    dial.textContent = `${country.dialCode} · ${country.iso}`;

    meta.append(name, dial);
    option.append(flag, meta);
    adminPhoneCountryList.append(option);
  });
}

function openAdminPhoneCountryPanel() {
  if (!adminPhoneCountryPanel || !adminPhoneCountryTrigger) return;
  adminPhoneCountryPanel.hidden = false;
  adminPhoneField?.classList.add("is-open");
  adminPhoneCountryTrigger.setAttribute("aria-expanded", "true");
  renderAdminPhoneCountryList();
  window.requestAnimationFrame(() => {
    adminPhoneCountrySearch?.focus();
    adminPhoneCountrySearch?.select();
  });
}

function closeAdminPhoneCountryPanel() {
  if (!adminPhoneCountryPanel || !adminPhoneCountryTrigger) return;
  adminPhoneCountryPanel.hidden = true;
  adminPhoneField?.classList.remove("is-open");
  adminPhoneCountryTrigger.setAttribute("aria-expanded", "false");
}

function toggleAdminPhoneCountryPanel() {
  if (adminPhoneCountryPanel?.hidden) {
    openAdminPhoneCountryPanel();
    return;
  }
  closeAdminPhoneCountryPanel();
}

function resetAdminPhoneField() {
  selectedPhoneCountryIso = DEFAULT_PHONE_COUNTRY_ISO;
  if (adminPhoneCountrySearch) adminPhoneCountrySearch.value = "";
  if (adminRestaurantPhoneLocal) {
    adminRestaurantPhoneLocal.value = "";
    adminRestaurantPhoneLocal.setCustomValidity("");
  }
  if (adminCreateRestaurantPhone) adminCreateRestaurantPhone.value = "";
  setAdminPhoneError("");
  renderAdminPhoneCountryState();
  renderAdminPhoneCountryList();
  closeAdminPhoneCountryPanel();
}

function initializeAdminPhoneField() {
  if (!adminPhoneField) return;
  resetAdminPhoneField();
}

async function handleRestaurantLogoSelection(event) {
  const file = event.target.files?.[0] || null;
  if (!file) {
    resetRestaurantLogoPreview();
    return;
  }

  try {
    selectedRestaurantLogoUrl = await optimizeRestaurantLogo(file);
    adminRestaurantLogoPreviewImage.src = selectedRestaurantLogoUrl;
    adminRestaurantLogoPreview.hidden = false;
    adminCreateFeedback.hidden = true;
    adminCreateFeedback.textContent = "";
  } catch (error) {
    console.error("No se pudo preparar el logo del restaurante.", error);
    resetRestaurantLogoPreview();
    adminCreateFeedback.textContent =
      error instanceof Error ? error.message : "No se pudo procesar el logo. Usa una imagen JPG, PNG o WebP mas ligera.";
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(adminCreateFeedback.textContent, "error");
  }
}

function resetRestaurantLogoPreview() {
  selectedRestaurantLogoUrl = "";
  adminRestaurantLogoInput.value = "";
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
      if (!user?.uid) {
        clearCurrentUserProfile();
        syncAdminAccess();
        return;
      }

      await reconnectDataStoreToFirebase();
      const profile = await loadCurrentUserProfileFromBackend();

      if (profile?.role !== "admin") {
        clearCurrentUserProfile();
        adminLoginFeedback.textContent = "La cuenta autenticada no tiene role=admin en users/{uid}.";
        adminLoginFeedback.className = "form-feedback form-feedback--error";
        adminLoginFeedback.hidden = false;
        showTurnoAlert("La cuenta autenticada no tiene permisos de administrador.", "error");
        await backend.signOut();
        return;
      }

      adminLoginFeedback.hidden = true;
      adminLoginFeedback.textContent = "";
      initializeAdminInbox();
      refreshAdminUsers();
      syncAdminAccess();
      renderAdminWorkspace();
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

  const normalizedPlanName = PLAN_DURATIONS[planName] ? planName : "Mensual";
  const activationDays = PLAN_DURATIONS[normalizedPlanName] || 30;
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
  const plan = adminActivatePlanSelect.value || "Mensual";
  adminActivatePlanDays.value = String(PLAN_DURATIONS[plan] || 30);
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
  adminRenewPlanDays.value = String(renewalWindow.days);
  if (adminRenewPlanStartsAt) adminRenewPlanStartsAt.value = formatAdminDate(renewalWindow.startDate);
  if (adminRenewPlanEndsAt) adminRenewPlanEndsAt.value = formatAdminDate(renewalWindow.endDate);
}

function buildRenewPlanWindow(restaurant, planName = "Mensual") {
  const normalizedPlanName = resolveRenewablePlanName(restaurant, planName);
  const days = PLAN_DURATIONS[normalizedPlanName] || 30;
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
    showTurnoAlert("No se pudo cargar la bandeja de mensajes.", "error");
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
  const displayName = String(profile.displayName || profile.email || "Administrador").trim();
  const title = String(profile.title || "").trim();
  const avatarUrl = String(profile.avatarUrl || "").trim();

  if (adminAccountName) {
    adminAccountName.textContent = displayName;
  }

  if (adminAccountMeta) {
    adminAccountMeta.textContent = title ? `${title} · Acceso verificado` : "Acceso verificado";
  }

  if (adminAccountAvatarFallback) {
    adminAccountAvatarFallback.textContent = displayName.charAt(0).toUpperCase() || "A";
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
    const message = error instanceof Error ? error.message : "No se pudo preparar la foto del administrador.";
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
    adminProfileFeedback.textContent = "No se pudo guardar el perfil admin en esta configuración.";
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
    adminProfileFeedback.textContent = "Perfil administrador actualizado correctamente.";
    adminProfileFeedback.className = "form-feedback form-feedback--success";
    adminProfileFeedback.hidden = false;
    refreshAdminUsers();
    renderAdminWorkspace();
  } catch (error) {
    console.error("No se pudo actualizar el perfil admin.", error);
    adminProfileFeedback.textContent = "No se pudo guardar el perfil administrador.";
    adminProfileFeedback.className = "form-feedback form-feedback--error";
    adminProfileFeedback.hidden = false;
    showTurnoAlert("No se pudo guardar el perfil administrador.", "error");
  }
}

async function handleCreateAdminAccount(event) {
  event.preventDefault();
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.createAdminAccount !== "function") {
    adminCreateAdminFeedback.textContent = "No se pudo crear el usuario administrador en esta configuración.";
    adminCreateAdminFeedback.className = "form-feedback form-feedback--error";
    adminCreateAdminFeedback.hidden = false;
    return;
  }

  const formData = new FormData(adminCreateAdminForm);
  try {
    const result = await backend.createAdminAccount({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      title: formData.get("title"),
      appUrl: buildAdminAccessUrl(),
    });
    adminCreateAdminForm.reset();
    adminCreateAdminFeedback.textContent = result?.accessLink
      ? "Administrador creado. Se generó un enlace seguro para definir contraseña."
      : "Administrador creado correctamente.";
    adminCreateAdminFeedback.className = "form-feedback form-feedback--success";
    adminCreateAdminFeedback.hidden = false;
    await refreshAdminUsers();
    renderAdminWorkspace();
    showTurnoAlert("Nuevo administrador creado correctamente.", "success");
  } catch (error) {
    console.error("No se pudo crear el usuario admin.", error);
    const message =
      error?.code === "functions/already-exists"
        ? "Ese correo ya existe en Firebase Authentication."
        : "No se pudo crear el nuevo administrador.";
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
      card.textContent = "No se pudo cargar el equipo administrador por ahora.";
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
    empty.textContent = "Aquí verás el equipo administrador con acceso activo.";
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
    avatarFallback.textContent = String(user.displayName || user.email || "A").trim().charAt(0).toUpperCase() || "A";
    name.textContent = user.displayName || user.email || "Administrador";
    meta.textContent = [user.title || "Administrador", user.email || "Sin correo", user.phone || "Sin teléfono"].join(" · ");

    const avatarUrl = String(user.avatarUrl || "").trim();
    if (avatarUrl) {
      avatarImage.src = avatarUrl;
      avatarImage.alt = `Avatar de ${name.textContent}`;
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

  adminMessagesTotalChip.textContent = `${adminContactInquiries.length} mensajes`;
  adminMessagesUnreadChip.textContent = `${adminContactInquiries.filter((item) => !item.isRead).length} sin leer`;
  adminMessagesReadChip.textContent = `${adminContactInquiries.filter((item) => item.isRead).length} leídos`;
  adminMessageList.innerHTML = "";

  if (!filtered.length) {
    const empty = document.createElement("article");
    empty.className = "empty-state";
    empty.textContent = "No hay mensajes que coincidan con esos filtros.";
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
    hint.textContent = `${group.items.length} mensajes`;
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
  meta.textContent = [item.company || "Sin empresa", item.email || "Sin correo", item.phone || "Sin teléfono"].join(" · ");
  interest.textContent = item.interest;
  state.textContent = item.isRead ? "Leído" : "Sin leer";
  renderTextWithClickableLinks(body, item.message || "Sin mensaje");
  submitted.textContent = `Recibido ${formatAdminDateTime(item.submittedAt)}`;

  toggle.type = "button";
  toggle.className = "comment-button";
  toggle.textContent = item.isRead ? "Marcar sin leer" : "Marcar leído";
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
    showTurnoAlert("No se pudo actualizar el estado del mensaje.", "error");
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
    showTurnoAlert("No se pudo actualizar el estado del mensaje.", "error");
  }
}

function renderAdminDashboard(stats) {
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
  adminHeroActiveBaseHint.textContent = `${activeBaseRate}% de la base con acceso vigente`;
  adminHeroWeeklyActivity.textContent = `${weeklyActivityRate}%`;
  adminHeroWeeklyActivityHint.textContent = `${stats.recentlyActiveRestaurants} restaurantes registraron pedidos ${stats.periodScopeLabel}`;
  adminHeroRenewal.textContent = stats.expiredRestaurants + stats.soonToExpire;
  adminHeroRenewalHint.textContent = `${stats.expiredRestaurants} vencidos y ${stats.soonToExpire} por vencer`;
  adminHeroRisk.textContent = riskCount;
  adminHeroRiskHint.textContent = `${stats.dormantRestaurants} con señal de inactividad ${stats.periodResultsLabel} y ${stats.restaurantsWithoutOrders} sin activar`;
  const actionQueues = getAdminActionQueues({ period: stats.period });
  adminActionRenewalCount.textContent = actionQueues.renewal;
  adminActionOnboardingCount.textContent = actionQueues.onboarding;
  adminActionRiskCount.textContent = actionQueues["at-risk"];
  adminActionHealthyCount.textContent = actionQueues.healthy;
  adminActionRenewalHint.textContent = actionQueues.renewal
    ? `${actionQueues.renewal} cuentas necesitan renovación o contacto comercial inmediato`
    : "No hay cuentas urgentes de renovación ahora mismo";
  adminActionOnboardingHint.textContent = actionQueues.onboarding
    ? `${actionQueues.onboarding} locales necesitan activar hábito y primer valor claro`
    : "No hay onboarding bloqueado en este momento";
  adminActionRiskHint.textContent = actionQueues["at-risk"]
    ? `${actionQueues["at-risk"]} restaurantes muestran señales de caída de uso o posible churn`
    : "No hay señales de riesgo relevantes ahora";
  adminActionHealthyHint.textContent = actionQueues.healthy
    ? `${actionQueues.healthy} cuentas están listas para retención, reseñas o expansión`
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
      ? `${stats.highConfidenceModelCount} con confianza alta · error medio ${stats.averageModelError} min`
      : "Aun no hay locales con suficiente historico para adaptar el modelo";

  const topBox = document.createElement("article");
  topBox.className = "dashboard-insight";
  if (stats.topRestaurant) {
    topBox.textContent =
      `${stats.topRestaurant.restaurant.name} lidera ${stats.periodResultsLabel} con ${stats.topRestaurant.orderCount} pedidos creados y un promedio de ${formatDurationMinutes(stats.topRestaurant.avgDeliveryMinutes)} en sus entregas del periodo.`;
  } else {
    topBox.textContent = `Todavía no hay actividad suficiente ${stats.periodResultsLabel} para destacar un restaurante.`;
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
      valueLabel: `${item.orderCount} pedidos`,
    })),
    "Todavía no hay suficiente actividad para mostrar un ranking.",
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
  const insights = [];

  if (!dataset.length) {
    insights.push("Todavía no hay pedidos suficientes para construir un dataset de entrenamiento.");
    return insights;
  }

  insights.push(`${dataset.length} pedidos ya incluyen contexto operativo capturado para entrenamiento real por restaurante.`);

  if (deliveredDataset.length > 0) {
    insights.push(`${deliveredDataset.length} ejemplos ya permiten modelar minutos reales hasta entrega.`);
  }

  if (readyDataset.length > 0) {
    insights.push(`${readyDataset.length} ejemplos ya permiten modelar minutos reales hasta listo.`);
  }

  if (stats?.trainedRestaurantCount > 0) {
    insights.push(
      `${stats.trainedRestaurantCount} restaurante${stats.trainedRestaurantCount === 1 ? "" : "s"} ya tienen un modelo adaptado en producción con error medio de ${stats.averageModelError} min.`,
    );
  }

  if (!deliveredDataset.length && !readyDataset.length) {
    insights.push("Aún faltan hitos finales para entrenar un ETA predictivo real, pero la instrumentación ya está acumulando base.");
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
  showTurnoAlert("Dataset IA exportado en formato JSON.", "success");
}

function renderAdminBarChart(container, items, emptyMessage = "Sin datos suficientes por ahora.") {
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
    const label = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("span");
    const value = document.createElement("span");

    row.className = "dashboard-bar";
    label.className = "dashboard-bar__label";
    track.className = "dashboard-bar__track";
    value.className = "dashboard-bar__value";

    label.textContent = item.label;
    fill.style.width = `${Math.max(10, Math.round((Number(item.count || 0) / maxValue) * 100))}%`;
    fill.style.background = item.color || "#ec7c0d";
    value.textContent = item.valueLabel || String(item.count || 0);

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
    empty.className = "dashboard-insight";
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

function buildAdminInsights(stats) {
  const insights = [];

  if (stats.expiredRestaurants > 0) {
    insights.push(`Hay ${stats.expiredRestaurants} restaurantes con acceso vencido. Conviene revisar cobro o renovación.`);
  }

  if (stats.soonToExpire > 0) {
    insights.push(`${stats.soonToExpire} restaurantes vencen en menos de 7 días. Buen momento para activar recordatorios.`);
  }

  if (stats.activeOrders > stats.deliveredOrders) {
    insights.push(`Los pedidos abiertos creados ${stats.periodResultsLabel} superan a los entregados en ese mismo periodo. Conviene revisar si algunos locales necesitan apoyo.`);
  }

  if (stats.aiPortfolioAction) {
    insights.push(`Señal IA de cartera: ${stats.aiPortfolioAction}`);
  }

  if (stats.dominantPortfolioBottleneck) {
    insights.push(
      `Patrón inferido en la cartera: ${stats.dominantPortfolioBottleneck.label}. Aparece como fricción principal en ${stats.dominantPortfolioBottleneck.count} restaurante${stats.dominantPortfolioBottleneck.count === 1 ? "" : "s"} con IA activa.`,
    );
  }

  if (stats.restaurantsWithoutOrders > 0) {
    insights.push(`${stats.restaurantsWithoutOrders} restaurantes aún no han hecho su primer pedido. Necesitan onboarding o seguimiento comercial.`);
  }

  if (stats.demoRestaurantCount > 0) {
    insights.push(
      `${stats.demoRestaurantCount} demo${stats.demoRestaurantCount === 1 ? "" : "s"} activas y ${stats.demoReadyToConvertCount} listas para empujar conversion a plan completo.`,
    );
  }

  if (stats.dormantRestaurants > 0) {
    insights.push(`${stats.dormantRestaurants} restaurantes no registran actividad ${stats.periodResultsLabel}. Esto es una señal de posible churn, no una baja confirmada.`);
  }

  if (stats.trainedRestaurantCount > 0) {
    insights.push(
      `${stats.trainedRestaurantCount} locales ya operan con modelo adaptado y ${stats.highConfidenceModelCount} lo hacen con confianza alta.`,
    );
  }

  if (stats.expiredRestaurants === 0 && stats.soonToExpire === 0 && stats.restaurantsWithoutOrders === 0) {
    insights.push("La base está sana: ahora la oportunidad es empujar más frecuencia y más valoraciones de cliente.");
  }

  if (!insights.length) {
    insights.push("La cartera va estable. Aquí aparecerán señales cuando detectemos vencimientos, caída de uso o cuellos de botella.");
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
    empty.textContent = "No hay restaurantes que coincidan con esos filtros.";
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
    status.textContent = restaurant.status === "active" ? "Activo" : "Vencido";
    status.style.background = restaurant.status === "active" ? "rgba(31, 122, 99, 0.12)" : "rgba(127, 29, 29, 0.12)";
    status.style.color = restaurant.status === "active" ? "#1f7a63" : "#7f1d1d";
    syncRestaurantHealthPill(health, restaurant.healthSegment);
    demoBadge.hidden = !isDemoRestaurant(restaurant);
    demoBadge.textContent = isDemoRestaurant(restaurant) ? `DEMO ${demoUsage.usedOrders}/${demoUsage.maxOrders}` : "";
    grid.className = "admin-card__grid";
    brandFallback.className = "admin-card__brand-fallback";
    accountStack.className = "admin-card__account-stack";
    logoField.className = "field field--wide admin-card__logo-field";
    logoHint.className = "field__hint";
    logoPreview.className = "logo-upload-preview admin-card__logo-preview";
    notesSummary.className = "admin-card__notes";
    notesSummaryLabel.className = "admin-card__notes-label";
    title.textContent = restaurant.name;
    login.textContent = `Correo auth: ${restaurant.username}`;
    owner.textContent = `Responsable: ${restaurant.ownerName || "Sin definir"}`;
    contact.textContent = `Contacto: ${restaurant.email || "Sin correo"} · ${restaurant.phone || "Sin móvil"}`;
    address.textContent = `Dirección: ${restaurant.address || "Sin dirección"} · ${restaurant.city || "Sin ciudad"}`;
    activation.textContent = isDemoRestaurant(restaurant)
      ? `Demo activa hasta: ${formatAdminDate(restaurant.activatedUntil)} · ${demoUsage.remainingOrders} pedidos disponibles`
      : `Activado hasta: ${formatAdminDate(restaurant.activatedUntil)} · ${buildRemainingAccessLabel(restaurant)}`;
    orders.textContent =
      `Pedidos: ${restaurant.orderCount} · Activos: ${restaurant.activeOrderCount} · Entregados: ${restaurant.deliveredCount}`;
    usage.textContent = isDemoRestaurant(restaurant)
      ? restaurant.orderCount
        ? `Uso demo: ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos consumidos · Último movimiento ${formatAdminDate(restaurant.lastOrderAt)}`
        : `Uso demo: aún sin pedidos. Conviene guiar el primer flujo para que vea valor en menos de 10 minutos.`
      : restaurant.orderCount
        ? `Uso: ${restaurant.recent7dOrderCount} pedidos en 7 días · Último movimiento ${formatAdminDate(restaurant.lastOrderAt)}`
        : "Uso: todavía sin pedidos. Conviene activar el onboarding del local.";
    onboarding.textContent = isDemoRestaurant(restaurant)
      ? `Onboarding demo: ${restaurant.orderCount ? "ya esta probando el flujo real y la IA adaptativa." : "pendiente del primer pedido para disparar el momento wow."}`
      : `Onboarding: ${buildOnboardingSummary(restaurant)}`;
    notes.textContent = isDemoRestaurant(restaurant)
      ? restaurant.notes
        ? `Notas demo: ${restaurant.notes}`
        : "Notas demo: enfocada en enseñar pedidos, QR e IA adaptativa con limite comercial."
      : restaurant.notes
        ? `Notas: ${restaurant.notes}`
        : "Notas: sin observaciones";
    notesSummaryLabel.textContent = "Contexto";
    playbookLabel.textContent = "Siguiente paso";
    playbookText.textContent = isDemoRestaurant(restaurant)
      ? demoUsage.usedOrders >= demoUsage.maxOrders
        ? "Cerrar conversion al plan completo: ya probo valor y ha llegado al limite comercial."
        : demoUsage.usedOrders > 0
          ? "Acompanarlo hasta completar un ciclo y cerrar upgrade antes de que termine la demo."
          : "Lanzar primer pedido guiado para activar el momento wow en la primera sesion."
      : buildRestaurantPlaybook(restaurant);
    logoFieldLabel.textContent = "Logo del restaurante";
    logoHint.textContent = "Sube un logo cuadrado o rectangular. Lo optimizaremos para restaurante y cliente.";
    accessLabel.textContent = "Acceso:";
    accessValue.textContent = "Gestionado con enlace seguro";
    priorityAction.hidden = !isDemoRestaurant(restaurant);
    priorityActionLabel.textContent = "Acción prioritaria";
    priorityActionTitle.textContent = "Activar plan comercial";
    priorityActionText.textContent =
      demoUsage.usedOrders >= demoUsage.maxOrders
        ? "La cuenta ya alcanzó su límite actual. Conviene convertirla ahora para no frenar la operación."
        : "Esta cuenta ya está en fase de conversión. Lleva la activación al frente para que no se pierda entre acciones secundarias.";
    link.className = "qr-link";
    link.href = "#";
    link.textContent = "Abrir acceso restaurante";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.open("./restaurant.html", "_blank", "noopener,noreferrer");
    });
    logoInput.type = "file";
    logoInput.accept = "image/*";
    logoInput.addEventListener("change", async () => {
      const file = logoInput.files?.[0] || null;
      if (!file) return;

      logoInput.disabled = true;

      try {
        const logoUrl = await optimizeRestaurantLogo(file);
        updateRestaurantAccount(restaurant.id, { logoUrl });
        adminCreateFeedback.textContent = `Logo actualizado para ${restaurant.name}.`;
        adminCreateFeedback.className = "form-feedback form-feedback--success";
        adminCreateFeedback.hidden = false;
        showTurnoAlert(`Logo actualizado para ${restaurant.name}.`, "success");
        renderAdminWorkspace();
      } catch (error) {
        console.error("No se pudo actualizar el logo del restaurante.", error);
        const message =
          error instanceof Error ? error.message : "No se pudo actualizar el logo del restaurante.";
        adminCreateFeedback.textContent = message;
        adminCreateFeedback.className = "form-feedback form-feedback--error";
        adminCreateFeedback.hidden = false;
        showTurnoAlert(message, "error");
      } finally {
        logoInput.value = "";
        logoInput.disabled = false;
      }
    });
    templatesButton.type = "button";
    templatesButton.className = "comment-button";
    templatesButton.textContent = "Plantillas";
    templatesButton.disabled = !restaurant.email;
    templatesButton.addEventListener("click", async () => {
      await openEmailTemplatesModal(restaurant);
    });
    activatePlan.type = "button";
    activatePlan.className = "launcher admin-card__priority-button";
    activatePlan.textContent = "Activar plan";
    activatePlan.hidden = !isDemoRestaurant(restaurant);
    activatePlan.addEventListener("click", () => {
      openActivatePlanModal(restaurant);
    });
    renewPlan.type = "button";
    renewPlan.className = "comment-button";
    renewPlan.textContent = "Renovar plan";
    renewPlan.addEventListener("click", () => {
      openRenewPlanModal(restaurant);
    });
    remove.type = "button";
    remove.className = "comment-button admin-card__action-delete";
    remove.textContent = "Eliminar";
    remove.setAttribute("aria-label", `Eliminar restaurante ${restaurant.name}`);
    remove.addEventListener("click", () => {
      openDeleteModal(restaurant);
    });

    if (restaurant.logoUrl) {
      brandLogo.src = restaurant.logoUrl;
      brandLogo.alt = `Logo de ${restaurant.name}`;
      brandLogoWrap.append(brandLogo);
      logoPreviewImage.src = restaurant.logoUrl;
      logoPreviewImage.alt = `Vista previa del logo de ${restaurant.name}`;
      logoPreview.append(logoPreviewImage);
    } else {
      brandFallback.textContent = String(restaurant.name || "?").trim().charAt(0).toUpperCase() || "R";
      brandLogoWrap.append(brandFallback);
      logoPreview.hidden = true;
    }
    brandText.append(title, meta);
    brand.append(brandLogoWrap, brandText);
    meta.append(status, health, demoBadge);
    logoField.append(logoFieldLabel, logoInput, logoHint);
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

  element.textContent = meta.label;
  element.style.background = meta.background;
  element.style.color = meta.color;
}

function buildRestaurantPlaybook(restaurant) {
  if (restaurant.healthSegment === "renewal") {
    if (restaurant.status !== "active") {
      return "Renueva acceso y reenvía el enlace seguro antes de perder la cuenta.";
    }
    return "Activa recordatorio de renovación y deja cerrado el siguiente periodo comercial.";
  }

  if (restaurant.healthSegment === "onboarding") {
    if (restaurant.onboardingStage === "pendiente-logo") {
      return "Completa logo y personalización para que el local sienta el producto como propio.";
    }
    if (restaurant.onboardingStage === "pendiente-primer-pedido") {
      return "Agenda activación con el equipo y acompaña el primer pedido real en hora pico.";
    }
    if (restaurant.onboardingStage === "sin-ciclo-completo") {
      return "Empuja un ciclo completo hasta estado listo o entregado para crear hábito operativo.";
    }
    return "Pide feedback del cliente y úsalo como prueba de valor para la renovación.";
  }

  if (restaurant.healthSegment === "at-risk") {
    if (Number(restaurant.aiModelSummary?.sampleCount || 0) >= 8) {
      return "Reactiva el local antes de que pierda el valor acumulado de su IA y ofrécele seguimiento operativo.";
    }
    return "Revisa por qué cayó el uso y ofrece ayuda en mostrador o una reactivación con seguimiento.";
  }

  if (restaurant.healthSegment === "healthy" && Number(restaurant.aiModelSummary?.sampleCount || 0) >= 12) {
    const dominantStage = restaurant.aiModelSummary?.stageBaselines?.preparing >= restaurant.aiModelSummary?.stageBaselines?.received &&
      restaurant.aiModelSummary?.stageBaselines?.preparing >= restaurant.aiModelSummary?.stageBaselines?.ready
      ? "preparacion"
      : restaurant.aiModelSummary?.stageBaselines?.ready >= restaurant.aiModelSummary?.stageBaselines?.received
        ? "recogida"
        : "entrada a cocina";
    return `Usa este local como caso de exito: ya tiene una IA adaptada y suficiente histórico para demostrar valor. Cuello dominante aprendido: ${dominantStage}.`;
  }

  return "Mantén frecuencia, pide valoraciones y prepara upsell a más locales o más tiempo de plan.";
}

function getHealthSegmentPriority(segment) {
  if (segment === "renewal") return 0;
  if (segment === "onboarding") return 1;
  if (segment === "at-risk") return 2;
  if (segment === "healthy") return 3;
  return 4;
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
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatAdminDateTime(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatAdminDayLabel(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
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
  if (days === null) return "Sin vencimiento";
  if (days < 0) return "Acceso bloqueado";
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence en 1 día";
  return `Vence en ${days} días`;
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
      adminCreateFeedback.textContent = "No hay enlace seguro disponible para este restaurante.";
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
      adminCreateFeedback.textContent = "No se pudo generar el enlace seguro del restaurante.";
      adminCreateFeedback.className = "form-feedback form-feedback--error";
      adminCreateFeedback.hidden = false;
      showTurnoAlert("No se pudo generar el enlace seguro del restaurante.", "error");
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
  if (!restaurant?.email || !adminEmailTemplatesModal) return;
  pendingEmailTemplateRestaurantId = restaurant.id;
  activeEmailTemplateKey = "credentials";
  adminEmailTemplatesMeta.textContent = `${restaurant.name} · ${restaurant.email}`;
  adminEmailTemplatesModal.hidden = false;
  await renderEmailTemplateSelector(restaurant);
  await selectEmailTemplate(activeEmailTemplateKey);
}

async function renderEmailTemplateSelector(restaurant) {
  if (!adminEmailTemplateOptions) return;
  adminEmailTemplateOptions.innerHTML = "";

  getAdminEmailTemplateDefinitions(restaurant).forEach((template) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "email-template-switcher__button";
    button.textContent = template.label;
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
  renderTextWithClickableLinks(adminEmailTemplateBody, "Preparando plantilla...");
  adminEmailTemplateSubject.textContent = "-";
  adminEmailTemplateTo.textContent = restaurant.email || "-";

  const draft = await buildAdminEmailDraft(templateKey, restaurant);
  if (!draft) {
    activeEmailTemplateDraft = null;
    adminEmailTemplateSubject.textContent = "No disponible";
    renderTextWithClickableLinks(adminEmailTemplateBody, "No se pudo preparar esta plantilla.");
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
      part === "subject" ? "Asunto copiado." : part === "body" ? "Texto copiado." : "Correo completo copiado.",
      "success",
    );
  } catch (error) {
    console.error("No se pudo copiar la plantilla.", error);
    showTurnoAlert("No se pudo copiar el contenido.", "error");
  }
}

function openSelectedEmailTemplateInMailApp() {
  if (!activeEmailTemplateDraft?.href) return;
  window.location.href = activeEmailTemplateDraft.href;
}

function togglePasswordVisibility(input, button) {
  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.setAttribute("aria-label", shouldShow ? "Ocultar contraseña" : "Mostrar contraseña");
  button.classList.toggle("is-active", shouldShow);
}

function openDeleteModal(restaurant) {
  pendingDeleteRestaurantId = restaurant.id;
  pendingDeleteRestaurantName = restaurant.name;
  adminDeleteMeta.textContent = `${restaurant.name} · ${restaurant.email || "Sin correo"}`;
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
    adminActivatePlanMeta.textContent = `${restaurant.name} · ${restaurant.email || "Sin correo"}`;
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
    adminRenewPlanMeta.textContent = `${restaurant.name} · ${restaurant.email || "Sin correo"}`;
  }
  if (adminRenewPlanCurrentStatus) {
    const currentPlanLabel = String(restaurant.planName || "Sin plan").trim() || "Sin plan";
    const currentEndLabel = restaurant.activatedUntil ? formatAdminDate(restaurant.activatedUntil) : "Sin fecha";
    adminRenewPlanCurrentStatus.textContent = `Estado actual: ${currentPlanLabel} · Vigente hasta ${currentEndLabel}.`;
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
  adminCreateFeedback.textContent = `Se eliminó ${pendingDeleteRestaurantName}.`;
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

  adminCreateFeedback.textContent = `${pendingActivatePlanRestaurantName} pasó de demo a plan ${selectedPlan}.`;
  adminCreateFeedback.className = "form-feedback form-feedback--success";
  adminCreateFeedback.hidden = false;
  showTurnoAlert(`${pendingActivatePlanRestaurantName} activado en plan ${selectedPlan}.`, "success");
  closeActivatePlanModal();
  renderAdminWorkspace();
}

function confirmRenewRestaurantPlan() {
  if (!pendingRenewPlanRestaurantId) return;
  const selectedPlan = adminRenewPlanSelect?.value || "Mensual";
  const updatedRestaurant = renewRestaurantPlan(pendingRenewPlanRestaurantId, selectedPlan);
  if (!updatedRestaurant) return;

  adminCreateFeedback.textContent = `${pendingRenewPlanRestaurantName} quedó renovado en plan ${selectedPlan} hasta ${formatAdminDate(updatedRestaurant.activatedUntil)}.`;
  adminCreateFeedback.className = "form-feedback form-feedback--success";
  adminCreateFeedback.hidden = false;
  showTurnoAlert(`${pendingRenewPlanRestaurantName} renovado en plan ${selectedPlan} hasta ${formatAdminDate(updatedRestaurant.activatedUntil)}.`, "success");
  closeRenewPlanModal();
  renderAdminWorkspace();
}
