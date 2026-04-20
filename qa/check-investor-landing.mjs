import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const indexHtml = readFileSync(path.join(projectRoot, "index.html"), "utf8");
const restaurantShotPath = path.join(projectRoot, "assets", "landing", "restaurant-workspace.png");
const clientShotPath = path.join(projectRoot, "assets", "landing", "client-tracking.png");
const legacyPagerArtPath = path.join(projectRoot, "assets", "landing", "legacy-pager-system.svg");

assert.match(indexHtml, /Solicitar demo/i, "La portada debe exponer un CTA principal de demo.");
assert.match(indexHtml, /sin hardware dedicado/i, "La portada debe destacar el ahorro frente al hardware dedicado.");
assert.match(indexHtml, /href="\.\/contact\.html"/i, "La portada debe enlazar al formulario comercial.");
assert.match(indexHtml, /id="como-funciona"/i, "La portada debe incluir la seccion de recorrido del producto.");
assert.match(indexHtml, /hardware tradicional/i, "La portada debe comparar TurnoListo frente al enfoque tradicional.");
assert.match(indexHtml, /assets\/landing\/restaurant-workspace\.png/i, "La portada debe referenciar la captura real de restaurante.");
assert.match(indexHtml, /assets\/landing\/client-tracking\.png/i, "La portada debe referenciar la captura real de cliente.");
assert.match(indexHtml, /assets\/landing\/legacy-pager-system\.svg/i, "La comparativa debe usar la ilustracion propia del hardware tradicional.");
assert.match(indexHtml, /landing\.js/i, "La portada debe cargar la capa de motion suave.");
assert.match(indexHtml, />\s*Iniciar sesi[oó]n\s*</i, "La portada debe ofrecer un acceso discreto de inicio de sesion.");
assert.match(indexHtml, /href="\.\/restaurant\.html"[^>]*>\s*Eres restaurante\s*</i, "La portada debe enlazar al acceso restaurante.");
assert.match(indexHtml, /href="\.\/admin\.html"[^>]*>\s*Eres admin\s*</i, "La portada debe enlazar al acceso administrador.");
assert.ok(existsSync(restaurantShotPath), "Debe existir la captura real del panel restaurante.");
assert.ok(existsSync(clientShotPath), "Debe existir la captura real del panel cliente.");
assert.ok(existsSync(legacyPagerArtPath), "Debe existir la ilustracion propia del hardware tradicional.");
assert.ok(statSync(restaurantShotPath).size > 0, "La captura de restaurante no puede estar vacia.");
assert.ok(statSync(clientShotPath).size > 0, "La captura de cliente no puede estar vacia.");
assert.ok(statSync(legacyPagerArtPath).size > 0, "La ilustracion del hardware tradicional no puede estar vacia.");
assert.doesNotMatch(
  indexHtml,
  /Abrir administrador|Abrir restaurante|Abrir cliente/i,
  "La portada comercial no debe mostrar accesos operativos directos."
);

console.log("Investor landing check passed.");
