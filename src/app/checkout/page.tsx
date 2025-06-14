import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { StripeProvider } from "@/providers/StripeProvider";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: `Checkout | ${siteConfig.name}`,
  description: "Complete your purchase securely with Stripe.",
  robots: { index: false, follow: false }
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen">
      <section className="py-12 md:py-16">
        <StripeProvider>
          <CheckoutForm />
        </StripeProvider>
      </section>
    </main>
  );
}
