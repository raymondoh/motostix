// src/app/(root)/checkout/success/page.tsx

import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/checkout/checkoutSuccess";
import { Loader2 } from "lucide-react";

function CheckoutSuccessFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center text-muted-foreground">
      <Loader2 className="w-6 h-6 animate-spin" />
      <p>Loading your confirmation details...</p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="container max-w-2xl py-10">
      <h1 className="mb-6 text-2xl font-bold">Order Confirmed</h1>
      <Suspense fallback={<CheckoutSuccessFallback />}>
        <CheckoutSuccess />
      </Suspense>
    </div>
  );
}
