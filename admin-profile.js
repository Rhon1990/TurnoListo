const adminProfileForm = document.querySelector("#adminProfileForm");
const adminProfileAvatarInput = document.querySelector("#adminProfileAvatarInput");
const adminProfileAvatarPreview = document.querySelector("#adminProfileAvatarPreview");
const adminProfileAvatarPreviewImage = document.querySelector("#adminProfileAvatarPreviewImage");
const adminProfileDisplayName = document.querySelector("#adminProfileDisplayName");
const adminProfileEmail = document.querySelector("#adminProfileEmail");
const adminProfilePhone = document.querySelector("#adminProfilePhone");
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
let adminProfileSnapshot = null;

initializeAdminProfilePage();

function initializeAdminProfilePage() {
  adminProfileForm?.addEventListener("submit", handleAdminProfileSubmit);
  adminProfileAvatarInput?.addEventListener("change", handleAdminAvatarSelection);
  adminCreateAdminForm?.addEventListener("submit", handleCreateAdminAccount);
  adminProfileResetButton?.addEventListener("click", restoreAdminProfileSnapshot);
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
      const storedProfile = await loadCurrentUserProfileFromBackend();
      if (storedProfile?.role !== "admin") {
        redirectToAdmin();
        return;
      }

      const profile = buildAdminProfileViewModel(storedProfile, user);

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
  adminProfileEmail.value = adminProfileSnapshot.email;
  adminProfilePhone.value = adminProfileSnapshot.phone;
  adminProfileTitle.value = adminProfileSnapshot.title;
  adminProfileCreatedAt.value = formatProfileDateTime(adminProfileSnapshot.createdAt);
  adminProfileUpdatedAt.value = formatProfileDateTime(adminProfileSnapshot.updatedAt);
  syncAdminAvatarPreview(selectedAdminAvatarUrl || adminProfileSnapshot.avatarUrl);
  renderAdminProfileSummary(profile);
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
    displayName: String(profile?.displayName || authDisplayName || authEmail || "Administrador").trim(),
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

function renderAdminProfileSummary(profile) {
  const displayName = String(profile?.displayName || profile?.email || "Administrador").trim();
  const title = String(profile?.title || "Acceso verificado").trim();
  const avatarUrl = String(selectedAdminAvatarUrl || profile?.avatarUrl || "").trim();
  adminProfileSummaryName.textContent = displayName;
  adminProfileSummaryTitle.textContent = title || "Acceso verificado";
  adminProfileSummaryAvatarFallback.textContent = displayName.charAt(0).toUpperCase() || "A";

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
    syncAdminAvatarPreview(getCurrentUserProfile()?.avatarUrl || "");
    return;
  }

  try {
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
    const submitButton = adminProfileForm?.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    await backend.updateCurrentAdminProfile({
      displayName: adminProfileDisplayName?.value || "",
      phone: adminProfilePhone?.value || "",
      title: adminProfileTitle?.value || "",
      avatarUrl: selectedAdminAvatarUrl || getCurrentUserProfile()?.avatarUrl || "",
    });
    const storedProfile = await loadCurrentUserProfileFromBackend();
    const nextProfile = buildAdminProfileViewModel(storedProfile, backend.getCurrentUser?.() || null);
    selectedAdminAvatarUrl = "";
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
  adminProfileEmail.value = adminProfileSnapshot.email;
  adminProfilePhone.value = adminProfileSnapshot.phone;
  adminProfileTitle.value = adminProfileSnapshot.title;
  adminProfileCreatedAt.value = formatProfileDateTime(adminProfileSnapshot.createdAt);
  adminProfileUpdatedAt.value = formatProfileDateTime(adminProfileSnapshot.updatedAt);
  syncAdminAvatarPreview(adminProfileSnapshot.avatarUrl);
  renderAdminProfileSummary(adminProfileSnapshot);
  if (adminProfileAvatarInput) {
    adminProfileAvatarInput.value = "";
  }
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

function formatProfileDateTime(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
