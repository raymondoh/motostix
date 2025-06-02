import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DashboardShell, DashboardHeader } from "@/components";
import { getOrderById } from "@/firebase/admin/orders";
import { UserService } from "@/lib/services/user-service";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    // Check admin role using UserService
    const userRole = await UserService.getUserRole(session.user.id);
    if (userRole !== "admin") {
      redirect("/not-authorized");
    }

    // Await params for Next.js 15 compatibility
    const { id } = await params;

    // Fetch order details
    const order = await getOrderById(id);

    if (!order) {
      redirect("/admin/orders");
    }

    return (
      <DashboardShell>
        <DashboardHeader
          title={`Order #${order.id}`}
          description="Order details and management"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Orders", href: "/admin/orders" },
            { label: `Order #${order.id}` }
          ]}
        />
        <Separator className="mb-8" />

        <div className="w-full max-w-4xl space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Order Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p>{order.customerName || order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold">${order.amount}</p>
              </div>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.shippingAddress && (
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              {/* <div className="text-sm">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div> */}
            </div>
          )}
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error in AdminOrderDetailPage:", error);
    redirect("/admin/orders");
  }
}
