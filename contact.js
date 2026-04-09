const contactForm = document.querySelector("#contactForm");
const contactFeedback = document.querySelector("#contactFormFeedback");
const contactSubmitButton = document.querySelector("#contactSubmitButton");
const contactName = document.querySelector("#contactName");
const contactCompany = document.querySelector("#contactCompany");
const contactEmail = document.querySelector("#contactEmail");
const contactPhone = document.querySelector("#contactPhone");
const contactInterest = document.querySelector("#contactInterest");

let contactPrefillSnapshot = null;

if (contactForm && contactFeedback && contactSubmitButton) {
  contactForm.addEventListener("submit", handleContactSubmit);
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
    setContactFeedback(
      "No se pudo registrar tu solicitud ahora mismo. Inténtalo de nuevo en unos minutos.",
      "error",
    );
  } finally {
    contactSubmitButton.disabled = false;
  }
}

async function initializeContactPrefill() {
  try {
    const backend = await window.__turnoFirebaseReadyPromise;
    if (!backend?.enabled || typeof backend.getCurrentUser !== "function" || typeof backend.getDocument !== "function") {
      return;
    }

    const user = backend.getCurrentUser();
    if (!user?.uid) return;

    const profile = await backend.getDocument("users", user.uid);
    if (!profile || profile.role !== "restaurant" || !profile.restaurantId) return;

    const restaurant = await backend.getDocument("restaurants", profile.restaurantId);
    if (!restaurant) return;

    contactPrefillSnapshot = {
      name: String(restaurant.ownerName || restaurant.name || "").trim(),
      company: String(restaurant.name || "").trim(),
      email: String(restaurant.email || profile.email || user.email || "").trim(),
      phone: String(restaurant.phone || "").trim(),
      interest: "Soporte operativo",
    };

    applyContactPrefillSnapshot();
  } catch (error) {
    console.error("No se pudieron precargar los datos del restaurante en contacto.", error);
  }
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
