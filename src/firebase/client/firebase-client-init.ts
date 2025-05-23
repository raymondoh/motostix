// // src/firebase/client/firebase-client-init.ts
// "use client";

// import { initializeApp, getApps } from "firebase/app";
// import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

// // Initialize client app if it doesn't exist
// export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // Auth providers
// export const googleProvider = new GoogleAuthProvider();
// export const githubProvider = new GithubAuthProvider();
"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize client app if it doesn't exist
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// RecaptchaVerifier for 2FA
let recaptchaVerifier: RecaptchaVerifier | null = null;

// Initialize recaptchaVerifier lazily
export const getRecaptchaVerifier = () => {
  if (typeof window !== "undefined" && !recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "normal",
      callback: () => {
        // reCAPTCHA solved, allow the user to continue
      },
      "expired-callback": () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        console.log("reCAPTCHA expired. Please solve it again.");
      }
    });
  }
  return recaptchaVerifier;
};

// Reset recaptchaVerifier (useful when you need to render a new one)
export const resetRecaptchaVerifier = () => {
  recaptchaVerifier = null;
};
