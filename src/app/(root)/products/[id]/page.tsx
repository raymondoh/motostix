import { notFound } from "next/navigation";
import { getProductById } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductActions } from "@/components/products/ProductActions";
import { formatPriceWithCode } from "@/lib/utils";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProductById(id);

  if (!result.success) {
    notFound();
  }

  const product = result.product;

  return (
    <div className="container py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Product Image */}
        <div className="relative w-full h-[400px] rounded-md overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Badge (optional) */}
            {product.badge && (
              <Badge variant="outline" className="w-fit text-sm">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && <p className="text-muted-foreground">{product.description}</p>}

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

          {/* Add to Cart Section */}
          {product.inStock && (
            <div className="flex flex-col space-y-4">
              <ProductActions product={product} />
            </div>
          )}

          {/* Divider */}
          <div className="border-t pt-4 space-y-4 text-sm">
            {/* Details */}
            {product.details && (
              <div>
                <h3 className="font-semibold">Details</h3>
                <p className="text-muted-foreground">{product.details}</p>
              </div>
            )}

            {/* Dimensions */}
            {product.dimensions && (
              <div>
                <h3 className="font-semibold">Dimensions</h3>
                <p className="text-muted-foreground">{product.dimensions}</p>
              </div>
            )}

            {/* Material */}
            {product.material && (
              <div>
                <h3 className="font-semibold">Material</h3>
                <p className="text-muted-foreground">{product.material}</p>
              </div>
            )}

            {/* Color */}
            {product.color && (
              <div>
                <h3 className="font-semibold">Color</h3>
                <p className="text-muted-foreground">{product.color}</p>
              </div>
            )}

            {/* Sticky Side */}
            {product.stickySide && (
              <div>
                <h3 className="font-semibold">Sticky Side</h3>
                <p className="text-muted-foreground">{product.stickySide}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
