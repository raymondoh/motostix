// src/firebase/admin/auth.ts

import { adminAuth, adminDb, adminStorage } from "@/firebase/admin/firebase-admin-init";
import type { GetUserFromTokenResult, SetCustomClaimsResult, CustomClaims } from "@/types/firebase/auth";
import type { VerifyAndCreateUserResult, SendResetPasswordEmailResult } from "@/types/firebase/auth";
import { Timestamp } from "firebase-admin/firestore";
import { createUserDocument } from "./user";
import bcryptjs from "bcryptjs";
import { logActivity } from "@/firebase/admin/activity";
import { ActivityLogData, ActivityType } from "@/types/firebase";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { getUserImage } from "@/utils/get-user-image";
import type { User } from "@/types/user";

// ================= Firebase User Management =================

// ============================================
// CREATE A USER IN FIREBASE AUTH AND FIRESTORE
// ============================================
export async function createUserInFirebase({
  email,
  password,
  displayName,
  createdBy,
  role = "user"
}: {
  email: string;
  password?: string;
  displayName?: string;
  createdBy?: string;
  role?: string;
}): Promise<{ success: true; uid: string } | { success: false; error: string }> {
  try {
    if (!password || password.trim() === "") {
      return { success: false, error: "Password is required to create a user." };
    }

    // 1. Create user in Firebase Auth (hashes password internally)
    const userRecord = await adminAuth().createUser({
      email,
      password,
      displayName
    });

    const uid = userRecord.uid;

    // 2. Mark email as verified
    await adminAuth().updateUser(uid, { emailVerified: true });

    // 3. Hash password manually for our custom login flow
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 4. Add metadata to Firestore
    const now = Timestamp.now();
    await adminDb()
      .collection("users")
      .doc(uid)
      .set({
        email,
        name: displayName || email.split("@")[0],
        role,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        provider: "admin-create",
        status: "active",
        emailVerified: true,
        passwordHash: hashedPassword,
        image: getUserImage({}) // 👈 fallback-safe (resolves to null)
      });

    // 5. Log admin action
    if (createdBy) {
      await logActivity({
        userId: createdBy,
        type: "admin_created_user",
        description: `Created user: ${email}`,
        status: "success",
        metadata: { newUserId: uid, email }
      });
    }

    return { success: true, uid };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error creating user";
    return { success: false, error: message };
  }
}

// ===================
// DELETE USER AS ADMIN
// ===================
export async function deleteUserAsAdmin(
  userId: string,
  adminId?: string // Consider if adminId should be mandatory for audit logging
): Promise<{ success: true } | { success: false; error: string }> {
  const performingAdminId = adminId || "SYSTEM"; // Use a fallback if adminId is not always provided
  console.log(`[deleteUserAsAdmin] Initiating deletion for user: ${userId}, by admin: ${performingAdminId}`);

  // Get service instances by calling the lazy getters at the start
  const db = adminDb();
  const storage = adminStorage();
  const authAdmin = adminAuth(); // Renamed to avoid conflict if 'auth' is imported from NextAuth

  // Validate that all admin services were initialized correctly by the getters
  if (!db || typeof db.collection !== "function") {
    const errorMsg = "[deleteUserAsAdmin] CRITICAL: Firestore instance (db) is not valid or not initialized.";
    console.error(errorMsg);
    // Optionally log this critical failure using logActivity if adminId is available and logging is set up to handle init failures
    return { success: false as const, error: errorMsg };
  }
  if (!storage || typeof storage.bucket !== "function") {
    const errorMsg = "[deleteUserAsAdmin] CRITICAL: Storage instance (storage) is not valid or not initialized.";
    console.error(errorMsg);
    return { success: false as const, error: errorMsg };
  }
  if (!authAdmin || typeof authAdmin.deleteUser !== "function") {
    const errorMsg = "[deleteUserAsAdmin] CRITICAL: Admin Auth instance (authAdmin) is not valid or not initialized.";
    console.error(errorMsg);
    return { success: false as const, error: errorMsg };
  }

  const userRef = db.collection("users").doc(userId);

  try {
    // Step 1: Clear image field in Firestore (Consider this non-critical, log warning on failure)
    try {
      await userRef.update({ image: null });
      console.log(`[deleteUserAsAdmin] Successfully cleared 'image' field for user: ${userId}`);
    } catch (updateError: unknown) {
      const message = updateError instanceof Error ? updateError.message : String(updateError);
      console.warn(
        `[deleteUserAsAdmin] Non-critical: Failed to clear 'image' field for user ${userId}. Error: ${message}`
      );
    }

    // Step 2: Attempt to delete profile image from Firebase Storage
    const filePath = `users/${userId}/profile.jpg`;
    const fileRef = storage.bucket().file(filePath);
    try {
      await fileRef.delete();
      console.log(`[deleteUserAsAdmin] ✅ Deleted profile image '${filePath}' for user ${userId} from Storage.`);
    } catch (storageError: unknown) {
      interface ErrorWithCode {
        code: string | number;
        message?: string;
      }
      const isErrorWithCode = (err: unknown): err is ErrorWithCode => {
        return typeof err === "object" && err !== null && "code" in err;
      };

      if (isErrorWithCode(storageError)) {
        if (storageError.code === "storage/object-not-found" || storageError.code === 404) {
          console.log(
            `[deleteUserAsAdmin] ℹ️ Profile image '${filePath}' not found in Storage for user ${userId}. Skipping delete.`
          );
        } else {
          console.warn(
            `[deleteUserAsAdmin] ⚠️ Warning: Error deleting profile image '${filePath}' for user ${userId} (Code: ${
              storageError.code
            }). Error: ${storageError.message || String(storageError)}`
          );
        }
      } else {
        console.warn(
          `[deleteUserAsAdmin] ⚠️ Warning: An unexpected error type occurred while deleting profile image '${filePath}' for user ${userId}:`,
          storageError
        );
      }
    }

    // Step 3: Delete Firestore user document (This is a critical step)
    console.log(`[deleteUserAsAdmin] Attempting to delete Firestore document for user: ${userId}`);
    await userRef.delete();
    console.log(`[deleteUserAsAdmin] ✅ Successfully deleted Firestore document for user ${userId}.`);

    // Step 4: Delete Firebase Auth user (This is also a critical step)
    console.log(`[deleteUserAsAdmin] Attempting to delete Firebase Auth user: ${userId}`);
    await authAdmin.deleteUser(userId);
    console.log(`[deleteUserAsAdmin] ✅ Successfully deleted Firebase Auth user: ${userId}.`);

    // Step 5: Log activity
    // Prepare data for logActivity, ensuring it matches ActivityLogData (excluding timestamp)
    const activityDataForLog: Omit<ActivityLogData, "timestamp"> = {
      userId: performingAdminId, // The admin performing the action
      type: "deletion_completed" as ActivityType, // Use a valid ActivityType or string
      description: `Admin (ID: ${performingAdminId}) successfully deleted user (ID: ${userId})`,
      status: "success", // Ensure this is a valid status string for your ActivityLogData
      metadata: { deletedUserId: userId, adminPerformingAction: performingAdminId }
      // userEmail, ipAddress, location, device, deviceType can be added if available and relevant
    };
    try {
      await logActivity(activityDataForLog);
      console.log(`[deleteUserAsAdmin] Successfully logged admin activity for deletion of user: ${userId}`);
    } catch (logError: unknown) {
      const logErrorMessage = logError instanceof Error ? logError.message : String(logError);
      console.error(`[deleteUserAsAdmin] Failed to log admin activity for user ${userId}. Error: ${logErrorMessage}`);
    }

    console.log(`[deleteUserAsAdmin] ✅✅ Successfully and fully deleted user: ${userId}`);
    return { success: true as const };
  } catch (mainError: unknown) {
    const errorMessage = isFirebaseError(mainError)
      ? firebaseError(mainError)
      : mainError instanceof Error
      ? mainError.message
      : "Unknown error occurred during the user deletion process.";

    console.error(
      `[deleteUserAsAdmin] ❌ CRITICAL FAILURE in overall deleteUserAsAdmin process for user ${userId}: ${errorMessage}. Full error:`,
      mainError
    );

    // Log critical failure activity
    const errorActivityData: Omit<ActivityLogData, "timestamp"> = {
      userId: performingAdminId,
      type: "error", // Or a specific error ActivityType e.g., "deletion_failed"
      description: `Failed attempt by admin (ID: ${performingAdminId}) to delete user (${userId}). Error: ${errorMessage}`,
      status: "failure", // Ensure this is a valid status string
      metadata: { deletedUserId: userId, errorDetails: String(mainError), adminPerformingAction: performingAdminId }
    };
    try {
      await logActivity(errorActivityData);
    } catch (activityLogError: unknown) {
      console.error(`[deleteUserAsAdmin] Also failed to log the error activity:`, activityLogError);
    }
    return { success: false as const, error: errorMessage };
  }
}

// ==============================================================
// DELETE USER IMAGE USING ITS URL )SIMILAR TO deleteProductImage)
// ==============================================================
export async function deleteUserImage(
  imageUrl: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const bucket = adminStorage().bucket();

    const url = new URL(imageUrl);
    const fullPath = url.pathname.slice(1); // remove leading slash

    const bucketName = bucket.name;
    const storagePath = fullPath.replace(`${bucketName}/`, ""); // get clean path

    console.log("🧼 Deleting user image:", storagePath);

    const file = bucket.file(storagePath);
    await file.delete();

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error deleting image";
    console.error("❌ Error deleting user image:", message);
    return { success: false, error: message };
  }
}

// ==============================================
// DELETE A USER FROM FIREBASE AUTH AND FIRESTORE
// ==============================================
export async function deleteUser(uid: string) {
  try {
    await adminAuth().deleteUser(uid);
    return { success: true };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error deleting user";
    return { success: false, error: message };
  }
}

// ==========================
// GET A FIREBASE USER BY UID
// ==========================
export async function getUser(uid: string): Promise<{ success: true; data: User } | { success: false; error: string }> {
  try {
    // Get auth user
    const userRecord = await adminAuth().getUser(uid);

    // Get Firestore user doc
    const userDoc = await adminDb().collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return { success: false, error: "User profile not found in Firestore." };
    }

    // Merge auth + Firestore data into your custom User type
    const user: User = {
      id: uid,
      email: userRecord.email,
      name: userRecord.displayName || userData.name || "",
      image: userData.image || userData.picture || userRecord.photoURL || null,
      emailVerified: userRecord.emailVerified,
      role: userData.role || "user",
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      lastLoginAt: userData.lastLoginAt,
      // Add optional fields if needed
      phone: userData.phone || undefined,
      bio: userData.bio || undefined,
      location: userData.location || undefined,
      website: userData.website || undefined,
      provider: userData.provider || undefined,
      hasPassword: userData.hasPassword || false,
      has2FA: userData.has2FA || false,
      passwordHash: userData.passwordHash || undefined,
      status: userData.status || "active",
      permissions: userData.permissions || []
    };

    return { success: true, data: user };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error getting user";
    return { success: false, error: message };
  }
}

// ==========================
// GET A FIREBASE USER BY EMAIL
// ==========================
export async function getUserByEmail(email: string) {
  try {
    const user = await adminAuth().getUserByEmail(email);
    return { success: true, data: user };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error getting user by email";
    return { success: false, error: message };
  }
}

// ===========================================
// UPDATE A USER'S PROPERTIES IN FIREBASE AUTH
// ===========================================
export async function updateUser(
  uid: string,
  properties: { displayName?: string; photoURL?: string; password?: string }
) {
  try {
    const user = await adminAuth().updateUser(uid, properties);
    await logActivity({
      userId: uid,
      type: "user_updated_profile",
      description: "User profile updated via admin",
      status: "success",
      metadata: properties
    });

    return { success: true, data: user };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error updating user";
    return { success: false, error: message };
  }
}

// ================= Firebase User Authentication =================

/**
 * Server-safe function to check if a Firebase user's email is verified.
 */
export async function isEmailVerified(
  userId: string
): Promise<{ success: boolean; verified?: boolean; error?: string }> {
  try {
    const userRecord = await adminAuth().getUser(userId);
    return { success: true, verified: userRecord.emailVerified };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error checking email verification status";
    return { success: false, error: message };
  }
}

/**
 * Send a password reset email for a user
 */
export async function sendResetPasswordEmail(email: string): Promise<SendResetPasswordEmailResult> {
  try {
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      handleCodeInApp: true
    };

    await adminAuth().generatePasswordResetLink(email, actionCodeSettings);
    await logActivity({
      userId: email,
      type: "password_reset_requested",
      description: "Password reset email sent",
      status: "success"
    });

    return { success: true };
  } catch (error: unknown) {
    if (isFirebaseError(error) && error.code === "auth/user-not-found") {
      return { success: true }; // Silent success for security reasons
    }

    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Failed to send reset email";

    return { success: false, error: message };
  }
}

/**
 * Decode and return user from token
 */
export async function getUserFromToken(token: string): Promise<GetUserFromTokenResult> {
  try {
    const decodedToken = await adminAuth().verifyIdToken(token);
    return { success: true, user: decodedToken };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Invalid token";
    return { success: false, error: message };
  }
}

/**
 * Verify ID token and return decoded token data
 */
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth().verifyIdToken(token);
    return { success: true, data: decodedToken };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Invalid ID token";
    return { success: false, error: message };
  }
}

// ================= Firebase Custom Claims =================

/**
 * Set custom claims for a user
 */
export async function setCustomClaims(uid: string, claims: CustomClaims): Promise<SetCustomClaimsResult> {
  try {
    await adminAuth().setCustomUserClaims(uid, claims);
    await logActivity({
      userId: uid,
      type: "admin_updated_permissions",
      description: "Admin updated user roles/claims",
      status: "success",
      metadata: claims
    });

    return { success: true };
  } catch (error: unknown) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error setting custom claims";
    return { success: false, error: message };
  }
}
export async function verifyAndCreateUser(token: string): Promise<VerifyAndCreateUserResult> {
  try {
    const decodedToken = await adminAuth().verifyIdToken(token);

    await createUserDocument(decodedToken.uid, {
      id: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || "",
      image: getUserImage(decodedToken),
      role: "user"
    });
    await logActivity({
      userId: decodedToken.uid,
      type: "user_registered",
      description: "User account auto-created from token",
      status: "success"
    });

    return { success: true, uid: decodedToken.uid };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Invalid token";

    return { success: false, error: message };
  }
}
