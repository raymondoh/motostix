// //src/components/category-carousel/CategoryCardsWrapper.tsx
// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { CategoryCards } from "./CategoryCards";
// import { useEffect, useState } from "react";
// import type { CategoryData } from "@/config/categories";

// interface CategoryCardsWrapperProps {
//   categories: CategoryData[];
//   selectedCategory: string | null;
// }

// export function CategoryCardsWrapper({
//   categories,
//   selectedCategory: initialSelectedCategory
// }: CategoryCardsWrapperProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   //const [selectedCategory, setSelectedCategory] = useState<string | null>(initialSelectedCategory);
//   const [selectedCategory, setSelectedCategory] = useState<string>(initialSelectedCategory || "all");

//   // On initial load or when URL changes, update the selected category
//   useEffect(() => {
//     const categoryParam = searchParams.get("category");
//     setSelectedCategory(categoryParam ?? "all");
//   }, [searchParams]);

//   const handleCategorySelect = (categoryId: string | null) => {
//     const nextCategory = categoryId ?? "all";
//     setSelectedCategory(nextCategory);

//     if (nextCategory !== "all") {
//       router.push(`/products?category=${nextCategory}`, { scroll: false });
//     } else {
//       router.push("/products", { scroll: false });
//     }
//   };

//   return (
//     <CategoryCards
//       categories={categories}
//       selectedCategory={selectedCategory}
//       onCategorySelect={handleCategorySelect}
//     />
//   );
// }
// src/components/products/category-carousel/CategoryCardsWrapper.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CategoryCards } from "./CategoryCards";
import { useEffect, useState } from "react";
import type { CategoryData } from "@/config/categories";

interface CategoryCardsWrapperProps {
  categories: CategoryData[];
  selectedCategory: string | null;
}

export function CategoryCardsWrapper({
  categories,
  selectedCategory: initialSelectedCategory
}: CategoryCardsWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialSelectedCategory || "all");

  console.log("CategoryCardsWrapper - RENDERING with props:", {
    categoriesCount: categories?.length || 0,
    initialSelectedCategory,
    currentSelectedCategory: selectedCategory,
    searchParamsCategory: searchParams.get("category")
  });

  // On initial load or when URL changes, update the selected category
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const newCategory = categoryParam ?? "all";
    console.log(
      "CategoryCardsWrapper - URL changed, updating selectedCategory from",
      selectedCategory,
      "to",
      newCategory
    );
    setSelectedCategory(newCategory);
  }, [searchParams]);

  const handleCategorySelect = (categoryId: string | null) => {
    const nextCategory = categoryId ?? "all";
    console.log(
      "CategoryCardsWrapper - handleCategorySelect called with:",
      categoryId,
      "-> normalized to:",
      nextCategory
    );
    setSelectedCategory(nextCategory);

    if (nextCategory !== "all") {
      // const newUrl = `/products?category=${nextCategory.toLowerCase()}`;
      // console.log("CategoryCardsWrapper - Navigating to:", newUrl);
      // Use the name from your categories array which has the correct case
      //router.push(newUrl, { scroll: false });
      const selectedCategoryObj = categories.find(cat => cat.id === nextCategory);
      const categoryNameForUrl = selectedCategoryObj?.id || nextCategory.toLowerCase();

      router.push(`/products?category=${categoryNameForUrl}`, { scroll: false });
    } else {
      console.log("CategoryCardsWrapper - Navigating to: /products");
      router.push("/products", { scroll: false });
    }
  };

  console.log("CategoryCardsWrapper - About to render CategoryCards with:", {
    categoriesLength: categories?.length,
    selectedCategory,
    hasOnCategorySelect: typeof handleCategorySelect === "function"
  });

  return (
    <CategoryCards
      categories={categories}
      selectedCategory={selectedCategory}
      onCategorySelect={handleCategorySelect}
    />
  );
}
