(function initializeTurnoListoFirebaseConfig() {
  const DEFAULT_FIREBASE_ENVIRONMENT = "develop";
  const FIREBASE_ENVIRONMENT_HOSTNAMES = Object.freeze({
  "develop": Object.freeze(
    [
      "localhost",
      "127.0.0.1",
      "turnolisto-dev.web.app",
      "turnolisto-f62c1.web.app",
      "turnolisto-f62c1.firebaseapp.com"
    ]
  ),
  "production": Object.freeze(
    [
      "turnolisto.com",
      "www.turnolisto.com",
      "turnolisto-prod.web.app",
      "turnolisto-prod.firebaseapp.com"
    ]
  )
});
  const FIREBASE_ENVIRONMENTS = Object.freeze({
  "develop": Object.freeze(
    {
      "enabled": true,
      "apiKey": "AIzaSyAW4kktrmhKD6aWjXl3fCdZBX1Hbh7RKV4",
      "authDomain": "turnolisto-f62c1.firebaseapp.com",
      "projectId": "turnolisto-f62c1",
      "storageBucket": "turnolisto-f62c1.firebasestorage.app",
      "messagingSenderId": "647535131187",
      "appId": "1:647535131187:web:ba3bbb0cca0dc7edec0146",
      "messagingVapidKey": "BL3e7P9qvy_qmQLpBI_6nu7CZUO2y3s_L8JYPuBAgL0ZyWOR8xB3b4y4cu98d4ticgQDS3HmGzUQCqPh1mdnCcQ"
    }
  ),
  "production": Object.freeze(
    {
      "enabled": true,
      "apiKey": "AIzaSyAwMqqUAWuOTi5Fn51oVZKhZilmGmyJLDI",
      "authDomain": "turnolisto-prod.firebaseapp.com",
      "projectId": "turnolisto-prod",
      "storageBucket": "turnolisto-prod.firebasestorage.app",
      "messagingSenderId": "968962346504",
      "appId": "1:968962346504:web:ca7027eb495e75a8e40bbd",
      "messagingVapidKey": "REPLACE_WITH_PRODUCTION_VAPID_KEY"
    }
  )
});

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
})();
