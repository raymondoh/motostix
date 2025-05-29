// import "server-only";
// // src/firebase/admin/firebase-admin-init.ts
// import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
// import { getAuth, type Auth } from "firebase-admin/auth";
// import { getFirestore, type Firestore } from "firebase-admin/firestore";
// import { getStorage, type Storage } from "firebase-admin/storage";

// const safeLog = (label: string, value: string | undefined, length = 70): void => {
//   if (!value) {
//     console.log(`${label}: [UNDEFINED/NULL]`);
//     return;
//   }
//   const truncated = value.length > length ? `${value.substring(0, length)}...` : value;
//   console.log(`${label}: ${truncated}`);
// };

// function initializeAdminApp(): App {
//   console.log("[FB Admin Init Func] Attempting to initialize admin app...");
//   const apps = getApps();
//   if (apps.length > 0) {
//     console.log("[FB Admin Init Func] Admin app already initialized. Returning existing app:", apps[0].name);
//     return apps[0];
//   }

//   const projectId = process.env.FIREBASE_PROJECT_ID!;
//   const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
//   const privateKeyEnv = process.env.FIREBASE_PRIVATE_KEY!;
//   const storageBucket = process.env.FIREBASE_STORAGE_BUCKET!;

//   // Ensure all required env vars are present before proceeding
//   if (!projectId || !clientEmail || !privateKeyEnv || !storageBucket) {
//     console.error(
//       "[FB Admin Init Func] CRITICAL FAILURE: One or more required Firebase environment variables are missing."
//     );
//     const missing = [
//       !projectId && "FIREBASE_PROJECT_ID",
//       !clientEmail && "FIREBASE_CLIENT_EMAIL",
//       !privateKeyEnv && "FIREBASE_PRIVATE_KEY",
//       !storageBucket && "FIREBASE_STORAGE_BUCKET"
//     ]
//       .filter(Boolean)
//       .join(", ");
//     throw new Error(`Missing Firebase Admin credentials: ${missing}`);
//   }

//   safeLog("[FB Admin Init Func] Raw FIREBASE_PRIVATE_KEY from env", privateKeyEnv, 100);
//   const formattedPrivateKey = privateKeyEnv.replace(/\\n/g, "\n");
//   safeLog("[FB Admin Init Func] Formatted privateKey for SDK", formattedPrivateKey, 100);

//   const credentialConfig = {
//     projectId: projectId,
//     clientEmail: clientEmail,
//     privateKey: formattedPrivateKey
//   };

//   try {
//     console.log("[FB Admin Init Func] Calling initializeApp with cert()...");
//     const appInstance = initializeApp({
//       credential: cert(credentialConfig),
//       storageBucket: storageBucket
//     });
//     console.log(`[FB Admin Init Func] Firebase Admin SDK initialized successfully. App name: ${appInstance.name}`);
//     return appInstance;
//   } catch (error: any) {
//     console.error("[FB Admin Init Func] CRITICAL FAILURE: Error during initializeApp call:", error.message);
//     console.error("[FB Admin Init Func] Full error object during initializeApp:", error);
//     throw error;
//   }
// }

// console.log("[FB Admin Init Module] Top-level: Initializing firebaseAdminApp constant...");
// const firebaseAdminApp: App = initializeAdminApp();

// // Log the firebaseAdminApp object itself to see its structure
// console.log("[FB Admin Init Module] Inspecting firebaseAdminApp object structure:", firebaseAdminApp);
// if (firebaseAdminApp && firebaseAdminApp.name && typeof firebaseAdminApp.options === "object") {
//   console.log(
//     `[FB Admin Init Module] firebaseAdminApp instance appears VALID. Name: ${firebaseAdminApp.name}, Options:`,
//     firebaseAdminApp.options
//   );
// } else {
//   console.error(
//     "[FB Admin Init Module] CRITICAL: firebaseAdminApp instance is NULL, has no name, or no options AFTER initializeAdminApp() call!"
//   );
// }

// // --- LAZY SERVICE GETTERS (This is the key fix!) ---
// let _adminDb: Firestore | null = null;
// let _adminAuth: Auth | null = null;
// let _adminStorage: Storage | null = null;

// // Inside firebase-admin-init.ts

// export function adminDb(): Firestore {
//   if (!_adminDb) {
//     try {
//       console.log("[FB Admin Init Module] Lazy-initializing Firestore...");
//       _adminDb = getFirestore(firebaseAdminApp);

//       // CORRECTED VALIDATION for Firestore:
//       if (_adminDb && typeof _adminDb.collection === "function") {
//         console.log(
//           "[FB Admin Init Module] Firestore service lazy-initialized successfully and appears VALID (has .collection method)."
//         );
//       } else {
//         console.error(
//           "[FB Admin Init Module] CRITICAL for Firestore: Lazy-initialized _adminDb is NULL or not a valid Firestore client object (missing .collection method)!"
//         );
//         // If this error occurs, _adminDb did not initialize correctly from getFirestore().
//         // You might want to throw an error here to prevent further execution with a bad db client.
//         // For example: throw new Error("Failed to initialize a functional Firestore client.");
//       }
//     } catch (e: any) {
//       console.error("[FB Admin Init Module] ERROR during lazy getFirestore() call:", e.message, e);
//       throw e; // Re-throw to make the failure visible
//     }
//   }
//   if (!_adminDb) {
//     // This check is good for ensuring _adminDb was actually assigned
//     console.error("[FB Admin Init Module] Returning NULL _adminDb after initialization attempt!");
//     throw new Error("Firestore service could not be initialized and is null.");
//   }
//   return _adminDb;
// }

// // Similarly for adminAuth, checking its specific methods is more robust than .app.name
// export function adminAuth(): Auth {
//   if (!_adminAuth) {
//     try {
//       console.log("[FB Admin Init Module] Lazy-initializing Auth...");
//       _adminAuth = getAuth(firebaseAdminApp);
//       // CORRECTED VALIDATION for Auth:
//       if (_adminAuth && typeof _adminAuth.getUser === "function") {
//         console.log(
//           "[FB Admin Init Module] Auth service lazy-initialized successfully and appears VALID (has .getUser method)."
//         );
//         // Optionally, log the app reference if you know its structure (e.g., _adminAuth.app_ )
//         // const authApp = (_adminAuth as any).app || (_adminAuth as any).app_;
//         // if (authApp && authApp.name) {
//         //   console.log(`[FB Admin Init Module] Auth service linked to app: ${authApp.name}`);
//         // }
//       } else {
//         console.error(
//           "[FB Admin Init Module] CRITICAL for Auth: Lazy-initialized _adminAuth is NULL or not a valid Auth client object (missing .getUser method)!"
//         );
//       }
//     } catch (e: any) {
//       /* ... */ throw e;
//     }
//   }
//   if (!_adminAuth) {
//     throw new Error("Auth service could not be initialized.");
//   }
//   return _adminAuth;
// }

// // And for adminStorage
// export function adminStorage(): Storage {
//   if (!_adminStorage) {
//     try {
//       console.log("[FB Admin Init Module] Lazy-initializing Storage...");
//       _adminStorage = getStorage(firebaseAdminApp);
//       // CORRECTED VALIDATION for Storage:
//       if (_adminStorage && typeof _adminStorage.bucket === "function") {
//         console.log(
//           "[FB Admin Init Module] Storage service lazy-initialized successfully and appears VALID (has .bucket method)."
//         );
//       } else {
//         console.error(
//           "[FB Admin Init Module] CRITICAL for Storage: Lazy-initialized _adminStorage is NULL or not a valid Storage client object (missing .bucket method)!"
//         );
//       }
//     } catch (e: any) {
//       /* ... */ throw e;
//     }
//   }
//   if (!_adminStorage) {
//     throw new Error("Storage service could not be initialized.");
//   }
//   return _adminStorage;
// }

// console.log("[FB Admin Init Module] Exports (adminAuth, adminDb, adminStorage) functions are now defined.");

// // Global ProcessEnv type definition
// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       FIREBASE_PROJECT_ID: string;
//       FIREBASE_CLIENT_EMAIL: string;
//       FIREBASE_PRIVATE_KEY: string;
//       FIREBASE_STORAGE_BUCKET: string;
//     }
//   }
// }
import "server-only";
// src/firebase/admin/firebase-admin-init.ts
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
