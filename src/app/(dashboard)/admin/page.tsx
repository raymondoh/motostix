// import type { Metadata } from "next";
// import { fetchAllActivityLogs } from "@/actions/dashboard/activity-logs";
// import { Separator } from "@/components/ui/separator";
// import {
//   DashboardShell,
//   DashboardHeader,
//   AdminSystemPreview,
//   AdminAlertsPreview,
//   AdminUserPreview,
//   AdminActivityPreview
// } from "@/components";
// import { redirect } from "next/navigation";
// import { getAdminFirestore } from "@/lib/firebase/admin/initialize";
// import { UserService } from "@/lib/services/user-service";
// import { serializeData } from "@/utils";
// import type { SerializedActivity } from "@/types/firebase";

// export const metadata: Metadata = {
//   title: "Admin Dashboard",
//   description: "Admin Dashboard"
// };

// // Helper function to convert ActivityLog to SerializedActivity
// function convertToSerializedActivity(log: any): SerializedActivity {
//   return {
//     id: log.id,
//     userId: log.userId,
//     type: log.type,
//     description: log.description,
//     status: log.status,
//     timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : log.timestamp,
//     metadata: log.metadata || {},
//     name: log.description || log.type // Use description as name fallback
//   };
// }

// export default async function AdminDashboardOverviewPage() {
//   try {
//     // Dynamic import for auth to avoid build-time issues
//     const { auth } = await import("@/auth");
//     const session = await auth();

//     // Redirect if not authenticated
//     if (!session?.user) {
//       redirect("/login");
//     }

//     // Check if user has admin role using UserService
//     const userId = session.user.id;
//     const userRole = await UserService.getUserRole(userId);

//     if (userRole !== "admin") {
//       redirect("/not-authorized");
//     }

//     // Fetch activity logs using the new action
//     const result = await fetchAllActivityLogs(10);
//     console.log("[AdminDashboardOverviewPage] fetchActivityLogs result:", result);
//     const logs: SerializedActivity[] = result.success ? result.logs.map(convertToSerializedActivity) : [];

//     console.log("[AdminDashboardOverviewPage] Logs length:", logs.length);

//     // Fetch system stats for the admin dashboard
//     const systemStats = {
//       totalUsers: 0,
//       activeUsers: 0,
//       newUsersToday: 0,
//       totalActivities: 0
//     };

//     try {
//       // Use the new Firebase admin initialization
//       const db = getAdminFirestore();

//       // Get total users count
//       const usersSnapshot = await db.collection("users").count().get();
//       systemStats.totalUsers = usersSnapshot.data().count;

//       // Get active users (logged in within last 7 days)
//       const sevenDaysAgo = new Date();
//       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//       const activeUsersSnapshot = await db.collection("users").where("lastLoginAt", ">=", sevenDaysAgo).count().get();
//       systemStats.activeUsers = activeUsersSnapshot.data().count;

//       // Get new users today
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const newUsersSnapshot = await db.collection("users").where("createdAt", ">=", today).count().get();
//       systemStats.newUsersToday = newUsersSnapshot.data().count;

//       // Get total activities - using the correct collection name
//       const activitiesSnapshot = await db.collection("activity").count().get();
//       systemStats.totalActivities = activitiesSnapshot.data().count;
//       console.log("ACTIVITIES:", activitiesSnapshot.data().count);
//     } catch (error) {
//       console.error("Error fetching system stats:", error);
//       // Continue with default values if fetch fails
//     }

//     // Ensure data is properly serialized for client components
//     const serializedSystemStats = serializeData(systemStats);

//     // Get the admin's name with fallbacks
//     const adminName = session.user.name || (session.user.email ? session.user.email.split("@")[0] : "Admin");

//     return (
//       <DashboardShell>
//         <DashboardHeader
//           title="Admin Dashboard"
//           description={`Welcome, ${adminName}! Here's an overview of your system.`}
//           breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin" }]}
//         />
//         <Separator className="mb-8" />

//         {/* Top row - 2 columns with reduced gap on mobile */}
//         <div className="w-full grid gap-4 md:gap-8 md:grid-cols-2 mb-4 md:mb-8">
//           {/* System Overview Card */}
//           <div className="w-full min-w-0 overflow-hidden">
//             <AdminSystemPreview systemStats={serializedSystemStats} />
//           </div>

//           {/* System Alerts */}
//           <div className="w-full min-w-0 overflow-hidden">
//             <AdminAlertsPreview />
//           </div>
//         </div>

//         {/* Bottom row - 2 columns with reduced gap on mobile */}
//         <div className="w-full grid gap-4 md:gap-8 md:grid-cols-2">
//           {/* User Management Preview */}
//           <div className="w-full min-w-0 overflow-hidden">
//             <AdminUserPreview limit={5} />
//           </div>

//           {/* Admin Activity Log */}
//           <div className="w-full min-w-0 overflow-hidden">
//             <AdminActivityPreview
//               activities={logs}
//               limit={5}
//               showFilters={false}
//               showHeader={true}
//               showViewAll={true}
//               viewAllUrl="/admin/activity"
//             />
//           </div>
//         </div>
//       </DashboardShell>
//     );
//   } catch (error) {
//     console.error("Error in AdminDashboardOverviewPage:", error);
//     redirect("/login");
//   }
// }
// src/app/(dashboard)/admin/page.tsx
import type { Metadata } from "next";
import { fetchAllActivityLogs } from "@/actions/dashboard/activity-logs";
import { Separator } from "@/components/ui/separator";
import {
  DashboardShell,
  DashboardHeader,
  AdminSystemPreview,
  AdminAlertsPreview,
  AdminUserPreview,
  AdminActivityPreview
} from "@/components";
import { redirect } from "next/navigation";
import { getAdminFirestore } from "@/lib/firebase/admin/initialize";
import { UserService } from "@/lib/services/user-service";
import { serializeData } from "@/utils";
import type { SerializedActivity } from "@/types/firebase";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard"
};

// Highlight: Remove the convertToSerializedActivity function entirely
// function convertToSerializedActivity(log: any): SerializedActivity {
//   return {
//     id: log.id,
//     userId: log.userId,
//     type: log.type,
//     description: log.description,
//     status: log.status,
//     timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : log.timestamp,
//     metadata: log.metadata || {},
//     name: log.description || log.type // Use description as name fallback
//   };
// }

export default async function AdminDashboardOverviewPage() {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const userId = session.user.id;
    const userRole = await UserService.getUserRole(userId);

    if (userRole !== "admin") {
      redirect("/not-authorized");
    }

    // Fetch activity logs using the new action
    const result = await fetchAllActivityLogs(10);
    console.log("[AdminDashboardOverviewPage] fetchActivityLogs result:", result);
    // Highlight: Directly use result.logs, no more mapping needed
    const logs: SerializedActivity[] = result.success ? result.logs : [];

    console.log("[AdminDashboardOverviewPage] Logs length:", logs.length);

    // Fetch system stats for the admin dashboard
    const systemStats = {
      totalUsers: 0,
      activeUsers: 0,
      newUsersToday: 0,
      totalActivities: 0
    };

    try {
      const db = getAdminFirestore();

      const usersSnapshot = await db.collection("users").count().get();
      systemStats.totalUsers = usersSnapshot.data().count;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const activeUsersSnapshot = await db.collection("users").where("lastLoginAt", ">=", sevenDaysAgo).count().get();
      systemStats.activeUsers = activeUsersSnapshot.data().count;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newUsersSnapshot = await db.collection("users").where("createdAt", ">=", today).count().get();
      systemStats.newUsersToday = newUsersSnapshot.data().count;

      const activitiesSnapshot = await db.collection("activity").count().get();
      systemStats.totalActivities = activitiesSnapshot.data().count;
      console.log("ACTIVITIES:", activitiesSnapshot.data().count);
    } catch (error) {
      console.error("Error fetching system stats:", error);
    }

    const serializedSystemStats = serializeData(systemStats);

    const adminName = session.user.name || (session.user.email ? session.user.email.split("@")[0] : "Admin");

    return (
      <DashboardShell>
        <DashboardHeader
          title="Admin Dashboard"
          description={`Welcome, ${adminName}! Here's an overview of your system.`}
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin" }]}
        />
        <Separator className="mb-8" />

        <div className="w-full grid gap-4 md:gap-8 md:grid-cols-2 mb-4 md:mb-8">
          <div className="w-full min-w-0 overflow-hidden">
            <AdminSystemPreview systemStats={serializedSystemStats} />
          </div>

          <div className="w-full min-w-0 overflow-hidden">
            <AdminAlertsPreview />
          </div>
        </div>

        <div className="w-full grid gap-4 md:gap-8 md:grid-cols-2">
          <div className="w-full min-w-0 overflow-hidden">
            <AdminUserPreview limit={5} />
          </div>

          <div className="w-full min-w-0 overflow-hidden">
            <AdminActivityPreview
              activities={logs}
              limit={5}
              showFilters={false}
              showHeader={true}
              showViewAll={true}
              viewAllUrl="/admin/activity"
            />
          </div>
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error in AdminDashboardOverviewPage:", error);
    redirect("/login");
  }
}
