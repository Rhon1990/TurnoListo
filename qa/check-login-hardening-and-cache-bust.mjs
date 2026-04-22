import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");

const adminHtml = readFileSync(path.join(projectRoot, "admin.html"), "utf8");
const restaurantHtml = readFileSync(path.join(projectRoot, "restaurant.html"), "utf8");
const clientHtml = readFileSync(path.join(projectRoot, "client.html"), "utf8");
const contactHtml = readFileSync(path.join(projectRoot, "contact.html"), "utf8");
const adminProfileHtml = readFileSync(path.join(projectRoot, "admin-profile.html"), "utf8");
const restaurantProfileHtml = readFileSync(path.join(projectRoot, "restaurant-profile.html"), "utf8");
const clientLaunchHtml = readFileSync(path.join(projectRoot, "client-launch.html"), "utf8");
const sharedJs = readFileSync(path.join(projectRoot, "shared.js"), "utf8");
const adminJs = readFileSync(path.join(projectRoot, "admin.js"), "utf8");
const restaurantJs = readFileSync(path.join(projectRoot, "restaurant.js"), "utf8");

assert.match(
  adminHtml,
  /<form class="quick-form auth-form" id="adminLoginForm" method="post">/,
  "El login admin debe usar POST para no exponer credenciales en la URL si el JS falla."
);

assert.match(
  restaurantHtml,
  /<form class="quick-form auth-form" id="restaurantLoginForm" method="post">/,
  "El login restaurante debe usar POST para no exponer credenciales en la URL si el JS falla."
);

for (const [label, html] of [
  ["admin", adminHtml],
  ["restaurant", restaurantHtml],
  ["client", clientHtml],
  ["contact", contactHtml],
  ["admin-profile", adminProfileHtml],
  ["restaurant-profile", restaurantProfileHtml],
  ["client-launch", clientLaunchHtml],
]) {
  assert.match(
    html,
    /<script src="\.\/i18n\.js\?v=20260422a"><\/script>/,
    `La pagina ${label} debe invalidar cache de i18n.js tras el cambio de runtime.`
  );
}

for (const [label, html] of [
  ["admin", adminHtml],
  ["restaurant", restaurantHtml],
  ["client", clientHtml],
  ["contact", contactHtml],
  ["admin-profile", adminProfileHtml],
  ["restaurant-profile", restaurantProfileHtml],
]) {
  assert.match(
    html,
    /<script src="\.\/shared\.js\?v=20260422b"><\/script>/,
    `La pagina ${label} debe invalidar cache de shared.js tras el saneado de credenciales sensibles en la URL.`
  );
}

assert.match(
  adminHtml,
  /<script src="\.\/admin\.js\?v=20260422c"><\/script>/,
  "admin.html debe invalidar cache del runtime del panel tras el saneado de credenciales sensibles."
);

assert.match(
  restaurantHtml,
  /<script src="\.\/restaurant\.js\?v=20260422c"><\/script>/,
  "restaurant.html debe invalidar cache del runtime del panel tras el saneado de credenciales sensibles."
);

assert.match(
  clientHtml,
  /<script src="\.\/client\.js\?v=20260422c"><\/script>/,
  "client.html debe invalidar cache del runtime del cliente tras resolver la colision global del busy state."
);

assert.match(
  sharedJs,
  /function sanitizeSensitiveQueryParams\(keys = \[\]\)/,
  "shared.js debe exponer un helper reutilizable para limpiar query params sensibles."
);

assert.match(
  sharedJs,
  /window\.TurnoListoUrl = \{\s*sanitizeSensitiveQueryParams,\s*\};/s,
  "shared.js debe publicar el saneador de URL dentro de un namespace reutilizable."
);

assert.match(
  adminJs,
  /const sanitizeSensitiveUrlQueryParams = window\.TurnoListoUrl\?\.sanitizeSensitiveQueryParams;/,
  "admin.js debe reutilizar el helper compartido para limpiar query params sensibles."
);

assert.match(
  adminJs,
  /sanitizeSensitiveUrlQueryParams\?\.\(\["username", "password"\]\);[\s\S]*initializeAdminFirebaseAuth\(\);/,
  "admin.js debe limpiar username y password de la URL antes de inicializar el login."
);

assert.match(
  restaurantJs,
  /const sanitizeSensitiveUrlQueryParams = window\.TurnoListoUrl\?\.sanitizeSensitiveQueryParams;/,
  "restaurant.js debe reutilizar el helper compartido para limpiar query params sensibles."
);

assert.match(
  restaurantJs,
  /sanitizeSensitiveUrlQueryParams\?\.\(\["username", "password"\]\);[\s\S]*initializeRestaurantFirebaseAuth\(\);/,
  "restaurant.js debe limpiar username y password de la URL antes de inicializar el login."
);

console.log("Login hardening and cache-bust check passed.");
