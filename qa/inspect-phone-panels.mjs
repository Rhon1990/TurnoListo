import {
  CdpPage,
  closeTarget,
  openTarget,
  sleep,
} from "./cdp-client.mjs";

const BASE_URL = process.env.TURNOLISTO_BASE_URL || "http://127.0.0.1:4173";
const ACCESS_URL = process.env.TURNOLISTO_ACCESS_URL || "https://rhon1990.github.io/TurnoListo/restaurant.html";
const DEBUG_BASE_URL = process.env.TURNOLISTO_DEBUG_BASE_URL || "http://127.0.0.1:9222";
const ADMIN_EMAIL = process.env.TURNOLISTO_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.TURNOLISTO_ADMIN_PASSWORD || "";
const EXISTING_RESTAURANT_ACCESS_LINK = process.env.TURNOLISTO_RESTAURANT_ACCESS_LINK || "";
const EXISTING_RESTAURANT_EMAIL = process.env.TURNOLISTO_RESTAURANT_EMAIL || "";
const EXISTING_RESTAURANT_PASSWORD = process.env.TURNOLISTO_RESTAURANT_PASSWORD || "";
const ADMIN_URL = `${BASE_URL}/admin.html?qa=phone-panels`;
const ADMIN_PROFILE_URL = `${BASE_URL}/admin-profile.html?qa=phone-panels`;
const CONTACT_URL = `${BASE_URL}/contact.html?qa=phone-panels`;
const RESTAURANT_URL = `${BASE_URL}/restaurant.html?qa=phone-panels`;
const RESTAURANT_PROFILE_URL = `${BASE_URL}/restaurant-profile.html?qa=phone-panels`;
const MOBILE_VIEWPORT = { width: 390, height: 844, mobile: true, deviceScaleFactor: 2 };
const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const restaurantName = `QA Phone ${timestamp}`;
const restaurantEmail = `turnolisto.phone.${timestamp}@example.com`;
const restaurantPassword = `TurnoListo!${timestamp.slice(-6)}Qa`;

function rectSnapshot(element) {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return {
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    right: Math.round(rect.right),
    bottom: Math.round(rect.bottom),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

async function openPage(url, label) {
  const target = await openTarget(url, DEBUG_BASE_URL);
  const page = new CdpPage(target, { label, debugBaseUrl: DEBUG_BASE_URL });
  await page.connect();
  await page.bringToFront();
  await page.waitForLoad(15000).catch(() => null);
  await sleep(1200);
  return { page, target };
}

async function closePage(page, target) {
  await page.resetViewport().catch(() => null);
  await page.close().catch(() => null);
  await closeTarget(target.id, DEBUG_BASE_URL).catch(() => null);
}

async function navigatePage(page, url) {
  const loadPromise = page.waitForLoad(15000).catch(() => null);
  await page.send("Page.navigate", { url });
  await loadPromise;
  await sleep(1200);
}

async function captureScenario(page, scenario) {
  await page.setViewport(MOBILE_VIEWPORT);
  await page.waitFor(
    `Boolean(document.querySelector(${JSON.stringify(scenario.selector)}))`,
    { timeoutMs: 20000, description: `selector visible for ${scenario.key}` },
  );
  await page.evaluate(`
    (() => {
      const trigger = document.querySelector(${JSON.stringify(scenario.selector)});
      trigger?.scrollIntoView({ block: "center", inline: "center" });
      return true;
    })()
  `);
  await sleep(500);
  await page.click(scenario.selector);
  await sleep(450);

  const result = await page.evaluate(`
    (() => {
      const trigger = document.querySelector(${JSON.stringify(scenario.selector)});
      const field = trigger?.closest(".phone-field");
      const panelId = ${JSON.stringify(scenario.panelSelector || "")} || trigger?.getAttribute("aria-controls") || "";
      const panelSelector = panelId ? (panelId.startsWith("#") ? panelId : \`#\${panelId}\`) : "";
      const panel = panelSelector ? document.querySelector(panelSelector) : field?.querySelector(".phone-country-panel");
      const search = panel?.querySelector(".phone-country-search input");
      const list = panel?.querySelector(".phone-country-list");
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const panelRect = ${rectSnapshot.toString()}(panel);
      const searchRect = ${rectSnapshot.toString()}(search);
      const listRect = ${rectSnapshot.toString()}(list);
      return {
        scenario: ${JSON.stringify(scenario.key)},
        viewport,
        bodyClassOpen: document.body.classList.contains("turnolisto-phone-panel-open"),
        panelHidden: panel?.hidden ?? null,
        panelPosition: panel ? getComputedStyle(panel).position : null,
        panelRect,
        searchRect,
        listRect,
        clippedHorizontally: panelRect ? panelRect.left < 0 || panelRect.right > viewport.width : null,
        clippedVertically: panelRect ? panelRect.top < 0 || panelRect.bottom > viewport.height : null,
      };
    })()
  `);

  await page.evaluate(`
    (() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      return true;
    })()
  `).catch(() => null);
  await sleep(250);

  return result;
}

async function loginAdmin(page) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing TURNOLISTO_ADMIN_EMAIL or TURNOLISTO_ADMIN_PASSWORD.");
  }
  const workspaceVisible = await page.evaluate(
    `Boolean(document.querySelector("#adminWorkspace") && !document.querySelector("#adminWorkspace").hidden)`,
  );
  if (workspaceVisible) return;

  await page.waitFor(`Boolean(document.querySelector("#adminLoginForm"))`, {
    timeoutMs: 20000,
    description: "admin login form visible",
  });
  await page.fill('#adminLoginForm [name="username"]', ADMIN_EMAIL);
  await page.fill("#adminLoginPassword", ADMIN_PASSWORD);
  await sleep(400);
  await page.click('#adminLoginForm button[type="submit"]');
  await page.waitFor(
    `Boolean(document.querySelector("#adminWorkspace") && !document.querySelector("#adminWorkspace").hidden)`,
    { timeoutMs: 45000, description: "admin workspace visible" },
  );
  await sleep(1400);
}

async function prepareAdminCreatePanel(page) {
  await page.setViewport(MOBILE_VIEWPORT);
  await page.click('button[data-admin-section="create"]');
  await page.waitFor(
    `Boolean(document.querySelector('[data-admin-panel="create"]') && !document.querySelector('[data-admin-panel="create"]').hidden)`,
    { timeoutMs: 15000, description: "admin create panel visible" },
  );
  await sleep(900);
}

async function createRestaurantAccountForAudit(page) {
  const result = await page.evaluate(`
    (async () => {
      const backend = await waitForFirebaseBackend();
      if (!backend?.enabled || typeof backend.createRestaurantAccount !== "function") {
        return { error: "Restaurant account automation is not available." };
      }
      try {
        const response = await backend.createRestaurantAccount({
          name: ${JSON.stringify(restaurantName)},
          ownerName: "QA Operaciones",
          email: ${JSON.stringify(restaurantEmail)},
          phone: "+34 600123456",
          country: "España",
          phoneCountry: { iso: "ES", name: "Spain", dialCode: "+34" },
          city: "Madrid",
          address: "Calle QA 42",
          logoUrl: "",
          demoMode: false,
          planName: "Mensual",
          activationDays: 30,
          notes: ${JSON.stringify(`qa-phone-panel-${timestamp}`)},
          appUrl: ${JSON.stringify(ACCESS_URL)},
        });
        await reconnectDataStoreToFirebase?.();
        return {
          accessLink: String(response?.accessLink || "").trim(),
          restaurantId: String(response?.restaurant?.id || "").trim(),
        };
      } catch (error) {
        return { error: error?.message || String(error || "Unknown restaurant creation error.") };
      }
    })()
  `);
  if (result?.error) {
    throw new Error(result.error);
  }
  if (!result?.accessLink) {
    throw new Error("Could not create the temporary restaurant access link.");
  }
  await sleep(1800);
  return result.accessLink;
}

async function completePasswordSetup(accessLink, passwordValue = restaurantPassword) {
  const { page, target } = await openPage(accessLink, "restaurant-password-setup");
  await page.waitFor(`document.querySelectorAll('input[type="password"]').length > 0`, {
    timeoutMs: 60000,
    description: "password reset inputs visible",
  });
  await page.evaluate(`
    (() => {
      const passwordValue = ${JSON.stringify(passwordValue)};
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
  await sleep(600);
  const submitClicked = await page.evaluate(`
    (() => {
      const candidates = Array.from(document.querySelectorAll('button, input[type="submit"]'));
      const button = candidates.find((node) => /guardar|save|confirmar|restablecer|continuar|enviar|submit|next|done/i.test((node.innerText || node.value || "").trim()));
      if (!button) return false;
      button.click();
      return true;
    })()
  `);
  if (!submitClicked) {
    await page.evaluate(`
      (() => {
        const inputs = document.querySelectorAll('input[type="password"]');
        inputs[inputs.length - 1]?.form?.requestSubmit?.();
        return true;
      })()
    `);
  }
  await sleep(7000);
  await closePage(page, target);
}

async function loginRestaurant(email, password) {
  const session = await openPage(RESTAURANT_URL, "restaurant");
  const { page } = session;
  await page.fill("#restaurantLoginUsername", email);
  await page.fill("#restaurantLoginPassword", password);
  await sleep(450);
  await page.click('#restaurantLoginForm button[type="submit"]');
  await page.waitFor(
    `Boolean(document.querySelector("#restaurantWorkspace") && !document.querySelector("#restaurantWorkspace").hidden)`,
    { timeoutMs: 45000, description: "restaurant workspace visible" },
  );
  await sleep(1500);
  return session;
}

async function cleanupRestaurant(page) {
  await navigatePage(page, ADMIN_URL);
  await loginAdmin(page);
  await page.setViewport(MOBILE_VIEWPORT);
  await page.click('button[data-admin-section="restaurants"]');
  await page.waitFor(
    `Boolean(document.querySelector('[data-admin-panel="restaurants"]') && !document.querySelector('[data-admin-panel="restaurants"]').hidden)`,
    { timeoutMs: 15000, description: "restaurants panel visible for cleanup" },
  );
  await page.fill("#adminSearchInput", restaurantName);
  await sleep(1000);
  const deleteOpened = await page.evaluate(`
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
  if (!deleteOpened) return false;
  await page.waitFor(
    `Boolean(document.querySelector("#adminDeleteModal") && !document.querySelector("#adminDeleteModal").hidden)`,
    { timeoutMs: 15000, description: "admin delete modal visible" },
  );
  await sleep(900);
  await page.click("#adminDeleteConfirm");
  await sleep(1800);
  return true;
}

async function runPublicScenario() {
  const { page, target } = await openPage(CONTACT_URL, "contact");

  try {
    return await captureScenario(page, {
      key: "contact",
      selector: "#contactPhoneCountryTrigger",
    });
  } finally {
    await closePage(page, target);
  }
}

async function runPrivateScenarios() {
  const results = [];
  const adminSession = await openPage(ADMIN_URL, "admin-phone-panel");
  let restaurantSession = null;
  let shouldCleanupRestaurant = false;

  try {
    try {
      await loginAdmin(adminSession.page);
      await prepareAdminCreatePanel(adminSession.page);
      results.push(await captureScenario(adminSession.page, {
        key: "admin-create",
        selector: "#adminPhoneCountryTrigger",
        panelSelector: "#adminPhoneCountryPanel",
      }));

      const restaurantLoginEmail = EXISTING_RESTAURANT_EMAIL || restaurantEmail;
      const restaurantLoginPassword = EXISTING_RESTAURANT_PASSWORD || restaurantPassword;

      if (EXISTING_RESTAURANT_ACCESS_LINK && EXISTING_RESTAURANT_EMAIL && EXISTING_RESTAURANT_PASSWORD) {
        await completePasswordSetup(EXISTING_RESTAURANT_ACCESS_LINK, restaurantLoginPassword);
      } else if (!EXISTING_RESTAURANT_EMAIL || !EXISTING_RESTAURANT_PASSWORD) {
        const accessLink = await createRestaurantAccountForAudit(adminSession.page);
        await completePasswordSetup(accessLink);
        shouldCleanupRestaurant = true;
      }

      await navigatePage(adminSession.page, ADMIN_PROFILE_URL);
      results.push(await captureScenario(adminSession.page, {
        key: "admin-profile",
        selector: "#adminCreateAdminPhoneCountryTrigger",
        panelSelector: "#adminCreateAdminPhoneCountryPanel",
      }));

      restaurantSession = await loginRestaurant(
        restaurantLoginEmail,
        restaurantLoginPassword,
      );
      await navigatePage(restaurantSession.page, RESTAURANT_PROFILE_URL);
      results.push(await captureScenario(restaurantSession.page, {
        key: "restaurant-profile",
        selector: "#restaurantProfilePhoneCountryTrigger",
        panelSelector: "#restaurantProfilePhoneCountryPanel",
      }));
    } catch (error) {
      results.push({
        scenario: "private-workflow",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  } finally {
    if (shouldCleanupRestaurant) {
      try {
        await cleanupRestaurant(adminSession.page);
      } catch (error) {
        results.push({
          scenario: "cleanup",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    if (restaurantSession) {
      await closePage(restaurantSession.page, restaurantSession.target);
    }
    await closePage(adminSession.page, adminSession.target);
  }

  return results;
}

const results = [];
results.push(await runPublicScenario());
results.push(...await runPrivateScenarios());

console.log(JSON.stringify(results, null, 2));
