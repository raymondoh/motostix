// src/pages/api/webhooks/stripe.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/firebase/actions";
import { logger, logServerEvent } from "@/utils/logger";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
//import type { OrderData } from "@/types/order";
import type { OrderData } from "@/firebase/admin/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil"
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  // === DEVELOPMENT FALLBACK ===
  if (!webhookSecret) {
    logger({
      type: "warn",
      message: "STRIPE_WEBHOOK_SECRET not set. Skipping signature verification.",
      context: "stripe"
    });

    try {
      event = JSON.parse(body);
    } catch (error) {
      logger({
        type: "error",
        message: "Failed to parse webhook without secret",
        metadata: { error },
        context: "stripe"
      });
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      logger({
        type: "error",
        message: "Stripe signature verification failed",
        metadata: { error },
        context: "stripe"
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  // === HANDLE EVENTS ===
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const amount = paymentIntent.amount / 100;
        const customerEmail = paymentIntent.metadata.customerEmail || "";
        const customerName = paymentIntent.metadata.customerName || "";

        const result = await createOrder({
          paymentIntentId: paymentIntent.id,
          amount,
          customerEmail,
          customerName
          // Add shipping fields if you're collecting them via metadata
        });

        if (result.success) {
          console.log(`[webhook] Order created for ${customerEmail}`);
        } else {
          console.error(`[webhook] Failed to create order: ${result.error}`);
        }
        break;
      }

      default:
        logger({
          type: "warn",
          message: `Unhandled Stripe event: ${event.type}`,
          context: "stripe"
        });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error handling webhook";

    logger({
      type: "error",
      message: "Error handling Stripe webhook",
      metadata: { error: message },
      context: "stripe"
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
