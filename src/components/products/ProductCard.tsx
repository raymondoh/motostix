// import Link from "next/link";
// import Image from "next/image";
// import { Heart, Star, ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { formatPriceWithCode } from "@/lib/utils";
// import type { Product } from "@/types/product";

// interface ProductCardProps {
//   product: Product;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   // Calculate a rating based on product id for demo purposes
//   // In a real app, you'd have actual ratings from reviews
//   const demoRating = Math.floor((Number.parseInt(product.id.slice(-2), 16) % 5) + 1);
//   const demoReviewCount = Math.floor((Number.parseInt(product.id.slice(-4), 16) % 100) + 5);

//   return (
//     <Card className="overflow-hidden border-border/40 hover:border-primary/20 transition-colors group h-full flex flex-col bg-gradient-to-b from-background to-secondary/5">
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

//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
//           <Heart className="h-4 w-4" />
//           <span className="sr-only">Add to wishlist</span>
//         </Button>

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

//       <CardContent className="p-4 flex-1 flex flex-col">
//         <div className="mb-1">
//           {product.category && (
//             <Link href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}>
//               <span className="text-xs text-muted-foreground hover:text-primary transition-colors">
//                 {product.category}
//               </span>
//             </Link>
//           )}
//         </div>

//         <Link href={`/products/${product.id}`} className="block group-hover:text-primary transition-colors">
//           <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
//         </Link>

//         <div className="flex items-center mt-1 mb-3">
//           <div className="flex items-center">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <Star key={i} className={`h-3 w-3 ${i < demoRating ? "text-accent fill-accent" : "text-muted/20"}`} />
//             ))}
//           </div>
//           <span className="text-xs text-muted-foreground ml-1">({demoReviewCount})</span>
//         </div>

//         <div className="mt-auto pt-2">
//           <div className="flex items-center justify-between">
//             <span className="font-bold">{formatPriceWithCode(product.price, "GB")}</span>
//             <Button size="sm" className="h-8 px-3">
//               <ShoppingCart className="h-3.5 w-3.5 mr-1" />
//               Add
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPriceWithCode } from "@/lib/utils";
import { ProductCardButton } from "@/components/products/ProductCardButton";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Calculate a rating based on product id for demo purposes
  // In a real app, you'd have actual ratings from reviews
  const demoRating = Math.floor((Number.parseInt(product.id.slice(-2), 16) % 5) + 1);
  const demoReviewCount = Math.floor((Number.parseInt(product.id.slice(-4), 16) % 100) + 5);

  return (
    <Card className="overflow-hidden border-border/40 hover:border-primary/20 transition-colors group h-full flex flex-col bg-gradient-to-b from-background to-secondary/5">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-secondary/5">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          </div>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </Button>

        {product.badge && (
          <Badge
            className={`absolute top-2 left-2 ${
              product.badge.toLowerCase() === "new"
                ? "bg-primary"
                : product.badge.toLowerCase() === "sale"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary"
            }`}>
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Removed border by setting p-0 on CardContent and using custom padding */}
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="p-3 flex-1 flex flex-col">
          <div className="mb-1">
            {product.category && (
              <Link href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}>
                <span className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {product.category}
                </span>
              </Link>
            )}
          </div>

          <Link href={`/products/${product.id}`} className="block group-hover:text-primary transition-colors">
            {/* Made title smaller by using text-sm */}
            <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
          </Link>

          <div className="flex items-center mt-1 mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < demoRating ? "text-accent fill-accent" : "text-muted/20"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({demoReviewCount})</span>
          </div>

          <div className="mt-auto pt-1">
            <div className="flex items-center justify-between">
              <span className="font-bold">{formatPriceWithCode(product.price, "GB")}</span>
              <ProductCardButton product={product} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
