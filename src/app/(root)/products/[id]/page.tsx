// import { notFound } from "next/navigation";
// import { getProductById } from "@/actions/products";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft, Share2, Heart } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import { ProductActions } from "@/components/products/ProductActions";
// import { formatPriceWithCode } from "@/lib/utils";
// import type { Metadata, ResolvingMetadata } from "next";
// import { ProductJsonLd } from "@/components/products/ProductJsonLd";

// // Define the params type for generateMetadata
// type Props = {
//   params: { id: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

// // Generate dynamic metadata based on the product
// export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
//   // Properly await the params object
//   const params = await Promise.resolve(props.params);
//   const id = params.id;

//   // Get the product data
//   const result = await getProductById(id);

//   // If product not found, return basic metadata
//   if (!result.success) {
//     return {
//       title: "Product Not Found | MotoStix",
//       description: "The requested product could not be found."
//     };
//   }

//   const product = result.product;

//   // Get the parent metadata (optional)
//   const previousImages = (await parent).openGraph?.images || [];

//   return {
//     title: `${product.name} | MotoStix`,
//     description: product.description || `Check out ${product.name} at MotoStix`,
//     openGraph: {
//       title: `${product.name} | MotoStix`,
//       description: product.description || `Check out ${product.name} at MotoStix`,
//       images: product.image ? [{ url: product.image, alt: product.name }] : previousImages,
//       // Using a valid OpenGraph type
//       type: "website"
//     },
//     // Twitter card metadata
//     twitter: {
//       card: "summary_large_image",
//       title: product.name,
//       description: product.description?.substring(0, 200) || `Check out ${product.name} at MotoStix`,
//       images: product.image ? [product.image] : []
//     }
//   };
// }

// export default async function ProductDetailPage(props: { params: { id: string } }) {
//   // Properly await the params object
//   const params = await Promise.resolve(props.params);
//   const id = params.id;

//   const result = await getProductById(id);

//   if (!result.success) {
//     notFound();
//   }

//   const product = result.product;
//   const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://motostix.com"}/products/${product.id}`;

//   // This would be implemented in a real app
//   const relatedProducts = []; // Placeholder for related products

//   return (
//     <div className="container py-8">
//       {/* Add the JSON-LD structured data */}
//       <ProductJsonLd product={product} url={productUrl} />

//       {/* Breadcrumb Navigation */}
//       <nav className="flex mb-4 text-sm text-muted-foreground">
//         <ol className="flex items-center space-x-1">
//           <li>
//             <Link href="/" className="hover:text-foreground">
//               Home
//             </Link>
//           </li>
//           <li className="flex items-center space-x-1">
//             <span>/</span>
//             <Link href="/products" className="hover:text-foreground">
//               Products
//             </Link>
//           </li>
//           {product.category && (
//             <li className="flex items-center space-x-1">
//               <span>/</span>
//               <Link
//                 href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
//                 className="hover:text-foreground">
//                 {product.category}
//               </Link>
//             </li>
//           )}
//           <li className="flex items-center space-x-1">
//             <span>/</span>
//             <span className="text-foreground">{product.name}</span>
//           </li>
//         </ol>
//       </nav>

//       {/* Back Button */}
//       <div className="mb-8">
//         <Button variant="outline" asChild>
//           <Link href="/products">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Products
//           </Link>
//         </Button>
//       </div>

//       {/* Two-column layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left: Product Image Gallery */}
//         <div className="space-y-4">
//           {/* Main Image */}
//           <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
//             <Image
//               src={product.image || "/placeholder.svg"}
//               alt={product.name}
//               fill
//               className="object-contain p-6"
//               sizes="(max-width: 768px) 100vw, 500px"
//               priority
//             />
//           </div>

//           {/* Image Thumbnails - would need multiple images in your product model */}
//           <div className="flex space-x-2 overflow-x-auto pb-2">
//             <button className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-primary">
//               <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
//             </button>
//             {/* Additional thumbnails would go here */}
//           </div>
//         </div>

//         {/* Right: Product Info */}
//         <div className="flex flex-col space-y-6">
//           {/* Category/Subcategory */}
//           <div className="text-sm text-muted-foreground">
//             {product.category && (
//               <Link
//                 href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
//                 className="hover:underline">
//                 {product.category}
//               </Link>
//             )}
//             {product.subcategory && (
//               <>
//                 {" / "}
//                 <Link
//                   href={`/products?category=${product.category
//                     ?.toLowerCase()
//                     .replace(/\s+/g, "-")}&subcategory=${product.subcategory.toLowerCase().replace(/\s+/g, "-")}`}
//                   className="hover:underline">
//                   {product.subcategory}
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Name */}
//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold">{product.name}</h1>

//             {/* Badge (optional) */}
//             {product.badge && (
//               <Badge variant="outline" className="w-fit text-sm">
//                 {product.badge}
//               </Badge>
//             )}
//           </div>

//           {/* Price */}
//           <div>
//             <p className="text-2xl font-semibold">{formatPriceWithCode(product.price, "GB")}</p>
//           </div>

//           {/* In Stock Status */}
//           <div>
//             {product.inStock ? (
//               <Badge variant="default">In Stock</Badge>
//             ) : (
//               <Badge variant="destructive">Out of Stock</Badge>
//             )}
//           </div>

//           {/* Description */}
//           {product.description && (
//             <div className="prose prose-sm dark:prose-invert">
//               <p>{product.description}</p>
//             </div>
//           )}

//           {/* Add to Cart Section */}
//           {product.inStock && (
//             <div className="flex flex-col space-y-4">
//               <ProductActions product={product} />
//             </div>
//           )}

//           {/* Wishlist and Share */}
//           <div className="flex space-x-2">
//             <Button variant="outline" className="flex-1">
//               <Heart className="mr-2 h-4 w-4" />
//               Add to Wishlist
//             </Button>
//             <Button variant="outline" className="flex-1">
//               <Share2 className="mr-2 h-4 w-4" />
//               Share
//             </Button>
//           </div>

//           {/* Specifications */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold mb-3">Specifications</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
//               {product.dimensions && (
//                 <>
//                   <div className="text-sm font-medium">Dimensions</div>
//                   <div className="text-sm text-muted-foreground">{product.dimensions}</div>
//                 </>
//               )}
//               {product.material && (
//                 <>
//                   <div className="text-sm font-medium">Material</div>
//                   <div className="text-sm text-muted-foreground">{product.material}</div>
//                 </>
//               )}
//               {product.color && (
//                 <>
//                   <div className="text-sm font-medium">Color</div>
//                   <div className="text-sm text-muted-foreground">{product.color}</div>
//                 </>
//               )}
//               {product.stickySide && (
//                 <>
//                   <div className="text-sm font-medium">Sticky Side</div>
//                   <div className="text-sm text-muted-foreground">{product.stickySide}</div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Details (if different from description) */}
//           {product.details && (
//             <div className="border-t pt-4">
//               <h3 className="font-semibold mb-2">Details</h3>
//               <p className="text-sm text-muted-foreground">{product.details}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Related Products Section */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-16">
//           <h2 className="text-2xl font-bold mb-6">You might also like</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {relatedProducts.map(relatedProduct => (
//               <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="group">
//                 <div className="relative aspect-square rounded-md overflow-hidden bg-muted mb-2">
//                   <Image
//                     src={relatedProduct.image || "/placeholder.svg"}
//                     alt={relatedProduct.name}
//                     fill
//                     className="object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//                 <h3 className="font-medium text-sm truncate">{relatedProduct.name}</h3>
//                 <p className="text-sm text-muted-foreground">{formatPriceWithCode(relatedProduct.price, "GB")}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Customer Reviews Section - Placeholder */}
//       <div className="mt-16">
//         <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

//         {/* Review summary */}
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="text-4xl font-bold">4.8</div>
//           <div>
//             <div className="flex text-yellow-400">
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//               </svg>
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//               </svg>
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//               </svg>
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//               </svg>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 className="text-gray-300 dark:text-gray-600">
//                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//               </svg>
//             </div>
//             <div className="text-sm text-muted-foreground">Based on 24 reviews</div>
//           </div>
//         </div>

//         {/* Write a review button */}
//         <Button variant="outline" className="mb-8">
//           Write a Review
//         </Button>

//         {/* Placeholder for reviews */}
//         <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
//       </div>
//     </div>
//   );
// }
// src/app/(root)/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProductById } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductActions } from "@/components/products/ProductActions";
import { formatPriceWithCode } from "@/lib/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { ProductJsonLd } from "@/components/products/ProductJsonLd";

// Define the params type for generateMetadata
interface MetadataProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate dynamic metadata based on the product
export async function generateMetadata(props: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
  // Await the params object before accessing its properties
  const params = await props.params;
  const id = params.id;

  // Get the product data
  const result = await getProductById(id);

  // If product not found, return basic metadata
  if (!result.success) {
    return {
      title: "Product Not Found | MotoStix",
      description: "The requested product could not be found."
    };
  }

  const product = result.product;

  // Get the parent metadata (optional)
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | MotoStix`,
    description: product.description || `Check out ${product.name} at MotoStix`,
    openGraph: {
      title: `${product.name} | MotoStix`,
      description: product.description || `Check out ${product.name} at MotoStix`,
      images: product.image ? [{ url: product.image, alt: product.name }] : previousImages,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.substring(0, 200) || `Check out ${product.name} at MotoStix`,
      images: product.image ? [product.image] : []
    }
  };
}

// Define the page props interface to match your project's pattern
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const result = await getProductById(id);

  if (!result.success) {
    notFound();
  }

  const product = result.product;
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://motostix.com"}/products/${product.id}`;

  // This would be implemented in a real app
  const relatedProducts = []; // Placeholder for related products

  return (
    <div className="container py-8">
      {/* Add the JSON-LD structured data */}
      <ProductJsonLd product={product} url={productUrl} />

      {/* Breadcrumb Navigation */}
      <nav className="flex mb-4 text-sm text-muted-foreground">
        <ol className="flex items-center space-x-1">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li className="flex items-center space-x-1">
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
          </li>
          {product.category && (
            <li className="flex items-center space-x-1">
              <span>/</span>
              <Link
                href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-foreground">
                {product.category}
              </Link>
            </li>
          )}
          <li className="flex items-center space-x-1">
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Rest of your component... */}
      {/* (I'm keeping this shorter for clarity) */}

      {/* Back Button */}
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Product Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>

          {/* Image Thumbnails - would need multiple images in your product model */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-primary">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </button>
            {/* Additional thumbnails would go here */}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col space-y-6">
          {/* Category/Subcategory */}
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

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm dark:prose-invert">
              <p>{product.description}</p>
            </div>
          )}

          {/* Add to Cart Section */}
          {product.inStock && (
            <div className="flex flex-col space-y-4">
              <ProductActions product={product} />
            </div>
          )}

          {/* Wishlist and Share */}
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Add to Wishlist
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Specifications */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              {product.dimensions && (
                <>
                  <div className="text-sm font-medium">Dimensions</div>
                  <div className="text-sm text-muted-foreground">{product.dimensions}</div>
                </>
              )}
              {product.material && (
                <>
                  <div className="text-sm font-medium">Material</div>
                  <div className="text-sm text-muted-foreground">{product.material}</div>
                </>
              )}
              {product.color && (
                <>
                  <div className="text-sm font-medium">Color</div>
                  <div className="text-sm text-muted-foreground">{product.color}</div>
                </>
              )}
              {product.stickySide && (
                <>
                  <div className="text-sm font-medium">Sticky Side</div>
                  <div className="text-sm text-muted-foreground">{product.stickySide}</div>
                </>
              )}
            </div>
          </div>

          {/* Details (if different from description) */}
          {product.details && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Details</h3>
              <p className="text-sm text-muted-foreground">{product.details}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
