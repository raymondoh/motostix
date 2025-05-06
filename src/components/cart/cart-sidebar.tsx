// "use client";

// import { useRouter } from "next/navigation";
// import { X, ShoppingCart } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { Button } from "@/components/ui/button";
// import { CartItemCard } from "./cart-item-card";
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
// import type { ShippingFormValues } from "@/schemas/ecommerce/stripe"; // Using the correct ShippingFormValues type
// import { formatPriceWithCode } from "@/lib/utils";

// interface Props {
//   shippingDetails?: ShippingFormValues; // Updated to use ShippingFormValues
// }

// export function CartSidebar({ shippingDetails }: Props) {
//   const router = useRouter();
//   const { isOpen, closeCart, items, subtotal, itemCount, clearCart } = useCart();

//   return (
//     <Sheet open={isOpen} onOpenChange={closeCart}>
//       <SheetContent className="flex w-full flex-col sm:max-w-lg">
//         <SheetHeader className="space-y-2.5 pr-6">
//           <SheetTitle className="flex items-center justify-between">
//             Cart ({itemCount})
//             <Button onClick={closeCart} size="icon" variant="ghost" className="rounded-full" aria-label="Close cart">
//               <X className="h-4 w-4" />
//             </Button>
//           </SheetTitle>
//           <SheetDescription>Your cart items and total cost</SheetDescription>
//         </SheetHeader>

//         {items.length === 0 ? (
//           <div className="flex h-full flex-col items-center justify-center space-y-3">
//             <ShoppingCart className="h-12 w-12 text-muted-foreground" />
//             <div className="text-xl font-medium">Your cart is empty</div>
//             <Button onClick={closeCart} variant="outline" className="mt-3">
//               Continue Shopping
//             </Button>
//           </div>
//         ) : (
//           <>
//             <div className="flex-1 overflow-y-auto py-6">
//               <div className="space-y-4">
//                 {items.map(item => (
//                   <CartItemCard key={item.id} item={item} />
//                 ))}
//               </div>
//             </div>

//             <div className="space-y-4 border-t border-border pt-6">
//               <div className="space-y-1.5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Subtotal</span>
//                   <span className="text-sm font-medium">
//                     {formatPriceWithCode(subtotal, shippingDetails?.country ?? "GB")} {/* Format price correctly */}
//                   </span>
//                 </div>
//                 <div className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</div>
//               </div>

//               <SheetFooter className="flex-col gap-2 sm:flex-col">
//                 <Button
//                   className="w-full"
//                   onClick={() => {
//                     router.push("/checkout");
//                     closeCart(); // ✅ close the drawer
//                   }}>
//                   Proceed to Checkout
//                 </Button>

//                 <Button variant="outline" className="w-full" onClick={clearCart}>
//                   Clear Cart
//                 </Button>
//               </SheetFooter>
//             </div>
//           </>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { CartItemCard } from "./cart-item-card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import type { ShippingFormValues } from "@/schemas/ecommerce/stripe"; // Using the correct ShippingFormValues type
import { formatPriceWithCode } from "@/lib/utils";

interface Props {
  shippingDetails?: ShippingFormValues; // Updated to use ShippingFormValues
}

export function CartSidebar({ shippingDetails }: Props) {
  const router = useRouter();
  const { isOpen, closeCart, items, subtotal, itemCount, clearCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center justify-between">
            Cart ({itemCount})
            <Button onClick={closeCart} size="icon" variant="ghost" className="rounded-full" aria-label="Close cart">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
          <SheetDescription>Your cart items and total cost</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-3">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <div className="text-xl font-medium">Your cart is empty</div>
            <Button onClick={closeCart} variant="outline" className="mt-3">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6">
              <div className="space-y-4">
                {items.map(item => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="text-sm font-medium">
                    {formatPriceWithCode(subtotal, shippingDetails?.country ?? "GB")} {/* Format price correctly */}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  className="w-full"
                  onClick={() => {
                    router.push("/checkout");
                    closeCart(); // ✅ close the drawer
                  }}>
                  Proceed to Checkout
                </Button>

                <Button variant="outline" className="w-full" onClick={closeCart}>
                  Continue Shopping
                </Button>

                <Button variant="outline" className="w-full border-dashed" onClick={clearCart}>
                  Clear Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
