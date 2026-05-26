import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");

const clientOrderNumberBlockMatch = stylesCss.match(/#clientOrderNumber\s*\{[\s\S]*?\n\}/);
const clientTicketBlockMatch = stylesCss.match(/\.ticket--client\s*\{[\s\S]*?\n\}/);

assert.ok(clientTicketBlockMatch, "La tarjeta cliente debe tener un bloque CSS propio.");
assert.match(
  clientTicketBlockMatch[0],
  /container-type:\s*inline-size;/,
  "La tarjeta cliente debe exponer su ancho como contenedor para ajustar el numero del pedido."
);
assert.ok(clientOrderNumberBlockMatch, "Debe existir un bloque CSS especifico para el numero del pedido cliente.");

const clientOrderNumberBlock = clientOrderNumberBlockMatch[0];
assert.match(
  clientOrderNumberBlock,
  /white-space:\s*nowrap;/,
  "El numero de pedido cliente debe mantenerse en una sola linea."
);
assert.match(
  clientOrderNumberBlock,
  /font-size:\s*clamp\(2rem,\s*10cqw,\s*4rem\);/,
  "El numero de pedido cliente debe adaptar su tamano al ancho de su contenedor."
);
assert.match(
  clientOrderNumberBlock,
  /letter-spacing:\s*0;/,
  "El numero de pedido cliente debe evitar tracking negativo para mejorar la lectura en movil."
);
assert.match(
  clientOrderNumberBlock,
  /max-width:\s*100%;/,
  "El numero de pedido cliente no debe desbordar la tarjeta."
);

console.log("Client order number layout check passed.");
