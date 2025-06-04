// src/components/products/detail/ProductGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(product.image || "/placeholder.svg");
  // Add loading states
  const [isLoading, setIsLoading] = useState(true);
  // TODO: Replace with real image gallery when product.images array is available
  const imageList = [product.image || "/placeholder.svg"];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 500px"
          priority
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {imageList.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
              activeImage === img ? "border-primary" : "border-transparent"
            }`}>
            <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
