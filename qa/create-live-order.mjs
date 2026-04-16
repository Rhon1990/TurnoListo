import { CdpPage, sleep, waitForTarget } from "./cdp-client.mjs";

const debugBaseUrl = process.env.TURNOLISTO_DEBUG_BASE_URL || "http://127.0.0.1:9222";
const sourceOrderId = process.argv[2] || `QA-${Date.now().toString().slice(-8)}`;
const customerName = process.argv[3] || "Cliente QA";
const estimatedReadyMinutes = process.argv[4] || "7";
const items = process.argv[5] || "Pedido QA";

const target = await waitForTarget("/TurnoListo/restaurant.html", {
  debugBaseUrl,
  timeoutMs: 20000,
});
const page = new CdpPage(target, {
  debugBaseUrl,
  label: "restaurant-create-live-order",
});

await page.connect();

try {
  await page.bringToFront();
  await sleep(900);
  await page.click('button[data-section="create"]');
  await page.waitFor(
    `Boolean(document.querySelector('[data-section-panel="create"]') && !document.querySelector('[data-section-panel="create"]').hidden)`,
    {
      timeoutMs: 15000,
      description: "restaurant create panel visible",
    },
  );

  await page.fill("#sourceOrderId", sourceOrderId);
  await page.fill("#customerName", customerName);
  await page.fill("#estimatedReadyMinutes", estimatedReadyMinutes);
  await page.fill("#items", items);
  await page.click('#quickCreateForm button[type="submit"]');
  await page.waitFor(
    `Array.from(document.querySelectorAll(".order-card")).some((card) => card.innerText.includes(${JSON.stringify(sourceOrderId)}))`,
    {
      timeoutMs: 20000,
      description: "new live order visible",
    },
  );

  const payload = await page.evaluate(`
    (() => {
      const card = Array.from(document.querySelectorAll(".order-card"))
        .find((node) => node.innerText.includes(${JSON.stringify(sourceOrderId)}));
      return {
        sourceOrderId: ${JSON.stringify(sourceOrderId)},
        clientLink: card?.querySelector(".qr-link")?.href || "",
        publicId: card?.querySelector(".qr-link")?.href?.match(/order=([^#&]+)/)?.[1] || "",
      };
    })()
  `);

  console.log(JSON.stringify(payload, null, 2));
} finally {
  await page.close().catch(() => null);
}
