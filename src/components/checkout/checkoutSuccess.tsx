// src/components/checkout/CheckoutSuccess.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="w-full max-w-md px-4 sm:px-6 mx-auto">
      <div className="py-12 text-center space-y-8">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-green-700 dark:text-green-300">Thank you for your order!</h1>
          <p className="text-muted-foreground text-base">
            Your order{orderId ? ` (#${orderId.slice(0, 8).toUpperCase()})` : ""} has been placed successfully.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent. You can also view your order in your dashboard.
        </p>

        <Button onClick={() => router.push("/user/orders")} className="w-full sm:w-auto">
          Go to My Orders
        </Button>
      </div>
    </div>
  );
}
