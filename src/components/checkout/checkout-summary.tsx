//src/components/checkout/checkout-summary.tsx

"use client";

import Image from "next/image";
import type { CartItem } from "@/contexts/CartContext";
import type { ShippingFormValues } from "@/schemas/ecommerce/stripe"; // Ensure the correct import
import { Separator } from "@/components/ui/separator";
import { formatPriceWithCode } from "@/lib/utils";

// src/components/checkout/checkout-summary.tsx
export interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingDetails?: ShippingFormValues; // Change to optional, or undefined
  userId?: string;
}

export function CheckoutSummary({ items, subtotal, tax, shipping, total, shippingDetails }: CheckoutSummaryProps) {
  const countryCode = shippingDetails?.country; // Since shippingDetails is guaranteed to have country, no need for fallback

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

      <div className="max-h-80 overflow-auto">
        {items.map(item => (
          <div key={item.id} className="mb-4 flex items-start gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
              {item.product.image ? (
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Define sizes for responsive image loading
                  priority // Prioritize this image since it's part of the above-the-fold content
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <span className="text-xs text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              <p className="text-sm font-medium">
                {formatPriceWithCode(item.product.price * item.quantity, countryCode)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPriceWithCode(subtotal, countryCode)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{formatPriceWithCode(tax, countryCode)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPriceWithCode(shipping, countryCode)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPriceWithCode(total, countryCode)}</span>
        </div>
      </div>
    </div>
  );
}
