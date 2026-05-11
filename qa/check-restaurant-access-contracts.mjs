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

const functionsSource = readProjectFile("functions/index.js");
const packageConfig = JSON.parse(readProjectFile("package.json"));

assertContract(
  /async function resolveRestaurantAuthUser\(restaurant\)/.test(functionsSource) &&
    /auth\.getUser\(authUid\)/.test(functionsSource) &&
    /auth\.getUserByEmail\(authEmail\)/.test(functionsSource),
  "Restaurant access links must resolve the real Firebase Auth user by authUid first and auth email second.",
);

assertContract(
  /async function syncRestaurantAccessProfile\(restaurantRef, restaurantId, restaurant, userRecord\)/.test(functionsSource) &&
    /firestore\.collection\("users"\)\.doc\(userRecord\.uid\)\.set/.test(functionsSource) &&
    /role: "restaurant"/.test(functionsSource) &&
    /restaurantId/.test(functionsSource),
  "Generating a restaurant access link must repair users/{uid} with role restaurant and restaurantId.",
);

assertContract(
  /restaurantRef\.set\(restaurantUpdates, \{ merge: true \}\)/.test(functionsSource) &&
    /authUid: userRecord\.uid/.test(functionsSource) &&
    /username: authEmail/.test(functionsSource),
  "Generating a restaurant access link must repair restaurants/{id}.authUid and username.",
);

assertContract(
  /const accessEmail = await syncRestaurantAccessProfile\(restaurantSnapshot\.ref, restaurantId, restaurant, userRecord\)/.test(
    functionsSource,
  ) && /auth\.generatePasswordResetLink\(accessEmail/.test(functionsSource),
  "Restaurant password reset links must be generated for the repaired auth email.",
);

assertContract(
  packageConfig.scripts?.["qa:restaurant-access"] === "node qa/check-restaurant-access-contracts.mjs",
  "package.json must expose the restaurant access QA contract.",
);

console.log("Restaurant access contracts verified.");
