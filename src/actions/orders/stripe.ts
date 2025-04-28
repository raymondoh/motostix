"use server";

import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil"
});

// Validate payment intent request
const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  shipping: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  })
});

export async function createPaymentIntent(data: z.infer<typeof paymentIntentSchema>) {
  try {
    // Validate input data
    const validatedData = paymentIntentSchema.parse(data);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: validatedData.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        customerName: validatedData.shipping.fullName,
        customerEmail: validatedData.shipping.email
      }
    });

    return {
      clientSecret: paymentIntent.client_secret
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
}
