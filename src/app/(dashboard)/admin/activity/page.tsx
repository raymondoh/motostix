// import type { Metadata } from "next";
// import { Separator } from "@/components/ui/separator";
// import { DashboardShell, DashboardHeader } from "@/components";
// import { AdminActivityPageClient } from "@/components";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { fetchActivityLogs } from "@/actions/dashboard/activity-logs";

// import type { SerializedActivity } from "@/types/firebase/activity";

// export const metadata: Metadata = {
//   title: "Activity Log - Admin",
//   description: "View all recent activity across the platform."
// };

// export default async function AdminActivityPage() {
//   const session = await auth();

//   if (!session?.user) {
//     redirect("/login");
//   }

//   if (session.user.role !== "admin") {
//     redirect("/not-authorized");
//   }

//   // ✅ Fetch initial logs on the server
//   const result = await fetchActivityLogs({ limit: 10 });
//   const logs: SerializedActivity[] = result.success && Array.isArray(result.activities) ? result.activities : [];
//   console.log("[AdminActivityPage] Logs length:", logs.length);

//   return (
//     <DashboardShell>
//       <DashboardHeader
//         title="Activity Log"
//         description="View all recent activity across the platform."
//         breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Activity Log" }]}
//       />
//       <Separator className="mb-8" />

//       <div className="w-full max-w-full overflow-hidden">
//         <AdminActivityPageClient initialLogs={logs} /> {/* ✅ pass logs as prop */}
//       </div>
//     </DashboardShell>
//   );
// }
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { DashboardShell, DashboardHeader } from "@/components";
import { AdminActivityPageClient } from "@/components";
import { redirect } from "next/navigation";
import { fetchActivityLogs } from "@/actions/dashboard/activity-logs";
import { UserService } from "@/lib/services/user-service";
import type { Firebase } from "@/types";

// Helper function to convert ActivityLog to SerializedActivity
function convertToSerializedActivity(log: any): Firebase.SerializedActivity {
  return {
    id: log.id,
    userId: log.userId,
    type: log.type,
    description: log.description,
    status: log.status,
    timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : log.timestamp,
    metadata: log.metadata || {},
    name: log.description || log.type // Use description as name fallback
  };
}

export const metadata: Metadata = {
  title: "Activity Log - Admin",
  description: "View all recent activity across the platform."
};

export default async function AdminActivityPage() {
  try {
    // Dynamic import for auth to avoid build-time issues
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    // Check admin role using UserService
    const userRole = await UserService.getUserRole(session.user.id);
    if (userRole !== "admin") {
      redirect("/not-authorized");
    }

    // ✅ Fetch initial logs on the server with proper typing
    const result = await fetchActivityLogs(10);

    // Convert ActivityLog[] to SerializedActivity[]
    const logs: Firebase.SerializedActivity[] = result.success ? result.logs.map(convertToSerializedActivity) : [];

    console.log("[AdminActivityPage] Logs length:", logs.length);

    return (
      <DashboardShell>
        <DashboardHeader
          title="Activity Log"
          description="View all recent activity across the platform."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Activity Log" }]}
        />
        <Separator className="mb-8" />

        <div className="w-full max-w-full overflow-hidden">
          <AdminActivityPageClient initialLogs={logs} />
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error in AdminActivityPage:", error);
    redirect("/login");
  }
}
