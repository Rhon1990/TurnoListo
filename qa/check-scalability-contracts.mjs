import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function assertContract(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const sharedSource = readProjectFile("shared.js");
const firebaseBridgeSource = readProjectFile("firebase-bridge.js");
const functionsSource = readProjectFile("functions/index.js");
const deployScriptSource = readProjectFile("scripts/deploy-firebase-env.mjs");
const packageConfig = JSON.parse(readProjectFile("package.json"));
const firebaseConfig = JSON.parse(readProjectFile("firebase.json"));

assertContract(
  /function buildOrderTrackingId\(restaurantId, sourceOrderId\)\s*{[\s\S]*restaurantId[\s\S]*sourceOrderId[\s\S]*}/.test(
    sharedSource,
  ) && !/function buildOrderTrackingId\(restaurantId, sourceOrderId\)\s*{\s*return normalizeSourceOrderId\(sourceOrderId\);\s*}/.test(
    sharedSource,
  ),
  "Order document IDs must include restaurant scope to avoid cross-restaurant collisions.",
);

assertContract(
  /function sourceOrderIdExists\(sourceOrderId, restaurantId, excludedOrderId = null\)/.test(sharedSource) &&
    /String\(order\.restaurantId \|\| DEFAULT_RESTAURANT_ID\) === safeRestaurantId/.test(sharedSource),
  "Duplicate source order checks must be scoped per restaurant.",
);

assertContract(
  /FIREBASE_PRIVATE_ORDER_LOOKBACK_DAYS/.test(sharedSource) &&
    /FIREBASE_PRIVATE_ORDER_LIMIT/.test(sharedSource) &&
    /FIREBASE_ADMIN_ORDER_LIMIT/.test(sharedSource) &&
    /getPrivateCollectionQueryOptions/.test(sharedSource),
  "Private Firestore collection loads must use bounded order/tracking query windows.",
);

assertContract(
  /orderBy/.test(firebaseBridgeSource) &&
    /limit/.test(firebaseBridgeSource) &&
    /normalizedOptions\.orderBy/.test(firebaseBridgeSource) &&
    /normalizedOptions\.limit/.test(firebaseBridgeSource),
  "Firebase bridge must support ordered and limited queries.",
);

assertContract(
  /AI_MODEL_SUMMARY_ORDER_LIMIT/.test(functionsSource) &&
    /\.orderBy\("createdAt", "desc"\)/.test(functionsSource) &&
    /\.limit\(AI_MODEL_SUMMARY_ORDER_LIMIT\)/.test(functionsSource),
  "AI model summary sync must read a bounded recent order window, not full restaurant history.",
);

assertContract(
  firebaseConfig.firestore?.indexes === "firestore.indexes.json",
  "firebase.json must deploy Firestore composite indexes required by bounded queries.",
);

assertContract(
  /firestore:rules,firestore:indexes,functions/.test(deployScriptSource),
  "Backend deploy scope must include Firestore indexes.",
);

assertContract(
  packageConfig.scripts?.["qa:scalability"] === "node qa/check-scalability-contracts.mjs",
  "package.json must expose the scalability QA contract.",
);

const indexConfig = JSON.parse(readProjectFile("firestore.indexes.json"));
const indexFingerprints = new Set(
  (indexConfig.indexes || []).map((index) =>
    [
      index.collectionGroup,
      ...(index.fields || []).map((field) => `${field.fieldPath}:${field.order || field.arrayConfig || ""}`),
    ].join("|"),
  ),
);

["orders|restaurantId:ASCENDING|createdAt:DESCENDING", "tracking|restaurantId:ASCENDING|createdAt:DESCENDING"].forEach(
  (fingerprint) => {
    assertContract(indexFingerprints.has(fingerprint), `Missing Firestore index: ${fingerprint}`);
  },
);

console.log("Scalability contracts verified.");
