import type React from "react";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();

    // Check if they have the user role
    if (!session || session.user.role !== "user") {
      redirect("/not-authorized");
    }

    return <div className="user-container">{children}</div>;
  } catch (error) {
    console.error("Error in UserLayout:", error);
    redirect("/not-authorized");
  }
}
