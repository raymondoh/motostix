// src/app/products/page.tsx
import { getAllProducts } from "@/actions/products/get-all-products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { formatPriceWithCode } from "@/lib/utils";

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
                    priority
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-muted-foreground mt-1">{formatPriceWithCode(product.price, "GB")}</p>
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
