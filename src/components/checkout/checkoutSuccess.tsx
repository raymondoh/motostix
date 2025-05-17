// src/components/checkout/checkoutSuccess.tsx
"use client";

import { CheckCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CheckoutSuccessProps {
  orderId?: string | null; // Make orderId optional
}

export function CheckoutSuccess({ orderId }: CheckoutSuccessProps) {
  const router = useRouter();
  return (
    <div className="w-full max-w-md px-4 sm:px-6 mx-auto">
      <div className="py-12 text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Thank you for your order!</h1>
          <p className="text-muted-foreground text-base">
            Your order{orderId ? ` (#${orderId.slice(0, 8).toUpperCase()})` : ""} has been placed successfully.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent. You can also view your order in your dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/user/orders")} className="h-12 px-6">
            <ShoppingBag className="mr-2 h-4 w-4" />
            View My Orders
          </Button>

          <Button variant="outline" onClick={() => router.push("/products")} className="h-12 px-6">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
