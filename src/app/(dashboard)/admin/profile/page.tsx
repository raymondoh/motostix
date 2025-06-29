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
