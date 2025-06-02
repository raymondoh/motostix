"use server";

import { createOrder } from "@/firebase/admin/orders";
import { revalidatePath } from "next/cache";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import type { OrderData } from "@/types/order";

// Create a new order
export async function createNewOrder(orderData: OrderData) {
  try {
    // Dynamic import to avoid build-time initialization
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Create the order
    const result = await createOrder(orderData);

    if (result.success) {
      // Revalidate relevant paths
      revalidatePath("/user/orders");
      revalidatePath("/admin/orders");
    }

    return result;
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error creating order";
    return { success: false, error: message };
  }
}

// Export for backward compatibility
export { createNewOrder as createOrder };

// Export for checkout form
export const createOrderAction = createNewOrder;
