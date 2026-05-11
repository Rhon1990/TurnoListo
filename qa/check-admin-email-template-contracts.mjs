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

const adminSource = readProjectFile("admin.js");
const sharedSource = readProjectFile("shared.js");
const packageConfig = JSON.parse(readProjectFile("package.json"));

const renewalEmailSource = sharedSource.match(/function buildRestaurantRenewalEmail\(restaurant, options = \{}\) \{[\s\S]*?\n\}/)?.[0] || "";
assertContract(
  renewalEmailSource.includes("buildRestaurantEmailAccessStatusLabel(restaurant)") &&
    !renewalEmailSource.includes("buildRemainingAccessLabel(restaurant)"),
  "Shared renewal email builder must use a shared access-status helper, not an admin.js-local function.",
);

assertContract(
  /function buildRestaurantEmailAccessStatusLabel\(restaurant\)/.test(sharedSource) &&
    /getRestaurantRemainingDays\(restaurant\)/.test(sharedSource),
  "shared.js must expose an email-safe access status label for templates.",
);

const selectTemplateSource = adminSource.match(/async function selectEmailTemplate\(templateKey\) \{[\s\S]*?\n\}/)?.[0] || "";
assertContract(
  /try\s*\{[\s\S]*await buildAdminEmailDraft\(templateKey, restaurant\)[\s\S]*\}\s*catch/.test(selectTemplateSource) &&
    /console\.error\("No se pudo preparar la plantilla de correo\.", error\)/.test(selectTemplateSource),
  "selectEmailTemplate must catch draft errors and render a visible failure instead of staying in loading state.",
);

assertContract(
  packageConfig.scripts?.["qa:admin-email-templates"] === "node qa/check-admin-email-template-contracts.mjs",
  "package.json must expose the admin email template QA contract.",
);

console.log("Admin email template contracts verified.");
