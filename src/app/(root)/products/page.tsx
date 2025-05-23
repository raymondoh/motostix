// //src/app/(root)/products/page.tsx
// import React from "react";
// import { getAllProducts } from "@/actions/products/get-all-products";
// import { extractCategoriesFromProducts } from "@/utils/product-utils";
// import { ProductsHeader } from "@/components/products/ProductsHeader";
// import { CategoryCardsWrapper } from "@/components/products/category-carousel/CategoryCardsWrapper";
// import { SubcategoryCardsWrapper } from "@/components/products/subcategory-carousel/SubcategoryCardsWrapper";
// import { ProductsGrid } from "@/components/products/ProductsGrid";
// import { ProductsProvider } from "@/components/products/ProductsProvider";
// import { ProductFilters } from "@/components/products/filters/ProductFilters";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Products | MotoStix",
//   description: "Browse our collection of premium motorcycle decals and stickers"
// };

// interface ProductsPageProps {
//   params: Promise<{}>;
//   searchParams: Promise<{ category?: string; subcategory?: string }>;
// }

// export default async function ProductsPage({ searchParams }: ProductsPageProps) {
//   // Await the searchParams object before accessing its properties
//   const params = await searchParams;

//   // Now safely access the category and subcategory properties
//   const selectedCategory = params?.category || null;
//   const selectedSubcategory = params?.subcategory || null;

//   // Fetch products
//   const productsResult = await getAllProducts();
//   const products = productsResult.success ? productsResult.data : [];

//   // Extract categories from products
//   const categories = extractCategoriesFromProducts(products);

//   // Filter products by category and subcategory
//   const categoryFilteredProducts = products.filter(product => {
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
//     <ProductsProvider products={categoryFilteredProducts}>
//       <main className="min-h-screen">
//         {/* Header section with standardized padding */}
//         <section className="py-16 w-full bg-background">
//           <div className="container mx-auto px-4">
//             <ProductsHeader />
//             <CategoryCardsWrapper categories={categories} selectedCategory={selectedCategory} />
//             <SubcategoryCardsWrapper parentCategory={selectedCategory} />
//           </div>
//         </section>

//         {/* Products section with standardized padding */}
//         <section className="py-16 w-full bg-secondary/5 border-y border-border/40">
//           <div className="container mx-auto px-4">
//             <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
//               {/* Sticky sidebar for filters */}
//               <aside className="hidden lg:block h-fit">
//                 <div className="bg-background rounded-xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto shadow-sm border border-border/40">
//                   <ProductFilters />
//                 </div>
//               </aside>
//               <div>
//                 <ProductsGrid />
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </ProductsProvider>
//   );
// }
// src/app/(root)/products/page.tsx
// import { ProductsProvider } from "@/components/products/ProductsProvider";
// import { ProductsHeader } from "@/components/products/ProductsHeader"; // Will be the new "dumb" version
// import { ProductsGrid } from "@/components/products/ProductsGrid";
// import { ProductFilters } from "@/components/products/filters/ProductFilters";
// import { CategoryCardsWrapper } from "@/components/products/category-carousel/CategoryCardsWrapper";
// import { SubcategoryCardsWrapper } from "@/components/products/subcategory-carousel/SubcategoryCardsWrapper";
// import { getAllProducts, getCategories, getSubcategories } from "@/firebase/actions";
// import type {Category as CategoryData } from "@/types/category";

// export const dynamic = 'force-dynamic';

// export default async function ProductsPage({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | string[] | undefined };
// }) {
//   const currentCategory = typeof searchParams?.category === "string" ? searchParams.category : undefined;
//   const currentSubcategory = typeof searchParams?.subcategory === "string" ? searchParams.subcategory : undefined;

//   console.log("ProductsPage - Render. currentCategory from URL:", currentCategory, "currentSubcategory from URL:", currentSubcategory);

//   const { data: initialProductsData, error: initialProductsError } = await getAllProducts({
//     category: currentCategory,
//     subcategory: currentSubcategory,
//   });

//   if (initialProductsError) {
//     console.error("ProductsPage - Error fetching initial products:", initialProductsError);
//   }
//   const initialProducts = initialProductsData || [];
//   console.log("ProductsPage - initialProducts count after getAllProducts:", initialProducts.length);
//   if (initialProducts.length === 0 && (currentCategory || currentSubcategory)) {
//     console.warn("ProductsPage - WARNING: getAllProducts returned no items for the selected category/subcategory:", {category: currentCategory, subcategory: currentSubcategory });
//   }

//   let categoriesToShow: CategoryData[] = [];
//   try {
//     const categoriesResult = await getCategories();
//     if (categoriesResult?.success && Array.isArray(categoriesResult.data)) {
//       categoriesToShow = categoriesResult.data;
//     } else if (categoriesResult?.success && Array.isArray(categoriesResult.data?.categories)) {
//         categoriesToShow = categoriesResult.data.categories;
//     } else if (Array.isArray(categoriesResult)) {
//         categoriesToShow = categoriesResult;
//     } else {
//       // console.warn("ProductsPage - Could not parse categories from getCategories. Check return structure. Received:", categoriesResult);
//     }
//   } catch (error) {
//     console.error("ProductsPage - Error fetching categories:", error);
//   }
//   // console.log("ProductsPage - categoriesToShow for CategoryCardsWrapper:", categoriesToShow);

//   let subcategoriesToShowForHeader: CategoryData[] = []; // For potentially passing to a header/breadcrumbs if needed later
//   try {
//     if (currentCategory) {
//       const subcategoriesResult = await getSubcategories(currentCategory);
//       if (subcategoriesResult?.success && Array.isArray(subcategoriesResult.data)) {
//         subcategoriesToShowForHeader = subcategoriesResult.data;
//       } else if (subcategoriesResult?.success && Array.isArray(subcategoriesResult.data?.subcategories)) {
//           subcategoriesToShowForHeader = subcategoriesResult.data.subcategories;
//       } else if (Array.isArray(subcategoriesResult)) {
//           subcategoriesToShowForHeader = subcategoriesResult;
//       } else {
//         // console.warn("ProductsPage - Could not parse subcategories from getSubcategories. Check return structure. Received:", subcategoriesResult);
//       }
//     }
//   } catch (error) {
//     console.error("ProductsPage - Error fetching subcategories:", error);
//   }

//   return (
//     <ProductsProvider
//       initialProducts={initialProducts}
//       currentCategory={currentCategory}
//       currentSubcategory={currentSubcategory}
//     >
//       <main className="min-h-screen">
//         <section className="py-16 w-full bg-background">
//           <div className="container mx-auto px-4">
//             {/* ProductsHeader is now the simplified version without data props */}
//             <ProductsHeader />
//             <CategoryCardsWrapper
//               categories={categoriesToShow} // This prop is used by CategoryCardsWrapper
//               selectedCategory={currentCategory ?? null} // Pass currentCategory as selectedCategory
//             />
//             <SubcategoryCardsWrapper
//               parentCategory={currentCategory ?? null} // This prop is used by SubcategoryCardsWrapper
//             />
//           </div>
//         </section>

//         <section className="py-16 w-full bg-secondary/5 border-y border-border/40">
//           <div className="container mx-auto px-4">
//             <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
//               <aside className="hidden lg:block h-fit">
//                 <div className="bg-background rounded-xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto shadow-sm border border-border/40">
//                   <ProductFilters />
//                 </div>
//               </aside>
//               <div>
//                 <ProductsGrid />
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </ProductsProvider>
//   );
// }
//////////////////////////////////////
// src/app/(root)/products/page.tsx
import { ProductsProvider } from "@/components/products/ProductsProvider";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { ProductFilters } from "@/components/products/filters/ProductFilters";
import { CategoryCardsWrapper } from "@/components/products/category-carousel/CategoryCardsWrapper";
import { SubcategoryCardsWrapper } from "@/components/products/subcategory-carousel/SubcategoryCardsWrapper";
import { getAllProducts, getCategories, getSubcategories } from "@/firebase/actions";
import type { CategoryData } from "@/config/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | MotoStix",
  description: "Browse our collection of premium motorcycle decals and stickers"
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract and normalize category and subcategory from URL
  const currentCategory = typeof searchParams?.category === "string" ? searchParams.category.toLowerCase() : undefined;

  const currentSubcategory =
    typeof searchParams?.subcategory === "string" ? searchParams.subcategory.toLowerCase() : undefined;

  console.log(
    "ProductsPage - Render. currentCategory from URL:",
    currentCategory,
    "currentSubcategory from URL:",
    currentSubcategory
  );

  // Fetch products with normalized category/subcategory parameters
  console.log("ProductsPage - About to call getAllProducts with filters:", {
    category: currentCategory,
    subcategory: currentSubcategory
  });

  const { data: initialProductsData, error: initialProductsError } = await getAllProducts({
    category: currentCategory,
    subcategory: currentSubcategory
  });

  if (initialProductsError) {
    console.error("ProductsPage - Error fetching initial products:", initialProductsError);
  }

  const initialProducts = initialProductsData || [];
  console.log("ProductsPage - initialProducts count after getAllProducts:", initialProducts.length);

  if (initialProducts.length === 0 && (currentCategory || currentSubcategory)) {
    console.warn("ProductsPage - WARNING: getAllProducts returned no items for the selected category/subcategory:", {
      categorySlug: currentCategory,
      subcategorySlug: currentSubcategory
    });
  }

  // Fetch categories for the category carousel
  let categoriesToShow: CategoryData[] = [];
  try {
    const categoriesResult = await getCategories();
    if (categoriesResult?.success && Array.isArray(categoriesResult.data)) {
      categoriesToShow = categoriesResult.data;
    } else if (categoriesResult?.success && Array.isArray(categoriesResult.data?.categories)) {
      categoriesToShow = categoriesResult.data.categories;
    } else if (Array.isArray(categoriesResult)) {
      categoriesToShow = categoriesResult;
    } else {
      console.warn(
        "ProductsPage - Could not parse categories from getCategories. Check return structure. Received:",
        categoriesResult
      );
    }
  } catch (error) {
    console.error("ProductsPage - Error fetching categories:", error);
  }
  console.log("ProductsPage - categoriesToShow for CategoryCardsWrapper:", categoriesToShow);

  // Fetch subcategories for the selected category (if any)
  let subcategoriesToShowForHeader: CategoryData[] = [];
  try {
    if (currentCategory) {
      const subcategoriesResult = await getSubcategories(currentCategory);
      if (subcategoriesResult?.success && Array.isArray(subcategoriesResult.data)) {
        subcategoriesToShowForHeader = subcategoriesResult.data;
      } else if (subcategoriesResult?.success && Array.isArray(subcategoriesResult.data?.subcategories)) {
        subcategoriesToShowForHeader = subcategoriesResult.data.subcategories;
      } else if (Array.isArray(subcategoriesResult)) {
        subcategoriesToShowForHeader = subcategoriesResult;
      } else {
        console.warn(
          "ProductsPage - Could not parse subcategories from getSubcategories. Check return structure. Received:",
          subcategoriesResult
        );
      }
    }
  } catch (error) {
    console.error("ProductsPage - Error fetching subcategories:", error);
  }
  console.log("ProductsPage - subcategoriesToShowForHeader:", subcategoriesToShowForHeader);

  return (
    <ProductsProvider
      initialProducts={initialProducts}
      currentCategory={currentCategory}
      currentSubcategory={currentSubcategory}>
      <main className="min-h-screen">
        <section className="py-16 w-full bg-background">
          <div className="container mx-auto px-4">
            <ProductsHeader />
            <CategoryCardsWrapper categories={categoriesToShow} selectedCategory={currentCategory ?? null} />
            <SubcategoryCardsWrapper
              parentCategory={currentCategory ?? null}
              subcategories={subcategoriesToShowForHeader}
            />
          </div>
        </section>

        <section className="py-16 w-full bg-secondary/5 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              <aside className="hidden lg:block h-fit">
                <div className="bg-background rounded-xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto shadow-sm border border-border/40">
                  <ProductFilters />
                </div>
              </aside>
              <div>
                <ProductsGrid />
              </div>
            </div>
          </div>
        </section>
      </main>
    </ProductsProvider>
  );
}
