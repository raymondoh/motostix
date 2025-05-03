"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { formatPriceWithCode } from "@/lib/utils";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 py-2">
      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
        {product.image ? (
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust these based on your design
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{product.category}</p>
          </div>
          <div className="text-sm font-medium">{formatPriceWithCode(product.price, "GB")}</div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, quantity - 1)}
              aria-label="Decrease quantity">
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, quantity + 1)}
              aria-label="Increase quantity">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => removeItem(item.id)}
            aria-label="Remove item">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
