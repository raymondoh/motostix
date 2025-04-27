// src/firebase/admin/orders.ts

import { auth } from "@/auth"; // ✅ Your server auth (already knows how to get session)
import { adminDb } from "@/firebase/admin/firebase-admin-init"; // ✅ Use your real adminDb setup
import { serverTimestamp } from "@/firebase/admin/firestore"; // ✅ Consistent timestamps
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { orderSchema, type OrderData } from "@/types/order";
import { logger } from "@/utils/logger";

// ================== Create Order Function ==================

export async function createOrder(orderData: OrderData) {
  try {
    // ✅ Validate order data
    const validatedData = orderSchema.parse(orderData);

    // ✅ Get the currently logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    // ✅ Create the order in Firestore
    const orderRef = await adminDb.collection("orders").add({
      ...validatedData,
      userId: session.user.id,
      status: validatedData.status || "processing",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      orderId: orderRef.id
    };
  } catch (error) {
    console.error("Error creating order:", error);
    logger({ type: "error", message: "Failed to create order", metadata: { error }, context: "orders" });
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error while creating order";

    return {
      success: false,
      error: message
    };
  }
}
