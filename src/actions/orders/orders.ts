// src/firebase/admin/orders.ts

import { z } from "zod";
import { auth } from "@/auth"; // ✅ Your server auth (already knows how to get session)
import { adminDb } from "@/firebase/admin/firebase-admin-init"; // ✅ Use your real adminDb setup
import { serverTimestamp } from "@/firebase/admin/firestore"; // ✅ Consistent timestamps
import { isFirebaseError, firebaseError } from "@/utils/firebase-error"; // ✅ Proper error handling

// ================== Order Schema ==================
const orderSchema = z.object({
  paymentIntentId: z.string(),
  amount: z.number().positive(),
  customerEmail: z.string().email(),
  customerName: z.string(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().int().positive()
      })
    )
    .optional(),
  shippingAddress: z
    .object({
      address: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string()
    })
    .optional(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional()
});

type OrderData = z.infer<typeof orderSchema>;

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
