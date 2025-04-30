// src/app/(root)/checkout/page.tsx

import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getUser } from "@/firebase/actions";
import { serializeUser } from "@/utils/serializeUser";

export const metadata: Metadata = {
  title: "Checkout | MotorStix",
  description: "Complete your purchase"
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const result = await getUser(session.user.id);

  if (!result.success || !result.data) {
    redirect("/login");
  }

  const serializedUser = serializeUser(result.data);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
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
  );
}
