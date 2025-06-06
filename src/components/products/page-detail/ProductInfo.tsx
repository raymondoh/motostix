"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { ProductActions } from "@/components/products/ProductActions";
import { formatPriceWithCode } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductLikeButton } from "@/components/products/ProductLikeButton";
import { ProductShareButton } from "./ProductShareButton";
interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const displayPrice = product.salePrice || product.price;
  const isOnSale = product.onSale && product.salePrice && product.salePrice < product.price;
  return (
    <div className="flex flex-col space-y-6">
      {/* Category / Subcategory breadcrumbs */}
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

      {/* Name + optional badge */}
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
        {isOnSale ? (
          <div className="flex items-center gap-3">
            <span className="text-primary text-2xl font-semibold">{formatPriceWithCode(displayPrice, "GB")}</span>
            <span className="text-sm text-muted-foreground line-through">
              {formatPriceWithCode(product.price, "GB")}
            </span>
          </div>
        ) : (
          <span className="font-bold">{formatPriceWithCode(displayPrice, "GB")}</span>
        )}
      </div>

      {/* Quick‑glance attributes */}
      {(product.material || product.colorDisplayName || product.stickySide) && (
        <div className="flex flex-wrap gap-2">
          {product.material && (
            <Badge variant="secondary" className="text-xs">
              {product.material}
            </Badge>
          )}
          {product.colorDisplayName && (
            <Badge variant="secondary" className="text-xs">
              {product.colorDisplayName}
            </Badge>
          )}
          {product.stickySide && (
            <Badge variant="secondary" className="text-xs">
              {`Sticky-Side: ${product.stickySide}`}
            </Badge>
          )}
        </div>
      )}

      {/* Stock status */}
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
        <div className="flex-1">
          <ProductLikeButton
            product={product}
            showText={true}
            position="none"
            className="w-full h-10 rounded-full border border-input bg-secondary hover:bg-secondary/60 hover:text-secondary-foreground px-4 py-2 flex items-center justify-center"
          />
        </div>

        <div className="flex-1">
          <ProductShareButton product={product} />
        </div>
      </div>
    </div>
  );
}
