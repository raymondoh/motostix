import { z } from "zod";

// Order validation schema
export const orderSchema = z.object({
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

// Infer the type
export type OrderData = z.infer<typeof orderSchema>;
