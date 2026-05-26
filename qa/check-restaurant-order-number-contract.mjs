import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const sharedSource = readFileSync(path.join(projectRoot, "shared.js"), "utf8");
const restaurantSource = readFileSync(path.join(projectRoot, "restaurant.js"), "utf8");
const clientSource = readFileSync(path.join(projectRoot, "client.js"), "utf8");

assert.match(
  sharedSource,
  /function buildRestaurantOrderNumber\(restaurantId, orders, createdAt = new Date\(\)\) \{/,
  "Debe existir un generador de numero visible por restaurante y momento de creacion."
);

assert.match(
  sharedSource,
  /function formatOrderNumberForDisplay\(order\) \{/,
  "Debe existir un formateador visual para mostrar cortos tambien los numeros heredados."
);

assert.match(
  sharedSource,
  /String\(order\?\.orderNumber \|\| ""\)\.match\(\/\^\(\.\+\)-\(\\d\{6\}\)-\(\\d\{3,\}\)\$\/\)/,
  "El formateador visual debe detectar numeros heredados con prefijo largo, fecha y consecutivo."
);

assert.match(
  sharedSource,
  /return `\$\{buildRestaurantOrderCode\(order\?\.restaurantId\)\}-\$\{legacyMatch\[2\]\}-\$\{legacyMatch\[3\]\}`;/,
  "Los numeros heredados deben mostrarse con codigo corto del restaurante, fecha y consecutivo."
);

assert.match(
  restaurantSource,
  /function getOrderDisplayNumber\(order\) \{/,
  "El panel restaurante debe usar un wrapper de visualizacion para numeros de pedido."
);

assert.match(
  restaurantSource,
  /compactTitle\.textContent = `\$\{orderDisplayNumber\} · \$\{translateBuiltInOrderText\(order\.customerName\)\}`;/,
  "Las tarjetas de restaurante deben mostrar el numero visual corto."
);

assert.match(
  clientSource,
  /ticketOrderId\.textContent = getClientOrderDisplayNumber\(order\);/,
  "El cliente tambien debe ver el numero visual corto."
);

assert.match(
  sharedSource,
  /function buildRestaurantOrderCode\(restaurantId\) \{/,
  "Debe existir un codigo corto visible derivado del restaurante."
);

assert.match(
  sharedSource,
  /function normalizeRestaurantOrderCodeSegment\(value\) \{/,
  "Debe existir una normalizacion especifica para el codigo corto visible."
);

assert.match(
  sharedSource,
  /\.normalize\("NFD"\)\s*\.replace\(\/\[\\u0300-\\u036f\]\/g, ""\)/,
  "El codigo corto debe eliminar acentos del nombre del restaurante."
);

assert.match(
  sharedSource,
  /\.replace\(\/\[\^A-Z0-9\]\/g, ""\)/,
  "El codigo corto debe eliminar espacios y simbolos para mantenerse compacto."
);

assert.match(
  sharedSource,
  /const restaurantNameSegment = normalizeRestaurantOrderCodeSegment\(getRestaurantById\(restaurantId\)\?\.name \|\| ""\);/,
  "El codigo visible debe priorizar el nombre del restaurante sobre el id tecnico."
);

assert.match(
  sharedSource,
  /if \(restaurantNameSegment\) return restaurantNameSegment\.slice\(0, 3\)\.padEnd\(3, "X"\);/,
  "El codigo visible del restaurante debe ser corto, de 3 caracteres cuando sale del nombre."
);

assert.match(
  sharedSource,
  /return normalizeRestaurantOrderCodeSegment\(restaurantId \|\| DEFAULT_RESTAURANT_ID\)\.slice\(0, 3\)\.padEnd\(3, "X"\);/,
  "Si el restaurante no tiene nombre disponible, el codigo corto debe caer al id tecnico recortado."
);

assert.match(
  sharedSource,
  /return `\$\{year\}\$\{month\}\$\{day\}`;/,
  "La fecha del numero visible debe usar ano-mes-dia compacto."
);

assert.match(
  sharedSource,
  /const orderNumberPrefix = `\$\{restaurantCode\}-\$\{dateSegment\}`;/,
  "El numero visible debe empezar por codigo de restaurante y fecha ano-mes-dia."
);

assert.match(
  sharedSource,
  /const restaurantOrders = orders\.filter\(\s*\(order\) =>\s*String\(order\.restaurantId \|\| DEFAULT_RESTAURANT_ID\) === safeRestaurantId &&\s*String\(order\.orderNumber \|\| ""\)\.startsWith\(`\$\{orderNumberPrefix\}-`\),\s*\);/,
  "El consecutivo debe calcularse solo con pedidos del mismo restaurante y dia."
);

assert.match(
  sharedSource,
  /orderNumber: buildRestaurantOrderNumber\(currentRestaurantId, orders, createdAt\),/,
  "La creacion de pedidos debe usar el nuevo numero visible por restaurante."
);

assert.doesNotMatch(
  sharedSource,
  /const nextIndex = getNextOrderIndex\(orders\);/,
  "La creacion de pedidos no debe usar el maximo global de todos los restaurantes."
);

assert.match(
  sharedSource,
  /return `\$\{orderNumberPrefix\}-\$\{String\(nextIndex\)\.padStart\(3, "0"\)\}`;/,
  "El consecutivo diario debe ser compacto de 3 digitos."
);

console.log("Restaurant order number contract check passed.");
