import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createOrderAction } from "@/actions/orders/create-order";
import type { OrderData } from "@/types/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil" // Reverted to a valid, recent API version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error verifying webhook signature: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
        expand: ["line_items.data.price.product"]
      });

      if (!session) {
        throw new Error("Webhook Error: Session not found.");
      }

      // Assemble the data for our order
      const orderData: OrderData = {
        paymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? "N/A"),
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "gbp",
        userId: session.metadata?.userId ?? null,
        customerName: session.shipping_details?.name ?? session.customer_details?.name ?? "N/A",
        customerEmail: session.customer_details?.email ?? "N/A",
        shippingAddress: {
          name: session.shipping_details?.name ?? "",
          address: session.shipping_details?.address?.line1 ?? "",
          city: session.shipping_details?.address?.city ?? "",
          state: session.shipping_details?.address?.state ?? "",
          zipCode: session.shipping_details?.address?.postal_code ?? "",
          country: session.shipping_details?.address?.country ?? ""
        },
        items:
          session.line_items?.data.map(item => {
            const product = item.price?.product as Stripe.Product;
            return {
              name: product.name,
              price: (item.price?.unit_amount ?? 0) / 100,
              quantity: item.quantity ?? 0,
              image: product.images?.[0] ?? "",
              productId: product.id
            };
          }) ?? [],
        status: "processing"
      };

      const result = await createOrderAction(orderData);

      if (!result.success) {
        throw new Error(result.error || "createOrderAction failed.");
      }

      console.log(`✅ Order ${result.orderId} created successfully.`);
    } catch (orderError) {
      console.error("❌ Failed to create order from webhook:", orderError);
      return new Response("Webhook handler failed to create order.", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
