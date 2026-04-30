import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const adminProfileJs = readFileSync(path.join(projectRoot, "admin-profile.js"), "utf8");
const functionsIndexJs = readFileSync(path.join(projectRoot, "functions", "index.js"), "utf8");

assert.match(
  adminProfileJs,
  /await backend\.updateCurrentAdminProfile\(\{[\s\S]*country:\s*phoneValidation\.countryName,[\s\S]*phoneCountry:\s*phoneValidation\.phoneCountry,/,
  "El guardado del perfil admin debe enviar country y phoneCountry igual que el alta de administradores."
);

assert.match(
  functionsIndexJs,
  /exports\.updateCurrentAdminProfile = onCall\(async \(request\) => \{[\s\S]*const phoneCountry = normalizePhoneCountry\(data\.phoneCountry\);[\s\S]*const normalizedPhone = normalizeRestaurantPhone\(data\.phone, phoneCountry\);[\s\S]*phone: normalizedPhone\.phone,[\s\S]*country: normalizedPhone\.country,[\s\S]*phoneCountry: normalizedPhone\.phoneCountry,/,
  "La function updateCurrentAdminProfile debe normalizar y persistir phone, country y phoneCountry como un bloque coherente."
);

console.log("Admin profile phone country persistence check passed.");
