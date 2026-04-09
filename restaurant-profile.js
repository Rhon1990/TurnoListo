const restaurantProfileForm = document.querySelector("#restaurantProfileForm");
const restaurantProfileLogoInput = document.querySelector("#restaurantProfileLogoInput");
const restaurantProfileLogoPreview = document.querySelector("#restaurantProfileLogoPreview");
const restaurantProfileLogoPreviewImage = document.querySelector("#restaurantProfileLogoPreviewImage");
const restaurantProfileName = document.querySelector("#restaurantProfileName");
const restaurantProfileOwnerName = document.querySelector("#restaurantProfileOwnerName");
const restaurantProfileEmail = document.querySelector("#restaurantProfileEmail");
const restaurantProfilePhone = document.querySelector("#restaurantProfilePhone");
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

let selectedRestaurantProfileLogoUrl = "";

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
  waitForDataReady().then(() => {
    initializeRestaurantProfileAuth();
  });
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
  if (!restaurant) return;
  renderRestaurantAccount(restaurant);
  restaurantProfileName.value = restaurant.name || "";
  restaurantProfileOwnerName.value = restaurant.ownerName || "";
  restaurantProfileEmail.value = restaurant.email || "";
  restaurantProfilePhone.value = restaurant.phone || "";
  restaurantProfileCity.value = restaurant.city || "";
  restaurantProfileAddress.value = restaurant.address || "";
  restaurantProfileNotes.value = restaurant.notes || "";
  const planName = restaurant.planName || "Sin plan";
  const activatedUntil = restaurant.activatedUntil ? formatProfileDate(restaurant.activatedUntil) : "Sin fecha";
  restaurantProfilePlanName.value = planName;
  restaurantProfileActivatedUntil.value = activatedUntil;
  if (restaurantProfilePlanNameCard) restaurantProfilePlanNameCard.textContent = planName;
  if (restaurantProfileActivatedUntilCard) restaurantProfileActivatedUntilCard.textContent = activatedUntil;
  if (restaurantProfileStatus) restaurantProfileStatus.value = "Acceso verificado";
  syncRestaurantProfilePreview(selectedRestaurantProfileLogoUrl || restaurant.logoUrl || "");
  renderRestaurantProfileSummary(restaurant);
}

function renderRestaurantAccount(restaurant) {
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

function renderRestaurantProfileSummary(restaurant) {
  if (!restaurantProfileSummaryName) return;
  const restaurantName = String(restaurant?.name || "Restaurante").trim();
  const ownerName = String(restaurant?.ownerName || "").trim();
  const logoUrl = String(selectedRestaurantProfileLogoUrl || restaurant?.logoUrl || "").trim();
  restaurantProfileSummaryName.textContent = restaurantName;
  restaurantProfileSummaryTitle.textContent = ownerName || "Acceso verificado";
  restaurantProfileSummaryAvatarFallback.textContent = restaurantName.charAt(0).toUpperCase() || "R";

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
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
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
    const currentRestaurant = getCurrentRestaurantSession()
      ? getRestaurantById(getCurrentRestaurantSession().restaurantId)
      : null;
    syncRestaurantProfilePreview(currentRestaurant?.logoUrl || "");
    return;
  }

  try {
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
    showTurnoAlert(error instanceof Error ? error.message : "No se pudo preparar el logo del restaurante.", "error");
  }
}

function handleRestaurantProfileSubmit(event) {
  event.preventDefault();
  const session = getCurrentRestaurantSession();
  if (!session) return;

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
