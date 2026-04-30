import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");

const rootFirebaseConfigPath = path.join(projectRoot, "firebase-config.js");
const rootMessagingSwPath = path.join(projectRoot, "firebase-messaging-sw.js");
const environmentConfigPath = path.join(projectRoot, "config", "firebase-environments.json");
const buildScriptPath = path.join(projectRoot, "scripts", "build-hosting-env.mjs");
const developHostingConfigPath = path.join(projectRoot, "firebase.hosting.develop.json");
const productionHostingConfigPath = path.join(projectRoot, "firebase.hosting.production.json");
const firebaseRcPath = path.join(projectRoot, ".firebaserc");
const firebaseJsonPath = path.join(projectRoot, "firebase.json");
const distDir = path.join(projectRoot, "dist");

assert.ok(existsSync(environmentConfigPath), "Debe existir una fuente unica de configuracion para entornos Firebase.");
assert.ok(existsSync(buildScriptPath), "Debe existir un builder explicito para generar Hosting por entorno.");
assert.ok(existsSync(developHostingConfigPath), "Debe existir una configuracion de Hosting dedicada a develop.");
assert.ok(existsSync(productionHostingConfigPath), "Debe existir una configuracion de Hosting dedicada a production.");

const firebaseRc = readFileSync(firebaseRcPath, "utf8");
assert.match(
  firebaseRc,
  /"develop"\s*:\s*"turnolisto-f62c1"/,
  "La alias develop debe apuntar al proyecto Firebase turnolisto-f62c1."
);
assert.match(
  firebaseRc,
  /"production"\s*:\s*"turnolisto-prod"/,
  "La alias production debe apuntar al proyecto Firebase turnolisto-prod."
);

const firebaseJson = readFileSync(firebaseJsonPath, "utf8");
assert.doesNotMatch(
  firebaseJson,
  /"hosting"\s*:/,
  "La configuracion raiz no debe permitir deploys ambiguos de Hosting; cada entorno necesita su propio firebase.*.json."
);

const developHostingConfig = readFileSync(developHostingConfigPath, "utf8");
const productionHostingConfig = readFileSync(productionHostingConfigPath, "utf8");
assert.match(
  developHostingConfig,
  /"site"\s*:\s*"turnolisto-dev"/,
  "El deploy de Hosting develop debe publicar en turnolisto-dev."
);
assert.match(
  developHostingConfig,
  /"site"\s*:\s*"turnolisto-f62c1"/,
  "El deploy de Hosting develop debe mantener alineado el sitio legacy turnolisto-f62c1."
);
assert.match(
  productionHostingConfig,
  /"site"\s*:\s*"turnolisto-prod"/,
  "El deploy de Hosting production debe publicar en turnolisto-prod."
);

const rootFirebaseConfig = readFileSync(rootFirebaseConfigPath, "utf8");
assert.match(
  rootFirebaseConfig,
  /const FIREBASE_ENVIRONMENTS = Object\.freeze\(/,
  "El runtime raiz debe resolver entornos desde un catalogo central, no desde un config hardcodeado a develop."
);
assert.match(
  rootFirebaseConfig,
  /window\.TURNO_LISTO_FIREBASE_ENV = currentEnvironment;/,
  "El runtime raiz debe exponer el entorno Firebase resuelto para diagnostico."
);

const rootMessagingSw = readFileSync(rootMessagingSwPath, "utf8");
assert.match(
  rootMessagingSw,
  /const FIREBASE_ENVIRONMENTS = Object\.freeze\(/,
  "El service worker debe resolver entornos desde el mismo catalogo Firebase."
);

rmSync(distDir, { recursive: true, force: true });

execFileSync("node", [buildScriptPath, "develop"], {
  cwd: projectRoot,
  stdio: "pipe",
});
execFileSync("node", [buildScriptPath, "production"], {
  cwd: projectRoot,
  stdio: "pipe",
});

const developBuildFirebaseConfig = readFileSync(path.join(distDir, "develop", "firebase-config.js"), "utf8");
const productionBuildFirebaseConfig = readFileSync(path.join(distDir, "production", "firebase-config.js"), "utf8");
const developBuildMessagingSw = readFileSync(path.join(distDir, "develop", "firebase-messaging-sw.js"), "utf8");
const productionBuildMessagingSw = readFileSync(path.join(distDir, "production", "firebase-messaging-sw.js"), "utf8");

assert.match(
  developBuildFirebaseConfig,
  /"projectId": "turnolisto-f62c1"/,
  "El build develop debe inyectar exclusivamente el projectId de develop."
);
assert.doesNotMatch(
  developBuildFirebaseConfig,
  /turnolisto-prod/,
  "El build develop no debe filtrar credenciales ni IDs de production."
);
assert.match(
  productionBuildFirebaseConfig,
  /"projectId": "turnolisto-prod"/,
  "El build production debe inyectar exclusivamente el projectId de production."
);
assert.doesNotMatch(
  productionBuildFirebaseConfig,
  /turnolisto-f62c1/,
  "El build production no debe filtrar credenciales ni IDs de develop."
);

assert.match(
  developBuildMessagingSw,
  /"projectId": "turnolisto-f62c1"/,
  "El service worker de develop debe usar exclusivamente el proyecto develop."
);
assert.doesNotMatch(
  developBuildMessagingSw,
  /turnolisto-prod/,
  "El service worker de develop no debe incluir el proyecto production."
);
assert.match(
  productionBuildMessagingSw,
  /"projectId": "turnolisto-prod"/,
  "El service worker de production debe usar exclusivamente el proyecto production."
);
assert.doesNotMatch(
  productionBuildMessagingSw,
  /turnolisto-f62c1/,
  "El service worker de production no debe incluir el proyecto develop."
);

assert.ok(
  existsSync(path.join(distDir, "develop", "admin-profile.html")) &&
    existsSync(path.join(distDir, "production", "admin-profile.html")),
  "Ambos builds deben incluir las paginas privadas que consumen Firebase."
);

console.log("Firebase environment separation check passed.");
