"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLikes } from "@/contexts/LikesContext";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import type { Product } from "@/types/product";

interface ProductLikeButtonProps {
  product: Product;
}

export function ProductLikeButton({ product }: ProductLikeButtonProps) {
  const router = useRouter();
  const { isProductLiked, toggleLike } = useLikes();
  const [isPending, setIsPending] = useState(false);
  const { status } = useSession();

  const isLiked = isProductLiked(product.id);
  const isSessionLoading = status === "loading";
  const isLoggedIn = status === "authenticated";

  async function handleToggleLike() {
    if (!isLoggedIn) {
      toast.error("Please sign in to like products");
      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    setIsPending(true);
    try {
      await toggleLike(product.id);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleLike}
      disabled={isPending || isSessionLoading}
      className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
      <Heart
        className={`h-4 w-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
      />
      <span className="sr-only">{isLiked ? "Unlike" : "Like"} this product</span>
    </Button>
  );
}
