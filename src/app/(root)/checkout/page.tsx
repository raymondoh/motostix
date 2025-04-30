// src/app/checkout/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | MotorStix",
  description: "Complete your purchase"
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <CheckoutForm userId={session.user.id} />
      </div>
    </div>
  );
}
