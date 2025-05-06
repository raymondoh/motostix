// import { getAllProducts } from "@/actions/products/get-all-products";
// import { extractCategoriesFromProducts } from "@/utils/product-utils";
// import { ProductsHeader } from "@/components/products/ProductsHeader";
// import { CategoryCardsWrapper } from "@/components/products/CategoryCardsWrapper";
// import { SubcategoryCardsWrapper } from "@/components/products/SubcategoryCardsWrapper";
// import { ProductsFiltersWrapper } from "@/components/products/ProductsFiltersWrapper";
// import { ProductsGrid } from "@/components/products/ProductsGrid";
// import { MobileFiltersButton } from "@/components/products/MobileFiltersButton";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Products | MotoStix",
//   description: "Browse our collection of premium motorcycle decals and stickers"
// };

// interface ProductsPageProps {
//   searchParams: Promise<{ category?: string; subcategory?: string }> | { category?: string; subcategory?: string };
// }

// export default async function ProductsPage({ searchParams }: ProductsPageProps) {
//   // Await the searchParams object before accessing its properties
//   const params = await searchParams;

//   // Now safely access the category and subcategory properties
//   const selectedCategory = params?.category || null;
//   const selectedSubcategory = params?.subcategory || null;

//   // Add server-side console log
//   console.log("ProductsPage - URL parameters:", { selectedCategory, selectedSubcategory });

//   // Fetch products
//   const productsResult = await getAllProducts();
//   const products = productsResult.success ? productsResult.data : [];

//   // Extract categories from products
//   const categories = extractCategoriesFromProducts(products);

//   // Filter products based on selected category and subcategory
//   const filteredProducts = products.filter(product => {
//     // If no category is selected, show all products
//     if (!selectedCategory || selectedCategory === "all") {
//       return true;
//     }

//     // Check if product matches the selected category
//     const categoryMatches = product.category?.toLowerCase().replace(/\s+/g, "-") === selectedCategory;

//     // If no subcategory is selected, just check the category
//     if (!selectedSubcategory) {
//       return categoryMatches;
//     }

//     // Check if product matches both category and subcategory
//     return categoryMatches && product.subcategory?.toLowerCase().replace(/\s+/g, "-") === selectedSubcategory;
//   });

//   return (
//     <>
//       <main className="min-h-screen">
//         <div className="container py-8 md:py-12">
//           <ProductsHeader />
//           <CategoryCardsWrapper categories={categories} selectedCategory={selectedCategory} />
//           <SubcategoryCardsWrapper parentCategory={selectedCategory} />
//           <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
//             {/* Add background and padding to the filter column */}
//             <aside className="hidden lg:block">
//               <div className="bg-secondary/10 dark:bg-secondary/5 rounded-lg p-5 sticky top-24">
//                 <ProductsFiltersWrapper selectedCategory={selectedCategory} categoriesData={categories} />
//               </div>
//             </aside>
//             <div>
//               {/* Add mobile filters button for small screens */}
//               <div className="lg:hidden mb-4">
//                 <MobileFiltersButton selectedCategory={selectedCategory} categoriesData={categories} />
//               </div>
//               <ProductsGrid products={filteredProducts} />
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
// src/app/(root)/products/page.tsx
import { getAllProducts } from "@/actions/products/get-all-products";
import { extractCategoriesFromProducts } from "@/utils/product-utils";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { CategoryCardsWrapper } from "@/components/products/CategoryCardsWrapper";
import { SubcategoryCardsWrapper } from "@/components/products/SubcategoryCardsWrapper";
import { ProductsFiltersWrapper } from "@/components/products/ProductsFiltersWrapper";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { MobileFiltersButton } from "@/components/products/MobileFiltersButton";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | MotoStix",
  description: "Browse our collection of premium motorcycle decals and stickers"
};

interface ProductsPageProps {
  params: Promise<{}>;
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  // Await the searchParams object before accessing its properties
  const resolvedParams = await searchParams;

  // Now safely access the category and subcategory properties
  const selectedCategory = resolvedParams?.category || null;
  const selectedSubcategory = resolvedParams?.subcategory || null;

  // Add server-side console log
  console.log("ProductsPage - URL parameters:", { selectedCategory, selectedSubcategory });

  // Fetch products
  const productsResult = await getAllProducts();
  const products = productsResult.success ? productsResult.data : [];

  // Extract categories from products
  const categories = extractCategoriesFromProducts(products);

  // Filter products based on selected category and subcategory
  const filteredProducts = products.filter(product => {
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
    <>
      <main className="min-h-screen">
        <div className="container py-8 md:py-12">
          <ProductsHeader />
          <CategoryCardsWrapper categories={categories} selectedCategory={selectedCategory} />
          <SubcategoryCardsWrapper parentCategory={selectedCategory} />
          <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Add background and padding to the filter column */}
            <aside className="hidden lg:block">
              <div className="bg-secondary/10 dark:bg-secondary/5 rounded-lg p-5 sticky top-24">
                <ProductsFiltersWrapper selectedCategory={selectedCategory} categoriesData={categories} />
              </div>
            </aside>
            <div>
              {/* Add mobile filters button for small screens */}
              <div className="lg:hidden mb-4">
                <MobileFiltersButton selectedCategory={selectedCategory} categoriesData={categories} />
              </div>
              <ProductsGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
