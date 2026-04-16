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
const translateText = (value) =>
  window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
const translateKey = (key, fallback = "") =>
  window.TurnoListoI18n?.translateKey ? window.TurnoListoI18n.translateKey(key, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const formatKey = (key, params = {}, fallback = "") =>
  window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;

let contactPrefillSnapshot = null;
let selectedContactPhoneCountryIso = DEFAULT_PHONE_COUNTRY_ISO;
let currentRestaurantAccount = null;

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
  return PHONE_COUNTRIES.find((country) => country.iso === iso) || PHONE_COUNTRIES[0];
}

function setContactPhoneError(message = "") {
  const safeMessage = String(message || "").trim();
  if (contactPhoneError) {
    contactPhoneError.textContent = safeMessage;
    contactPhoneError.hidden = !safeMessage;
  }
  contactPhoneField?.classList.toggle("has-error", Boolean(safeMessage));
  contactPhoneLocal?.setCustomValidity(safeMessage);
}

function renderContactPhoneCountryState() {
  const country = getPhoneCountryByIso(selectedContactPhoneCountryIso);
  if (contactPhoneCountryFlag) contactPhoneCountryFlag.textContent = country.flag;
  if (contactPhoneCountryDial) contactPhoneCountryDial.textContent = country.dialCode;
  if (contactPhoneCountryName) contactPhoneCountryName.textContent = translateText(country.name);
  if (contactPhoneLocal && !contactPhoneLocal.value.trim()) {
    contactPhoneLocal.placeholder = country.placeholder;
  }
}

function buildContactPhoneNumber() {
  const country = getPhoneCountryByIso(selectedContactPhoneCountryIso);
  const localValue = String(contactPhoneLocal?.value || "")
    .replace(/[^\d\s()-]/g, "")
    .trim();

  if (!localValue) {
    if (contactPhone) contactPhone.value = "";
    return "";
  }

  const digitsOnly = localValue.replace(/\D/g, "");
  const dialDigits = country.dialCode.replace(/\D/g, "");
  const normalizedLocal =
    digitsOnly.startsWith(dialDigits) && localValue.replace(/\s+/g, "").startsWith(dialDigits)
      ? digitsOnly.slice(dialDigits.length)
      : localValue;
  const fullPhone = `${country.dialCode} ${String(normalizedLocal).trim()}`.trim();
  if (contactPhone) contactPhone.value = fullPhone;
  return fullPhone;
}

function syncContactPhoneHiddenValue() {
  if (contactPhoneLocal?.value.trim()) {
    setContactPhoneError("");
  }
  return buildContactPhoneNumber();
}

function validateContactPhoneNumber(options = {}) {
  const country = getPhoneCountryByIso(selectedContactPhoneCountryIso);
  const rawValue = String(contactPhoneLocal?.value || "").trim();
  const digitsOnly = rawValue.replace(/\D/g, "");
  const dialDigits = country.dialCode.replace(/\D/g, "");
  let localDigits = digitsOnly;

  if (!rawValue) {
    setContactPhoneError("");
    if (contactPhone) contactPhone.value = "";
    return { valid: true, phone: "", message: "" };
  }

  if (localDigits.startsWith(dialDigits)) {
    localDigits = localDigits.slice(dialDigits.length);
  }

  if (localDigits.length < country.minDigits || localDigits.length > country.maxDigits) {
    const countryName = translateText(country.name);
    const message =
      country.minDigits === country.maxDigits
        ? formatKey(
          "contact.dynamic.phone.invalid.fixed",
          { country: countryName, digits: country.minDigits, dialCode: country.dialCode },
          `El móvil de ${countryName} debe tener ${country.minDigits} dígitos sin contar el prefijo ${country.dialCode}.`,
        )
        : formatKey(
          "contact.dynamic.phone.invalid.range",
          {
            country: countryName,
            minDigits: country.minDigits,
            maxDigits: country.maxDigits,
            dialCode: country.dialCode,
          },
          `El móvil de ${countryName} debe tener entre ${country.minDigits} y ${country.maxDigits} dígitos sin contar el prefijo ${country.dialCode}.`,
        );
    if (options.report) setContactPhoneError(message);
    return { valid: false, message };
  }

  const formattedPhone = `${country.dialCode} ${localDigits}`.trim();
  if (contactPhone) contactPhone.value = formattedPhone;
  setContactPhoneError("");
  return { valid: true, phone: formattedPhone, message: "" };
}

function renderContactPhoneCountryList() {
  if (!contactPhoneCountryList) return;
  const query = String(contactPhoneCountrySearch?.value || "").trim().toLowerCase();
  contactPhoneCountryList.innerHTML = "";

  const filteredCountries = PHONE_COUNTRIES.filter((country) => {
    const localizedCountryName = translateText(country.name).toLowerCase();
    if (!query) return true;
    return (
      country.name.toLowerCase().includes(query) ||
      localizedCountryName.includes(query) ||
      country.dialCode.toLowerCase().includes(query) ||
      country.iso.toLowerCase().includes(query)
    );
  });

  if (!filteredCountries.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "phone-country-list__empty";
    emptyState.textContent = translateKey("contact.dynamic.phone.empty_search", "No encontramos ningún país con esa búsqueda.");
    contactPhoneCountryList.append(emptyState);
    return;
  }

  filteredCountries.forEach((country) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "phone-country-option";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(country.iso === selectedContactPhoneCountryIso));
    if (country.iso === selectedContactPhoneCountryIso) option.classList.add("is-active");
    option.addEventListener("click", () => {
      selectedContactPhoneCountryIso = country.iso;
      renderContactPhoneCountryState();
      syncContactPhoneHiddenValue();
      validateContactPhoneNumber({ report: Boolean(contactPhoneLocal?.value.trim()) });
      closeContactPhoneCountryPanel();
    });

    const flag = document.createElement("span");
    flag.className = "phone-country-option__flag";
    flag.textContent = country.flag;

    const meta = document.createElement("span");
    meta.className = "phone-country-option__meta";

    const name = document.createElement("span");
    name.className = "phone-country-option__name";
    name.textContent = translateText(country.name);

    const dial = document.createElement("span");
    dial.className = "phone-country-option__dial";
    dial.textContent = `${country.dialCode} · ${country.iso}`;

    meta.append(name, dial);
    option.append(flag, meta);
    contactPhoneCountryList.append(option);
  });
}

function openContactPhoneCountryPanel() {
  if (!contactPhoneCountryPanel || !contactPhoneCountryTrigger) return;
  contactPhoneCountryPanel.hidden = false;
  contactPhoneField?.classList.add("is-open");
  contactPhoneCountryTrigger.setAttribute("aria-expanded", "true");
  renderContactPhoneCountryList();
  window.requestAnimationFrame(() => {
    contactPhoneCountrySearch?.focus();
    contactPhoneCountrySearch?.select();
  });
}

function closeContactPhoneCountryPanel() {
  if (!contactPhoneCountryPanel || !contactPhoneCountryTrigger) return;
  contactPhoneCountryPanel.hidden = true;
  contactPhoneField?.classList.remove("is-open");
  contactPhoneCountryTrigger.setAttribute("aria-expanded", "false");
}

function toggleContactPhoneCountryPanel() {
  if (contactPhoneCountryPanel?.hidden) {
    openContactPhoneCountryPanel();
    return;
  }
  closeContactPhoneCountryPanel();
}

function handleContactPhoneOutsideClick(event) {
  if (!contactPhoneField || contactPhoneCountryPanel?.hidden) return;
  if (contactPhoneField.contains(event.target)) return;
  closeContactPhoneCountryPanel();
}

function handleContactPhoneKeydown(event) {
  if (event.key !== "Escape" || contactPhoneCountryPanel?.hidden) return;
  closeContactPhoneCountryPanel();
  contactPhoneCountryTrigger?.focus();
}

function initializeContactPhoneField() {
  if (!contactPhoneField) return;
  selectedContactPhoneCountryIso = DEFAULT_PHONE_COUNTRY_ISO;
  if (contactPhoneCountrySearch) contactPhoneCountrySearch.value = "";
  if (contactPhoneLocal) {
    contactPhoneLocal.value = "";
    contactPhoneLocal.setCustomValidity("");
  }
  if (contactPhone) contactPhone.value = "";
  setContactPhoneError("");
  renderContactPhoneCountryState();
  renderContactPhoneCountryList();
  closeContactPhoneCountryPanel();
}

function splitContactPhoneValue(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return { iso: DEFAULT_PHONE_COUNTRY_ISO, local: "" };
  }

  const matchedCountry = PHONE_COUNTRIES
    .slice()
    .sort((left, right) => right.dialCode.length - left.dialCode.length)
    .find((country) => normalized.startsWith(country.dialCode));

  if (!matchedCountry) {
    return { iso: DEFAULT_PHONE_COUNTRY_ISO, local: normalized.replace(/^\+/, "").trim() };
  }

  return {
    iso: matchedCountry.iso,
    local: normalized.slice(matchedCountry.dialCode.length).trim(),
  };
}

function setContactPhoneValueIfEmpty(value) {
  if (!contactPhoneLocal || !contactPhone) return;
  if (String(contactPhoneLocal.value || "").trim() || String(contactPhone.value || "").trim()) return;

  const parsed = splitContactPhoneValue(value);
  selectedContactPhoneCountryIso = parsed.iso;
  renderContactPhoneCountryState();
  contactPhoneLocal.value = parsed.local;
  syncContactPhoneHiddenValue();
  validateContactPhoneNumber({ report: false });
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
