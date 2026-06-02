(function initializeTurnoListoFirebaseConfig() {
  const CURRENT_FIREBASE_ENVIRONMENT = "develop";
  const CURRENT_FIREBASE_CONFIG = Object.freeze(
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
