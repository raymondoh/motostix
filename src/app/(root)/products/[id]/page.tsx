// // // src/app/(root)/products/[id]/page.tsx
// // import { notFound } from "next/navigation"
// // import { getProductById } from "@/actions/products"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import { ArrowLeft, Share2, Heart, Truck, ShieldCheck, Clock } from "lucide-react"
// // import Link from "next/link"
// // import Image from "next/image"
// // import { ProductActions } from "@/components/products/ProductActions"
// // import { formatPriceWithCode } from "@/lib/utils"
// // import type { Metadata, ResolvingMetadata } from "next"
// // import { ProductJsonLd } from "@/components/products/ProductJsonLd"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Separator } from "@/components/ui/separator"
// // import { ProductCard } from "@/components/products/ProductCard"
// // import { getRelatedProductsFromDb } from "@/actions/products/get-related-products"

// // // Define the params type for generateMetadata
// // interface MetadataProps {
// //   params: Promise<{ id: string }>
// //   searchParams: Promise<{ [key: string]: string | string[] | undefined }>
// // }

// // // Generate dynamic metadata based on the product
// // export async function generateMetadata(props: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
// //   // Await the params object before accessing its properties
// //   const params = await props.params
// //   const id = params.id

// //   // Get the product data
// //   const result = await getProductById(id)

// //   // If product not found, return basic metadata
// //   if (!result.success) {
// //     return {
// //       title: "Product Not Found | MotoStix",
// //       description: "The requested product could not be found.",
// //     }
// //   }

// //   const product = result.product

// //   // Get the parent metadata (optional)
// //   const previousImages = (await parent).openGraph?.images || []

// //   return {
// //     title: `${product.name} | MotoStix`,
// //     description: product.description || `Check out ${product.name} at MotoStix`,
// //     openGraph: {
// //       title: `${product.name} | MotoStix`,
// //       description: product.description || `Check out ${product.name} at MotoStix`,
// //       images: product.image ? [{ url: product.image, alt: product.name }] : previousImages,
// //       type: "website",
// //     },
// //     twitter: {
// //       card: "summary_large_image",
// //       title: product.name,
// //       description: product.description?.substring(0, 200) || `Check out ${product.name} at MotoStix`,
// //       images: product.image ? [product.image] : [],
// //     },
// //   }
// // }

// // // Define the page props interface to match your project's pattern
// // interface PageProps {
// //   params: Promise<{ id: string }>
// //   searchParams: Promise<{ [key: string]: string | string[] | undefined }>
// // }

// // export default async function ProductDetailPage({ params, searchParams }: PageProps) {
// //   // Await the params object before accessing its properties
// //   const resolvedParams = await params
// //   const id = resolvedParams.id

// //   const result = await getProductById(id)

// //   if (!result.success) {
// //     notFound()
// //   }

// //   const product = result.product
// //   const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://motostix.com"}/products/${product.id}`

// //   // Get related products based on category and/or tags
// //   const relatedProductsResult = await getRelatedProductsFromDb({
// //     productId: product.id,
// //     category: product.category,
// //     limit: 4,
// //   })

// //   const relatedProducts = relatedProductsResult.success ? relatedProductsResult.products : []

// //   return (
// //     <div className="container py-8">
// //       {/* Add the JSON-LD structured data */}
// //       <ProductJsonLd product={product} url={productUrl} />

// //       {/* Breadcrumb Navigation */}
// //       <nav className="flex mb-4 text-sm text-muted-foreground">
// //         <ol className="flex items-center space-x-1">
// //           <li>
// //             <Link href="/" className="hover:text-foreground">
// //               Home
// //             </Link>
// //           </li>
// //           <li className="flex items-center space-x-1">
// //             <span>/</span>
// //             <Link href="/products" className="hover:text-foreground">
// //               Products
// //             </Link>
// //           </li>
// //           {product.category && (
// //             <li className="flex items-center space-x-1">
// //               <span>/</span>
// //               <Link
// //                 href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
// //                 className="hover:text-foreground"
// //               >
// //                 {product.category}
// //               </Link>
// //             </li>
// //           )}
// //           <li className="flex items-center space-x-1">
// //             <span>/</span>
// //             <span className="text-foreground">{product.name}</span>
// //           </li>
// //         </ol>
// //       </nav>

// //       {/* Back Button */}
// //       <div className="mb-8">
// //         <Button variant="outline" asChild>
// //           <Link href="/products">
// //             <ArrowLeft className="mr-2 h-4 w-4" />
// //             Back to Products
// //           </Link>
// //         </Button>
// //       </div>

// //       {/* Two-column layout */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //         {/* Left: Product Image Gallery */}
// //         <div className="space-y-4">
// //           {/* Main Image */}
// //           <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
// //             <Image
// //               src={product.image || "/placeholder.svg"}
// //               alt={product.name}
// //               fill
// //               className="object-contain p-6"
// //               sizes="(max-width: 768px) 100vw, 500px"
// //               priority
// //             />
// //           </div>

// //           {/* Image Thumbnails - would need multiple images in your product model */}
// //           <div className="flex space-x-2 overflow-x-auto pb-2">
// //             <button className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-primary">
// //               <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
// //             </button>
// //             {/* Additional thumbnails would go here */}
// //           </div>
// //         </div>

// //         {/* Right: Product Info */}
// //         <div className="flex flex-col space-y-6">
// //           {/* Category/Subcategory */}
// //           <div className="text-sm text-muted-foreground">
// //             {product.category && (
// //               <Link
// //                 href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
// //                 className="hover:underline"
// //               >
// //                 {product.category}
// //               </Link>
// //             )}
// //             {product.subcategory && (
// //               <>
// //                 {" / "}
// //                 <Link
// //                   href={`/products?category=${product.category
// //                     ?.toLowerCase()
// //                     .replace(/\s+/g, "-")}&subcategory=${product.subcategory.toLowerCase().replace(/\s+/g, "-")}`}
// //                   className="hover:underline"
// //                 >
// //                   {product.subcategory}
// //                 </Link>
// //               </>
// //             )}
// //           </div>

// //           {/* Name */}
// //           <div className="space-y-2">
// //             <h1 className="text-3xl font-bold">{product.name}</h1>

// //             {/* Badge (optional) */}
// //             {product.badge && (
// //               <Badge variant="outline" className="w-fit text-sm">
// //                 {product.badge}
// //               </Badge>
// //             )}
// //           </div>

// //           {/* Price */}
// //           <div>
// //             <p className="text-2xl font-semibold">{formatPriceWithCode(product.price, "GB")}</p>
// //           </div>

// //           {/* In Stock Status */}
// //           <div>
// //             {product.inStock ? (
// //               <Badge variant="default">In Stock</Badge>
// //             ) : (
// //               <Badge variant="destructive">Out of Stock</Badge>
// //             )}
// //           </div>

// //           {/* Description */}
// //           {product.description && (
// //             <div className="prose prose-sm dark:prose-invert">
// //               <p>{product.description}</p>
// //             </div>
// //           )}

// //           {/* Add to Cart Section */}
// //           {product.inStock && (
// //             <div className="flex flex-col space-y-4">
// //               <ProductActions product={product} />
// //             </div>
// //           )}

// //           {/* Shipping & Returns Info - NEW */}
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y">
// //             <div className="flex items-center space-x-2">
// //               <Truck className="h-5 w-5 text-muted-foreground" />
// //               <div className="text-sm">
// //                 <p className="font-medium">Free Shipping</p>
// //                 <p className="text-muted-foreground">On orders over £50</p>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-2">
// //               <ShieldCheck className="h-5 w-5 text-muted-foreground" />
// //               <div className="text-sm">
// //                 <p className="font-medium">Secure Payment</p>
// //                 <p className="text-muted-foreground">100% secure checkout</p>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-2">
// //               <Clock className="h-5 w-5 text-muted-foreground" />
// //               <div className="text-sm">
// //                 <p className="font-medium">Easy Returns</p>
// //                 <p className="text-muted-foreground">30 day return policy</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Wishlist and Share */}
// //           <div className="flex space-x-2">
// //             <Button variant="outline" className="flex-1">
// //               <Heart className="mr-2 h-4 w-4" />
// //               Add to Wishlist
// //             </Button>
// //             <Button variant="outline" className="flex-1">
// //               <Share2 className="mr-2 h-4 w-4" />
// //               Share
// //             </Button>
// //           </div>

// //           {/* Specifications */}
// //           <div className="border-t pt-4">
// //             <h3 className="font-semibold mb-3">Specifications</h3>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
// //               {product.dimensions && (
// //                 <>
// //                   <div className="text-sm font-medium">Dimensions</div>
// //                   <div className="text-sm text-muted-foreground">{product.dimensions}</div>
// //                 </>
// //               )}
// //               {product.material && (
// //                 <>
// //                   <div className="text-sm font-medium">Material</div>
// //                   <div className="text-sm text-muted-foreground">{product.material}</div>
// //                 </>
// //               )}
// //               {product.color && (
// //                 <>
// //                   <div className="text-sm font-medium">Color</div>
// //                   <div className="text-sm text-muted-foreground">{product.colorDisplayName || product.color}</div>
// //                 </>
// //               )}
// //               {product.stickySide && (
// //                 <>
// //                   <div className="text-sm font-medium">Sticky Side</div>
// //                   <div className="text-sm text-muted-foreground">{product.stickySide}</div>
// //                 </>
// //               )}
// //             </div>
// //           </div>

// //           {/* Details (if different from description) */}
// //           {product.details && (
// //             <div className="border-t pt-4">
// //               <h3 className="font-semibold mb-2">Details</h3>
// //               <p className="text-sm text-muted-foreground">{product.details}</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Tabs for Additional Information - NEW */}
// //       <div className="mt-16">
// //         <Tabs defaultValue="description" className="w-full">
// //           <TabsList className="grid w-full grid-cols-3">
// //             <TabsTrigger value="description">Description</TabsTrigger>
// //             <TabsTrigger value="specifications">Specifications</TabsTrigger>
// //             <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
// //           </TabsList>
// //           <TabsContent value="description" className="p-4 border rounded-md mt-2">
// //             <div className="prose prose-sm max-w-none dark:prose-invert">
// //               <h3 className="text-lg font-semibold mb-2">Product Description</h3>
// //               <p>{product.description}</p>
// //               {product.details && (
// //                 <>
// //                   <h4 className="text-md font-semibold mt-4 mb-2">Additional Details</h4>
// //                   <p>{product.details}</p>
// //                 </>
// //               )}
// //             </div>
// //           </TabsContent>
// //           <TabsContent value="specifications" className="p-4 border rounded-md mt-2">
// //             <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
// //               {product.dimensions && (
// //                 <div className="flex flex-col">
// //                   <span className="text-sm font-medium">Dimensions</span>
// //                   <span className="text-sm text-muted-foreground">{product.dimensions}</span>
// //                 </div>
// //               )}
// //               {product.material && (
// //                 <div className="flex flex-col">
// //                   <span className="text-sm font-medium">Material</span>
// //                   <span className="text-sm text-muted-foreground">{product.material}</span>
// //                 </div>
// //               )}
// //               {product.color && (
// //                 <div className="flex flex-col">
// //                   <span className="text-sm font-medium">Color</span>
// //                   <span className="text-sm text-muted-foreground">{product.colorDisplayName || product.color}</span>
// //                 </div>
// //               )}
// //               {product.stickySide && (
// //                 <div className="flex flex-col">
// //                   <span className="text-sm font-medium">Sticky Side</span>
// //                   <span className="text-sm text-muted-foreground">{product.stickySide}</span>
// //                 </div>
// //               )}
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium">SKU</span>
// //                 <span className="text-sm text-muted-foreground">SKU-{product.id.substring(0, 8).toUpperCase()}</span>
// //               </div>
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium">Availability</span>
// //                 <span className="text-sm text-muted-foreground">{product.inStock ? "In Stock" : "Out of Stock"}</span>
// //               </div>
// //             </div>
// //           </TabsContent>
// //           <TabsContent value="shipping" className="p-4 border rounded-md mt-2">
// //             <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
// //             <div className="space-y-4">
// //               <div>
// //                 <h4 className="text-md font-medium mb-2">Shipping Information</h4>
// //                 <p className="text-sm text-muted-foreground">
// //                   We offer free standard shipping on all orders over £50. Orders typically ship within 1-2 business
// //                   days. Delivery times vary by location, but typically take 3-5 business days after shipping.
// //                 </p>
// //               </div>
// //               <div>
// //                 <h4 className="text-md font-medium mb-2">Return Policy</h4>
// //                 <p className="text-sm text-muted-foreground">
// //                   If you're not completely satisfied with your purchase, you can return it within 30 days for a full
// //                   refund. Items must be unused and in their original packaging. Please contact our customer service team
// //                   to initiate a return.
// //                 </p>
// //               </div>
// //             </div>
// //           </TabsContent>
// //         </Tabs>
// //       </div>

// //       {/* Related Products Section - NEW */}
// //       {relatedProducts.length > 0 && (
// //         <div className="mt-16">
// //           <Separator className="mb-8" />
// //           <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //             {relatedProducts.map((relatedProduct) => (
// //               <ProductCard key={relatedProduct.id} product={relatedProduct} />
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }
// // src/app/(root)/products/[id]/page.tsx
// // src/app/(root)/products/[id]/page.tsx
// import { notFound } from "next/navigation";
// import { getProductById, getRelatedProducts } from "@/actions/products";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { ProductJsonLd } from "@/components/products/ProductJsonLd";
// import { ProductGallery, ProductInfo, ProductTabs, RelatedProducts } from "@/components/products/page-detail";
// import { Separator } from "@/components/ui/separator";
// import type { Metadata, ResolvingMetadata } from "next";

// // ---------- Metadata ----------
// interface MetadataProps {
//   params: Promise<{ id: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// export async function generateMetadata(props: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
//   const params = await props.params;
//   const id = params.id;

//   const result = await getProductById(id);
//   if (!result.success) {
//     return {
//       title: "Product Not Found | MotoStix",
//       description: "The requested product could not be found."
//     };
//   }

//   const product = result.product;
//   const previousImages = (await parent).openGraph?.images || [];

//   return {
//     title: `${product.name} | MotoStix`,
//     description: product.description || `Check out ${product.name} at MotoStix`,
//     openGraph: {
//       title: `${product.name} | MotoStix`,
//       description: product.description || `Check out ${product.name} at MotoStix`,
//       images: product.image ? [{ url: product.image, alt: product.name }] : previousImages
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: product.name,
//       description: product.description?.substring(0, 200) || "",
//       images: product.image ? [product.image] : []
//     }
//   };
// }

// // ---------- Page ----------
// interface PageProps {
//   params: Promise<{ id: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// export default async function ProductDetailPage({ params }: PageProps) {
//   const resolvedParams = await params;
//   const id = resolvedParams.id;

//   const result = await getProductById(id);
//   if (!result.success) notFound();

//   const product = result.product;
//   const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://motostix.com"}/products/${product.id}`;

//   const relatedProductsResult = await getRelatedProducts({
//     productId: product.id,
//     category: product.category,
//     limit: 4
//   });
//   console.log("RELATED PRODUCTS: ", relatedProductsResult);

//   return (
//     <div className="container py-8">
//       {/* Structured Data */}
//       <ProductJsonLd product={product} url={productUrl} />

//       {/* Breadcrumb + Back */}
//       <div className="mb-8">
//         <div className="text-sm text-muted-foreground mb-2">
//           <Link href="/" className="hover:text-foreground">
//             Home
//           </Link>{" "}
//           /{" "}
//           <Link href="/products" className="hover:text-foreground">
//             Products
//           </Link>
//           {product.category && (
//             <>
//               {" / "}
//               <Link
//                 href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
//                 className="hover:text-foreground">
//                 {product.category}
//               </Link>
//             </>
//           )}
//         </div>

//         <Button variant="outline" asChild>
//           <Link href="/products">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Products
//           </Link>
//         </Button>
//       </div>

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <ProductGallery product={product} />
//         <ProductInfo product={product} />
//       </div>

//       <ProductTabs product={product} />

//       {relatedProductsResult.success && relatedProductsResult.products.length > 0 && (
//         <>
//           {/* <Separator className="my-16" /> */}

//           <RelatedProducts products={relatedProductsResult.products} />
//         </>
//       )}
//     </div>
//   );
// }
// src/app/(root)/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductJsonLd } from "@/components/products/ProductJsonLd";
import { ProductGallery, ProductInfo, ProductTabs, RelatedProducts } from "@/components/products/page-detail";
import { Separator } from "@/components/ui/separator";
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
    <div className="container py-8">
      {/* Structured Data */}
      <ProductJsonLd product={product} url={productUrl} />

      {/* Breadcrumb + Back */}
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-2">
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

        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      {relatedProductsResult.success && relatedProductsResult.products.length > 0 && (
        <>
          <Separator className="my-16" />
          <RelatedProducts products={relatedProductsResult.products} />
        </>
      )}
    </div>
  );
}
