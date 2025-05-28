// import "server-only";
// // src/firebase/admin/firebase-admin-init.ts
// // Note: No "use server" directive here
// import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
// import { getFirestore } from "firebase-admin/firestore";
// import { getStorage } from "firebase-admin/storage";

// function initializeAdminApp(): App {
//   const apps = getApps();
//   if (apps.length > 0) {
//     return apps[0];
//   }

//   const privateKey = process.env.FIREBASE_PRIVATE_KEY;
//   if (!privateKey) {
//     throw new Error("FIREBASE_PRIVATE_KEY is not set in the environment variables");
//   }
//   //console.log(process.env.FIREBASE_PRIVATE_KEY);

//   return initializeApp({
//     credential: cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: privateKey.replace(/\\n/g, "\n")
//     }),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET
//   });
// }

// const firebaseAdmin = initializeAdminApp();

// export const adminAuth = getAuth(firebaseAdmin);
// export const adminDb = getFirestore(firebaseAdmin);
// export const adminStorage = getStorage(firebaseAdmin);
// // This is good, keep it as is
// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       FIREBASE_PROJECT_ID: string;
//       FIREBASE_CLIENT_EMAIL: string;
//       FIREBASE_PRIVATE_KEY: string;
//     }
//   }
// }
import "server-only";
// src/firebase/admin/firebase-admin-init.ts
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Helper function to safely log parts of potentially sensitive strings
const safeLog = (label: string, value: string | undefined, length: number = 70): void => {
  if (value) {
    // For private key, we might want to be even more careful or just confirm its structure
    if (label.includes("PRIVATE_KEY") && value.length > length) {
      console.log(
        `${label} (exists, first ${length} chars): ${value.substring(0, length)}... [ENDS WITH] ...${value.substring(
          value.length - length / 2
        )}`
      );
    } else if (value.length > length) {
      console.log(`${label} (exists, first ${length} chars): ${value.substring(0, length)}...`);
    } else {
      console.log(`${label} (exists): ${value}`);
    }
  } else {
    console.log(`${label}: NOT SET or empty`);
  }
};

function initializeAdminApp(): App {
  console.log("[FB Admin Init] Attempting to initialize admin app...");
  const apps = getApps();
  if (apps.length > 0) {
    console.log("[FB Admin Init] Admin app already initialized. Returning existing app.");
    return apps[0];
  }

  console.log("[FB Admin Init] Checking environment variables...");
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyEnv = process.env.FIREBASE_PRIVATE_KEY; // This is the one that Vercel logs showed
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  safeLog("[FB Admin Init] Value for FIREBASE_PROJECT_ID", projectId);
  safeLog("[FB Admin Init] Value for FIREBASE_CLIENT_EMAIL", clientEmail);
  safeLog("[FB Admin Init] Value for FIREBASE_STORAGE_BUCKET", storageBucket);

  if (!privateKeyEnv) {
    console.error("[FB Admin Init] CRITICAL FAILURE: FIREBASE_PRIVATE_KEY is not set in the environment variables.");
    throw new Error(
      "FIREBASE_PRIVATE_KEY is not set in the environment variables. This is a fatal error for Firebase Admin initialization."
    );
  }
  // Log a portion of the raw private key as it comes from the environment
  safeLog("[FB Admin Init] Raw FIREBASE_PRIVATE_KEY from env", privateKeyEnv, 100); // Log more to see structure

  if (!projectId) {
    console.error("[FB Admin Init] CRITICAL FAILURE: FIREBASE_PROJECT_ID is not set.");
    throw new Error("FIREBASE_PROJECT_ID is not set. This is a fatal error for Firebase Admin initialization.");
  }
  if (!clientEmail) {
    console.error("[FB Admin Init] CRITICAL FAILURE: FIREBASE_CLIENT_EMAIL is not set.");
    throw new Error("FIREBASE_CLIENT_EMAIL is not set. This is a fatal error for Firebase Admin initialization.");
  }
  if (!storageBucket) {
    // Depending on usage, this might not be critical for all Firebase services but is for storage.
    // Your code uses getStorage(), so it IS critical.
    console.error(
      "[FB Admin Init] CRITICAL FAILURE: FIREBASE_STORAGE_BUCKET is not set. Storage operations will fail."
    );
    throw new Error("FIREBASE_STORAGE_BUCKET is not set. This is a fatal error as adminStorage is initialized.");
  }

  // This line is crucial: it replaces literal '\\n' strings with actual newline characters.
  const formattedPrivateKey = privateKeyEnv.replace(/\\n/g, "\n");
  console.log("[FB Admin Init] Private key after .replace(/\\\\n/g, '\\n'):");
  // Log a portion of the formatted private key to see the effect of replace
  safeLog("[FB Admin Init] Formatted privateKey for SDK", formattedPrivateKey, 100);

  const credentialConfig = {
    projectId: projectId,
    clientEmail: clientEmail,
    privateKey: formattedPrivateKey // Use the processed key
  };

  try {
    console.log("[FB Admin Init] Calling initializeApp with cert()...");
    console.log("[FB Admin Init] Using Project ID:", credentialConfig.projectId);
    console.log("[FB Admin Init] Using Client Email:", credentialConfig.clientEmail);
    // Avoid logging the full formattedPrivateKey again here if it's too verbose or a security concern in logs,
    // but confirm it's being passed.
    console.log(
      "[FB Admin Init] Private key (structure check for SDK): First 30 chars: '",
      formattedPrivateKey.substring(0, 30),
      "', Last 20 chars: '",
      formattedPrivateKey.substring(formattedPrivateKey.length - 20),
      "'"
    );

    const app = initializeApp({
      credential: cert(credentialConfig),
      storageBucket: storageBucket
    });
    console.log("[FB Admin Init] Firebase Admin SDK initialized successfully. App name:", app.name);
    return app;
  } catch (error: any) {
    console.error("[FB Admin Init] CRITICAL FAILURE: Error during initializeApp call:", error.message);
    console.error("[FB Admin Init] Full error object during initializeApp:", error);
    console.error("[FB Admin Init] Credentials attempted (excluding private key for safety in this detailed log):", {
      projectId: projectId,
      clientEmail: clientEmail,
      storageBucket: storageBucket,
      privateKeyHint:
        "Private key was processed via .replace(/\\\\n/g, '\\n') before being passed to cert(). Ensure the original FIREBASE_PRIVATE_KEY in Vercel has newlines correctly formatted (either actual newlines or as '\\\\n' strings)."
    });
    throw error; // Re-throw the error to ensure failure is propagated
  }
}

const firebaseAdmin = initializeAdminApp(); // Initialize on import

// Export the initialized services
export const adminAuth = getAuth(firebaseAdmin);
export const adminDb = getFirestore(firebaseAdmin);
export const adminStorage = getStorage(firebaseAdmin);

// This TypeScript declaration helps ensure you remember to set these in your .env or Vercel
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_PROJECT_ID: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_STORAGE_BUCKET: string; // Made it non-optional as your code uses it
    }
  }
}
