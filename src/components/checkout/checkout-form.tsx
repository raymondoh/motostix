// // // src/components/checkout/checkout-form.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/contexts/CartContext";
// import { CheckoutSummary } from "./checkout-summary";
// import { ShippingForm } from "./shipping-form";
// import { PaymentForm } from "./payment-form";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import type { ShippingFormValues } from "@/schemas/ecommerce/stripe";
// import { formatPriceWithCode } from "@/lib/utils";

// interface CheckoutFormProps {
//   userId: string;
//   user?: Partial<ShippingFormValues>; // Allows partial pre-filling of the form
// }

// type CheckoutStep = "shipping" | "payment" | "confirmation";

// export function CheckoutForm({ userId, user }: CheckoutFormProps) {
//   const [step, setStep] = useState<CheckoutStep>("shipping");
//   const [shippingDetails, setShippingDetails] = useState<ShippingFormValues | undefined>(undefined); // Use `undefined` instead of `null`
//   const [orderId, setOrderId] = useState<string | null>(null);
//   const { items, subtotal, clearCart } = useCart();
//   const router = useRouter();

//   const tax = subtotal * 0.08;
//   const shipping = subtotal > 50 ? 0 : 5;
//   const total = subtotal + tax + shipping;

//   useEffect(() => {
//     if (items.length === 0) {
//       router.push("/products");
//     }
//   }, [items, router]);

//   return (
//     <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-3">
//       <div className="md:col-span-2 space-y-10">
//         {step === "shipping" && (
//           <div>
//             <h2 className="mb-6 text-2xl font-semibold tracking-tight">Shipping Information</h2>
//             <ShippingForm
//               defaultValues={user}
//               onSubmit={data => {
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
//               <h2 className="text-2xl font-semibold tracking-tight">Payment Method</h2>
//             </div>
//             <PaymentForm
//               amount={total}
//               shippingDetails={shippingDetails}
//               items={items}
//               onSuccess={id => {
//                 setOrderId(id);
//                 clearCart();
//                 router.push(`/checkout/success?orderId=${id}`);
//               }}
//             />
//           </div>
//         )}

//         {step === "confirmation" && orderId && (
//           <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950">
//             <h2 className="mb-4 text-3xl font-semibold text-green-700 dark:text-green-300">🎉 Order Confirmed!</h2>
//             <p className="mb-2 text-green-600 dark:text-green-400">Thank you for your purchase.</p>
//             <p className="mb-2 font-medium text-green-600 dark:text-green-400">Order ID: {orderId}</p>
//             <p className="mb-2 font-medium text-green-600 dark:text-green-400">
//               Total Paid: {formatPriceWithCode(total, "GB")}
//             </p>
//             <p className="mb-6 text-green-600 dark:text-green-400">A confirmation email has been sent to you.</p>
//             <Button onClick={() => router.push("/")} className="mt-2">
//               Return to Home
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="md:sticky md:top-20">
//         <CheckoutSummary
//           items={items}
//           subtotal={subtotal}
//           tax={tax}
//           shipping={shipping}
//           total={total}
//           shippingDetails={shippingDetails}
//           userId={userId}
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CheckoutSummary } from "./checkout-summary";
import { ShippingForm } from "./shipping-form";
import { PaymentForm } from "./payment-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import type { ShippingFormValues } from "@/schemas/ecommerce/stripe";
import { formatPriceWithCode } from "@/lib/utils";

interface CheckoutFormProps {
  userId: string;
  user?: Partial<ShippingFormValues>; // Allows partial pre-filling of the form
}

type CheckoutStep = "shipping" | "payment" | "confirmation";

export function CheckoutForm({ userId, user }: CheckoutFormProps) {
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [shippingDetails, setShippingDetails] = useState<ShippingFormValues | undefined>(undefined);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items, router]);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-10">
        {step === "shipping" && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Shipping Information</h2>
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
              <h2 className="text-2xl font-semibold tracking-tight">Payment Method</h2>
            </div>
            <PaymentForm
              amount={total}
              shippingDetails={shippingDetails}
              items={items}
              onSuccess={id => {
                setOrderId(id);
                clearCart();
                router.push(`/checkout/success?orderId=${id}`);
              }}
            />
          </div>
        )}

        {step === "confirmation" && orderId && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-semibold">Order Confirmed!</h2>
            <p className="mb-2 text-foreground/80">Thank you for your purchase.</p>
            <p className="mb-2 font-medium">Order ID: {orderId}</p>
            <p className="mb-2 font-medium">Total Paid: {formatPriceWithCode(total, "GB")}</p>
            <p className="mb-6 text-foreground/80">A confirmation email has been sent to you.</p>
            <Button onClick={() => router.push("/")} className="mt-2 h-12 px-6">
              Return to Home
            </Button>
          </div>
        )}
      </div>

      <div className="md:sticky md:top-20">
        <CheckoutSummary
          items={items}
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
          shippingDetails={shippingDetails}
          userId={userId}
        />
      </div>
    </div>
  );
}
