import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const sharedSource = readFileSync(path.join(projectRoot, "shared.js"), "utf8");

assert.match(
  sharedSource,
  /function buildRestaurantOrderNumber\(restaurantId, orders, createdAt = new Date\(\)\) \{/,
  "Debe existir un generador de numero visible por restaurante y momento de creacion."
);

assert.match(
  sharedSource,
  /return `\$\{year\}\$\{month\}\$\{day\}`;/,
  "La fecha del numero visible debe usar ano-mes-dia compacto."
);

assert.match(
  sharedSource,
  /const orderNumberPrefix = `\$\{restaurantSegment\}-\$\{dateSegment\}`;/,
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
