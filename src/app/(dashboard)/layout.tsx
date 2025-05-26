import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardThemeProvider } from "@/providers/DashboardThemeProvider";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | MotoStix",
  description: "Manage your MotoStix account and orders"
};

// This layout uses auth() or headers(), so force dynamic rendering
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  try {
    // Basic authentication check
    const session = await auth();
    const headersList = await headers();
    const pathname = headersList.get("x-invoke-path") || "";

    const isAdminRoute = pathname.includes("/admin");
    const isUserRoute = pathname.includes("/user");

    console.log("Dashboard Layout - Session data:", {
      exists: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userRole: session?.user?.role
    });

    if (!session) {
      console.log("Dashboard Layout - No session, redirecting to login");
      redirect("/login");
    }

    const role = session.user?.role;

    // Role-based access control
    if (role === "admin" && isUserRoute) {
      console.warn("Admin trying to access user route — redirecting to /admin");
      redirect("/admin");
    }

    if (role === "user" && isAdminRoute) {
      console.warn("User trying to access admin route — redirecting to /not-authorized");
      redirect("/not-authorized");
    }

    // Role-based redirects
    if (role !== "admin" && role !== "user") {
      console.error(`Unknown role "${role}", redirecting to not-authorized`);
      redirect("/not-authorized");
    }

    // Get the cookie store and read sidebar state
    const cookieStore = await cookies();
    const sidebarCookie = cookieStore.get("sidebar:state");
    const sidebarState = sidebarCookie ? sidebarCookie.value === "true" : false;

    console.log("Dashboard Layout - Sidebar state:", sidebarState);

    return (
      <DashboardThemeProvider>
        <SidebarProvider defaultOpen={sidebarState}>
          {/* The w-full class here is crucial for proper layout */}
          <div className="flex h-screen overflow-hidden w-full">
            {/* Sidebar component */}
            <AppSidebar />

            {/* Main content area */}
            <SidebarInset className="flex-1 flex flex-col w-full">
              {/* Enhanced header with darker border and shadow */}
              <header className="flex h-16 items-center justify-between px-6 sticky top-0 bg-muted backdrop-blur-sm z-10 shadow-lg">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="rounded-full hover:bg-muted p-2 transition-colors" />
                  <h1 className="font-semibold text-lg hidden sm:block">
                    {role === "admin" ? "Admin Dashboard" : "My Account"}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/"
                    className="text-sm font-medium flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back to Store</span>
                  </Link>
                </div>
              </header>

              {/* Main content with enhanced styling */}
              <main className="flex-1 overflow-auto bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                  {/* Content wrapper with subtle styling */}
                  <div className="bg-background rounded-xl shadow-sm border p-6">{children}</div>
                </div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </DashboardThemeProvider>
    );
  } catch (error) {
    console.error("Error in DashboardLayout:", error);
    redirect("/not-authorized");
  }
}
