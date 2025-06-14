// // src/app/api/create-payment-intent/route.ts
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { paymentIntentBodySchema } from "@/schemas/ecommerce/stripe";
// import { DEFAULT_CURRENCY } from "@/config/checkout";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { amount, currency, shipping, receipt_email } = paymentIntentBodySchema.parse(body);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount),
//       currency: currency || DEFAULT_CURRENCY.toLowerCase(),
//       automatic_payment_methods: { enabled: true },
//       automatic_tax: { enabled: true },

//       shipping: {
//         name: shipping.name,
//         phone: shipping.phone,
//         address: {
//           line1: shipping.address.line1,
//           city: shipping.address.city,
//           state: shipping.address.state,
//           postal_code: shipping.address.postal_code,
//           country: shipping.address.country
//         }
//       },
//       receipt_email: receipt_email, // FIX: Removed ?? null, as Stripe expects string | undefined
//       metadata: {
//         email: receipt_email ?? "", // Keep this to ensure metadata is always a string
//         fullName: shipping.name,
//         phone: shipping.phone,
//         addressLine1: shipping.address.line1,
//         city: shipping.address.city,
//         country: shipping.address.country
//       }
//     });

//     return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error: any) {
//     console.error("[STRIPE_ERROR]", error);
//     if (error.name === "ZodError") {
//       return NextResponse.json(
//         { error: "Invalid request data. Please check your shipping details.", details: error.errors },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json({ error: error.message || "Failed to create payment intent." }, { status: 500 });
//   }
// }
// src/app/api/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { paymentIntentBodySchema } from "@/schemas/ecommerce/stripe";
import { DEFAULT_CURRENCY } from "@/config/checkout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency, shipping, receipt_email } = paymentIntentBodySchema.parse(body);

    const paymentIntentParams: Stripe.PaymentIntentCreateParams & {
      automatic_tax?: { enabled: boolean };
    } = {
      amount: Math.round(amount),
      currency: currency || DEFAULT_CURRENCY.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      //automatic_tax: { enabled: true },
      automatic_tax: { enabled: true },

      shipping: {
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
      receipt_email: receipt_email, // FIX: Removed ?? null, as Stripe expects string | undefined
      metadata: {
        email: receipt_email ?? "", // Keep this to ensure metadata is always a string
        fullName: shipping.name,
        phone: shipping.phone,
        addressLine1: shipping.address.line1,
        city: shipping.address.city,
        country: shipping.address.country
      }
    };

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams as Stripe.PaymentIntentCreateParams);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("[STRIPE_ERROR]", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data. Please check your shipping details.", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message || "Failed to create payment intent." }, { status: 500 });
  }
}
