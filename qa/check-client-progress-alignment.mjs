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

const progressBarBlockMatch = stylesCss.match(/\.progress__bar\s*\{[\s\S]*?\n\}/);
assert.ok(progressBarBlockMatch, "El cliente debe definir el carril del progreso.");
assert.doesNotMatch(
  progressBarBlockMatch[0],
  /margin-inline:/,
  "El carril del progreso debe mantener el ancho completo de la tarjeta."
);

assert.equal(
  context.result.received,
  "calc(12.5% - (var(--progress-step-gap) * 3 / 8))",
  "Recibido debe llenar hasta el centro del primer hito."
);
assert.equal(
  context.result.preparing,
  "calc(37.5% - (var(--progress-step-gap) / 8))",
  "En preparación debe llenar hasta el centro del segundo hito."
);
assert.equal(
  context.result.ready,
  "calc(62.5% + (var(--progress-step-gap) / 8))",
  "Listo debe llenar hasta el centro del tercer hito."
);
assert.equal(
  context.result.delivered,
  "100%",
  "Entregado debe llenar todo el carril tras alcanzar el ultimo hito."
);
assert.equal(context.result.cancelled, "0%", "Cancelado no debe proyectarse sobre la linea de entrega.");

console.log("Client progress alignment check passed.");
