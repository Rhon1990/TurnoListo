const adminParams = new URLSearchParams(window.location.search);

const adminLoginView = document.querySelector("#adminLoginView");
const adminWorkspace = document.querySelector("#adminWorkspace");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminLoginFeedback = document.querySelector("#adminLoginFeedback");
const adminLoginUsername = adminLoginForm.querySelector('[name="username"]');
const adminLoginPassword = document.querySelector("#adminLoginPassword");
const adminLoginTogglePassword = document.querySelector("#adminLoginTogglePassword");
const adminLogoutButton = document.querySelector("#adminLogoutButton");
const adminCreateRestaurantForm = document.querySelector("#adminCreateRestaurantForm");
const adminCreateFeedback = document.querySelector("#adminCreateFeedback");
const adminRestaurantLogoInput = document.querySelector("#adminRestaurantLogoInput");
const adminRestaurantLogoPreview = document.querySelector("#adminRestaurantLogoPreview");
const adminRestaurantLogoPreviewImage = document.querySelector("#adminRestaurantLogoPreviewImage");
const adminPlanSelect = document.querySelector("#adminPlanSelect");
const adminActivationDays = document.querySelector("#adminActivationDays");
const adminRestaurantList = document.querySelector("#adminRestaurantList");
const adminRestaurantCount = document.querySelector("#adminRestaurantCount");
const adminTabs = document.querySelectorAll("[data-admin-section]");
const adminPanels = document.querySelectorAll("[data-admin-panel]");
const adminSearchInput = document.querySelector("#adminSearchInput");
const adminStatusFilter = document.querySelector("#adminStatusFilter");
const adminActivityFilter = document.querySelector("#adminActivityFilter");
const adminStatRestaurants = document.querySelector("#adminStatRestaurants");
const adminStatActiveRestaurants = document.querySelector("#adminStatActiveRestaurants");
const adminStatExpiredRestaurants = document.querySelector("#adminStatExpiredRestaurants");
const adminStatSoonToExpire = document.querySelector("#adminStatSoonToExpire");
const adminStatTotalOrders = document.querySelector("#adminStatTotalOrders");
const adminStatActiveOrders = document.querySelector("#adminStatActiveOrders");
const adminStatDelivered = document.querySelector("#adminStatDelivered");
const adminStatCancelled = document.querySelector("#adminStatCancelled");
const adminTopRestaurantPanel = document.querySelector("#adminTopRestaurantPanel");
const adminInsights = document.querySelector("#adminInsights");
const adminDeleteModal = document.querySelector("#adminDeleteModal");
const adminDeleteBackdrop = document.querySelector("#adminDeleteBackdrop");
const adminDeleteClose = document.querySelector("#adminDeleteClose");
const adminDeleteBack = document.querySelector("#adminDeleteBack");
const adminDeleteConfirm = document.querySelector("#adminDeleteConfirm");
const adminDeleteMeta = document.querySelector("#adminDeleteMeta");

let activeAdminSection = "dashboard";
let pendingDeleteRestaurantId = null;
let pendingDeleteRestaurantName = "";
let selectedRestaurantLogoUrl = "";
const PLAN_DURATIONS = {
  Quincenal: 15,
  Mensual: 30,
  Trimestral: 90,
  Semestral: 180,
  Anual: 365,
};

initializeAdminFirebaseAuth();
waitForDataReady().then(bootAdminPage);
onOrdersChanged(() => {
  waitForDataReady().then(renderAdminWorkspace);
});
adminLoginForm.addEventListener("submit", handleAdminLogin);
adminLoginTogglePassword.addEventListener("click", (event) => {
  event.preventDefault();
  togglePasswordVisibility(adminLoginPassword, adminLoginTogglePassword);
});
adminLogoutButton.addEventListener("click", handleAdminLogout);
adminCreateRestaurantForm.addEventListener("submit", handleCreateRestaurant);
adminRestaurantLogoInput.addEventListener("change", handleRestaurantLogoSelection);
adminPlanSelect.addEventListener("change", syncActivationDaysWithPlan);
adminDeleteBackdrop.addEventListener("click", closeDeleteModal);
adminDeleteClose.addEventListener("click", closeDeleteModal);
adminDeleteBack.addEventListener("click", closeDeleteModal);
adminDeleteConfirm.addEventListener("click", confirmDeleteRestaurant);
adminTabs.forEach((button) => {
  button.addEventListener("click", () => {
    activeAdminSection = button.dataset.adminSection || "dashboard";
    syncAdminSections();
  });
});
[adminSearchInput, adminStatusFilter, adminActivityFilter].forEach((control) => {
  control.addEventListener("input", renderAdminWorkspace);
  control.addEventListener("change", renderAdminWorkspace);
});

function bootAdminPage() {
  tryAutoLoginFromUrl();
  syncAdminAccess();
  syncActivationDaysWithPlan();
  if (isAdminAuthenticated()) {
    renderAdminWorkspace();
  }
}

async function tryAutoLoginFromUrl() {
  const username = String(adminParams.get("email") || adminParams.get("username") || "").trim();
  const password = String(adminParams.get("password") || "").trim();

  if (!username && !password) return;

  adminLoginUsername.value = username;
  adminLoginPassword.value = password;

  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.signIn !== "function") return;

  try {
    await backend.signIn(username, password);
  } catch {
    adminLoginFeedback.textContent = "Las credenciales recibidas por URL no son válidas.";
    adminLoginFeedback.className = "form-feedback form-feedback--error";
    adminLoginFeedback.hidden = false;
  }
}

function syncActivationDaysWithPlan() {
  const plan = adminPlanSelect.value || "Mensual";
  adminActivationDays.value = PLAN_DURATIONS[plan] || 30;
}

function isAdminAuthenticated() {
  return getCurrentUserProfile()?.role === "admin";
}

function syncAdminAccess() {
  const authenticated = isAdminAuthenticated();
  adminLoginView.hidden = authenticated;
  adminWorkspace.hidden = !authenticated;
}

function syncAdminSections() {
  adminTabs.forEach((button) => {
    const isActive = button.dataset.adminSection === activeAdminSection;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  adminPanels.forEach((panel) => {
    const isActive = panel.dataset.adminPanel === activeAdminSection;
    panel.hidden = !isActive;
    panel.classList.toggle("restaurant-section--active", isActive);
  });
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const backend = await waitForFirebaseBackend();
  if (!backend?.enabled || typeof backend.signIn !== "function") {
    adminLoginFeedback.textContent = "Firebase Authentication no está disponible en esta configuración.";
    adminLoginFeedback.className = "form-feedback form-feedback--error";
    adminLoginFeedback.hidden = false;
    return;
  }

  try {
    await backend.signIn(username, password);
    adminLoginForm.reset();
    adminLoginFeedback.hidden = true;
    adminLoginFeedback.textContent = "";
  } catch (error) {
    console.error("No se pudo iniciar sesion como administrador.", error);
    adminLoginFeedback.textContent = "Credenciales incorrectas o la cuenta no tiene un perfil admin en users/{uid}.";
    adminLoginFeedback.className = "form-feedback form-feedback--error";
    adminLoginFeedback.hidden = false;
    showTurnoAlert("No se pudo iniciar sesion como administrador. Verifica credenciales, dominio autorizado y el perfil users/{uid}.", "error");
  }
}

async function handleAdminLogout() {
  const backend = await waitForFirebaseBackend();
  clearCurrentUserProfile();
  syncAdminAccess();

  if (backend?.enabled && typeof backend.signOut === "function") {
    await backend.signOut();
  }
}

async function handleCreateRestaurant(event) {
  event.preventDefault();
  const formData = new FormData(adminCreateRestaurantForm);
  const backend = await waitForFirebaseBackend();

  if (!backend?.enabled || typeof backend.createRestaurantAccount !== "function") {
    adminCreateFeedback.textContent = "La automatizacion del alta no esta disponible. Revisa Firebase Functions.";
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert("La automatizacion del alta no esta disponible. Revisa Firebase Functions.", "error");
    return;
  }

  try {
    const result = await backend.createRestaurantAccount({
      name: formData.get("name"),
      ownerName: formData.get("ownerName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      address: formData.get("address"),
      logoUrl: selectedRestaurantLogoUrl,
      planName: formData.get("planName"),
      activationDays: formData.get("activationDays"),
      notes: formData.get("notes"),
    });
    const restaurant = result?.restaurant;

    adminCreateRestaurantForm.reset();
    resetRestaurantLogoPreview();
    syncActivationDaysWithPlan();
    await reconnectDataStoreToFirebase();
    adminCreateFeedback.textContent = `Acceso creado para ${restaurant.name}. Usuario Auth y perfil users/{uid} generados automaticamente.`;
    adminCreateFeedback.className = "form-feedback form-feedback--success";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(`Restaurante ${restaurant.name} creado correctamente.`, "success");
    openCredentialsEmail(restaurant);
    activeAdminSection = "restaurants";
    renderAdminWorkspace();
  } catch (error) {
    console.error("No se pudo crear el restaurante automaticamente.", error);
    const message =
      error?.code === "functions/already-exists"
        ? "Ese correo ya existe para otro restaurante o en Firebase Authentication."
        : "No se pudo crear el restaurante. Revisa Firebase Functions, permisos y configuracion.";
    adminCreateFeedback.textContent = message;
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(message, "error");
  }
}

async function handleRestaurantLogoSelection(event) {
  const file = event.target.files?.[0] || null;
  if (!file) {
    resetRestaurantLogoPreview();
    return;
  }

  try {
    selectedRestaurantLogoUrl = await optimizeRestaurantLogo(file);
    adminRestaurantLogoPreviewImage.src = selectedRestaurantLogoUrl;
    adminRestaurantLogoPreview.hidden = false;
    adminCreateFeedback.hidden = true;
    adminCreateFeedback.textContent = "";
  } catch (error) {
    console.error("No se pudo preparar el logo del restaurante.", error);
    resetRestaurantLogoPreview();
    adminCreateFeedback.textContent =
      error instanceof Error ? error.message : "No se pudo procesar el logo. Usa una imagen JPG, PNG o WebP mas ligera.";
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(adminCreateFeedback.textContent, "error");
  }
}

function resetRestaurantLogoPreview() {
  selectedRestaurantLogoUrl = "";
  adminRestaurantLogoInput.value = "";
  adminRestaurantLogoPreviewImage.removeAttribute("src");
  adminRestaurantLogoPreview.hidden = true;
}

async function optimizeRestaurantLogo(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen valida para el logo.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("El logo pesa demasiado. Usa una imagen de menos de 5 MB.");
  }

  const image = await loadImageFile(file);
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

  const optimized = canvas.toDataURL("image/webp", 0.88);
  if (optimized.length > 350000) {
    throw new Error("El logo sigue siendo grande. Usa una imagen mas simple o recortada.");
  }
  return optimized;
}

function loadImageFile(file) {
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

function initializeAdminFirebaseAuth() {
  waitForFirebaseBackend().then((backend) => {
    if (!backend?.enabled || typeof backend.onAuthStateChanged !== "function") return;

    backend.onAuthStateChanged(async (user) => {
      if (!user?.uid) {
        clearCurrentUserProfile();
        syncAdminAccess();
        return;
      }

      await reconnectDataStoreToFirebase();
      const profile = await loadCurrentUserProfileFromBackend();

      if (profile?.role !== "admin") {
        clearCurrentUserProfile();
        adminLoginFeedback.textContent = "La cuenta autenticada no tiene role=admin en users/{uid}.";
        adminLoginFeedback.className = "form-feedback form-feedback--error";
        adminLoginFeedback.hidden = false;
        showTurnoAlert("La cuenta autenticada no tiene permisos de administrador.", "error");
        await backend.signOut();
        return;
      }

      adminLoginFeedback.hidden = true;
      adminLoginFeedback.textContent = "";
      syncAdminAccess();
      renderAdminWorkspace();
    });
  });
}

function renderAdminWorkspace() {
  if (!isAdminAuthenticated()) return;

  syncAdminSections();
  const stats = getAdminDashboardStats();
  const restaurants = loadRestaurants();
  const orders = loadOrders();
  const enrichedRestaurants = restaurants
    .map((restaurant) => {
      const restaurantOrders = orders.filter((order) => order.restaurantId === restaurant.id);
      const deliveredOrders = restaurantOrders.filter((order) => order.status === "delivered");

      return {
        ...restaurant,
        status: getRestaurantAccessStatus(restaurant),
        remainingDays: getRestaurantRemainingDays(restaurant),
        orderCount: restaurantOrders.length,
        activeOrderCount: restaurantOrders.filter((order) => !order.archivedAt).length,
        deliveredCount: deliveredOrders.length,
        cancelledCount: restaurantOrders.filter((order) => order.status === "cancelled").length,
        avgDeliveryMinutes: deliveredOrders.length
          ? Math.round(
              deliveredOrders.reduce((total, order) => total + getOrderDurationMinutes(order), 0) / deliveredOrders.length,
            )
          : 0,
      };
    })
    .filter(matchesAdminFilters)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  renderAdminDashboard(stats);
  renderRestaurantDirectory(enrichedRestaurants);
}

function renderAdminDashboard(stats) {
  adminRestaurantCount.textContent = stats.totalRestaurants;
  adminStatRestaurants.textContent = stats.totalRestaurants;
  adminStatActiveRestaurants.textContent = stats.activeRestaurants;
  adminStatExpiredRestaurants.textContent = stats.expiredRestaurants;
  adminStatSoonToExpire.textContent = stats.soonToExpire;
  adminStatTotalOrders.textContent = stats.totalOrders;
  adminStatActiveOrders.textContent = stats.activeOrders;
  adminStatDelivered.textContent = stats.deliveredOrders;
  adminStatCancelled.textContent = stats.cancelledOrders;

  adminTopRestaurantPanel.innerHTML = "";
  adminInsights.innerHTML = "";

  const topBox = document.createElement("article");
  topBox.className = "dashboard-insight";
  if (stats.topRestaurant) {
    topBox.textContent =
      `${stats.topRestaurant.restaurant.name} lidera con ${stats.topRestaurant.orderCount} pedidos y un promedio de ${formatDurationMinutes(stats.topRestaurant.avgDeliveryMinutes)} por entrega.`;
  } else {
    topBox.textContent = "Todavía no hay actividad suficiente para destacar un restaurante.";
  }
  adminTopRestaurantPanel.append(topBox);

  buildAdminInsights(stats).forEach((message) => {
    const card = document.createElement("article");
    card.className = "dashboard-insight";
    card.textContent = message;
    adminInsights.append(card);
  });
}

function buildAdminInsights(stats) {
  const insights = [];

  if (stats.expiredRestaurants > 0) {
    insights.push(`Hay ${stats.expiredRestaurants} restaurantes con acceso vencido. Conviene revisar cobro o renovación.`);
  }

  if (stats.soonToExpire > 0) {
    insights.push(`${stats.soonToExpire} restaurantes vencen en menos de 7 días. Buen momento para activar recordatorios.`);
  }

  if (stats.activeOrders > stats.deliveredOrders) {
    insights.push("La operación activa es alta frente a los entregados. Revisa si algunos locales necesitan apoyo.");
  }

  if (!insights.length) {
    insights.push("La cartera va estable. Aquí aparecerán avisos cuando detectemos vencimientos o cuellos de botella.");
  }

  return insights.slice(0, 3);
}

function matchesAdminFilters(restaurant) {
  const search = String(adminSearchInput.value || "").trim().toLowerCase();
  const status = adminStatusFilter.value || "all";
  const activity = adminActivityFilter.value || "all";

  if (search) {
    const haystack = [
      restaurant.name,
      restaurant.ownerName,
      restaurant.username,
      restaurant.email,
      restaurant.phone,
      restaurant.city,
      restaurant.address,
      restaurant.planName,
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) return false;
  }

  if (status === "active" && restaurant.status !== "active") return false;
  if (status === "expired" && restaurant.status !== "expired") return false;
  if (status === "expiring" && !(restaurant.remainingDays !== null && restaurant.remainingDays >= 0 && restaurant.remainingDays <= 7)) {
    return false;
  }

  if (activity === "with-orders" && restaurant.orderCount === 0) return false;
  if (activity === "without-orders" && restaurant.orderCount > 0) return false;

  return true;
}

function renderRestaurantDirectory(restaurants) {
  adminRestaurantList.innerHTML = "";

  if (!restaurants.length) {
    const empty = document.createElement("article");
    empty.className = "empty-state";
    empty.textContent = "No hay restaurantes que coincidan con esos filtros.";
    adminRestaurantList.append(empty);
    return;
  }

  restaurants.forEach((restaurant) => {
    const card = document.createElement("article");
    const top = document.createElement("div");
    const brand = document.createElement("div");
    const brandLogoWrap = document.createElement("div");
    const brandLogo = document.createElement("img");
    const brandFallback = document.createElement("span");
    const brandText = document.createElement("div");
    const title = document.createElement("h3");
    const meta = document.createElement("div");
    const status = document.createElement("span");
    const grid = document.createElement("div");
    const owner = document.createElement("p");
    const contact = document.createElement("p");
    const address = document.createElement("p");
    const activation = document.createElement("p");
    const orders = document.createElement("p");
    const notes = document.createElement("p");
    const login = document.createElement("p");
    const passwordWrap = document.createElement("div");
    const passwordLabel = document.createElement("span");
    const passwordValue = document.createElement("strong");
    const togglePassword = document.createElement("button");
    const actions = document.createElement("div");
    const link = document.createElement("a");
    const updateLogo = document.createElement("button");
    const logoInput = document.createElement("input");
    const resend = document.createElement("button");
    const remove = document.createElement("button");

    card.className = "admin-card";
    top.className = "admin-card__top";
    brand.className = "admin-card__brand";
    brandLogoWrap.className = "admin-card__brand-logo";
    brandText.className = "admin-card__brand-text";
    meta.className = "admin-card__meta";
    passwordWrap.className = "admin-card__password";
    passwordLabel.className = "admin-card__password-label";
    passwordValue.className = "admin-card__password-value";
    actions.className = "admin-card__actions";
    status.className = "status-pill";
    status.textContent = restaurant.status === "active" ? "Activo" : "Vencido";
    status.style.background = restaurant.status === "active" ? "rgba(31, 122, 99, 0.12)" : "rgba(127, 29, 29, 0.12)";
    status.style.color = restaurant.status === "active" ? "#1f7a63" : "#7f1d1d";
    grid.className = "admin-card__grid";
    brandFallback.className = "admin-card__brand-fallback";
    title.textContent = restaurant.name;
    login.textContent = `Correo auth: ${restaurant.username}`;
    owner.textContent = `Responsable: ${restaurant.ownerName || "Sin definir"}`;
    contact.textContent = `Contacto: ${restaurant.email || "Sin correo"} · ${restaurant.phone || "Sin móvil"}`;
    address.textContent = `Dirección: ${restaurant.address || "Sin dirección"} · ${restaurant.city || "Sin ciudad"}`;
    activation.textContent =
      `Activado hasta: ${formatAdminDate(restaurant.activatedUntil)} · ${buildRemainingAccessLabel(restaurant)}`;
    orders.textContent =
      `Pedidos: ${restaurant.orderCount} · Activos: ${restaurant.activeOrderCount} · Entregados: ${restaurant.deliveredCount}`;
    notes.textContent = restaurant.notes ? `Notas: ${restaurant.notes}` : "Notas: sin observaciones";
    passwordLabel.textContent = "Clave:";
    passwordValue.textContent = "••••••••••••";
    passwordValue.dataset.password = restaurant.password;
    togglePassword.type = "button";
    togglePassword.className = "password-toggle";
    togglePassword.textContent = "👁";
    togglePassword.setAttribute("aria-label", "Mostrar clave");
    togglePassword.addEventListener("click", () => {
      const isHidden = passwordValue.textContent !== restaurant.password;
      passwordValue.textContent = isHidden ? restaurant.password : "••••••••••••";
      togglePassword.classList.toggle("is-active", isHidden);
      togglePassword.setAttribute("aria-label", isHidden ? "Ocultar clave" : "Mostrar clave");
    });
    link.className = "qr-link";
    link.href = "#";
    link.textContent = "Abrir acceso restaurante";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.open("./restaurant.html", "_blank", "noopener,noreferrer");
    });
    updateLogo.type = "button";
    updateLogo.className = "comment-button";
    updateLogo.textContent = restaurant.logoUrl ? "Actualizar logo" : "Agregar logo";
    updateLogo.addEventListener("click", () => {
      logoInput.click();
    });
    logoInput.type = "file";
    logoInput.accept = "image/*";
    logoInput.hidden = true;
    logoInput.addEventListener("change", async () => {
      const file = logoInput.files?.[0] || null;
      if (!file) return;

      updateLogo.disabled = true;
      updateLogo.textContent = "Procesando...";

      try {
        const logoUrl = await optimizeRestaurantLogo(file);
        updateRestaurantAccount(restaurant.id, { logoUrl });
        adminCreateFeedback.textContent = `Logo actualizado para ${restaurant.name}.`;
        adminCreateFeedback.className = "form-feedback form-feedback--success";
        adminCreateFeedback.hidden = false;
        showTurnoAlert(`Logo actualizado para ${restaurant.name}.`, "success");
        renderAdminWorkspace();
      } catch (error) {
        console.error("No se pudo actualizar el logo del restaurante.", error);
        const message =
          error instanceof Error ? error.message : "No se pudo actualizar el logo del restaurante.";
        adminCreateFeedback.textContent = message;
        adminCreateFeedback.className = "form-feedback form-feedback--error";
        adminCreateFeedback.hidden = false;
        showTurnoAlert(message, "error");
      } finally {
        logoInput.value = "";
        updateLogo.disabled = false;
        updateLogo.textContent = restaurant.logoUrl ? "Actualizar logo" : "Agregar logo";
      }
    });
    resend.type = "button";
    resend.className = "comment-button";
    resend.textContent = "Reenviar credenciales";
    resend.addEventListener("click", () => {
      openCredentialsEmail(restaurant);
    });
    remove.type = "button";
    remove.className = "comment-button";
    remove.textContent = "Eliminar restaurante";
    remove.addEventListener("click", () => {
      openDeleteModal(restaurant);
    });

    if (restaurant.logoUrl) {
      brandLogo.src = restaurant.logoUrl;
      brandLogo.alt = `Logo de ${restaurant.name}`;
      brandLogoWrap.append(brandLogo);
    } else {
      brandFallback.textContent = String(restaurant.name || "?").trim().charAt(0).toUpperCase() || "R";
      brandLogoWrap.append(brandFallback);
    }
    brandText.append(title, meta);
    brand.append(brandLogoWrap, brandText);
    meta.append(status);
    passwordWrap.append(passwordLabel, passwordValue, togglePassword);
    actions.append(link, updateLogo, resend, remove);
    grid.append(owner, contact, address, activation, orders, login, notes, passwordWrap);
    card.append(top, grid, actions, logoInput);
    top.append(brand);
    adminRestaurantList.append(card);
  });
}

function formatAdminDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function buildRemainingAccessLabel(restaurant) {
  const days = restaurant.remainingDays;
  if (days === null) return "Sin vencimiento";
  if (days < 0) return "Acceso bloqueado";
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence en 1 día";
  return `Vence en ${days} días`;
}

function openCredentialsEmail(restaurant) {
  if (!restaurant.email) return;
  const email = buildRestaurantCredentialsEmail(restaurant);
  window.location.href = email.href;
}

function togglePasswordVisibility(input, button) {
  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.setAttribute("aria-label", shouldShow ? "Ocultar contraseña" : "Mostrar contraseña");
  button.classList.toggle("is-active", shouldShow);
}

function openDeleteModal(restaurant) {
  pendingDeleteRestaurantId = restaurant.id;
  pendingDeleteRestaurantName = restaurant.name;
  adminDeleteMeta.textContent = `${restaurant.name} · ${restaurant.email || "Sin correo"}`;
  adminDeleteModal.hidden = false;
}

function closeDeleteModal() {
  adminDeleteModal.hidden = true;
  pendingDeleteRestaurantId = null;
  pendingDeleteRestaurantName = "";
}

function confirmDeleteRestaurant() {
  if (!pendingDeleteRestaurantId) return;

  deleteRestaurantAccount(pendingDeleteRestaurantId);
  adminCreateFeedback.textContent = `Se eliminó ${pendingDeleteRestaurantName}.`;
  adminCreateFeedback.className = "form-feedback form-feedback--success";
  adminCreateFeedback.hidden = false;
  closeDeleteModal();
  renderAdminWorkspace();
}
