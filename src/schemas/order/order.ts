// src/schemas/order/order.ts
// ================== Imports ==================
import { z } from "zod";

// ================== Order Schema ==================

// ✅ Validation schema for creating an order
export const orderSchema = z.object({
  // Add userId as an optional, nullable string
  userId: z.string().nullable().optional(),

  paymentIntentId: z.string(),
  amount: z.number(),
  customerEmail: z.string().email(),
  customerName: z.string(),
  items: z
    .array(
      z.object({
        // Assuming your items from Stripe have this shape
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        image: z.string().optional()
      })
    )
    .optional(),
  shippingAddress: z
    .object({
      name: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string()
    })
    .optional(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
  // Add any other fields you pass from the webhook, like currency
  currency: z.string().optional()
});

// You can also export the inferred type for use elsewhere
export type OrderData = z.infer<typeof orderSchema>;
