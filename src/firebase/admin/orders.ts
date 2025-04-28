// ===============================
// 📂 src/firebase/admin/orders.ts
// ===============================

// ================= Imports =================
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "@/auth"; // ✅ Server auth (current session)
import { adminDb } from "@/firebase/admin/firebase-admin-init"; // ✅ Firestore admin DB
import { serverTimestamp } from "@/firebase/admin/firestore"; // ✅ Firestore timestamps
import { isFirebaseError, firebaseError } from "@/utils/firebase-error"; // ✅ Firebase error handling
import { orderSchema } from "@/schemas/order"; // ✅ Validation schema
import type { Order, OrderData } from "@/types/order"; // ✅ Type definitions
import { logger } from "@/utils/logger";

// ================= Types =================
export type { OrderData }; // ✅ Explicitly export OrderData here for Actions or elsewhere

// ================= Helper Functions =================

/**
 * Maps a Firestore document to an OrderData object
 */

function mapDocToOrder(doc: FirebaseFirestore.DocumentSnapshot): Order {
  const data = doc.data() ?? {};

  return {
    id: doc.id,
    paymentIntentId: data?.paymentIntentId || "",
    amount: data?.amount || 0,
    customerEmail: data?.customerEmail || "",
    customerName: data?.customerName || "",
    items: data?.items || [],
    shippingAddress: data?.shippingAddress || {},
    userId: data?.userId || "",
    status: data?.status || "processing",
    createdAt: data?.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data?.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined
  };
}

// ================= Firestore Functions =================

/**
 * Creates a new order in Firestore
 */
export async function createOrder(orderData: OrderData) {
  try {
    // Validate incoming data
    const validatedData = orderSchema.parse(orderData);

    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    // Create the order document
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

/**
 * Fetches all orders belonging to a specific user
 */
export async function getUserOrders(userId: string) {
  try {
    const snapshot = await adminDb
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map(mapDocToOrder);

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch user orders");
  }
}

// ================= Get All Orders Function (Admin Only) =================

// /**
//  * Fetches all orders for admin dashboard
//  */
export async function getAllOrders() {
  try {
    const snapshot = await adminDb.collection("orders").orderBy("createdAt", "desc").get();

    const orders = snapshot.docs.map(mapDocToOrder);

    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to fetch orders");
  }
}
