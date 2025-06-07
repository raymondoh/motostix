// ===============================
// 📂 src/firebase/admin/orders.ts
// ===============================

// ================= Imports =================
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase/admin/initialize";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { orderSchema } from "@/schemas/order";
import type { Order, OrderData } from "@/types/order";
import { logger } from "@/utils/logger";
import { TAX_RATE, SHIPPING_CONFIG } from "@/config/checkout";

// ================= Types =================
export type { OrderData };

// ================= Helper Functions =================

/**
 * Maps a Firestore document to an OrderData object
 */
function mapDocToOrder(doc: any): Order {
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

// Server timestamp helper
export const serverTimestamp = () => {
  return FieldValue.serverTimestamp();
};

// ================= Firestore Functions =================

/**
 * Creates a new order in Firestore
 */
// export async function createOrder(orderData: OrderData) {
//   try {
//     // ✅ Validate incoming data
//     const validatedData = orderSchema.parse(orderData);

//     // Dynamic import to avoid build-time initialization
//     const { auth } = await import("@/auth");

//     // ✅ Get current user session
//     const session = await auth();
//     if (!session?.user?.id) {
//       return { success: false, error: "Unauthorized. Please sign in." };
//     }

//     // ✅ Calculate total amount
//     if (!validatedData.items || validatedData.items.length === 0) {
//       return { success: false, error: "No items provided in order." };
//     }

//     const subtotal = validatedData.items.reduce((total, item) => {
//       return total + item.price * item.quantity;
//     }, 0);

//     const tax = subtotal * TAX_RATE;
//     const shipping = subtotal > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate;
//     const total = subtotal + tax + shipping;

//     // ✅ Create the order document in Firestore
//     const db = getAdminFirestore();
//     const orderRef = await db.collection("orders").add({
//       ...validatedData,
//       userId: session.user.id,
//       status: validatedData.status || "processing",
//       amount: subtotal, // 💸 Base amount (subtotal)
//       tax,
//       shipping,
//       total, // ✅ Final total saved separately
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     });

//     return {
//       success: true,
//       orderId: orderRef.id
//     };
//   } catch (error) {
//     console.error("Error creating order:", error);

//     logger({
//       type: "error",
//       message: "Failed to create order",
//       metadata: { error },
//       context: "orders"
//     });

//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//         ? error.message
//         : "Unknown error while creating order";

//     return {
//       success: false,
//       error: message
//     };
//   }
// }

// ...

/**
 * Creates a new order in Firestore
 */
export async function createOrder(orderData: OrderData) {
  try {
    const validatedData = orderSchema.parse(orderData);

    // REMOVED: The auth() check has been removed from this function.
    // We will trust the userId provided in the orderData from the webhook.

    if (!validatedData.userId) {
      return { success: false, error: "No user ID provided in order data." };
    }

    // This calculation logic seems incorrect for this function,
    // as the final amount is already provided by Stripe.
    // Let's use the amount from the validated data directly.
    const finalAmount = validatedData.amount;

    const db = getAdminFirestore();
    const orderRef = await db.collection("orders").add({
      ...validatedData,
      // Use the userId from the validated data, not from a session object
      userId: validatedData.userId,
      status: validatedData.status || "processing",
      amount: finalAmount, // Use the amount passed from the Stripe session
      // tax, shipping, and total can also be passed from Stripe if needed
      // or calculated here if that's your business logic. For now, let's rely on the passed amount.
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      orderId: orderRef.id
    };
  } catch (error) {
    // ... (your existing error handling is good)
    console.error("Error creating order:", error);
    const message = error instanceof Error ? error.message : "Unknown error while creating order";
    return { success: false, error: message };
  }
}

// ... (the rest of the file remains the same)

/**
 * Fetches all orders belonging to a specific user
 */
export async function getUserOrders(userId: string) {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("orders").where("userId", "==", userId).orderBy("createdAt", "desc").get();

    const orders = snapshot.docs.map(mapDocToOrder);

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch user orders");
  }
}

// ================= Get All Orders Function (Admin Only) =================

/**
 * Fetches all orders (Admin use)
 */
export async function getAllOrders() {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();

    const orders = snapshot.docs.map(mapDocToOrder);

    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);

    logger({
      type: "error",
      message: "Failed to fetch all orders",
      metadata: { error },
      context: "orders"
    });

    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
        ? error.message
        : "Unknown error while fetching all orders";

    throw new Error(message);
  }
}

/**
 * Fetches a single order by ID (Admin use)
 */
export async function getOrderById(id: string) {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("orders").doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return mapDocToOrder(doc);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    logger({
      type: "error",
      message: "Failed to fetch order by ID",
      metadata: { error, id },
      context: "orders"
    });

    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
        ? error.message
        : "Unknown error while fetching order";

    throw new Error(message);
  }
}

/**
 * Update a single order by ID (Admin use)
 */
export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  try {
    const db = getAdminFirestore();
    await db.collection("orders").doc(orderId).update({
      status,
      updatedAt: serverTimestamp()
    });

    logger({
      type: "order:status",
      message: `Order status updated to ${status}`,
      context: "orders",
      metadata: { orderId, status }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    logger({
      type: "error",
      message: "Failed to update order status",
      context: "orders",
      metadata: { orderId, error }
    });

    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
        ? error.message
        : "Unknown error while updating order status";

    return { success: false, error: message };
  }
}
