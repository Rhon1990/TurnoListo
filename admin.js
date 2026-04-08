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
const adminLifecycleFilter = document.querySelector("#adminLifecycleFilter");
const adminStatRestaurants = document.querySelector("#adminStatRestaurants");
const adminStatExpiredRestaurants = document.querySelector("#adminStatExpiredRestaurants");
const adminStatTotalOrders = document.querySelector("#adminStatTotalOrders");
const adminStatActiveOrders = document.querySelector("#adminStatActiveOrders");
const adminStatDelivered = document.querySelector("#adminStatDelivered");
const adminHeroActiveBase = document.querySelector("#adminHeroActiveBase");
const adminHeroActiveBaseHint = document.querySelector("#adminHeroActiveBaseHint");
const adminHeroWeeklyActivity = document.querySelector("#adminHeroWeeklyActivity");
const adminHeroWeeklyActivityHint = document.querySelector("#adminHeroWeeklyActivityHint");
const adminHeroRenewal = document.querySelector("#adminHeroRenewal");
const adminHeroRenewalHint = document.querySelector("#adminHeroRenewalHint");
const adminHeroRisk = document.querySelector("#adminHeroRisk");
const adminHeroRiskHint = document.querySelector("#adminHeroRiskHint");
const adminActionRenewal = document.querySelector("#adminActionRenewal");
const adminActionOnboarding = document.querySelector("#adminActionOnboarding");
const adminActionRisk = document.querySelector("#adminActionRisk");
const adminActionHealthy = document.querySelector("#adminActionHealthy");
const adminActionRenewalCount = document.querySelector("#adminActionRenewalCount");
const adminActionOnboardingCount = document.querySelector("#adminActionOnboardingCount");
const adminActionRiskCount = document.querySelector("#adminActionRiskCount");
const adminActionHealthyCount = document.querySelector("#adminActionHealthyCount");
const adminActionRenewalHint = document.querySelector("#adminActionRenewalHint");
const adminActionOnboardingHint = document.querySelector("#adminActionOnboardingHint");
const adminActionRiskHint = document.querySelector("#adminActionRiskHint");
const adminActionHealthyHint = document.querySelector("#adminActionHealthyHint");
const adminTopRestaurantPanel = document.querySelector("#adminTopRestaurantPanel");
const adminAccessDonut = document.querySelector("#adminAccessDonut");
const adminOrderOutcomeDonut = document.querySelector("#adminOrderOutcomeDonut");
const adminAccessMix = document.querySelector("#adminAccessMix");
const adminOrderOutcomeMix = document.querySelector("#adminOrderOutcomeMix");
const adminAdoptionMix = document.querySelector("#adminAdoptionMix");
const adminTopRestaurantsBars = document.querySelector("#adminTopRestaurantsBars");
const adminInsights = document.querySelector("#adminInsights");
const adminTermTooltip = document.querySelector("#adminTermTooltip");
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
let adminTermTooltipTimer = 0;
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
bindAdminActionQueue(adminActionRenewal, "renewal");
bindAdminActionQueue(adminActionOnboarding, "onboarding");
bindAdminActionQueue(adminActionRisk, "at-risk");
bindAdminActionQueue(adminActionHealthy, "healthy");
adminTabs.forEach((button) => {
  button.addEventListener("click", () => {
    activeAdminSection = button.dataset.adminSection || "dashboard";
    syncAdminSections();
  });
});
[adminSearchInput, adminStatusFilter, adminActivityFilter, adminLifecycleFilter].forEach((control) => {
  control.addEventListener("input", renderAdminWorkspace);
  control.addEventListener("change", renderAdminWorkspace);
});

function bootAdminPage() {
  initializeTermHints(document.querySelector("#adminWorkspace"), adminTermTooltip, () => adminTermTooltipTimer, (value) => {
    adminTermTooltipTimer = value;
  });
  syncAdminAccess();
  syncActivationDaysWithPlan();
  if (isAdminAuthenticated()) {
    renderAdminWorkspace();
  }
}

function initializeTermHints(root, tooltip, getTimer, setTimer) {
  if (!root || !tooltip) return;
  root.querySelectorAll(".term-hint[data-term-hint]").forEach((element) => {
    if (element.dataset.termHintBound === "true") return;
    element.dataset.termHintBound = "true";
    element.tabIndex = 0;
    element.addEventListener("mouseenter", () => {
      window.clearTimeout(getTimer());
      showTermTooltip(element, tooltip);
    });
    element.addEventListener("mouseleave", () => hideTermTooltip(tooltip, getTimer, setTimer));
    element.addEventListener("focus", () => showTermTooltip(element, tooltip));
    element.addEventListener("blur", () => hideTermTooltip(tooltip, getTimer, setTimer));
  });
}

function showTermTooltip(element, tooltip) {
  const hint = String(element?.dataset.termHint || "").trim();
  if (!hint || !tooltip) return;
  const rect = element.getBoundingClientRect();
  tooltip.textContent = hint;
  tooltip.hidden = false;
  tooltip.style.left = `${rect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.bottom + 8}px`;
}

function hideTermTooltip(tooltip, getTimer, setTimer) {
  window.clearTimeout(getTimer());
  setTimer(0);
  if (!tooltip) return;
  tooltip.hidden = true;
  tooltip.textContent = "";
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
  preparePrivateFirebaseSignOut();
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
      appUrl: buildRestaurantAccessUrl(),
    });
    const restaurant = {
      ...(result?.restaurant || {}),
      accessLink: String(result?.accessLink || "").trim(),
    };

    adminCreateRestaurantForm.reset();
    resetRestaurantLogoPreview();
    syncActivationDaysWithPlan();
    await reconnectDataStoreToFirebase();
    adminCreateFeedback.textContent = `Acceso creado para ${restaurant.name}. Se preparó un enlace seguro para definir la contraseña.`;
    adminCreateFeedback.className = "form-feedback form-feedback--success";
    adminCreateFeedback.hidden = false;
    showTurnoAlert(`Restaurante ${restaurant.name} creado correctamente.`, "success");
    await openCredentialsEmail(restaurant);
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

  const optimizedPng = canvas.toDataURL("image/png");
  if (optimizedPng.length <= 350000) {
    return optimizedPng;
  }

  const optimizedJpeg = canvas.toDataURL("image/jpeg", 0.9);
  if (optimizedJpeg.length <= 350000) {
    return optimizedJpeg;
  }

  throw new Error("El logo sigue siendo grande. Usa una imagen mas simple o recortada.");
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
        recent7dOrderCount: restaurantOrders.filter((order) => isWithinLastDays(order.createdAt, 7)).length,
        lastOrderAt: [...restaurantOrders]
          .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))[0]?.createdAt || "",
        activeOrderCount: restaurantOrders.filter((order) => !order.archivedAt).length,
        deliveredCount: deliveredOrders.length,
        cancelledCount: restaurantOrders.filter((order) => order.status === "cancelled").length,
        avgDeliveryMinutes: deliveredOrders.length
          ? Math.round(
              deliveredOrders.reduce((total, order) => total + getOrderDurationMinutes(order), 0) / deliveredOrders.length,
            )
          : 0,
        onboardingStage: getRestaurantOnboardingStage(restaurant, restaurantOrders),
        healthSegment: getRestaurantHealthSegment(restaurant, restaurantOrders),
      };
    })
    .filter(matchesAdminFilters)
    .sort((left, right) => {
      const priorityDifference = getHealthSegmentPriority(left.healthSegment) - getHealthSegmentPriority(right.healthSegment);
      if (priorityDifference !== 0) return priorityDifference;
      return new Date(right.createdAt) - new Date(left.createdAt);
    });

  renderAdminDashboard(stats);
  renderRestaurantDirectory(enrichedRestaurants);
}

function renderAdminDashboard(stats) {
  adminRestaurantCount.textContent = stats.totalRestaurants;
  adminStatRestaurants.textContent = stats.totalRestaurants;
  adminStatExpiredRestaurants.textContent = stats.expiredRestaurants;
  adminStatTotalOrders.textContent = stats.totalOrders;
  adminStatActiveOrders.textContent = stats.activeOrders;
  adminStatDelivered.textContent = stats.deliveredOrders;
  const activeBaseRate = stats.totalRestaurants
    ? Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100)
    : 0;
  const weeklyActivityRate = stats.totalRestaurants
    ? Math.round((stats.recentlyActiveRestaurants / stats.totalRestaurants) * 100)
    : 0;
  const riskCount = stats.dormantRestaurants + stats.restaurantsWithoutOrders;
  adminHeroActiveBase.textContent = stats.activeRestaurants;
  adminHeroActiveBaseHint.textContent = `${activeBaseRate}% de la base con acceso vigente`;
  adminHeroWeeklyActivity.textContent = `${weeklyActivityRate}%`;
  adminHeroWeeklyActivityHint.textContent = `${stats.recentlyActiveRestaurants} restaurantes operaron en los últimos 7 días`;
  adminHeroRenewal.textContent = stats.expiredRestaurants + stats.soonToExpire;
  adminHeroRenewalHint.textContent = `${stats.expiredRestaurants} vencidos y ${stats.soonToExpire} por vencer`;
  adminHeroRisk.textContent = riskCount;
  adminHeroRiskHint.textContent = `${stats.dormantRestaurants} dormidos y ${stats.restaurantsWithoutOrders} sin activar`;
  const actionQueues = getAdminActionQueues();
  adminActionRenewalCount.textContent = actionQueues.renewal;
  adminActionOnboardingCount.textContent = actionQueues.onboarding;
  adminActionRiskCount.textContent = actionQueues["at-risk"];
  adminActionHealthyCount.textContent = actionQueues.healthy;
  adminActionRenewalHint.textContent = actionQueues.renewal
    ? `${actionQueues.renewal} cuentas necesitan renovación o contacto comercial inmediato`
    : "No hay cuentas urgentes de renovación ahora mismo";
  adminActionOnboardingHint.textContent = actionQueues.onboarding
    ? `${actionQueues.onboarding} locales necesitan activar hábito y primer valor claro`
    : "No hay onboarding bloqueado en este momento";
  adminActionRiskHint.textContent = actionQueues["at-risk"]
    ? `${actionQueues["at-risk"]} restaurantes muestran caída de uso o posible churn`
    : "No hay restaurantes en riesgo detectados ahora";
  adminActionHealthyHint.textContent = actionQueues.healthy
    ? `${actionQueues.healthy} cuentas están listas para retención, reseñas o expansión`
    : "Aún no hay base sana suficiente para empujar upsell";

  adminTopRestaurantPanel.innerHTML = "";
  adminAccessDonut.innerHTML = "";
  adminOrderOutcomeDonut.innerHTML = "";
  adminAccessMix.innerHTML = "";
  adminOrderOutcomeMix.innerHTML = "";
  adminAdoptionMix.innerHTML = "";
  adminTopRestaurantsBars.innerHTML = "";
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

  renderDashboardDonut(adminAccessDonut, stats.accessMix, "Cuentas");
  renderDashboardDonut(adminOrderOutcomeDonut, stats.orderOutcomeMix, "Pedidos");
  renderAdminBarChart(adminAccessMix, stats.accessMix);
  renderAdminBarChart(adminOrderOutcomeMix, stats.orderOutcomeMix);
  renderAdminBarChart(adminAdoptionMix, stats.adoptionMix);
  renderAdminBarChart(
    adminTopRestaurantsBars,
    stats.topRestaurantsByOrders.map((item) => ({
      label: item.restaurant.name,
      count: item.orderCount,
      color: "#d85f31",
      valueLabel: `${item.orderCount} pedidos`,
    })),
    "Todavía no hay suficiente actividad para mostrar un ranking.",
  );

  buildAdminInsights(stats).forEach((message) => {
    const card = document.createElement("article");
    card.className = "dashboard-insight";
    card.textContent = message;
    adminInsights.append(card);
  });
}

function renderAdminBarChart(container, items, emptyMessage = "Sin datos suficientes por ahora.") {
  container.innerHTML = "";
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const maxValue = safeItems.reduce((max, item) => Math.max(max, Number(item.count || 0)), 0);

  if (!safeItems.length || maxValue <= 0) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight";
    empty.textContent = emptyMessage;
    container.append(empty);
    return;
  }

  safeItems.forEach((item) => {
    const row = document.createElement("div");
    const label = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("span");
    const value = document.createElement("span");

    row.className = "dashboard-bar";
    label.className = "dashboard-bar__label";
    track.className = "dashboard-bar__track";
    value.className = "dashboard-bar__value";

    label.textContent = item.label;
    fill.style.width = `${Math.max(10, Math.round((Number(item.count || 0) / maxValue) * 100))}%`;
    fill.style.background = item.color || "#d85f31";
    value.textContent = item.valueLabel || String(item.count || 0);

    track.append(fill);
    row.append(label, track, value);
    container.append(row);
  });
}

function renderDashboardDonut(container, items, centerLabel) {
  container.innerHTML = "";
  const safeItems = Array.isArray(items) ? items.filter((item) => Number(item?.count || 0) > 0) : [];
  const total = safeItems.reduce((sum, item) => sum + Number(item.count || 0), 0);

  if (!total) {
    const empty = document.createElement("article");
    empty.className = "dashboard-insight";
    empty.textContent = "Sin datos suficientes por ahora.";
    container.append(empty);
    return;
  }

  const chart = document.createElement("div");
  const center = document.createElement("div");
  const legend = document.createElement("div");
  let accumulated = 0;
  const segments = safeItems.map((item) => {
    const start = accumulated;
    const size = (Number(item.count || 0) / total) * 360;
    accumulated += size;
    return `${item.color || "#d85f31"} ${start}deg ${accumulated}deg`;
  });

  chart.className = "dashboard-donut__chart";
  chart.style.background = `conic-gradient(${segments.join(", ")})`;
  center.className = "dashboard-donut__center";
  center.innerHTML = `<span>${centerLabel}</span><strong>${total}</strong>`;
  chart.append(center);

  legend.className = "dashboard-donut__legend";
  safeItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "dashboard-donut__legend-row";
    row.innerHTML = `<span class="dashboard-donut__dot" style="background:${item.color || "#d85f31"}"></span><span>${item.label}</span><strong>${item.count}</strong>`;
    legend.append(row);
  });

  container.append(chart, legend);
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

  if (stats.restaurantsWithoutOrders > 0) {
    insights.push(`${stats.restaurantsWithoutOrders} restaurantes aún no han hecho su primer pedido. Necesitan onboarding o seguimiento comercial.`);
  }

  if (stats.dormantRestaurants > 0) {
    insights.push(`${stats.dormantRestaurants} restaurantes llevan más de 14 días sin actividad. Aquí puede haber riesgo de churn.`);
  }

  if (stats.expiredRestaurants === 0 && stats.soonToExpire === 0 && stats.restaurantsWithoutOrders === 0) {
    insights.push("La base está sana: ahora la oportunidad es empujar más frecuencia y más valoraciones de cliente.");
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
  const lifecycle = adminLifecycleFilter.value || "all";

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

  if (lifecycle !== "all" && restaurant.healthSegment !== lifecycle) return false;

  return true;
}

function bindAdminActionQueue(element, segment) {
  if (!element) return;
  const trigger = () => {
    applyAdminQueueFilter(segment);
  };

  element.addEventListener("click", trigger);
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    trigger();
  });
}

function applyAdminQueueFilter(segment) {
  activeAdminSection = "restaurants";
  adminSearchInput.value = "";
  adminStatusFilter.value = "all";
  adminActivityFilter.value = "all";
  adminLifecycleFilter.value = segment;
  renderAdminWorkspace();
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
    const health = document.createElement("span");
    const grid = document.createElement("div");
    const owner = document.createElement("p");
    const contact = document.createElement("p");
    const address = document.createElement("p");
    const activation = document.createElement("p");
    const orders = document.createElement("p");
    const usage = document.createElement("p");
    const notes = document.createElement("p");
    const onboarding = document.createElement("p");
    const playbook = document.createElement("div");
    const playbookLabel = document.createElement("span");
    const playbookText = document.createElement("strong");
    const accountStack = document.createElement("div");
    const login = document.createElement("p");
    const logoField = document.createElement("label");
    const logoFieldLabel = document.createElement("span");
    const logoHint = document.createElement("span");
    const logoPreview = document.createElement("div");
    const logoPreviewImage = document.createElement("img");
    const accessWrap = document.createElement("div");
    const accessLabel = document.createElement("span");
    const accessValue = document.createElement("strong");
    const actions = document.createElement("div");
    const link = document.createElement("a");
    const logoInput = document.createElement("input");
    const resend = document.createElement("button");
    const onboardingEmail = document.createElement("button");
    const renewalEmail = document.createElement("button");
    const renew30 = document.createElement("button");
    const renew90 = document.createElement("button");
    const remove = document.createElement("button");

    card.className = "admin-card";
    top.className = "admin-card__top";
    brand.className = "admin-card__brand";
    brandLogoWrap.className = "admin-card__brand-logo";
    brandText.className = "admin-card__brand-text";
    meta.className = "admin-card__meta";
    accessWrap.className = "admin-card__password";
    accessLabel.className = "admin-card__password-label";
    accessValue.className = "admin-card__password-value";
    actions.className = "admin-card__actions";
    status.className = "status-pill";
    health.className = "status-pill admin-card__health-pill";
    playbook.className = "admin-card__playbook";
    playbookLabel.className = "admin-card__playbook-label";
    playbookText.className = "admin-card__playbook-text";
    status.textContent = restaurant.status === "active" ? "Activo" : "Vencido";
    status.style.background = restaurant.status === "active" ? "rgba(31, 122, 99, 0.12)" : "rgba(127, 29, 29, 0.12)";
    status.style.color = restaurant.status === "active" ? "#1f7a63" : "#7f1d1d";
    syncRestaurantHealthPill(health, restaurant.healthSegment);
    grid.className = "admin-card__grid";
    brandFallback.className = "admin-card__brand-fallback";
    accountStack.className = "admin-card__account-stack";
    logoField.className = "field field--wide admin-card__logo-field";
    logoHint.className = "field__hint";
    logoPreview.className = "logo-upload-preview admin-card__logo-preview";
    title.textContent = restaurant.name;
    login.textContent = `Correo auth: ${restaurant.username}`;
    owner.textContent = `Responsable: ${restaurant.ownerName || "Sin definir"}`;
    contact.textContent = `Contacto: ${restaurant.email || "Sin correo"} · ${restaurant.phone || "Sin móvil"}`;
    address.textContent = `Dirección: ${restaurant.address || "Sin dirección"} · ${restaurant.city || "Sin ciudad"}`;
    activation.textContent =
      `Activado hasta: ${formatAdminDate(restaurant.activatedUntil)} · ${buildRemainingAccessLabel(restaurant)}`;
    orders.textContent =
      `Pedidos: ${restaurant.orderCount} · Activos: ${restaurant.activeOrderCount} · Entregados: ${restaurant.deliveredCount}`;
    usage.textContent = restaurant.orderCount
      ? `Uso: ${restaurant.recent7dOrderCount} pedidos en 7 días · Último movimiento ${formatAdminDate(restaurant.lastOrderAt)}`
      : "Uso: todavía sin pedidos. Conviene activar el onboarding del local.";
    onboarding.textContent = `Onboarding: ${buildOnboardingSummary(restaurant)}`;
    notes.textContent = restaurant.notes ? `Notas: ${restaurant.notes}` : "Notas: sin observaciones";
    playbookLabel.textContent = "Siguiente paso";
    playbookText.textContent = buildRestaurantPlaybook(restaurant);
    logoFieldLabel.textContent = "Logo del restaurante";
    logoHint.textContent = "Sube un logo cuadrado o rectangular. Lo optimizaremos para restaurante y cliente.";
    accessLabel.textContent = "Acceso:";
    accessValue.textContent = "Gestionado con enlace seguro";
    link.className = "qr-link";
    link.href = "#";
    link.textContent = "Abrir acceso restaurante";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.open("./restaurant.html", "_blank", "noopener,noreferrer");
    });
    logoInput.type = "file";
    logoInput.accept = "image/*";
    logoInput.addEventListener("change", async () => {
      const file = logoInput.files?.[0] || null;
      if (!file) return;

      logoInput.disabled = true;

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
        logoInput.disabled = false;
      }
    });
    resend.type = "button";
    resend.className = "comment-button";
    resend.textContent = "Preparar email de acceso";
    resend.addEventListener("click", async () => {
      await openCredentialsEmail(restaurant);
    });
    onboardingEmail.type = "button";
    onboardingEmail.className = "comment-button";
    onboardingEmail.textContent = "Email onboarding";
    onboardingEmail.addEventListener("click", async () => {
      await openOnboardingEmail(restaurant);
    });
    renewalEmail.type = "button";
    renewalEmail.className = "comment-button";
    renewalEmail.textContent = "Email renovación";
    renewalEmail.addEventListener("click", () => {
      openRenewalEmail(restaurant);
    });
    renew30.type = "button";
    renew30.className = "comment-button";
    renew30.textContent = "+30 días";
    renew30.addEventListener("click", () => {
      const updatedRestaurant = extendRestaurantActivation(restaurant.id, 30);
      if (!updatedRestaurant) return;
      adminCreateFeedback.textContent = `Acceso renovado 30 días para ${restaurant.name}.`;
      adminCreateFeedback.className = "form-feedback form-feedback--success";
      adminCreateFeedback.hidden = false;
      showTurnoAlert(`Acceso renovado 30 días para ${restaurant.name}.`, "success");
      renderAdminWorkspace();
    });
    renew90.type = "button";
    renew90.className = "comment-button";
    renew90.textContent = "+90 días";
    renew90.addEventListener("click", () => {
      const updatedRestaurant = extendRestaurantActivation(restaurant.id, 90);
      if (!updatedRestaurant) return;
      adminCreateFeedback.textContent = `Acceso renovado 90 días para ${restaurant.name}.`;
      adminCreateFeedback.className = "form-feedback form-feedback--success";
      adminCreateFeedback.hidden = false;
      showTurnoAlert(`Acceso renovado 90 días para ${restaurant.name}.`, "success");
      renderAdminWorkspace();
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
      logoPreviewImage.src = restaurant.logoUrl;
      logoPreviewImage.alt = `Vista previa del logo de ${restaurant.name}`;
      logoPreview.append(logoPreviewImage);
    } else {
      brandFallback.textContent = String(restaurant.name || "?").trim().charAt(0).toUpperCase() || "R";
      brandLogoWrap.append(brandFallback);
      logoPreview.hidden = true;
    }
    brandText.append(title, meta);
    brand.append(brandLogoWrap, brandText);
    meta.append(status, health);
    logoField.append(logoFieldLabel, logoInput, logoHint);
    accessWrap.append(accessLabel, accessValue);
    actions.append(link, resend, onboardingEmail, renewalEmail, renew30, renew90, remove);
    accountStack.append(logoField, logoPreview, login, accessWrap);
    playbook.append(playbookLabel, playbookText);
    grid.append(owner, contact, address, activation, orders, usage, onboarding, playbook, notes, accountStack);
    card.append(top, grid, actions);
    top.append(brand);
    adminRestaurantList.append(card);
  });
}

function getRestaurantOnboardingStage(restaurant, restaurantOrders) {
  if (!restaurant.logoUrl) return "pendiente-logo";
  if (!restaurantOrders.length) return "pendiente-primer-pedido";
  if (!restaurantOrders.some((order) => order.status === "ready" || order.status === "delivered")) {
    return "sin-ciclo-completo";
  }
  if (!restaurantOrders.some((order) => order.rating?.score)) {
    return "sin-feedback";
  }
  return "activo";
}

function buildOnboardingSummary(restaurant) {
  if (restaurant.onboardingStage === "pendiente-logo") {
    return "falta logo y personalización básica.";
  }

  if (restaurant.onboardingStage === "pendiente-primer-pedido") {
    return "sin primer pedido. Hace falta activación del equipo.";
  }

  if (restaurant.onboardingStage === "sin-ciclo-completo") {
    return "ya usa la app, pero aún no cerró un ciclo completo.";
  }

  if (restaurant.onboardingStage === "sin-feedback") {
    return "operación activa, falta validar feedback del cliente.";
  }

  return "activado y usando el flujo principal.";
}

function getRestaurantHealthSegment(restaurant, restaurantOrders) {
  const remainingDays = getRestaurantRemainingDays(restaurant);
  const onboardingStage = getRestaurantOnboardingStage(restaurant, restaurantOrders);
  const hadOrders = restaurantOrders.length > 0;
  const activeLast7Days = restaurantOrders.some((order) => isWithinLastDays(order.createdAt, 7));
  const activeLast14Days = restaurantOrders.some((order) => isWithinLastDays(order.createdAt, 14));

  if (!isRestaurantAccessActive(restaurant)) return "renewal";
  if (remainingDays !== null && remainingDays <= 7) return "renewal";
  if (onboardingStage !== "activo") return "onboarding";
  if (hadOrders && !activeLast14Days) return "at-risk";
  if (hadOrders && !activeLast7Days) return "at-risk";
  return "healthy";
}

function syncRestaurantHealthPill(element, segment) {
  const meta = {
    healthy: {
      label: "Sano",
      background: "rgba(31, 122, 99, 0.12)",
      color: "#1f7a63",
    },
    onboarding: {
      label: "Onboarding",
      background: "rgba(216, 95, 49, 0.12)",
      color: "#8f3513",
    },
    renewal: {
      label: "Renovación",
      background: "rgba(127, 29, 29, 0.12)",
      color: "#7f1d1d",
    },
    "at-risk": {
      label: "En riesgo",
      background: "rgba(180, 83, 9, 0.14)",
      color: "#9a4a10",
    },
  }[segment] || {
    label: "Seguimiento",
    background: "rgba(29, 26, 22, 0.08)",
    color: "var(--muted)",
  };

  element.textContent = meta.label;
  element.style.background = meta.background;
  element.style.color = meta.color;
}

function buildRestaurantPlaybook(restaurant) {
  if (restaurant.healthSegment === "renewal") {
    if (restaurant.status !== "active") {
      return "Renueva acceso y reenvía el enlace seguro antes de perder la cuenta.";
    }
    return "Activa recordatorio de renovación y deja cerrado el siguiente periodo comercial.";
  }

  if (restaurant.healthSegment === "onboarding") {
    if (restaurant.onboardingStage === "pendiente-logo") {
      return "Completa logo y personalización para que el local sienta el producto como propio.";
    }
    if (restaurant.onboardingStage === "pendiente-primer-pedido") {
      return "Agenda activación con el equipo y acompaña el primer pedido real en hora pico.";
    }
    if (restaurant.onboardingStage === "sin-ciclo-completo") {
      return "Empuja un ciclo completo hasta estado listo o entregado para crear hábito operativo.";
    }
    return "Pide feedback del cliente y úsalo como prueba de valor para la renovación.";
  }

  if (restaurant.healthSegment === "at-risk") {
    return "Revisa por qué cayó el uso y ofrece ayuda en mostrador o una reactivación con seguimiento.";
  }

  return "Mantén frecuencia, pide valoraciones y prepara upsell a más locales o más tiempo de plan.";
}

function getHealthSegmentPriority(segment) {
  if (segment === "renewal") return 0;
  if (segment === "onboarding") return 1;
  if (segment === "at-risk") return 2;
  if (segment === "healthy") return 3;
  return 4;
}

function getAdminActionQueues() {
  const restaurants = loadRestaurants();
  const orders = loadOrders();
  const counts = {
    renewal: 0,
    onboarding: 0,
    "at-risk": 0,
    healthy: 0,
  };

  restaurants.forEach((restaurant) => {
    const restaurantOrders = orders.filter((order) => order.restaurantId === restaurant.id);
    const segment = getRestaurantHealthSegment(restaurant, restaurantOrders);
    counts[segment] = (counts[segment] || 0) + 1;
  });

  return counts;
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

function buildRestaurantAccessUrl() {
  return new URL("./restaurant.html", window.location.href).toString();
}

async function openCredentialsEmail(restaurant) {
  if (!restaurant.email) return;
  const emailRestaurant = { ...restaurant };
  const backend = await waitForFirebaseBackend();

  if (!emailRestaurant.accessLink && backend?.enabled && typeof backend.createRestaurantAccessLink === "function") {
    try {
      const result = await backend.createRestaurantAccessLink({
        restaurantId: restaurant.id,
        appUrl: buildRestaurantAccessUrl(),
      });
      emailRestaurant.accessLink = String(result?.accessLink || "").trim();
    } catch (error) {
      console.error("No se pudo preparar el enlace de acceso del restaurante.", error);
      adminCreateFeedback.textContent = "No se pudo generar el enlace seguro del restaurante.";
      adminCreateFeedback.className = "form-feedback form-feedback--error";
      adminCreateFeedback.hidden = false;
      showTurnoAlert("No se pudo generar el enlace seguro del restaurante.", "error");
      return;
    }
  }

  if (!emailRestaurant.accessLink) {
    adminCreateFeedback.textContent = "No hay enlace seguro disponible para este restaurante.";
    adminCreateFeedback.className = "form-feedback form-feedback--error";
    adminCreateFeedback.hidden = false;
    return;
  }

  const email = buildRestaurantCredentialsEmail(emailRestaurant, {
    accessUrl: buildRestaurantAccessUrl(),
  });
  window.location.href = email.href;
}

async function openOnboardingEmail(restaurant) {
  if (!restaurant.email) return;
  const emailRestaurant = { ...restaurant };
  const backend = await waitForFirebaseBackend();

  if (!emailRestaurant.accessLink && backend?.enabled && typeof backend.createRestaurantAccessLink === "function") {
    try {
      const result = await backend.createRestaurantAccessLink({
        restaurantId: restaurant.id,
        appUrl: buildRestaurantAccessUrl(),
      });
      emailRestaurant.accessLink = String(result?.accessLink || "").trim();
    } catch (error) {
      console.error("No se pudo preparar el enlace de onboarding del restaurante.", error);
    }
  }

  const email = buildRestaurantOnboardingEmail(emailRestaurant, {
    accessUrl: buildRestaurantAccessUrl(),
  });
  window.location.href = email.href;
}

function openRenewalEmail(restaurant) {
  if (!restaurant.email) return;
  const email = buildRestaurantRenewalEmail(restaurant, {
    accessUrl: buildRestaurantAccessUrl(),
  });
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
