import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const adminHtml = readFileSync(path.join(projectRoot, "admin.html"), "utf8");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");

assert.match(
  adminHtml,
  /<div class="panel__heading">\s*<div class="panel__heading-copy--admin-inbox">/s,
  "El encabezado de mensajes debe agrupar el titulo y los filtros rapidos en un mismo bloque vertical."
);

assert.match(
  adminHtml,
  /<div class="admin-inbox-quick-filters admin-inbox-quick-filters--messages" aria-label="Filtros rápidos de mensajes">/,
  "Los chips de mensajes deben usar un contenedor especifico para alinearse bajo el titulo."
);

assert.match(
  stylesCss,
  /\.panel__heading-copy--admin-inbox\s*\{[\s\S]*gap:\s*0\.85rem;/,
  "El bloque del inbox admin debe reservar separacion vertical entre titulo y chips."
);

assert.match(
  stylesCss,
  /\.admin-inbox-quick-filters--messages\s*\{[\s\S]*display:\s*flex;[\s\S]*justify-content:\s*flex-start;[\s\S]*flex-wrap:\s*nowrap;[\s\S]*overflow-x:\s*auto;[\s\S]*overflow-y:\s*hidden;/,
  "Los chips de mensajes deben mantenerse en una sola linea y permitir scroll horizontal si no caben."
);

assert.match(
  stylesCss,
  /\.admin-inbox-quick-filters--messages\s+\.admin-inbox-quick-filter\s*\{[\s\S]*white-space:\s*nowrap;/,
  "Cada chip de mensajes debe evitar saltos internos de linea."
);

console.log("Admin inbox layout check passed.");
