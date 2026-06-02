/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js");

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

if (isFirebaseConfigReady(CURRENT_FIREBASE_CONFIG)) {
  firebase.initializeApp(CURRENT_FIREBASE_CONFIG);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const data = payload?.data || {};

    self.registration.showNotification(data.title || "TurnoListo", {
      body: data.body || "Tu pedido ya está listo para recoger.",
      tag: data.orderId ? `order-ready-${data.orderId}` : "turnolisto-order-ready",
      renotify: true,
      vibrate: [360, 180, 360, 180, 520],
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

function buildScopedClientLaunchUrl(orderId) {
  const scopedUrl = new URL("./client-launch.html", self.registration.scope || self.location.origin);
  if (orderId) {
    scopedUrl.hash = `order=${encodeURIComponent(orderId)}`;
  }
  return scopedUrl.toString();
}

function resolveNotificationTargetUrl(rawTarget) {
  const fallbackUrl = new URL("./client-launch.html", self.registration.scope || self.location.origin).toString();
  try {
    const parsed = new URL(rawTarget || fallbackUrl, self.location.origin);
    if (parsed.origin !== self.location.origin) return fallbackUrl;

    const orderId = parsed.searchParams.get("order") || parsed.hash.replace(/^#?order=/, "");
    const scopePath = new URL(self.registration.scope || self.location.origin).pathname;
    const opensRootClientFromScopedWorker = scopePath !== "/" && parsed.pathname === "/client.html";
    if (opensRootClientFromScopedWorker || parsed.pathname.endsWith("/client.html")) {
      return buildScopedClientLaunchUrl(orderId);
    }

    return parsed.toString();
  } catch {
    return fallbackUrl;
  }
}

self.addEventListener("notificationclick", (event) => {
  const targetUrl = resolveNotificationTargetUrl(event.notification?.data?.link || "/");

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
});
