const adminProfileForm = document.querySelector("#adminProfileForm");
const adminProfileAvatarInput = document.querySelector("#adminProfileAvatarInput");
const adminProfileAvatarFilename = document.querySelector("#adminProfileAvatarFilename");
const adminProfileAvatarPreview = document.querySelector("#adminProfileAvatarPreview");
const adminProfileAvatarPreviewImage = document.querySelector("#adminProfileAvatarPreviewImage");
const adminProfileDisplayName = document.querySelector("#adminProfileDisplayName");
const adminProfileEmail = document.querySelector("#adminProfileEmail");
const adminProfilePhone = document.querySelector("#adminProfilePhone");
const adminProfilePhoneField = document.querySelector("#adminProfilePhoneField");
const adminProfilePhoneCountryTrigger = document.querySelector("#adminProfilePhoneCountryTrigger");
const adminProfilePhoneCountryPanel = document.querySelector("#adminProfilePhoneCountryPanel");
const adminProfilePhoneCountryFlag = document.querySelector("#adminProfilePhoneCountryFlag");
const adminProfilePhoneCountryDial = document.querySelector("#adminProfilePhoneCountryDial");
const adminProfilePhoneCountryName = document.querySelector("#adminProfilePhoneCountryName");
const adminProfilePhoneCountrySearch = document.querySelector("#adminProfilePhoneCountrySearch");
const adminProfilePhoneCountryList = document.querySelector("#adminProfilePhoneCountryList");
const adminProfilePhoneLocal = document.querySelector("#adminProfilePhoneLocal");
const adminProfilePhoneHint = document.querySelector("#adminProfilePhoneHint");
const adminProfilePhoneError = document.querySelector("#adminProfilePhoneError");
const adminProfileTitle = document.querySelector("#adminProfileTitle");
const adminProfileCreatedAt = document.querySelector("#adminProfileCreatedAt");
const adminProfileUpdatedAt = document.querySelector("#adminProfileUpdatedAt");
const adminProfileResetButton = document.querySelector("#adminProfileResetButton");
const adminProfileFeedback = document.querySelector("#adminProfileFeedback");
const adminProfileSummaryAvatarImage = document.querySelector("#adminProfileSummaryAvatarImage");
const adminProfileSummaryAvatarFallback = document.querySelector("#adminProfileSummaryAvatarFallback");
const adminProfileSummaryName = document.querySelector("#adminProfileSummaryName");
const adminProfileSummaryTitle = document.querySelector("#adminProfileSummaryTitle");
const adminCreateAdminForm = document.querySelector("#adminCreateAdminForm");
const adminCreateAdminFeedback = document.querySelector("#adminCreateAdminFeedback");
const adminCreateAdminPhoneFull = document.querySelector("#adminCreateAdminPhoneFull");
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
const adminUserTemplatesModal = document.querySelector("#adminUserTemplatesModal");
const adminUserTemplatesBackdrop = document.querySelector("#adminUserTemplatesBackdrop");
const adminUserTemplatesClose = document.querySelector("#adminUserTemplatesClose");
const adminUserTemplatesMeta = document.querySelector("#adminUserTemplatesMeta");
const adminUserTemplateOptions = document.querySelector("#adminUserTemplateOptions");
const adminUserTemplateTo = document.querySelector("#adminUserTemplateTo");
const adminUserTemplateSubject = document.querySelector("#adminUserTemplateSubject");
const adminUserTemplateBody = document.querySelector("#adminUserTemplateBody");
const adminUserCopySubject = document.querySelector("#adminUserCopySubject");
const adminUserCopyBody = document.querySelector("#adminUserCopyBody");
const adminUserCopyAll = document.querySelector("#adminUserCopyAll");
const adminUserOpenMail = document.querySelector("#adminUserOpenMail");
const adminMessagesShortcut = document.querySelector("#adminMessagesShortcut");
const adminUnreadMessagesBadge = document.querySelector("#adminUnreadMessagesBadge");
const adminAccountButton = document.querySelector("#adminAccountButton");
const adminAccountPanel = document.querySelector("#adminAccountPanel");
const adminAccountAvatarImage = document.querySelector("#adminAccountAvatarImage");
const adminAccountAvatarFallback = document.querySelector("#adminAccountAvatarFallback");
const adminAccountName = document.querySelector("#adminAccountName");
const adminAccountMeta = document.querySelector("#adminAccountMeta");
const adminMenuLogout = document.querySelector("#adminMenuLogout");

let selectedAdminAvatarUrl = "";
let adminUsers = [];
let adminMessagesUnsubscribe = null;
let adminProfileSnapshot = null;
let pendingAdminUserTemplateId = null;
let activeAdminUserTemplateKey = "access";
let activeAdminUserTemplateDraft = null;
const SHARED_DEFAULT_PHONE_COUNTRY_ISO = window.TurnoListoPhoneFields?.defaultCountryIso || "ES";
const translateText = (value) =>
  window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
const translateKey = (key, fallback = "") =>
  window.TurnoListoI18n?.translateKey ? window.TurnoListoI18n.translateKey(key, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const formatKey = (key, params = {}, fallback = "") =>
  window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const setDynamicRuntimeAttribute = window.TurnoListoDom?.setDynamicAttribute;
const adminProfilePhoneController = window.TurnoListoPhoneFields?.create({
  elements: {
    field: adminProfilePhoneField,
    countryTrigger: adminProfilePhoneCountryTrigger,
    countryPanel: adminProfilePhoneCountryPanel,
    countryFlag: adminProfilePhoneCountryFlag,
    countryDial: adminProfilePhoneCountryDial,
    countryName: adminProfilePhoneCountryName,
    countrySearch: adminProfilePhoneCountrySearch,
    countryList: adminProfilePhoneCountryList,
    localInput: adminProfilePhoneLocal,
    hiddenInput: adminProfilePhone,
    hintElement: adminProfilePhoneHint,
    errorElement: adminProfilePhoneError,
  },
  translateText,
  translateKey,
  formatKey,
  isRequired: () => false,
});
const createAdminPhoneController = window.TurnoListoPhoneFields?.create({
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
    hiddenInput: adminCreateAdminPhoneFull,
    hintElement: adminCreateAdminPhoneHint,
    errorElement: adminCreateAdminPhoneError,
  },
  translateText,
  translateKey,
  formatKey,
  isRequired: () => false,
});

initializeAdminProfilePage();

function initializeAdminProfilePage() {
  adminProfileForm?.addEventListener("submit", handleAdminProfileSubmit);
  adminProfileAvatarInput?.addEventListener("change", handleAdminAvatarSelection);
  adminCreateAdminForm?.addEventListener("submit", handleCreateAdminAccount);
  adminProfileResetButton?.addEventListener("click", restoreAdminProfileSnapshot);
  adminMessagesShortcut?.addEventListener("click", () => {
    window.location.href = "./admin.html#messages";
  });
  adminUserTemplatesBackdrop?.addEventListener("click", closeAdminUserTemplatesModal);
  adminUserTemplatesClose?.addEventListener("click", closeAdminUserTemplatesModal);
  adminUserCopySubject?.addEventListener("click", () => copyAdminUserTemplatePart("subject"));
  adminUserCopyBody?.addEventListener("click", () => copyAdminUserTemplatePart("body"));
  adminUserCopyAll?.addEventListener("click", () => copyAdminUserTemplatePart("all"));
  adminUserOpenMail?.addEventListener("click", openSelectedAdminUserTemplateInMailApp);
  adminAccountButton?.addEventListener("click", toggleAdminAccountMenu);
  adminMenuLogout?.addEventListener("click", async () => {
    closeAdminAccountMenu();
    await handleAdminLogout();
  });
  window.addEventListener("click", handleAdminAccountOutsideClick);
  window.addEventListener("turnolisto:language-change", () => {
    adminProfilePhoneController?.refreshLanguage();
    createAdminPhoneController?.refreshLanguage();
  });
  waitForDataReady().then(() => {
    initializeAdminProfilePhoneField();
    initializeCreateAdminPhoneField();
    initializeAdminProfileAuth();
  });
}

function resetAdminProfileAvatarFilename() {
  if (!adminProfileAvatarFilename) return;
  adminProfileAvatarFilename.setAttribute("data-i18n-key", "profile.file.empty");
  adminProfileAvatarFilename.textContent = "Ningún archivo seleccionado";
  if (window.TurnoListoI18n?.translateDocument) {
    window.TurnoListoI18n.translateDocument(window.TurnoListoI18n.getLanguage?.());
  }
}

function setAdminProfileAvatarFilename(file) {
  if (!adminProfileAvatarFilename) return;
  const safeName = String(file?.name || "").trim();
  if (!safeName) {
    resetAdminProfileAvatarFilename();
    return;
  }
  adminProfileAvatarFilename.removeAttribute("data-i18n-key");
  adminProfileAvatarFilename.textContent = safeName;
}

function initializeAdminProfileAuth() {
  waitForFirebaseBackend().then((backend) => {
    if (!backend?.enabled || typeof backend.onAuthStateChanged !== "function") {
      window.location.href = "./admin.html";
      return;
    }

    backend.onAuthStateChanged(async (user) => {
      if (!user?.uid) {
        redirectToAdmin();
        return;
      }

      await reconnectDataStoreToFirebase();
      const storedProfile = await loadCurrentUserProfileFromBackend();
      if (storedProfile?.role !== "admin") {
        redirectToAdmin();
        return;
      }

      const currentProfile = await completeCurrentAdminInitialAccessIfPending(storedProfile);
      const profile = buildAdminProfileViewModel(currentProfile, user);

      initializeAdminInbox();
      renderAdminAccount(profile);
      renderAdminProfile(profile);
      await refreshAdminUsers();
    });
  });
}

function redirectToAdmin() {
  window.location.href = "./admin.html";
}

function renderAdminProfile(profile) {
  adminProfileSnapshot = {
    displayName: profile.displayName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    title: profile.title || "",
    avatarUrl: profile.avatarUrl || "",
    createdAt: profile.createdAt || "",
    updatedAt: profile.updatedAt || "",
  };
  adminProfileDisplayName.value = adminProfileSnapshot.displayName;
  setDynamicRuntimeAttribute(adminProfileEmail, "value", adminProfileSnapshot.email);
  applyAdminProfilePhoneValue(adminProfileSnapshot.phone);
  adminProfileTitle.value = adminProfileSnapshot.title;
  setDynamicRuntimeAttribute(adminProfileCreatedAt, "value", formatProfileDateTime(adminProfileSnapshot.createdAt));
  setDynamicRuntimeAttribute(adminProfileUpdatedAt, "value", formatProfileDateTime(adminProfileSnapshot.updatedAt));
  syncAdminAvatarPreview(selectedAdminAvatarUrl || adminProfileSnapshot.avatarUrl);
  if (!selectedAdminAvatarUrl) resetAdminProfileAvatarFilename();
  renderAdminProfileSummary(profile);
}

function initializeAdminProfilePhoneField() {
  return adminProfilePhoneController?.initialize();
}

function applyAdminProfilePhoneValue(value) {
  return adminProfilePhoneController?.setValue(value);
}

function validateAdminProfilePhoneNumber(options = {}) {
  return adminProfilePhoneController?.validate(options) || { valid: true, phone: "", message: "" };
}

function validateCreateAdminPhoneNumber(options = {}) {
  return createAdminPhoneController?.validate(options) || { valid: true, phone: "", message: "" };
}

function resetCreateAdminPhoneField() {
  return createAdminPhoneController?.reset();
}

function initializeCreateAdminPhoneField() {
  return createAdminPhoneController?.initialize();
}

function buildAdminProfileViewModel(profile, user) {
  const authEmail = String(user?.email || "").trim();
  const authDisplayName = String(user?.displayName || "").trim();
  const authAvatarUrl = String(user?.photoURL || "").trim();
  const authCreatedAt = normalizeProfileDateValue(user?.metadata?.creationTime);
  const authUpdatedAt = normalizeProfileDateValue(user?.metadata?.lastSignInTime);

  return {
    ...profile,
    email: String(profile?.email || authEmail).trim(),
    displayName: String(profile?.displayName || authDisplayName || authEmail || "").trim(),
    avatarUrl: String(profile?.avatarUrl || authAvatarUrl).trim(),
    phone: String(profile?.phone || "").trim(),
    title: String(profile?.title || "").trim(),
    createdAt: normalizeProfileDateValue(profile?.createdAt) || authCreatedAt || "",
    updatedAt: normalizeProfileDateValue(profile?.updatedAt) || authUpdatedAt || "",
  };
}

function normalizeProfileDateValue(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value || "").trim();
  }

  return parsed.toISOString();
}

function renderAdminAccount(profile) {
  const displayName = String(profile?.displayName || profile?.email || "").trim();
  const title = String(profile?.title || "").trim();
  const avatarUrl = String(profile?.avatarUrl || "").trim();
  adminAccountName.textContent = displayName || "Sin datos cargados";
  adminAccountMeta.textContent = displayName ? (title ? `${title} · Acceso verificado` : "Acceso verificado") : "Cuenta no cargada";
  adminAccountAvatarFallback.textContent = displayName.charAt(0).toUpperCase() || "?";

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

function renderAdminProfileSummary(profile) {
  const displayName = String(profile?.displayName || profile?.email || "").trim();
  const title = String(profile?.title || "").trim();
  const avatarUrl = String(selectedAdminAvatarUrl || profile?.avatarUrl || "").trim();
  adminProfileSummaryName.textContent = displayName || "Sin datos cargados";
  adminProfileSummaryTitle.textContent = displayName ? title || "Acceso verificado" : "Cuenta no cargada";
  adminProfileSummaryAvatarFallback.textContent = displayName.charAt(0).toUpperCase() || "?";

  if (avatarUrl) {
    adminProfileSummaryAvatarImage.src = avatarUrl;
    adminProfileSummaryAvatarImage.hidden = false;
    adminProfileSummaryAvatarFallback.hidden = true;
  } else {
    adminProfileSummaryAvatarImage.hidden = true;
    adminProfileSummaryAvatarImage.removeAttribute("src");
    adminProfileSummaryAvatarFallback.hidden = false;
  }
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
    resetAdminProfileAvatarFilename();
    syncAdminAvatarPreview(getCurrentUserProfile()?.avatarUrl || "");
    return;
  }

  try {
    setAdminProfileAvatarFilename(file);
    selectedAdminAvatarUrl = await optimizeAccountImage(file);
    syncAdminAvatarPreview(selectedAdminAvatarUrl);
    renderAdminProfileSummary({
      displayName: adminProfileDisplayName?.value || adminProfileSnapshot?.displayName || "",
      email: adminProfileEmail?.value || adminProfileSnapshot?.email || "",
      title: adminProfileTitle?.value || adminProfileSnapshot?.title || "",
      avatarUrl: selectedAdminAvatarUrl,
    });
    adminProfileFeedback.hidden = true;
    adminProfileFeedback.textContent = "";
  } catch (error) {
    resetAdminProfileAvatarFilename();
    const message = error instanceof Error ? error.message : "No se pudo preparar la foto del administrador.";
    adminProfileFeedback.textContent = message;
    adminProfileFeedback.className = "form-feedback form-feedback--error";
    adminProfileFeedback.hidden = false;
    showTurnoAlert(message, "error");
  }
}

async function handleAdminProfileSubmit(event) {
  event.preventDefault();
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.updateCurrentAdminProfile !== "function") {
    adminProfileFeedback.textContent = "No se pudo guardar el perfil administrador en esta configuración.";
    adminProfileFeedback.className = "form-feedback form-feedback--error";
    adminProfileFeedback.hidden = false;
    return;
  }

  try {
    const phoneValidation = validateAdminProfilePhoneNumber({ report: true });
    if (!phoneValidation.valid) {
      adminProfilePhoneLocal?.focus();
      showTurnoAlert(phoneValidation.message, "error");
      return;
    }
    const submitButton = adminProfileForm?.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    await backend.updateCurrentAdminProfile({
      displayName: adminProfileDisplayName?.value || "",
      phone: phoneValidation.phone,
      title: adminProfileTitle?.value || "",
      avatarUrl: selectedAdminAvatarUrl || getCurrentUserProfile()?.avatarUrl || "",
    });
    const storedProfile = await loadCurrentUserProfileFromBackend();
    const nextProfile = buildAdminProfileViewModel(storedProfile, backend.getCurrentUser?.() || null);
    selectedAdminAvatarUrl = "";
    if (adminProfileAvatarInput) {
      adminProfileAvatarInput.value = "";
    }
    resetAdminProfileAvatarFilename();
    adminProfileFeedback.textContent = "Perfil administrador actualizado correctamente.";
    adminProfileFeedback.className = "form-feedback form-feedback--success";
    adminProfileFeedback.hidden = false;
    renderAdminAccount(nextProfile);
    renderAdminProfile(nextProfile);
    await refreshAdminUsers();
  } catch (error) {
    console.error("No se pudo actualizar el perfil admin.", error);
    const message =
      String(error?.message || "").trim() ||
      "No se pudo guardar el perfil administrador.";
    adminProfileFeedback.textContent = message;
    adminProfileFeedback.className = "form-feedback form-feedback--error";
    adminProfileFeedback.hidden = false;
    showTurnoAlert(message, "error");
  } finally {
    const submitButton = adminProfileForm?.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = false;
  }
}

function restoreAdminProfileSnapshot() {
  if (!adminProfileSnapshot) return;
  selectedAdminAvatarUrl = "";
  adminProfileDisplayName.value = adminProfileSnapshot.displayName;
  setDynamicRuntimeAttribute(adminProfileEmail, "value", adminProfileSnapshot.email);
  applyAdminProfilePhoneValue(adminProfileSnapshot.phone);
  adminProfileTitle.value = adminProfileSnapshot.title;
  setDynamicRuntimeAttribute(adminProfileCreatedAt, "value", formatProfileDateTime(adminProfileSnapshot.createdAt));
  setDynamicRuntimeAttribute(adminProfileUpdatedAt, "value", formatProfileDateTime(adminProfileSnapshot.updatedAt));
  syncAdminAvatarPreview(adminProfileSnapshot.avatarUrl);
  renderAdminProfileSummary(adminProfileSnapshot);
  if (adminProfileAvatarInput) {
    adminProfileAvatarInput.value = "";
  }
  resetAdminProfileAvatarFilename();
  adminProfileFeedback.hidden = true;
  adminProfileFeedback.textContent = "";
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
    const phoneValidation = validateCreateAdminPhoneNumber({ report: true });
    if (!phoneValidation.valid) {
      adminCreateAdminPhoneLocal?.focus();
      showTurnoAlert(phoneValidation.message, "error");
      return;
    }
    const result = await backend.createAdminAccount({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      phone: phoneValidation.phone,
      country: phoneValidation.countryName,
      phoneCountry: phoneValidation.phoneCountry,
      title: formData.get("title"),
      appUrl: buildAdminAccessUrl(),
    });
    adminCreateAdminForm.reset();
    resetCreateAdminPhoneField();
    adminCreateAdminFeedback.textContent = result?.accessLink
      ? "Administrador creado. Se generó un enlace seguro para definir contraseña."
      : "Administrador creado correctamente.";
    adminCreateAdminFeedback.className = "form-feedback form-feedback--success";
    adminCreateAdminFeedback.hidden = false;
    await refreshAdminUsers();
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
    const authUser = backend.getCurrentUser?.() || null;
    const currentProfile = buildAdminProfileViewModel(getCurrentUserProfile() || {}, authUser);
    const users = await backend.loadCollection("users");
    adminUsers = (Array.isArray(users) ? users : [])
      .filter((user) => String(user?.role || "").trim() === "admin")
      .map((user) => normalizeAdminDirectoryUser(user, currentProfile, authUser))
      .sort((left, right) =>
        String(left.displayName || left.email || "").localeCompare(String(right.displayName || right.email || ""), "es"),
      );
    renderAdminUsersList();
  } catch (error) {
    console.error("No se pudo cargar el equipo admin.", error);
    adminUsers = [];
    renderAdminUsersList("No se pudo cargar el equipo administrador por ahora.");
  }
}

function normalizeAdminDirectoryUser(user, currentProfile, authUser) {
  const candidate = user && typeof user === "object" ? { ...user } : {};
  const candidateId = String(candidate.id || candidate.uid || candidate.authUid || "").trim();
  const authUid = String(authUser?.uid || "").trim();
  if (candidateId && authUid && candidateId === authUid) {
    return {
      ...candidate,
      ...currentProfile,
      id: candidateId,
      role: "admin",
    };
  }

  return candidate;
}

function renderAdminUsersList(customEmptyMessage = "Aquí verás el equipo administrador con acceso activo.") {
  if (!adminUsersList) return;
  adminUsersList.innerHTML = "";

  if (!adminUsers.length) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight";
    empty.textContent = customEmptyMessage;
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
    const actions = document.createElement("div");
    const templatesButton = document.createElement("button");

    card.className = "admin-user-card";
    top.className = "admin-user-card__top";
    identity.className = "admin-user-card__identity";
    avatar.className = "admin-user-card__avatar";
    actions.className = "admin-user-card__actions";
    avatarFallback.textContent = String(user.displayName || user.email || "?").trim().charAt(0).toUpperCase() || "?";
    name.textContent = user.displayName || user.email || "Sin datos cargados";
    meta.textContent = [user.title || "No disponible", user.email || "Sin correo", user.phone || "Sin teléfono"].join(" · ");

    const avatarUrl = String(user.avatarUrl || "").trim();
    if (avatarUrl) {
      avatarImage.src = avatarUrl;
      avatarImage.alt = `Avatar de ${name.textContent}`;
      avatar.append(avatarImage);
    } else {
      avatar.append(avatarFallback);
    }

    templatesButton.type = "button";
    templatesButton.className = "comment-button";
    templatesButton.textContent = "Plantillas";
    templatesButton.disabled = !String(user.email || "").trim();
    templatesButton.addEventListener("click", async () => {
      await openAdminUserTemplatesModal(user);
    });

    identity.append(name, meta);
    top.append(avatar, identity);
    actions.append(templatesButton);
    card.append(top, actions);
    adminUsersList.append(card);
  });
}

function buildAdminAccessUrl() {
  return new URL("./admin.html", window.location.href).toString();
}

function getAdminUserById(userId) {
  const normalizedId = String(userId || "").trim();
  if (!normalizedId) return null;
  return adminUsers.find((user) => String(user?.id || user?.uid || "").trim() === normalizedId) || null;
}

async function ensureAdminAccessLinkForEmail(user) {
  const adminUser = user && typeof user === "object" ? { ...user } : null;
  if (!adminUser?.email || !adminUser?.id) {
    return adminUser;
  }

  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.createAdminAccessLink !== "function") {
    return {
      ...adminUser,
      accessLink: "",
      accessLinkAvailable: false,
      accessLinkReason: "unavailable",
    };
  }

  try {
    const result = await backend.createAdminAccessLink({
      adminUserId: adminUser.id,
      appUrl: buildAdminAccessUrl(),
    });

    return {
      ...adminUser,
      accessLink: String(result?.accessLink || "").trim(),
      accessLinkAvailable: result?.available === true,
      accessLinkReason: String(result?.reason || "").trim(),
    };
  } catch (error) {
    console.error("No se pudo preparar el enlace de acceso del administrador.", error);
    return {
      ...adminUser,
      accessLink: "",
      accessLinkAvailable: false,
      accessLinkReason: "error",
    };
  }
}

function getAdminUserEmailTemplateDefinitions(user) {
  return [
    { key: "access", label: "Acceso" },
    { key: "onboarding", label: "Onboarding" },
  ];
}

async function buildAdminUserAccessEmail(user, options = {}) {
  const emailAdminUser = await ensureAdminAccessLinkForEmail(user);
  const accessUrl = String(options.accessUrl || "./admin.html").trim() || "./admin.html";
  const recipientName = String(emailAdminUser?.displayName || emailAdminUser?.email || "equipo admin").trim();
  const accessLink =
    emailAdminUser?.accessLink ||
    "Este administrador ya gestiona su acceso sin reenviar enlaces desde plantillas internas.";
  const subject = `Acceso admin TurnoListo - ${recipientName}`;
  const body = [
    `Hola ${recipientName},`,
    "",
    "Te compartimos los datos base para entrar al panel administrador de TurnoListo.",
    "",
    `Correo de acceso: ${emailAdminUser?.email || "Sin correo"}`,
    `Panel administrador: ${accessUrl}`,
    "",
    emailAdminUser?.accessLinkAvailable
      ? "Define tu contrasena desde este enlace seguro:"
      : "Estado del acceso inicial:",
    accessLink,
    "",
    emailAdminUser?.accessLinkReason === "oldest-admin"
      ? "Esta cuenta conserva su gestion de acceso sin reenviar enlaces internos."
      : emailAdminUser?.accessLinkReason === "initial-access-completed"
        ? "Este administrador ya completó su acceso inicial y debe gestionar su cuenta desde su propia sesión."
        : "La contrasena se gestiona solo desde tu propia cuenta.",
    "",
    "Si necesitas soporte con tu acceso, responde a este mensaje y coordinamos el siguiente paso contigo.",
  ].join("\n");

  return {
    to: emailAdminUser?.email || "",
    subject,
    body,
    href: `mailto:${encodeURIComponent(emailAdminUser?.email || "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

function buildAdminUserOnboardingEmail(user, options = {}) {
  const accessUrl = String(options.accessUrl || "./admin.html").trim() || "./admin.html";
  const recipientName = String(user?.displayName || user?.email || "equipo admin").trim();
  const subject = `Onboarding admin TurnoListo - ${recipientName}`;
  const body = [
    `Hola ${recipientName},`,
    "",
    "Te damos la bienvenida al panel administrador de TurnoListo.",
    "",
    "Primeros pasos recomendados:",
    `1. Entra al panel administrador: ${accessUrl}`,
    `2. Verifica que tu correo de acceso sea ${user.email || "el correo asignado"}`,
    "3. Revisa cartera, mensajes y equipo administrador para ubicarte rapido en la operacion.",
    "",
    "La contrasena se gestiona solo desde tu propia cuenta.",
    "Si necesitas ayuda para recuperar el acceso, responde a este correo y te ayudamos sin exponer credenciales.",
  ].join("\n");

  return {
    to: user.email || "",
    subject,
    body,
    href: `mailto:${encodeURIComponent(user.email || "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

async function buildAdminUserEmailDraft(kind, user) {
  if (!user?.email) return null;
  const accessUrl = buildAdminAccessUrl();

  if (kind === "access") {
    return buildAdminUserAccessEmail(user, { accessUrl });
  }

  if (kind === "onboarding") {
    return buildAdminUserOnboardingEmail(user, { accessUrl });
  }

  return null;
}

async function openAdminUserTemplatesModal(user) {
  return openAdminUserTemplatesModalWithOptions(user, { preserveSelection: false });
}

async function openAdminUserTemplatesModalWithOptions(user, options = {}) {
  if (!user?.email || !adminUserTemplatesModal) return;
  const preserveSelection = Boolean(options.preserveSelection);
  pendingAdminUserTemplateId = String(user.id || user.uid || "").trim();
  if (!preserveSelection || !activeAdminUserTemplateKey) {
    activeAdminUserTemplateKey = "access";
  }
  adminUserTemplatesMeta.textContent = `${user.displayName || user.email} · ${user.email}`;
  adminUserTemplatesModal.hidden = false;
  renderAdminUserTemplateSelector(user);
  await selectAdminUserTemplate(activeAdminUserTemplateKey);
}

function renderAdminUserTemplateSelector(user) {
  if (!adminUserTemplateOptions) return;
  adminUserTemplateOptions.innerHTML = "";

  getAdminUserEmailTemplateDefinitions(user).forEach((template) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "email-template-switcher__button";
    button.textContent = template.label;
    button.dataset.templateKey = template.key;
    button.addEventListener("click", async () => {
      await selectAdminUserTemplate(template.key);
    });
    adminUserTemplateOptions.append(button);
  });
}

async function selectAdminUserTemplate(templateKey) {
  const user = pendingAdminUserTemplateId ? getAdminUserById(pendingAdminUserTemplateId) : null;
  if (!user) return;
  activeAdminUserTemplateKey = templateKey;
  renderTextWithClickableLinks(adminUserTemplateBody, "Preparando plantilla...");
  adminUserTemplateSubject.textContent = "-";
  adminUserTemplateTo.textContent = user.email || "-";

  const draft = await buildAdminUserEmailDraft(templateKey, user);
  if (!draft) {
    activeAdminUserTemplateDraft = null;
    adminUserTemplateSubject.textContent = "No disponible";
    renderTextWithClickableLinks(adminUserTemplateBody, "No se pudo preparar esta plantilla.");
  } else {
    activeAdminUserTemplateDraft = draft;
    adminUserTemplateTo.textContent = draft.to || user.email || "-";
    adminUserTemplateSubject.textContent = draft.subject || "-";
    renderTextWithClickableLinks(adminUserTemplateBody, draft.body || "");
  }

  adminUserTemplateOptions?.querySelectorAll(".email-template-switcher__button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.templateKey === templateKey);
  });
}

function closeAdminUserTemplatesModal() {
  if (!adminUserTemplatesModal) return;
  adminUserTemplatesModal.hidden = true;
  pendingAdminUserTemplateId = null;
  activeAdminUserTemplateDraft = null;
  activeAdminUserTemplateKey = "access";
}

async function copyAdminUserTemplatePart(part) {
  if (!activeAdminUserTemplateDraft) return;
  const text =
    part === "subject"
      ? activeAdminUserTemplateDraft.subject
      : part === "body"
        ? activeAdminUserTemplateDraft.body
        : `Para: ${activeAdminUserTemplateDraft.to}\nAsunto: ${activeAdminUserTemplateDraft.subject}\n\n${activeAdminUserTemplateDraft.body}`;
  try {
    await navigator.clipboard.writeText(text);
    showTurnoAlert(
      part === "subject"
        ? "Asunto copiado."
        : part === "body"
          ? "Texto copiado."
          : "Correo completo copiado.",
      "success",
    );
  } catch (error) {
    console.error("No se pudo copiar la plantilla del admin.", error);
    showTurnoAlert("No se pudo copiar el contenido.", "error");
  }
}

function openSelectedAdminUserTemplateInMailApp() {
  if (!activeAdminUserTemplateDraft?.href) return;
  window.location.href = activeAdminUserTemplateDraft.href;
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

  element.replaceChildren(fragment);
}

function formatProfileDateTime(value) {
  if (!value) return "No disponible";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function navigateToAdminSection(section) {
  closeAdminAccountMenu();
  const nextHash = section === "dashboard" ? "" : `#${section}`;
  window.location.href = `./admin.html${nextHash}`;
}

async function initializeAdminInbox() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.loadCollection !== "function") return;

  adminMessagesUnsubscribe?.();
  adminMessagesUnsubscribe = null;

  try {
    const inquiries = await backend.loadCollection("contactInquiries");
    updateAdminInboxBadge(inquiries);
    if (typeof backend.subscribeCollection === "function") {
      adminMessagesUnsubscribe = backend.subscribeCollection("contactInquiries", (items) => {
        updateAdminInboxBadge(items);
      });
    }
  } catch (error) {
    console.error("No se pudo cargar el contador de mensajes.", error);
  }
}

function updateAdminInboxBadge(items) {
  if (!adminUnreadMessagesBadge) return;
  const unreadCount = (Array.isArray(items) ? items : []).filter(
    (item) => !(item?.isRead === true || String(item?.status || "").trim().toLowerCase() === "read"),
  ).length;
  adminUnreadMessagesBadge.textContent = String(unreadCount);
  adminUnreadMessagesBadge.hidden = unreadCount <= 0;
}

async function handleAdminLogout() {
  adminMessagesUnsubscribe?.();
  adminMessagesUnsubscribe = null;
  const backend = await waitForFirebaseBackend();
  preparePrivateFirebaseSignOut();
  clearCurrentUserProfile();
  if (backend?.enabled && typeof backend.signOut === "function") {
    await backend.signOut();
  }
  redirectToAdmin();
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
