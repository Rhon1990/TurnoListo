const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const ADMIN_SESSION_KEY = "turnolisto-admin-session-v1";
const adminParams = new URLSearchParams(window.location.search);

const adminLoginView = document.querySelector("#adminLoginView");
const adminWorkspace = document.querySelector("#adminWorkspace");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminLoginFeedback = document.querySelector("#adminLoginFeedback");
const adminLoginPassword = document.querySelector("#adminLoginPassword");
const adminLoginTogglePassword = document.querySelector("#adminLoginTogglePassword");
const adminLogoutButton = document.querySelector("#adminLogoutButton");
const adminCreateRestaurantForm = document.querySelector("#adminCreateRestaurantForm");
const adminCreateFeedback = document.querySelector("#adminCreateFeedback");
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
const PLAN_DURATIONS = {
  Quincenal: 15,
  Mensual: 30,
  Trimestral: 90,
  Semestral: 180,
  Anual: 365,
};

bootAdminPage();
onOrdersChanged(renderAdminWorkspace);
adminLoginForm.addEventListener("submit", handleAdminLogin);
adminLoginTogglePassword.addEventListener("click", (event) => {
  event.preventDefault();
  togglePasswordVisibility(adminLoginPassword, adminLoginTogglePassword);
});
adminLogoutButton.addEventListener("click", handleAdminLogout);
adminCreateRestaurantForm.addEventListener("submit", handleCreateRestaurant);
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

function tryAutoLoginFromUrl() {
  const username = String(adminParams.get("username") || "").trim();
  const password = String(adminParams.get("password") || "").trim();

  if (!username && !password) return;

  const usernameInput = adminLoginForm.querySelector('[name="username"]');
  const passwordInput = adminLoginForm.querySelector('[name="password"]');
  usernameInput.value = username;
  passwordInput.value = password;

  if (!authenticateAdminCredentials(username, password)) {
    adminLoginFeedback.textContent = "Las credenciales recibidas por URL no son válidas.";
    adminLoginFeedback.className = "form-feedback form-feedback--error";
    adminLoginFeedback.hidden = false;
    return;
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
  adminLoginFeedback.hidden = true;
  adminLoginFeedback.textContent = "";
}

function syncActivationDaysWithPlan() {
  const plan = adminPlanSelect.value || "Mensual";
  adminActivationDays.value = PLAN_DURATIONS[plan] || 30;
}

function isAdminAuthenticated() {
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "active";
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

function handleAdminLogin(event) {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!authenticateAdminCredentials(username, password)) {
    adminLoginFeedback.textContent = "Credenciales de administrador incorrectas.";
    adminLoginFeedback.className = "form-feedback form-feedback--error";
    adminLoginFeedback.hidden = false;
    return;
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
  adminLoginForm.reset();
  adminLoginFeedback.hidden = true;
  adminLoginFeedback.textContent = "";
  syncAdminAccess();
  renderAdminWorkspace();
}

function authenticateAdminCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

function handleAdminLogout() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
  syncAdminAccess();
}

function handleCreateRestaurant(event) {
  event.preventDefault();
  const formData = new FormData(adminCreateRestaurantForm);

  try {
    const restaurant = createRestaurantAccount({
      name: formData.get("name"),
      ownerName: formData.get("ownerName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      address: formData.get("address"),
      planName: formData.get("planName"),
      activationDays: formData.get("activationDays"),
      notes: formData.get("notes"),
    });

    adminCreateRestaurantForm.reset();
    syncActivationDaysWithPlan();
    adminCreateFeedback.textContent = `Acceso creado para ${restaurant.name}. Credenciales generadas automáticamente.`;
    adminCreateFeedback.className = "form-feedback form-feedback--success";
    adminCreateFeedback.hidden = false;
    openCredentialsEmail(restaurant);
    activeAdminSection = "restaurants";
    renderAdminWorkspace();
  } catch (error) {
    if (error instanceof Error && error.message === "duplicate-restaurant-username") {
      adminCreateFeedback.textContent = "Ese usuario ya existe para otro restaurante.";
      adminCreateFeedback.className = "form-feedback form-feedback--error";
      adminCreateFeedback.hidden = false;
      return;
    }

    throw error;
  }
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
    const resend = document.createElement("button");
    const remove = document.createElement("button");

    card.className = "admin-card";
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
    title.textContent = restaurant.name;
    login.textContent = `Usuario: ${restaurant.username}`;
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
    link.href = "./restaurant.html";
    link.textContent = "Abrir acceso restaurante";
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

    meta.append(status);
    passwordWrap.append(passwordLabel, passwordValue, togglePassword);
    actions.append(link, resend, remove);
    grid.append(owner, contact, address, activation, orders, login, notes, passwordWrap);
    card.append(title, meta, grid, actions);
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
