import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const clientJs = readFileSync(path.join(projectRoot, "client.js"), "utf8");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");

const progressStatusOrderMatch = clientJs.match(/const progressStatusOrder = \[[^\]]+\];/);
const getProgressWidthMatch = clientJs.match(/function getProgressWidth\(status\) \{[\s\S]*?\n\}/);

assert.ok(progressStatusOrderMatch, "client.js debe definir el orden de estados del progreso del cliente.");
assert.ok(getProgressWidthMatch, "client.js debe exponer una funcion para calcular el ancho de la barra.");

const context = {};
const isCloseTo = (actual, expected) => Math.abs(actual - expected) < 1e-9;
vm.runInNewContext(
  `
  ${progressStatusOrderMatch[0]}
  ${getProgressWidthMatch[0]}
  result = {
    received: getProgressWidth("received"),
    preparing: getProgressWidth("preparing"),
    ready: getProgressWidth("ready"),
    delivered: getProgressWidth("delivered"),
    cancelled: getProgressWidth("cancelled"),
  };
  `,
  context,
);

assert.match(
  stylesCss,
  /\.progress\s*\{[\s\S]*--progress-step-gap:\s*0\.4rem;[\s\S]*\}/,
  "El cliente debe definir una separacion compartida entre hitos y carril."
);
assert.match(
  stylesCss,
  /\.progress__bar\s*\{[\s\S]*margin-inline:\s*calc\(12\.5%\s*-\s*\(var\(--progress-step-gap\)\s*\*\s*3\s*\/\s*8\)\);[\s\S]*\}/,
  "El carril del progreso debe alinearse con el centro del primer y ultimo hito."
);
assert.match(
  stylesCss,
  /\.progress-steps\s*\{[\s\S]*gap:\s*var\(--progress-step-gap\);[\s\S]*\}/,
  "Los hitos del cliente deben reutilizar la misma separacion que usa el carril."
);

assert.equal(context.result.received, 0, "Recibido debe arrancar en el primer hito del carril alineado.");
assert.ok(isCloseTo(context.result.preparing, 100 / 3), "En preparación debe avanzar al segundo hito.");
assert.ok(isCloseTo(context.result.ready, 200 / 3), "Listo debe avanzar al tercer hito.");
assert.equal(context.result.delivered, 100, "Entregado debe llegar al final del carril alineado.");
assert.equal(context.result.cancelled, 0, "Cancelado no debe proyectarse sobre la linea de entrega.");

console.log("Client progress alignment check passed.");
