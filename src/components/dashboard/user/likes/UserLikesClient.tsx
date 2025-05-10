// components/dashboard/user/likes/UserLikesClient.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchUserLikesClient } from "@/actions/client/fetch-user-likes-client";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLikes } from "@/contexts/LikesContext";
import Link from "next/link";

export function UserLikesClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { likedProductIds } = useLikes(); // Get the liked product IDs from context

  useEffect(() => {
    async function loadLikes() {
      try {
        const data = await fetchUserLikesClient();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message || "Failed to load liked products.");
      } finally {
        setLoading(false);
      }
    }

    loadLikes();
  }, [likedProductIds]); // Re-fetch when likedProductIds changes

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">You haven't liked any products yet.</p>
        <Link href="/products" className="text-primary hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
