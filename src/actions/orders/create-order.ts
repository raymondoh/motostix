// src/actions/orders/create-order.ts

"use server";
import { auth } from "@/auth";
import { createOrder } from "@/firebase/actions"; // ✅ Server-side Firestore write
import type { OrderData } from "@/firebase/admin/orders"; // ✅ Keep types consistent
import { logServerEvent, logger } from "@/utils/logger";

type CreateOrderResponse = {
  success: boolean;
  orderId?: string;
  error?: string;
};

export async function createOrderAction(orderData: OrderData): Promise<CreateOrderResponse> {
  const session = await auth();

  if (!session?.user) {
    logger({
      type: "warn",
      message: "Unauthenticated user attempted to place an order",
      context: "orders"
    });

    return {
      success: false,
      error: "You must be signed in to place an order."
    };
  }

  try {
    const result = await createOrder(orderData);

    if (!result.success) {
      logger({
        type: "error",
        message: "Order creation failed",
        context: "orders",
        metadata: { error: result.error, userId: session.user.id }
      });

      return { success: false, error: result.error || "Failed to create order." };
    }

    logger({
      type: "info",
      message: `Order created: ${result.orderId}`,
      context: "orders",
      metadata: { userId: session.user.id }
    });

    await logServerEvent({
      type: "order:created",
      message: `New order placed by ${session.user.email}`,
      userId: session.user.id,
      metadata: {
        orderId: result.orderId,
        amount: orderData.amount,
        email: orderData.customerEmail
      }
    });

    return {
      success: true,
      orderId: result.orderId
    };
  } catch (error) {
    logger({
      type: "error",
      message: "Unexpected error during order creation",
      context: "orders",
      metadata: { error, userId: session.user.id }
    });

    return { success: false, error: "Unexpected error occurred." };
  }
}
