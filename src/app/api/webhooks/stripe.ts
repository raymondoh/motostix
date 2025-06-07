// // src/app/api/webhooks/stripe.ts

// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { headers } from "next/headers";
// import { createOrderAction } from "@/actions/orders/create-order";
// import type { Order } from "@/types/order";

// // Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-05-28.basil" // Reverted to a valid, recent API version
// });

// // Get the webhook secret from environment variables
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(req: Request) {
//   const body = await req.text();
//   // FIX 1: Await the headers() function call
//   const signature = headers().get("stripe-signature")!;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//   } catch (err: any) {
//     console.error(`❌ Error verifying webhook signature: ${err.message}`);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   // Handle the event
//   switch (event.type) {
//     case "checkout.session.completed":
//       const sessionWithLineItems = await stripe.checkout.sessions.retrieve(event.data.object.id, {
//         expand: ["line_items.data.price.product"] // FIX 2: Expand to get full product details
//       });

//       // Guard against missing data
//       if (!sessionWithLineItems) {
//         return new Response("Webhook Error: Session not found.", { status: 404 });
//       }

//       // FIX 3: Construct the order data from the retrieved & expanded session object
//       const orderData: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
//         paymentIntentId: sessionWithLineItems.id,
//         amount: (sessionWithLineItems.amount_total ?? 0) / 100,
//         currency: sessionWithLineItems.currency ?? "gbp",
//         userId: sessionWithLineItems.metadata?.userId ?? null,
//         customerName:
//           sessionWithLineItems.shipping_details?.name ?? sessionWithLineItems.customer_details?.name ?? "N/A",
//         customerEmail: sessionWithLineItems.customer_details?.email ?? "N/A",
//         shippingAddress: {
//           name: sessionWithLineItems.shipping_details?.name ?? "",
//           address: sessionWithLineItems.shipping_details?.address?.line1 ?? "",
//           city: sessionWithLineItems.shipping_details?.address?.city ?? "",
//           state: sessionWithLineItems.shipping_details?.address?.state ?? "",
//           zipCode: sessionWithLineItems.shipping_details?.address?.postal_code ?? "",
//           country: sessionWithLineItems.shipping_details?.address?.country ?? ""
//         },
//         items:
//           sessionWithLineItems.line_items?.data.map(item => {
//             const product = item.price?.product as Stripe.Product;
//             return {
//               name: product.name,
//               // Assuming price is in cents/pence and you want to store it as a base unit
//               price: (item.price?.unit_amount ?? 0) / 100,
//               quantity: item.quantity ?? 0,
//               image: product.images?.[0] ?? ""
//             };
//           }) ?? [],
//         status: "processing" // Initial status
//       };

//       try {
//         await createOrderAction(orderData);
//         console.log("✅ Order created successfully for session:", sessionWithLineItems.id);
//       } catch (orderError) {
//         console.error("❌ Failed to create order:", orderError);
//         return new Response("Webhook handler failed to create order.", { status: 500 });
//       }
//       break;

//     default:
//       console.warn(`Unhandled event type ${event.type}`);
//   }

//   return NextResponse.json({ received: true });
// }
// src/app/api/webhooks/stripe.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createOrderAction } from "@/actions/orders/create-order";
import type { OrderData } from "@/types/order";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as const // Using a valid, recent API version
});

// Get the webhook secret from environment variables
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

  // Handle the 'checkout.session.completed' event
  if (event.type === "checkout.session.completed") {
    try {
      // Retrieve the full session object and expand the line items to get product details
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
        expand: ["line_items.data.price.product"]
      });

      if (!session) {
        throw new Error("Webhook Error: Session not found in retrieve call.");
      }

      // Assemble the data needed to create an order in your database
      const orderData: OrderData = {
        paymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? "N/A"),
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "gbp",
        userId: session.metadata?.userId ?? null, // Get userId from metadata
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
              image: product.images?.[0] ?? ""
              // You may need to add other fields like productId if your Order type requires it
            };
          }) ?? [],
        status: "processing"
      };

      // Call the server action to create the order in Firestore
      const result = await createOrderAction(orderData);

      if (result.success) {
        console.log(`✅ Order ${result.orderId} created successfully for session:`, session.id);
      } else {
        throw new Error(result.error || "createOrderAction returned success:false");
      }
    } catch (orderError) {
      console.error("❌ Failed to create order from webhook:", orderError);
      return new Response("Webhook handler failed to create order.", { status: 500 });
    }
  } else {
    console.warn(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
