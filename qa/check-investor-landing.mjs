import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const indexHtml = readFileSync(path.join(projectRoot, "index.html"), "utf8");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");
const legacyPagerArtSvg = readFileSync(path.join(projectRoot, "assets", "landing", "legacy-pager-system.svg"), "utf8");
const restaurantShotPath = path.join(projectRoot, "assets", "landing", "restaurant-workspace.png");
const clientShotPath = path.join(projectRoot, "assets", "landing", "client-tracking.png");
const legacyPagerArtPath = path.join(projectRoot, "assets", "landing", "legacy-pager-system.svg");
const pagerDisplayMatches = [...legacyPagerArtSvg.matchAll(/fill="#FF5E61"[^>]*font-size="22"[^>]*>(\d+)<\/text>/g)];
const pagerDisplayNumbers = pagerDisplayMatches.map((match) => Number(match[1]));
const sortedPagerDisplayNumbers = [...pagerDisplayNumbers].sort((left, right) => left - right);

assert.match(indexHtml, /Solicitar demo/i, "La portada debe exponer un CTA principal de demo.");
assert.match(indexHtml, /sin hardware dedicado/i, "La portada debe destacar el ahorro frente al hardware dedicado.");
assert.match(indexHtml, /href="\.\/contact\.html"/i, "La portada debe enlazar al formulario comercial.");
assert.match(indexHtml, /id="como-funciona"/i, "La portada debe incluir la seccion de recorrido del producto.");
assert.match(indexHtml, /hardware tradicional/i, "La portada debe comparar TurnoListo frente al enfoque tradicional.");
assert.match(indexHtml, /localizadores f[ií]sicos/i, "La comparativa debe explicar la limitacion fisica del hardware tradicional.");
assert.match(indexHtml, /alcance y distancia/i, "La comparativa debe mencionar la limitacion de alcance del hardware.");
assert.match(indexHtml, /IA adaptativa/i, "La landing debe destacar la propuesta de IA adaptativa de TurnoListo.");
assert.match(indexHtml, /IA que aprende entre m[aá]s la usas/i, "La comparativa debe incluir el beneficio de IA evolutiva con TurnoListo.");
assert.match(indexHtml, /luces, vibraci[oó]n, sonido/i, "La comparativa debe incluir avisos multicanal en el movil.");
assert.match(indexHtml, /segundo plano/i, "La comparativa debe indicar que TurnoListo trabaja en segundo plano.");
assert.match(indexHtml, /assets\/landing\/restaurant-workspace\.png/i, "La portada debe referenciar la captura real de restaurante.");
assert.match(indexHtml, /assets\/landing\/client-tracking\.png/i, "La portada debe referenciar la captura real de cliente.");
assert.match(indexHtml, /assets\/landing\/legacy-pager-system\.svg/i, "La comparativa debe usar la ilustracion propia del hardware tradicional.");
assert.match(indexHtml, /landing\.js/i, "La portada debe cargar la capa de motion suave.");
assert.match(indexHtml, />\s*Iniciar sesi[oó]n\s*</i, "La portada debe ofrecer un acceso discreto de inicio de sesion.");
assert.match(indexHtml, /href="\.\/restaurant\.html"[^>]*>\s*Eres restaurante\s*</i, "La portada debe enlazar al acceso restaurante.");
assert.match(indexHtml, /href="\.\/admin\.html"[^>]*>\s*Eres admin\s*</i, "La portada debe enlazar al acceso administrador.");
assert.match(
  stylesCss,
  /\.market-compare__device,\s*\.market-compare__media\s*\{[\s\S]*min-height:\s*clamp\(/,
  "La comparativa debe mantener una altura visual compartida entre hardware tradicional y TurnoListo."
);
assert.ok(existsSync(restaurantShotPath), "Debe existir la captura real del panel restaurante.");
assert.ok(existsSync(clientShotPath), "Debe existir la captura real del panel cliente.");
assert.ok(existsSync(legacyPagerArtPath), "Debe existir la ilustracion propia del hardware tradicional.");
assert.ok(statSync(restaurantShotPath).size > 0, "La captura de restaurante no puede estar vacia.");
assert.ok(statSync(clientShotPath).size > 0, "La captura de cliente no puede estar vacia.");
assert.ok(statSync(legacyPagerArtPath).size > 0, "La ilustracion del hardware tradicional no puede estar vacia.");
assert.equal(
  pagerDisplayNumbers.length,
  14,
  "La ilustracion del hardware tradicional debe mostrar catorce localizadores numerados."
);
assert.deepEqual(
  sortedPagerDisplayNumbers,
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  "La ilustracion del hardware tradicional debe enumerar los localizadores del 1 al 14."
);
assert.doesNotMatch(
  legacyPagerArtSvg,
  />alerta<\/text>/i,
  "El localizador iluminado debe mostrar un numero, no texto generico."
);
assert.match(
  legacyPagerArtSvg,
  /id="keypad-dock-extension"/i,
  "La ilustracion del hardware tradicional debe integrar el teclado como parte de la base."
);
assert.match(
  legacyPagerArtSvg,
  /id="keypad-dock-front"/i,
  "La ilustracion del hardware tradicional debe extender el frente de la base bajo el teclado."
);
assert.match(
  legacyPagerArtSvg,
  /id="keypad-console"/i,
  "La ilustracion del hardware tradicional debe mantener el bloque del teclado identificado en el SVG."
);
assert.doesNotMatch(
  legacyPagerArtSvg,
  /id="keypad-support"/i,
  "La ilustracion del hardware tradicional no debe depender de un soporte separado."
);
assert.doesNotMatch(
  indexHtml,
  /Abrir administrador|Abrir restaurante|Abrir cliente/i,
  "La portada comercial no debe mostrar accesos operativos directos."
);

console.log("Investor landing check passed.");
