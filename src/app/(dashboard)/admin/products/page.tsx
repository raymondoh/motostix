// src/app/(dashboard)/admin/products/page.tsx
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { DashboardShell, DashboardHeader } from "@/components";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllProducts } from "@/actions/products/get-all-products";
import { getCategories, getFeaturedCategories } from "@/actions/categories/get-categories";
//import type { Category } from "@/types/category";

import { AdminProductsClient } from "@/components/dashboard/admin/products/AdminProductsClient";

export const metadata: Metadata = {
  title: "Product Management",
  description: "Manage products in your catalog"
};

export default async function AdminProductsPage() {
  // Get the session server-side
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Check if user has admin role
  if (session.user.role !== "admin") {
    redirect("/not-authorized");
  }

  // Fetch initial products data
  const productsResult = await getAllProducts();
  const products = productsResult.success ? productsResult.data : [];

  // Fetch categories data
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];

  // Fetch featured categories data
  const featuredCategoriesResult = await getFeaturedCategories();

  // Map the featured categories to include the id property
  const featuredCategories = featuredCategoriesResult.success
    ? featuredCategoriesResult.data.map(cat => ({
        id: cat.slug, // Use slug as id
        name: cat.name,
        count: cat.count,
        image: cat.image
      }))
    : [];

  return (
    <DashboardShell>
      <DashboardHeader
        title="Product Management"
        description="View and manage products in your catalog."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Products" }]}
      />
      <Separator className="mb-8" />

      {/* Added a container with overflow handling */}
      <div className="w-full overflow-hidden">
        <AdminProductsClient
          products={products}
          categories={categories || []}
          featuredCategories={featuredCategories}
        />
      </div>
    </DashboardShell>
  );
}
