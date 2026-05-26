import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const restaurantJs = readFileSync(path.join(projectRoot, "restaurant.js"), "utf8");

assert.match(
  restaurantJs,
  /const dismissUnlocked = hasCreatedOrder && hasReadyOrder && hasClosedLoop;/,
  "El playbook debe poder cerrarse al completar los 3 pasos operativos; la valoracion es opcional."
);

assert.doesNotMatch(
  restaurantJs,
  /const dismissUnlocked = [^;]*hasRatedOrder[^;]*;/,
  "La valoracion del cliente no debe bloquear la visibilidad ni accion de la x del playbook."
);

assert.match(
  restaurantJs,
  /restaurantPlaybookDismiss\.hidden = !\(isDemo && dismissUnlocked\);/,
  "La x del playbook demo debe mostrarse cuando los 3 pasos operativos desbloquean el cierre."
);

console.log("Restaurant playbook dismiss contract check passed.");
