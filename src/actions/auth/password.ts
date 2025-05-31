"use server";

import bcryptjs from "bcryptjs";
import { auth } from "@/auth";
import { adminAuth, adminDb } from "@/firebase/admin/firebase-admin-init";
import { serverTimestamp } from "@/utils/date-server";
import { logActivity } from "@/firebase/actions";
import { forgotPasswordSchema, updatePasswordSchema } from "@/schemas/auth";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { logServerEvent, logger } from "@/utils/logger";
import { hashPassword } from "@/utils/hashPassword";
import { logPasswordResetActivity } from "./reset-password";
//import type { ForgotPasswordState, UpdatePasswordState } from "@/types/auth/password";
import type { Auth } from "@/types";
//import type { UserData } from "@/types/user";
import type { User } from "@/types";
import type { Common } from "@/types";

/**
 * Helper to safely extract a string value from FormData
 */
function getFormValue(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * UPDATE PASSWORD FOR LOGGED-IN USER
 */
export async function updatePassword(
  prevState: Auth.UpdatePasswordState,
  formData: FormData
): Promise<Auth.UpdatePasswordState> {
  const session = await auth();
  if (!session?.user?.id) {
    logger({ type: "warn", message: "Unauthorized password update attempt", context: "auth" });
    return { success: false, error: "Not authenticated" };
  }

  const currentPassword = getFormValue(formData, "currentPassword");
  const newPassword = getFormValue(formData, "newPassword");
  const confirmPassword = getFormValue(formData, "confirmPassword");

  if (!currentPassword) return { success: false, error: "Current password is required" };
  if (!newPassword) return { success: false, error: "New password is required" };
  if (!confirmPassword) return { success: false, error: "Confirm password is required" };

  const result = updatePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message || "Invalid form data";
    logger({ type: "warn", message: `Password update validation failed: ${errorMessage}`, context: "auth" });
    return { success: false, error: errorMessage };
  }

  try {
    const userDoc = await adminDb().collection("users").doc(session.user.id).get();
    const userData = userDoc.exists ? (userDoc.data() as User.UserData | undefined) : undefined;

    if (!userData?.passwordHash) {
      logger({ type: "warn", message: "User data missing or password not set during updatePassword", context: "auth" });
      return { success: false, error: "User data not found or password not set" };
    }

    const isCurrentPasswordValid = await bcryptjs.compare(currentPassword, userData.passwordHash);
    if (!isCurrentPasswordValid) {
      logger({ type: "warn", message: "Current password invalid during updatePassword", context: "auth" });
      return { success: false, error: "Current password is incorrect" };
    }

    const newPasswordHash = await hashPassword(newPassword);

    await adminAuth().updateUser(session.user.id, { password: newPassword });

    await adminDb().collection("users").doc(session.user.id).update({
      passwordHash: newPasswordHash,
      updatedAt: serverTimestamp()
    });

    await logActivity({
      userId: session.user.id,
      type: "password_change",
      description: "Password changed successfully",
      status: "success"
    });

    logger({ type: "info", message: `Password updated for uid: ${session.user.id}`, context: "auth" });

    await logServerEvent({
      type: "auth:update_password",
      message: `Password updated for uid: ${session.user.id}`,
      userId: session.user.id,
      context: "auth"
    });

    return { success: true };
  } catch (error: unknown) {
    logger({
      type: "error",
      message: "Error updating password",
      metadata: { error },
      context: "auth"
    });

    if (isFirebaseError(error) && error.code === "auth/weak-password") {
      return {
        success: false,
        error: "The password is too weak. Please choose a stronger password."
      };
    }

    return {
      success: false,
      error: isFirebaseError(error) ? firebaseError(error) : "Failed to update password. Please try again."
    };
  }
}
