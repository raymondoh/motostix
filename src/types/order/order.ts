import { orderSchema } from "@/schemas/order";
import { z } from "zod";
// ✅ Type used when **fetching** an existing order from Firestore
export type Order = {
  id: string;
  paymentIntentId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  userId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: Date; // ✅ Now correct — will match mapped Date
  updatedAt?: Date;
};
// ================== Order Types ==================

// ✅ Type used when **creating** a new order (before Firestore writes it)
export type OrderData = z.infer<typeof orderSchema>;
