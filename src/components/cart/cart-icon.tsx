// "use client";

// import { ShoppingCart } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { Button } from "@/components/ui/button";

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
//       {itemCount > 0 && (
//         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
//           {itemCount > 99 ? "99+" : itemCount}
//         </span>
//       )}
//     </Button>
//   );
// }
"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
