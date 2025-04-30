// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/contexts/CartContext";
// import { CheckoutSummary } from "./checkout-summary";
// import { ShippingForm } from "./shipping-form";
// import { PaymentForm } from "./payment-form";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import type { ShippingFormValues } from "@/schemas/ecommerce/ecommerce";

// interface CheckoutFormProps {
//   userId: string;
//   user?: {
//     fullName?: string;
//     email?: string;
//     phone?: string;
//     address?: string;
//     city?: string;
//     state?: string;
//     zipCode?: string;
//     country?: string;
//   };
// }

// type CheckoutStep = "shipping" | "payment" | "confirmation";

// export function CheckoutForm({ userId, user }: CheckoutFormProps) {
//   const [step, setStep] = useState<CheckoutStep>("shipping");
//   const [shippingDetails, setShippingDetails] = useState<ShippingFormValues | null>(null);
//   const [orderId, setOrderId] = useState<string | null>(null);
//   const { items, subtotal, clearCart } = useCart();
//   const router = useRouter();

//   // Calculate tax (example: 8%)
//   const tax = subtotal * 0.08;

//   // Calculate shipping (example: flat £5 or free over £50)
//   const shipping = subtotal > 50 ? 0 : 5;

//   // Calculate total
//   const total = subtotal + tax + shipping;

//   if (items.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12">
//         <h2 className="mb-4 text-2xl font-semibold">Your cart is empty</h2>
//         <p className="mb-8 text-muted-foreground">Add some items to your cart before checking out.</p>
//         <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-8 md:grid-cols-3">
//       {/* Left side: Checkout steps */}
//       <div className="md:col-span-2">
//         {step === "shipping" && (
//           <div>
//             <h2 className="mb-6 text-xl font-semibold">Shipping Information</h2>
//             <ShippingForm
//               onSubmit={(data: ShippingFormValues) => {
//                 setShippingDetails(data);
//                 setStep("payment");
//               }}
//             />
//           </div>
//         )}

//         {step === "payment" && shippingDetails && (
//           <div>
//             <div className="mb-6 flex items-center">
//               <Button variant="ghost" size="sm" className="mr-2" onClick={() => setStep("shipping")}>
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//               <h2 className="text-xl font-semibold">Payment Method</h2>
//             </div>
//             <PaymentForm
//               amount={total}
//               shippingDetails={shippingDetails}
//               items={items}
//               onSuccess={(id: string) => {
//                 clearCart();
//                 setOrderId(id);
//                 setStep("confirmation");
//               }}
//             />
//           </div>
//         )}

//         {step === "confirmation" && (
//           <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950">
//             <h2 className="mb-4 text-2xl font-semibold text-green-700 dark:text-green-300">Order Confirmed!</h2>
//             <p className="mb-2 text-green-600 dark:text-green-400">Your order has been placed successfully.</p>
//             {orderId && <p className="mb-6 text-green-600 dark:text-green-400">Order ID: {orderId}</p>}
//             <p className="mb-6 text-green-600 dark:text-green-400">You will receive an email confirmation shortly.</p>
//             <Button onClick={() => router.push("/")}>Return to Home</Button>
//           </div>
//         )}
//       </div>

//       {/* Right side: Order summary */}
//       <div>
//         <CheckoutSummary
//           items={items}
//           subtotal={subtotal}
//           tax={tax}
//           shipping={shipping}
//           total={total}
//           shippingDetails={shippingDetails ?? undefined}
//         />
//       </div>
//     </div>
//   );
// }
// src/components/checkout/checkout-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CheckoutSummary } from "./checkout-summary";
import { ShippingForm } from "./shipping-form";
import { PaymentForm } from "./payment-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ShippingFormValues } from "@/schemas/ecommerce/ecommerce";
import { formatPriceWithCode } from "@/lib/utils";

interface CheckoutFormProps {
  userId: string;
  user?: Partial<ShippingFormValues>; // Allows partial pre-filling of the form
}

type CheckoutStep = "shipping" | "payment" | "confirmation";

export function CheckoutForm({ userId, user }: CheckoutFormProps) {
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [shippingDetails, setShippingDetails] = useState<ShippingFormValues | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mb-8 text-muted-foreground">Add some items to your cart before checking out.</p>
        <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        {step === "shipping" && (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Shipping Information</h2>
            <ShippingForm
              defaultValues={user}
              onSubmit={data => {
                setShippingDetails(data);
                setStep("payment");
              }}
            />
          </div>
        )}

        {step === "payment" && shippingDetails && (
          <div>
            <div className="mb-6 flex items-center">
              <Button variant="ghost" size="sm" className="mr-2" onClick={() => setStep("shipping")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>
            <PaymentForm
              amount={total}
              shippingDetails={shippingDetails}
              items={items}
              onSuccess={id => {
                clearCart();
                setOrderId(id);
                setStep("confirmation");
              }}
            />
          </div>
        )}

        {step === "confirmation" && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950">
            <h2 className="mb-4 text-2xl font-semibold text-green-700 dark:text-green-300">Order Confirmed!</h2>
            <p className="mb-2 text-green-600 dark:text-green-400">Your order has been placed successfully.</p>
            {orderId && <p className="mb-2 text-green-600 dark:text-green-400">Order ID: {orderId}</p>}
            <p className="mb-2 text-green-600 dark:text-green-400">Total Paid: {formatPriceWithCode(total, "GB")}</p>
            <p className="mb-6 text-green-600 dark:text-green-400">You will receive an email confirmation shortly.</p>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </div>
        )}
      </div>

      <div>
        <CheckoutSummary
          items={items}
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
          userId={userId}
        />
      </div>
    </div>
  );
}
