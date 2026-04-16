const STORAGE_KEY = "turnolisto-orders-v6";
const RESTAURANT_STORAGE_KEY = "turnolisto-restaurants-v1";
const TRACKING_STORAGE_KEY = "turnolisto-tracking-v1";
const RESTAURANT_SESSION_KEY = "turnolisto-restaurant-session-v1";
const SYNC_CHANNEL_NAME = "turnolisto-sync";
const SYNC_EVENT_NAME = "turnolisto:orders-changed";
const DEFAULT_RESTAURANT_ID = "rest-demo";
const FIREBASE_ORDERS_COLLECTION = "orders";
const FIREBASE_RESTAURANTS_COLLECTION = "restaurants";
const FIREBASE_TRACKING_COLLECTION = "tracking";
const FIREBASE_USERS_COLLECTION = "users";
const DEMO_PLAN_NAME = "Demo";
const DEMO_DEFAULT_DAYS = 7;
const DEMO_DEFAULT_MAX_ORDERS = 8;
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

const ORDER_STATUSES = ["received", "preparing", "ready", "delivered", "cancelled"];
const QUEUE_ACTIVE_STATUSES = ["received", "preparing"];
const ORDER_CRITICAL_OVERDUE_MINUTES = 10;
const ADAPTIVE_MODEL_LOOKBACK_DAYS = 120;
const ADAPTIVE_MODEL_MAX_EXAMPLES = 220;

const defaultOrders = createDefaultOrders();
const defaultRestaurants = createDefaultRestaurants();
let cachedOrders = [];
let cachedRestaurants = [];
let cachedTracking = [];
let firebaseBackend = null;
let dataBackendMode = "local";
let ordersUnsubscribe = null;
let restaurantsUnsubscribe = null;
let trackingUnsubscribe = null;
let currentUserProfile = null;

const statusMeta = {
  received: { label: "Recibido", color: "#ec7c0d", bg: "rgba(236, 124, 13, 0.12)", progress: 18 },
  preparing: { label: "En preparación", color: "#ec7c0d", bg: "rgba(236, 124, 13, 0.18)", progress: 58 },
  ready: { label: "Listo para recoger", color: "#1f7a63", bg: "rgba(31, 122, 99, 0.14)", progress: 100 },
  delivered: { label: "Entregado", color: "#0c5b75", bg: "rgba(12, 91, 117, 0.12)", progress: 100 },
  cancelled: { label: "Cancelado", color: "#7f1d1d", bg: "rgba(127, 29, 29, 0.12)", progress: 100 },
};

const PUBLIC_TRACKING_TOKEN_PREFIX = "TL";
const PUBLIC_TRACKING_TOKEN_LENGTH = 12;
const dataReadyPromise = initializeDataStore();

initializeTurnoAlerts();
initializePhoneFieldHelpers();

function readOrdersFromLocalStorage() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return normalizeOrders(defaultOrders);
  }

  try {
    return normalizeOrders(JSON.parse(stored));
  } catch {
    return normalizeOrders(defaultOrders);
  }
}

function initializePhoneFieldHelpers() {
  const translateText = (value, translator) => (typeof translator === "function" ? translator(value) : value);
  const translateKey = (key, fallback, translator) => (typeof translator === "function" ? translator(key, fallback) : fallback);
  const formatKey = (key, params, fallback, formatter) => (typeof formatter === "function" ? formatter(key, params, fallback) : fallback);

  function getPhoneCountryByIso(iso) {
    return PHONE_COUNTRIES.find((country) => country.iso === iso) || PHONE_COUNTRIES[0];
  }

  function splitPhoneValue(value) {
    const normalized = String(value || "").trim();
    if (!normalized) return { iso: DEFAULT_PHONE_COUNTRY_ISO, local: "" };
    const matchedCountry = PHONE_COUNTRIES
      .slice()
      .sort((left, right) => right.dialCode.length - left.dialCode.length)
      .find((country) => normalized.startsWith(country.dialCode));
    if (!matchedCountry) {
      return { iso: DEFAULT_PHONE_COUNTRY_ISO, local: normalized.replace(/^\+/, "").trim() };
    }
    return { iso: matchedCountry.iso, local: normalized.slice(matchedCountry.dialCode.length).trim() };
  }

  function createPhoneFieldController(options = {}) {
    const {
      elements = {},
      translateText: translateTextFn,
      translateKey: translateKeyFn,
      formatKey: formatKeyFn,
      isRequired = () => false,
    } = options;
    const {
      field,
      countryTrigger,
      countryPanel,
      countryFlag,
      countryDial,
      countryName,
      countrySearch,
      countryList,
      localInput,
      hiddenInput,
      hintElement,
      errorElement,
    } = elements;
    let selectedCountryIso = String(options.defaultCountryIso || DEFAULT_PHONE_COUNTRY_ISO).trim() || DEFAULT_PHONE_COUNTRY_ISO;
    let initialized = false;

    function shouldReportValidation() {
      return Boolean(String(localInput?.value || "").trim()) || Boolean(errorElement && !errorElement.hidden);
    }

    function setError(message = "") {
      const safeMessage = String(message || "").trim();
      if (errorElement) {
        errorElement.textContent = safeMessage;
        errorElement.hidden = !safeMessage;
      }
      field?.classList.toggle("has-error", Boolean(safeMessage));
      localInput?.setCustomValidity(safeMessage);
    }

    function buildHintMessage(country) {
      const countryLabel = translateText(country.name, translateTextFn);
      return country.minDigits === country.maxDigits
        ? formatKey(
          "contact.dynamic.phone.hint.fixed",
          { country: countryLabel, digits: country.minDigits, dialCode: country.dialCode },
          `Selecciona ${countryLabel} (${country.dialCode}) y escribe un número local de ${country.minDigits} dígitos sin añadir el prefijo.`,
          formatKeyFn,
        )
        : formatKey(
          "contact.dynamic.phone.hint.range",
          { country: countryLabel, minDigits: country.minDigits, maxDigits: country.maxDigits, dialCode: country.dialCode },
          `Selecciona ${countryLabel} (${country.dialCode}) y escribe un número local de entre ${country.minDigits} y ${country.maxDigits} dígitos sin añadir el prefijo.`,
          formatKeyFn,
        );
    }

    function renderState() {
      const country = getPhoneCountryByIso(selectedCountryIso);
      if (countryFlag) countryFlag.textContent = country.flag;
      if (countryDial) countryDial.textContent = country.dialCode;
      if (countryName) countryName.textContent = translateText(country.name, translateTextFn);
      if (localInput) localInput.placeholder = country.placeholder;
      if (hintElement) hintElement.textContent = buildHintMessage(country);
    }

    function buildPhoneNumber() {
      const country = getPhoneCountryByIso(selectedCountryIso);
      const localValue = String(localInput?.value || "").replace(/[^\d\s()-]/g, "").trim();
      if (!localValue) {
        if (hiddenInput) hiddenInput.value = "";
        return "";
      }
      const digitsOnly = localValue.replace(/\D/g, "");
      const dialDigits = country.dialCode.replace(/\D/g, "");
      const normalizedLocal =
        digitsOnly.startsWith(dialDigits) && localValue.replace(/\s+/g, "").startsWith(dialDigits)
          ? digitsOnly.slice(dialDigits.length)
          : localValue;
      const fullPhone = `${country.dialCode} ${String(normalizedLocal).trim()}`.trim();
      if (hiddenInput) hiddenInput.value = fullPhone;
      return fullPhone;
    }

    function syncHiddenValue() {
      if (localInput?.value.trim()) setError("");
      return buildPhoneNumber();
    }

    function buildRequiredMessage(country) {
      const countryLabel = translateText(country.name, translateTextFn);
      return country.minDigits === country.maxDigits
        ? formatKey(
          "contact.dynamic.phone.required.fixed",
          { country: countryLabel, digits: country.minDigits },
          `Introduce un número móvil de ${country.minDigits} dígitos para ${countryLabel}.`,
          formatKeyFn,
        )
        : formatKey(
          "contact.dynamic.phone.required.range",
          { country: countryLabel, minDigits: country.minDigits, maxDigits: country.maxDigits },
          `Introduce un número móvil de entre ${country.minDigits} y ${country.maxDigits} dígitos para ${countryLabel}.`,
          formatKeyFn,
        );
    }

    function buildInvalidMessage(country) {
      const countryLabel = translateText(country.name, translateTextFn);
      return country.minDigits === country.maxDigits
        ? formatKey(
          "contact.dynamic.phone.invalid.fixed",
          { country: countryLabel, digits: country.minDigits, dialCode: country.dialCode },
          `El móvil de ${countryLabel} debe tener ${country.minDigits} dígitos sin contar el prefijo ${country.dialCode}.`,
          formatKeyFn,
        )
        : formatKey(
          "contact.dynamic.phone.invalid.range",
          { country: countryLabel, minDigits: country.minDigits, maxDigits: country.maxDigits, dialCode: country.dialCode },
          `El móvil de ${countryLabel} debe tener entre ${country.minDigits} y ${country.maxDigits} dígitos sin contar el prefijo ${country.dialCode}.`,
          formatKeyFn,
        );
    }

    function validate(options = {}) {
      const country = getPhoneCountryByIso(selectedCountryIso);
      const rawValue = String(localInput?.value || "").trim();
      const digitsOnly = rawValue.replace(/\D/g, "");
      const dialDigits = country.dialCode.replace(/\D/g, "");
      let localDigits = digitsOnly;

      if (!rawValue) {
        if (!isRequired()) {
          setError("");
          if (hiddenInput) hiddenInput.value = "";
          return {
            valid: true,
            phone: "",
            countryName: country.name,
            phoneCountry: { iso: country.iso, name: country.name, dialCode: country.dialCode },
            message: "",
          };
        }
        const message = buildRequiredMessage(country);
        if (options.report) setError(message);
        return { valid: false, message };
      }

      if (localDigits.startsWith(dialDigits)) {
        localDigits = localDigits.slice(dialDigits.length);
      }

      if (localDigits.length < country.minDigits || localDigits.length > country.maxDigits) {
        const message = buildInvalidMessage(country);
        if (options.report) setError(message);
        return { valid: false, message };
      }

      const formattedPhone = `${country.dialCode} ${localDigits}`.trim();
      if (hiddenInput) hiddenInput.value = formattedPhone;
      setError("");
      return {
        valid: true,
        phone: formattedPhone,
        countryName: country.name,
        phoneCountry: { iso: country.iso, name: country.name, dialCode: country.dialCode },
        message: "",
      };
    }

    function renderList() {
      if (!countryList) return;
      const query = String(countrySearch?.value || "").trim().toLowerCase();
      countryList.innerHTML = "";
      const filteredCountries = PHONE_COUNTRIES.filter((country) => {
        const localizedCountryName = translateText(country.name, translateTextFn).toLowerCase();
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
        emptyState.textContent = translateKey("contact.dynamic.phone.empty_search", "No encontramos ningún país con esa búsqueda.", translateKeyFn);
        countryList.append(emptyState);
        return;
      }
      filteredCountries.forEach((country) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "phone-country-option";
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", String(country.iso === selectedCountryIso));
        if (country.iso === selectedCountryIso) option.classList.add("is-active");
        option.addEventListener("click", () => {
          selectedCountryIso = country.iso;
          renderState();
          syncHiddenValue();
          validate({ report: shouldReportValidation() });
          closePanel();
        });
        const flag = document.createElement("span");
        flag.className = "phone-country-option__flag";
        flag.textContent = country.flag;
        const meta = document.createElement("span");
        meta.className = "phone-country-option__meta";
        const name = document.createElement("span");
        name.className = "phone-country-option__name";
        name.textContent = translateText(country.name, translateTextFn);
        const dial = document.createElement("span");
        dial.className = "phone-country-option__dial";
        dial.textContent = `${country.dialCode} · ${country.iso}`;
        meta.append(name, dial);
        option.append(flag, meta);
        countryList.append(option);
      });
    }

    function openPanel() {
      if (!countryPanel || !countryTrigger) return;
      countryPanel.hidden = false;
      field?.classList.add("is-open");
      countryTrigger.setAttribute("aria-expanded", "true");
      renderList();
      window.requestAnimationFrame(() => {
        countrySearch?.focus();
        countrySearch?.select();
      });
    }

    function closePanel() {
      if (!countryPanel || !countryTrigger) return;
      countryPanel.hidden = true;
      field?.classList.remove("is-open");
      countryTrigger.setAttribute("aria-expanded", "false");
    }

    function togglePanel() {
      if (countryPanel?.hidden) {
        openPanel();
        return;
      }
      closePanel();
    }

    function reset() {
      selectedCountryIso = DEFAULT_PHONE_COUNTRY_ISO;
      if (countrySearch) countrySearch.value = "";
      if (localInput) {
        localInput.value = "";
        localInput.setCustomValidity("");
      }
      if (hiddenInput) hiddenInput.value = "";
      setError("");
      renderState();
      renderList();
      closePanel();
    }

    function setValue(value, options = {}) {
      if (!localInput || !hiddenInput) return;
      if (options.onlyIfEmpty && (String(localInput.value || "").trim() || String(hiddenInput.value || "").trim())) return;
      const parsed = splitPhoneValue(value);
      selectedCountryIso = parsed.iso;
      renderState();
      localInput.value = parsed.local;
      syncHiddenValue();
      validate({ report: false });
    }

    function handleOutsideClick(event) {
      if (!field || countryPanel?.hidden) return;
      if (field.contains(event.target)) return;
      closePanel();
    }

    function handleKeydown(event) {
      if (event.key !== "Escape" || countryPanel?.hidden) return;
      closePanel();
      countryTrigger?.focus();
    }

    function initialize() {
      if (!field) return api;
      if (initialized) return api;
      countryTrigger?.addEventListener("click", togglePanel);
      countrySearch?.addEventListener("input", renderList);
      localInput?.addEventListener("input", () => {
        syncHiddenValue();
        if (errorElement && !errorElement.hidden) validate({ report: true });
      });
      localInput?.addEventListener("blur", () => {
        validate({ report: shouldReportValidation() });
      });
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("keydown", handleKeydown);
      initialized = true;
      reset();
      return api;
    }

    function refreshLanguage() {
      renderState();
      renderList();
      validate({ report: shouldReportValidation() });
    }

    const api = {
      countries: PHONE_COUNTRIES,
      defaultCountryIso: DEFAULT_PHONE_COUNTRY_ISO,
      getCountryByIso: getPhoneCountryByIso,
      getSelectedCountryIso: () => selectedCountryIso,
      setSelectedCountryIso: (iso) => {
        selectedCountryIso = getPhoneCountryByIso(iso).iso;
      },
      shouldReportValidation,
      setError,
      renderState,
      renderList,
      buildPhoneNumber,
      syncHiddenValue,
      validate,
      openPanel,
      closePanel,
      togglePanel,
      reset,
      setValue,
      refreshLanguage,
      initialize,
      splitValue: splitPhoneValue,
      handleOutsideClick,
      handleKeydown,
    };
    return api;
  }

  window.TurnoListoPhoneFields = {
    countries: PHONE_COUNTRIES,
    defaultCountryIso: DEFAULT_PHONE_COUNTRY_ISO,
    getCountryByIso: getPhoneCountryByIso,
    splitValue: splitPhoneValue,
    create: createPhoneFieldController,
  };
}

function readRestaurantsFromLocalStorage() {
  const stored = window.localStorage.getItem(RESTAURANT_STORAGE_KEY);
  if (!stored) {
    return normalizeRestaurants(defaultRestaurants);
  }

  try {
    return normalizeRestaurants(JSON.parse(stored));
  } catch {
    return normalizeRestaurants(defaultRestaurants);
  }
}

function readTrackingFromLocalStorage() {
  const stored = window.localStorage.getItem(TRACKING_STORAGE_KEY);
  if (!stored) {
    return normalizePublicTracking(defaultOrders.map((order) => buildPublicTrackingRecord(order)));
  }

  try {
    return normalizePublicTracking(JSON.parse(stored));
  } catch {
    return normalizePublicTracking(defaultOrders.map((order) => buildPublicTrackingRecord(order)));
  }
}

function loadOrders() {
  const trackingLookup = buildTrackingLookup(cachedTracking);
  return normalizeOrders(cachedOrders).map((order) => ({
    ...order,
    rating: trackingLookup.get(getTrackingLookupKey(order))?.rating || order.rating || null,
  }));
}

function loadRestaurants() {
  return normalizeRestaurants(cachedRestaurants);
}

function loadPublicOrders() {
  return normalizePublicTracking(cachedTracking);
}

function persistOrdersToLocalStorage(orders) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function persistRestaurantsToLocalStorage(restaurants) {
  window.localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(restaurants));
}

function persistTrackingToLocalStorage(tracking) {
  window.localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(tracking));
}

function clearPersistedDataStore() {
  cachedOrders = [];
  cachedRestaurants = [];
  cachedTracking = [];
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(RESTAURANT_STORAGE_KEY);
  window.localStorage.removeItem(TRACKING_STORAGE_KEY);
}

function applyOrdersSnapshot(orders) {
  cachedOrders = normalizeOrders(orders);
  persistOrdersToLocalStorage(cachedOrders);
}

function applyRestaurantsSnapshot(restaurants) {
  cachedRestaurants = normalizeRestaurants(restaurants);
  persistRestaurantsToLocalStorage(cachedRestaurants);
}

function applyTrackingSnapshot(tracking) {
  cachedTracking = normalizePublicTracking(tracking);
  persistTrackingToLocalStorage(cachedTracking);
}

function syncCachedStateFromLocalStorage() {
  cachedOrders = normalizeOrders(readOrdersFromLocalStorage());
  cachedRestaurants = normalizeRestaurants(readRestaurantsFromLocalStorage());
  cachedTracking = normalizePublicTracking(readTrackingFromLocalStorage());
}

function mergeTrackingRecord(record) {
  if (!record) return null;

  const normalizedRecord = normalizePublicTracking([record])[0] || null;
  if (!normalizedRecord) return null;

  const recordKeys = new Set(
    [
      getTrackingLookupKey(normalizedRecord.publicTrackingToken),
      getTrackingLookupKey(normalizedRecord.id),
      getTrackingLookupKey(normalizedRecord.sourceOrderId),
    ].filter(Boolean),
  );

  const nextTracking = loadPublicOrders()
    .filter((existingRecord) => {
      const existingKeys = [
        getTrackingLookupKey(existingRecord.publicTrackingToken),
        getTrackingLookupKey(existingRecord.id),
        getTrackingLookupKey(existingRecord.sourceOrderId),
      ].filter(Boolean);
      return !existingKeys.some((key) => recordKeys.has(key));
    })
    .concat(normalizedRecord);

  applyTrackingSnapshot(nextTracking);
  return normalizedRecord;
}

async function initializeDataStore() {
  applyOrdersSnapshot(readOrdersFromLocalStorage());
  applyRestaurantsSnapshot(readRestaurantsFromLocalStorage());
  applyTrackingSnapshot(readTrackingFromLocalStorage());

  await connectPublicTrackingToFirebase();
  await connectPrivateDataStoreToFirebase();
  broadcastOrdersChanged();
  return { mode: dataBackendMode };
}

function disconnectPrivateFirebaseSubscriptions() {
  ordersUnsubscribe?.();
  restaurantsUnsubscribe?.();
  trackingUnsubscribe?.();
  ordersUnsubscribe = null;
  restaurantsUnsubscribe = null;
  trackingUnsubscribe = null;
}

function preparePrivateFirebaseSignOut() {
  disconnectPrivateFirebaseSubscriptions();
  clearCurrentUserProfile();
  if (firebaseBackend?.enabled) {
    clearPersistedDataStore();
  }
  updateDataBackendMode();
}

function disconnectPublicFirebaseSubscriptions() {
  trackingUnsubscribe?.();
  trackingUnsubscribe = null;
}

function updateDataBackendMode() {
  if (!firebaseBackend?.enabled) {
    dataBackendMode = "local";
  } else if (firebaseBackend.isAuthenticated()) {
    dataBackendMode = "firebase-private";
  } else {
    dataBackendMode = "firebase-public";
  }

  window.__turnoDataBackendMode = dataBackendMode;
}

function getRequiredPrivateRole() {
  return String(window.TURNO_LISTO_PRIVATE_ROLE || document.body?.dataset?.privateRole || "").trim();
}

function getPrivateCollectionFilters(collectionName, profile = currentUserProfile) {
  if (!profile?.role || profile.role === "admin") {
    return [];
  }

  if (profile.role === "restaurant") {
    if (collectionName === FIREBASE_ORDERS_COLLECTION) {
      return profile.restaurantId ? [{ field: "restaurantId", value: profile.restaurantId }] : [];
    }

    if (collectionName === FIREBASE_RESTAURANTS_COLLECTION) {
      return profile.restaurantId ? [{ field: "id", value: profile.restaurantId }] : [];
    }

    if (collectionName === FIREBASE_TRACKING_COLLECTION) {
      return profile.restaurantId ? [{ field: "restaurantId", value: profile.restaurantId }] : [];
    }
  }

  return [];
}

async function connectPublicTrackingToFirebase() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled) {
    disconnectPublicFirebaseSubscriptions();
    firebaseBackend = null;
    updateDataBackendMode();
    return { mode: dataBackendMode };
  }

  firebaseBackend = backend;
  updateDataBackendMode();
  disconnectPublicFirebaseSubscriptions();

  return { mode: dataBackendMode };
}

async function connectPrivateDataStoreToFirebase() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled) {
    disconnectPrivateFirebaseSubscriptions();
    firebaseBackend = null;
    updateDataBackendMode();
    console.warn("TurnoListo funcionando en localStorage.", {
      reason: backend?.reason || "firebase-disabled",
      origin: window.location.origin,
      protocol: window.location.protocol,
    });
    return { mode: dataBackendMode };
  }

  if (!backend.isAuthenticated()) {
    disconnectPrivateFirebaseSubscriptions();
    firebaseBackend = backend;
    currentUserProfile = null;
    if (getRequiredPrivateRole()) {
      clearPersistedDataStore();
    }
    updateDataBackendMode();
    console.info("Firebase disponible, pendiente de autenticacion para acceder a Firestore.");
    return { mode: dataBackendMode, reason: "auth-required" };
  }

  firebaseBackend = backend;
  updateDataBackendMode();
  console.info("TurnoListo conectado a Firebase.");

  try {
    const user = firebaseBackend.getCurrentUser?.();
    const requiredRole = getRequiredPrivateRole();

    if (user?.uid) {
      currentUserProfile = await firebaseBackend.getDocument(FIREBASE_USERS_COLLECTION, user.uid);
    } else {
      currentUserProfile = null;
    }

    if (requiredRole && currentUserProfile?.role !== requiredRole) {
      disconnectPrivateFirebaseSubscriptions();
      clearPersistedDataStore();
      console.info("Sesion autenticada sin acceso privado para esta vista.", {
        requiredRole,
        currentRole: currentUserProfile?.role || null,
      });
      return { mode: dataBackendMode, reason: "role-mismatch", requiredRole, currentRole: currentUserProfile?.role || null };
    }

    const [remoteOrders, remoteRestaurants, remoteTracking] = await Promise.all([
      firebaseBackend.loadCollection(FIREBASE_ORDERS_COLLECTION, {
        filters: getPrivateCollectionFilters(FIREBASE_ORDERS_COLLECTION, currentUserProfile),
      }),
      firebaseBackend.loadCollection(FIREBASE_RESTAURANTS_COLLECTION, {
        filters: getPrivateCollectionFilters(FIREBASE_RESTAURANTS_COLLECTION, currentUserProfile),
      }),
      firebaseBackend.loadCollection(FIREBASE_TRACKING_COLLECTION, {
        filters: getPrivateCollectionFilters(FIREBASE_TRACKING_COLLECTION, currentUserProfile),
      }),
    ]);

    applyOrdersSnapshot(remoteOrders);
    applyRestaurantsSnapshot(remoteRestaurants);
    applyTrackingSnapshot(remoteTracking);
    repairMissingPublicTrackingTokens(loadOrders());
    repairPublicTrackingRecordsFromOrders(loadOrders());

    disconnectPrivateFirebaseSubscriptions();

    ordersUnsubscribe = firebaseBackend.subscribeCollection(
      FIREBASE_ORDERS_COLLECTION,
      (orders) => {
        applyOrdersSnapshot(orders.length ? orders : []);
        broadcastOrdersChanged();
      },
      { filters: getPrivateCollectionFilters(FIREBASE_ORDERS_COLLECTION, currentUserProfile) },
    );

    restaurantsUnsubscribe = firebaseBackend.subscribeCollection(
      FIREBASE_RESTAURANTS_COLLECTION,
      (restaurants) => {
        applyRestaurantsSnapshot(restaurants.length ? restaurants : []);
        broadcastOrdersChanged();
      },
      { filters: getPrivateCollectionFilters(FIREBASE_RESTAURANTS_COLLECTION, currentUserProfile) },
    );

    trackingUnsubscribe = firebaseBackend.subscribeCollection(
      FIREBASE_TRACKING_COLLECTION,
      (tracking) => {
        applyTrackingSnapshot(tracking.length ? tracking : []);
        broadcastOrdersChanged();
      },
      { filters: getPrivateCollectionFilters(FIREBASE_TRACKING_COLLECTION, currentUserProfile) },
    );
  } catch (error) {
    console.error("No se pudo inicializar Firebase. Se mantiene localStorage.", error);
    notifyFirebaseError(error, "No se pudo cargar la informacion privada de Firestore.");
    disconnectPrivateFirebaseSubscriptions();
    firebaseBackend = backend;
    updateDataBackendMode();
  }

  return { mode: dataBackendMode };
}

async function waitForFirebaseBackend() {
  const maxAttempts = 50;
  let attempt = 0;

  while (!window.__turnoFirebaseReadyPromise && attempt < maxAttempts) {
    attempt += 1;
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  if (!window.__turnoFirebaseReadyPromise) return { enabled: false, reason: "firebase-timeout" };

  try {
    return await window.__turnoFirebaseReadyPromise;
  } catch (error) {
    console.error("Error preparando Firebase.", error);
    return { enabled: false, error };
  }
}

function waitForDataReady() {
  return dataReadyPromise;
}

async function reconnectDataStoreToFirebase() {
  await connectPublicTrackingToFirebase();
  const result = await connectPrivateDataStoreToFirebase();
  broadcastOrdersChanged();
  return result;
}

async function reconnectPublicTrackingToFirebase() {
  const result = await connectPublicTrackingToFirebase();
  broadcastOrdersChanged();
  return result;
}

async function refreshOrdersFromBackend() {
  if (!firebaseBackend?.enabled) return { enabled: false, reason: "firebase-disabled" };

  try {
    const remoteOrders = await firebaseBackend.loadCollection(FIREBASE_ORDERS_COLLECTION, {
      filters: getPrivateCollectionFilters(FIREBASE_ORDERS_COLLECTION),
    });
    applyOrdersSnapshot(remoteOrders.length ? remoteOrders : []);
    broadcastOrdersChanged();
    return { enabled: true, refreshed: true };
  } catch (error) {
    console.error("No se pudieron refrescar los pedidos desde Firebase.", error);
    notifyFirebaseError(error, "No se pudieron refrescar los pedidos.");
    return { enabled: true, refreshed: false, error };
  }
}

async function refreshPublicTrackingFromBackend(publicId = "") {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled) return { enabled: false, reason: "firebase-disabled" };

  const requiredRole = getRequiredPrivateRole();

  try {
    if (requiredRole) {
      const remoteTracking = await backend.loadCollection(FIREBASE_TRACKING_COLLECTION, {
        filters: getPrivateCollectionFilters(FIREBASE_TRACKING_COLLECTION),
      });
      applyTrackingSnapshot(remoteTracking.length ? remoteTracking : []);
      broadcastOrdersChanged();
      return { enabled: true, refreshed: true, scope: "private" };
    }

    const normalizedPublicId = normalizePublicTrackingToken(publicId);
    if (!normalizedPublicId || typeof backend.loadPublicTrackingOrder !== "function") {
      return { enabled: true, refreshed: false, reason: "missing-public-id" };
    }

    const trackingRecord = await backend.loadPublicTrackingOrder(normalizedPublicId);
    applyTrackingSnapshot(trackingRecord ? [trackingRecord] : []);
    broadcastOrdersChanged();
    return { enabled: true, refreshed: true, found: Boolean(trackingRecord), scope: "public" };
  } catch (error) {
    const errorCode = String(error?.code || "").trim().toLowerCase();
    if (!requiredRole && (errorCode === "not-found" || errorCode === "functions/not-found")) {
      applyTrackingSnapshot([]);
      broadcastOrdersChanged();
      return { enabled: true, refreshed: true, found: false, scope: "public" };
    }
    console.error("No se pudo refrescar el tracking publico desde Firebase.", error);
    notifyFirebaseError(error, "No se pudo refrescar el seguimiento publico.");
    return { enabled: true, refreshed: false, error };
  }
}

function syncRestaurantsToBackend() {
  if (!firebaseBackend?.enabled) return;
}

function persistOrderDocument(order, previousOrderId = "") {
  if (!firebaseBackend?.enabled || typeof firebaseBackend.setDocument !== "function") return;

  const nextOrderId = String(order?.id || "").trim();
  if (!nextOrderId) return;

  firebaseBackend.setDocument(FIREBASE_ORDERS_COLLECTION, nextOrderId, order).catch((error) => {
    console.error("No se pudo guardar el pedido en Firebase.", error);
    notifyFirebaseError(error, "No se pudo guardar el pedido en Firebase.");
  });

  if (previousOrderId && previousOrderId !== nextOrderId && typeof firebaseBackend.deleteDocument === "function") {
    firebaseBackend.deleteDocument(FIREBASE_ORDERS_COLLECTION, previousOrderId).catch((error) => {
      console.error("No se pudo limpiar el pedido anterior en Firebase.", error);
      notifyFirebaseError(error, "No se pudo actualizar el identificador del pedido.");
    });
  }
}

function persistTrackingDocumentForOrder(order, previousOrderId = "") {
  if (!firebaseBackend?.enabled || typeof firebaseBackend.setDocument !== "function") return;

  const nextTrackingRecord = buildPublicTrackingRecord(order);
  firebaseBackend.setDocument(FIREBASE_TRACKING_COLLECTION, nextTrackingRecord.id, nextTrackingRecord).catch((error) => {
    console.error("No se pudo guardar el seguimiento publico del pedido.", error);
    notifyFirebaseError(error, "No se pudo guardar el seguimiento publico.");
  });

  if (previousOrderId && previousOrderId !== nextTrackingRecord.id && typeof firebaseBackend.deleteDocument === "function") {
    firebaseBackend.deleteDocument(FIREBASE_TRACKING_COLLECTION, previousOrderId).catch((error) => {
      console.error("No se pudo limpiar el seguimiento anterior del pedido.", error);
      notifyFirebaseError(error, "No se pudo actualizar el seguimiento publico.");
    });
  }
}

function deleteOrderDocumentsForRestaurant(orders) {
  if (!firebaseBackend?.enabled || typeof firebaseBackend.deleteDocument !== "function") return;

  orders
    .forEach((order) => {
      firebaseBackend.deleteDocument(FIREBASE_ORDERS_COLLECTION, order.id).catch((error) => {
        console.error("No se pudo eliminar un pedido del restaurante en Firebase.", error);
        notifyFirebaseError(error, "No se pudo eliminar uno de los pedidos del restaurante.");
      });

      firebaseBackend.deleteDocument(FIREBASE_TRACKING_COLLECTION, order.id).catch((error) => {
        console.error("No se pudo eliminar el tracking publico del pedido.", error);
        notifyFirebaseError(error, "No se pudo eliminar el seguimiento publico del restaurante.");
      });
    });
}

function generatePublicTrackingToken(length = PUBLIC_TRACKING_TOKEN_LENGTH) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = [];

  if (window.crypto?.getRandomValues) {
    const buffer = new Uint32Array(length);
    window.crypto.getRandomValues(buffer);
    buffer.forEach((value) => {
      values.push(alphabet[value % alphabet.length]);
    });
  } else {
    while (values.length < length) {
      values.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
  }

  return `${PUBLIC_TRACKING_TOKEN_PREFIX}-${values.join("")}`;
}

function normalizePublicTrackingToken(value) {
  return String(value || "").trim().toUpperCase();
}

function getOrderPublicTrackingToken(order) {
  const explicitToken = normalizePublicTrackingToken(order?.publicTrackingToken);
  if (explicitToken) return explicitToken;

  const legacySourceId = normalizeSourceOrderId(order?.sourceOrderId);
  if (legacySourceId) return legacySourceId;

  return normalizeSourceOrderId(order?.id);
}

function repairMissingPublicTrackingTokens(orders) {
  orders
    .filter((order) => !normalizePublicTrackingToken(order.publicTrackingToken))
    .forEach((order) => {
      persistOrderDocument(order);
      persistTrackingDocumentForOrder(order);
    });
}

function saveRestaurants(restaurants) {
  applyRestaurantsSnapshot(restaurants);
  syncRestaurantsToBackend();
  broadcastOrdersChanged();
}

function createDefaultRestaurants() {
  const activatedUntil = new Date(Date.now() + 30 * 24 * 60 * 60000).toISOString();

  return [
    {
      id: DEFAULT_RESTAURANT_ID,
      name: "Restaurante Demo",
      ownerName: "Laura Gómez",
      email: "demo@turnolisto.com",
      phone: "+34 600 123 456",
      city: "Madrid",
      address: "Calle Mayor 18",
      planName: "Mensual",
      notes: "Cuenta demo para pruebas comerciales",
      activatedAt: new Date().toISOString(),
      activatedUntil,
      username: "demo@turnolisto.com",
      createdAt: new Date().toISOString(),
    },
  ];
}

function normalizeRestaurants(restaurants) {
  return [...restaurants]
    .map((restaurant) => ({
      ownerName: "",
      email: "",
      phone: "",
      country: "",
      phoneCountry: null,
      city: "",
      address: "",
      logoUrl: "",
      planName: "Mensual",
      demoMode: false,
      demoConfig: null,
      notes: "",
      aiModelSummary: null,
      activatedAt: restaurant?.createdAt || new Date().toISOString(),
      activatedUntil: new Date(Date.now() + 30 * 24 * 60 * 60000).toISOString(),
      ...restaurant,
    }))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

function getCurrentRestaurantSession() {
  const stored = window.localStorage.getItem(RESTAURANT_SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function setCurrentRestaurantSession(restaurant) {
  const session = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    username: restaurant.username,
    activatedUntil: restaurant.activatedUntil,
  };

  window.localStorage.setItem(RESTAURANT_SESSION_KEY, JSON.stringify(session));
  broadcastOrdersChanged();
  return session;
}

function clearCurrentRestaurantSession() {
  window.localStorage.removeItem(RESTAURANT_SESSION_KEY);
  broadcastOrdersChanged();
}

function getRestaurantById(restaurantId) {
  return loadRestaurants().find((restaurant) => restaurant.id === restaurantId) || null;
}

function isDemoRestaurant(restaurant) {
  return Boolean(restaurant?.demoMode) || String(restaurant?.planName || "").trim() === DEMO_PLAN_NAME;
}

function getRestaurantDemoConfig(restaurant) {
  if (!isDemoRestaurant(restaurant)) {
    return {
      enabled: false,
      maxOrders: Number.POSITIVE_INFINITY,
      activationDays: null,
    };
  }

  const maxOrders = Math.max(1, Number.parseInt(String(restaurant?.demoConfig?.maxOrders || DEMO_DEFAULT_MAX_ORDERS), 10) || DEMO_DEFAULT_MAX_ORDERS);
  const activationDays =
    Math.max(1, Number.parseInt(String(restaurant?.demoConfig?.activationDays || DEMO_DEFAULT_DAYS), 10) || DEMO_DEFAULT_DAYS);

  return {
    enabled: true,
    maxOrders,
    activationDays,
  };
}

function getRestaurantDemoUsage(restaurant, orders = loadOrders()) {
  const config = getRestaurantDemoConfig(restaurant);
  const restaurantId = String(restaurant?.id || "");
  const usedOrders = orders.filter((order) => String(order?.restaurantId || "") === restaurantId).length;

  return {
    enabled: config.enabled,
    usedOrders,
    maxOrders: config.maxOrders,
    remainingOrders: config.enabled ? Math.max(0, config.maxOrders - usedOrders) : Number.POSITIVE_INFINITY,
    activationDays: config.activationDays,
  };
}

function isRestaurantAccessActive(restaurant) {
  if (!restaurant?.activatedUntil) return true;
  return new Date(restaurant.activatedUntil).getTime() >= Date.now();
}

function getRestaurantAccessStatus(restaurant) {
  return isRestaurantAccessActive(restaurant) ? "active" : "expired";
}

function getRestaurantRemainingDays(restaurant) {
  if (!restaurant?.activatedUntil) return null;
  const diff = new Date(restaurant.activatedUntil).getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

function extendRestaurantActivation(restaurantId, daysToAdd) {
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return null;

  const normalizedDays = Math.max(1, Number.parseInt(String(daysToAdd || "30"), 10) || 30);
  const currentUntil = restaurant.activatedUntil ? new Date(restaurant.activatedUntil).getTime() : Date.now();
  const baseTime = Math.max(currentUntil, Date.now());
  const nextActivatedUntil = new Date(baseTime + normalizedDays * 24 * 60 * 60 * 1000).toISOString();

  return updateRestaurantAccount(restaurantId, {
    activatedUntil: nextActivatedUntil,
  });
}

function normalizeRestaurantUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function restaurantUsernameExists(username) {
  const normalized = normalizeRestaurantUsername(username);
  if (!normalized) return false;
  return loadRestaurants().some((restaurant) => normalizeRestaurantUsername(restaurant.username) === normalized);
}

function createRestaurantAccount(accountData) {
  const restaurants = loadRestaurants();
  const isDemo = Boolean(accountData.demoMode);
  const activationDays = isDemo
    ? DEMO_DEFAULT_DAYS
    : Math.max(1, Number.parseInt(String(accountData.activationDays || "30"), 10) || 30);
  const activatedAt = new Date().toISOString();
  const activatedUntil = new Date(Date.now() + activationDays * 24 * 60 * 60000).toISOString();
  const restaurantId = `rest-${Date.now()}`;
  const username = normalizeRestaurantUsername(accountData.email);
  if (!username) {
    throw new Error("missing-restaurant-username");
  }

  if (restaurantUsernameExists(username)) {
    throw new Error("duplicate-restaurant-username");
  }

  const restaurant = {
    id: restaurantId,
    name: String(accountData.name || "").trim() || "Nuevo restaurante",
    ownerName: String(accountData.ownerName || "").trim(),
    email: String(accountData.email || "").trim(),
    phone: String(accountData.phone || "").trim(),
    city: String(accountData.city || "").trim(),
    address: String(accountData.address || "").trim(),
    logoUrl: String(accountData.logoUrl || "").trim(),
    planName: isDemo ? DEMO_PLAN_NAME : String(accountData.planName || "").trim() || "Mensual",
    demoMode: isDemo,
    demoConfig: isDemo
      ? {
          maxOrders: DEMO_DEFAULT_MAX_ORDERS,
          activationDays: DEMO_DEFAULT_DAYS,
        }
      : null,
    notes: String(accountData.notes || "").trim(),
    activatedAt,
    activatedUntil,
    username,
    createdAt: new Date().toISOString(),
  };

  saveRestaurants([...restaurants, restaurant]);
  return restaurant;
}

function updateRestaurantAccount(restaurantId, updates) {
  const currentRestaurant = getRestaurantById(restaurantId);
  if (!currentRestaurant) return null;

  const nextRestaurant = {
    ...currentRestaurant,
    ...updates,
    logoUrl: Object.prototype.hasOwnProperty.call(updates || {}, "logoUrl")
      ? String(updates.logoUrl || "").trim()
      : String(currentRestaurant.logoUrl || "").trim(),
  };

  const nextRestaurants = loadRestaurants().map((restaurant) => (restaurant.id === restaurantId ? nextRestaurant : restaurant));
  saveRestaurants(nextRestaurants);
  const restaurantOrders = loadOrders().filter((order) => order.restaurantId === restaurantId);
  applyTrackingSnapshot(normalizePublicTracking(loadOrders().map((order) => buildPublicTrackingRecord(order))));
  restaurantOrders.forEach((order) => {
    persistTrackingDocumentForOrder(order);
  });

  if (firebaseBackend?.enabled) {
    firebaseBackend
      .setDocument(FIREBASE_RESTAURANTS_COLLECTION, restaurantId, nextRestaurant)
      .catch((error) => {
        console.error("No se pudo actualizar el restaurante en Firebase.", error);
        notifyFirebaseError(error, "No se pudo actualizar la informacion del restaurante.");
      });
  }

  return nextRestaurant;
}

function deleteRestaurantAccount(restaurantId) {
  const nextRestaurants = loadRestaurants().filter((restaurant) => restaurant.id !== restaurantId);
  const removedOrders = loadOrders().filter((order) => order.restaurantId === restaurantId);
  const nextOrders = loadOrders().filter((order) => order.restaurantId !== restaurantId);
  const currentSession = getCurrentRestaurantSession();

  applyOrdersSnapshot(nextOrders);
  applyRestaurantsSnapshot(nextRestaurants);
  applyTrackingSnapshot(normalizePublicTracking(nextOrders.map((order) => buildPublicTrackingRecord(order))));
  deleteOrderDocumentsForRestaurant(removedOrders);
  if (firebaseBackend?.enabled && typeof firebaseBackend.deleteDocument === "function") {
    firebaseBackend.deleteDocument(FIREBASE_RESTAURANTS_COLLECTION, restaurantId).catch((error) => {
      console.error("No se pudo eliminar el restaurante en Firebase.", error);
      notifyFirebaseError(error, "No se pudo eliminar el restaurante en Firebase.");
    });
  }

  if (currentSession?.restaurantId === restaurantId) {
    clearCurrentRestaurantSession();
    return;
  }

  broadcastOrdersChanged();
}

function buildOrderTrackingId(restaurantId, sourceOrderId) {
  return normalizeSourceOrderId(sourceOrderId);
}

async function loadCurrentUserProfileFromBackend() {
  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.getDocument !== "function") {
    currentUserProfile = null;
    return null;
  }

  const user = backend.getCurrentUser?.();
  if (!user?.uid) {
    currentUserProfile = null;
    return null;
  }

  currentUserProfile = await backend.getDocument(FIREBASE_USERS_COLLECTION, user.uid);
  return currentUserProfile;
}

function getCurrentUserProfile() {
  return currentUserProfile;
}

function clearCurrentUserProfile() {
  currentUserProfile = null;
}

function createDefaultOrders() {
  const now = Date.now();

  return [
    {
      restaurantId: DEFAULT_RESTAURANT_ID,
      id: buildOrderTrackingId(DEFAULT_RESTAURANT_ID, "POS-801"),
      orderNumber: "#2048",
      sourceOrderId: "POS-801",
      sourceSystem: "TPV mostrador",
      customerName: "Ana",
      items: "Burger doble + patatas",
      pickupPoint: "Mostrador 2",
      estimatedReadyMinutes: 12,
      promisedReadyAt: new Date(now + 6 * 60000).toISOString(),
      status: "received",
      notes: "Sin cebolla",
      rating: null,
      publicTrackingToken: "TL-ANA2048Q2Z9",
      createdAt: new Date(now - 6 * 60000).toISOString(),
      archivedAt: null,
    },
    {
      restaurantId: DEFAULT_RESTAURANT_ID,
      id: buildOrderTrackingId(DEFAULT_RESTAURANT_ID, "POS-802"),
      orderNumber: "#2049",
      sourceOrderId: "POS-802",
      sourceSystem: "Glovo manual",
      customerName: "Luis",
      items: "Poke salmon",
      pickupPoint: "Mostrador 1",
      estimatedReadyMinutes: 20,
      promisedReadyAt: new Date(now + 2 * 60000).toISOString(),
      status: "preparing",
      notes: "",
      rating: null,
      publicTrackingToken: "TL-LUIS2049R7MX",
      createdAt: new Date(now - 18 * 60000).toISOString(),
      archivedAt: null,
    },
    {
      restaurantId: DEFAULT_RESTAURANT_ID,
      id: buildOrderTrackingId(DEFAULT_RESTAURANT_ID, "POS-803"),
      orderNumber: "#2050",
      sourceOrderId: "POS-803",
      sourceSystem: "TPV mostrador",
      customerName: "Marta",
      items: "Pizza trufa",
      pickupPoint: "Pickup express",
      estimatedReadyMinutes: 25,
      promisedReadyAt: new Date(now - 7 * 60000).toISOString(),
      status: "ready",
      notes: "Avisar cuando llegue",
      rating: null,
      publicTrackingToken: "TL-MARTA2050K4P",
      createdAt: new Date(now - 32 * 60000).toISOString(),
      archivedAt: null,
    },
    {
      restaurantId: DEFAULT_RESTAURANT_ID,
      id: buildOrderTrackingId(DEFAULT_RESTAURANT_ID, "POS-799"),
      orderNumber: "#2051",
      sourceOrderId: "POS-799",
      sourceSystem: "Uber Eats manual",
      customerName: "Pablo",
      items: "Menu veggie",
      pickupPoint: "Mostrador 3",
      estimatedReadyMinutes: 18,
      promisedReadyAt: new Date(now - 22 * 60000).toISOString(),
      status: "delivered",
      notes: "",
      rating: {
        score: 5,
        comment: "",
        createdAt: new Date(now - 8 * 60000).toISOString(),
      },
      publicTrackingToken: "TL-PABLO2051N8W",
      createdAt: new Date(now - 40 * 60000).toISOString(),
      archivedAt: new Date(now - 3 * 60000).toISOString(),
    },
  ];
}

function saveOrders(orders) {
  applyOrdersSnapshot(orders);
  applyTrackingSnapshot(normalizePublicTracking(orders.map((order) => buildPublicTrackingRecord(order))));
  syncAdaptiveModelSummariesFromOrders(orders);
  broadcastOrdersChanged();
}

function normalizeOrders(orders) {
  return [...orders]
    .map((order) => ({
      restaurantId: DEFAULT_RESTAURANT_ID,
      sourceOrderId: "",
      sourceSystem: "Alta manual",
      pickupPoint: "",
      estimatedReadyMinutes: null,
      promisedReadyAt: order?.createdAt || new Date().toISOString(),
      notes: "",
      rating: null,
      publicTrackingToken: generatePublicTrackingToken(),
      archivedAt: null,
      statusDurations: {},
      statusStartedAt: order?.createdAt || new Date().toISOString(),
      timelineEvents: [],
      lifecycleMilestones: {
        createdAt: order?.createdAt || new Date().toISOString(),
        receivedAt: order?.createdAt || new Date().toISOString(),
        preparingAt: null,
        readyAt: null,
        deliveredAt: null,
        cancelledAt: null,
        archivedAt: order?.archivedAt || null,
      },
      aiTrainingSnapshot: null,
      predictionTrainingRecord: null,
      ...order,
      id:
        order.id ||
        buildOrderTrackingId(order.restaurantId || DEFAULT_RESTAURANT_ID, order.sourceOrderId || order.orderNumber || ""),
    }))
    .map((order) => ({
      ...order,
      lifecycleMilestones: buildLifecycleMilestones(
        order,
        { status: order.status, archivedAt: order.archivedAt },
        order.statusStartedAt || order.createdAt,
      ),
      predictionTrainingRecord: order.predictionTrainingRecord || buildPredictionTrainingRecord(order),
    }))
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
}

function getOrderById(id) {
  return loadOrders().find((order) => order.id === id);
}

function getOrderByPublicId(value) {
  const normalized = normalizePublicTrackingToken(value);
  if (!normalized) return null;

  return (
    loadOrders().find(
      (order) =>
        getOrderPublicTrackingToken(order) === normalized ||
        normalizeSourceOrderId(order.sourceOrderId) === normalized ||
        normalizeSourceOrderId(order.id) === normalized,
    ) || null
  );
}

function getPublicOrderById(id) {
  return loadPublicOrders().find((order) => {
    if (order.id !== id) return false;
    if (!order.archivedAt) return true;
    return order.status === "delivered";
  });
}

function getPublicOrderByPublicId(value) {
  const normalized = normalizePublicTrackingToken(value);
  if (!normalized) return null;

  return (
    loadPublicOrders().find((order) => {
      const matchesToken = normalizePublicTrackingToken(order.publicTrackingToken) === normalized;
      const matchesPublicId = normalizeSourceOrderId(order.sourceOrderId) === normalized;
      const matchesLegacyId = normalizeSourceOrderId(order.id) === normalized;
      if (!matchesToken && !matchesPublicId && !matchesLegacyId) return false;
      if (!order.archivedAt) return true;
      return order.status === "delivered";
    }) || null
  );
}

function normalizeSourceOrderId(value) {
  return String(value || "").trim().toUpperCase();
}

function sourceOrderIdExists(sourceOrderId, excludedOrderId = null) {
  const normalized = normalizeSourceOrderId(sourceOrderId);
  if (!normalized) return false;

  return loadOrders().some((order) => {
    if (excludedOrderId && order.id === excludedOrderId) return false;
    return normalizeSourceOrderId(order.sourceOrderId) === normalized;
  });
}

function buildPromisedReadyAt(createdAt, estimatedReadyMinutes) {
  const parsedMinutes = Number.parseInt(String(estimatedReadyMinutes || ""), 10);
  if (!Number.isFinite(parsedMinutes) || parsedMinutes <= 0) {
    return "";
  }

  const normalizedMinutes = Math.max(1, parsedMinutes);
  const baseDate = new Date(createdAt || new Date().toISOString());
  return new Date(baseDate.getTime() + normalizedMinutes * 60000).toISOString();
}

function getRemainingEstimatedMinutes(order) {
  const promisedReadyAt = String(order?.promisedReadyAt || "").trim();
  if (!promisedReadyAt) return null;
  return Math.ceil((new Date(promisedReadyAt).getTime() - Date.now()) / 60000);
}

function resolveOrderPromiseReferenceAt(order) {
  return (
    order?.lifecycleMilestones?.readyAt ||
    order?.lifecycleMilestones?.deliveredAt ||
    order?.archivedAt ||
    ""
  );
}

function getOrderPromiseDelayMinutes(order) {
  const promisedReadyAt = String(order?.promisedReadyAt || "").trim();
  if (!promisedReadyAt) return null;

  const promisedTimestamp = new Date(promisedReadyAt).getTime();
  if (!Number.isFinite(promisedTimestamp)) return null;

  const referenceAt = resolveOrderPromiseReferenceAt(order);
  const referenceTimestamp = referenceAt ? new Date(referenceAt).getTime() : Date.now();
  if (!Number.isFinite(referenceTimestamp)) return null;

  return Math.max(0, Math.ceil((referenceTimestamp - promisedTimestamp) / 60000));
}

function isOrderResolvedWithinPromise(order) {
  const referenceAt = resolveOrderPromiseReferenceAt(order);
  const promisedReadyAt = String(order?.promisedReadyAt || "").trim();
  if (!referenceAt || !promisedReadyAt) return false;

  const referenceTimestamp = new Date(referenceAt).getTime();
  const promisedTimestamp = new Date(promisedReadyAt).getTime();
  if (!Number.isFinite(referenceTimestamp) || !Number.isFinite(promisedTimestamp)) return false;

  return referenceTimestamp <= promisedTimestamp;
}

function buildAiTrainingSnapshot(order, allOrders = loadOrders(), eventTime = new Date().toISOString()) {
  const restaurantId = String(order?.restaurantId || DEFAULT_RESTAURANT_ID);
  const eventDate = new Date(eventTime || new Date().toISOString());
  const activeOrders = allOrders.filter(
    (item) => String(item?.restaurantId || DEFAULT_RESTAURANT_ID) === restaurantId && !item?.archivedAt,
  );
  const preparingOrders = activeOrders.filter((item) => item.status === "preparing").length;
  const readyOrders = activeOrders.filter((item) => item.status === "ready").length;
  const overdueOrders = activeOrders.filter((item) => {
    const remaining = getRemainingEstimatedMinutes(item);
    return remaining !== null ? remaining <= 0 : getOrderDurationMinutes(item) >= 16;
  }).length;

  return {
    capturedAt: eventDate.toISOString(),
    restaurantId,
    activeOrders: activeOrders.length,
    preparingOrders,
    readyOrders,
    overdueOrders,
    hourOfDay: eventDate.getHours(),
    dayOfWeek: eventDate.getDay(),
    peakLoadScore: getPeakDemandLoad(eventDate),
    estimatedReadyMinutes: Number(order?.estimatedReadyMinutes || 0) || null,
    currentStatus: String(order?.status || ""),
  };
}

function appendOrderTimelineEvent(order, event) {
  const timeline = Array.isArray(order?.timelineEvents) ? [...order.timelineEvents] : [];
  timeline.push(event);
  return timeline.sort((left, right) => new Date(left.at) - new Date(right.at));
}

function buildLifecycleMilestones(order, updates = {}, eventTime = new Date().toISOString()) {
  const nextMilestones = {
    createdAt: order?.lifecycleMilestones?.createdAt || order?.createdAt || eventTime,
    receivedAt: order?.lifecycleMilestones?.receivedAt || order?.createdAt || eventTime,
    preparingAt: order?.lifecycleMilestones?.preparingAt || null,
    readyAt: order?.lifecycleMilestones?.readyAt || null,
    deliveredAt: order?.lifecycleMilestones?.deliveredAt || null,
    cancelledAt: order?.lifecycleMilestones?.cancelledAt || null,
    archivedAt: order?.lifecycleMilestones?.archivedAt || null,
  };

  const nextStatus = String(updates.status || order?.status || "");
  if (nextStatus === "preparing" && !nextMilestones.preparingAt) nextMilestones.preparingAt = eventTime;
  if (nextStatus === "ready" && !nextMilestones.readyAt) nextMilestones.readyAt = eventTime;
  if (nextStatus === "delivered") {
    nextMilestones.deliveredAt = eventTime;
    if (!nextMilestones.readyAt) nextMilestones.readyAt = eventTime;
  }
  if (nextStatus === "cancelled") {
    nextMilestones.cancelledAt = eventTime;
  }

  const nextArchivedAt = updates.archivedAt ?? order?.archivedAt ?? null;
  if (nextArchivedAt) nextMilestones.archivedAt = nextArchivedAt;

  return nextMilestones;
}

function buildPredictionTrainingRecord(order) {
  const milestones = order?.lifecycleMilestones || {};
  const createdAt = order?.createdAt || milestones.createdAt || null;
  const toMinutes = (from, to) => {
    if (!from || !to) return null;
    return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000));
  };

  return {
    createdAt,
    readyAt: milestones.readyAt || null,
    deliveredAt: milestones.deliveredAt || null,
    cancelledAt: milestones.cancelledAt || null,
    minutesToReady: toMinutes(createdAt, milestones.readyAt),
    minutesToDelivered: toMinutes(createdAt, milestones.deliveredAt),
    finalStatus: order?.status || "",
    estimatedReadyMinutes: Number(order?.estimatedReadyMinutes || 0) || null,
  };
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calculateMedian(values) {
  const safeValues = [...values]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0)
    .sort((left, right) => left - right);

  if (!safeValues.length) return 0;
  const middle = Math.floor(safeValues.length / 2);
  if (safeValues.length % 2) return safeValues[middle];
  return Math.round((safeValues[middle - 1] + safeValues[middle]) / 2);
}

function resolveAdaptiveTrainingReferenceAt(order) {
  return (
    order?.lifecycleMilestones?.readyAt ||
    order?.lifecycleMilestones?.deliveredAt ||
    order?.archivedAt ||
    order?.createdAt ||
    ""
  );
}

function getAdaptiveModelTrainingOrders(orders, restaurantId) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeRestaurantId = String(restaurantId || DEFAULT_RESTAURANT_ID);

  return safeOrders
    .filter((order) => String(order?.restaurantId || DEFAULT_RESTAURANT_ID) === safeRestaurantId)
    .filter((order) => isWithinLastDays(resolveAdaptiveTrainingReferenceAt(order), ADAPTIVE_MODEL_LOOKBACK_DAYS))
    .sort((left, right) => new Date(resolveAdaptiveTrainingReferenceAt(right)) - new Date(resolveAdaptiveTrainingReferenceAt(left)))
    .slice(0, ADAPTIVE_MODEL_MAX_EXAMPLES);
}

function buildAdaptiveModelFeatureVector(snapshot = {}) {
  const hour = Number(snapshot.hourOfDay || 0);
  const cycle = (hour / 24) * Math.PI * 2;
  const isWeekend = [0, 6].includes(Number(snapshot.dayOfWeek));

  return [
    1,
    clampNumber((Number(snapshot.estimatedReadyMinutes || 12) || 12) / 25, 0, 4),
    clampNumber((Number(snapshot.activeOrders || 0) || 0) / 8, 0, 3),
    clampNumber((Number(snapshot.preparingOrders || 0) || 0) / 6, 0, 3),
    clampNumber((Number(snapshot.readyOrders || 0) || 0) / 5, 0, 3),
    clampNumber((Number(snapshot.overdueOrders || 0) || 0) / 4, 0, 3),
    clampNumber((Number(snapshot.peakLoadScore || 0) || 0) / 2, 0, 2),
    Math.sin(cycle),
    Math.cos(cycle),
    isWeekend ? 1 : 0,
  ];
}

function extractAdaptiveModelExamples(orders, restaurantId) {
  return orders
    .filter((order) => String(order?.restaurantId || DEFAULT_RESTAURANT_ID) === restaurantId)
    .map((order) => {
      const snapshot = order?.aiTrainingSnapshot || null;
      const record = order?.predictionTrainingRecord || buildPredictionTrainingRecord(order);
      const targetMinutes = Number(record.minutesToReady);

      if (!snapshot || !Number.isFinite(targetMinutes) || targetMinutes <= 0) return null;

      return {
        order,
        snapshot,
        targetMinutes,
        features: buildAdaptiveModelFeatureVector(snapshot),
      };
    })
    .filter(Boolean);
}

function trainAdaptiveEtaModel(examples) {
  if (!examples.length) {
    return {
      weights: [],
      baselineMinutes: 12,
      meanAbsoluteError: null,
      sampleCount: 0,
    };
  }

  const featureCount = examples[0].features.length;
  const averageTarget = Math.round(
    examples.reduce((total, example) => total + example.targetMinutes, 0) / examples.length,
  );
  const weights = new Array(featureCount).fill(0);
  weights[0] = averageTarget;
  const learningRate = 0.045;
  const regularization = 0.0015;

  for (let epoch = 0; epoch < 280; epoch += 1) {
    for (const example of examples) {
      const prediction = example.features.reduce((total, value, index) => total + value * weights[index], 0);
      const error = prediction - example.targetMinutes;

      for (let index = 0; index < featureCount; index += 1) {
        const penalty = index === 0 ? 0 : regularization * weights[index];
        weights[index] -= learningRate * ((error * example.features[index]) / examples.length + penalty);
      }
    }
  }

  const meanAbsoluteError =
    Math.round(
      (examples.reduce((total, example) => {
        const prediction = example.features.reduce((sum, value, index) => sum + value * weights[index], 0);
        return total + Math.abs(prediction - example.targetMinutes);
      }, 0) /
        examples.length) *
        10,
    ) / 10;

  return {
    weights,
    baselineMinutes: averageTarget,
    meanAbsoluteError,
    sampleCount: examples.length,
  };
}

function evaluateAdaptiveEtaModel(model, snapshot) {
  if (!Array.isArray(model?.weights) || !model.weights.length) {
    return clampNumber(Math.round(Number(snapshot?.estimatedReadyMinutes || 12) || 12), 4, 120);
  }

  const features = buildAdaptiveModelFeatureVector(snapshot);
  const prediction = features.reduce((total, value, index) => total + value * model.weights[index], 0);
  const estimatedReadyMinutes = Number(snapshot?.estimatedReadyMinutes || 12) || 12;
  return clampNumber(Math.round(prediction), Math.max(4, Math.round(estimatedReadyMinutes * 0.55)), 120);
}

function buildAdaptiveRestaurantModel(restaurantId, allOrders = loadOrders()) {
  const safeRestaurantId = String(restaurantId || DEFAULT_RESTAURANT_ID);
  const restaurantOrders = getAdaptiveModelTrainingOrders(allOrders, safeRestaurantId);
  const examples = extractAdaptiveModelExamples(restaurantOrders, safeRestaurantId);
  const etaModel = trainAdaptiveEtaModel(examples);
  const readyExamples = restaurantOrders.filter((order) => Number.isFinite(order?.predictionTrainingRecord?.minutesToReady));
  const deliveredExamples = restaurantOrders.filter((order) => Number.isFinite(order?.predictionTrainingRecord?.minutesToDelivered));
  const receivedMedian = calculateMedian(
    restaurantOrders
      .map((order) => getStatusDurationMinutes(order, "received"))
      .filter((value) => Number.isFinite(value) && value > 0),
  );
  const preparingMedian = calculateMedian(
    restaurantOrders
      .map((order) => getStatusDurationMinutes(order, "preparing"))
      .filter((value) => Number.isFinite(value) && value > 0),
  );
  const readyMedian = calculateMedian(
    restaurantOrders
      .map((order) => getStatusDurationMinutes(order, "ready"))
      .filter((value) => Number.isFinite(value) && value > 0),
  );
  const volumeScore = clampNumber(examples.length / 24, 0, 1);
  const accuracyScore = etaModel.meanAbsoluteError === null ? 0 : clampNumber(1 - etaModel.meanAbsoluteError / 18, 0, 1);
  const confidenceScore = Math.round((volumeScore * 0.55 + accuracyScore * 0.45) * 100);
  const confidenceLabel =
    examples.length < 5
      ? "Aprendiendo"
      : confidenceScore >= 78
        ? "Alta"
        : confidenceScore >= 52
          ? "Media"
          : "Aprendiendo";
  const adaptiveWeight = examples.length >= 6 ? clampNumber(0.35 + examples.length / 70, 0.35, 0.82) : 0;

  return {
    restaurantId: safeRestaurantId,
    sampleCount: examples.length,
    readySampleCount: readyExamples.length,
    deliveredSampleCount: deliveredExamples.length,
    meanAbsoluteError: etaModel.meanAbsoluteError,
    confidenceScore,
    confidenceLabel,
    adaptiveWeight,
    stageBaselines: {
      received: receivedMedian || 6,
      preparing: preparingMedian || 9,
      ready: readyMedian || 5,
    },
    predictReadyMinutes(snapshot) {
      return evaluateAdaptiveEtaModel(etaModel, snapshot);
    },
  };
}

function buildAdaptiveRestaurantModelSummary(model) {
  return {
    updatedAt: new Date().toISOString(),
    sampleCount: Number(model?.sampleCount || 0),
    readySampleCount: Number(model?.readySampleCount || 0),
    deliveredSampleCount: Number(model?.deliveredSampleCount || 0),
    confidenceScore: Number(model?.confidenceScore || 0),
    confidenceLabel: String(model?.confidenceLabel || "Aprendiendo"),
    meanAbsoluteError: model?.meanAbsoluteError ?? null,
    adaptiveWeight: Number(model?.adaptiveWeight || 0),
    stageBaselines: {
      received: Number(model?.stageBaselines?.received || 0),
      preparing: Number(model?.stageBaselines?.preparing || 0),
      ready: Number(model?.stageBaselines?.ready || 0),
    },
  };
}

function syncAdaptiveModelSummariesFromOrders(orders, currentRestaurants = loadRestaurants()) {
  const safeOrders = Array.isArray(orders) ? orders : loadOrders();
  const restaurants = Array.isArray(currentRestaurants) ? currentRestaurants : loadRestaurants();
  let changed = false;

  const nextRestaurants = restaurants.map((restaurant) => {
    const model = buildAdaptiveRestaurantModel(restaurant.id, safeOrders);
    const nextSummary = buildAdaptiveRestaurantModelSummary(model);
    const previousSummary = restaurant?.aiModelSummary || null;

    if (JSON.stringify(previousSummary) === JSON.stringify(nextSummary)) {
      return restaurant;
    }

    changed = true;
    const nextRestaurant = {
      ...restaurant,
      aiModelSummary: nextSummary,
    };

    if (firebaseBackend?.enabled && typeof firebaseBackend.setDocument === "function") {
      firebaseBackend.setDocument(FIREBASE_RESTAURANTS_COLLECTION, restaurant.id, nextRestaurant).catch((error) => {
        console.error("No se pudo guardar el resumen IA del restaurante en Firebase.", error);
        notifyFirebaseError(error, "No se pudo actualizar el resumen IA del restaurante.");
      });
    }

    return nextRestaurant;
  });

  if (changed) {
    applyRestaurantsSnapshot(nextRestaurants);
  }

  return nextRestaurants;
}

function getStageAlertThresholds(order, status, model = null) {
  const estimatedReadyMinutes = Number.parseInt(String(order?.estimatedReadyMinutes || ""), 10);
  const safeEstimatedReadyMinutes = Number.isFinite(estimatedReadyMinutes) && estimatedReadyMinutes > 0 ? estimatedReadyMinutes : 12;
  const stageBaselines = model?.stageBaselines || {};

  if (status === "received") {
    return {
      warning: Math.max(6, Math.round((stageBaselines.received || safeEstimatedReadyMinutes * 0.35) * 1.35)),
      critical: Math.max(12, Math.round((stageBaselines.received || safeEstimatedReadyMinutes * 0.45) * 2.1)),
    };
  }

  if (status === "preparing") {
    return {
      warning: Math.max(8, Math.round((stageBaselines.preparing || safeEstimatedReadyMinutes * 0.7) * 1.35)),
      critical: Math.max(14, Math.round((stageBaselines.preparing || safeEstimatedReadyMinutes * 0.9) * 2)),
    };
  }

  if (status === "ready") {
    return {
      warning: Math.max(6, Math.round((stageBaselines.ready || 6) * 1.5)),
      critical: Math.max(12, Math.round((stageBaselines.ready || 8) * 2.4)),
    };
  }

  return {
    warning: safeEstimatedReadyMinutes,
    critical: safeEstimatedReadyMinutes + 8,
  };
}

function getStageDriftAssessment(order, model = null) {
  const status = String(order?.status || "");
  const stageMinutes = getStatusDurationMinutes(order, status);
  const receivedMinutes = getStatusDurationMinutes(order, "received");
  const preparingMinutes = getStatusDurationMinutes(order, "preparing");
  const readyMinutes = getStatusDurationMinutes(order, "ready");
  const { warning, critical } = getStageAlertThresholds(order, status, model);

  let severity = "normal";
  let extraPressure = 0;
  let reason = "";

  if (status === "ready") {
    if (stageMinutes >= critical || readyMinutes >= critical) {
      severity = "critical";
      extraPressure = 6;
      reason = "El pedido lleva demasiado tiempo listo para recoger y ya impacta en la operativa.";
    } else if (stageMinutes >= warning || readyMinutes >= warning) {
      severity = "warning";
      extraPressure = 3;
      reason = "El pedido ya esta listo, pero acumula espera para la recogida.";
    }
  } else if (status === "received") {
    if (stageMinutes >= critical) {
      severity = "critical";
      extraPressure = 5;
      reason = "El pedido sigue en recibido demasiado tiempo y parece bloqueado antes de entrar en cocina.";
    } else if (stageMinutes >= warning) {
      severity = "warning";
      extraPressure = 2;
      reason = "El pedido tarda mas de lo normal en pasar de recibido a preparacion.";
    }
  } else if (status === "preparing") {
    if (stageMinutes >= critical) {
      severity = "critical";
      extraPressure = 5;
      reason = "La preparacion esta tardando demasiado y el pedido muestra un atasco claro.";
    } else if (stageMinutes >= warning) {
      severity = "warning";
      extraPressure = 2;
      reason = "La preparacion ya se esta alargando por encima de una ventana saludable.";
    }
  }

  if (status === "ready" && receivedMinutes >= 30) {
    severity = "critical";
    extraPressure = Math.max(extraPressure, 6);
    reason = "Aunque ya figura listo, el recorrido acumula demasiada espera desde recibido y requiere intervencion.";
  }

  if (status === "ready" && preparingMinutes > 0 && receivedMinutes >= preparingMinutes * 2.5) {
    severity = "critical";
    extraPressure = Math.max(extraPressure, 5);
    reason = "La secuencia temporal es anomala: el pedido estuvo demasiado tiempo detenido antes de avanzar.";
  }

  return {
    severity,
    extraPressure,
    reason,
    stageMinutes,
    receivedMinutes,
    preparingMinutes,
    readyMinutes,
  };
}

function getStageFocusAssessment(order, model = null) {
  const status = String(order?.status || "");
  const receivedMinutes = getStatusDurationMinutes(order, "received");
  const preparingMinutes = getStatusDurationMinutes(order, "preparing");
  const readyMinutes = getStatusDurationMinutes(order, "ready");
  const baselines = model?.stageBaselines || {};
  const weightedStages = [
    {
      stage: "received",
      label: "entrada a cocina",
      minutes: receivedMinutes,
      baseline: Math.max(1, Number(baselines.received || 6)),
      recommendation: "Mete este pedido en cocina o confirma stock antes de que siga acumulando espera en recibido.",
    },
    {
      stage: "preparing",
      label: "preparacion",
      minutes: preparingMinutes,
      baseline: Math.max(1, Number(baselines.preparing || 9)),
      recommendation: "Redistribuye carga en cocina: aqui esta el atasco principal y la IA espera mas deriva si no se corrige.",
    },
    {
      stage: "ready",
      label: "recogida",
      minutes: readyMinutes,
      baseline: Math.max(1, Number(baselines.ready || 5)),
      recommendation: "Activa llamada o entrega inmediata: el pedido ya esta listo y ahora depende de recogida o entrega.",
    },
  ].map((item) => ({
    ...item,
    ratio: item.minutes > 0 ? item.minutes / item.baseline : 0,
  }));

  if (status === "ready") {
    const readyStage = weightedStages.find((item) => item.stage === "ready");
    return readyStage || {
      stage: "ready",
      label: "recogida",
      ratio: 1,
      recommendation: "Activa llamada o entrega inmediata: el pedido ya esta listo y ahora depende de recogida o entrega.",
    };
  }

  const worstStage = [...weightedStages].sort((left, right) => right.ratio - left.ratio)[0];
  if (!worstStage || worstStage.ratio < 1.15) {
    return {
      stage: "",
      label: "",
      ratio: 0,
      recommendation: "",
    };
  }

  return worstStage;
}

function getPeakDemandLoad(dateLike = new Date()) {
  const hour = new Date(dateLike).getHours();
  if ([12, 13, 14, 20, 21].includes(hour)) return 2;
  if ([11, 15, 19, 22].includes(hour)) return 1;
  return 0;
}

function enrichOrdersWithIntelligence(orders, options = {}) {
  const safeOrders = Array.isArray(orders) ? [...orders] : [];
  const allOrders = Array.isArray(options.allOrders) ? options.allOrders : loadOrders();
  const groupedByRestaurant = safeOrders.reduce((accumulator, order) => {
    const restaurantId = String(order?.restaurantId || DEFAULT_RESTAURANT_ID);
    if (!accumulator.has(restaurantId)) accumulator.set(restaurantId, []);
    accumulator.get(restaurantId).push(order);
    return accumulator;
  }, new Map());
  const restaurantModels = new Map(
    [...groupedByRestaurant.keys()].map((restaurantId) => [restaurantId, buildAdaptiveRestaurantModel(restaurantId, allOrders)]),
  );

  return safeOrders.map((order) => {
    const restaurantId = String(order?.restaurantId || DEFAULT_RESTAURANT_ID);
    const restaurantOrders = groupedByRestaurant.get(restaurantId) || [];
    const history = allOrders.filter((item) => String(item?.restaurantId || DEFAULT_RESTAURANT_ID) === restaurantId);
    const intelligence = buildOrderIntelligence(order, restaurantOrders, history, restaurantModels.get(restaurantId));
    return {
      ...order,
      aiEtaMinutes: intelligence.aiEtaMinutes,
      aiRiskLevel: intelligence.aiRiskLevel,
      aiPriorityScore: intelligence.aiPriorityScore,
      aiReason: intelligence.aiReason,
      aiPressureScore: intelligence.aiPressureScore,
      aiPressureLabel: intelligence.aiPressureLabel,
      aiBottleneckStage: intelligence.aiBottleneckStage,
      aiBottleneckLabel: intelligence.aiBottleneckLabel,
      aiRecommendation: intelligence.aiRecommendation,
      aiModelConfidenceLabel: intelligence.aiModelConfidenceLabel,
      aiModelConfidenceScore: intelligence.aiModelConfidenceScore,
      aiModelSampleSize: intelligence.aiModelSampleSize,
      aiModelMeanAbsoluteError: intelligence.aiModelMeanAbsoluteError,
      aiUpdatedAt: intelligence.aiUpdatedAt,
    };
  });
}

function buildOrderIntelligence(order, activeOrders = [], history = [], model = null) {
  const status = String(order?.status || "");
  const elapsedMinutes = getOrderDurationMinutes(order);
  const estimatedReadyMinutes = Number.parseInt(String(order?.estimatedReadyMinutes || ""), 10);
  const safeEstimatedReadyMinutes = Number.isFinite(estimatedReadyMinutes) && estimatedReadyMinutes > 0 ? estimatedReadyMinutes : null;
  const promisedRemainingMinutes = getRemainingEstimatedMinutes(order);
  const currentActiveOrders = activeOrders.filter((item) => !item?.archivedAt && !["delivered", "cancelled"].includes(item?.status));
  const preparingOrders = currentActiveOrders.filter((item) => item.status === "preparing").length;
  const overdueOrders = currentActiveOrders.filter((item) => {
    const remaining = getRemainingEstimatedMinutes(item);
    return remaining !== null ? remaining <= 0 : getOrderDurationMinutes(item) >= 16;
  }).length;
  const deliveredTodayHistory = filterOrdersByDashboardPeriod(
    history.filter((item) => item?.status === "delivered"),
    "day",
    { dateField: "archivedAt" },
  );
  const sameDayDelayMinutes = deliveredTodayHistory.length
    ? Math.round(
        deliveredTodayHistory.reduce((total, item) => {
          const estimatedMinutes = Number.parseInt(String(item?.estimatedReadyMinutes || ""), 10);
          if (!Number.isFinite(estimatedMinutes) || estimatedMinutes <= 0) return total;
          return total + Math.max(0, getOrderDurationMinutes(item) - estimatedMinutes);
        }, 0) / deliveredTodayHistory.length,
      )
    : 0;
  const peakDemandLoad = getPeakDemandLoad(new Date());
  const loadPressure = currentActiveOrders.length >= 8 ? 4 : currentActiveOrders.length >= 6 ? 3 : currentActiveOrders.length >= 4 ? 2 : currentActiveOrders.length >= 2 ? 1 : 0;
  const prepPressure = preparingOrders >= 4 ? 2 : preparingOrders >= 2 ? 1 : 0;
  const overduePressure = overdueOrders >= 3 ? 3 : overdueOrders >= 1 ? 1 : 0;
  const sameDayDelayPressure = clampNumber(Math.round(sameDayDelayMinutes * 0.6), 0, 6);
  const liveSnapshot = buildAiTrainingSnapshot(order, currentActiveOrders, new Date().toISOString());
  const stageDrift = getStageDriftAssessment(order, model);
  const stageFocus = getStageFocusAssessment(order, model);
  const queuePressure = loadPressure + prepPressure + overduePressure + peakDemandLoad + sameDayDelayPressure + stageDrift.extraPressure;
  const fallbackRemaining = safeEstimatedReadyMinutes ? Math.max(1, safeEstimatedReadyMinutes - elapsedMinutes) : 6;
  const baseRemainingMinutes =
    promisedRemainingMinutes === null ? fallbackRemaining : Math.max(0, promisedRemainingMinutes);
  const heuristicRemaining = Math.max(1, baseRemainingMinutes + queuePressure + (status === "received" ? 1 : 0));
  const adaptiveTotalReadyMinutes = model?.sampleCount ? model.predictReadyMinutes(liveSnapshot) : null;
  const adaptiveRemainingMinutes =
    adaptiveTotalReadyMinutes === null ? null : Math.max(0, adaptiveTotalReadyMinutes - elapsedMinutes);
  const modelWeight = Number(model?.adaptiveWeight || 0);
  let aiEtaMinutes =
    status === "ready"
      ? 0
      : adaptiveRemainingMinutes === null || modelWeight === 0
        ? heuristicRemaining
        : Math.max(1, Math.round(adaptiveRemainingMinutes * modelWeight + heuristicRemaining * (1 - modelWeight)));
  let aiRiskLevel = "low";
  let aiReason = "El pedido va dentro de una ventana operativa saludable.";
  let aiRecommendation = stageFocus.recommendation || "Mantener el flujo actual y seguir cerrando pedidos para que la IA refine mejor sus decisiones.";

  if (status === "ready") {
    aiReason = "Pedido listo para retirar; conviene entregarlo cuanto antes.";
  } else if (promisedRemainingMinutes !== null && promisedRemainingMinutes <= 0) {
    aiRiskLevel = "high";
    aiReason = "Ya supero el tiempo prometido y necesita atencion inmediata.";
  } else if (
    aiEtaMinutes >= 20 ||
    overduePressure >= 2 ||
    (safeEstimatedReadyMinutes && elapsedMinutes >= safeEstimatedReadyMinutes + 8)
  ) {
    aiRiskLevel = "high";
    aiReason = "Se detecta acumulacion de pedidos y este ticket esta entrando en zona critica.";
  } else if (
    aiEtaMinutes >= 12 ||
    (promisedRemainingMinutes !== null && promisedRemainingMinutes <= 5) ||
    sameDayDelayPressure >= 3 ||
    loadPressure >= 2
  ) {
    aiRiskLevel = "medium";
    aiReason =
      loadPressure >= 2
        ? "La carga del local esta subiendo y conviene vigilar este pedido de cerca."
        : promisedRemainingMinutes !== null && promisedRemainingMinutes <= 5
        ? "Esta cerca de la hora comprometida y puede desviarse si entra mas carga."
          : "Hoy el local viene cerrando pedidos por encima de lo prometido.";
  } else if (peakDemandLoad >= 2) {
    aiReason = "Esta dentro de una franja de alta demanda, aunque por ahora va en ventana.";
  }

  if (stageDrift.severity === "critical") {
    aiRiskLevel = "high";
    aiReason = stageDrift.reason;
  } else if (stageDrift.severity === "warning" && aiRiskLevel !== "high") {
    aiRiskLevel = "medium";
    aiReason = stageDrift.reason;
  }

  const isFreshOrder =
    ["received", "preparing"].includes(status) &&
    elapsedMinutes <= 3 &&
    (promisedRemainingMinutes === null || promisedRemainingMinutes > 0) &&
    stageDrift.severity !== "critical";

  if (isFreshOrder && aiRiskLevel === "high") {
    aiRiskLevel = "medium";
    aiReason = "Pedido recien creado: la IA detecta carga alta, pero necesita mas recorrido real antes de marcarlo como critico.";
  }

  if (stageFocus.recommendation && aiRiskLevel !== "low") {
    aiReason = `${aiReason.replace(/\.$/, "")}. Cuello principal: ${stageFocus.label}.`;
    aiRecommendation = stageFocus.recommendation;
  }

  if (!["received", "preparing", "ready"].includes(status)) {
    aiEtaMinutes = 0;
    aiRiskLevel = "low";
    aiReason = status === "delivered" ? "Pedido ya entregado." : "Pedido fuera de la cola operativa.";
    aiRecommendation = status === "delivered" ? "Sin accion operativa pendiente." : "Sin accion operativa pendiente.";
  }

  if (model?.sampleCount >= 8 && status !== "ready" && aiRiskLevel !== "high") {
    aiReason = `${aiReason.replace(/\.$/, "")}. Modelo adaptado con ${model.sampleCount} pedidos reales del local.`;
  }

  const aiPriorityScore =
    (aiRiskLevel === "high" ? 120 : aiRiskLevel === "medium" ? 70 : 25) +
    Math.min(elapsedMinutes, 45) +
    Math.max(0, 8 - (promisedRemainingMinutes ?? 8)) * 4 +
    queuePressure * 6 +
    (status === "ready" ? 35 : 0) +
    (status === "preparing" ? 8 : 0);

  const aiPressureScore = clampNumber(queuePressure, 0, 15);
  const aiPressureLabel = aiPressureScore >= 8 ? "Alta" : aiPressureScore >= 4 ? "Media" : "Baja";

  return {
    aiEtaMinutes,
    aiRiskLevel,
    aiPriorityScore,
    aiReason,
    aiRecommendation,
    aiPressureScore,
    aiPressureLabel,
    aiBottleneckStage: stageFocus.stage,
    aiBottleneckLabel: stageFocus.label,
    aiModelConfidenceLabel: model?.confidenceLabel || "Aprendiendo",
    aiModelConfidenceScore: model?.confidenceScore || 0,
    aiModelSampleSize: model?.sampleCount || 0,
    aiModelMeanAbsoluteError: model?.meanAbsoluteError ?? null,
    aiUpdatedAt: new Date().toISOString(),
  };
}

function createOrder(orderData) {
  const orders = loadOrders();
  const normalizedSourceOrderId = normalizeSourceOrderId(orderData.sourceOrderId);
  const currentRestaurantId =
    String(orderData.restaurantId || "").trim() || getCurrentRestaurantSession()?.restaurantId || DEFAULT_RESTAURANT_ID;
  const currentRestaurant = getRestaurantById(currentRestaurantId);
  const demoUsage = getRestaurantDemoUsage(currentRestaurant, orders);

  if (demoUsage.enabled && demoUsage.usedOrders >= demoUsage.maxOrders) {
    throw new Error("demo-order-limit");
  }

  if (!normalizedSourceOrderId) {
    throw new Error("missing-source-order");
  }

  if (sourceOrderIdExists(normalizedSourceOrderId)) {
    throw new Error("duplicate-source-order");
  }

  const nextIndex = getNextOrderIndex(orders);
  const normalizedPickupPoint = String(orderData.pickupPoint || "").trim();
  const parsedEstimatedReadyMinutes = Number.parseInt(String(orderData.estimatedReadyMinutes || ""), 10);
  const normalizedEstimatedReadyMinutes =
    Number.isFinite(parsedEstimatedReadyMinutes) && parsedEstimatedReadyMinutes > 0
      ? Math.max(1, parsedEstimatedReadyMinutes)
      : null;
  const createdAt = new Date().toISOString();
  const order = {
    restaurantId: currentRestaurantId,
    createdAt,
    id: buildOrderTrackingId(currentRestaurantId, normalizedSourceOrderId),
    orderNumber: `#${nextIndex}`,
    sourceOrderId: normalizedSourceOrderId,
    publicTrackingToken: generatePublicTrackingToken(),
    sourceSystem: String(orderData.sourceSystem || "").trim() || "Alta manual",
    customerName: String(orderData.customerName || "").trim() || "Cliente mostrador",
    items: String(orderData.items || "").trim() || "Pedido rápido",
    pickupPoint: normalizedPickupPoint,
    estimatedReadyMinutes: normalizedEstimatedReadyMinutes,
    status: "received",
    notes: String(orderData.notes || "").trim(),
    rating: null,
    archivedAt: null,
    statusDurations: {},
    statusStartedAt: createdAt,
  };
  order.promisedReadyAt = buildPromisedReadyAt(order.createdAt, order.estimatedReadyMinutes);
  order.aiTrainingSnapshot = buildAiTrainingSnapshot(order, orders, createdAt);
  order.timelineEvents = [
    {
      type: "created",
      at: createdAt,
      status: order.status,
      snapshot: order.aiTrainingSnapshot,
    },
  ];
  order.lifecycleMilestones = buildLifecycleMilestones(order, { status: order.status, archivedAt: order.archivedAt }, createdAt);
  order.predictionTrainingRecord = buildPredictionTrainingRecord(order);

  const nextOrders = normalizeOrders([...orders, order]);
  saveOrders(nextOrders);
  persistOrderDocument(order);
  persistTrackingDocumentForOrder(order);
  return order;
}

function updateOrder(id, updates) {
  const currentOrder = getOrderById(id);
  if (!currentOrder) return null;

  const nextUpdates = { ...updates };

  if (Object.prototype.hasOwnProperty.call(nextUpdates, "sourceOrderId")) {
    const normalizedSourceOrderId = normalizeSourceOrderId(nextUpdates.sourceOrderId);

    if (normalizedSourceOrderId && sourceOrderIdExists(normalizedSourceOrderId, id)) {
      throw new Error("duplicate-source-order");
    }

    nextUpdates.sourceOrderId = normalizedSourceOrderId;
    nextUpdates.id = normalizedSourceOrderId
      ? buildOrderTrackingId(currentOrder.restaurantId, normalizedSourceOrderId)
      : currentOrder.id;
  }

  if (Object.prototype.hasOwnProperty.call(nextUpdates, "estimatedReadyMinutes")) {
    const parsedEstimatedReadyMinutes = Number.parseInt(String(nextUpdates.estimatedReadyMinutes || ""), 10);
    nextUpdates.estimatedReadyMinutes =
      Number.isFinite(parsedEstimatedReadyMinutes) && parsedEstimatedReadyMinutes > 0
        ? Math.max(1, parsedEstimatedReadyMinutes)
        : null;
  }

  if (
    Object.prototype.hasOwnProperty.call(nextUpdates, "estimatedReadyMinutes") ||
    Object.prototype.hasOwnProperty.call(nextUpdates, "createdAt")
  ) {
    const nextEstimatedReadyMinutes = Object.prototype.hasOwnProperty.call(nextUpdates, "estimatedReadyMinutes")
      ? nextUpdates.estimatedReadyMinutes
      : currentOrder.estimatedReadyMinutes;
    nextUpdates.promisedReadyAt = buildPromisedReadyAt(
      nextUpdates.createdAt || currentOrder.createdAt,
      nextEstimatedReadyMinutes,
    );
  }

  const eventTime = new Date().toISOString();
  const nextOrder = { ...currentOrder, ...nextUpdates };
  const stagedOrders = loadOrders().map((order) => (order.id === id ? nextOrder : order));
  const snapshot = buildAiTrainingSnapshot(nextOrder, stagedOrders, eventTime);
  const changedKeys = Object.keys(nextUpdates);

  nextOrder.aiTrainingSnapshot = snapshot;
  nextOrder.lifecycleMilestones = buildLifecycleMilestones(currentOrder, nextUpdates, eventTime);
  nextOrder.predictionTrainingRecord = buildPredictionTrainingRecord(nextOrder);
  nextOrder.timelineEvents = changedKeys.length
    ? appendOrderTimelineEvent(currentOrder, {
        type: changedKeys.includes("status") ? "status-updated" : "order-updated",
        at: eventTime,
        status: nextOrder.status,
        changedKeys,
        snapshot,
      })
    : Array.isArray(currentOrder.timelineEvents)
      ? [...currentOrder.timelineEvents]
      : [];

  const nextOrders = stagedOrders.map((order) => (order.id === id ? nextOrder : order));
  saveOrders(nextOrders);
  persistOrderDocument(nextOrder, currentOrder.id);
  persistTrackingDocumentForOrder(nextOrder, currentOrder.id);
  return getOrderById(nextUpdates.id || id);
}

function updateOrderStatus(id, status) {
  const order = getOrderById(id);
  if (!order || order.status === status) return order;

  const nowIso = new Date().toISOString();
  const currentStatus = order.status;
  const elapsedMinutes = Math.max(
    0,
    Math.floor((new Date(nowIso).getTime() - new Date(order.statusStartedAt || order.createdAt).getTime()) / 60000),
  );
  const nextDurations = {
    ...(order.statusDurations || {}),
    [currentStatus]: (order.statusDurations?.[currentStatus] || 0) + elapsedMinutes,
  };
  const nextArchivedAt = status === "delivered" || status === "cancelled" ? nowIso : null;

  return updateOrder(id, {
    status,
    archivedAt: nextArchivedAt,
    statusDurations: nextDurations,
    statusStartedAt: nowIso,
  });
}

function submitOrderRating(id, score) {
  return updatePublicTrackingRating(id, score, "");
}

async function updatePublicTrackingRating(id, score, comment = "") {
  const trackingOrder = getPublicOrderById(id);
  if (!trackingOrder) return null;

  const previousTracking = loadPublicOrders();
  const nextRecord = {
    ...trackingOrder,
    rating: {
      score,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    },
  };

  mergeTrackingRecord(nextRecord);
  broadcastOrdersChanged();

  if (!firebaseBackend?.enabled) {
    return nextRecord;
  }

  try {
    if (!getRequiredPrivateRole() && typeof firebaseBackend.submitPublicTrackingRating === "function") {
      const publicId = trackingOrder.publicTrackingToken || trackingOrder.sourceOrderId || trackingOrder.id;
      const savedRecord = await firebaseBackend.submitPublicTrackingRating({
        publicId,
        score,
        comment: comment.trim(),
      });
      const mergedRecord = savedRecord ? mergeTrackingRecord(savedRecord) : nextRecord;
      broadcastOrdersChanged();
      return mergedRecord;
    }

    if (typeof firebaseBackend.setDocument === "function") {
      await firebaseBackend.setDocument(FIREBASE_TRACKING_COLLECTION, id, nextRecord);
    }

    broadcastOrdersChanged();
    return nextRecord;
  } catch (error) {
    applyTrackingSnapshot(previousTracking);
    broadcastOrdersChanged();
    console.error("No se pudo guardar la valoracion publica del pedido.", error);
    notifyFirebaseError(error, "No se pudo guardar la valoracion del cliente.");
    return null;
  }
}

function submitOrderRatingFeedback(id, score, comment) {
  return updatePublicTrackingRating(id, score, comment);
}

function archiveOrder(id) {
  return updateOrder(id, { archivedAt: new Date().toISOString() });
}

function restoreOrder(id) {
  return updateOrder(id, { archivedAt: null });
}

function getOperationalOrders() {
  const currentRestaurantId = getCurrentRestaurantSession()?.restaurantId;
  return loadOrders().filter((order) => {
    if (order.archivedAt) return false;
    if (!currentRestaurantId) return true;
    return order.restaurantId === currentRestaurantId;
  });
}

function getArchivedOrders() {
  const currentRestaurantId = getCurrentRestaurantSession()?.restaurantId;
  return loadOrders().filter((order) => {
    if (!order.archivedAt) return false;
    if (!currentRestaurantId) return true;
    return order.restaurantId === currentRestaurantId;
  });
}

function getQueueBefore(orderId) {
  const currentOrder = getPublicOrderById(orderId);
  if (!currentOrder) return [];

  const orders = loadPublicOrders().filter(
    (order) => !order.archivedAt && order.restaurantId === currentOrder.restaurantId,
  );
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) return [];

  return orders.slice(0, index).filter((order) => QUEUE_ACTIVE_STATUSES.includes(order.status));
}

function getActiveOrderCount() {
  return getOperationalOrders().filter((order) => QUEUE_ACTIVE_STATUSES.includes(order.status)).length;
}

function formatOrderTime(value) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function getElapsedOrderTime(value) {
  const order = typeof value === "string" ? { createdAt: value, archivedAt: null } : value;
  const endTime = order.archivedAt ? new Date(order.archivedAt).getTime() : Date.now();
  const elapsedMs = Math.max(0, endTime - new Date(order.createdAt).getTime());
  const totalMinutes = Math.floor(elapsedMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getElapsedOrderTone(value) {
  const order = typeof value === "string" ? { createdAt: value, archivedAt: null } : value;
  const promiseDelayMinutes = getOrderPromiseDelayMinutes(order);

  if (promiseDelayMinutes !== null) {
    if (promiseDelayMinutes >= ORDER_CRITICAL_OVERDUE_MINUTES) return "danger";
    if (promiseDelayMinutes > 0) return "warning";
    return "safe";
  }

  const endTime = order.archivedAt ? new Date(order.archivedAt).getTime() : Date.now();
  const elapsedMinutes = Math.floor(Math.max(0, endTime - new Date(order.createdAt).getTime()) / 60000);

  if (elapsedMinutes >= 30) return "danger";
  if (elapsedMinutes >= 16) return "warning";
  return "safe";
}

function getOrderDurationMinutes(order) {
  const endTime = order.archivedAt ? new Date(order.archivedAt).getTime() : Date.now();
  return Math.max(0, Math.floor((endTime - new Date(order.createdAt).getTime()) / 60000));
}

function formatDurationMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatStatusDurationLabel(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!minutes) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function getStatusDurationMinutes(order, status) {
  const savedMinutes = Number(order.statusDurations?.[status] || 0);

  if (order.status !== status) return savedMinutes;

  const endTime = order.archivedAt ? new Date(order.archivedAt).getTime() : Date.now();
  const startedAt = new Date(order.statusStartedAt || order.createdAt).getTime();
  const liveMinutes = Math.max(0, Math.floor((endTime - startedAt) / 60000));

  if (!order.statusDurations && status === order.status) {
    return Math.max(savedMinutes, getOrderDurationMinutes(order));
  }

  return savedMinutes + liveMinutes;
}

function normalizeDashboardPeriod(period) {
  return ["day", "month", "year"].includes(period) ? period : "day";
}

function getDashboardPeriodMeta(period) {
  const safePeriod = normalizeDashboardPeriod(period);
  if (safePeriod === "month") {
    return {
      key: "month",
      label: "Mes",
      scopeLabel: "este mes",
      resultsLabel: "del mes",
    };
  }

  if (safePeriod === "year") {
    return {
      key: "year",
      label: "Año",
      scopeLabel: "este año",
      resultsLabel: "del año",
    };
  }

  return {
    key: "day",
    label: "Día",
    scopeLabel: "hoy",
    resultsLabel: "del día",
  };
}

function getDashboardPeriodStart(period, referenceDate = new Date()) {
  const safePeriod = normalizeDashboardPeriod(period);
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);

  if (safePeriod === "month") {
    start.setDate(1);
    return start;
  }

  if (safePeriod === "year") {
    start.setMonth(0, 1);
    return start;
  }

  return start;
}

function isWithinDashboardPeriod(value, period, referenceDate = new Date()) {
  if (!value) return false;
  const current = new Date(value).getTime();
  if (!Number.isFinite(current)) return false;

  const end = new Date(referenceDate).getTime();
  const start = getDashboardPeriodStart(period, referenceDate).getTime();
  return current >= start && current <= end;
}

function filterOrdersByDashboardPeriod(orders, period, options = {}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safePeriod = normalizeDashboardPeriod(period);
  const dateField = String(options.dateField || "createdAt");
  const referenceDate = options.referenceDate instanceof Date ? options.referenceDate : new Date();
  const readValue = (item, path) =>
    path.split(".").reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), item);

  return safeOrders.filter((order) => isWithinDashboardPeriod(readValue(order, dateField), safePeriod, referenceDate));
}

function isSameLocalDay(value) {
  return isWithinDashboardPeriod(value, "day");
}

function isWithinLastDays(value, days) {
  if (!value) return false;
  const diffMs = Date.now() - new Date(value).getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

function getDashboardStats(options = {}) {
  const period = normalizeDashboardPeriod(options.period);
  const periodMeta = getDashboardPeriodMeta(period);
  const currentRestaurantId = getCurrentRestaurantSession()?.restaurantId;
  const allOrders = loadOrders();
  const restaurantOrders = allOrders.filter((order) => {
    if (!currentRestaurantId) return true;
    return order.restaurantId === currentRestaurantId;
  });
  const periodOrders = filterOrdersByDashboardPeriod(restaurantOrders, period);
  const activeOrders = restaurantOrders.filter((order) => !order.archivedAt);
  const readyMilestoneOrders = filterOrdersByDashboardPeriod(restaurantOrders, period, {
    dateField: "lifecycleMilestones.readyAt",
  });
  const deliveredMilestoneOrders = filterOrdersByDashboardPeriod(restaurantOrders, period, {
    dateField: "lifecycleMilestones.deliveredAt",
  });
  const cancelledMilestoneOrders = filterOrdersByDashboardPeriod(restaurantOrders, period, {
    dateField: "lifecycleMilestones.cancelledAt",
  });
  const archivedMilestoneOrders = filterOrdersByDashboardPeriod(restaurantOrders, period, {
    dateField: "archivedAt",
  });
  const deliveredOrders = deliveredMilestoneOrders.filter((order) => order.status === "delivered");
  const cancelledOrders = cancelledMilestoneOrders.filter((order) => order.status === "cancelled");
  const archivedOrders = archivedMilestoneOrders.filter((order) => Boolean(order.archivedAt));
  const intelligentActiveOrders = enrichOrdersWithIntelligence(activeOrders, { allOrders });
  const ratedOrders = filterOrdersByDashboardPeriod(
    restaurantOrders.filter((order) => order.rating && order.rating.score),
    period,
    { dateField: "rating.createdAt" },
  );
  const delayedActiveOrders = activeOrders.filter((order) => {
    const promiseDelayMinutes = getOrderPromiseDelayMinutes(order);
    return promiseDelayMinutes === null ? getOrderDurationMinutes(order) >= 16 : promiseDelayMinutes > 0;
  });
  const readyCompletedOrders = readyMilestoneOrders.filter((order) =>
    Number.isFinite(order?.predictionTrainingRecord?.minutesToReady),
  );
  const promiseTrackedReadyOrders = readyCompletedOrders.filter((order) => String(order.promisedReadyAt || "").trim());
  const onTimeReadyOrders = promiseTrackedReadyOrders.filter((order) => isOrderResolvedWithinPromise(order));
  const lowRatedOrders = ratedOrders.filter((order) => Number(order.rating.score || 0) <= 2);
  const commentedOrders = ratedOrders.filter((order) => String(order.rating.comment || "").trim());
  const longestActiveMinutes = activeOrders.length
    ? Math.max(...activeOrders.map((order) => getOrderDurationMinutes(order)))
    : 0;
  const slowestOrder =
    [...activeOrders].sort((left, right) => getOrderDurationMinutes(right) - getOrderDurationMinutes(left))[0] || null;

  const ordersByHour = periodOrders.reduce((accumulator, order) => {
    const hour = new Date(order.createdAt).getHours();
    accumulator[hour] = (accumulator[hour] || 0) + 1;
    return accumulator;
  }, {});

  const peakHourEntry = Object.entries(ordersByHour).sort((left, right) => right[1] - left[1])[0] || null;

  const averageReadyMinutes = readyCompletedOrders.length
    ? Math.round(
        readyCompletedOrders.reduce((total, order) => total + Number(order.predictionTrainingRecord?.minutesToReady || 0), 0) /
          readyCompletedOrders.length,
      )
    : 0;
  const readyOrdersWithPromise = readyCompletedOrders.filter((order) => {
    const promisedMinutes = Number(order.estimatedReadyMinutes || 0);
    return Number.isFinite(promisedMinutes) && promisedMinutes > 0;
  });
  const averageReadyDelayMinutes = readyOrdersWithPromise.length
    ? Math.round(
        readyOrdersWithPromise.reduce((total, order) => {
          const promisedMinutes = Number(order.estimatedReadyMinutes || 0);
          const actualMinutes = Number(order.predictionTrainingRecord?.minutesToReady || 0);
          return total + Math.max(0, actualMinutes - promisedMinutes);
        }, 0) / readyOrdersWithPromise.length,
      )
    : 0;

  const averageResolutionMinutes = archivedOrders.length
    ? Math.round(
        archivedOrders.reduce((total, order) => total + getOrderDurationMinutes(order), 0) / archivedOrders.length,
      )
    : 0;

  const averageRating = ratedOrders.length
    ? (
        ratedOrders.reduce((total, order) => total + Number(order.rating.score || 0), 0) / ratedOrders.length
      ).toFixed(1)
    : null;

  const resolvedOutcomeCount = deliveredOrders.length + cancelledOrders.length;
  const cancellationRate = resolvedOutcomeCount
    ? Math.round((cancelledOrders.length / resolvedOutcomeCount) * 100)
    : 0;

  const onTimeRate = promiseTrackedReadyOrders.length
    ? Math.round((onTimeReadyOrders.length / promiseTrackedReadyOrders.length) * 100)
    : 0;

  const peakHour = peakHourEntry
    ? `${String(Number(peakHourEntry[0])).padStart(2, "0")}:00`
    : "--:--";

  const dashboardStatuses = ORDER_STATUSES.filter((status) => !["delivered", "cancelled"].includes(status));

  const statusPerformance = dashboardStatuses.map((status) => {
    const relevantOrders = periodOrders.filter(
      (order) => Number(order.statusDurations?.[status] || 0) > 0 || order.status === status,
    );
    const totalMinutes = relevantOrders.reduce((total, order) => total + getStatusDurationMinutes(order, status), 0);
    const averageMinutes = relevantOrders.length ? Math.round(totalMinutes / relevantOrders.length) : 0;

    return {
      status,
      label: statusMeta[status].label,
      totalMinutes,
      averageMinutes,
      count: relevantOrders.length,
    };
  });

  const slowestStatus =
    [...statusPerformance]
      .filter((item) => item.count > 0)
      .sort((left, right) => right.averageMinutes - left.averageMinutes)[0] || null;

  const aiHighRiskOrders = intelligentActiveOrders.filter((order) => order.aiRiskLevel === "high");
  const aiAttentionOrders = intelligentActiveOrders.filter((order) => order.aiRiskLevel === "medium");
  const aiAverageExtraMinutes = intelligentActiveOrders.length
    ? Math.round(
        intelligentActiveOrders.reduce((total, order) => {
          const promisedRemainingMinutes = getRemainingEstimatedMinutes(order);
          const baseline =
            promisedRemainingMinutes === null
              ? Number.parseInt(String(order.estimatedReadyMinutes || ""), 10) || 0
              : Math.max(0, promisedRemainingMinutes);
          return total + Math.max(0, Number(order.aiEtaMinutes || 0) - baseline);
        }, 0) / intelligentActiveOrders.length,
      )
    : 0;
  const aiPressureScore = intelligentActiveOrders.length
    ? Math.round(
        intelligentActiveOrders.reduce((total, order) => total + Number(order.aiPressureScore || 0), 0) /
          intelligentActiveOrders.length,
      )
    : 0;
  const aiPressureLabel = aiPressureScore >= 8 ? "Alta" : aiPressureScore >= 4 ? "Media" : "Baja";
  const aiFocusOrder =
    [...intelligentActiveOrders].sort((left, right) => Number(right.aiPriorityScore || 0) - Number(left.aiPriorityScore || 0))[0] ||
    null;
  const adaptiveModel = currentRestaurantId ? buildAdaptiveRestaurantModel(currentRestaurantId, allOrders) : null;
  const bottleneckCounts = intelligentActiveOrders.reduce(
    (accumulator, order) => {
      const stage = String(order.aiBottleneckStage || "");
      if (stage && Object.prototype.hasOwnProperty.call(accumulator, stage)) {
        accumulator[stage] += 1;
      }
      return accumulator;
    },
    { received: 0, preparing: 0, ready: 0 },
  );
  const dominantBottleneckEntry =
    Object.entries(bottleneckCounts).sort((left, right) => right[1] - left[1])[0] || null;
  const bottleneckLabelMap = {
    received: "entrada a cocina",
    preparing: "preparacion",
    ready: "recogida",
  };
  const dominantBottleneck =
    dominantBottleneckEntry && dominantBottleneckEntry[1] > 0
      ? {
          stage: dominantBottleneckEntry[0],
          label: bottleneckLabelMap[dominantBottleneckEntry[0]] || dominantBottleneckEntry[0],
          count: dominantBottleneckEntry[1],
        }
      : null;
  const aiNextAction =
    aiFocusOrder?.aiRiskLevel === "high"
      ? {
          title: `Prioriza ${aiFocusOrder.orderNumber}`,
          body: "Pon este pedido primero en foco: es el que tiene mayor probabilidad de deteriorar la experiencia ahora mismo.",
          primary: "Intervenir ya",
          secondary: aiFocusOrder.aiRiskLevel === "high" ? "Critico" : aiFocusOrder.aiRiskLevel === "medium" ? "Atencion" : "Saludable",
        }
      : adaptiveModel?.sampleCount >= 8 && adaptiveModel?.confidenceLabel !== "Aprendiendo"
        ? {
            title: "Ajusta promesas con la IA del local",
            body: `El modelo ya aprende de ${adaptiveModel.sampleCount} cierres reales. Usa esta lectura para afinar tiempos prometidos y evitar friccion antes de la hora pico.`,
            primary: `IA ${adaptiveModel.confidenceLabel}`,
            secondary: `Error ${adaptiveModel.meanAbsoluteError ?? "--"} min`,
          }
        : activeOrders.length
          ? {
              title: "Sigue acumulando aprendizaje real",
              body: "Cierra pedidos completos y mantén estados actualizados. Es la forma más rápida de que la IA se adapte a este restaurante.",
              primary: `Activos ${activeOrders.length}`,
              secondary: `Muestras ${adaptiveModel?.sampleCount || 0}`,
            }
          : {
              title: "Listo para entrenar con nuevos pedidos",
              body: "Cuando entren nuevos pedidos, TurnoListo seguirá afinando tiempos y prioridades con el comportamiento real del local.",
              primary: adaptiveModel?.sampleCount ? `Muestras ${adaptiveModel.sampleCount}` : "Sin muestras",
              secondary: adaptiveModel?.confidenceLabel || "Aprendiendo",
            };

  return {
    period,
    periodLabel: periodMeta.label,
    periodScopeLabel: periodMeta.scopeLabel,
    periodResultsLabel: periodMeta.resultsLabel,
    totalToday: periodOrders.length,
    activeNow: activeOrders.length,
    readyNow: activeOrders.filter((order) => order.status === "ready").length,
    readyInPeriod: readyMilestoneOrders.length,
    archivedToday: archivedOrders.length,
    deliveredToday: deliveredOrders.length,
    cancelledToday: cancelledOrders.length,
    delayedActive: delayedActiveOrders.length,
    avgReadyMinutes: averageReadyMinutes,
    avgReadyDelayMinutes: averageReadyDelayMinutes,
    avgResolutionMinutes: averageResolutionMinutes,
    averageRating,
    cancellationRate,
    onTimeRate,
    onTimeTrackedCount: promiseTrackedReadyOrders.length,
    longestActiveMinutes,
    slowestOrder,
    lowRatingCount: lowRatedOrders.length,
    feedbackCount: commentedOrders.length,
    peakHour,
    slowestStatus,
    aiHighRiskCount: aiHighRiskOrders.length,
    aiAttentionCount: aiAttentionOrders.length,
    aiAverageExtraMinutes,
    aiPressureScore,
    aiPressureLabel,
    aiFocusOrder,
    aiModelConfidenceLabel: adaptiveModel?.confidenceLabel || "Aprendiendo",
    aiModelConfidenceScore: adaptiveModel?.confidenceScore || 0,
    aiModelSampleSize: adaptiveModel?.sampleCount || 0,
    aiModelMeanAbsoluteError: adaptiveModel?.meanAbsoluteError ?? null,
    aiModelDeliveredExamples: adaptiveModel?.deliveredSampleCount || 0,
    aiDominantBottleneck: dominantBottleneck,
    aiNextAction,
    ratedCount: ratedOrders.length,
    deliveredCount: deliveredOrders.length,
    statusPerformance,
    statusCounts: ORDER_STATUSES.map((status) => ({
      status,
      label: statusMeta[status].label,
      count:
        status === "delivered"
          ? deliveredOrders.length
          : status === "cancelled"
            ? cancelledOrders.length
            : activeOrders.filter((order) => order.status === status).length,
      color: statusMeta[status].color,
      bg: statusMeta[status].bg,
    })),
    feedbackMix: [
      { label: "Valoradas", count: ratedOrders.length, color: "#1f7a63" },
      { label: "Bajas", count: lowRatedOrders.length, color: "#b42318" },
      { label: "Comentadas", count: commentedOrders.length, color: "#0c5b75" },
    ],
    throughputMix: [
      { label: "Activos", count: activeOrders.length, color: "#ec7c0d" },
      { label: "Listos", count: activeOrders.filter((order) => order.status === "ready").length, color: "#1f7a63" },
      { label: "Entregados", count: deliveredOrders.length, color: "#0c5b75" },
      { label: "Cancelados", count: cancelledOrders.length, color: "#b42318" },
    ],
  };
}

function getAdminDashboardStats(options = {}) {
  const period = normalizeDashboardPeriod(options.period);
  const periodMeta = getDashboardPeriodMeta(period);
  const restaurants = loadRestaurants();
  const orders = loadOrders();
  const filteredOrders = filterOrdersByDashboardPeriod(orders, period);
  const deliveredMilestoneOrders = filterOrdersByDashboardPeriod(orders, period, {
    dateField: "lifecycleMilestones.deliveredAt",
  }).filter((order) => order.status === "delivered");
  const cancelledMilestoneOrders = filterOrdersByDashboardPeriod(orders, period, {
    dateField: "lifecycleMilestones.cancelledAt",
  }).filter((order) => order.status === "cancelled");
  const activeCreatedOrders = filteredOrders.filter((order) => !order.archivedAt);
  const activeRestaurants = restaurants.filter((restaurant) => isRestaurantAccessActive(restaurant));
  const expiredRestaurants = restaurants.filter((restaurant) => !isRestaurantAccessActive(restaurant));
  const demoRestaurants = restaurants.filter((restaurant) => isDemoRestaurant(restaurant));
  const restaurantsWithOrders = restaurants.map((restaurant) => {
    const historicalRestaurantOrders = orders.filter((order) => order.restaurantId === restaurant.id);
    const restaurantOrders = filteredOrders.filter((order) => order.restaurantId === restaurant.id);
    const restaurantDeliveredOrders = deliveredMilestoneOrders.filter((order) => order.restaurantId === restaurant.id);
    const adaptiveModel = buildAdaptiveRestaurantModel(restaurant.id, orders);
    const demoUsage = getRestaurantDemoUsage(restaurant, filteredOrders);
    const avgDeliveryMinutes = restaurantDeliveredOrders.length
      ? Math.round(
          restaurantDeliveredOrders.reduce((total, order) => total + getOrderDurationMinutes(order), 0) /
            restaurantDeliveredOrders.length,
        )
      : 0;

    return {
      restaurant,
      restaurantOrders,
      historicalRestaurantOrders,
      orderCount: restaurantOrders.length,
      historicalOrderCount: historicalRestaurantOrders.length,
      activeOrderCount: restaurantOrders.filter((order) => !order.archivedAt).length,
      deliveredCount: restaurantDeliveredOrders.length,
      avgDeliveryMinutes,
      demoUsage,
      adaptiveModel,
    };
  });

  const topRestaurant =
    [...restaurantsWithOrders].sort((left, right) => right.orderCount - left.orderCount)[0] || null;
  const recentlyActiveRestaurants = restaurantsWithOrders.filter((item) => item.orderCount > 0).length;
  const dormantRestaurants = restaurantsWithOrders.filter(
    (item) => item.historicalOrderCount > 0 && item.orderCount === 0,
  ).length;
  const restaurantsWithoutOrders = restaurantsWithOrders.filter((item) => item.historicalOrderCount === 0).length;
  const soonToExpire = restaurants
    .filter((restaurant) => {
      const remainingDays = getRestaurantRemainingDays(restaurant);
      return remainingDays !== null && remainingDays >= 0 && remainingDays <= 7;
    })
    .length;
  const topRestaurantsByOrders = [...restaurantsWithOrders]
    .filter((item) => item.orderCount > 0)
    .sort((left, right) => right.orderCount - left.orderCount)
    .slice(0, 5);
  const trainedRestaurants = restaurantsWithOrders.filter((item) => Number(item.adaptiveModel?.sampleCount || 0) >= 6);
  const highConfidenceModels = trainedRestaurants.filter((item) => item.adaptiveModel?.confidenceLabel === "Alta");
  const restaurantsNeedingModelTraining = restaurantsWithOrders.filter(
    (item) => item.orderCount >= 3 && Number(item.adaptiveModel?.sampleCount || 0) < 8,
  );
  const restaurantsWithModelDropRisk = restaurantsWithOrders.filter(
    (item) =>
      item.historicalOrderCount > 0 &&
      Number(item.adaptiveModel?.sampleCount || 0) >= 8 &&
      item.orderCount === 0,
  );
  const demoReadyToConvert = restaurantsWithOrders.filter((item) => {
    if (!item.demoUsage?.enabled) return false;
    return item.demoUsage.usedOrders >= Math.max(3, Math.ceil(item.demoUsage.maxOrders * 0.6));
  });
  const averageModelError = trainedRestaurants.length
    ? Math.round(
        trainedRestaurants.reduce((total, item) => total + Number(item.adaptiveModel?.meanAbsoluteError || 0), 0) /
          trainedRestaurants.length,
      )
    : 0;
  const aiPriorityRestaurant =
    restaurantsWithModelDropRisk[0] ||
    restaurantsNeedingModelTraining.sort((left, right) => right.orderCount - left.orderCount)[0] ||
    topRestaurantsByOrders[0] ||
    null;
  const aiPortfolioAction = aiPriorityRestaurant
    ? Number(aiPriorityRestaurant.adaptiveModel?.sampleCount || 0) >= 8 &&
      !aiPriorityRestaurant.restaurantOrders?.some((order) => isWithinLastDays(order.createdAt, 7))
      ? { key: "admin.dynamic.insight.ai_signal.recover", params: { name: aiPriorityRestaurant.restaurant.name } }
      : Number(aiPriorityRestaurant.adaptiveModel?.sampleCount || 0) < 8
        ? { key: "admin.dynamic.insight.ai_signal.push", params: { name: aiPriorityRestaurant.restaurant.name } }
        : { key: "admin.dynamic.insight.ai_signal.success", params: { name: aiPriorityRestaurant.restaurant.name } }
    : { key: "admin.dynamic.insight.ai_signal.empty", params: {} };
  const portfolioBottleneckCounts = restaurantsWithOrders.reduce(
    (accumulator, item) => {
      const baselines = item.adaptiveModel?.stageBaselines || {};
      const candidates = [
        { stage: "received", value: Number(baselines.received || 0) },
        { stage: "preparing", value: Number(baselines.preparing || 0) },
        { stage: "ready", value: Number(baselines.ready || 0) },
      ].sort((left, right) => right.value - left.value);
      const dominantStage = candidates[0]?.stage || "";
      if (dominantStage && Object.prototype.hasOwnProperty.call(accumulator, dominantStage)) {
        accumulator[dominantStage] += 1;
      }
      return accumulator;
    },
    { received: 0, preparing: 0, ready: 0 },
  );
  const portfolioBottleneckEntry =
    Object.entries(portfolioBottleneckCounts).sort((left, right) => right[1] - left[1])[0] || null;
  const dominantPortfolioBottleneck =
    portfolioBottleneckEntry && portfolioBottleneckEntry[1] > 0
      ? {
          stage: portfolioBottleneckEntry[0],
          labelKey:
            portfolioBottleneckEntry[0] === "received"
              ? "admin.bottleneck.received"
              : portfolioBottleneckEntry[0] === "preparing"
                ? "admin.bottleneck.preparing"
                : "admin.bottleneck.ready",
          count: portfolioBottleneckEntry[1],
        }
      : null;

  return {
    period,
    periodLabel: periodMeta.label,
    periodScopeLabel: periodMeta.scopeLabel,
    periodResultsLabel: periodMeta.resultsLabel,
    totalRestaurants: restaurants.length,
    activeRestaurants: activeRestaurants.length,
    expiredRestaurants: expiredRestaurants.length,
    demoRestaurantCount: demoRestaurants.length,
    demoReadyToConvertCount: demoReadyToConvert.length,
    totalOrders: filteredOrders.length,
    activeOrders: activeCreatedOrders.length,
    deliveredOrders: deliveredMilestoneOrders.length,
    cancelledOrders: cancelledMilestoneOrders.length,
    soonToExpire,
    recentlyActiveRestaurants,
    dormantRestaurants,
    restaurantsWithoutOrders,
    topRestaurant,
    topRestaurantsByOrders,
    trainedRestaurants,
    trainedRestaurantCount: trainedRestaurants.length,
    highConfidenceModelCount: highConfidenceModels.length,
    averageModelError,
    restaurantsNeedingModelTraining: restaurantsNeedingModelTraining.length,
    restaurantsWithModelDropRisk: restaurantsWithModelDropRisk.length,
    aiPriorityRestaurant: aiPriorityRestaurant?.restaurant?.name || "",
    aiPortfolioAction,
    dominantPortfolioBottleneck,
    accessMix: [
      { labelKey: "admin.chart.access.active", count: activeRestaurants.length, color: "#1f7a63" },
      { labelKey: "admin.chart.access.expiring", count: soonToExpire, color: "#ec7c0d" },
      { labelKey: "admin.chart.access.expired", count: expiredRestaurants.length, color: "#b42318" },
    ],
    adoptionMix: [
      { labelKey: `admin.chart.adoption.active.${period}`, count: recentlyActiveRestaurants, color: "#1f7a63" },
      { labelKey: `admin.chart.adoption.inactive.${period}`, count: dormantRestaurants, color: "#ec7c0d" },
      { labelKey: "admin.chart.adoption.no_orders", count: restaurantsWithoutOrders, color: "#ec7c0d" },
    ],
    orderOutcomeMix: [
      { labelKey: "admin.chart.outcome.open", count: activeCreatedOrders.length, color: "#ec7c0d" },
      { labelKey: "admin.chart.outcome.delivered", count: deliveredMilestoneOrders.length, color: "#1f7a63" },
      { labelKey: "admin.chart.outcome.cancelled", count: cancelledMilestoneOrders.length, color: "#b42318" },
    ],
  };
}

function buildRestaurantCredentialsEmail(restaurant, options = {}) {
  const accessUrl = String(options.accessUrl || "./restaurant.html").trim() || "./restaurant.html";
  const subject = `Acceso TurnoListo - ${restaurant.name}`;
  const body = [
    `Hola ${restaurant.ownerName || restaurant.name},`,
    "",
    "Te compartimos el acceso seguro a tu panel de restaurante en TurnoListo:",
    "",
    `Restaurante: ${restaurant.name}`,
    `Correo de acceso: ${restaurant.username}`,
    `Acceso activo hasta: ${formatAdminEmailDate(restaurant.activatedUntil)}`,
    "",
    "Define tu contrasena desde este enlace seguro:",
    restaurant.accessLink || "Solicita un nuevo enlace al administrador si este correo ya no contiene uno activo.",
    "",
    "Enlace de acceso:",
    accessUrl,
    "",
    "Si necesitas soporte o renovar el acceso, responde a este mensaje.",
  ].join("\n");

  return {
    to: restaurant.email,
    subject,
    body,
    href: `mailto:${encodeURIComponent(restaurant.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

function buildRestaurantOnboardingEmail(restaurant, options = {}) {
  const accessUrl = String(options.accessUrl || "./restaurant.html").trim() || "./restaurant.html";
  const subject = `Activacion TurnoListo - ${restaurant.name}`;
  const body = [
    `Hola ${restaurant.ownerName || restaurant.name},`,
    "",
    "Queremos dejar TurnoListo activo cuanto antes para que tu equipo gestione recogidas con menos esperas y menos preguntas en mostrador.",
    "",
    "Siguiente paso recomendado:",
    restaurant.accessLink
      ? `1. Activa tu acceso desde este enlace seguro: ${restaurant.accessLink}`
      : "1. Pide a soporte un nuevo enlace seguro de acceso si no lo tienes a mano.",
    `2. Entra al panel del restaurante: ${accessUrl}`,
    "3. Crea tu primer pedido de prueba y marca el flujo hasta Listo.",
    "",
    "Con esto tu equipo podrá:",
    "- avisar mejor al cliente",
    "- reducir saturacion en mostrador",
    "- controlar pedidos urgentes con mas claridad",
    "",
    "Si quieres, te ayudamos a dejarlo configurado en una llamada corta.",
  ].join("\n");

  return {
    to: restaurant.email,
    subject,
    body,
    href: `mailto:${encodeURIComponent(restaurant.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

function buildRestaurantRenewalEmail(restaurant, options = {}) {
  const accessUrl = String(options.accessUrl || "./restaurant.html").trim() || "./restaurant.html";
  const subject = `Renovacion TurnoListo - ${restaurant.name}`;
  const body = [
    `Hola ${restaurant.ownerName || restaurant.name},`,
    "",
    `Tu acceso a TurnoListo esta ${restaurant.remainingDays < 0 ? "vencido" : "proximo a vencer"}.`,
    `Estado actual: ${buildRemainingAccessLabel(restaurant)}.`,
    `Acceso vigente hasta: ${formatAdminEmailDate(restaurant.activatedUntil)}`,
    "",
    "Si quieres mantener activo el flujo de seguimiento de pedidos y avisos al cliente, podemos renovarlo de inmediato.",
    "",
    "Enlace de acceso al panel:",
    accessUrl,
    "",
    "Si confirmas la renovacion, dejamos el acceso activo y continuas sin interrupciones.",
  ].join("\n");

  return {
    to: restaurant.email,
    subject,
    body,
    href: `mailto:${encodeURIComponent(restaurant.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

function buildRestaurantDemoUpgradeEmail(restaurant, options = {}) {
  const accessUrl = String(options.accessUrl || "./restaurant.html").trim() || "./restaurant.html";
  const demoUsage = getRestaurantDemoUsage(restaurant);
  const subject = `Activa TurnoListo completo - ${restaurant.name}`;
  const body = [
    `Hola ${restaurant.ownerName || restaurant.name},`,
    "",
    "Tu demo de TurnoListo ya ha servido para probar pedidos, seguimiento al cliente y lectura operativa con IA adaptativa.",
    "",
    `Uso de la demo: ${demoUsage.usedOrders}/${demoUsage.maxOrders} pedidos.`,
    demoUsage.remainingOrders > 0
      ? `Aun quedan ${demoUsage.remainingOrders} pedidos de prueba, pero este es un buen momento para activar el entorno real sin esperar al limite.`
      : "La demo ya ha alcanzado su limite comercial y está lista para convertirse en operacion real.",
    "",
    "Al activar el plan completo mantendras:",
    "- pedidos sin limite",
    "- historico operativo del local",
    "- IA adaptativa con aprendizaje continuo",
    "- seguimiento QR y visibilidad para el cliente",
    "",
    "Acceso al panel:",
    accessUrl,
    "",
    "Si nos confirmas, dejamos el restaurante activo en el plan completo y seguimos con onboarding real del equipo.",
  ].join("\n");

  return {
    to: restaurant.email,
    subject,
    body,
    href: `mailto:${encodeURIComponent(restaurant.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

function formatAdminEmailDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function buildClientUrl(orderId) {
  const url = new URL("./client-launch.html", window.location.href);
  const publicOrderId = typeof orderId === "string" ? orderId : getOrderPublicTrackingToken(orderId);
  url.hash = `order=${encodeURIComponent(publicOrderId)}`;
  return url.toString();
}

function buildQrUrl(orderId) {
  const publicOrderId = typeof orderId === "string" ? orderId : getOrderPublicTrackingToken(orderId);
  const cacheKey = normalizePublicTrackingToken(publicOrderId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(buildClientUrl(publicOrderId))}&cb=${encodeURIComponent(cacheKey)}`;
}

function getNextOrderIndex(orders) {
  const values = orders
    .map((order) => Number.parseInt(String(order.orderNumber || "").replace("#", ""), 10))
    .filter((value) => Number.isFinite(value));

  return Math.max(2047, ...values) + 1;
}

function formatRating(score) {
  if (!score) return "Sin valorar";
  return `${"★".repeat(score)}${"☆".repeat(5 - score)}`;
}

function getSyncChannel() {
  if (!("BroadcastChannel" in window)) return null;
  if (!window.__turnoListoSyncChannel) {
    window.__turnoListoSyncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
  return window.__turnoListoSyncChannel;
}

function onOrdersChanged(callback) {
  const handleExternalSync = () => {
    syncCachedStateFromLocalStorage();
    callback();
  };

  window.addEventListener(SYNC_EVENT_NAME, callback);
  window.addEventListener("storage", handleExternalSync);
  window.addEventListener("focus", handleExternalSync);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") handleExternalSync();
  });

  const channel = getSyncChannel();
  if (channel) {
    channel.addEventListener("message", handleExternalSync);
  }
}

function shouldRepairTrackingRecord(order, trackingRecord) {
  if (!trackingRecord) return true;

  const expectedTracking = buildPublicTrackingRecord(order);
  const trackedKeys = [
    "restaurantId",
    "restaurantName",
    "restaurantLogoUrl",
    "publicTrackingToken",
    "sourceOrderId",
    "orderNumber",
    "customerName",
    "pickupPoint",
    "estimatedReadyMinutes",
    "promisedReadyAt",
    "status",
    "createdAt",
    "archivedAt",
  ];

  return trackedKeys.some((key) => {
    const expectedValue = expectedTracking[key] ?? null;
    const currentValue = trackingRecord[key] ?? null;
    return expectedValue !== currentValue;
  });
}

function repairPublicTrackingRecordsFromOrders(orders) {
  if (!firebaseBackend?.enabled || typeof firebaseBackend.setDocument !== "function") return;

  const trackingLookup = buildTrackingLookup(loadPublicOrders());

  orders.forEach((order) => {
    const trackingRecord = trackingLookup.get(getTrackingLookupKey(order));
    if (!shouldRepairTrackingRecord(order, trackingRecord)) return;
    persistTrackingDocumentForOrder(order);
  });
}

function broadcastOrdersChanged() {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { at: Date.now() } }));
  const channel = getSyncChannel();
  if (channel) {
    channel.postMessage({ type: "orders-updated", at: Date.now() });
  }
}

function getTrackingLookupKey(value) {
  const candidate =
    typeof value === "string"
      ? value
      : value?.publicTrackingToken || value?.sourceOrderId || value?.id;
  return normalizePublicTrackingToken(candidate);
}

function buildTrackingLookup(trackingRecords) {
  return new Map(
    normalizePublicTracking(trackingRecords).flatMap((tracking) => {
      const keys = [
        getTrackingLookupKey(tracking.publicTrackingToken),
        getTrackingLookupKey(tracking.id),
        getTrackingLookupKey(tracking.sourceOrderId),
      ].filter(Boolean);
      return keys.map((key) => [key, tracking]);
    }),
  );
}

function buildPublicTrackingRecord(order) {
  const existingTracking = buildTrackingLookup(cachedTracking).get(getTrackingLookupKey(order));
  const restaurant = getRestaurantById(order.restaurantId);

  return {
    id: order.id,
    restaurantId: order.restaurantId,
    restaurantName: String(restaurant?.name || existingTracking?.restaurantName || "").trim(),
    restaurantLogoUrl: String(restaurant?.logoUrl || existingTracking?.restaurantLogoUrl || "").trim(),
    publicTrackingToken: getOrderPublicTrackingToken(order),
    sourceOrderId: order.sourceOrderId,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    pickupPoint: order.pickupPoint,
    estimatedReadyMinutes: order.estimatedReadyMinutes,
    promisedReadyAt: order.promisedReadyAt,
    status: order.status,
    rating: existingTracking?.rating || order.rating || null,
    createdAt: order.createdAt,
    archivedAt: order.archivedAt,
  };
}

function normalizePublicTracking(trackingRecords) {
  return [...trackingRecords]
    .map((tracking) => ({
      restaurantName: "",
      restaurantLogoUrl: "",
      publicTrackingToken: "",
      sourceOrderId: "",
      customerName: "",
      pickupPoint: "",
      estimatedReadyMinutes: null,
      promisedReadyAt: "",
      rating: null,
      archivedAt: null,
      ...tracking,
    }))
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
}

function buildPredictionDatasetRow(order, allOrders = loadOrders()) {
  const snapshot = order?.aiTrainingSnapshot || buildAiTrainingSnapshot(order, allOrders, order?.statusStartedAt || order?.createdAt);
  const record = order?.predictionTrainingRecord || buildPredictionTrainingRecord(order);

  return {
    orderId: order?.id || "",
    restaurantId: order?.restaurantId || "",
    sourceSystem: order?.sourceSystem || "",
    createdAt: order?.createdAt || null,
    finalStatus: record.finalStatus || order?.status || "",
    estimatedReadyMinutes: record.estimatedReadyMinutes,
    minutesToReady: record.minutesToReady,
    minutesToDelivered: record.minutesToDelivered,
    activeOrdersAtCapture: snapshot.activeOrders,
    preparingOrdersAtCapture: snapshot.preparingOrders,
    readyOrdersAtCapture: snapshot.readyOrders,
    overdueOrdersAtCapture: snapshot.overdueOrders,
    hourOfDay: snapshot.hourOfDay,
    dayOfWeek: snapshot.dayOfWeek,
    peakLoadScore: snapshot.peakLoadScore,
    currentStatusAtCapture: snapshot.currentStatus,
    hasReadyMilestone: Boolean(order?.lifecycleMilestones?.readyAt),
    hasDeliveredMilestone: Boolean(order?.lifecycleMilestones?.deliveredAt),
    timelineEventsCount: Array.isArray(order?.timelineEvents) ? order.timelineEvents.length : 0,
  };
}

function exportPredictionDataset(options = {}) {
  const orders = loadOrders();
  const safeOptions = { deliveredOnly: false, includeCancelled: false, period: null, ...options };
  const filteredOrders = orders.filter((order) => {
    if (safeOptions.period && !isWithinDashboardPeriod(order.createdAt, safeOptions.period)) return false;
    if (safeOptions.deliveredOnly && order.status !== "delivered") return false;
    if (!safeOptions.includeCancelled && order.status === "cancelled") return false;
    return true;
  });

  return filteredOrders.map((order) => buildPredictionDatasetRow(order, orders));
}

function initializeTurnoAlerts() {
  if (window.__turnoAlertsInitialized) return;
  window.__turnoAlertsInitialized = true;
  window.showTurnoAlert = showTurnoAlert;
}

function getTurnoAlertRoot() {
  let root = document.querySelector("#turnoAlertRoot");
  if (root) return root;

  root = document.createElement("div");
  root.id = "turnoAlertRoot";
  root.className = "turno-alert-root";
  document.body.append(root);
  return root;
}

function showTurnoAlert(message, type = "error", options = {}) {
  const translateKey = (key, fallback = "") =>
    window.TurnoListoI18n?.translateKey ? window.TurnoListoI18n.translateKey(key, window.TurnoListoI18n.getLanguage?.(), fallback) : fallback;
  const translateText = (value) =>
    window.TurnoListoI18n?.translateText ? window.TurnoListoI18n.translateText(value) : value;
  const root = getTurnoAlertRoot();
  const alert = document.createElement("article");
  const title = document.createElement("strong");
  const body = document.createElement("p");
  const close = document.createElement("button");
  const closeIcon = document.createElement("span");
  const closeLabel = document.createElement("span");
  const timeoutMs = options.timeoutMs ?? 6000;

  alert.className = `turno-alert turno-alert--${type}`;
  title.className = "turno-alert__title";
  body.className = "turno-alert__body";
  close.className = "turno-alert__close";
  close.type = "button";
  close.setAttribute("aria-label", translateKey("alert.closeAria", translateText("Cerrar alerta")));
  closeIcon.className = "material-symbols-rounded";
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.dataset.icon = "close";
  closeLabel.textContent = translateKey("client.close", translateText("Cerrar"));
  title.textContent =
    type === "success"
      ? translateKey("alert.successTitle", translateText("Todo correcto"))
      : type === "warning"
        ? translateKey("alert.warningTitle", translateText("Revisa esto"))
        : translateKey("alert.errorTitle", translateText("Algo ha fallado"));
  body.textContent = translateText(String(message || translateKey("alert.unexpected", "Ha ocurrido un error inesperado.")));

  close.addEventListener("click", () => {
    alert.remove();
  });

  close.append(closeIcon, closeLabel);
  alert.append(title, body, close);
  root.append(alert);

  window.setTimeout(() => {
    alert.remove();
  }, timeoutMs);
}

function notifyFirebaseError(error, fallbackMessage) {
  const code = error?.code || "";
  const message = mapFirebaseErrorMessage(code, fallbackMessage);
  showTurnoAlert(message, "error");
}

function mapFirebaseErrorMessage(code, fallbackMessage) {
  switch (code) {
    case "permission-denied":
      return "No tienes permiso para acceder a estos datos. Revisa el rol del usuario o las reglas de Firestore.";
    case "unauthenticated":
      return "Tu sesion no es valida o ha expirado. Inicia sesion de nuevo.";
    case "auth/unauthorized-domain":
      return "Este dominio no esta autorizado en Firebase Authentication.";
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Las credenciales no son validas. Revisa correo y contrasena.";
    case "auth/network-request-failed":
      return "No se pudo conectar con Firebase. Comprueba tu conexion e intentalo otra vez.";
    default:
      return fallbackMessage || "Ha ocurrido un error al comunicar con Firebase.";
  }
}
