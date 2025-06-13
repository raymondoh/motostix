"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShoppingCart, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { items, closeCart } = useCart();
  const { status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isSessionLoading = status === "loading";

  const handleCheckout = async () => {
    // If user is not authenticated, show a toast, close the cart, then redirect.
    if (!isAuthenticated) {
      // Add the toast notification right here
      toast.error("You must be logged in to make a purchase.");

      closeCart();
      router.push("/login?callbackUrl=/cart");
      return;
    }

    if (items.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
      });

      if (response.status === 401) {
        toast.error("You must be logged in to proceed.");
        closeCart();
        router.push("/login?callbackUrl=/cart");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create checkout session.");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Could not retrieve checkout session URL.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={isLoading || isSessionLoading || items.length === 0} className="w-full">
      {isSessionLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : !isAuthenticated ? (
        <Lock className="mr-2 h-4 w-4" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}

      {isSessionLoading ? "Loading..." : !isAuthenticated ? "Login to Continue" : "Proceed to Checkout"}
    </Button>
  );
}
