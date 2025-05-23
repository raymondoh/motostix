// src/actions/client/updatePassword.ts
"use client";

import type { Auth } from "@/types";

export async function clientUpdatePassword(formData: FormData): Promise<Auth.UpdatePasswordState> {
  try {
    const res = await fetch("/api/update-password", {
      method: "POST",
      body: formData
    });
    if (!res.ok) {
      return { success: false, error: "Failed to update password" } as Auth.UpdatePasswordState;
    }
    const data = (await res.json()) as Auth.UpdatePasswordState;
    return data;
  } catch (error) {
    console.error("clientUpdatePassword error:", error);
    return { success: false, error: "Unexpected error occurred" } as Auth.UpdatePasswordState;
  }
}
