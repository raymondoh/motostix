// src/firebase/admin/firebase-admin-init.ts
import "server-only";

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    console.log("[Firebase Admin] Using existing app:", apps[0].name);
    return apps[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
  const privateKeyEnv = process.env.FIREBASE_PRIVATE_KEY!;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET!;

  // Ensure all required env vars are present
  if (!projectId || !clientEmail || !privateKeyEnv || !storageBucket) {
    const missing = [
      !projectId && "FIREBASE_PROJECT_ID",
      !clientEmail && "FIREBASE_CLIENT_EMAIL",
      !privateKeyEnv && "FIREBASE_PRIVATE_KEY",
      !storageBucket && "FIREBASE_STORAGE_BUCKET"
    ]
      .filter(Boolean)
      .join(", ");
    throw new Error(`Missing Firebase Admin credentials: ${missing}`);
  }

  const formattedPrivateKey = privateKeyEnv.replace(/\\n/g, "\n");

  try {
    const appInstance = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey
      }),
      storageBucket
    });
    console.log(`[Firebase Admin] Initialized successfully: ${appInstance.name}`);
    return appInstance;
  } catch (error: any) {
    console.error("[Firebase Admin] Initialization failed:", error.message);
    throw error;
  }
}

const firebaseAdminApp: App = initializeAdminApp();

// Lazy service getters
let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;
let _adminStorage: Storage | null = null;

export function adminDb(): Firestore {
  if (!_adminDb) {
    try {
      _adminDb = getFirestore(firebaseAdminApp);

      if (!_adminDb || typeof _adminDb.collection !== "function") {
        throw new Error("Failed to initialize Firestore service");
      }
    } catch (error: any) {
      console.error("[Firebase Admin] Firestore initialization failed:", error.message);
      throw error;
    }
  }
  return _adminDb;
}

export function adminAuth(): Auth {
  if (!_adminAuth) {
    try {
      _adminAuth = getAuth(firebaseAdminApp);

      if (!_adminAuth || typeof _adminAuth.getUser !== "function") {
        throw new Error("Failed to initialize Auth service");
      }
    } catch (error: any) {
      console.error("[Firebase Admin] Auth initialization failed:", error.message);
      throw error;
    }
  }
  return _adminAuth;
}

export function adminStorage(): Storage {
  if (!_adminStorage) {
    try {
      _adminStorage = getStorage(firebaseAdminApp);

      if (!_adminStorage || typeof _adminStorage.bucket !== "function") {
        throw new Error("Failed to initialize Storage service");
      }
    } catch (error: any) {
      console.error("[Firebase Admin] Storage initialization failed:", error.message);
      throw error;
    }
  }
  return _adminStorage;
}

// Global ProcessEnv type definition
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_PROJECT_ID: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_STORAGE_BUCKET: string;
    }
  }
}
