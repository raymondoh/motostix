// "use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useCart } from "@/contexts/CartContext";
// import { toast } from "sonner";
// import { LockIcon } from "lucide-react";
// import { useUser } from "@/contexts/UserContext"; // Adjust path if needed

// interface CheckoutButtonProps {
//   className?: string;
// }

// export function CheckoutButton({ className }: CheckoutButtonProps) {
//   const router = useRouter();
//   const { closeCart } = useCart();
//   const { user, loading, error } = useUser();

//   const handleCheckout = () => {
//     if (!user) {
//       // Show toast notification
//       toast.info("Please login to complete your purchase", {
//         description: "You need to be logged in to proceed to checkout.",
//         action: {
//           label: "Login",
//           onClick: () => {
//             closeCart();
//             router.push("/login?redirect=checkout");
//           }
//         },
//         duration: 5000
//       });

//       // Redirect to login page
//       setTimeout(() => {
//         closeCart();
//         router.push("/login?redirect=checkout");
//       }, 1000);
//       return;
//     }

//     // User is logged in, proceed to checkout
//     closeCart();
//     router.push("/checkout");
//   };

//   return (
//     <Button onClick={handleCheckout} className={className} disabled={loading}>
//       {!user && <LockIcon className="mr-2 h-4 w-4" />}
//       Proceed to Checkout
//     </Button>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { LockIcon } from "lucide-react";
import { useSession } from "next-auth/react"; // Import useSession from next-auth

interface CheckoutButtonProps {
  className?: string;
}

export function CheckoutButton({ className }: CheckoutButtonProps) {
  const router = useRouter();
  const { closeCart } = useCart();
  const { data: session, status } = useSession(); // Get session data and status

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated" && session;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      // Redirect to login page
      setTimeout(() => {
        closeCart();
        router.push("/login?redirect=checkout");
      }, 1000);
      return;
    }

    // User is logged in, proceed to checkout
    closeCart();
    router.push("/checkout");
  };

  return (
    <Button onClick={handleCheckout} className={className} disabled={isLoading}>
      {!isLoggedIn && <LockIcon className="mr-2 h-4 w-4" />}
      Proceed to Checkout
    </Button>
  );
}
