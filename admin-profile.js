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
const adminMessagesShortcut = document.querySelector("#adminMessagesShortcut");
const adminUnreadMessagesBadge = document.querySelector("#adminUnreadMessagesBadge");
const adminAccountButton = document.querySelector("#adminAccountButton");
const adminAccountPanel = document.querySelector("#adminAccountPanel");
const adminAccountAvatarImage = document.querySelector("#adminAccountAvatarImage");
const adminAccountAvatarFallback = document.querySelector("#adminAccountAvatarFallback");
const adminAccountName = document.querySelector("#adminAccountName");
const adminAccountMeta = document.querySelector("#adminAccountMeta");
const adminMenuDashboard = document.querySelector("#adminMenuDashboard");
const adminMenuRestaurants = document.querySelector("#adminMenuRestaurants");
const adminMenuMessages = document.querySelector("#adminMenuMessages");
const adminMenuLogout = document.querySelector("#adminMenuLogout");

let selectedAdminAvatarUrl = "";
let adminUsers = [];
let adminMessagesUnsubscribe = null;

initializeAdminProfilePage();

function initializeAdminProfilePage() {
  adminProfileForm?.addEventListener("submit", handleAdminProfileSubmit);
  adminProfileAvatarInput?.addEventListener("change", handleAdminAvatarSelection);
  adminCreateAdminForm?.addEventListener("submit", handleCreateAdminAccount);
  adminMessagesShortcut?.addEventListener("click", () => {
    window.location.href = "./admin.html#messages";
  });
  adminAccountButton?.addEventListener("click", toggleAdminAccountMenu);
  adminMenuDashboard?.addEventListener("click", () => navigateToAdminSection("dashboard"));
  adminMenuRestaurants?.addEventListener("click", () => navigateToAdminSection("restaurants"));
  adminMenuMessages?.addEventListener("click", () => navigateToAdminSection("messages"));
  adminMenuLogout?.addEventListener("click", async () => {
    closeAdminAccountMenu();
    await handleAdminLogout();
  });
  window.addEventListener("click", handleAdminAccountOutsideClick);
  waitForDataReady().then(() => {
    initializeAdminProfileAuth();
  });
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
      const profile = await loadCurrentUserProfileFromBackend();
      if (profile?.role !== "admin") {
        redirectToAdmin();
        return;
      }

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
  adminProfileDisplayName.value = profile.displayName || "";
  adminProfileEmail.value = profile.email || "";
  adminProfilePhone.value = profile.phone || "";
  adminProfileTitle.value = profile.title || "";
  syncAdminAvatarPreview(selectedAdminAvatarUrl || profile.avatarUrl || "");
}

function renderAdminAccount(profile) {
  const displayName = String(profile?.displayName || profile?.email || "Administrador").trim();
  const title = String(profile?.title || "").trim();
  const avatarUrl = String(profile?.avatarUrl || "").trim();
  adminAccountName.textContent = displayName;
  adminAccountMeta.textContent = title ? `${title} · Acceso verificado` : "Acceso verificado";
  adminAccountAvatarFallback.textContent = displayName.charAt(0).toUpperCase() || "A";

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
    selectedAdminAvatarUrl = await optimizeAccountImage(file);
    syncAdminAvatarPreview(selectedAdminAvatarUrl);
    adminProfileFeedback.hidden = true;
    adminProfileFeedback.textContent = "";
  } catch (error) {
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
    renderAdminAccount(getCurrentUserProfile() || {});
    renderAdminProfile(getCurrentUserProfile() || {});
    await refreshAdminUsers();
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
    adminUsers = [];
    renderAdminUsersList("No se pudo cargar el equipo administrador por ahora.");
  }
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

function buildAdminAccessUrl() {
  return new URL("./admin.html", window.location.href).toString();
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
