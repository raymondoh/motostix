// "use client";

// import Image from "next/image";
// import { Minus, Plus, Trash2 } from "lucide-react";
// import { useCart, type CartItem } from "@/contexts/CartContext";
// import { Button } from "@/components/ui/button";
// import { formatPrice } from "@/lib/utils";

// interface CartItemCardProps {
//   item: CartItem;
// }

// export function CartItemCard({ item }: CartItemCardProps) {
//   const { updateQuantity, removeItem } = useCart();
//   const { product, quantity } = item;

//   return (
//     <div className="flex gap-4 py-4 border-b border-border/40 last:border-0">
//       <div className="relative h-24 w-24 overflow-hidden rounded-md border border-input/40 bg-background">
//         {product.image ? (
//           <Image
//             src={product.image || "/placeholder.svg"}
//             alt={product.name}
//             fill
//             className="object-cover"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center bg-muted">
//             <span className="text-sm text-muted-foreground">No image</span>
//           </div>
//         )}
//       </div>

//       <div className="flex flex-1 flex-col">
//         <div className="flex justify-between">
//           <div>
//             <h3 className="font-medium line-clamp-1">{product.name}</h3>
//             <p className="text-sm text-muted-foreground line-clamp-1">{product.category}</p>
//           </div>
//         </div>

//         <div className="mt-auto flex items-center justify-between pt-2">
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="icon"
//               className="h-8 w-8 rounded-md border-input"
//               onClick={() => updateQuantity(item.id, quantity - 1)}
//               disabled={quantity <= 1}
//               aria-label="Decrease quantity">
//               <Minus className="h-3 w-3" />
//             </Button>
//             <span className="w-8 text-center text-sm font-medium">{quantity}</span>
//             <Button
//               variant="outline"
//               size="icon"
//               className="h-8 w-8 rounded-md border-input"
//               onClick={() => updateQuantity(item.id, quantity + 1)}
//               aria-label="Increase quantity">
//               <Plus className="h-3 w-3" />
//             </Button>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium">{formatPrice(product.price * quantity, "gbp")}</span>

//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
//               onClick={() => removeItem(item.id)}
//               aria-label="Remove item">
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { product, quantity } = item;
  const { updateQuantity, removeItem } = useCart();
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const handleQuantityChange = (newQuantity: number) => {
    setCurrentQuantity(newQuantity);
    updateQuantity(product.id, newQuantity);
  };

  const isOnSale =
    product.onSale === true && typeof product.salePrice === "number" && product.salePrice < product.price;
  const displayPrice = isOnSale ? product.salePrice : product.price;

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 space-y-2">
        <Link href={`/products/${product.slug || product.id}`} className="hover:text-primary">
          <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => handleQuantityChange(quantity - 1)}>
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-6 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => handleQuantityChange(quantity + 1)}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive rounded-md"
              onClick={() => removeItem(product.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>

          <div className="text-right">
            {isOnSale ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-primary">
                  {/* FIX: Provide a fallback to satisfy TypeScript */}
                  {formatPrice(displayPrice ?? product.price, "gbp")}
                </span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price, "gbp")}</span>
              </div>
            ) : (
              <span className="text-sm font-medium">
                {/* FIX: Provide a fallback to satisfy TypeScript */}
                {formatPrice(displayPrice ?? product.price, "gbp")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
