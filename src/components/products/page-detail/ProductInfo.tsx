// src/components/products/detail/ProductInfo.tsx
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { ProductActions } from "@/components/products/ProductActions";
import { formatPriceWithCode } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col space-y-6">
      {/* Category/Subcategory */}
      <div className="text-sm text-muted-foreground">
        {product.category && (
          <Link
            href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="hover:underline">
            {product.category}
          </Link>
        )}
        {product.subcategory && (
          <>
            {" / "}
            <Link
              href={`/products?category=${product.category
                ?.toLowerCase()
                .replace(/\s+/g, "-")}&subcategory=${product.subcategory.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:underline">
              {product.subcategory}
            </Link>
          </>
        )}
      </div>

      {/* Name + Badge */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        {product.badge && (
          <Badge variant="outline" className="w-fit text-sm">
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Price */}
      <div>
        <p className="text-2xl font-semibold">{formatPriceWithCode(product.price, "GB")}</p>
      </div>

      {/* In Stock Status */}
      <div>
        {product.inStock ? (
          <Badge variant="default">In Stock</Badge>
        ) : (
          <Badge variant="destructive">Out of Stock</Badge>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="prose prose-sm dark:prose-invert">
          <p>{product.description}</p>
        </div>
      )}

      {/* Add to Cart */}
      {product.inStock && (
        <div className="flex flex-col space-y-4">
          <ProductActions product={product} />
        </div>
      )}

      {/* Wishlist and Share */}
      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1">
          <Heart className="mr-2 h-4 w-4" />
          Add to Wishlist
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
