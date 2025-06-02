// //import type { User } from "@/types/user";
// import { getCurrentUser } from "@/firebase/actions";
// import { redirect } from "next/navigation";
// import { auth } from "@/auth";
// import { Separator } from "@/components/ui/separator";
// import { DashboardShell, DashboardHeader } from "@/components";
// import { UserProfileForm } from "@/components/auth/UserProfileForm";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";

// export default async function AdminProfilePage() {
//   // Run these in parallel for better performance
//   const [session, userResult] = await Promise.all([auth(), getCurrentUser()]);

//   // Check authentication
//   if (!session?.user) {
//     redirect("/login");
//   }

//   // Check if the user is an admin
//   if (session.user.role !== "admin") {
//     redirect("/not-authorized"); // Redirect non-admin users to not-authorized page
//   }

//   // Extract the user data or handle error
//   const user = userResult.success ? userResult.data : null;
//   const error = userResult.success ? null : userResult.error;

//   // If we couldn't get the user data, show an error page
//   if (!user) {
//     redirect("/error");
//   }

//   return (
//     <DashboardShell>
//       <DashboardHeader
//         title="Admin Profile"
//         description="Update your admin account settings"
//         breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Profile" }]}
//       />
//       <Separator className="mb-8" />

//       {error && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="w-full max-w-7xl overflow-hidden">
//         <div className="profile-form-container">
//           {/* <h2 className="text-xl font-semibold mb-4">Admin Information</h2>
//           <p className="text-muted-foreground mb-6">Update your name, bio, and profile image.</p> */}

//           <UserProfileForm user={user} isLoading={!user} isAdmin={true} />
//         </div>
//       </div>
//     </DashboardShell>
//   );
// }
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DashboardShell, DashboardHeader } from "@/components";
import { UserProfileForm } from "@/components/auth/UserProfileForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { UserService } from "@/lib/services/user-service";

export default async function AdminProfilePage() {
  try {
    // Dynamic import for auth to avoid build-time issues
    const { auth } = await import("@/auth");
    const session = await auth();

    // Check authentication
    if (!session?.user) {
      redirect("/login");
    }

    // Check if the user is an admin using UserService
    const userRole = await UserService.getUserRole(session.user.id);
    if (userRole !== "admin") {
      redirect("/not-authorized");
    }

    // Get current user using UserService
    const userResult = await UserService.getCurrentUser();

    // Handle error case
    if (!userResult.success) {
      console.error("Error getting current user:", userResult.error);
      return (
        <DashboardShell>
          <DashboardHeader
            title="Admin Profile"
            description="Update your admin account settings"
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Profile" }]}
          />
          <Separator className="mb-8" />
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Error loading profile: {userResult.error}</AlertDescription>
          </Alert>
        </DashboardShell>
      );
    }

    const user = userResult.data;

    return (
      <DashboardShell>
        <DashboardHeader
          title="Admin Profile"
          description="Update your admin account settings"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Profile" }]}
        />
        <Separator className="mb-8" />

        <div className="w-full max-w-7xl overflow-hidden">
          <div className="profile-form-container">
            <UserProfileForm user={user} isLoading={false} isAdmin={true} />
          </div>
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error in AdminProfilePage:", error);
    redirect("/error");
  }
}
