// import type { Metadata } from "next";
// import { notFound, redirect } from "next/navigation";
// import { Separator } from "@/components/ui/separator";
// import { DashboardShell, DashboardHeader } from "@/components";
// import { UpdateProductForm } from "@/components/dashboard/admin/products/UpdateProductForm";
// import { auth } from "@/auth";
// import { getProductById } from "@/actions/products";

// export const metadata: Metadata = {
//   title: "Edit Product",
//   description: "Edit product details"
// };

// export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = await params;
//   const productId = resolvedParams.id;

//   const session = await auth();

//   if (!session?.user || session.user.role !== "admin") {
//     redirect("/not-authorized");
//   }

//   if (!session?.user) {
//     redirect("/login");
//   }

//   if (session.user.role !== "admin") {
//     redirect("/not-authorized");
//   }

//   const result = await getProductById(productId);

//   if (!result.success || !result.product) {
//     notFound();
//   }

//   const product = result.product;

//   return (
//     <DashboardShell>
//       <DashboardHeader
//         title="Edit Product"
//         description={`Update details for ${product.name}`}
//         breadcrumbs={[
//           { label: "Home", href: "/" },
//           { label: "Admin", href: "/admin" },
//           { label: "Products", href: "/admin/products" },
//           { label: "Edit Product" }
//         ]}
//       />
//       <Separator className="mb-8" />

//       <div className="w-full max-w-4xl overflow-hidden">
//         <div className="rounded-lg border bg-card p-6">
//           <UpdateProductForm product={product} />
//         </div>
//       </div>
//     </DashboardShell>
//   );
// }
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DashboardShell, DashboardHeader } from "@/components";
import { UpdateProductForm } from "@/components/dashboard/admin/products/UpdateProductForm";
import { getProductByIdAction } from "@/actions/products/get-product";
import { UserService } from "@/lib/services/user-service";

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Dynamic import for auth to avoid build-time issues
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    // Check admin role using UserService
    const userRole = await UserService.getUserRole(session.user.id);
    if (userRole !== "admin") {
      redirect("/not-authorized");
    }

    // Await params for Next.js 15 compatibility
    const { id } = await params;

    // Fetch product data
    const result = await getProductByIdAction(id);

    if (!result.success) {
      redirect("/admin/products");
    }

    // Type guard to ensure we have the product
    if (!("product" in result) || !result.product) {
      redirect("/admin/products");
    }

    const product = result.product;

    return (
      <DashboardShell>
        <DashboardHeader
          title="Edit Product"
          description="Update product information and settings"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin" },
            { label: "Products", href: "/admin/products" },
            { label: product.name || "Edit" }
          ]}
        />
        <Separator className="mb-8" />

        <div className="w-full max-w-7xl overflow-hidden">
          <UpdateProductForm product={product} />
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error in AdminProductEditPage:", error);
    redirect("/admin/products");
  }
}
