// "use client";

// import { ShoppingBag } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { Button } from "@/components/ui/button";
// import { motion, AnimatePresence } from "framer-motion";

// interface CartIconProps {
//   variant?: "ghost" | "outline" | "secondary";
//   size?: "default" | "sm" | "lg" | "icon";
//   className?: string;
// }

// export function CartIcon({ variant = "ghost", size = "icon", className }: CartIconProps) {
//   const { toggleCart, itemCount } = useCart();

//   return (
//     <Button

//       onClick={toggleCart}
//       variant={variant}
//       size={size}
//       className={`relative ${className}`}
//       aria-label={`Shopping cart with ${itemCount} items`}>
//       <ShoppingBag className="h-5 w-5" />
//       <AnimatePresence>
//         {itemCount > 0 && (
//           <motion.span
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 500, damping: 25 }}
//             className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground shadow-sm">
//             {itemCount > 99 ? "99+" : itemCount}
//           </motion.span>
//         )}
//       </AnimatePresence>
//     </Button>
//   );
// }
"use client";

import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { HeaderIconButton } from "@/components/header/header-icon-button";

export function CartIcon() {
  // Get itemCount and the new toggleCart function from the context
  const { itemCount, toggleCart } = useCart();

  return (
    <div className="relative">
      {/* This button will now call toggleCart from the context */}
      <HeaderIconButton onClick={toggleCart} aria-label="Open cart">
        <ShoppingBag className="h-5 w-5" />
      </HeaderIconButton>

      {itemCount > 0 && (
        <Badge variant="default" className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
          {itemCount}
        </Badge>
      )}
    </div>
  );
}
