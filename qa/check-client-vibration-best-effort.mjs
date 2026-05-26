import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const clientJs = readFileSync(path.join(projectRoot, "client.js"), "utf8");
const serviceWorkerSource = readFileSync(path.join(projectRoot, "firebase-messaging-sw.js"), "utf8");
const firebaseEnvSource = readFileSync(path.join(projectRoot, "scripts/lib/firebase-env.mjs"), "utf8");

assert.match(
  clientJs,
  /const READY_VIBRATION_PATTERN = Object\.freeze\(\[360, 180, 360, 180, 520\]\);/,
  "El cliente debe usar un patron de vibracion mas largo y compartido para mejorar compatibilidad Android."
);

assert.match(
  clientJs,
  /function triggerReadyVibrationPreview\(\)[\s\S]*navigator\.vibrate\(READY_VIBRATION_PATTERN\);/,
  "Activar avisos debe disparar una prueba haptica inmediata bajo gesto de usuario."
);

assert.match(
  clientJs,
  /await warmUpReadyTone\(\);\s*triggerReadyVibrationPreview\(\);/,
  "La prueba haptica debe ejecutarse justo al activar avisos, despues de preparar el sonido local."
);

assert.match(
  clientJs,
  /navigator\.vibrate\(READY_VIBRATION_PATTERN\);/,
  "La celebracion de pedido listo debe reutilizar el patron haptico compartido."
);

assert.match(
  serviceWorkerSource,
  /vibrate:\s*\[360, 180, 360, 180, 520\],/,
  "La notificacion push debe declarar el patron de vibracion cuando el navegador lo soporte."
);

const templateVibrationMatches = firebaseEnvSource.match(/vibrate:\s*\[360, 180, 360, 180, 520\],/g) || [];
assert.equal(
  templateVibrationMatches.length,
  2,
  "Las dos plantillas del service worker Firebase deben conservar el patron de vibracion."
);

console.log("Client vibration best-effort check passed.");
