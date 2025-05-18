// src/app/(root)/checkout/success/page.tsx
import { Suspense } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";

function CheckoutSuccessFallback() {
  return (
    <div className="w-full max-w-md px-4 sm:px-6 mx-auto py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg text-muted-foreground">Loading order details...</p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen">
      <section className="py-12 md:py-16 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Order Confirmed</h1>
              <div className="w-12 h-0.5 bg-primary mb-6"></div>
              <p className="text-muted-foreground text-center">
                Thank you for your purchase! We've received your order and are processing it right away.
              </p>
            </div> */}

            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-border/40 p-6 md:p-8">
              {/* Wrap the client component in a Suspense boundary */}
              <Suspense fallback={<CheckoutSuccessFallback />}>
                <CheckoutSuccessClient />
              </Suspense>
            </div>

            {/* <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button
                asChild
                className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90">
                <Link href="/user/orders">aaView My Orders</Link>
              </Button>
            </div> */}
          </div>
        </div>
      </section>
    </main>
  );
}
