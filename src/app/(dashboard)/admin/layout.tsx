import type React from "react";
// src/app/(dashboard)/admin/layout.tsx
import { redirect } from "next/navigation";

// This layout uses auth() or headers(), so force dynamic rendering
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();

    // Check if user is logged in and is an admin
    if (!session?.user || session.user.role !== "admin") {
      redirect("/not-authorized");
    }

    return <div className="admin-container">{children}</div>;
  } catch (error) {
    console.error("Error in AdminLayout:", error);
    redirect("/not-authorized");
  }
}
