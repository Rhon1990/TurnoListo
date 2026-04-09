const contactForm = document.querySelector("#contactForm");
const contactFeedback = document.querySelector("#contactFormFeedback");
const contactSubmitButton = document.querySelector("#contactSubmitButton");

if (contactForm && contactFeedback && contactSubmitButton) {
  contactForm.addEventListener("submit", handleContactSubmit);
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
