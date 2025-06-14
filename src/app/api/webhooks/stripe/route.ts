// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers"; // Import headers to get Stripe-Signature
import { createOrder } from "@/firebase/admin/orders";
import type { OrderData } from "@/types/order";
// REMOVE CartItem import, it's not relevant for webhooks
// import type { CartItem } from "@/contexts/CartContext";
// REMOVE checkout config imports, not directly used in webhook logic
// import { SHIPPING_CONFIG, DEFAULT_CURRENCY } from "@/config/checkout";

// Initialize Stripe with your secret key (same as other backend files)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil"
});

// IMPORTANT: Define your Stripe webhook secret
// This should be set in your .env.local file (e.g., STRIPE_WEBHOOK_SECRET=whsec_...)
const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text(); // Webhook bodies are raw text, not JSON
  const signature = (await headers()).get("stripe-signature");

  let event: Stripe.Event;

  try {
    // 1. Verify the webhook signature for security
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
    console.log(`✅ Webhook received: ${event.type}`); // Log successful receipt
  } catch (err: any) {
    // If verification fails, return 400 Bad Request
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 2. Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent succeeded: ${paymentIntentSucceeded.id}`);
      try {
        const shipping = paymentIntentSucceeded.shipping;
        if (!shipping) {
          console.error("🚫 Missing shipping information on PaymentIntent");
          break;
        }

        const orderData: OrderData = {
          paymentIntentId: paymentIntentSucceeded.id,
          amount: (paymentIntentSucceeded.amount_received ?? paymentIntentSucceeded.amount) / 100,
          currency: paymentIntentSucceeded.currency ?? "gbp",
          userId: paymentIntentSucceeded.metadata?.userId ?? null,
          customerEmail: paymentIntentSucceeded.receipt_email ?? paymentIntentSucceeded.metadata?.email ?? "",
          customerName: shipping.name ?? "",
          shippingAddress: {
            name: shipping.name ?? "",
            address: shipping.address?.line1 ?? "",
            city: shipping.address?.city ?? "",
            state: shipping.address?.state ?? "",
            zipCode: shipping.address?.postal_code ?? "",
            country: shipping.address?.country ?? ""
          },
          items: paymentIntentSucceeded.metadata?.items ? JSON.parse(paymentIntentSucceeded.metadata.items) : [],
          status: "processing"
        };

        const result = await createOrder(orderData);
        if (!result.success) {
          console.error("❌ Failed to create order:", result.error);
        } else {
          console.log(`✅ Order ${result.orderId} created from webhook.`);
        }
      } catch (hookErr) {
        console.error("❌ Webhook order handling error:", hookErr);
      }
      break;

    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ PaymentIntent failed: ${paymentIntentFailed.id}`);
      // TODO: Here you would typically:
      //  - Update order status to 'payment_failed'
      //  - Notify the customer that payment failed
      break;

    case "checkout.session.completed":
      // If you were using Stripe Checkout Sessions, this is where you'd fulfill the order.
      // Since you're using Payment Intents directly, 'payment_intent.succeeded' is more relevant.
      // However, it's good practice to log or handle this if a Checkout Session happens for other reasons.
      const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session;
      console.log(`✅ Checkout Session completed: ${checkoutSessionCompleted.id}`);
      // You can get the Payment Intent ID from checkoutSessionCompleted.payment_intent
      // and use that to update your order if necessary.
      break;

    // Add more event types as needed (e.g., 'charge.refunded', 'customer.created', etc.)
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  // 3. Return a 200 response to Stripe to acknowledge receipt of the event
  return new NextResponse("OK", { status: 200 });
}

// IMPORTANT: Set config for raw body parsing
// This tells Next.js to provide the raw request body as a stream,
// which is necessary for Stripe's webhook signature verification.
export const config = {
  api: {
    bodyParser: false // Disable Next.js body parsing
  }
};
