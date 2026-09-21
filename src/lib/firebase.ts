import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import config from "../../firebase-applet-config.json";

export const app = initializeApp(config);
export const auth = getAuth(app);

let firestoreInstance: Firestore;

try {
  // Enable full multi-tab offline persistence
  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    config.firestoreDatabaseId
  );
} catch (e) {
  // If already initialized or if IndexedDB isn't available, fallback to getFirestore
  firestoreInstance = getFirestore(app, config.firestoreDatabaseId);
}

export const db = firestoreInstance;
export const storage = getStorage(app);
