"use server";

// This file provides safe authentication helpers that won't break builds

import { cache } from "react";

// Cached function to get the current user (placeholder for now)
export const getCurrentUser = cache(async () => {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();
    return session?.user || null;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
});

// Check if user has admin role (placeholder for now)
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    // This would need to be implemented based on your user role system
    return false; // placeholder
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
