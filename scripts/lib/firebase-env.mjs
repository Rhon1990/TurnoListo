import assert from "node:assert/strict";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const libDir = path.dirname(currentFile);
const scriptsDir = path.resolve(libDir, "..");

export const projectRoot = path.resolve(scriptsDir, "..");
export const firebaseEnvironmentConfigPath = path.join(projectRoot, "config", "firebase-environments.json");
export const FRONTEND_BUILD_ENTRIES = Object.freeze([
  "admin-profile.html",
  "admin-profile.js",
  "admin.html",
  "admin.js",
  "assets",
  "client-launch.html",
  "client-launch.js",
  "client.html",
  "client.js",
  "contact.html",
  "contact.js",
  "favicon.svg",
  "firebase-bridge.js",
  "i18n.js",
  "index.html",
  "landing.js",
  "manifest.webmanifest",
  "restaurant-profile.html",
  "restaurant-profile.js",
  "restaurant.html",
  "restaurant.js",
  "shared.js",
  "styles.css",
  "turnolisto-brand.png",
  "turnolisto-brand.svg",
]);

const REQUIRED_ENVIRONMENT_FIELDS = Object.freeze([
  "projectAlias",
  "projectId",
  "hostingSite",
  "apiKey",
  "authDomain",
  "storageBucket",
  "messagingSenderId",
  "appId",
]);

function normalizeValue(value) {
  return String(value || "").trim();
}

function indentBlock(value, spaces) {
  const prefix = " ".repeat(spaces);
  return String(value)
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

function toClientConfig(environment) {
  return {
    enabled: environment.enabled !== false,
    apiKey: environment.apiKey,
    authDomain: environment.authDomain,
    projectId: environment.projectId,
    storageBucket: environment.storageBucket,
    messagingSenderId: environment.messagingSenderId,
    appId: environment.appId,
    messagingVapidKey: normalizeValue(environment.messagingVapidKey),
  };
}

function renderEnvironmentConfigMap(catalog) {
  const environmentEntries = Object.entries(catalog.environments).map(([name, environment]) => {
    const serializedConfig = JSON.stringify(toClientConfig(environment), null, 2);
    return `${JSON.stringify(name)}: Object.freeze(\n${indentBlock(serializedConfig, 4)}\n  )`;
  });

  return `Object.freeze({\n  ${environmentEntries.join(",\n  ")}\n})`;
}

function renderEnvironmentHostnameMap(catalog) {
  const hostnameEntries = Object.entries(catalog.environments).map(([name, environment]) => {
    const serializedHostnames = JSON.stringify(Array.isArray(environment.hostnames) ? environment.hostnames : [], null, 2);
    return `${JSON.stringify(name)}: Object.freeze(\n${indentBlock(serializedHostnames, 4)}\n  )`;
  });

  return `Object.freeze({\n  ${hostnameEntries.join(",\n  ")}\n})`;
}

function validateCatalog(catalog) {
  assert.equal(typeof catalog, "object", "La configuracion de entornos Firebase debe ser un objeto JSON.");

  const defaultEnvironment = normalizeValue(catalog.defaultEnvironment);
  assert.ok(defaultEnvironment, "La configuracion de entornos Firebase debe definir un defaultEnvironment.");
  assert.equal(typeof catalog.environments, "object", "La configuracion de entornos Firebase debe incluir environments.");
  assert.ok(catalog.environments, "La configuracion de entornos Firebase debe incluir environments.");
  assert.ok(
    Object.prototype.hasOwnProperty.call(catalog.environments, defaultEnvironment),
    "El defaultEnvironment debe existir dentro del catalogo de entornos Firebase."
  );

  for (const [environmentName, environment] of Object.entries(catalog.environments)) {
    assert.equal(typeof environment, "object", `La configuracion del entorno ${environmentName} debe ser un objeto.`);
    assert.ok(environment, `La configuracion del entorno ${environmentName} debe existir.`);

    for (const fieldName of REQUIRED_ENVIRONMENT_FIELDS) {
      assert.ok(normalizeValue(environment[fieldName]), `El entorno ${environmentName} debe definir ${fieldName}.`);
    }

    if (environment.hostnames !== undefined) {
      assert.ok(
        Array.isArray(environment.hostnames),
        `Si el entorno ${environmentName} define hostnames, debe hacerlo como array.`
      );
    }
  }
}

export async function loadFirebaseEnvironmentCatalog() {
  const rawCatalog = JSON.parse(await readFile(firebaseEnvironmentConfigPath, "utf8"));
  validateCatalog(rawCatalog);
  return rawCatalog;
}

export function getFirebaseEnvironment(catalog, environmentName) {
  const normalizedEnvironmentName = normalizeValue(environmentName);
  const environment = catalog.environments?.[normalizedEnvironmentName];
  assert.ok(environment, `El entorno Firebase ${normalizedEnvironmentName || "(vacío)"} no existe en el catalogo.`);
  return environment;
}

export function getHostingFirebaseConfigPath(environmentName) {
  return path.join(projectRoot, `firebase.hosting.${normalizeValue(environmentName)}.json`);
}

export function getDistEnvironmentDirectory(environmentName) {
  return path.join(projectRoot, "dist", normalizeValue(environmentName));
}

export function renderFirebaseConfigResolver(catalog) {
  const defaultEnvironment = normalizeValue(catalog.defaultEnvironment);
  const environmentHostnames = renderEnvironmentHostnameMap(catalog);
  const environmentsObject = renderEnvironmentConfigMap(catalog);

  return `(function initializeTurnoListoFirebaseConfig() {
  const DEFAULT_FIREBASE_ENVIRONMENT = ${JSON.stringify(defaultEnvironment)};
  const FIREBASE_ENVIRONMENT_HOSTNAMES = ${environmentHostnames};
  const FIREBASE_ENVIRONMENTS = ${environmentsObject};

  function normalizeValue(value) {
    return String(value || "").trim();
  }

  function readEnvironmentOverride() {
    const query = new URLSearchParams(window.location.search).get("tlEnv");
    const directOverride = normalizeValue(window.TURNO_LISTO_FIREBASE_ENV_OVERRIDE).toLowerCase();
    const normalizedQuery = normalizeValue(query).toLowerCase();
    const requestedEnvironment = normalizedQuery || directOverride;
    if (requestedEnvironment === "staging") return "develop";
    return Object.prototype.hasOwnProperty.call(FIREBASE_ENVIRONMENTS, requestedEnvironment) ? requestedEnvironment : "";
  }

  function resolveFirebaseEnvironment(hostname) {
    const normalizedHostname = normalizeValue(hostname).toLowerCase();
    const explicitEnvironment = readEnvironmentOverride();
    if (explicitEnvironment) return explicitEnvironment;
    if (normalizedHostname === "localhost" || normalizedHostname === "127.0.0.1") return DEFAULT_FIREBASE_ENVIRONMENT;

    const matchedEnvironment = Object.entries(FIREBASE_ENVIRONMENT_HOSTNAMES).find(([, hostnames]) =>
      hostnames.includes(normalizedHostname),
    );
    return matchedEnvironment?.[0] || DEFAULT_FIREBASE_ENVIRONMENT;
  }

  function isFirebaseConfigReady(config) {
    return Boolean(
      config?.enabled &&
        normalizeValue(config.apiKey) &&
        !normalizeValue(config.apiKey).startsWith("REPLACE_WITH_") &&
        normalizeValue(config.projectId) &&
        normalizeValue(config.messagingSenderId) &&
        !normalizeValue(config.messagingSenderId).startsWith("REPLACE_WITH_") &&
        normalizeValue(config.appId) &&
        !normalizeValue(config.appId).startsWith("REPLACE_WITH_")
    );
  }

  const currentEnvironment = resolveFirebaseEnvironment(window.location.hostname);
  const currentConfig = FIREBASE_ENVIRONMENTS[currentEnvironment] || FIREBASE_ENVIRONMENTS[DEFAULT_FIREBASE_ENVIRONMENT];
  const firebaseConfig = {
    ...currentConfig,
    enabled: isFirebaseConfigReady(currentConfig),
  };

  window.TURNO_LISTO_FIREBASE_ENV = currentEnvironment;
  window.TURNO_LISTO_FIREBASE_CONFIG = firebaseConfig;
  window.TURNO_LISTO_FIREBASE_CONFIGS = FIREBASE_ENVIRONMENTS;
  window.TURNO_LISTO_FIREBASE_ENV_HOSTNAMES = FIREBASE_ENVIRONMENT_HOSTNAMES;
})();\n`;
}

export function renderFirebaseConfigForEnvironment(catalog, environmentName) {
  const normalizedEnvironmentName = normalizeValue(environmentName);
  const environment = getFirebaseEnvironment(catalog, normalizedEnvironmentName);
  const serializedConfig = JSON.stringify(toClientConfig(environment), null, 2);

  return `(function initializeTurnoListoFirebaseConfig() {
  const CURRENT_FIREBASE_ENVIRONMENT = ${JSON.stringify(normalizedEnvironmentName)};
  const CURRENT_FIREBASE_CONFIG = Object.freeze(
${indentBlock(serializedConfig, 4)}
  );

  function normalizeValue(value) {
    return String(value || "").trim();
  }

  function isFirebaseConfigReady(config) {
    return Boolean(
      config?.enabled &&
        normalizeValue(config.apiKey) &&
        !normalizeValue(config.apiKey).startsWith("REPLACE_WITH_") &&
        normalizeValue(config.projectId) &&
        normalizeValue(config.messagingSenderId) &&
        !normalizeValue(config.messagingSenderId).startsWith("REPLACE_WITH_") &&
        normalizeValue(config.appId) &&
        !normalizeValue(config.appId).startsWith("REPLACE_WITH_")
    );
  }

  const firebaseConfig = {
    ...CURRENT_FIREBASE_CONFIG,
    enabled: isFirebaseConfigReady(CURRENT_FIREBASE_CONFIG),
  };

  window.TURNO_LISTO_FIREBASE_ENV = CURRENT_FIREBASE_ENVIRONMENT;
  window.TURNO_LISTO_FIREBASE_CONFIG = firebaseConfig;
  window.TURNO_LISTO_FIREBASE_CONFIGS = Object.freeze({
    [CURRENT_FIREBASE_ENVIRONMENT]: CURRENT_FIREBASE_CONFIG,
  });
})();\n`;
}

export function renderFirebaseMessagingServiceWorkerResolver(catalog) {
  const defaultEnvironment = normalizeValue(catalog.defaultEnvironment);
  const environmentHostnames = renderEnvironmentHostnameMap(catalog);
  const environmentsObject = renderEnvironmentConfigMap(catalog);

  return `/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js");

const DEFAULT_FIREBASE_ENVIRONMENT = ${JSON.stringify(defaultEnvironment)};
const FIREBASE_ENVIRONMENT_HOSTNAMES = ${environmentHostnames};
const FIREBASE_ENVIRONMENTS = ${environmentsObject};

function normalizeValue(value) {
  return String(value || "").trim();
}

function resolveFirebaseEnvironment(hostname) {
  const normalizedHostname = normalizeValue(hostname).toLowerCase();
  const matchedEnvironment = Object.entries(FIREBASE_ENVIRONMENT_HOSTNAMES).find(([, hostnames]) =>
    hostnames.includes(normalizedHostname),
  );
  return matchedEnvironment?.[0] || DEFAULT_FIREBASE_ENVIRONMENT;
}

function isFirebaseConfigReady(config) {
  return Boolean(
    config?.enabled &&
      normalizeValue(config.apiKey) &&
      !normalizeValue(config.apiKey).startsWith("REPLACE_WITH_") &&
      normalizeValue(config.projectId) &&
      normalizeValue(config.messagingSenderId) &&
      !normalizeValue(config.messagingSenderId).startsWith("REPLACE_WITH_") &&
      normalizeValue(config.appId) &&
      !normalizeValue(config.appId).startsWith("REPLACE_WITH_")
  );
}

const currentEnvironment = resolveFirebaseEnvironment(self.location.hostname);
const currentConfig = FIREBASE_ENVIRONMENTS[currentEnvironment] || FIREBASE_ENVIRONMENTS[DEFAULT_FIREBASE_ENVIRONMENT];

if (isFirebaseConfigReady(currentConfig)) {
  firebase.initializeApp(currentConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const data = payload?.data || {};

    self.registration.showNotification(data.title || "TurnoListo", {
      body: data.body || "Tu pedido ya está listo para recoger.",
      tag: data.orderId ? \`order-ready-\${data.orderId}\` : "turnolisto-order-ready",
      renotify: true,
      data: {
        link: data.link || self.location.origin,
      },
    });
  });
} else {
  console.warn("Firebase Messaging desactivado: falta configurar el entorno actual.", {
    environment: currentEnvironment,
    hostname: self.location.hostname,
  });
}

self.addEventListener("notificationclick", (event) => {
  const rawTarget = event.notification?.data?.link || "/";
  let targetUrl = self.location.origin;

  try {
    const parsed = new URL(rawTarget, self.location.origin);
    targetUrl = parsed.origin === self.location.origin ? parsed.toString() : self.location.origin;
  } catch {
    targetUrl = self.location.origin;
  }

  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) => client.url === targetUrl);
      if (existingClient) {
        return existingClient.focus();
      }

      return self.clients.openWindow(targetUrl);
    }),
  );
});\n`;
}

export function renderFirebaseMessagingServiceWorkerForEnvironment(catalog, environmentName) {
  const normalizedEnvironmentName = normalizeValue(environmentName);
  const environment = getFirebaseEnvironment(catalog, normalizedEnvironmentName);
  const serializedConfig = JSON.stringify(toClientConfig(environment), null, 2);

  return `/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js");

const CURRENT_FIREBASE_ENVIRONMENT = ${JSON.stringify(normalizedEnvironmentName)};
const CURRENT_FIREBASE_CONFIG = Object.freeze(
${indentBlock(serializedConfig, 2)}
);

function normalizeValue(value) {
  return String(value || "").trim();
}

function isFirebaseConfigReady(config) {
  return Boolean(
    config?.enabled &&
      normalizeValue(config.apiKey) &&
      !normalizeValue(config.apiKey).startsWith("REPLACE_WITH_") &&
      normalizeValue(config.projectId) &&
      normalizeValue(config.messagingSenderId) &&
      !normalizeValue(config.messagingSenderId).startsWith("REPLACE_WITH_") &&
      normalizeValue(config.appId) &&
      !normalizeValue(config.appId).startsWith("REPLACE_WITH_")
  );
}

if (isFirebaseConfigReady(CURRENT_FIREBASE_CONFIG)) {
  firebase.initializeApp(CURRENT_FIREBASE_CONFIG);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const data = payload?.data || {};

    self.registration.showNotification(data.title || "TurnoListo", {
      body: data.body || "Tu pedido ya está listo para recoger.",
      tag: data.orderId ? \`order-ready-\${data.orderId}\` : "turnolisto-order-ready",
      renotify: true,
      data: {
        link: data.link || self.location.origin,
      },
    });
  });
} else {
  console.warn("Firebase Messaging desactivado: falta configurar el entorno actual.", {
    environment: CURRENT_FIREBASE_ENVIRONMENT,
    hostname: self.location.hostname,
  });
}

self.addEventListener("notificationclick", (event) => {
  const rawTarget = event.notification?.data?.link || "/";
  let targetUrl = self.location.origin;

  try {
    const parsed = new URL(rawTarget, self.location.origin);
    targetUrl = parsed.origin === self.location.origin ? parsed.toString() : self.location.origin;
  } catch {
    targetUrl = self.location.origin;
  }

  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) => client.url === targetUrl);
      if (existingClient) {
        return existingClient.focus();
      }

      return self.clients.openWindow(targetUrl);
    }),
  );
});\n`;
}
