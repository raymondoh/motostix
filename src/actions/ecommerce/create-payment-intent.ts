// src/actions/orders/stripe/createPaymentIntent.ts
"use server";

// ================= Imports =================
import { z } from "zod";
import Stripe from "stripe";
import { paymentIntentSchema } from "@/schemas/ecommerce/stripe";
import { logger, logServerEvent } from "@/utils/logger";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import type { ActionResponse } from "@/types";
import { DEFAULT_CURRENCY } from "@/config/checkout";

// ================= Stripe Init =================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil"
});

// ================= Create Payment Intent =================
export async function createPaymentIntent(
  data: z.infer<typeof paymentIntentSchema>
): Promise<{ clientSecret: string } | ActionResponse> {
  try {
    const validated = paymentIntentSchema.parse(data);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: validated.amount,
      currency: DEFAULT_CURRENCY,
      automatic_payment_methods: { enabled: true },
      metadata: {
        customerName: validated.shipping.fullName,
        customerEmail: validated.shipping.email
      }
      //return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`
    });

    logger({
      type: "info",
      message: `PaymentIntent created for ${validated.shipping.email}`,
      metadata: { amount: validated.amount },
      context: "stripe"
    });

    await logServerEvent({
      type: "stripe:create_payment_intent",
      message: `Created PaymentIntent for ${validated.shipping.email}`,
      metadata: { amount: validated.amount },
      context: "stripe"
    });

    return { clientSecret: paymentIntent.client_secret! };
  } catch (error: unknown) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error creating payment intent";

    logger({
      type: "error",
      message: "Error creating PaymentIntent",
      metadata: { error: message },
      context: "stripe"
    });

    await logServerEvent({
      type: "stripe:create_payment_intent_error",
      message: "Failed to create PaymentIntent",
      metadata: { error: message },
      context: "stripe"
    });

    return { success: false, error: message };
  }
}
