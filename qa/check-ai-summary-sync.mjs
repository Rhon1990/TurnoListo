import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const sharedJs = readFileSync(path.join(projectRoot, "shared.js"), "utf8");
const functionsIndex = readFileSync(path.join(projectRoot, "functions", "index.js"), "utf8");

const summarySyncStart = sharedJs.indexOf("function syncAdaptiveModelSummariesFromOrders");
const summarySyncEnd = sharedJs.indexOf("\n\nfunction getStageAlertThresholds", summarySyncStart);

assert.notEqual(summarySyncStart, -1, "shared.js debe definir el sincronizador local del resumen IA.");
assert.notEqual(summarySyncEnd, -1, "No se pudo aislar el sincronizador local del resumen IA.");

const summarySyncSource = sharedJs.slice(summarySyncStart, summarySyncEnd);

assert.doesNotMatch(
  summarySyncSource,
  /firebaseBackend\.setDocument\(FIREBASE_RESTAURANTS_COLLECTION,\s*restaurant\.id,\s*nextRestaurant\)/,
  "El cliente no debe escribir aiModelSummary directamente en Firestore; ese derivado debe persistirse desde Functions.",
);

assert.match(
  functionsIndex,
  /const\s*\{[\s\S]*onDocumentWritten[\s\S]*\}\s*=\s*require\("firebase-functions\/v2\/firestore"\);/,
  "Functions debe escuchar escrituras completas de pedidos para recalcular el resumen IA también al crear o borrar pedidos.",
);

assert.match(
  functionsIndex,
  /exports\.syncRestaurantAiModelSummary\s*=\s*onDocumentWritten\("orders\/\{orderId\}",\s*async\s*\(event\)\s*=>\s*\{/,
  "La sincronización del resumen IA debe dispararse con cualquier escritura en orders/{orderId}.",
);

assert.match(
  functionsIndex,
  /const restaurantId = trimValue\(after\?\.restaurantId \|\| before\?\.restaurantId\);/,
  "La Cloud Function debe resolver el restaurante tanto en altas como en actualizaciones o borrados.",
);

console.log("AI summary sync check passed.");
