"use server";

import { getAllActivityLogs, getUserActivityLogs, type ActivityLog } from "@/firebase/admin/activity";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";

// Define the return type for activity logs actions
type ActivityLogsResult = { success: true; logs: ActivityLog[] } | { success: false; error: string };

// Get all activity logs (admin only)
export async function fetchAllActivityLogs(limit = 100): Promise<ActivityLogsResult> {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user is admin
    const { UserService } = await import("@/lib/services/user-service");
    const userRole = await UserService.getUserRole(session.user.id);

    if (userRole !== "admin") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const result = await getAllActivityLogs(limit);

    if (result.success && result.logs) {
      return { success: true, logs: result.logs };
    } else {
      return { success: false, error: result.error || "Failed to fetch activity logs" };
    }
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error fetching activity logs";
    return { success: false, error: message };
  }
}

// Get user activity logs
export async function fetchUserActivityLogs(userId?: string, limit = 100): Promise<ActivityLogsResult> {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Use provided userId or current user's ID
    const targetUserId = userId || session.user.id;

    // If requesting another user's logs, check admin permission
    if (targetUserId !== session.user.id) {
      const { UserService } = await import("@/lib/services/user-service");
      const userRole = await UserService.getUserRole(session.user.id);

      if (userRole !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
      }
    }

    // Ensure targetUserId is defined before calling getUserActivityLogs
    if (!targetUserId) {
      return { success: false, error: "User ID is required" };
    }

    const result = await getUserActivityLogs(targetUserId, limit);

    if (result.success && result.logs) {
      return { success: true, logs: result.logs };
    } else {
      return { success: false, error: result.error || "Failed to fetch user activity logs" };
    }
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error fetching user activity logs";
    return { success: false, error: message };
  }
}

// Alias for backward compatibility
export const fetchActivityLogs = fetchAllActivityLogs;
