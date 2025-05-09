import { getAllProducts } from "@/actions/products/get-all-products";
import { extractCategoriesFromProducts } from "@/utils/product-utils";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { CategoryCardsWrapper } from "@/components/products/category-carousel/CategoryCardsWrapper";
import { SubcategoryCardsWrapper } from "@/components/products/SubcategoryCardsWrapper";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { ProductsProvider } from "@/components/products/ProductsProvider";
import { ProductFilters } from "@/components/products/filters/ProductFilters";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | MotoStix",
  description: "Browse our collection of premium motorcycle decals and stickers"
};

interface ProductsPageProps {
  params: Promise<{}>;
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Await the searchParams object before accessing its properties
  const params = await searchParams;

  // Now safely access the category and subcategory properties
  const selectedCategory = params?.category || null;
  const selectedSubcategory = params?.subcategory || null;

  // Fetch products
  const productsResult = await getAllProducts();
  const products = productsResult.success ? productsResult.data : [];

  // Extract categories from products
  const categories = extractCategoriesFromProducts(products);

  // Filter products by category and subcategory
  const categoryFilteredProducts = products.filter(product => {
    // If no category is selected, show all products
    if (!selectedCategory || selectedCategory === "all") {
      return true;
    }

    // Check if product matches the selected category
    const categoryMatches = product.category?.toLowerCase().replace(/\s+/g, "-") === selectedCategory;

    // If no subcategory is selected, just check the category
    if (!selectedSubcategory) {
      return categoryMatches;
    }

    // Check if product matches both category and subcategory
    return categoryMatches && product.subcategory?.toLowerCase().replace(/\s+/g, "-") === selectedSubcategory;
  });

  return (
    <ProductsProvider products={categoryFilteredProducts}>
      <main className="min-h-screen">
        <div className="container py-8 md:py-12">
          <ProductsHeader />
          <CategoryCardsWrapper categories={categories} selectedCategory={selectedCategory} />
          <SubcategoryCardsWrapper parentCategory={selectedCategory} />
          <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Sticky sidebar for filters */}
            <aside className="hidden lg:block h-fit">
              <div className="bg-secondary/10 dark:bg-secondary/5 rounded-lg p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <ProductFilters />
              </div>
            </aside>
            <div>
              <ProductsGrid />
            </div>
          </div>
        </div>
      </main>
    </ProductsProvider>
  );
}
