"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

export function CartIcon() {
  const { toggleCart, itemCount } = useCart();

  return (
    <Button
      onClick={toggleCart}
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={`Shopping cart with ${itemCount} items`}>
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}
