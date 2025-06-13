"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CheckoutSuccess } from "./checkoutSuccess";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []); // <-- FIX: Use an empty dependency array to run this effect only once on mount

  return <CheckoutSuccess orderId={orderId} />;
}
