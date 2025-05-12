// "use client";

// import { ShoppingCart } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { Button } from "@/components/ui/button";
// import { motion, AnimatePresence } from "framer-motion";

// export function CartIcon() {
//   const { toggleCart, itemCount } = useCart();

//   return (
//     <Button
//       onClick={toggleCart}
//       variant="ghost"
//       size="icon"
//       className="relative"
//       aria-label={`Shopping cart with ${itemCount} items`}>
//       <ShoppingCart className="h-6 w-6" />
//       <AnimatePresence>
//         {itemCount > 0 && (
//           <motion.span
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0 }}
//             className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
//             {itemCount > 99 ? "99+" : itemCount}
//           </motion.span>
//         )}
//       </AnimatePresence>
//     </Button>
//   );
// }
"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CartIconProps {
  variant?: "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CartIcon({ variant = "ghost", size = "icon", className }: CartIconProps) {
  const { toggleCart, itemCount } = useCart();

  return (
    <Button
      onClick={toggleCart}
      variant={variant}
      size={size}
      className={`relative ${className}`}
      aria-label={`Shopping cart with ${itemCount} items`}>
      <ShoppingBag className="h-5 w-5" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground shadow-sm">
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
