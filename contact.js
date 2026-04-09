const contactForm = document.querySelector("#contactForm");
const contactFeedback = document.querySelector("#contactFormFeedback");
const contactSubmitButton = document.querySelector("#contactSubmitButton");
const contactName = document.querySelector("#contactName");
const contactCompany = document.querySelector("#contactCompany");
const contactEmail = document.querySelector("#contactEmail");
const contactPhone = document.querySelector("#contactPhone");
const contactInterest = document.querySelector("#contactInterest");
const restaurantAccountButton = document.querySelector("#restaurantAccountButton");
const restaurantAccountPanel = document.querySelector("#restaurantAccountPanel");
const restaurantAccountAvatarImage = document.querySelector("#restaurantAccountAvatarImage");
const restaurantAccountAvatarFallback = document.querySelector("#restaurantAccountAvatarFallback");
const restaurantAccountName = document.querySelector("#restaurantAccountName");
const restaurantAccountMeta = document.querySelector("#restaurantAccountMeta");
const restaurantMenuLogout = document.querySelector("#restaurantMenuLogout");
const RESTAURANT_STORAGE_KEY = "turnolisto-restaurants-v1";
const RESTAURANT_SESSION_KEY = "turnolisto-restaurant-session-v1";

let contactPrefillSnapshot = null;

if (contactForm && contactFeedback && contactSubmitButton) {
  contactForm.addEventListener("submit", handleContactSubmit);
  restaurantAccountButton?.addEventListener("click", toggleRestaurantAccountMenu);
  restaurantMenuLogout?.addEventListener("click", async () => {
    closeRestaurantAccountMenu();
    await handleRestaurantLogout();
  });
  window.addEventListener("click", handleRestaurantAccountOutsideClick);
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
    setContactFeedback("Escribe un mensaje un poco más descriptivo, al menos 5 caracteres.", "error");
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
      "Tu solicitud se registró correctamente. El equipo de TurnoListo la revisará desde la bandeja interna de administración.",
      "success",
    );
  } catch (error) {
    console.error("No se pudo enviar el formulario de contacto.", error);
    const message =
      error?.message && String(error.message).includes("demasiado corto")
        ? "Escribe un mensaje un poco más descriptivo para poder enviarlo."
        : "No se pudo registrar tu solicitud ahora mismo. Inténtalo de nuevo en unos minutos.";
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
  setInputValueIfEmpty(contactPhone, contactPrefillSnapshot.phone);

  if (contactInterest && !String(contactInterest.value || "").trim()) {
    contactInterest.value = contactPrefillSnapshot.interest;
  } else if (contactInterest && contactInterest.value === "Interés de inversión") {
    contactInterest.value = contactPrefillSnapshot.interest;
  }
}

function setInputValueIfEmpty(element, value) {
  if (!element) return;
  if (String(element.value || "").trim()) return;
  element.value = String(value || "").trim();
}

function renderRestaurantAccount(restaurant) {
  if (!restaurantAccountName) return;
  const restaurantName = String(restaurant?.name || "Restaurante").trim();
  const logoUrl = String(restaurant?.logoUrl || "").trim();
  restaurantAccountName.textContent = restaurantName;
  restaurantAccountMeta.textContent = "Acceso verificado";
  restaurantAccountAvatarFallback.textContent = restaurantName.charAt(0).toUpperCase() || "R";

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
