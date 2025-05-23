import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell, DashboardHeader } from "@/components";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { UserOrdersClient } from "@/components/dashboard/user/orders/UserOrdersClient";

export const metadata: Metadata = {
  title: "Your Orders | MotorStix",
  description: "View all your past orders"
};

export default async function UserOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      {/* <DashboardHeader title="Your Orders" description="View and manage your order history." /> */}
      <DashboardHeader
        title="Your Orders"
        description="View and manage your order history."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/user" }, { label: "My Orders" }]}
      />
      <Separator className="mb-8" />

      {/* Added a container with overflow handling */}
      <div className="w-full overflow-hidden">
        <UserOrdersClient />
      </div>
    </DashboardShell>
  );
}
