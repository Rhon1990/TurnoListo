/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAW4kktrmhKD6aWjXl3fCdZBX1Hbh7RKV4",
  authDomain: "turnolisto-f62c1.firebaseapp.com",
  projectId: "turnolisto-f62c1",
  storageBucket: "turnolisto-f62c1.firebasestorage.app",
  messagingSenderId: "647535131187",
  appId: "1:647535131187:web:ba3bbb0cca0dc7edec0146",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload?.data || {};

  self.registration.showNotification(data.title || "TurnoListo", {
    body: data.body || "Tu pedido ya está listo para recoger.",
    tag: data.orderId ? `order-ready-${data.orderId}` : "turnolisto-order-ready",
    renotify: true,
    data: {
      link: data.link || self.location.origin,
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  const targetUrl = event.notification?.data?.link || self.location.origin;
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
