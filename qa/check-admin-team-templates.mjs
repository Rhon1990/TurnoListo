import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const adminProfileHtml = readFileSync(path.join(projectRoot, "admin-profile.html"), "utf8");
const adminProfileJs = readFileSync(path.join(projectRoot, "admin-profile.js"), "utf8");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");

assert.match(
  adminProfileHtml,
  /<div class="qr-modal" id="adminUserTemplatesModal" hidden>/,
  "La vista de perfil admin debe incluir un modal dedicado para las plantillas del equipo admin."
);

assert.match(
  adminProfileJs,
  /templatesButton\.textContent = "Plantillas";/,
  "Cada tarjeta del equipo admin debe ofrecer un boton Plantillas coherente con el flujo de restaurantes."
);

assert.match(
  adminProfileJs,
  /function getAdminUserEmailTemplateDefinitions\(user\)\s*\{[\s\S]*\{ key: "access", label: "Acceso" \}[\s\S]*\{ key: "onboarding", label: "Onboarding" \}/,
  "Las plantillas de admins deben cubrir acceso y onboarding sin inventar un flujo distinto."
);

assert.match(
  adminProfileJs,
  /La contrasena se gestiona solo desde tu propia cuenta\./,
  "Las plantillas de admins deben dejar explícito que la contrasena no se gestiona entre administradores."
);

assert.match(
  stylesCss,
  /\.admin-user-card__actions\s*\{[\s\S]*justify-content:\s*flex-end;/,
  "Las tarjetas de admins deben reservar una franja de acciones para el boton Plantillas."
);

console.log("Admin team templates check passed.");
