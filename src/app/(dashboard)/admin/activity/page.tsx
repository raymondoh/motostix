import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { DashboardShell, DashboardHeader } from "@/components";
import { AdminActivityPageClient } from "@/components";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchActivityLogs } from "@/actions/dashboard/activity-logs";

import type { SerializedActivity } from "@/types/firebase/activity";

export const metadata: Metadata = {
  title: "Activity Log - Admin",
  description: "View all recent activity across the platform."
};

export default async function AdminActivityPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/not-authorized");
  }

  // ✅ Fetch initial logs on the server
  const result = await fetchActivityLogs({ limit: 10 });
  const logs: SerializedActivity[] = result.success && Array.isArray(result.activities) ? result.activities : [];
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
        <AdminActivityPageClient initialLogs={logs} /> {/* ✅ pass logs as prop */}
      </div>
    </DashboardShell>
  );
}
