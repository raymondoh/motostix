// // src/app/(root)/products/page.tsx

// import { ProductsProvider } from "@/components/products/ProductsProvider";
// import { ProductsHeader } from "@/components/products/ProductsHeader";
// import { ProductsGrid } from "@/components/products/ProductsGrid";
// import { ProductFilters } from "@/components/products/filters/ProductFilters";
// import { CategoryCardsWrapper } from "@/components/products/category-carousel/CategoryCardsWrapper";
// import { SubcategoryCardsWrapper } from "@/components/products/subcategory-carousel/SubcategoryCardsWrapper";
// import { getAllProducts, getCategories } from "@/firebase/actions"; // Removed getSubcategories as it's not used here
// import {
//   CategoryData,
//   categoriesToData as convertCategoryNamesToData,
//   Category as CategoryNameType
// } from "@/config/categories";
// //PUT BACK AFTER TESTING
// // export const dynamic = "force-dynamic";

// // Define the correct type for Next.js App Router searchParams
// type SearchParams = Promise<{
//   [key: string]: string | string[] | undefined;
// }>;

// // Update the page props interface to match Next.js 15 conventions
// interface ProductsPageProps {
//   params: Promise<{ slug?: string }>;
//   searchParams: SearchParams;
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

//   let categoriesToShow: CategoryData[] = [];
//   try {
//     const categoriesResult = await getCategories(); // raw result from getCategories

//     if (categoriesResult && typeof categoriesResult === "object" && "success" in categoriesResult) {
//       // Handles { success: true, data: ... } or { success: false, error: ... }
//       if (categoriesResult.success === true) {
//         // Type assertion for the success case
//         const successResult = categoriesResult as { success: true; data: any };
//         const data = successResult.data;

//         if (Array.isArray(data)) {
//           if (data.length > 0 && typeof data[0] === "string") {
//             // data is string[] (e.g., ["Cars", "Motorbikes"])
//             categoriesToShow = convertCategoryNamesToData(data as CategoryNameType[]);
//           } else if (data.every(item => typeof item === "object" && item !== null && "id" in item && "name" in item)) {
//             // data is likely CategoryData[] or compatible array of objects
//             categoriesToShow = data as CategoryData[];
//           } else if (data.length === 0) {
//             categoriesToShow = []; // Data is an empty array
//           } else {
//             console.warn(
//               "ProductsPage - getCategories successful, but 'data' array contains unexpected item types:",
//               data
//             );
//           }
//         } else if (data && typeof data === "object" && Array.isArray((data as { categories?: any }).categories)) {
//           // data is { categories: CategoryData[] }
//           // Ensure 'categories' property exists and is an array
//           const categoryList = (data as { categories: CategoryData[] }).categories;
//           if (categoryList.every(item => typeof item === "object" && item !== null && "id" in item && "name" in item)) {
//             categoriesToShow = categoryList;
//           } else {
//             console.warn(
//               "ProductsPage - getCategories successful, but 'data.categories' array contains unexpected item types:",
//               categoryList
//             );
//           }
//         } else {
//           console.warn("ProductsPage - getCategories successful but 'data' format not recognized or empty:", data);
//         }
//       } else {
//         // success is false
//         const errorResult = categoriesResult as { success: false; error: string };
//         console.error("ProductsPage - Error from getCategories:", errorResult.error);
//       }
//     } else if (Array.isArray(categoriesResult)) {
//       // Handles direct array return: CategoryData[] or string[]
//       if (categoriesResult.length > 0 && typeof categoriesResult[0] === "string") {
//         categoriesToShow = convertCategoryNamesToData(categoriesResult as CategoryNameType[]);
//       } else if (
//         categoriesResult.every(item => typeof item === "object" && item !== null && "id" in item && "name" in item)
//       ) {
//         categoriesToShow = categoriesResult as CategoryData[];
//       } else if (categoriesResult.length === 0) {
//         categoriesToShow = [];
//       } else {
//         console.warn("ProductsPage - getCategories returned an array with unexpected item types:", categoriesResult);
//       }
//     } else {
//       console.warn(
//         "ProductsPage - Could not parse categories from getCategories. Received unexpected format:",
//         categoriesResult
//       );
//     }
//   } catch (error) {
//     console.error("ProductsPage - Exception fetching/processing categories:", error);
//   }

//   // Removed subcategoriesToShowForHeader declaration and fetching logic as it's unused

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
// };

// export default ProductsPage;
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
  return typeof item === "string";
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

  // Fetch and process categories with simplified logic
  let categoriesToShow: CategoryData[] = [];

  try {
    const categoriesResult = await getCategories();

    if (categoriesResult?.success && categoriesResult.data) {
      const data = categoriesResult.data;

      if (Array.isArray(data)) {
        if (data.length === 0) {
          categoriesToShow = [];
        } else if (data.every(isCategoryData)) {
          // data is CategoryData[]
          categoriesToShow = data;
        } else if (data.every(isCategoryName)) {
          // data is string[] (category names)
          categoriesToShow = convertCategoryNamesToData(data);
        } else {
          console.warn("ProductsPage - getCategories returned mixed or unexpected array types:", data);
          categoriesToShow = [];
        }
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
