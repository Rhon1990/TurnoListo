import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const restaurantHtml = readFileSync(path.join(projectRoot, "restaurant.html"), "utf8");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");

assert.match(
  restaurantHtml,
  /<div class="panel__heading">\s*<div class="panel__heading-copy--restaurant-summary">/s,
  "El encabezado operativo del restaurante debe agrupar el titulo y los KPI en el mismo bloque visual."
);

assert.match(
  restaurantHtml,
  /<div class="admin-inbox-quick-filters admin-inbox-quick-filters--restaurant-summary" aria-label="Filtros rápidos de pedidos de hoy">/,
  "Los KPI del restaurante deben declararse con un contenedor especifico para su resumen lateral."
);

assert.match(
  stylesCss,
  /\.panel__heading-copy--restaurant-summary\s*\{[\s\S]*gap:\s*0\.85rem;/,
  "El bloque del encabezado del restaurante debe reservar separacion vertical entre titulo y KPI."
);

assert.match(
  stylesCss,
  /\.admin-inbox-quick-filters--restaurant-summary\s*\{[\s\S]*display:\s*flex;[\s\S]*flex-wrap:\s*wrap;[\s\S]*justify-content:\s*start;[\s\S]*max-width:\s*none;[\s\S]*overflow:\s*visible;/,
  "El resumen del restaurante debe poder envolver chips en varias lineas para evitar recortes."
);

assert.match(
  stylesCss,
  /@media \(max-width: 640px\)\s*\{[\s\S]*?\.admin-inbox-quick-filters--restaurant-summary\s*\{[\s\S]*?flex-wrap:\s*nowrap;[\s\S]*?overflow-x:\s*auto;[\s\S]*?overflow-y:\s*hidden;/,
  "En movil, el resumen del restaurante debe mantenerse en una sola linea con scroll horizontal."
);

assert.match(
  stylesCss,
  /\.admin-inbox-quick-filters--restaurant-summary\s+\.admin-inbox-quick-filter\s*\{[\s\S]*white-space:\s*nowrap;/,
  "Cada KPI del restaurante debe impedir saltos internos de linea para mantenerse en horizontal."
);

console.log("Restaurant summary layout check passed.");
