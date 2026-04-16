import { CdpPage, openTarget } from "./cdp-client.mjs";

const publicId = process.argv[2] || "";

if (!publicId) {
  throw new Error("Usage: node qa/inspect-client.mjs <publicId>");
}

const target = await openTarget(`https://rhon1990.github.io/TurnoListo/client-launch.html#order=${encodeURIComponent(publicId)}`, "http://127.0.0.1:9222");
const page = await new CdpPage(target, {
  debugBaseUrl: "http://127.0.0.1:9222",
  label: "client-inspector",
}).connect();

await page.waitFor(`Boolean(document.querySelector("#clientTicket"))`, {
  timeoutMs: 45000,
  description: "client ticket visible",
});

const before = await page.evaluate(`
  (() => ({
    href: location.href,
    backendMode: String(window.__turnoDataBackendMode || ""),
    status: document.querySelector("#clientStatus")?.innerText || "",
    qrValue: document.querySelector("#clientQrValue")?.innerText || "",
    ticket: document.querySelector("#clientOrderNumber")?.innerText || "",
    lookup: typeof getPublicOrderByPublicId === "function" ? getPublicOrderByPublicId(${JSON.stringify(publicId)}) : null,
  }))()
`);

const refreshResult = await page.evaluate(`
  (() => {
    if (typeof refreshPublicTrackingFromBackend !== "function") {
      return Promise.resolve({ missingRefreshFunction: true });
    }
    return refreshPublicTrackingFromBackend(${JSON.stringify(publicId)}).then((result) => {
      if (typeof renderClient === "function") renderClient();
      return result;
    });
  })()
`);

const after = await page.evaluate(`
  (() => ({
    href: location.href,
    backendMode: String(window.__turnoDataBackendMode || ""),
    status: document.querySelector("#clientStatus")?.innerText || "",
    qrValue: document.querySelector("#clientQrValue")?.innerText || "",
    ticket: document.querySelector("#clientOrderNumber")?.innerText || "",
    lookup: typeof getPublicOrderByPublicId === "function" ? getPublicOrderByPublicId(${JSON.stringify(publicId)}) : null,
  }))()
`);

console.log(JSON.stringify({ before, refreshResult, after }, null, 2));
await page.close();
