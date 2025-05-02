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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h1 className="text-2xl font-semibold text-green-700 dark:text-green-300">Thank you for your order!</h1>

      <p className="text-muted-foreground">
        Your order{orderId ? ` (#${orderId.slice(0, 8).toUpperCase()})` : ""} has been placed successfully.
      </p>

      <p className="text-sm text-muted-foreground">
        A confirmation email has been sent. You can also view your order in your dashboard.
      </p>

      <Button onClick={() => router.push("/user/orders")}>Go to My Orders</Button>
    </div>
  );
}
