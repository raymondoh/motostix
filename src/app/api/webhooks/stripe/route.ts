//src/app/api/webhooks/stripe/route.ts
import { Stripe } from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createOrderAction } from "@/actions/orders/create-order";
import type { OrderData } from "@/types/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil"
});

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const headerList = await headers();
    const stripeSignature = headerList.get("stripe-signature");

    event = stripe.webhooks.constructEvent(
      await req.text(), // ✅ DO NOT PARSE JSON
      stripeSignature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Error verifying webhook signature:", errorMessage);
    return NextResponse.json({ message: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("📦 Checkout session completed:", session.id);

      // If you're using `expand`, you can optionally fetch more detail here:
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product", "payment_intent"]
      });

      const paymentIntent = fullSession.payment_intent as Stripe.PaymentIntent;
      const shipping = paymentIntent?.shipping;

      if (!session.metadata?.userId || !shipping?.address || !session.customer_details?.email) {
        throw new Error("Missing required order data.");
      }

      const orderData: OrderData = {
        paymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? "unknown"),

        amount: (session.amount_total ?? 0) / 100,
        customerEmail: session.customer_details.email,
        customerName: shipping.name ?? session.customer_details.name ?? "N/A",
        userId: session.metadata.userId,
        status: "processing",

        shippingAddress: {
          name: shipping.name ?? "",
          address: shipping.address.line1 ?? "",
          city: shipping.address.city ?? "",
          state: shipping.address.state ?? "",
          zipCode: shipping.address.postal_code ?? "",
          country: shipping.address.country ?? ""
        },

        items: (session.line_items?.data ?? []).map(item => {
          const product = item.price?.product as Stripe.Product;
          return {
            name: product?.name ?? "Unknown Product",
            price: (item.price?.unit_amount ?? 0) / 100,
            quantity: item.quantity ?? 1,
            productId: product?.id ?? "unknown"
          };
        })
      };

      const result = await createOrderAction(orderData);
      console.log(result);

      if (!result.success) {
        console.error("❌ Order creation failed:", result.error);
        return NextResponse.json({ message: result.error }, { status: 500 });
      }

      console.log("✅ Order created:", result.orderId);
    } catch (err) {
      console.error("❌ Order handler error:", err);
      return NextResponse.json({ message: "Failed to handle order" }, { status: 500 });
    }
  } else {
    console.log("ℹ️ Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
