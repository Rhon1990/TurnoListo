(function initializeTurnoListoFirebaseConfig() {
  const CURRENT_FIREBASE_ENVIRONMENT = "production";
  const CURRENT_FIREBASE_CONFIG = Object.freeze(
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
})();
