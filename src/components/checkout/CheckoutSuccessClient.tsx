"use client";

import { useSearchParams } from "next/navigation";
import { CheckoutSuccess } from "./checkoutSuccess";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return <CheckoutSuccess orderId={orderId} />;
}
