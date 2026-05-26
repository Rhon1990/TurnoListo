import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");
const clientHtml = readFileSync(path.join(projectRoot, "client.html"), "utf8");
const clientJs = readFileSync(path.join(projectRoot, "client.js"), "utf8");
const i18nJs = readFileSync(path.join(projectRoot, "i18n.js"), "utf8");

const clientOrderNumberBlockMatch = stylesCss.match(/#clientOrderNumber\s*\{[\s\S]*?\n\}/);
const clientCustomerBlockMatch = stylesCss.match(/#clientCustomer\s*\{[\s\S]*?\n\}/);
const clientTicketBlockMatch = stylesCss.match(/\.ticket--client\s*\{[\s\S]*?\n\}/);

assert.ok(clientTicketBlockMatch, "La tarjeta cliente debe tener un bloque CSS propio.");
assert.match(
  clientTicketBlockMatch[0],
  /container-type:\s*inline-size;/,
  "La tarjeta cliente debe exponer su ancho como contenedor para ajustar el numero del pedido."
);
assert.match(
  clientHtml,
  /<h3 id="clientCustomer">--<\/h3>\s*<p class="ticket__label" id="clientOrderNumber">--<\/p>/,
  "La tarjeta cliente debe mostrar primero el nombre del cliente y debajo el numero del pedido."
);
assert.ok(clientCustomerBlockMatch, "Debe existir un bloque CSS especifico para destacar el nombre del cliente.");
assert.ok(clientOrderNumberBlockMatch, "Debe existir un bloque CSS especifico para el numero secundario del pedido cliente.");

const clientCustomerBlock = clientCustomerBlockMatch[0];
assert.match(
  clientCustomerBlock,
  /font-size:\s*clamp\(2\.2rem,\s*12cqw,\s*4\.6rem\);/,
  "El nombre del cliente debe tener mas protagonismo que el consecutivo."
);
assert.match(
  clientCustomerBlock,
  /white-space:\s*nowrap;/,
  "El nombre del cliente debe mantenerse en una sola linea cuando sea posible."
);
assert.match(
  clientCustomerBlock,
  /text-transform:\s*uppercase;/,
  "El nombre del cliente debe verse como identificador principal de recogida."
);

const clientOrderNumberBlock = clientOrderNumberBlockMatch[0];
assert.match(
  clientOrderNumberBlock,
  /white-space:\s*nowrap;/,
  "El numero de pedido cliente debe mantenerse en una sola linea."
);
assert.match(
  clientOrderNumberBlock,
  /font-size:\s*clamp\(0\.85rem,\s*3\.2cqw,\s*1\.05rem\);/,
  "El numero de pedido cliente debe ser una referencia secundaria compacta."
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
assert.match(
  clientJs,
  /ticketOrderId\.textContent = formatKey\(\s*"client\.dynamic\.order\.secureCode",\s*\{ code: publicOrderId \},\s*`Código \$\{publicOrderId\}`,\s*\);/,
  "La tarjeta cliente debe mostrar el codigo seguro como dato secundario del pedido."
);
assert.match(
  i18nJs,
  /"client\.dynamic\.order\.secureCode":\s*"Código \{code\}"/,
  "La etiqueta secundaria del codigo seguro debe estar registrada en i18n."
);

console.log("Client order number layout check passed.");
