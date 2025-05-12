// // src/app/dashboard/admin/orders/page.tsx

// import { Metadata } from "next";
// import { DashboardShell, DashboardHeader } from "@/components";
// import { Separator } from "@/components/ui/separator";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { fetchAllOrders } from "@/actions/orders/fetch-all-orders";
// import { AdminOrdersClient } from "@/components/dashboard/admin/orders/AdminOrdersClient";

// export const metadata: Metadata = {
//   title: "Manage Orders - Admin",
//   description: "View and manage all customer orders."
// };

// export default async function AdminOrdersPage() {
//   const session = await auth();

//   if (!session?.user?.id || session.user.role !== "admin") {
//     redirect("/not-authorized");
//   }

//   const orders = await fetchAllOrders();

//   return (
//     <DashboardShell>
//       <DashboardHeader heading="Order Management" text="View and manage all customer orders." />
//       <Separator className="mb-8" />
//       <div className="w-full overflow-hidden">
//         <AdminOrdersClient orders={orders} />
//       </div>
//     </DashboardShell>
//   );
// }
import type { Metadata } from "next";
import { DashboardShell, DashboardHeader } from "@/components";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchAllOrders } from "@/actions/orders/fetch-all-orders";
import { AdminOrdersClient } from "@/components/dashboard/admin/orders/AdminOrdersClient";

export const metadata: Metadata = {
  title: "Manage Orders - Admin",
  description: "View and manage all customer orders."
};

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/not-authorized");
  }

  const orders = await fetchAllOrders();

  return (
    <DashboardShell>
      <DashboardHeader
        title="Order Management"
        description="View and manage all customer orders."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Orders" }]}
      />
      <Separator className="mb-8" />
      <div className="w-full overflow-hidden">
        <AdminOrdersClient orders={orders} />
      </div>
    </DashboardShell>
  );
}
