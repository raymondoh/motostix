// src/schemas/ecommerce/ecommerce.ts
import { z } from "zod";
export const shippingFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "Please select a state" }),
  zipCode: z.string().min(5, { message: "Please enter a valid ZIP code" }),
  country: z.string().min(2, { message: "Please select a country" })
});

export type ShippingFormValues = z.infer<typeof shippingFormSchema>;
