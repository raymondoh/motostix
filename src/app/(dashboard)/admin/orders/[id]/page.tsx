import { notFound } from "next/navigation";
import { DashboardShell, DashboardHeader } from "@/components";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/firebase/admin/orders";
import { auth } from "@/auth";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/utils/date";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View full details of an order"
};

interface OrderDetailPageProps {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    notFound();
  }

  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={`Order #${order.id.slice(0, 8).toUpperCase()}`} text="Order details below." />
      <Separator className="mb-6" />

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{order.createdAt ? formatDate(order.createdAt) : "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span>
            {order.customerName} ({order.customerEmail})
          </span>
        </div>
        <div className="flex justify-between">
          <span>Total:</span>
          <span>{formatCurrency(order.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="capitalize">{order.status}</span>
        </div>
        <Separator />
        <div>
          <h3 className="font-semibold mb-2">Items:</h3>
          <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.quantity} × {item.name} @ {formatCurrency(item.price)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}
