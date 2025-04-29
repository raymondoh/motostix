// src/actions/orders/fetch-all-orders.ts

"use server";

import { getAllOrders } from "@/firebase/actions";
import type { Order } from "@/types/order";

/**
 * Server Action: Fetch all orders (admin only)
 */
export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const orders = await getAllOrders();
    return orders;
  } catch (error) {
    console.error("Error fetching all orders (admin):", error);
    throw new Error("Failed to fetch orders");
  }
}
