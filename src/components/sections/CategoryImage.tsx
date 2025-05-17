"use client";

import { useState } from "react";
import Image from "next/image";

interface CategoryImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

export function CategoryImage({
  src,
  alt,
  fallbackSrc = "/motorcycle-sticker-category.png",
  className
}: CategoryImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      fill
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
