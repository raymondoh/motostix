// ✅ src/actions/client/fetch-all-orders-client.ts

"use client";

import { fetchAllOrders } from "@/actions/orders/fetch-all-orders";
import type { Order } from "@/types/order";

/**
 * Client-side action: Fetches all orders for admin
 */
export async function fetchAllOrdersClient(): Promise<Order[]> {
  try {
    const orders = await fetchAllOrders();
    return orders;
  } catch (error) {
    console.error("Error fetching all admin orders:", error);
    throw new Error("Failed to fetch admin orders.");
  }
}
