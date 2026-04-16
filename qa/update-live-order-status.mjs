import { CdpPage, sleep, waitForTarget } from "./cdp-client.mjs";

const debugBaseUrl = process.env.TURNOLISTO_DEBUG_BASE_URL || "http://127.0.0.1:9222";
const sourceOrderId = process.argv[2] || "";
const requestedAction = String(process.argv[3] || "").trim().toLowerCase();

if (!sourceOrderId || !requestedAction) {
  throw new Error("Usage: node qa/update-live-order-status.mjs <sourceOrderId> <received|preparing|ready|delivered|cancelled>");
}

const statusLabelPatterns = {
  received: "recib",
  preparing: "prepar",
  ready: "listo",
  delivered: "entregado",
  cancelled: "cancel",
};

const labelRegexSource = statusLabelPatterns[requestedAction];
if (!labelRegexSource) {
  throw new Error(`Unsupported action "${requestedAction}".`);
}

const target = await waitForTarget("/TurnoListo/restaurant.html", {
  debugBaseUrl,
  timeoutMs: 20000,
});
const page = new CdpPage(target, {
  debugBaseUrl,
  label: "restaurant-update-live-order",
});

await page.connect();

try {
  await page.bringToFront();
  await sleep(900);

  const updated = await page.evaluate(`
    (() => {
      const labelRegex = new RegExp(${JSON.stringify(labelRegexSource)}, "i");
      const cards = Array.from(document.querySelectorAll(".order-card"));
      const card = cards.find((node) => node.innerText.includes(${JSON.stringify(sourceOrderId)}));
      if (!card) return false;
      const button = Array.from(card.querySelectorAll(".status-action"))
        .find((node) => labelRegex.test((node.innerText || "").trim()));
      if (!button) return false;
      button.click();
      return true;
    })()
  `);

  if (!updated) {
    throw new Error(`Could not update the order "${sourceOrderId}" to "${requestedAction}".`);
  }

  await sleep(1800);

  if (requestedAction === "cancelled") {
    const cancelModalVisible = await page.evaluate(
      `Boolean(document.querySelector("#restaurantCancelModal") && !document.querySelector("#restaurantCancelModal").hidden)`,
    );
    if (cancelModalVisible) {
      await page.click("#restaurantCancelConfirm");
      await sleep(1400);
    }
  }

  console.log(JSON.stringify({ sourceOrderId, requestedAction, updated: true }, null, 2));
} finally {
  await page.close().catch(() => null);
}
