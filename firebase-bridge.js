import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-functions.js";
import { getMessaging, getToken, isSupported as isMessagingSupported } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging.js";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = window.TURNO_LISTO_FIREBASE_CONFIG || {};

function hasFirebaseConfig(config) {
  return Boolean(config?.enabled && config?.apiKey && config?.projectId && config?.appId);
}

function getFirebaseRoleScope() {
  return String(window.TURNO_LISTO_PRIVATE_ROLE || document.body?.dataset?.privateRole || "").trim() || "public";
}

function getFirebaseAppInstance(config) {
  const appName = `turnolisto-${getFirebaseRoleScope()}`;
  return getApps().some((app) => app.name === appName) ? getApp(appName) : initializeApp(config, appName);
}

function getPreferredAuthPersistence() {
  const requiredRole = String(window.TURNO_LISTO_PRIVATE_ROLE || "").trim();
  return requiredRole ? browserSessionPersistence : browserLocalPersistence;
}

function resolveAuthPersistence(options = {}) {
  const requestedPersistence = String(options?.persistence || "").trim();
  if (requestedPersistence === "local") {
    return browserLocalPersistence;
  }
  if (requestedPersistence === "session") {
    return browserSessionPersistence;
  }
  return getPreferredAuthPersistence();
}

function sanitizeForFirestore(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([entryKey, entryValue]) => [entryKey, sanitizeForFirestore(entryValue)]),
    );
  }

  return value;
}

function notifyFirebaseBridgeError(error, fallbackMessage) {
  if (typeof window.showTurnoAlert === "function") {
    const code = error?.code || "";
    let message = fallbackMessage;

    if (code === "permission-denied") {
      message = "Acceso denegado por Firestore. Revisa permisos, roles o reglas publicadas.";
    } else if (code === "auth/unauthorized-domain") {
      message = "Este dominio no esta autorizado en Firebase Authentication.";
    }

    window.showTurnoAlert(message, "error");
  }
}

function isIosBrowserWithoutStandaloneSupport() {
  const userAgent = String(window.navigator?.userAgent || "");
  const isIosDevice = /iPhone|iPad|iPod/i.test(userAgent);
  if (!isIosDevice) return false;

  const standaloneMatch = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const navigatorStandalone = window.navigator?.standalone === true;
  return !standaloneMatch && !navigatorStandalone;
}

async function withTimeout(promise, timeoutMs, timeoutReason) {
  let timeoutId = 0;
  try {
    return await Promise.race([
      promise,
      new Promise((resolve) => {
        timeoutId = window.setTimeout(() => {
          resolve({ enabled: false, reason: timeoutReason });
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
}

async function replaceCollection(db, collectionName, items) {
  const snapshot = await getDocs(collection(db, collectionName));
  const docsToDelete = snapshot.docs.filter((snapshotDoc) => !items.some((item) => String(item.id) === snapshotDoc.id));

  const operations = [
    ...items.map((item) => ({ type: "set", id: String(item.id), data: sanitizeForFirestore(item) })),
    ...docsToDelete.map((snapshotDoc) => ({ type: "delete", id: snapshotDoc.id })),
  ];

  while (operations.length) {
    const batch = writeBatch(db);
    operations.splice(0, 450).forEach((operation) => {
      const documentRef = doc(db, collectionName, operation.id);
      if (operation.type === "delete") {
        batch.delete(documentRef);
        return;
      }

      batch.set(documentRef, operation.data);
    });
    await batch.commit();
  }
}

function buildCollectionReference(db, collectionName, filters = []) {
  const normalizedFilters = Array.isArray(filters) ? filters.filter(Boolean) : [];
  if (!normalizedFilters.length) {
    return collection(db, collectionName);
  }

  return query(
    collection(db, collectionName),
    ...normalizedFilters.map((filter) => where(filter.field, filter.op || "==", filter.value)),
  );
}

window.__turnoFirebaseReadyPromise = (async () => {
  if (!hasFirebaseConfig(firebaseConfig)) {
    console.warn("Firebase desactivado o incompleto.", {
      enabled: firebaseConfig?.enabled,
      hasApiKey: Boolean(firebaseConfig?.apiKey),
      hasProjectId: Boolean(firebaseConfig?.projectId),
      hasAppId: Boolean(firebaseConfig?.appId),
    });
    return { enabled: false, reason: "missing-config" };
  }

  const app = getFirebaseAppInstance(firebaseConfig);
  let auth;
  try {
    auth = initializeAuth(app, {
      persistence: getPreferredAuthPersistence(),
    });
  } catch {
    auth = getAuth(app);
  }
  const functions = getFunctions(app);
  const db = getFirestore(app);
  const messagingSupported = await isMessagingSupported().catch(() => false);
  const messaging = messagingSupported ? getMessaging(app) : null;
  const initialAuthState = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
  console.info("Firebase inicializado correctamente.", {
    projectId: firebaseConfig.projectId,
    origin: window.location.origin,
    protocol: window.location.protocol,
    authenticated: Boolean(initialAuthState),
  });

  return {
    enabled: true,
    isAuthenticated() {
      return Boolean(auth.currentUser);
    },
    getCurrentUser() {
      return auth.currentUser;
    },
    async signIn(username, password, options = {}) {
      const persistence = resolveAuthPersistence(options);
      await setPersistence(auth, persistence);
      return signInWithEmailAndPassword(auth, String(username || "").trim(), String(password || ""));
    },
    async signOut() {
      await signOut(auth);
    },
    onAuthStateChanged(callback) {
      return onAuthStateChanged(auth, callback);
    },
    async createRestaurantAccount(accountData) {
      const callable = httpsCallable(functions, "createRestaurantAccount");
      const result = await callable(accountData);
      return result.data;
    },
    async createRestaurantAccessLink(payload) {
      const callable = httpsCallable(functions, "createRestaurantAccessLink");
      const result = await callable(payload);
      return result.data;
    },
    async updateCurrentAdminProfile(payload) {
      const callable = httpsCallable(functions, "updateCurrentAdminProfile");
      const result = await callable(payload);
      return result.data;
    },
    async completeCurrentAdminInitialAccess() {
      const callable = httpsCallable(functions, "completeCurrentAdminInitialAccess");
      const result = await callable({});
      return result.data;
    },
    async createAdminAccount(payload) {
      const callable = httpsCallable(functions, "createAdminAccount");
      const result = await callable(payload);
      return result.data;
    },
    async createAdminAccessLink(payload) {
      const callable = httpsCallable(functions, "createAdminAccessLink");
      const result = await callable(payload);
      return result.data;
    },
    async submitContactInquiry(payload) {
      const callable = httpsCallable(functions, "submitContactInquiry");
      const result = await callable(payload);
      return result.data;
    },
    async loadPublicTrackingOrder(publicId) {
      const callable = httpsCallable(functions, "getPublicTrackingOrder");
      const result = await callable({ publicId });
      return result.data?.tracking || null;
    },
    async submitPublicTrackingRating(payload) {
      const callable = httpsCallable(functions, "submitPublicTrackingRating");
      const result = await callable(payload);
      return result.data?.tracking || null;
    },
    async enableClientPushNotifications(subscriptionData) {
      if (!messagingSupported || !messaging || !("Notification" in window) || !("serviceWorker" in navigator)) {
        return { enabled: false, reason: "unsupported" };
      }

      if (isIosBrowserWithoutStandaloneSupport()) {
        return { enabled: false, reason: "unsupported-ios-browser" };
      }

      const vapidKey = String(firebaseConfig.messagingVapidKey || "").trim();
      if (!vapidKey || vapidKey.startsWith("REPLACE_WITH_")) {
        return { enabled: false, reason: "missing-vapid-key" };
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return { enabled: false, reason: permission === "denied" ? "permission-denied" : "permission-dismissed" };
      }

      const serviceWorkerRegistration = await withTimeout(
        navigator.serviceWorker.register("./firebase-messaging-sw.js"),
        7000,
        "service-worker-timeout",
      );
      if (!serviceWorkerRegistration?.active && serviceWorkerRegistration?.enabled === false) {
        return serviceWorkerRegistration;
      }

      await withTimeout(
        navigator.serviceWorker.ready.catch(() => serviceWorkerRegistration),
        7000,
        "service-worker-timeout",
      );
      const token = await withTimeout(
        getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration,
        }),
        9000,
        "token-timeout",
      );

      if (!token) {
        return { enabled: false, reason: "missing-token" };
      }
      if (typeof token === "object" && token?.enabled === false) {
        return token;
      }

      const callable = httpsCallable(functions, "registerClientPushSubscription");
      await callable({
        ...subscriptionData,
        token,
      });

      return {
        enabled: true,
        token,
        permission,
      };
    },
    async disableClientPushNotifications(token) {
      const normalizedToken = String(token || "").trim();
      if (!normalizedToken) return { disabled: false, reason: "missing-token" };

      const callable = httpsCallable(functions, "unregisterClientPushSubscription");
      await callable({ token: normalizedToken });
      return { disabled: true };
    },
    async loadCollection(collectionName, options = {}) {
      const snapshot = await getDocs(buildCollectionReference(db, collectionName, options.filters));
      return snapshot.docs.map((snapshotDoc) => ({
        ...snapshotDoc.data(),
        id: snapshotDoc.id,
      }));
    },
    async getDocument(collectionName, id) {
      const snapshot = await getDoc(doc(db, collectionName, String(id)));
      if (!snapshot.exists()) return null;
      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
    },
    async replaceCollection(collectionName, items) {
      await replaceCollection(db, collectionName, items);
    },
    async setDocument(collectionName, id, data) {
      await setDoc(doc(db, collectionName, String(id)), sanitizeForFirestore(data));
    },
    async deleteDocument(collectionName, id) {
      await deleteDoc(doc(db, collectionName, String(id)));
    },
    subscribeCollection(collectionName, callback, options = {}) {
      return onSnapshot(
        buildCollectionReference(db, collectionName, options.filters),
        (snapshot) => {
          callback(
            snapshot.docs.map((snapshotDoc) => ({
              ...snapshotDoc.data(),
              id: snapshotDoc.id,
            })),
          );
        },
        (error) => {
          console.error(`No se pudo escuchar la coleccion ${collectionName}.`, error);
          notifyFirebaseBridgeError(error, `No se pudo escuchar la coleccion ${collectionName}.`);
        },
      );
    },
  };
})().catch((error) => {
  console.error("Firebase no pudo inicializarse.", error);
  notifyFirebaseBridgeError(error, "Firebase no pudo inicializarse.");
  return { enabled: false, error };
});
