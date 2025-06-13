import "server-only";

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

function initializeAdminApp(): App | null {
  // Don't initialize during build time
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
    console.log("[Firebase Admin] Skipping initialization during build");
    return null;
  }

  const apps = getApps();
  if (apps.length > 0) {
    console.log("[Firebase Admin] Using existing app:", apps[0].name);
    return apps[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyEnv = process.env.FIREBASE_PRIVATE_KEY;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKeyEnv || !storageBucket) {
    console.warn("[Firebase Admin] Missing environment variables, skipping initialization");
    return null;
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
    return null;
  }
}

const firebaseAdminApp: App | null = initializeAdminApp();

export function adminDb(): Firestore {
  if (!firebaseAdminApp) {
    throw new Error("Firebase Admin not initialized");
  }
  return getFirestore(firebaseAdminApp);
}

export function adminAuth(): Auth {
  if (!firebaseAdminApp) {
    throw new Error("Firebase Admin not initialized");
  }
  return getAuth(firebaseAdminApp);
}

export function adminStorage(): Storage {
  if (!firebaseAdminApp) {
    throw new Error("Firebase Admin not initialized");
  }
  return getStorage(firebaseAdminApp);
}
