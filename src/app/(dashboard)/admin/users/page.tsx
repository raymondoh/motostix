// import type { Metadata } from "next";
// import { Separator } from "@/components/ui/separator";
// import { DashboardShell, DashboardHeader } from "@/components";
// import { UsersClient } from "@/components/dashboard/admin/users/UsersClient";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { adminDb } from "@/firebase/admin/firebase-admin-init";
// import { fetchUsers } from "@/actions/user/admin";
// import { serializeUserArray } from "@/utils/serializeUser";

// export const metadata: Metadata = {
//   title: "Manage Users - Admin",
//   description: "View and manage all users in your application."
// };

// export default async function AdminUsersPage() {
//   const session = await auth();

//   if (!session?.user) redirect("/login");

//   const userId = session.user.id;
//   const userDoc = await adminDb().collection("users").doc(userId).get();
//   const isAdmin = userDoc.exists && userDoc.data()?.role === "admin";

//   if (!isAdmin) redirect("/not-authorized");

//   const result = await fetchUsers(10, 0);
//   const initialUsers = result.success ? result.users || [] : [];
//   const serializedUsers = serializeUserArray(initialUsers);
//   console.log("🚀 serializedUsers:", serializedUsers);
//   console.log("🚀 initialUsers:", initialUsers);

//   return (
//     <DashboardShell>
//       <DashboardHeader
//         title="User Management"
//         description="View and manage users in your application."
//         breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Users" }]}
//       />
//       <Separator className="mb-8" />

//       <div className="w-full overflow-hidden">
//         <UsersClient users={serializedUsers} />
//       </div>
//     </DashboardShell>
//   );
// }
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { DashboardShell, DashboardHeader } from "@/components";
import { UsersClient } from "@/components/dashboard/admin/users/UsersClient";
import { redirect } from "next/navigation";
import { UserService } from "@/lib/services/user-service";
import type { SerializedUser } from "@/types/user/common";

export const metadata: Metadata = {
  title: "Manage Users - Admin",
  description: "View and manage all users in your application."
};

export default async function AdminUsersPage() {
  try {
    // Dynamic import for auth to avoid build-time issues
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    // Check admin role using UserService
    const userId = session.user.id;
    const userRole = await UserService.getUserRole(userId);

    if (userRole !== "admin") {
      redirect("/not-authorized");
    }

    // Fetch users using UserService directly - this is the best method
    const usersResult = await UserService.getUsers(10);

    if (!usersResult.success) {
      console.error("Error fetching users:", usersResult.error);
      return (
        <DashboardShell>
          <DashboardHeader
            title="User Management"
            description="View and manage users in your application."
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Users" }]}
          />
          <Separator className="mb-8" />
          <div className="p-4 bg-red-50 text-red-500 rounded-md">Error loading users: {usersResult.error}</div>
        </DashboardShell>
      );
    }

    const users = usersResult.data.users as SerializedUser[];
    console.log("🚀 Fetched users:", users.length);

    return (
      <DashboardShell>
        <DashboardHeader
          title="User Management"
          description="View and manage users in your application."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Users" }]}
        />
        <Separator className="mb-8" />

        <div className="w-full overflow-hidden">
          <UsersClient users={users} />
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error in AdminUsersPage:", error);
    redirect("/login");
  }
}
