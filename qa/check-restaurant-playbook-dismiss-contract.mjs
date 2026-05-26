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
  /restaurantPlaybookDismiss\.hidden = !dismissUnlocked;/,
  "La x del playbook debe mostrarse en demo y operativa real cuando los 3 pasos operativos desbloquean el cierre."
);

assert.doesNotMatch(
  restaurantJs,
  /restaurantPlaybookDismiss\.hidden = !\(isDemo && dismissUnlocked\);/,
  "El cierre del playbook no debe estar limitado a restaurantes demo."
);

assert.doesNotMatch(
  restaurantJs,
  /if \(!restaurant \|\| !isDemoRestaurant\(restaurant\)\) return;/,
  "El handler de la x debe permitir cerrar el playbook operativo real, no solo el demo."
);

console.log("Restaurant playbook dismiss contract check passed.");
