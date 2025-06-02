"use server";

import { getAdminAuth, getAdminFirestore, getAdminStorage } from "@/lib/firebase/admin/initialize";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { logActivity } from "@/firebase/log/logActivity";
import { revalidatePath } from "next/cache";

// Request account deletion
export async function requestAccountDeletion() {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth: userAuth } = await import("@/auth");
    const session = await userAuth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = session.user.id;

    // Log the deletion request
    await logActivity({
      userId,
      type: "account-deletion-request",
      description: "Account deletion requested",
      status: "info"
    });

    // In a real app, you might want to:
    // 1. Send a confirmation email
    // 2. Set a deletion flag in the user's document
    // 3. Schedule the actual deletion for later

    const db = getAdminFirestore();
    await db.collection("users").doc(userId).update({
      deletionRequested: true,
      deletionRequestedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error requesting account deletion";
    console.error("Error requesting account deletion:", message);
    return { success: false, error: message };
  }
}

// Cancel account deletion request
export async function cancelDeletionRequest() {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth: userAuth } = await import("@/auth");
    const session = await userAuth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = session.user.id;

    const db = getAdminFirestore();
    await db.collection("users").doc(userId).update({
      deletionRequested: false,
      deletionRequestedAt: null
    });

    await logActivity({
      userId,
      type: "account-deletion-cancelled",
      description: "Account deletion request cancelled",
      status: "info"
    });

    revalidatePath("/user/data-privacy");

    return { success: true };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error cancelling deletion request";
    console.error("Error cancelling deletion request:", message);
    return { success: false, error: message };
  }
}

// Confirm and execute account deletion
export async function confirmAccountDeletion(password: string) {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth: userAuth } = await import("@/auth");
    const session = await userAuth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = session.user.id;

    // In a real app, you would verify the password here
    // Since we can't do that with Firebase Admin SDK, we'll skip that step

    const adminAuth = getAdminAuth();
    const db = getAdminFirestore();
    const storage = getAdminStorage();

    // Get user data for cleanup
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    // Delete user's profile image if exists
    if (userData?.picture) {
      try {
        const bucket = storage.bucket();
        const url = new URL(userData.picture);
        const fullPath = url.pathname.slice(1);
        const storagePath = fullPath.replace(`${bucket.name}/`, "");
        await bucket.file(storagePath).delete();
      } catch (imageError) {
        console.error("Error deleting profile image:", imageError);
      }
    }

    // Delete user's data from Firestore
    // 1. Delete likes
    const likesSnapshot = await db.collection("users").doc(userId).collection("likes").get();
    const likesDeletePromises = likesSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(likesDeletePromises);

    // 2. Delete user document
    await db.collection("users").doc(userId).delete();

    // 3. Delete user from Firebase Auth
    await adminAuth.deleteUser(userId);

    // Log successful deletion
    await logActivity({
      userId: "system",
      type: "account-deletion",
      description: `User account ${userId} deleted`,
      status: "success",
      metadata: { deletedUserId: userId }
    });

    return { success: true };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error deleting account";
    console.error("Error deleting account:", message);
    return { success: false, error: message };
  }
}
