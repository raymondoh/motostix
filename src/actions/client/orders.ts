"use client";

import { fetchUserOrders } from "@/actions/orders/fetch-user-orders";
import type { Order } from "@/types/order";

/**
 * Client-side action: Fetches the user's orders safely.
 */
export async function fetchUserOrdersClient(): Promise<Order[]> {
  try {
    const orders = await fetchUserOrders();

    // Because orders from fetchUserOrders() are like OrderData[], we manually map to Order[]
    const mappedOrders: Order[] = orders.map((order: any) => ({
      id: order.id ?? "", // fallback empty string if missing
      userId: order.userId ?? "", // fallback empty string if missing
      paymentIntentId: order.paymentIntentId,
      amount: order.amount,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      items: order.items ?? [],
      shippingAddress: order.shippingAddress ?? {
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      },
      status: order.status ?? "processing",
      createdAt: order.createdAt ? new Date(order.createdAt) : undefined,
      updatedAt: order.updatedAt ? new Date(order.updatedAt) : undefined
    }));

    return mappedOrders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch your orders.");
  }
}
