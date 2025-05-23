"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { LockIcon, ShoppingBag, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface CheckoutButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function CheckoutButton({ className, variant = "default", size = "default" }: CheckoutButtonProps) {
  const router = useRouter();
  const { closeCart, itemCount } = useCart();
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isLoading = status === "loading" || isRedirecting;
  const isLoggedIn = status === "authenticated" && session;

  const handleCheckout = () => {
    if (itemCount === 0) {
      return;
    }

    if (!isLoggedIn) {
      // Redirect to login page
      setIsRedirecting(true);
      setTimeout(() => {
        closeCart();
        router.push("/login?redirect=checkout");
      }, 300);
      return;
    }

    // User is logged in, proceed to checkout
    setIsRedirecting(true);
    closeCart();
    router.push("/checkout");
  };

  return (
    <Button
      onClick={handleCheckout}
      className={cn("relative", className)}
      variant={variant}
      size={size}
      disabled={isLoading || itemCount === 0}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : !isLoggedIn ? (
        <LockIcon className="mr-2 h-4 w-4" />
      ) : (
        <ShoppingBag className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Processing..." : "Proceed to Checkout"}
    </Button>
  );
}
