// ===============================
// 📂 src/lib/firebase/admin/auth.ts
// ===============================

import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin/initialize";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";

// Get current user safely
export async function getCurrentUser() {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();
    return session?.user || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const db = getAdminFirestore();
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    return userData?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const auth = getAdminAuth();
    const userRecord = await auth.getUserByEmail(email);
    return { success: true, data: userRecord };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error getting user by email";
    return { success: false, error: message };
  }
}

// Legacy compatibility exports
export const adminAuth = getAdminAuth;
export const adminDb = getAdminFirestore;
