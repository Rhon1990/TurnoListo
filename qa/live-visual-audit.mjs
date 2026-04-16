import {
  CdpPage,
  DEFAULT_DEBUG_BASE_URL,
  closeTarget,
  listTargets,
  openTarget,
  sleep,
  waitForTarget,
} from "./cdp-client.mjs";
import { writeFile } from "node:fs/promises";

const ADMIN_EMAIL = process.env.TURNOLISTO_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.TURNOLISTO_ADMIN_PASSWORD || "";
const DEBUG_BASE_URL = process.env.TURNOLISTO_DEBUG_BASE_URL || DEFAULT_DEBUG_BASE_URL;
const BASE_URL = process.env.TURNOLISTO_BASE_URL || "https://rhon1990.github.io/TurnoListo";
const ADMIN_URL = `${BASE_URL}/admin.html`;
const RESTAURANT_URL = `${BASE_URL}/restaurant.html`;
const REPORT_PATH = process.env.TURNOLISTO_REPORT_PATH || "/tmp/turnolisto-live-audit-report.json";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Missing TURNOLISTO_ADMIN_EMAIL or TURNOLISTO_ADMIN_PASSWORD.");
}

const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const restaurantName = `QA Unicorn ${timestamp}`;
const restaurantEmail = `turnolisto.e2e.${timestamp}@example.com`;
const restaurantPassword = `TurnoListo!${timestamp.slice(-6)}Qa`;
const restaurantOwner = "QA Operaciones";
const restaurantTicketPrimary = `E2E-${timestamp}-A`;
const restaurantTicketCancelled = `E2E-${timestamp}-B`;
const restaurantNotes = `qa-live-audit-${timestamp}`;

const report = {
  startedAt: new Date().toISOString(),
  restaurantName,
  restaurantEmail,
  restaurantPassword,
  observations: [],
};

function log(step, details = "") {
  const message = details ? `${step}: ${details}` : step;
  report.observations.push({ at: new Date().toISOString(), step, details });
  console.log(message);
}

async function attachToTarget(urlFragment, label) {
  const target = await waitForTarget(urlFragment, { debugBaseUrl: DEBUG_BASE_URL, timeoutMs: 45000 });
  const page = new CdpPage(target, { debugBaseUrl: DEBUG_BASE_URL, label });
  await page.connect();
  await page.bringToFront();
  await sleep(900);
  return page;
}

async function openPage(url, label) {
  const target = await openTarget(url, DEBUG_BASE_URL);
  const page = new CdpPage(target, { debugBaseUrl: DEBUG_BASE_URL, label });
  await page.connect();
  await page.bringToFront();
  await sleep(1200);
  return page;
}

async function switchLanguage(page, languageCode) {
  await page.waitFor(`Boolean(document.querySelector(".language-dock__select"))`, {
    description: "language selector visible",
  });
  await page.select(".language-dock__select", languageCode);
  await sleep(1000);
}

async function cycleLanguages(page, labelSelector) {
  const before = await page.evaluate(`document.querySelector(${JSON.stringify(labelSelector)})?.textContent?.trim() || ""`);
  await switchLanguage(page, "en");
  await switchLanguage(page, "fr");
  await switchLanguage(page, "es");
  const after = await page.evaluate(`document.querySelector(${JSON.stringify(labelSelector)})?.textContent?.trim() || ""`);
  if (before !== after) {
    throw new Error(`Language cycle did not restore text for ${labelSelector}`);
  }
}

async function loginAdmin(page) {
  const workspaceVisible = await page.evaluate(`Boolean(document.querySelector("#adminWorkspace") && !document.querySelector("#adminWorkspace").hidden)`);
  if (workspaceVisible) {
    log("admin.login", "Sesión de admin ya abierta, reutilizando el panel visible");
    await page.evaluate(`
      (() => {
        const modalIds = [
          "#adminDeleteModal",
          "#adminActivatePlanModal",
          "#adminRenewPlanModal",
          "#adminEmailTemplatesModal",
        ];
        modalIds.forEach((selector) => {
          const modal = document.querySelector(selector);
          if (modal) modal.hidden = true;
        });
        return true;
      })()
    `);
    await page.click('button[data-admin-section="dashboard"]');
    await sleep(1200);
    return;
  }

  log("admin.login", "Iniciando sesión del administrador");
  await page.waitFor(`Boolean(document.querySelector("#adminLoginForm"))`, {
    description: "admin login form",
  });
  await cycleLanguages(page, '[data-i18n-key="brand.tagline"]');
  await page.fill('#adminLoginForm [name="username"]', ADMIN_EMAIL);
  await page.fill("#adminLoginPassword", ADMIN_PASSWORD);
  await sleep(500);
  await page.click('#adminLoginForm button[type="submit"]');
  await page.waitFor(`Boolean(document.querySelector("#adminWorkspace") && !document.querySelector("#adminWorkspace").hidden)`, {
    timeoutMs: 45000,
    description: "admin workspace visible",
  });
  await sleep(1500);
}

async function exportAdminDataset(page) {
  log("admin.dataset", "Probando exportación del dataset IA");
  await page.click("#adminExportDatasetButton");
  await sleep(1200);
}

async function openAdminMessages(page) {
  log("admin.messages", "Abriendo bandeja de mensajes");
  await page.click('button[data-admin-section="messages"]');
  await page.waitFor(`Boolean(document.querySelector('[data-admin-panel="messages"]') && !document.querySelector('[data-admin-panel="messages"]').hidden)`, {
    description: "messages panel visible",
  });
  await sleep(1500);
  await page.click('button[data-admin-section="dashboard"]');
  await sleep(900);
}

async function prepareRestaurantCreation(page) {
  await page.evaluate(`
    window.openCredentialsEmail = async () => null;
  `);
}

async function createRestaurant(page) {
  log("admin.create", `Creando restaurante temporal ${restaurantName}`);
  await page.click('button[data-admin-section="create"]');
  await page.waitFor(`Boolean(document.querySelector('[data-admin-panel="create"]') && !document.querySelector('[data-admin-panel="create"]').hidden)`, {
    description: "create panel visible",
  });
  await page.select("#adminPlanSelect", "Demo");
  await sleep(700);
  await page.fill('#adminCreateRestaurantForm [name="name"]', restaurantName);
  await page.fill('#adminCreateRestaurantForm [name="ownerName"]', restaurantOwner);
  await page.fill('#adminCreateRestaurantForm [name="email"]', restaurantEmail);
  await page.fill("#adminRestaurantPhoneLocal", "600123456");
  await page.fill('#adminCreateRestaurantForm [name="city"]', "Madrid");
  await page.fill('#adminCreateRestaurantForm [name="address"]', "Calle QA 42");
  await page.fill('#adminCreateRestaurantForm [name="notes"]', restaurantNotes);
  await sleep(700);
  await page.click('#adminCreateRestaurantForm button[type="submit"]');
  await page.waitFor(`Boolean(document.querySelector("#adminCreateFeedback") && !document.querySelector("#adminCreateFeedback").hidden && document.querySelector("#adminCreateFeedback").innerText.includes(${JSON.stringify(restaurantName)}))`, {
    timeoutMs: 60000,
    description: "restaurant creation feedback visible",
  });
  await sleep(1800);
}

async function searchRestaurant(page) {
  await page.click('button[data-admin-section="restaurants"]');
  await page.waitFor(`Boolean(document.querySelector('[data-admin-panel="restaurants"]') && !document.querySelector('[data-admin-panel="restaurants"]').hidden)`, {
    description: "restaurants panel visible",
  });
  await page.fill("#adminSearchInput", restaurantName);
  await sleep(1200);
}

async function activateDemoPlan(page) {
  log("admin.activate-plan", "Activando plan comercial del restaurante temporal");
  const clicked = await page.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".admin-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(restaurantName)}));
      const button = card?.querySelector(".admin-card__priority-button");
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!clicked) throw new Error("Restaurant card not found for activation.");
  await page.waitFor(`Boolean(document.querySelector("#adminActivatePlanModal") && !document.querySelector("#adminActivatePlanModal").hidden)`, {
    description: "activate plan modal visible",
  });
  await page.select("#adminActivatePlanSelect", "Mensual");
  await sleep(800);
  await page.click("#adminActivatePlanConfirm");
  await sleep(1600);
}

async function inspectRenewModal(page) {
  log("admin.renew", "Abriendo modal de renovación");
  const clicked = await page.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".admin-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(restaurantName)}));
      if (!card) return false;
      const button = Array.from(card.querySelectorAll("button")).find((node) => (node.innerText || "").includes("Renovar"));
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!clicked) throw new Error("Restaurant card not found for renewal.");
  await page.waitFor(`Boolean(document.querySelector("#adminRenewPlanModal") && !document.querySelector("#adminRenewPlanModal").hidden)`, {
    description: "renew plan modal visible",
  });
  await sleep(1500);
  await page.click("#adminRenewPlanBack");
  await sleep(900);
}

async function extractAccessLink(page) {
  log("admin.templates", "Abriendo plantillas y capturando enlace seguro");
  const clicked = await page.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".admin-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(restaurantName)}));
      if (!card) return false;
      const button = Array.from(card.querySelectorAll("button")).find((node) => (node.innerText || "").includes("Plantillas"));
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!clicked) throw new Error("Restaurant card not found for templates.");
  await page.waitFor(`Boolean(document.querySelector("#adminEmailTemplatesModal") && !document.querySelector("#adminEmailTemplatesModal").hidden)`, {
    description: "email templates modal visible",
  });
  await page.waitFor(`(document.querySelector("#adminEmailTemplateBody")?.innerText || "").includes("resetPassword")`, {
    timeoutMs: 30000,
    description: "credentials access link rendered",
  });
  await sleep(1000);
  const accessLink = await page.evaluate(`
    (() => {
      const anchor = Array.from(document.querySelectorAll("#adminEmailTemplateBody a[href]"))
        .find((node) => String(node.href || "").includes("resetPassword"));
      if (anchor) return anchor.href;
      const body = document.querySelector("#adminEmailTemplateBody")?.innerText || "";
      const match = body.match(/https?:\\/\\/\\S*resetPassword\\S*/);
      return match ? match[0] : "";
    })()
  `);
  if (!accessLink) {
    throw new Error("Could not extract the secure restaurant access link.");
  }
  report.accessLink = accessLink;
  await page.click("#adminEmailTemplatesClose");
  await sleep(700);
  return accessLink;
}

async function completePasswordSetup(accessLink) {
  log("restaurant.password", "Definiendo contraseña inicial del restaurante");
  const resetPage = await openPage(accessLink, "restaurant-password-setup");
  await resetPage.waitFor(`document.querySelectorAll('input[type="password"]').length > 0`, {
    timeoutMs: 60000,
    description: "password reset inputs visible",
  });
  await resetPage.evaluate(`
    (() => {
      const passwordValue = ${JSON.stringify(restaurantPassword)};
      const passwordInputs = Array.from(document.querySelectorAll('input[type="password"]'));
      passwordInputs.forEach((input) => {
        input.focus();
        input.value = passwordValue;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      return passwordInputs.length;
    })()
  `);
  await sleep(700);
  const submitClicked = await resetPage.evaluate(`
    (() => {
      const candidates = Array.from(document.querySelectorAll('button, input[type="submit"]'));
      const button = candidates.find((node) => /guardar|save|confirmar|restablecer|continuar|continuar|enviar|submit|next|done/i.test((node.innerText || node.value || "").trim()));
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!submitClicked) {
    await resetPage.evaluate(`
      (() => {
        const lastInput = document.querySelectorAll('input[type="password"]');
        if (!lastInput.length) return false;
        lastInput[lastInput.length - 1].form?.requestSubmit?.();
        return true;
      })()
    `);
  }
  await sleep(7000);
  return resetPage;
}

async function loginRestaurant() {
  const restaurantPage = await openPage(RESTAURANT_URL, "restaurant");
  log("restaurant.login", "Iniciando sesión del restaurante temporal");
  await cycleLanguages(restaurantPage, '[data-i18n-key="brand.tagline"]');
  await restaurantPage.fill("#restaurantLoginUsername", restaurantEmail);
  await restaurantPage.fill("#restaurantLoginPassword", restaurantPassword);
  await sleep(500);
  await restaurantPage.click('#restaurantLoginForm button[type="submit"]');
  await restaurantPage.waitFor(`Boolean(document.querySelector("#restaurantWorkspace") && !document.querySelector("#restaurantWorkspace").hidden)`, {
    timeoutMs: 45000,
    description: "restaurant workspace visible",
  });
  await sleep(1800);
  return restaurantPage;
}

async function createRestaurantOrders(restaurantPage) {
  log("restaurant.create-order", "Creando pedido principal");
  await restaurantPage.click('button[data-section="create"]');
  await restaurantPage.waitFor(`Boolean(document.querySelector('[data-section-panel="create"]') && !document.querySelector('[data-section-panel="create"]').hidden)`, {
    description: "restaurant create panel visible",
  });
  await restaurantPage.fill("#sourceOrderId", restaurantTicketPrimary);
  await restaurantPage.fill("#customerName", "Cliente QA");
  await restaurantPage.fill("#estimatedReadyMinutes", "12");
  await restaurantPage.fill("#items", "Smash burger + bebida");
  await sleep(600);
  await restaurantPage.click('#quickCreateForm button[type="submit"]');
  await restaurantPage.waitFor(`Array.from(document.querySelectorAll(".order-card")).some((card) => card.innerText.includes(${JSON.stringify(restaurantTicketPrimary)}))`, {
    timeoutMs: 45000,
    description: "primary order card visible",
  });
  await sleep(1800);

  log("restaurant.duplicate-order", "Verificando control de ticket duplicado");
  await restaurantPage.click('button[data-section="create"]');
  await sleep(700);
  await restaurantPage.fill("#sourceOrderId", restaurantTicketPrimary);
  await restaurantPage.fill("#customerName", "Cliente QA duplicado");
  await restaurantPage.click('#quickCreateForm button[type="submit"]');
  await restaurantPage.waitFor(`Boolean(document.querySelector("#quickCreateFeedback") && !document.querySelector("#quickCreateFeedback").hidden && document.querySelector("#quickCreateFeedback").innerText.includes("ya existe"))`, {
    timeoutMs: 15000,
    description: "duplicate order feedback visible",
  });
  await sleep(1600);

  log("restaurant.create-order-cancelled", "Creando pedido secundario para cancelación");
  await restaurantPage.fill("#sourceOrderId", restaurantTicketCancelled);
  await restaurantPage.fill("#customerName", "Cliente cancelado");
  await restaurantPage.fill("#estimatedReadyMinutes", "6");
  await restaurantPage.fill("#items", "Pedido cancelable");
  await restaurantPage.click('#quickCreateForm button[type="submit"]');
  await restaurantPage.waitFor(`Array.from(document.querySelectorAll(".order-card")).some((card) => card.innerText.includes(${JSON.stringify(restaurantTicketCancelled)}))`, {
    timeoutMs: 45000,
    description: "cancelled order card visible",
  });
  await sleep(1800);
}

async function expandOrder(restaurantPage, ticket) {
  const clicked = await restaurantPage.evaluate(`
    (() => {
      const button = Array.from(document.querySelectorAll(".order-card__summary")).find((node) => node.innerText.includes(${JSON.stringify(ticket)}));
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!clicked) {
    throw new Error(`Could not expand order ${ticket}`);
  }
  await sleep(1200);
}

async function editPrimaryOrder(restaurantPage) {
  log("restaurant.edit-order", "Editando pedido principal");
  await expandOrder(restaurantPage, restaurantTicketPrimary);
  await restaurantPage.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".order-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(restaurantTicketPrimary)}));
      const button = card?.querySelector(".button-secondary");
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  await sleep(900);
  const edited = await restaurantPage.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".order-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(restaurantTicketPrimary)}));
      if (!card) return false;
      const itemsInput = card.querySelector('input[name="items"]');
      if (!itemsInput) return false;
      itemsInput.value = "Smash burger + bebida + ketchup";
      itemsInput.dispatchEvent(new Event("input", { bubbles: true }));
      itemsInput.dispatchEvent(new Event("change", { bubbles: true }));
      const saveButton = Array.from(card.querySelectorAll('button')).find((node) => (node.innerText || "").includes("Guardar"));
      if (!saveButton) return false;
      saveButton.click();
      return true;
    })()
  `);
  if (!edited) {
    throw new Error("Could not edit the primary order.");
  }
  await sleep(1500);
}

async function openClientPage(restaurantPage) {
  log("client.open", "Abriendo vista cliente desde el pedido principal");
  await expandOrder(restaurantPage, restaurantTicketPrimary);
  const clientLink = await restaurantPage.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".order-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(restaurantTicketPrimary)}));
      return card?.querySelector('.qr-link')?.href || "";
    })()
  `);
  if (!clientLink) {
    throw new Error("Could not resolve the client tracking link.");
  }
  report.clientLink = clientLink;
  const clientPage = await openPage(clientLink, "client");
  await clientPage.waitFor(`Boolean(document.querySelector("#clientTicket"))`, {
    timeoutMs: 45000,
    description: "client ticket visible",
  });
  await sleep(1800);
  return clientPage;
}

async function instrumentClientPage(clientPage) {
  log("client.instrumentation", "Preparando trazas de audio y vibración");
  await cycleLanguages(clientPage, '[data-i18n-key="brand.tagline"]');
  await clientPage.evaluate(`
    (() => {
      window.__turnoAudit = {
        vibrationPatterns: [],
        oscillatorStarts: 0,
      };
      const originalVibrate = navigator.vibrate ? navigator.vibrate.bind(navigator) : null;
      navigator.vibrate = (pattern) => {
        if (pattern && JSON.stringify(pattern) !== "0") {
          window.__turnoAudit.vibrationPatterns.push(pattern);
        }
        return originalVibrate ? originalVibrate(pattern) : true;
      };
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return true;
      class AuditAudioContext extends AudioContextClass {
        createOscillator() {
          const oscillator = super.createOscillator();
          const originalStart = oscillator.start.bind(oscillator);
          oscillator.start = (...args) => {
            window.__turnoAudit.oscillatorStarts += 1;
            return originalStart(...args);
          };
          return oscillator;
        }
      }
      window.AudioContext = AuditAudioContext;
      window.webkitAudioContext = AuditAudioContext;
      return true;
    })()
  `);
  await sleep(900);
}

async function exerciseClientUi(clientPage) {
  log("client.ui", "Probando QR, pedido inválido y activación de avisos");
  await clientPage.click("#clientShowQrButton");
  await clientPage.waitFor(`Boolean(document.querySelector("#clientQrModal") && !document.querySelector("#clientQrModal").hidden)`, {
    description: "client QR modal visible",
  });
  await sleep(1200);
  await clientPage.click("#clientQrClose");
  await sleep(700);

  const originalOrder = await clientPage.evaluate(`document.querySelector("#clientQrValue")?.textContent?.trim() || ""`);
  report.clientPublicId = originalOrder;
  await clientPage.fill("#clientOrderInput", "TL-NO-EXISTE");
  await clientPage.click("#clientLoadButton");
  await clientPage.waitFor(`!document.querySelector("#clientOrderInput")?.checkValidity() || Boolean(document.querySelector("#clientOrderInput")?.validationMessage)`, {
    timeoutMs: 20000,
    description: "invalid order validation visible",
  });
  await sleep(1500);
  await clientPage.fill("#clientOrderInput", originalOrder);
  await clientPage.click("#clientLoadButton");
  await clientPage.waitFor(`(document.querySelector("#clientQrValue")?.textContent || "").includes(${JSON.stringify(originalOrder)})`, {
    timeoutMs: 20000,
    description: "original order restored",
  });
  await sleep(1200);
  await clientPage.click("#clientEnableAlertsButton");
  await sleep(2500);
}

async function updateOrderStatus(restaurantPage, ticket, labelRegexSource, options = {}) {
  const { bringToFront = true } = options;
  if (bringToFront) {
    await restaurantPage.bringToFront();
    await sleep(1000);
  }
  const updated = await restaurantPage.evaluate(`
    (() => {
      const labelRegex = new RegExp(${JSON.stringify(labelRegexSource)}, "i");
      const cards = Array.from(document.querySelectorAll(".order-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(ticket)}));
      if (!card) return false;
      const button = Array.from(card.querySelectorAll(".status-action")).find((node) => labelRegex.test((node.innerText || "").trim()));
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!updated) {
    throw new Error(`Could not update status for ${ticket} using regex ${labelRegexSource}`);
  }
  await sleep(2500);
}

async function verifyClientStatus(clientPage, expectedFragment) {
  await clientPage.bringToFront();
  await sleep(1200);
  const statusPredicate = `(document.querySelector("#clientStatus")?.textContent || "").toLowerCase().includes(${JSON.stringify(expectedFragment.toLowerCase())})`;

  try {
    await clientPage.waitFor(statusPredicate, {
      timeoutMs: 12000,
      description: `client status contains ${expectedFragment}`,
    });
  } catch (error) {
    const finding = `La vista cliente pública no reflejó automáticamente el cambio a "${expectedFragment}" dentro del umbral esperado.`;
    log("finding.client-realtime-sync", finding);
    await clientPage.evaluate(`
      (() => {
        const publicId = ${JSON.stringify(report.clientPublicId || "")};
        if (!publicId || typeof refreshPublicTrackingFromBackend !== "function") return false;
        return refreshPublicTrackingFromBackend(publicId).then(() => {
          if (typeof renderClient === "function") renderClient();
          return true;
        });
      })()
    `);
    await clientPage.waitFor(statusPredicate, {
      timeoutMs: 20000,
      description: `client status contains ${expectedFragment} after manual refresh`,
    });
  }

  await sleep(1500);
}

async function runRealtimeFlow(restaurantPage, clientPage) {
  log("realtime.preparing", "Moviendo pedido principal a preparación");
  await clientPage.bringToFront();
  await sleep(1000);
  await updateOrderStatus(restaurantPage, restaurantTicketPrimary, "prepar", { bringToFront: false });
  await verifyClientStatus(clientPage, "prepar");

  log("realtime.ready", "Moviendo pedido principal a listo");
  await clientPage.bringToFront();
  await sleep(1000);
  await updateOrderStatus(restaurantPage, restaurantTicketPrimary, "listo", { bringToFront: false });
  await verifyClientStatus(clientPage, "listo");
  await clientPage.waitFor(`Boolean(document.querySelector("#clientReadyBanner") && !document.querySelector("#clientReadyBanner").hidden)`, {
    timeoutMs: 25000,
    description: "client ready banner visible",
  });
  const celebrationAudit = await clientPage.evaluate(`window.__turnoAudit || {}`);
  report.readyCelebration = celebrationAudit;

  log("realtime.delivered", "Marcando pedido principal como entregado");
  await clientPage.bringToFront();
  await sleep(1000);
  await updateOrderStatus(restaurantPage, restaurantTicketPrimary, "entregado", { bringToFront: false });
  await verifyClientStatus(clientPage, "entregado");
  await clientPage.waitFor(`Boolean(document.querySelector("#clientFeedbackCard") && !document.querySelector("#clientFeedbackCard").hidden)`, {
    timeoutMs: 25000,
    description: "client feedback card visible",
  });
  await sleep(1400);
}

async function submitClientFeedback(clientPage) {
  log("client.feedback", "Enviando valoración baja con comentario");
  await clientPage.click('[data-score="2"]');
  await sleep(900);
  await clientPage.fill("#clientCommentInput", "La recogida fue buena, pero tardó más de lo esperado.");
  await clientPage.click("#clientCommentSave");
  await clientPage.waitFor(`Boolean(document.querySelector("#clientCommentSentMessage") && !document.querySelector("#clientCommentSentMessage").hidden)`, {
    timeoutMs: 25000,
    description: "client feedback confirmation visible",
  });
  await sleep(1800);
}

async function cancelSecondOrder(restaurantPage) {
  log("restaurant.cancel-order", "Cancelando pedido secundario");
  await updateOrderStatus(restaurantPage, restaurantTicketCancelled, "cancel");
  await restaurantPage.waitFor(`Boolean(document.querySelector("#restaurantCancelModal") && !document.querySelector("#restaurantCancelModal").hidden)`, {
    timeoutMs: 15000,
    description: "cancel modal visible",
  });
  await sleep(1200);
  await restaurantPage.click("#restaurantCancelConfirm");
  await sleep(1800);
}

async function exerciseRestaurantDashboardAndHistory(restaurantPage) {
  log("restaurant.dashboard", "Revisando dashboard, filtros y comentarios");
  await restaurantPage.click('button[data-section="dashboard"]');
  await restaurantPage.waitFor(`Boolean(document.querySelector('[data-section-panel="dashboard"]') && !document.querySelector('[data-section-panel="dashboard"]').hidden)`, {
    description: "restaurant dashboard visible",
  });
  await sleep(1200);
  await restaurantPage.select("#restaurantDashboardPeriod", "month");
  await sleep(1000);
  await restaurantPage.select("#restaurantDashboardPeriod", "day");
  await sleep(1000);
  await restaurantPage.click("#dashboardSignalFeedback");
  await sleep(1800);
  await restaurantPage.waitFor(`Boolean(document.querySelector('[data-section-panel="history"]') && !document.querySelector('[data-section-panel="history"]').hidden)`, {
    description: "restaurant history visible",
  });
  await restaurantPage.fill("#archivedSearchInput", restaurantTicketPrimary);
  await sleep(900);
  await restaurantPage.select("#archivedRatingFilter", "commented");
  await sleep(1200);
  const openedComment = await restaurantPage.evaluate(`
    (() => {
      const button = Array.from(document.querySelectorAll(".comment-button")).find((node) => (node.innerText || "").includes("Ver comentario"));
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!openedComment) {
    throw new Error("Could not open the archived comment modal.");
  }
  await restaurantPage.waitFor(`Boolean(document.querySelector("#restaurantCommentModal") && !document.querySelector("#restaurantCommentModal").hidden)`, {
    description: "restaurant comment modal visible",
  });
  await sleep(1500);
  await restaurantPage.click("#restaurantCommentClose");
  await sleep(900);
}

async function cleanupRestaurant(adminPage) {
  log("admin.cleanup", "Eliminando restaurante temporal");
  await adminPage.bringToFront();
  await sleep(1200);
  await adminPage.click('button[data-admin-section="restaurants"]');
  await sleep(900);
  await adminPage.fill("#adminSearchInput", restaurantName);
  await sleep(1000);
  const deleteOpened = await adminPage.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".admin-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(restaurantName)}));
      if (!card) return false;
      const button = Array.from(card.querySelectorAll("button")).find((node) => (node.innerText || "").trim() === "Eliminar");
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!deleteOpened) {
    throw new Error("Could not open the delete modal for cleanup.");
  }
  await adminPage.waitFor(`Boolean(document.querySelector("#adminDeleteModal") && !document.querySelector("#adminDeleteModal").hidden)`, {
    description: "admin delete modal visible",
  });
  await sleep(1400);
  await adminPage.click("#adminDeleteConfirm");
  await sleep(1800);
}

async function main() {
  const allPages = [];

  try {
    const adminPage = await attachToTarget("/TurnoListo/admin.html", "admin");
    allPages.push(adminPage);

    await loginAdmin(adminPage);
    await openAdminMessages(adminPage);
    await exportAdminDataset(adminPage);
    await prepareRestaurantCreation(adminPage);
    await createRestaurant(adminPage);
    await searchRestaurant(adminPage);
    await activateDemoPlan(adminPage);
    await inspectRenewModal(adminPage);
    const accessLink = await extractAccessLink(adminPage);
    const resetPage = await completePasswordSetup(accessLink);
    allPages.push(resetPage);
    const restaurantPage = await loginRestaurant();
    allPages.push(restaurantPage);
    await createRestaurantOrders(restaurantPage);
    await editPrimaryOrder(restaurantPage);
    const clientPage = await openClientPage(restaurantPage);
    allPages.push(clientPage);
    await instrumentClientPage(clientPage);
    await exerciseClientUi(clientPage);
    await runRealtimeFlow(restaurantPage, clientPage);
    await submitClientFeedback(clientPage);
    await cancelSecondOrder(restaurantPage);
    await exerciseRestaurantDashboardAndHistory(restaurantPage);
    await cleanupRestaurant(adminPage);

    report.finishedAt = new Date().toISOString();
    report.status = "completed";
  } catch (error) {
    report.finishedAt = new Date().toISOString();
    report.status = "failed";
    report.error = error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
    throw error;
  } finally {
    await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
    for (const page of allPages) {
      try {
        await page.close();
      } catch {}
    }

    const targets = await listTargets(DEBUG_BASE_URL);
    const transientTargets = targets.filter((target) => {
      const url = String(target.url || "");
      return target.type === "page" && (
        url.includes("/TurnoListo/client.html") ||
        url.includes("/TurnoListo/restaurant.html") ||
        url.includes("mode=resetPassword")
      );
    });

    for (const target of transientTargets) {
      try {
        await closeTarget(target.id, DEBUG_BASE_URL);
      } catch {}
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
