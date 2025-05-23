import { NextResponse } from "next/server";
//import { getServerAuthSession } from "@/lib/auth";
import { auth } from "@/auth";
import { fetchUserOrders } from "@/actions/orders/fetch-user-orders";
import { logger } from "@/utils/logger";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user's orders
    const orders = await fetchUserOrders();

    // Return the orders as JSON
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    //logger.error("Error fetching orders from API", { error });
    console.log("Error fetching orders from API", { error });

    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
