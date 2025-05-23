"use server";

import { updateOrderStatus } from "@/firebase/actions";
//import type { OrderStatus } from "@/types/order";
import type { Order } from "@/types";

export async function updateOrderStatusAction(orderId: string, newStatus: Order.OrderStatus) {
  const result = await updateOrderStatus(orderId, newStatus);

  if (!result.success) {
    return {
      success: false,
      error: result.error || "Failed to update order status"
    };
  }

  return { success: true };
}
