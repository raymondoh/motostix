// // // src/app/(root)/products/page.tsx

// import { ProductsProvider } from "@/components/products/ProductsProvider";
// import { ProductsHeader } from "@/components/products/ProductsHeader";
// import { ProductsGrid } from "@/components/products/ProductsGrid";
// import { ProductFilters } from "@/components/products/filters/ProductFilters";
// import { CategoryCardsWrapper } from "@/components/products/category-carousel/CategoryCardsWrapper";
// import { SubcategoryCardsWrapper } from "@/components/products/subcategory-carousel/SubcategoryCardsWrapper";
// import { getAllProducts, getCategories } from "@/firebase/actions";
// import {
//   type CategoryData,
//   categoriesToData as convertCategoryNamesToData,
//   type Category as CategoryNameType
// } from "@/config/categories";

// // Define the correct type for Next.js App Router searchParams
// type SearchParams = Promise<{
//   [key: string]: string | string[] | undefined;
// }>;

// // Update the page props interface to match Next.js 15 conventions
// interface ProductsPageProps {
//   params: Promise<{ slug?: string }>;
//   searchParams: SearchParams;
// }

// // Type guard to check if an item is a CategoryData object
// function isCategoryData(item: unknown): item is CategoryData {
//   return (
//     typeof item === "object" &&
//     item !== null &&
//     "id" in item &&
//     "name" in item &&
//     typeof (item as CategoryData).id === "string" &&
//     typeof (item as CategoryData).name === "string"
//   );
// }

// // Type guard to check if an item is a category name string
// function isCategoryName(item: unknown): item is CategoryNameType {
//   return typeof item === "string";
// }

// const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
//   // Await searchParams before accessing properties (Next.js 15 requirement)
//   const resolvedSearchParams = await searchParams;

//   // Extract and normalize category and subcategory from searchParams
//   const currentCategory =
//     typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category.toLowerCase() : undefined;

//   const currentSubcategory =
//     typeof resolvedSearchParams?.subcategory === "string" ? resolvedSearchParams.subcategory.toLowerCase() : undefined;

//   console.log(
//     "ProductsPage - Render. currentCategory from URL:",
//     currentCategory,
//     "currentSubcategory from URL:",
//     currentSubcategory
//   );

//   // Fetch initial products
//   const { data: initialProductsData, error: initialProductsError } = await getAllProducts({
//     category: currentCategory,
//     subcategory: currentSubcategory
//   });

//   if (initialProductsError) {
//     console.error("ProductsPage - Error fetching initial products:", initialProductsError);
//   }

//   const initialProducts = initialProductsData || [];
//   console.log("ProductsPage - initialProducts count after getAllProducts:", initialProducts.length);

//   if (initialProducts.length === 0 && (currentCategory || currentSubcategory)) {
//     console.warn("ProductsPage - WARNING: getAllProducts returned no items for the selected category/subcategory:", {
//       category: currentCategory,
//       subcategory: currentSubcategory
//     });
//   }

//   // Fetch and process categories with simplified logic
//   let categoriesToShow: CategoryData[] = [];

//   try {
//     const categoriesResult = await getCategories();

//     if (categoriesResult?.success && categoriesResult.data) {
//       const data = categoriesResult.data;

//       if (Array.isArray(data)) {
//         if (data.length === 0) {
//           categoriesToShow = [];
//         } else if (data.every(isCategoryData)) {
//           // data is CategoryData[]
//           categoriesToShow = data;
//         } else if (data.every(isCategoryName)) {
//           // data is string[] (category names)
//           categoriesToShow = convertCategoryNamesToData(data);
//         } else {
//           console.warn("ProductsPage - getCategories returned mixed or unexpected array types:", data);
//           categoriesToShow = [];
//         }
//       } else {
//         console.warn("ProductsPage - getCategories data is not an array:", data);
//         categoriesToShow = [];
//       }
//     } else {
//       console.error("ProductsPage - Error from getCategories:", categoriesResult?.error || "Unknown error");
//       categoriesToShow = [];
//     }
//   } catch (error) {
//     console.error("ProductsPage - Exception fetching/processing categories:", error);
//     categoriesToShow = [];
//   }

//   return (
//     <ProductsProvider
//       initialProducts={initialProducts}
//       currentCategory={currentCategory}
//       currentSubcategory={currentSubcategory}>
//       <main className="min-h-screen">
//         <section className="py-16 w-full bg-background">
//           <div className="container mx-auto px-4">
//             <ProductsHeader />
//             <CategoryCardsWrapper categories={categoriesToShow} selectedCategory={currentCategory ?? null} />
//             <SubcategoryCardsWrapper parentCategory={currentCategory ?? null} />
//           </div>
//         </section>

//         <section className="py-10 w-full bg-secondary/5 border-y border-border/40">
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
// };

// export default ProductsPage;
// src/app/(root)/products/page.tsx

import { ProductsProvider } from "@/components/products/ProductsProvider";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { ProductFilters } from "@/components/products/filters/ProductFilters";
import { CategoryCardsWrapper } from "@/components/products/category-carousel/CategoryCardsWrapper";
import { SubcategoryCardsWrapper } from "@/components/products/subcategory-carousel/SubcategoryCardsWrapper";
import { getAllProducts, getCategories } from "@/firebase/actions";
import {
  type CategoryData,
  categoriesToData as convertCategoryNamesToData,
  type Category as CategoryNameType
} from "@/config/categories";

// Define the correct type for Next.js App Router searchParams
type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

// Update the page props interface to match Next.js 15 conventions
interface ProductsPageProps {
  params: Promise<{ slug?: string }>;
  searchParams: SearchParams;
}

// Type guard to check if an item is a CategoryData object
function isCategoryData(item: unknown): item is CategoryData {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "name" in item &&
    typeof (item as CategoryData).id === "string" &&
    typeof (item as CategoryData).name === "string"
  );
}

// Type guard to check if an item is a category name string
function isCategoryName(item: unknown): item is CategoryNameType {
  return typeof item === "string" && ["Cars", "Motorbikes", "Bicycles", "EVs", "Other"].includes(item as string);
}

// Helper function to safely process categories data
function processCategoriesData(data: unknown[]): CategoryData[] {
  if (data.length === 0) {
    return [];
  }

  // Check if all items are CategoryData objects
  const allAreCategoryData = data.every(isCategoryData);
  if (allAreCategoryData) {
    return data as CategoryData[];
  }

  // Check if all items are category name strings
  const allAreCategoryNames = data.every(isCategoryName);
  if (allAreCategoryNames) {
    return convertCategoryNamesToData(data as CategoryNameType[]);
  }

  // Handle mixed array - filter and process separately
  const categoryDataItems = data.filter(isCategoryData);
  const categoryNameItems = data.filter(isCategoryName);

  if (categoryDataItems.length > 0 && categoryNameItems.length === 0) {
    // Only CategoryData items found
    return categoryDataItems;
  } else if (categoryDataItems.length === 0 && categoryNameItems.length > 0) {
    // Only category name strings found
    return convertCategoryNamesToData(categoryNameItems);
  } else if (categoryDataItems.length > 0 && categoryNameItems.length > 0) {
    // Mixed types - prefer CategoryData objects, but convert names too
    console.warn("Mixed category types found, combining both types");
    const convertedNames = convertCategoryNamesToData(categoryNameItems);
    return [...categoryDataItems, ...convertedNames];
  } else {
    // No valid items found
    console.warn("No valid category items found in data:", data);
    return [];
  }
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  // Await searchParams before accessing properties (Next.js 15 requirement)
  const resolvedSearchParams = await searchParams;

  // Extract and normalize category and subcategory from searchParams
  const currentCategory =
    typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category.toLowerCase() : undefined;

  const currentSubcategory =
    typeof resolvedSearchParams?.subcategory === "string" ? resolvedSearchParams.subcategory.toLowerCase() : undefined;

  console.log(
    "ProductsPage - Render. currentCategory from URL:",
    currentCategory,
    "currentSubcategory from URL:",
    currentSubcategory
  );

  // Fetch initial products
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
      category: currentCategory,
      subcategory: currentSubcategory
    });
  }

  // Fetch and process categories with improved type handling
  let categoriesToShow: CategoryData[] = [];

  try {
    const categoriesResult = await getCategories();

    if (categoriesResult?.success && categoriesResult.data) {
      const data = categoriesResult.data;

      if (Array.isArray(data)) {
        categoriesToShow = processCategoriesData(data);
      } else {
        console.warn("ProductsPage - getCategories data is not an array:", data);
        categoriesToShow = [];
      }
    } else {
      console.error("ProductsPage - Error from getCategories:", categoriesResult?.error || "Unknown error");
      categoriesToShow = [];
    }
  } catch (error) {
    console.error("ProductsPage - Exception fetching/processing categories:", error);
    categoriesToShow = [];
  }

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
            <SubcategoryCardsWrapper parentCategory={currentCategory ?? null} />
          </div>
        </section>

        <section className="py-10 w-full bg-secondary/5 border-y border-border/40">
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
};

export default ProductsPage;
