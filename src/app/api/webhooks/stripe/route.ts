// src/app/api/checkout/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";
import type { CartItem } from "@/contexts/CartContext";
// Ensure your checkout config is imported
import { SHIPPING_CONFIG, DEFAULT_CURRENCY } from "@/config/checkout";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Using a valid API version. If you still face type errors, a clean
  // reinstall of node_modules is the best way to fix corrupted types.
  apiVersion: "2025-05-28.basil"
});

export async function POST(req: Request) {
  try {
    const authSession = await auth();
    if (!authSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized: You must be logged in to make a purchase." }, { status: 401 });
    }

    const { items }: { items: CartItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Recalculate subtotal on the server to determine shipping and for security
    const subtotal = items.reduce((total, item) => {
      const itemPrice = item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);

    const line_items = items.map((item: CartItem) => {
      const unitAmount =
        item.product.onSale && item.product.salePrice && item.product.salePrice < item.product.price
          ? item.product.salePrice
          : item.product.price;

      return {
        price_data: {
          currency: DEFAULT_CURRENCY,
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

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const success_url = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/`;

    const stripeSession = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url,
      cancel_url,
      customer_email: authSession.user.email,
      metadata: {
        userId: authSession.user.id
      },

      // --- FIX: ADD SHIPPING AND TAX ---
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              // Amount must be in the smallest currency unit (e.g., pence)
              amount: (subtotal > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate) * 100,
              currency: DEFAULT_CURRENCY
            },
            display_name: subtotal > SHIPPING_CONFIG.freeShippingThreshold ? "Free Shipping" : "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 }
            }
          }
        }
      ],
      automatic_tax: {
        enabled: true
      }
      // ---------------------------------
    });

    if (stripeSession.url) {
      return NextResponse.json({ url: stripeSession.url });
    } else {
      throw new Error("Could not create Stripe Checkout session.");
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[STRIPE_ERROR]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
