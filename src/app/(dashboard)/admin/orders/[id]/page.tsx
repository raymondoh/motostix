// src/app/(dashboard)/admin/orders/[id]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell, DashboardHeader } from "@/components";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/firebase/admin/orders";
import { auth } from "@/auth";
import { AdminOrderDetailCard } from "@/components/dashboard/admin/orders/AdminOrdersDetailCard";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View full details of an order"
};

// interface OrderDetailPageProps {
//   params: { id: string };
// }

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    notFound();
  }

  const order = await getOrderById(orderId);
  if (!order) {
    notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={`Order #${order.id.slice(0, 8).toUpperCase()}`} text="Order details below." />
      <Separator className="mb-6" />
      <AdminOrderDetailCard order={order} />
    </DashboardShell>
  );
}
