// src/actions/orders/create-order.ts

"use server";

import { createOrder } from "@/firebase/actions"; // ✅ Server-side Firestore write
import type { OrderData } from "@/firebase/admin/orders"; // ✅ Keep types consistent

// Action response type
type CreateOrderResponse = {
  success: boolean;
  orderId?: string;
  error?: string;
};

/**
 * Server Action: Create a new order
 */
export async function createOrderAction(orderData: OrderData): Promise<CreateOrderResponse> {
  try {
    const result = await createOrder(orderData);

    if (!result.success) {
      return { success: false, error: result.error || "Failed to create order." };
    }

    return {
      success: true,
      orderId: result.orderId
    };
  } catch (error) {
    console.error("Error in createOrderAction:", error);
    return { success: false, error: "Unexpected error occurred." };
  }
}
