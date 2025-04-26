// // src/app/products/[id]/page.tsx

// import Image from "next/image";
// import { notFound } from "next/navigation";
// import { getProductById } from "@/firebase/admin/products";

// export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const result = await getProductById(id);

//   if (!result.success) {
//     return notFound();
//   }

//   const product = result.product;

//   return (
//     <div className="container mx-auto max-w-4xl py-10">
//       <h1 className="text-3xl font-bold">{product.name}</h1>

//       <div className="relative w-full max-w-md h-[300px] mt-6 rounded overflow-hidden border bg-muted">
//         <Image
//           src={product.image}
//           alt={product.name}
//           fill
//           sizes="(max-width: 768px) 100vw, 300px"
//           className="object-contain p-2"
//         />
//       </div>

//       <p className="text-muted-foreground mt-4">{product.description}</p>

//       <p className="mt-6 text-xl font-semibold">${product.price.toFixed(2)}</p>

//       {product.badge && (
//         <span className="inline-block mt-4 bg-blue-100 text-blue-700 px-2 py-1 rounded">{product.badge}</span>
//       )}
//     </div>
//   );
// }
// src/app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProductById } from "@/firebase/admin/products";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const result = await getProductById(params.id);

  if (!result.success) {
    notFound();
  }

  const product = result.product;

  return (
    <div className="container py-8">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/products">← Back to Products</Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-[400px]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-muted-foreground mb-6">${product.price.toFixed(2)}</p>
          {product.description ? (
            <p className="text-muted-foreground">{product.description}</p>
          ) : (
            <p className="text-muted-foreground italic">No description available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
