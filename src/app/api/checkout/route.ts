// src/app/api/checkout/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";
import { siteConfig } from "@/config/siteConfig";
import type { CartItem } from "@/contexts/CartContext"; // 1. We now use this type

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil"
});

export async function POST(req: Request) {
  try {
    // 3. Renamed to 'authSession' to avoid conflict
    const authSession = await auth();
    if (!authSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized: You must be logged in to make a purchase." }, { status: 401 });
    }

    // 4. Explicitly type the incoming items array
    const { items }: { items: CartItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // 5. 'item' is now correctly typed as CartItem
    const line_items = items.map((item: CartItem) => {
      const unitAmount =
        item.product.onSale && item.product.salePrice && item.product.salePrice < item.product.price
          ? item.product.salePrice
          : item.product.price;

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.product.name,
            images: [item.product.image],
            description: item.product.description
          },
          unit_amount: Math.round(unitAmount * 100)
        },
        quantity: item.quantity
      };
    });

    const success_url = `${siteConfig.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${siteConfig.url}/`; // Redirect to home on cancel

    // 6. Renamed to 'stripeSession'
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url,
      cancel_url,
      // Pre-fill the user's email on the Stripe page for a better UX
      customer_email: authSession.user.email,
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA"]
      }
    });

    // The 'url' property will exist on the 'stripeSession' object
    if (stripeSession.url) {
      return NextResponse.json({ url: stripeSession.url }, { status: 200 });
    } else {
      throw new Error("Could not create Stripe Checkout session.");
    }
  } catch (error: unknown) {
    // 7. Use 'unknown' for safer error handling
    console.error("[STRIPE_ERROR]", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
