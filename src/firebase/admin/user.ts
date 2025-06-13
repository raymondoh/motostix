// src/firebase/admin/user.ts
import { getAdminFirestore, getAdminAuth } from "@/lib/firebase/admin/initialize";
import { Timestamp } from "firebase-admin/firestore";
import type { User as FirestoreUser } from "@/types/user";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";

export async function getUserProfile(userId: string) {
  // Highlight: Log start of getUserProfile
  console.log("[Firebase Admin] getUserProfile: START for userId:", userId);
  try {
    const db = getAdminFirestore();
    const auth = getAdminAuth();

    const [authUser, userDoc] = await Promise.all([auth.getUser(userId), db.collection("users").doc(userId).get()]);

    const userData = userDoc.data();
    console.log("[Firebase Admin] getUserProfile: Raw Firestore userData:", userData); // Highlight
    console.log("[Firebase Admin] getUserProfile: Raw Firebase Auth authUser:", authUser); // Highlight

    if (!userData) {
      return { success: false, error: "User data not found" };
    }

    const userProfile: FirestoreUser = {
      id: authUser.uid,
      email: authUser.email || "",
      name: authUser.displayName || userData.name || "",

      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      displayName: userData.displayName || authUser.displayName || userData.name || "",

      bio: userData.bio || "",
      location: userData.location || "",
      website: userData.website || "",
      phone: userData.phone || "",

      image: authUser.photoURL || userData.picture || userData.profileImage || userData.image || null,

      role: userData.role || "user",
      permissions: userData.permissions || [],
      status: userData.status || "active",

      createdAt: userData?.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData?.createdAt,
      updatedAt: userData?.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData?.updatedAt,
      lastLoginAt: userData?.lastLoginAt instanceof Timestamp ? userData.lastLoginAt.toDate() : userData?.lastLoginAt,
      emailVerified: userData.emailVerified || false,
      hasPassword: userData.hasPassword || false,
      has2FA: userData.has2FA || false,
      provider: userData.provider || authUser.providerData[0]?.providerId || ""
    };

    console.log("[Firebase Admin] getUserProfile: Constructed userProfile object:", userProfile); // Highlight
    return {
      success: true,
      data: userProfile
    };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
        ? error.message
        : "Unknown error getting user profile";
    console.error("[Firebase Admin] getUserProfile: Error details:", error); // Highlight
    return { success: false, error: message };
  } finally {
    console.log("[Firebase Admin] getUserProfile: END"); // Highlight
  }
}
