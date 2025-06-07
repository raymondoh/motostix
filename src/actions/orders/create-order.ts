"use server";

import { createOrder as createOrderInDb } from "@/firebase/admin/orders";
import { revalidatePath } from "next/cache";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import type { OrderData } from "@/types/order";

// This action is now a simple pass-through to your database logic.
// The auth check has been removed because authentication is verified by the webhook's signature.
export async function createNewOrder(orderData: OrderData) {
  try {
    const result = await createOrderInDb(orderData);

    if (result.success) {
      // Revalidate paths to update user and admin order pages instantly
      revalidatePath("/user/orders");
      revalidatePath("/admin/orders");
      // You might also want to revalidate the specific order pages if needed
      // if (result.orderId) {
      //   revalidatePath(`/user/orders/${result.orderId}`);
      //   revalidatePath(`/admin/orders/${result.orderId}`);
      // }
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

// These exports allow you to call the function with different names
export { createNewOrder as createOrder };
export const createOrderAction = createNewOrder;
