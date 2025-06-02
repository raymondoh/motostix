import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { UserService } from "@/lib/services/user-service";
import { ShoppingBag, CreditCard, TruckIcon } from "lucide-react";

export const metadata: Metadata = {
  title: `Secure Checkout | ${siteConfig.name}`,
  description: "Complete your order securely with our encrypted checkout process.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true
    }
  },
  other: {
    referrer: "strict-origin-when-cross-origin",
    "cache-control": "no-cache, no-store, must-revalidate",
    pragma: "no-cache",
    expires: "0"
  }
};

export default async function CheckoutPage() {
  try {
    // Dynamic import for auth to avoid build-time issues
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    // Get current user using UserService (already serialized)
    const userResult = await UserService.getCurrentUser();

    if (!userResult.success) {
      console.error("Error getting current user:", userResult.error);
      redirect("/login");
    }

    const serializedUser = userResult.data;

    return (
      <main className="min-h-screen">
        <section className="py-12 md:py-16 w-full bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Checkout</h1>
              <div className="w-12 h-0.5 bg-primary mb-6"></div>
              <p className="text-muted-foreground text-center max-w-2xl">
                Complete your purchase securely. We'll process your order right away.
              </p>
            </div>

            {/* Checkout Steps */}
            <div className="max-w-4xl mx-auto mb-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Review Cart</span>
                </div>

                <div className="hidden md:block w-16 h-0.5 bg-border"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-2">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Payment Details</span>
                </div>

                <div className="hidden md:block w-16 h-0.5 bg-border"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <TruckIcon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Confirmation</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="mx-auto max-w-4xl">
              <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-border/40 p-6 md:p-8">
                <CheckoutForm
                  userId={session.user.id}
                  user={{
                    email: serializedUser.email ?? "",
                    phone: serializedUser.phone ?? "",
                    fullName: serializedUser.name ?? ""
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error in CheckoutPage:", error);
    redirect("/login");
  }
}
