// "use client";

// import { useState } from "react";
// import { ShoppingCart, Check } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { Button } from "@/components/ui/button";
// import type { Product } from "@/types/product"; // Adjust based on your existing types

// interface AddToCartButtonProps {
//   product: Product;
//   variant?: "default" | "outline" | "secondary";
//   size?: "default" | "sm" | "lg";
//   showIcon?: boolean;
// }

// export function AddToCartButton({
//   product,
//   variant = "default",
//   size = "default",
//   showIcon = true
// }: AddToCartButtonProps) {
//   const { addItem } = useCart();
//   const [isAdded, setIsAdded] = useState(false);

//   const handleAddToCart = () => {
//     addItem(product, 1);
//     setIsAdded(true);

//     // Reset the button after 1.5 seconds
//     setTimeout(() => {
//       setIsAdded(false);
//     }, 1500);
//   };

//   return (
//     <Button onClick={handleAddToCart} variant={variant} size={size} className="transition-all" disabled={isAdded}>
//       {showIcon && <>{isAdded ? <Check className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}</>}
//       {isAdded ? "Added to Cart" : "Add to Cart"}
//     </Button>
//   );
// }
"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  showIcon = true,
  className,
  fullWidth = false
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    setIsAdded(true);

    // Reset the button after 1.5 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={isAdded ? "secondary" : variant}
      size={size}
      className={cn(
        "transition-all duration-300",
        isAdded && "bg-primary/10 text-primary border-primary/20",
        fullWidth && "w-full",
        className
      )}
      disabled={isAdded}>
      {showIcon && (
        <>
          {isAdded ? (
            <Check className="mr-2 h-4 w-4 animate-in zoom-in-50 duration-300" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
        </>
      )}
      {isAdded ? "Added to Cart" : "Add to Cart"}
    </Button>
  );
}
