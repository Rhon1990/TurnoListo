import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const clientHtml = readFileSync(path.join(projectRoot, "client.html"), "utf8");
const clientJs = readFileSync(path.join(projectRoot, "client.js"), "utf8");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");
const i18nJs = readFileSync(path.join(projectRoot, "i18n.js"), "utf8");

assert.match(
  clientHtml,
  /<div class="tl-busy-overlay client-panel-loading" id="clientPanelLoading" hidden aria-live="polite" role="status">[\s\S]*data-i18n-key="client.loading.title"[\s\S]*data-i18n-key="client.loading.text"/,
  "La vista cliente debe declarar un overlay de carga accesible para la hidratacion del pedido."
);

assert.match(
  stylesCss,
  /\.panel--client\s*\{[\s\S]*position:\s*relative;/,
  "La tarjeta principal del cliente debe posicionarse como contenedor del overlay de carga."
);

assert.match(
  stylesCss,
  /\.tl-busy-overlay\s*\{[\s\S]*position:\s*absolute;[\s\S]*inset:\s*0;[\s\S]*display:\s*grid;[\s\S]*backdrop-filter:\s*blur\(/,
  "El overlay de carga del cliente debe cubrir la tarjeta y suavizar el fondo mientras se hidratan los datos."
);

assert.match(
  i18nJs,
  /"client\.loading\.title": "Cargando tu pedido\.\.\."/,
  "El loading del cliente debe registrar un titulo traducible."
);

assert.match(
  i18nJs,
  /"client\.loading\.text": "Estamos preparando el seguimiento mas reciente\."/,
  "El loading del cliente debe registrar un texto auxiliar traducible."
);

assert.match(
  clientJs,
  /const clientPanelLoading = document\.querySelector\("#clientPanelLoading"\);/,
  "client.js debe enlazar el overlay de carga del cliente."
);

assert.match(
  clientJs,
  /function setClientOrderHydrationPending\(isPending\) \{[\s\S]*setBusyRegion\(clientTicket, clientPanelLoading, isPending\);[\s\S]*\}/,
  "El cliente debe exponer un helper para mostrar u ocultar el loading de hidratacion."
);

const helperStart = clientJs.indexOf("async function hydrateClientOrderIfNeeded");
const helperEnd = clientJs.indexOf("\n\nasync function initializeClientView", helperStart);
assert.notEqual(helperStart, -1, "client.js debe definir un helper para hidratar el pedido solo si hace falta.");
assert.notEqual(helperEnd, -1, "No se pudo aislar el helper de hidratacion del cliente.");
const hydrateClientOrderIfNeededSource = clientJs.slice(helperStart, helperEnd);

const context = {
  window: { __turnoDataBackendMode: "firebase-public" },
  pendingStates: [],
  refreshCalls: [],
  records: {
    "TL-READY": { id: "TL-READY" },
  },
  normalizePublicTrackingToken(value) {
    return String(value || "").trim().toUpperCase();
  },
  getPublicOrderByPublicId(publicId) {
    return context.records[publicId] || null;
  },
  async refreshPublicTrackingFromBackend(publicId) {
    context.refreshCalls.push(publicId);
    if (publicId === "TL-FETCH" || publicId === "TL-BACKGROUND") {
      context.records[publicId] = { id: publicId };
    }
    return { enabled: true, refreshed: true };
  },
  setClientOrderHydrationPending(isPending) {
    context.pendingStates.push(isPending);
  },
};

vm.runInNewContext(`${hydrateClientOrderIfNeededSource}`, context);

const fromMemory = await context.hydrateClientOrderIfNeeded("TL-READY", { showLoading: true });
assert.equal(fromMemory.requested, false, "Si el pedido ya existe en memoria no debe forzarse un fetch adicional.");
assert.equal(fromMemory.found, true, "El helper debe devolver el pedido disponible sin ir a backend.");
assert.deepEqual(context.refreshCalls, [], "No debe consultar backend cuando ya hay tracking local.");
assert.deepEqual(context.pendingStates, [], "No debe mostrar loading cuando no hace falta hidratar datos.");

const fetched = await context.hydrateClientOrderIfNeeded("TL-FETCH", { showLoading: true });
assert.equal(fetched.requested, true, "Debe pedir datos al backend cuando el pedido aun no esta disponible.");
assert.equal(fetched.found, true, "Tras hidratar desde backend debe devolver el pedido encontrado.");
assert.deepEqual(context.refreshCalls, ["TL-FETCH"], "Debe consultar backend exactamente para el pedido pendiente.");
assert.deepEqual(context.pendingStates, [true, false], "El loading debe activarse y desactivarse alrededor de la hidratacion remota.");

context.pendingStates = [];
context.refreshCalls = [];
context.window.__turnoDataBackendMode = "local-demo";
const missingWithoutBackend = await context.hydrateClientOrderIfNeeded("TL-MISS", { showLoading: true });
assert.equal(missingWithoutBackend.requested, false, "Sin backend Firebase no debe dispararse hidratacion remota.");
assert.equal(missingWithoutBackend.found, false, "Sin backend y sin datos locales el pedido debe seguir ausente.");
assert.deepEqual(context.refreshCalls, [], "No debe intentar refrescar si el backend publico no esta activo.");
assert.deepEqual(context.pendingStates, [], "Tampoco debe mostrar loading si no existe nada que hidratar.");

context.pendingStates = [];
context.refreshCalls = [];
context.window.__turnoDataBackendMode = "firebase-public";
await context.hydrateClientOrderIfNeeded("TL-BACKGROUND", { showLoading: false });
assert.deepEqual(context.pendingStates, [], "El helper debe permitir hidrataciones silenciosas sin overlay visual.");

assert.match(
  clientJs,
  /await hydrateClientOrderIfNeeded\(selectedOrderId, \{ showLoading: true \}\);/,
  "La carga inicial del cliente debe usar el helper con loading visible solo si hay fetch real."
);

assert.match(
  clientJs,
  /const hydrationResult = await hydrateClientOrderIfNeeded\(nextId, \{ showLoading: true \}\);\s*order = hydrationResult\.order;/,
  "La apertura manual de otro pedido debe reutilizar el mismo helper de hidratacion con loading visible."
);

console.log("Client order loading check passed.");
