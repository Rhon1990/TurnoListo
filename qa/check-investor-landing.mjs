import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const indexHtml = readFileSync(path.join(projectRoot, "index.html"), "utf8");

assert.match(indexHtml, /Solicitar demo/i, "La portada debe exponer un CTA principal de demo.");
assert.match(indexHtml, /sin hardware dedicado/i, "La portada debe destacar el ahorro frente al hardware dedicado.");
assert.match(indexHtml, /href="\.\/contact\.html"/i, "La portada debe enlazar al formulario comercial.");
assert.match(indexHtml, /id="como-funciona"/i, "La portada debe incluir la seccion de recorrido del producto.");
assert.match(indexHtml, /hardware tradicional/i, "La portada debe comparar TurnoListo frente al enfoque tradicional.");
assert.doesNotMatch(
  indexHtml,
  /Abrir administrador|Abrir restaurante|Abrir cliente/i,
  "La portada comercial no debe mostrar accesos operativos directos."
);

console.log("Investor landing check passed.");
