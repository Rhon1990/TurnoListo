import { CdpPage, waitForTarget } from "./cdp-client.mjs";

const restaurantName = process.argv[2] || "";
const sourceOrderId = process.argv[3] || "";
const publicId = process.argv[4] || "";

if (!restaurantName && !sourceOrderId && !publicId) {
  throw new Error("Usage: node qa/inspect-state.mjs <restaurantName> <sourceOrderId> <publicId>");
}

const target = await waitForTarget("/TurnoListo/admin.html", {
  debugBaseUrl: "http://127.0.0.1:9222",
  timeoutMs: 15000,
});

const page = await new CdpPage(target, {
  debugBaseUrl: "http://127.0.0.1:9222",
  label: "admin-inspector",
}).connect();

const state = await page.evaluate(`
  (() => {
    const restaurants = JSON.parse(localStorage.getItem("turnolisto-restaurants-v1") || "[]");
    const orders = JSON.parse(localStorage.getItem("turnolisto-orders-v1") || "[]");
    const tracking = JSON.parse(localStorage.getItem("turnolisto-tracking-v1") || "[]");
    const restaurant = restaurants.find((item) => ${JSON.stringify(restaurantName)} ? String(item.name || "").includes(${JSON.stringify(restaurantName)}) : false) || null;
    const order = orders.find((item) => ${JSON.stringify(sourceOrderId)} ? String(item.sourceOrderId || "") === ${JSON.stringify(sourceOrderId)} : false) || null;
    const trackingRecord = tracking.find((item) => {
      if (${JSON.stringify(publicId)} && String(item.publicTrackingToken || "") === ${JSON.stringify(publicId)}) return true;
      if (${JSON.stringify(sourceOrderId)} && String(item.sourceOrderId || "") === ${JSON.stringify(sourceOrderId)}) return true;
      return false;
    }) || null;
    return { restaurant, order, trackingRecord };
  })()
`);

console.log(JSON.stringify(state, null, 2));
await page.close();
