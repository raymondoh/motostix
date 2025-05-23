import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getOrderById } from "@/firebase/admin/orders";
import { UserOrderDetailCard } from "@/components/dashboard/user/orders/UserOrderDetailCard";
import { DashboardShell, DashboardHeader } from "@/components";
import { Separator } from "@/components/ui/separator";

export default async function UserOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) return notFound();

  const order = await getOrderById(id);
  if (!order || order.userId !== session.user.id) return notFound();

  return (
    <DashboardShell>
      <DashboardHeader title="Order Detail" description={`Order ID: ${order.id.slice(0, 8).toUpperCase()}`} />
      <Separator className="mb-8" />
      <div className="max-w-3xl space-y-6">
        <UserOrderDetailCard order={order} />
      </div>
    </DashboardShell>
  );
}
