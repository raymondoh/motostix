// import Link from "next/link";
// import Image from "next/image";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { formatPriceWithCode } from "@/lib/utils";
// import { ProductCardButton } from "@/components/products/ProductCardButton";
// import type { Product } from "@/types/product";
// import { ProductLikeButton } from "./ProductLikeButton";

// interface ProductCardProps {
//   product: Product;
//   liked?: boolean;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   // Calculate a rating based on product id for demo purposes
//   // In a real app, you'd have actual ratings from reviews
//   const demoRating = Math.floor((Number.parseInt(product.id.slice(-2), 16) % 5) + 1);
//   const demoReviewCount = Math.floor((Number.parseInt(product.id.slice(-4), 16) % 100) + 5);

//   return (
//     <Card className="overflow-hidden border-border/40 transition-all duration-300 group h-full flex flex-col bg-gradient-to-b from-background to-secondary/5 hover:shadow-lg hover:shadow-secondary/20 hover:translate-y-[-2px]">
//       <div className="relative">
//         <Link href={`/products/${product.id}`} className="block">
//           <div className="relative aspect-square overflow-hidden bg-secondary/5">
//             <Image
//               src={product.image || "/placeholder.svg"}
//               alt={product.name}
//               fill
//               className="object-cover transition-transform duration-300 group-hover:scale-105"
//               sizes="(max-width: 768px) 100vw, 300px"
//               priority
//             />
//           </div>
//         </Link>

//         <ProductLikeButton product={product} position="top-right" />

//         {product.badge && (
//           <Badge
//             className={`absolute top-2 left-2 ${
//               product.badge.toLowerCase() === "new"
//                 ? "bg-primary"
//                 : product.badge.toLowerCase() === "sale"
//                 ? "bg-accent text-accent-foreground"
//                 : "bg-secondary"
//             }`}>
//             {product.badge}
//           </Badge>
//         )}
//       </div>

//       {/* Removed border by setting p-0 on CardContent and using custom padding */}
//       <CardContent className="p-0 flex-1 flex flex-col">
//         <div className="p-3 flex-1 flex flex-col">
//           <div className="mb-1">
//             {product.category && (
//               <Link href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}>
//                 <span className="text-xs text-muted-foreground hover:text-primary transition-colors">
//                   {product.category}
//                 </span>
//               </Link>
//             )}
//           </div>
//           <Link href={`/products/${product.id}`} className="block group-hover:text-primary transition-colors">
//             {/* Made title smaller by using text-sm */}
//             <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
//           </Link>
//           <div className="mt-auto pt-1">
//             <div className="flex items-center justify-between">
//               <span className="font-bold">{formatPriceWithCode(product.price, "GB")}</span>
//               <ProductCardButton product={product} />
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { ProductLikeButton } from "./ProductLikeButton";
import { ProductCardButton } from "./ProductCardButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice || product.price;
  const isOnSale = product.onSale && product.salePrice && product.salePrice < product.price;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Optimized product image */}
        <Image
          src={product.image || `/placeholder.svg?height=400&width=400&query=${product.name}+sticker`}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />

        {/* Sale badge */}
        {isOnSale && <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">Sale</Badge>}

        {/* Quick action buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ProductLikeButton product={product} position="none" className="h-8 w-8" />
        </div>

        {/* Quick add to cart on hover */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ProductCardButton product={product} className="w-full" />
        </div>
      </div>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnSale ? (
              <>
                <span className="font-bold text-primary">${displayPrice}</span>
                <span className="text-sm text-muted-foreground line-through">${product.price}</span>
              </>
            ) : (
              <span className="font-bold">${displayPrice}</span>
            )}
          </div>

          {product.inStock ? (
            <Badge variant="secondary" className="text-xs">
              In Stock
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Design themes */}
        {product.designThemes && product.designThemes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.designThemes.slice(0, 2).map(theme => (
              <Badge key={theme} variant="outline" className="text-xs">
                {theme}
              </Badge>
            ))}
            {product.designThemes.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{product.designThemes.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
