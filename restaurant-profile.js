const restaurantProfileForm = document.querySelector("#restaurantProfileForm");
const restaurantProfileLogoInput = document.querySelector("#restaurantProfileLogoInput");
const restaurantProfileLogoFilename = document.querySelector("#restaurantProfileLogoFilename");
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
const restaurantProfilePhoneError = document.querySelector("#restaurantProfilePhoneError");
const restaurantProfileCity = document.querySelector("#restaurantProfileCity");
const restaurantProfileAddress = document.querySelector("#restaurantProfileAddress");
const restaurantProfileNotes = document.querySelector("#restaurantProfileNotes");
const restaurantProfilePlanName = document.querySelector("#restaurantProfilePlanName");
const restaurantProfileActivatedUntil = document.querySelector("#restaurantProfileActivatedUntil");
const restaurantProfileStatus = document.querySelector("#restaurantProfileStatus");
const restaurantProfilePlanNameCard = document.querySelector("#restaurantProfilePlanNameCard");
const restaurantProfileActivatedUntilCard = document.querySelector("#restaurantProfileActivatedUntilCard");
const restaurantProfileFeedback = document.querySelector("#restaurantProfileFeedback");
const restaurantProfileSummaryAvatarImage = document.querySelector("#restaurantProfileSummaryAvatarImage");
const restaurantProfileSummaryAvatarFallback = document.querySelector("#restaurantProfileSummaryAvatarFallback");
const restaurantProfileSummaryName = document.querySelector("#restaurantProfileSummaryName");
const restaurantProfileSummaryTitle = document.querySelector("#restaurantProfileSummaryTitle");
const restaurantAccountButton = document.querySelector("#restaurantAccountButton");
const restaurantAccountPanel = document.querySelector("#restaurantAccountPanel");
const restaurantAccountAvatarImage = document.querySelector("#restaurantAccountAvatarImage");
const restaurantAccountAvatarFallback = document.querySelector("#restaurantAccountAvatarFallback");
const restaurantAccountName = document.querySelector("#restaurantAccountName");
const restaurantAccountMeta = document.querySelector("#restaurantAccountMeta");
const restaurantMenuLogout = document.querySelector("#restaurantMenuLogout");
const EMPTY_DATA_LABEL = "Sin datos cargados";
const EMPTY_STATUS_LABEL = "No disponible";
const EMPTY_AVATAR_LABEL = "?";

let selectedRestaurantProfileLogoUrl = "";
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
let selectedRestaurantProfilePhoneCountryIso = "ES";

initializeRestaurantProfilePage();

function initializeRestaurantProfilePage() {
  restaurantProfileForm?.addEventListener("submit", handleRestaurantProfileSubmit);
  restaurantProfileLogoInput?.addEventListener("change", handleRestaurantProfileLogoSelection);
  restaurantProfilePhoneCountryTrigger?.addEventListener("click", toggleRestaurantProfilePhoneCountryPanel);
  restaurantProfilePhoneCountrySearch?.addEventListener("input", renderRestaurantProfilePhoneCountryList);
  restaurantProfilePhoneLocal?.addEventListener("input", () => {
    syncRestaurantProfilePhoneHiddenValue();
    if (restaurantProfilePhoneLocal.value.trim()) {
      setRestaurantProfilePhoneError("");
    }
  });
  restaurantProfilePhoneLocal?.addEventListener("blur", () => {
    validateRestaurantProfilePhoneNumber({ report: Boolean(restaurantProfilePhoneLocal?.value.trim()) });
  });
  restaurantAccountButton?.addEventListener("click", toggleRestaurantAccountMenu);
  restaurantMenuLogout?.addEventListener("click", async () => {
    closeRestaurantAccountMenu();
    await handleRestaurantLogout();
  });
  window.addEventListener("click", handleRestaurantAccountOutsideClick);
  window.addEventListener("click", handleRestaurantProfilePhoneOutsideClick);
  window.addEventListener("keydown", handleRestaurantProfilePhoneKeydown);
  initializeRestaurantProfilePhoneField();
  waitForDataReady().then(() => {
    initializeRestaurantProfileAuth();
  });
}

function resetRestaurantProfileLogoFilename() {
  if (!restaurantProfileLogoFilename) return;
  restaurantProfileLogoFilename.setAttribute("data-i18n-key", "profile.file.empty");
  restaurantProfileLogoFilename.textContent = "Ningún archivo seleccionado";
  if (window.TurnoListoI18n?.translateDocument) {
    window.TurnoListoI18n.translateDocument(window.TurnoListoI18n.getLanguage?.());
  }
}

function setRestaurantProfileLogoFilename(file) {
  if (!restaurantProfileLogoFilename) return;
  const safeName = String(file?.name || "").trim();
  if (!safeName) {
    resetRestaurantProfileLogoFilename();
    return;
  }
  restaurantProfileLogoFilename.removeAttribute("data-i18n-key");
  restaurantProfileLogoFilename.textContent = safeName;
}

function initializeRestaurantProfileAuth() {
  waitForFirebaseBackend().then((backend) => {
    if (!backend?.enabled || typeof backend.onAuthStateChanged !== "function") {
      window.location.href = "./restaurant.html";
      return;
    }

    backend.onAuthStateChanged(async (user) => {
      if (!user?.email) {
        redirectToRestaurant();
        return;
      }

      await reconnectDataStoreToFirebase();
      const profile = await loadCurrentUserProfileFromBackend();
      const restaurant =
        profile?.role === "restaurant" && profile.restaurantId ? getRestaurantById(profile.restaurantId) : null;

      if (!restaurant || !isRestaurantAccessActive(restaurant)) {
        redirectToRestaurant();
        return;
      }

      setCurrentRestaurantSession(restaurant);
      renderRestaurantProfile(restaurant);
    });
  });
}

function redirectToRestaurant() {
  window.location.href = "./restaurant.html";
}

function renderRestaurantProfile(restaurant) {
  if (!restaurant) {
    clearRestaurantProfileView();
    return;
  }
  const demoUsage = getRestaurantDemoUsage(restaurant);
  renderRestaurantAccount(restaurant);
  restaurantProfileName.value = restaurant.name || "";
  restaurantProfileOwnerName.value = restaurant.ownerName || "";
  restaurantProfileEmail.value = restaurant.email || "";
  applyRestaurantProfilePhoneValue(restaurant.phone || "");
  restaurantProfileCity.value = restaurant.city || "";
  restaurantProfileAddress.value = restaurant.address || "";
  restaurantProfileNotes.value = restaurant.notes || "";
  const planName = restaurant.planName || EMPTY_STATUS_LABEL;
  const activatedUntil = restaurant.activatedUntil ? formatProfileDate(restaurant.activatedUntil) : EMPTY_STATUS_LABEL;
  restaurantProfilePlanName.value = planName;
  restaurantProfileActivatedUntil.value = activatedUntil;
  if (restaurantProfilePlanNameCard) restaurantProfilePlanNameCard.textContent = planName;
  if (restaurantProfileActivatedUntilCard) restaurantProfileActivatedUntilCard.textContent = activatedUntil;
  if (restaurantProfileStatus) {
    restaurantProfileStatus.value = isDemoRestaurant(restaurant)
      ? `Demo activa · ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos`
      : "Acceso verificado";
  }
  syncRestaurantProfilePreview(selectedRestaurantProfileLogoUrl || restaurant.logoUrl || "");
  renderRestaurantProfileSummary(restaurant);
}

function renderRestaurantAccount(restaurant) {
  const restaurantName = String(restaurant?.name || "").trim();
  const logoUrl = String(restaurant?.logoUrl || "").trim();
  const hasRestaurantData = Boolean(restaurantName);
  const demoUsage = hasRestaurantData ? getRestaurantDemoUsage(restaurant) : null;
  restaurantAccountName.textContent = restaurantName || EMPTY_DATA_LABEL;
  restaurantAccountMeta.textContent = hasRestaurantData
    ? isDemoRestaurant(restaurant)
      ? `Demo activa · ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos usados`
      : "Acceso verificado"
    : "Cuenta no cargada";
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

function renderRestaurantProfileSummary(restaurant) {
  if (!restaurantProfileSummaryName) return;
  const restaurantName = String(restaurant?.name || "").trim();
  const ownerName = String(restaurant?.ownerName || "").trim();
  const logoUrl = String(selectedRestaurantProfileLogoUrl || restaurant?.logoUrl || "").trim();
  const hasRestaurantData = Boolean(restaurantName);
  const demoUsage = hasRestaurantData ? getRestaurantDemoUsage(restaurant) : null;
  restaurantProfileSummaryName.textContent = restaurantName || EMPTY_DATA_LABEL;
  restaurantProfileSummaryTitle.textContent = hasRestaurantData
    ? isDemoRestaurant(restaurant)
      ? `Demo activa · ${demoUsage.remainingOrders} pedidos disponibles`
      : ownerName || EMPTY_STATUS_LABEL
    : "Cuenta no cargada";
  restaurantProfileSummaryAvatarFallback.textContent = restaurantName.charAt(0).toUpperCase() || EMPTY_AVATAR_LABEL;

  if (logoUrl) {
    restaurantProfileSummaryAvatarImage.src = logoUrl;
    restaurantProfileSummaryAvatarImage.hidden = false;
    restaurantProfileSummaryAvatarFallback.hidden = true;
  } else {
    restaurantProfileSummaryAvatarImage.hidden = true;
    restaurantProfileSummaryAvatarImage.removeAttribute("src");
    restaurantProfileSummaryAvatarFallback.hidden = false;
  }
}

function formatProfileDate(value) {
  if (!value) return EMPTY_STATUS_LABEL;
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function clearRestaurantProfileView() {
  restaurantProfileName.value = "";
  restaurantProfileOwnerName.value = "";
  restaurantProfileEmail.value = "";
  restaurantProfileCity.value = "";
  restaurantProfileAddress.value = "";
  restaurantProfileNotes.value = "";
  restaurantProfilePlanName.value = EMPTY_STATUS_LABEL;
  restaurantProfileActivatedUntil.value = EMPTY_STATUS_LABEL;
  if (restaurantProfileStatus) restaurantProfileStatus.value = EMPTY_STATUS_LABEL;
  if (restaurantProfilePlanNameCard) restaurantProfilePlanNameCard.textContent = EMPTY_STATUS_LABEL;
  if (restaurantProfileActivatedUntilCard) restaurantProfileActivatedUntilCard.textContent = EMPTY_STATUS_LABEL;
  applyRestaurantProfilePhoneValue("");
  syncRestaurantProfilePreview("");
  resetRestaurantProfileLogoFilename();
  renderRestaurantAccount(null);
  renderRestaurantProfileSummary(null);
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
  const file = event.target.files?.[0] || null;
  if (!file) {
    selectedRestaurantProfileLogoUrl = "";
    resetRestaurantProfileLogoFilename();
    const currentRestaurant = getCurrentRestaurantSession()
      ? getRestaurantById(getCurrentRestaurantSession().restaurantId)
      : null;
    syncRestaurantProfilePreview(currentRestaurant?.logoUrl || "");
    return;
  }

  try {
    setRestaurantProfileLogoFilename(file);
    selectedRestaurantProfileLogoUrl = await optimizeAccountImage(file);
    syncRestaurantProfilePreview(selectedRestaurantProfileLogoUrl);
    const currentRestaurant = getCurrentRestaurantSession()
      ? getRestaurantById(getCurrentRestaurantSession().restaurantId)
      : null;
    if (currentRestaurant) {
      renderRestaurantProfileSummary({
        ...currentRestaurant,
        name: restaurantProfileName?.value || currentRestaurant.name,
        ownerName: restaurantProfileOwnerName?.value || currentRestaurant.ownerName,
        logoUrl: selectedRestaurantProfileLogoUrl,
      });
    }
  } catch (error) {
    resetRestaurantProfileLogoFilename();
    showTurnoAlert(error instanceof Error ? error.message : "No se pudo preparar el logo del restaurante.", "error");
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
    restaurantProfileFeedback.textContent = "No se pudo guardar el perfil del restaurante.";
    restaurantProfileFeedback.className = "form-feedback form-feedback--error";
    restaurantProfileFeedback.hidden = false;
    return;
  }

  selectedRestaurantProfileLogoUrl = "";
  if (restaurantProfileLogoInput) {
    restaurantProfileLogoInput.value = "";
  }
  resetRestaurantProfileLogoFilename();
  restaurantProfileFeedback.textContent = "Perfil actualizado correctamente.";
  restaurantProfileFeedback.className = "form-feedback form-feedback--success";
  restaurantProfileFeedback.hidden = false;
  renderRestaurantProfile(nextRestaurant);
}

async function handleRestaurantLogout() {
  const backend = await waitForFirebaseBackend();
  preparePrivateFirebaseSignOut();
  clearCurrentRestaurantSession();
  if (backend?.enabled && typeof backend.signOut === "function") {
    await backend.signOut();
  }
  redirectToRestaurant();
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

function getRestaurantProfilePhoneCountryByIso(iso) {
  return PHONE_COUNTRIES.find((country) => country.iso === iso) || PHONE_COUNTRIES[0];
}

function setRestaurantProfilePhoneError(message = "") {
  const safeMessage = String(message || "").trim();
  if (restaurantProfilePhoneError) {
    restaurantProfilePhoneError.textContent = safeMessage;
    restaurantProfilePhoneError.hidden = !safeMessage;
  }
  restaurantProfilePhoneField?.classList.toggle("has-error", Boolean(safeMessage));
  restaurantProfilePhoneLocal?.setCustomValidity(safeMessage);
}

function renderRestaurantProfilePhoneCountryState() {
  const country = getRestaurantProfilePhoneCountryByIso(selectedRestaurantProfilePhoneCountryIso);
  if (restaurantProfilePhoneCountryFlag) restaurantProfilePhoneCountryFlag.textContent = country.flag;
  if (restaurantProfilePhoneCountryDial) restaurantProfilePhoneCountryDial.textContent = country.dialCode;
  if (restaurantProfilePhoneCountryName) restaurantProfilePhoneCountryName.textContent = country.name;
  if (restaurantProfilePhoneLocal && !restaurantProfilePhoneLocal.value.trim()) {
    restaurantProfilePhoneLocal.placeholder = country.placeholder;
  }
}

function buildRestaurantProfilePhoneNumber() {
  const country = getRestaurantProfilePhoneCountryByIso(selectedRestaurantProfilePhoneCountryIso);
  const localValue = String(restaurantProfilePhoneLocal?.value || "")
    .replace(/[^\d\s()-]/g, "")
    .trim();

  if (!localValue) {
    if (restaurantProfilePhone) restaurantProfilePhone.value = "";
    return "";
  }

  const digitsOnly = localValue.replace(/\D/g, "");
  const dialDigits = country.dialCode.replace(/\D/g, "");
  const normalizedLocal =
    digitsOnly.startsWith(dialDigits) && localValue.replace(/\s+/g, "").startsWith(dialDigits)
      ? digitsOnly.slice(dialDigits.length)
      : localValue;
  const fullPhone = `${country.dialCode} ${String(normalizedLocal).trim()}`.trim();
  if (restaurantProfilePhone) restaurantProfilePhone.value = fullPhone;
  return fullPhone;
}

function syncRestaurantProfilePhoneHiddenValue() {
  if (restaurantProfilePhoneLocal?.value.trim()) {
    setRestaurantProfilePhoneError("");
  }
  return buildRestaurantProfilePhoneNumber();
}

function validateRestaurantProfilePhoneNumber(options = {}) {
  const country = getRestaurantProfilePhoneCountryByIso(selectedRestaurantProfilePhoneCountryIso);
  const rawValue = String(restaurantProfilePhoneLocal?.value || "").trim();
  const digitsOnly = rawValue.replace(/\D/g, "");
  const dialDigits = country.dialCode.replace(/\D/g, "");
  let localDigits = digitsOnly;

  if (!rawValue) {
    setRestaurantProfilePhoneError("");
    if (restaurantProfilePhone) restaurantProfilePhone.value = "";
    return { valid: true, phone: "", message: "" };
  }

  if (localDigits.startsWith(dialDigits)) {
    localDigits = localDigits.slice(dialDigits.length);
  }

  if (localDigits.length < country.minDigits || localDigits.length > country.maxDigits) {
    const message =
      country.minDigits === country.maxDigits
        ? `El móvil de ${country.name} debe tener ${country.minDigits} dígitos sin contar el prefijo ${country.dialCode}.`
        : `El móvil de ${country.name} debe tener entre ${country.minDigits} y ${country.maxDigits} dígitos sin contar el prefijo ${country.dialCode}.`;
    if (options.report) setRestaurantProfilePhoneError(message);
    return { valid: false, message };
  }

  const formattedPhone = `${country.dialCode} ${localDigits}`.trim();
  if (restaurantProfilePhone) restaurantProfilePhone.value = formattedPhone;
  setRestaurantProfilePhoneError("");
  return { valid: true, phone: formattedPhone, message: "" };
}

function renderRestaurantProfilePhoneCountryList() {
  if (!restaurantProfilePhoneCountryList) return;
  const query = String(restaurantProfilePhoneCountrySearch?.value || "").trim().toLowerCase();
  restaurantProfilePhoneCountryList.innerHTML = "";

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
    restaurantProfilePhoneCountryList.append(emptyState);
    return;
  }

  filteredCountries.forEach((country) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "phone-country-option";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(country.iso === selectedRestaurantProfilePhoneCountryIso));
    if (country.iso === selectedRestaurantProfilePhoneCountryIso) option.classList.add("is-active");
    option.addEventListener("click", () => {
      selectedRestaurantProfilePhoneCountryIso = country.iso;
      renderRestaurantProfilePhoneCountryState();
      syncRestaurantProfilePhoneHiddenValue();
      validateRestaurantProfilePhoneNumber({ report: Boolean(restaurantProfilePhoneLocal?.value.trim()) });
      closeRestaurantProfilePhoneCountryPanel();
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
    restaurantProfilePhoneCountryList.append(option);
  });
}

function openRestaurantProfilePhoneCountryPanel() {
  if (!restaurantProfilePhoneCountryPanel || !restaurantProfilePhoneCountryTrigger) return;
  restaurantProfilePhoneCountryPanel.hidden = false;
  restaurantProfilePhoneField?.classList.add("is-open");
  restaurantProfilePhoneCountryTrigger.setAttribute("aria-expanded", "true");
  renderRestaurantProfilePhoneCountryList();
  window.requestAnimationFrame(() => {
    restaurantProfilePhoneCountrySearch?.focus();
    restaurantProfilePhoneCountrySearch?.select();
  });
}

function closeRestaurantProfilePhoneCountryPanel() {
  if (!restaurantProfilePhoneCountryPanel || !restaurantProfilePhoneCountryTrigger) return;
  restaurantProfilePhoneCountryPanel.hidden = true;
  restaurantProfilePhoneField?.classList.remove("is-open");
  restaurantProfilePhoneCountryTrigger.setAttribute("aria-expanded", "false");
}

function toggleRestaurantProfilePhoneCountryPanel() {
  if (restaurantProfilePhoneCountryPanel?.hidden) {
    openRestaurantProfilePhoneCountryPanel();
    return;
  }
  closeRestaurantProfilePhoneCountryPanel();
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
  if (!restaurantProfilePhoneField) return;
  selectedRestaurantProfilePhoneCountryIso = DEFAULT_PHONE_COUNTRY_ISO;
  if (restaurantProfilePhoneCountrySearch) restaurantProfilePhoneCountrySearch.value = "";
  if (restaurantProfilePhoneLocal) {
    restaurantProfilePhoneLocal.value = "";
    restaurantProfilePhoneLocal.setCustomValidity("");
  }
  if (restaurantProfilePhone) restaurantProfilePhone.value = "";
  setRestaurantProfilePhoneError("");
  renderRestaurantProfilePhoneCountryState();
  renderRestaurantProfilePhoneCountryList();
  closeRestaurantProfilePhoneCountryPanel();
}

function splitRestaurantProfilePhoneValue(value) {
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

function applyRestaurantProfilePhoneValue(value) {
  if (!restaurantProfilePhoneLocal || !restaurantProfilePhone) return;
  const parsed = splitRestaurantProfilePhoneValue(value);
  selectedRestaurantProfilePhoneCountryIso = parsed.iso;
  renderRestaurantProfilePhoneCountryState();
  restaurantProfilePhoneLocal.value = parsed.local;
  syncRestaurantProfilePhoneHiddenValue();
  validateRestaurantProfilePhoneNumber({ report: false });
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
