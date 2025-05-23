"use client";

import { useRouter } from "next/navigation";
import { X, ShoppingCart, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { CartItemCard } from "./cart-item-card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { ShippingFormValues } from "@/schemas/ecommerce/stripe";
import { formatPriceWithCode } from "@/lib/utils";
import { CheckoutButton } from "./checkout-button";

interface Props {
  shippingDetails?: ShippingFormValues;
}

export function CartSidebar({ shippingDetails }: Props) {
  const router = useRouter();
  const { isOpen, closeCart, items, subtotal, itemCount, clearCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg p-0">
        <SheetHeader className="p-6 border-b border-border/40">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Cart ({itemCount})
            </SheetTitle>
            <Button
              onClick={closeCart}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              aria-label="Close cart">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="text-sm text-muted-foreground">
            Review your items before proceeding to checkout
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 p-6">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-xl font-medium">Your cart is empty</div>
            <p className="text-center text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={closeCart} className="mt-4 h-12 px-6">
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-1">
                {items.map(item => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="border-t border-border/40 p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm font-medium">
                      {formatPriceWithCode(subtotal, shippingDetails?.country ?? "GB")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Shipping</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tax</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Estimated Total</span>
                    <span className="text-base font-medium">
                      {formatPriceWithCode(subtotal, shippingDetails?.country ?? "GB")}
                    </span>
                  </div>
                </div>

                <SheetFooter className="flex-col gap-3 sm:flex-col">
                  <CheckoutButton className="w-full h-12 text-base font-semibold" />

                  <div className="flex gap-3 w-full">
                    <Button variant="outline" className="flex-1" onClick={closeCart}>
                      Continue Shopping
                    </Button>

                    <Button
                      variant="outline"
                      className="text-muted-foreground hover:text-destructive hover:border-destructive"
                      onClick={clearCart}>
                      Clear Cart
                    </Button>
                  </div>
                </SheetFooter>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
