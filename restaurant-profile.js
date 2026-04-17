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
const restaurantProfilePhoneHint = document.querySelector("#restaurantProfilePhoneHint");
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
const SHARED_PHONE_COUNTRIES = window.TurnoListoPhoneFields?.countries || [];
const SHARED_DEFAULT_PHONE_COUNTRY_ISO = window.TurnoListoPhoneFields?.defaultCountryIso || "ES";
let selectedRestaurantProfilePhoneCountryIso = SHARED_DEFAULT_PHONE_COUNTRY_ISO;
const translateText = (value) =>
  window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
const translateKey = (key, fallback = "") =>
  window.TurnoListoI18n?.translateKey ? window.TurnoListoI18n.translateKey(key, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const formatKey = (key, params = {}, fallback = "") =>
  window.TurnoListoI18n?.formatKey ? window.TurnoListoI18n.formatKey(key, params, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
const setDynamicRuntimeAttribute = (element, attributeName, value) => {
  if (!element || !attributeName) return;
  if (window.TurnoListoI18n?.setDynamicAttribute) {
    window.TurnoListoI18n.setDynamicAttribute(element, attributeName, value);
    return;
  }
  const normalizedValue = value === null || value === undefined ? "" : String(value);
  if (attributeName === "value" && "value" in element) {
    element.value = normalizedValue;
    element.setAttribute("value", normalizedValue);
    return;
  }
  if (attributeName === "placeholder" && "placeholder" in element) {
    element.placeholder = normalizedValue;
    element.setAttribute("placeholder", normalizedValue);
    return;
  }
  element.setAttribute(attributeName, normalizedValue);
};
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
  translateText,
  translateKey,
  formatKey,
  isRequired: () => false,
});

initializeRestaurantProfilePage();

function initializeRestaurantProfilePage() {
  restaurantProfileForm?.addEventListener("submit", handleRestaurantProfileSubmit);
  restaurantProfileLogoInput?.addEventListener("change", handleRestaurantProfileLogoSelection);
  restaurantAccountButton?.addEventListener("click", toggleRestaurantAccountMenu);
  restaurantMenuLogout?.addEventListener("click", async () => {
    closeRestaurantAccountMenu();
    await handleRestaurantLogout();
  });
  window.addEventListener("click", handleRestaurantAccountOutsideClick);
  window.addEventListener("turnolisto:language-change", () => {
    restaurantProfilePhoneController?.refreshLanguage();
  });
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
  setDynamicRuntimeAttribute(restaurantProfileEmail, "value", restaurant.email || "");
  applyRestaurantProfilePhoneValue(restaurant.phone || "");
  restaurantProfileCity.value = restaurant.city || "";
  restaurantProfileAddress.value = restaurant.address || "";
  restaurantProfileNotes.value = restaurant.notes || "";
  const planName = restaurant.planName || EMPTY_STATUS_LABEL;
  const activatedUntil = restaurant.activatedUntil ? formatProfileDate(restaurant.activatedUntil) : EMPTY_STATUS_LABEL;
  setDynamicRuntimeAttribute(restaurantProfilePlanName, "value", planName);
  setDynamicRuntimeAttribute(restaurantProfileActivatedUntil, "value", activatedUntil);
  if (restaurantProfilePlanNameCard) restaurantProfilePlanNameCard.textContent = planName;
  if (restaurantProfileActivatedUntilCard) restaurantProfileActivatedUntilCard.textContent = activatedUntil;
  if (restaurantProfileStatus) {
    setDynamicRuntimeAttribute(
      restaurantProfileStatus,
      "value",
      isDemoRestaurant(restaurant)
        ? `Demo activa · ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos`
        : "Acceso verificado",
    );
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
  setDynamicRuntimeAttribute(restaurantProfileEmail, "value", "");
  restaurantProfileCity.value = "";
  restaurantProfileAddress.value = "";
  restaurantProfileNotes.value = "";
  setDynamicRuntimeAttribute(restaurantProfilePlanName, "value", EMPTY_STATUS_LABEL);
  setDynamicRuntimeAttribute(restaurantProfileActivatedUntil, "value", EMPTY_STATUS_LABEL);
  if (restaurantProfileStatus) setDynamicRuntimeAttribute(restaurantProfileStatus, "value", EMPTY_STATUS_LABEL);
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
  return restaurantProfilePhoneController?.getCountryByIso(iso) || SHARED_PHONE_COUNTRIES.find((country) => country.iso === iso) || SHARED_PHONE_COUNTRIES[0];
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
  return restaurantProfilePhoneController?.togglePanel();
}

function handleRestaurantProfilePhoneOutsideClick(event) {
  return restaurantProfilePhoneController?.handleOutsideClick(event);
}

function handleRestaurantProfilePhoneKeydown(event) {
  return restaurantProfilePhoneController?.handleKeydown(event);
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
