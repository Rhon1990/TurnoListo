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

const clientSource = readProjectFile("client.js");
const functionsSource = readProjectFile("functions/index.js");
const serviceWorkerSource = readProjectFile("firebase-messaging-sw.js");
const packageConfig = JSON.parse(readProjectFile("package.json"));

assertContract(
  /clientPath:\s*buildClientUrl\(orderPublicId\)/.test(clientSource),
  "Client push registration must send the real client URL from the current hosting base path.",
);

assertContract(
  /function normalizeClientPath\(value, fallbackPublicId\)/.test(functionsSource) &&
    /normalizeClientPath\(data\.clientPath, orderPublicId\)/.test(functionsSource),
  "registerClientPushSubscription must store the client-provided path after normalization.",
);

assertContract(
  /function resolveNotificationTargetUrl\(rawTarget\)/.test(serviceWorkerSource) &&
    /self\.registration\.scope/.test(serviceWorkerSource) &&
    /client-launch\.html/.test(serviceWorkerSource),
  "Service worker notification clicks must resolve legacy links against the service worker scope.",
);

assertContract(
  packageConfig.scripts?.["qa:push-links"] === "node qa/check-push-notification-link-contracts.mjs",
  "package.json must expose the push notification link QA contract.",
);

console.log("Push notification link contracts verified.");
