import { NextResponse } from "next/server";
import { fetchUserOrders } from "@/actions/orders/fetch-user-orders";
import { logger } from "@/utils/logger";

export async function GET() {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user's orders
    const { success, orders, error } = await fetchUserOrders();

    if (!success) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    // Return the orders as JSON
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    logger({
      type: "error",
      message: "Error fetching orders from API",
      metadata: { error },
      context: "api-orders"
    });

    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
