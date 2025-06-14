import { NextResponse } from "next/server";
import Stripe from "stripe";
import { paymentIntentSchema } from "@/schemas/ecommerce/stripe";
import { DEFAULT_CURRENCY } from "@/config/checkout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, shipping } = paymentIntentSchema.parse(body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: DEFAULT_CURRENCY,
      automatic_payment_methods: { enabled: true },
      shipping: {
        name: shipping.fullName,
        phone: shipping.phone,
        address: {
          line1: shipping.address,
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.zipCode,
          country: shipping.country
        }
      },
      receipt_email: shipping.email,
      metadata: { email: shipping.email }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("[STRIPE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create payment intent." }, { status: 500 });
  }
}
