// src/schemas/ecommerce/stripe.ts
import { z } from "zod";

// Define schema for shipping details
export const shippingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required")
});

// Define schema for payment intent creation
export const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  shipping: shippingSchema,
  return_url: z.string().url().optional() // ✅ allow client to pass return URL
});

export type ShippingSchema = z.infer<typeof shippingSchema>;
export type PaymentIntentSchema = z.infer<typeof paymentIntentSchema>;
// Export the inferred type for the form values
export type ShippingFormValues = z.infer<typeof shippingSchema>;
