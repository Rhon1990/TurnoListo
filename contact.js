const contactForm = document.querySelector("#contactForm");
const contactFeedback = document.querySelector("#contactFormFeedback");
const contactSubmitButton = document.querySelector("#contactSubmitButton");
const contactName = document.querySelector("#contactName");
const contactCompany = document.querySelector("#contactCompany");
const contactEmail = document.querySelector("#contactEmail");
const contactPhone = document.querySelector("#contactPhone");
const contactPhoneField = document.querySelector("#contactPhoneField");
const contactPhoneCountryTrigger = document.querySelector("#contactPhoneCountryTrigger");
const contactPhoneCountryPanel = document.querySelector("#contactPhoneCountryPanel");
const contactPhoneCountryFlag = document.querySelector("#contactPhoneCountryFlag");
const contactPhoneCountryDial = document.querySelector("#contactPhoneCountryDial");
const contactPhoneCountryName = document.querySelector("#contactPhoneCountryName");
const contactPhoneCountrySearch = document.querySelector("#contactPhoneCountrySearch");
const contactPhoneCountryList = document.querySelector("#contactPhoneCountryList");
const contactPhoneLocal = document.querySelector("#contactPhoneLocal");
const contactPhoneHint = document.querySelector("#contactPhoneHint");
const contactPhoneError = document.querySelector("#contactPhoneError");
const contactInterest = document.querySelector("#contactInterest");
const contactMessage = document.querySelector("#contactMessage");
const restaurantAccountButton = document.querySelector("#restaurantAccountButton");
const restaurantAccountPanel = document.querySelector("#restaurantAccountPanel");
const restaurantAccountAvatarImage = document.querySelector("#restaurantAccountAvatarImage");
const restaurantAccountAvatarFallback = document.querySelector("#restaurantAccountAvatarFallback");
const restaurantAccountName = document.querySelector("#restaurantAccountName");
const restaurantAccountMeta = document.querySelector("#restaurantAccountMeta");
const restaurantMenuLogout = document.querySelector("#restaurantMenuLogout");
const RESTAURANT_STORAGE_KEY = "turnolisto-restaurants-v1";
const RESTAURANT_SESSION_KEY = "turnolisto-restaurant-session-v1";
const SHARED_PHONE_COUNTRIES = window.TurnoListoPhoneFields?.countries || [];
const SHARED_DEFAULT_PHONE_COUNTRY_ISO = window.TurnoListoPhoneFields?.defaultCountryIso || "ES";
const translateText = (value) =>
  window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
const translateKey = (key, fallback = "") =>
  window.TurnoListoI18n?.translateKey ? window.TurnoListoI18n.translateKey(key, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const formatKey = (key, params = {}, fallback = "") =>
  window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;

let contactPrefillSnapshot = null;
let selectedContactPhoneCountryIso = SHARED_DEFAULT_PHONE_COUNTRY_ISO;
let currentRestaurantAccount = null;
const contactPhoneController = window.TurnoListoPhoneFields?.create({
  elements: {
    field: contactPhoneField,
    countryTrigger: contactPhoneCountryTrigger,
    countryPanel: contactPhoneCountryPanel,
    countryFlag: contactPhoneCountryFlag,
    countryDial: contactPhoneCountryDial,
    countryName: contactPhoneCountryName,
    countrySearch: contactPhoneCountrySearch,
    countryList: contactPhoneCountryList,
    localInput: contactPhoneLocal,
    hiddenInput: contactPhone,
    hintElement: contactPhoneHint,
    errorElement: contactPhoneError,
  },
  translateText,
  translateKey,
  formatKey,
  isRequired: () => false,
});

if (contactForm && contactFeedback && contactSubmitButton) {
  contactForm.addEventListener("submit", handleContactSubmit);
  contactPhoneCountryTrigger?.addEventListener("click", toggleContactPhoneCountryPanel);
  contactPhoneCountrySearch?.addEventListener("input", renderContactPhoneCountryList);
  contactPhoneLocal?.addEventListener("input", () => {
    syncContactPhoneHiddenValue();
    if (contactPhoneError && !contactPhoneError.hidden) {
      validateContactPhoneNumber({ report: true });
    }
  });
  contactPhoneLocal?.addEventListener("blur", () => {
    validateContactPhoneNumber({ report: Boolean(contactPhoneLocal?.value.trim()) });
  });
  restaurantAccountButton?.addEventListener("click", toggleRestaurantAccountMenu);
  restaurantMenuLogout?.addEventListener("click", async () => {
    closeRestaurantAccountMenu();
    await handleRestaurantLogout();
  });
  window.addEventListener("click", handleRestaurantAccountOutsideClick);
  window.addEventListener("click", handleContactPhoneOutsideClick);
  window.addEventListener("keydown", handleContactPhoneKeydown);
  window.addEventListener("turnolisto:language-change", () => {
    renderContactPhoneCountryState();
    renderContactPhoneCountryList();
    validateContactPhoneNumber({ report: shouldReportPhoneValidation(contactPhoneLocal, contactPhoneError) });
    renderRestaurantAccount(currentRestaurantAccount);
  });
  initializeContactPhoneField();
  initializeContactPrefill();
}

function setContactFeedback(message, type = "success") {
  contactFeedback.textContent = message;
  contactFeedback.className = `form-feedback form-feedback--${type}`;
  contactFeedback.hidden = false;
}

function clearContactFeedback() {
  contactFeedback.hidden = true;
  contactFeedback.textContent = "";
}

async function handleContactSubmit(event) {
  event.preventDefault();
  clearContactFeedback();
  contactSubmitButton.disabled = true;

  const phoneValidation = validateContactPhoneNumber({ report: true });
  if (!phoneValidation.valid) {
    setContactFeedback(phoneValidation.message, "error");
    contactSubmitButton.disabled = false;
    return;
  }

  const formData = new FormData(contactForm);
  const payload = {
    name: String(formData.get("name") || "").trim(),
    company: String(formData.get("company") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    interest: String(formData.get("interest") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    sourcePage: window.location.pathname.split("/").pop() || "contact.html",
    referrer: document.referrer || "",
  };

  if (payload.message.length < 5) {
    setContactFeedback(
      translateKey("contact.dynamic.feedback.message_short", "Escribe un mensaje un poco más descriptivo, al menos 5 caracteres."),
      "error",
    );
    contactSubmitButton.disabled = false;
    return;
  }

  try {
    const backend = await window.__turnoFirebaseReadyPromise;
    if (!backend?.enabled || typeof backend.submitContactInquiry !== "function") {
      throw new Error("Firebase no disponible para registrar contactos.");
    }

    await backend.submitContactInquiry(payload);
    contactForm.reset();
    applyContactPrefillSnapshot();
    setContactFeedback(
      translateKey(
        "contact.dynamic.feedback.sent",
        "Tu solicitud se registró correctamente. El equipo de TurnoListo la revisará desde la bandeja interna de administración.",
      ),
      "success",
    );
  } catch (error) {
    console.error("No se pudo enviar el formulario de contacto.", error);
    const message =
      error?.message && String(error.message).includes("demasiado corto")
        ? translateKey(
          "contact.dynamic.feedback.message_short_retry",
          "Escribe un mensaje un poco más descriptivo para poder enviarlo.",
        )
        : translateKey(
          "contact.dynamic.feedback.failed",
          "No se pudo registrar tu solicitud ahora mismo. Inténtalo de nuevo en unos minutos.",
        );
    setContactFeedback(
      message,
      "error",
    );
  } finally {
    contactSubmitButton.disabled = false;
  }
}

async function initializeContactPrefill() {
  const localRestaurant = getRestaurantFromLocalSession();
  if (localRestaurant) {
    contactPrefillSnapshot = buildContactPrefillFromRestaurant(localRestaurant);
    applyContactPrefillSnapshot();
    renderRestaurantAccount(localRestaurant);
  }

  try {
    const backend = await window.__turnoFirebaseReadyPromise;
    if (!backend?.enabled || typeof backend.getDocument !== "function") {
      return;
    }

    let user = typeof backend.getCurrentUser === "function" ? backend.getCurrentUser() : null;
    if (!user?.uid && typeof backend.onAuthStateChanged === "function") {
      user = await waitForAuthenticatedUser(backend);
    }

    const session = getStoredRestaurantSession();
    const profile = user?.uid ? await backend.getDocument("users", user.uid) : null;
    const restaurantId = String(profile?.restaurantId || session?.restaurantId || "").trim();
    if ((!profile || profile.role !== "restaurant") && !restaurantId) return;

    const restaurant = restaurantId ? await backend.getDocument("restaurants", restaurantId) : null;
    if (!restaurant) return;

    contactPrefillSnapshot = buildContactPrefillFromRestaurant(restaurant, profile, user);
    applyContactPrefillSnapshot();
    renderRestaurantAccount(restaurant);
  } catch (error) {
    console.error("No se pudieron precargar los datos del restaurante en contacto.", error);
  }

  applyContactQueryPrefill();
}

function buildContactPrefillFromRestaurant(restaurant, profile = null, user = null) {
  return {
    name: String(restaurant?.ownerName || restaurant?.name || "").trim(),
    company: String(restaurant?.name || "").trim(),
    email: String(restaurant?.email || profile?.email || user?.email || "").trim(),
    phone: String(restaurant?.phone || "").trim(),
    interest: "Soporte operativo",
  };
}

function getStoredRestaurantSession() {
  try {
    return JSON.parse(window.localStorage.getItem(RESTAURANT_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function getRestaurantFromLocalSession() {
  const session = getStoredRestaurantSession();
  const restaurantId = String(session?.restaurantId || "").trim();
  if (!restaurantId) return null;

  try {
    const restaurants = JSON.parse(window.localStorage.getItem(RESTAURANT_STORAGE_KEY) || "[]");
    if (!Array.isArray(restaurants)) return null;
    return restaurants.find((restaurant) => String(restaurant?.id || "").trim() === restaurantId) || null;
  } catch {
    return null;
  }
}

function waitForAuthenticatedUser(backend) {
  return new Promise((resolve) => {
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(null);
    }, 2500);

    const unsubscribe = backend.onAuthStateChanged((user) => {
      if (settled || !user?.uid) return;
      settled = true;
      window.clearTimeout(timeoutId);
      unsubscribe?.();
      resolve(user);
    });
  });
}

function applyContactPrefillSnapshot() {
  if (!contactPrefillSnapshot) return;

  setInputValueIfEmpty(contactName, contactPrefillSnapshot.name);
  setInputValueIfEmpty(contactCompany, contactPrefillSnapshot.company);
  setInputValueIfEmpty(contactEmail, contactPrefillSnapshot.email);
  setContactPhoneValueIfEmpty(contactPrefillSnapshot.phone);

  if (contactInterest && !String(contactInterest.value || "").trim()) {
    contactInterest.value = contactPrefillSnapshot.interest;
  } else if (contactInterest && contactInterest.value === "Interés de inversión") {
    contactInterest.value = contactPrefillSnapshot.interest;
  }
}

function applyContactQueryPrefill() {
  const params = new URLSearchParams(window.location.search);
  const interest = String(params.get("interest") || "").trim();
  const message = String(params.get("message") || "").trim();

  if (interest && contactInterest) {
    contactInterest.value = interest;
  }

  if (message) {
    setInputValueIfEmpty(contactMessage, message);
  }
}

function setInputValueIfEmpty(element, value) {
  if (!element) return;
  if (String(element.value || "").trim()) return;
  element.value = String(value || "").trim();
}

function getPhoneCountryByIso(iso) {
  return contactPhoneController?.getCountryByIso(iso) || PHONE_COUNTRIES.find((country) => country.iso === iso) || PHONE_COUNTRIES[0];
}

function shouldReportPhoneValidation(input, errorElement) {
  return contactPhoneController?.shouldReportValidation() || Boolean(String(input?.value || "").trim()) || Boolean(errorElement && !errorElement.hidden);
}

function buildPhoneHintMessage(country) {
  return contactPhoneController?.renderState?.(country) || "";
}

function setContactPhoneError(message = "") {
  return contactPhoneController?.setError(message);
}

function renderContactPhoneCountryState() {
  return contactPhoneController?.renderState();
}

function buildContactPhoneNumber() {
  return contactPhoneController?.buildPhoneNumber() || "";
}

function syncContactPhoneHiddenValue() {
  return contactPhoneController?.syncHiddenValue() || "";
}

function validateContactPhoneNumber(options = {}) {
  return contactPhoneController?.validate(options) || { valid: true, phone: "", message: "" };
}

function renderContactPhoneCountryList() {
  return contactPhoneController?.renderList();
}

function openContactPhoneCountryPanel() {
  return contactPhoneController?.openPanel();
}

function closeContactPhoneCountryPanel() {
  return contactPhoneController?.closePanel();
}

function toggleContactPhoneCountryPanel() {
  return contactPhoneController?.togglePanel();
}

function handleContactPhoneOutsideClick(event) {
  return contactPhoneController?.handleOutsideClick(event);
}

function handleContactPhoneKeydown(event) {
  return contactPhoneController?.handleKeydown(event);
}

function initializeContactPhoneField() {
  return contactPhoneController?.reset();
}

function splitContactPhoneValue(value) {
  return contactPhoneController?.splitValue(value) || { iso: DEFAULT_PHONE_COUNTRY_ISO, local: "" };
}

function setContactPhoneValueIfEmpty(value) {
  return contactPhoneController?.setValue(value, { onlyIfEmpty: true });
}

function renderRestaurantAccount(restaurant) {
  if (!restaurantAccountName) return;
  currentRestaurantAccount = restaurant || null;
  const restaurantName = String(restaurant?.name || "").trim();
  const logoUrl = String(restaurant?.logoUrl || "").trim();
  restaurantAccountName.textContent = restaurantName || translateKey("restaurant.account.emptyName", "Sin datos cargados");
  restaurantAccountMeta.textContent = restaurantName
    ? translateText("Acceso verificado")
    : translateKey("restaurant.account.emptyMeta", "Cuenta no cargada");
  restaurantAccountAvatarFallback.textContent = restaurantName.charAt(0).toUpperCase() || "?";

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

async function handleRestaurantLogout() {
  const backend = await window.__turnoFirebaseReadyPromise;
  if (typeof preparePrivateFirebaseSignOut === "function") {
    preparePrivateFirebaseSignOut();
  }
  if (typeof clearCurrentRestaurantSession === "function") {
    clearCurrentRestaurantSession();
  }
  if (backend?.enabled && typeof backend.signOut === "function") {
    await backend.signOut();
  }
  window.location.href = "./restaurant.html";
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
