import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = window.TURNO_LISTO_FIREBASE_CONFIG || {};

function hasFirebaseConfig(config) {
  return Boolean(config?.enabled && config?.apiKey && config?.projectId && config?.appId);
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

window.__turnoFirebaseReadyPromise = (async () => {
  if (!hasFirebaseConfig(firebaseConfig)) {
    return { enabled: false, reason: "missing-config" };
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return {
    enabled: true,
    async loadCollection(collectionName) {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map((snapshotDoc) => ({
        ...snapshotDoc.data(),
        id: snapshotDoc.id,
      }));
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
    subscribeCollection(collectionName, callback) {
      return onSnapshot(collection(db, collectionName), (snapshot) => {
        callback(
          snapshot.docs.map((snapshotDoc) => ({
            ...snapshotDoc.data(),
            id: snapshotDoc.id,
          })),
        );
      });
    },
  };
})().catch((error) => {
  console.error("Firebase no pudo inicializarse.", error);
  return { enabled: false, error };
});
