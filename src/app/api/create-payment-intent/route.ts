// src/app/api/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
// NEW: Import paymentIntentBodySchema instead of paymentIntentSchema
import { paymentIntentBodySchema } from "@/schemas/ecommerce/stripe";
import { DEFAULT_CURRENCY } from "@/config/checkout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // NEW: Use paymentIntentBodySchema for parsing the request body
    const { amount, currency, shipping, receipt_email } = paymentIntentBodySchema.parse(body);

    // Validate and use the received data to create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount is already in cents from frontend
      currency: currency || DEFAULT_CURRENCY.toLowerCase(), // Use provided currency or fallback
      automatic_payment_methods: { enabled: true },
      shipping: {
        // Use the validated shipping object directly from the body
        name: shipping.name,
        phone: shipping.phone,
        address: {
          line1: shipping.address.line1,
          city: shipping.address.city,
          state: shipping.address.state,
          postal_code: shipping.address.postal_code,
          country: shipping.address.country
        }
      },
      receipt_email: receipt_email, // Use the validated receipt_email
      metadata: {
        // Add metadata if needed, e.g., for tracking
        email: receipt_email || shipping.email, // Use receipt_email or shipping.email
        fullName: shipping.name,
        phone: shipping.phone,
        addressLine1: shipping.address.line1,
        city: shipping.address.city,
        country: shipping.address.country
        // You can add more metadata as needed
      }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("[STRIPE_ERROR]", error);
    // Provide a more user-friendly error message, especially for Zod errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data. Please check your shipping details.", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message || "Failed to create payment intent." }, { status: 500 });
  }
}
