import { getAllProducts } from "@/actions/products/get-all-products";
import { extractCategoriesFromProducts } from "@/utils/product-utils";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { CategoryCardsWrapper } from "@/components/products/CategoryCardsWrapper";
import { ProductsFiltersWrapper } from "@/components/products/ProductsFiltersWrapper";
import { ProductsGrid } from "@/components/products/ProductsGrid";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | MotoStix",
  description: "Browse our collection of premium motorcycle decals and stickers"
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }> | { category?: string };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Await the searchParams object before accessing its properties
  const params = await searchParams;

  // Now safely access the category property
  const selectedCategory = params?.category || "all";

  // Fetch products
  const productsResult = await getAllProducts();
  const products = productsResult.success ? productsResult.data : [];

  // Extract categories from products - now directly returns CategoryData[]
  const categories = extractCategoriesFromProducts(products);

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory && selectedCategory !== "all"
      ? products.filter(product => product.category?.toLowerCase().replace(/\s+/g, "-") === selectedCategory)
      : products;

  return (
    <>
      <main className="min-h-screen">
        <div className="container py-8 md:py-12">
          <ProductsHeader />
          <CategoryCardsWrapper categories={categories} selectedCategory={selectedCategory} />
          <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            <aside className="hidden lg:block">
              <ProductsFiltersWrapper selectedCategory={selectedCategory} />
            </aside>
            <div>
              <ProductsGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
