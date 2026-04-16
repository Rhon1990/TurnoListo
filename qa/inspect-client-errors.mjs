import { CdpPage, openTarget, sleep } from "./cdp-client.mjs";

const publicId = process.argv[2] || "";

if (!publicId) {
  throw new Error("Usage: node qa/inspect-client-errors.mjs <publicId>");
}

const target = await openTarget(
  `https://rhon1990.github.io/TurnoListo/client.html?order=${encodeURIComponent(publicId)}`,
  "http://127.0.0.1:9222",
);

const page = await new CdpPage(target, {
  debugBaseUrl: "http://127.0.0.1:9222",
  label: "client-errors",
}).connect();

const consoleEntries = [];
const runtimeExceptions = [];
const networkFailures = [];

page.on("Runtime.consoleAPICalled", (params) => {
  consoleEntries.push({
    type: params.type,
    args: (params.args || []).map((arg) => arg.value ?? arg.description ?? null),
    timestamp: params.timestamp,
  });
});

page.on("Runtime.exceptionThrown", (params) => {
  runtimeExceptions.push({
    text: params.exceptionDetails?.text || "",
    description: params.exceptionDetails?.exception?.description || "",
    lineNumber: params.exceptionDetails?.lineNumber ?? null,
    columnNumber: params.exceptionDetails?.columnNumber ?? null,
    url: params.exceptionDetails?.url || "",
  });
});

page.on("Log.entryAdded", (params) => {
  consoleEntries.push({
    type: `log:${params.entry?.level || "info"}`,
    source: params.entry?.source || "",
    text: params.entry?.text || "",
    url: params.entry?.url || "",
    timestamp: params.entry?.timestamp || null,
  });
});

page.on("Network.loadingFailed", (params) => {
  networkFailures.push({
    type: params.type,
    errorText: params.errorText,
    blockedReason: params.blockedReason || "",
    canceled: Boolean(params.canceled),
    requestId: params.requestId,
  });
});

await page.send("Log.enable");
await page.send("Network.enable");
await page.send("Page.reload", { ignoreCache: true });
await page.waitForLoad(30000);
await sleep(6000);

const stateBeforeRefresh = await page.evaluate(`
  (() => ({
    href: location.href,
    backendMode: String(window.__turnoDataBackendMode || ""),
    status: document.querySelector("#clientStatus")?.innerText || "",
    qrValue: document.querySelector("#clientQrValue")?.innerText || "",
    ticket: document.querySelector("#clientOrderNumber")?.innerText || "",
    hasRefreshFunction: typeof refreshPublicTrackingFromBackend === "function",
    currentOrderLookup: typeof getPublicOrderByPublicId === "function" ? getPublicOrderByPublicId(${JSON.stringify(publicId)}) : null,
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
    }).catch((error) => ({
      error: {
        code: error?.code || "",
        message: error?.message || String(error),
        name: error?.name || "",
      },
    }));
  })()
`);

await sleep(2500);

const stateAfterRefresh = await page.evaluate(`
  (() => ({
    href: location.href,
    backendMode: String(window.__turnoDataBackendMode || ""),
    status: document.querySelector("#clientStatus")?.innerText || "",
    qrValue: document.querySelector("#clientQrValue")?.innerText || "",
    ticket: document.querySelector("#clientOrderNumber")?.innerText || "",
    currentOrderLookup: typeof getPublicOrderByPublicId === "function" ? getPublicOrderByPublicId(${JSON.stringify(publicId)}) : null,
  }))()
`);

console.log(JSON.stringify({
  publicId,
  stateBeforeRefresh,
  refreshResult,
  stateAfterRefresh,
  runtimeExceptions,
  networkFailures,
  consoleEntries: consoleEntries.filter((entry) => {
    const text = String(entry.text || entry.args?.join(" ") || "");
    return !text.includes("Blocked call to navigator.vibrate");
  }),
}, null, 2));

await page.close();
