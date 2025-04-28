import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/firebase/actions";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  // For testing without a webhook secret
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("STRIPE_WEBHOOK_SECRET is not set. Skipping signature verification.");
    try {
      const event = JSON.parse(body) as Stripe.Event;
      await handleStripeEvent(event);
      return NextResponse.json({ received: true });
    } catch (err) {
      console.error(`Error parsing webhook: ${err}`);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  }

  // Normal webhook handling with signature verification
  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    await handleStripeEvent(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err}`);
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Create order in your database
      await createOrder({
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        customerEmail: paymentIntent.metadata.customerEmail || "",
        customerName: paymentIntent.metadata.customerName || ""
        // Add more order details as needed
      });

      console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
      break;

    // Add other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}
