import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createOrderAction, createNewOrder } from "@/actions/orders/create-order";
import type { OrderData } from "@/types/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil"
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    console.error("❌ Stripe signature missing.");
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("🎯 Stripe webhook received:", event.type);
  } catch (err: any) {
    console.error("❌ Error verifying webhook signature:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    console.log("💡 Handling checkout.session.completed...");

    try {
      const sessionId = (event.data.object as Stripe.Checkout.Session).id;
      console.log("🔍 Session ID:", sessionId);

      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items.data.price.product", "payment_intent"]
      });

      const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
      const shipping = paymentIntent.shipping;

      if (!session) throw new Error("Session not found");

      console.log("📦 Session retrieved:", session.id);

      const orderData: OrderData = {
        paymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? "N/A"),
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "gbp",
        userId: session.metadata?.userId ?? null,
        customerName: shipping?.name ?? session.customer_details?.name ?? "N/A",
        customerEmail: session.customer_details?.email ?? "N/A",
        shippingAddress: {
          name: shipping?.name ?? "",
          address: shipping?.address?.line1 ?? "",
          city: shipping?.address?.city ?? "",
          state: shipping?.address?.state ?? "",
          zipCode: shipping?.address?.postal_code ?? "",
          country: shipping?.address?.country ?? ""
        },

        items: (session.line_items?.data ?? []).map(item => {
          const product = item.price?.product as Stripe.Product;
          return {
            name: product?.name ?? "Unknown Product",
            price: (item.price?.unit_amount ?? 0) / 100,
            quantity: item.quantity ?? 1,
            image: product?.images?.[0] ?? "",
            productId: product?.id ?? "unknown"
          };
        }),
        status: "processing"
      };

      console.log("📦 Prepared order data:", JSON.stringify(orderData, null, 2));

      //const result = await createOrderAction(orderData);
      const result = await createNewOrder(orderData);

      if (!result.success) {
        console.error("❌ Order creation failed:", result.error);
        throw new Error(result.error || "Unknown error");
      }

      console.log(`✅ Order ${result.orderId} created successfully.`);
    } catch (err) {
      console.error("❌ Failed to handle session:", err);
      return new Response("Webhook handler failed to create order.", { status: 500 });
    }
  } else {
    console.log("ℹ️ Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
