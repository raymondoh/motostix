// import { getAllProducts, getFeaturedProducts, getHeroSlidesFromFirestore } from "@/firebase/actions";
// import { ProductCarousel } from "@/components/product-carousel";
// import { HeroCarousel } from "@/components/hero-carousel";
// import { FeaturedProductsCarousel } from "@/components";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Our Products",
//   description: "Browse our collection of high-quality products with free shipping on all orders.",
//   keywords: ["products", "shop", "collection", "featured items"]
// };

// export const dynamic = "force-dynamic";

// // 👇 Wrap the page logic in a default export function
// export default async function ProductsPage() {
//   const [allProductsRes, featuredRes, heroRes] = await Promise.all([
//     getAllProducts(),
//     getFeaturedProducts(),
//     getHeroSlidesFromFirestore()
//   ]);

//   if (!allProductsRes.success || !featuredRes.success || !heroRes.success) {
//     return <div className="container mx-auto max-w-md mt-10">No products available</div>;
//   }

//   return (
//     <div>
//       {/* Hero Carousel */}
//       <div className="max-w-full md:max-w-6xl mx-auto mt-0">
//         <HeroCarousel slides={heroRes.data} autoPlay loop className="mb-8" />
//       </div>

//       {/* All Products */}
//       <div className="container max-w-7xl mx-auto mt-10">
//         <ProductCarousel
//           products={allProductsRes.data}
//           showTitle={false}
//           //itemsPerView={{ sm: 1, md: 2, lg: 1, xl: 6 }}
//         />
//       </div>

//       {/* Featured Products */}
//       <div className="container mx-auto max-w-6xl mt-10">
//         <FeaturedProductsCarousel products={featuredRes.data} title="Featured Products" />
//       </div>
//     </div>
//   );
// }
// src/app/products/page.tsx
import { getAllProducts } from "@/actions/products/get-all-products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage() {
  const result = await getAllProducts();
  const products = result.success ? result.data : [];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Our Stickers</h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              <Link href={`/products/${product.id}`} className="flex-1">
                <div className="relative w-full h-48">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
                </CardContent>
              </Link>
              <CardFooter className="p-4">
                <Button asChild className="w-full">
                  <Link href={`/products/${product.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
