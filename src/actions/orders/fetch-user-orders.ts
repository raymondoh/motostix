// src/actions/orders/fetch-user-orders.ts

"use server";

import { auth } from "@/auth"; // To get session
import { getUserOrders } from "@/firebase/actions";
//import type { OrderData } from "@/types/order";
import type { Order } from "@/types";

/**
 * Server Action: Fetch user orders
 */
export async function fetchUserOrders(): Promise<Order.OrderData[]> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const orders = await getUserOrders(session.user.id);
  return orders;
}
