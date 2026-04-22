import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const sharedJs = readFileSync(path.join(projectRoot, "shared.js"), "utf8");
const restaurantJs = readFileSync(path.join(projectRoot, "restaurant.js"), "utf8");
const restaurantHtml = readFileSync(path.join(projectRoot, "restaurant.html"), "utf8");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");

const uniqueCountHelperMatch = sharedJs.match(/function getUniqueOperationalTodayCount\(\{[\s\S]*?\n\}/);
assert.ok(uniqueCountHelperMatch, "shared.js debe exponer un helper para calcular el total unico del chip de hoy.");

const context = {};
vm.runInNewContext(
  `
  ${uniqueCountHelperMatch[0]}
  result = {
    deduped: getUniqueOperationalTodayCount({
      progressOrders: [{ id: "A-1" }, { id: "A-2" }],
      deliveredOrders: [{ id: "A-2" }, { id: "A-3" }],
      archivedOrders: [{ id: "A-3" }, { id: "A-4" }],
    }),
  };
  `,
  context,
);

assert.equal(context.result.deduped, 4, "El total hoy debe contar pedidos unicos aunque aparezcan en varias bolsas.");

assert.match(
  restaurantJs,
  /restaurantTotalTodayChip\.textContent = translateRuntimeText\(`\$\{quickStats\.uniqueOperationalTodayCount\} total hoy`\);/,
  "El chip total hoy debe usar el conteo unico calculado para el resumen rapido."
);

assert.match(
  restaurantHtml,
  /<button class="admin-inbox-quick-filter admin-inbox-quick-filter--static" id="restaurantTotalTodayChip" type="button" disabled>/,
  "El chip total hoy debe mantenerse como boton, pero deshabilitado para que no sugiera navegacion."
);

assert.doesNotMatch(
  restaurantHtml,
  /id="restaurantTotalTodayChip"[^>]*data-restaurant-history-filter=/,
  "El chip total hoy no debe incluir el dataset que activa la navegacion al historial."
);

assert.match(
  stylesCss,
  /\.admin-inbox-quick-filter--static:disabled,\s*[\s\S]*\.admin-inbox-quick-filter--static:disabled:hover,\s*[\s\S]*\.admin-inbox-quick-filter--static:disabled:focus-visible\s*\{/s,
  "El chip total hoy debe definir una variante deshabilitada que cubra hover y foco."
);

assert.match(
  stylesCss,
  /\.admin-inbox-quick-filter--static:disabled[\s\S]*pointer-events:\s*none;/s,
  "El chip total hoy debe ignorar interacciones del puntero."
);

assert.match(
  stylesCss,
  /\.admin-inbox-quick-filter--static:disabled[\s\S]*box-shadow:\s*inset 0 1px 0 rgba\(255, 255, 255, 0\.42\);/s,
  "El chip total hoy debe conservar solo el relieve base, sin sombra de accion."
);

assert.match(
  restaurantJs,
  /goToHistoryView\(\{ status: button\.dataset\.restaurantHistoryFilter \|\| "all", rating: "all", search: "" \}\);/,
  "Los demas chips deben conservar la redireccion actual a archivados."
);

console.log("Restaurant total today chip check passed.");
