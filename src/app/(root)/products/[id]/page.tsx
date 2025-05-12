// src/app/(root)/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductJsonLd } from "@/components/products/ProductJsonLd";
import { ProductGallery, ProductInfo, ProductTabs, RelatedProducts } from "@/components/products/page-detail";
import type { Metadata, ResolvingMetadata } from "next";

// ---------- Metadata ----------
interface MetadataProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  const result = await getProductById(id);
  if (!result.success) {
    return {
      title: "Product Not Found | MotoStix",
      description: "The requested product could not be found."
    };
  }

  const product = result.product;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | MotoStix`,
    description: product.description || `Check out ${product.name} at MotoStix`,
    openGraph: {
      title: `${product.name} | MotoStix`,
      description: product.description || `Check out ${product.name} at MotoStix`,
      images: product.image ? [{ url: product.image, alt: product.name }] : previousImages
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.substring(0, 200) || "",
      images: product.image ? [product.image] : []
    }
  };
}

// ---------- Page ----------
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const result = await getProductById(id);
  if (!result.success) notFound();

  const product = result.product;
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://motostix.com"}/products/${product.id}`;

  const relatedProductsResult = await getRelatedProducts({
    productId: product.id,
    category: product.category,
    limit: 4
  });

  return (
    <main className="min-h-screen">
      {/* Structured Data */}
      <ProductJsonLd product={product} url={productUrl} />

      {/* Product Detail Section */}
      <section className="py-12 md:py-16 w-full bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb + Back */}
          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-3">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/products" className="hover:text-foreground">
                Products
              </Link>
              {product.category && (
                <>
                  {" / "}
                  <Link
                    href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-foreground">
                    {product.category}
                  </Link>
                </>
              )}
            </div>

            <Button variant="outline" asChild className="rounded-full">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      {/* Product Details Tabs Section */}
      <section className="py-12 md:py-16 w-full bg-secondary/5 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Product Details</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <ProductTabs product={product} />
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProductsResult.success && relatedProductsResult.products.length > 0 && (
        <section className="py-12 md:py-16 w-full bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">You May Also Like</h2>
              <div className="w-12 h-0.5 bg-primary mb-6"></div>
            </div>

            <RelatedProducts products={relatedProductsResult.products} />
          </div>
        </section>
      )}
    </main>
  );
}
