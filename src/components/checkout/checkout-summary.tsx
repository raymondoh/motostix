"use client";

import Image from "next/image";
import type { CartItem } from "@/contexts/CartContext";
import type { ShippingFormValues } from "@/schemas/ecommerce/stripe";
import { Separator } from "@/components/ui/separator";
import { formatPriceWithCode } from "@/lib/utils";

export interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingDetails?: ShippingFormValues;
  userId?: string;
}

export function CheckoutSummary({ items, subtotal, tax, shipping, total, shippingDetails }: CheckoutSummaryProps) {
  const countryCode = shippingDetails?.country;

  return (
    <div className="rounded-xl border border-input/40 p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold tracking-tight">Order Summary</h2>

      <div className="max-h-80 overflow-auto pr-1 space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-input bg-background">
              {item.product.image ? (
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-xs text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium line-clamp-1">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              <p className="text-sm font-medium">
                {formatPriceWithCode(item.product.price * item.quantity, countryCode)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPriceWithCode(subtotal, countryCode)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPriceWithCode(tax, countryCode)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPriceWithCode(shipping, countryCode)}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatPriceWithCode(total, countryCode)}</span>
        </div>
      </div>
    </div>
  );
}
