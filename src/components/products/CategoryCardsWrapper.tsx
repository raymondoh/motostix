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
  //const [selectedCategory, setSelectedCategory] = useState<string | null>(initialSelectedCategory);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialSelectedCategory || "all");

  // On initial load or when URL changes, update the selected category
  // useEffect(() => {
  //   const categoryParam = searchParams.get("category");

  //   // If there's no category in the URL, select "all" and update the URL
  //   if (!categoryParam) {
  //     setSelectedCategory(null);
  //     // Optional: Update URL to reflect "all" is selected
  //     // router.replace("/products", { scroll: false })
  //   } else {
  //     setSelectedCategory(categoryParam);
  //   }
  // }, [searchParams, router]);
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setSelectedCategory(categoryParam ?? "all");
  }, [searchParams]);

  // const handleCategorySelect = (categoryId: string | null) => {
  //   setSelectedCategory(categoryId);

  //   if (categoryId && categoryId !== "all") {
  //     router.push(`/products?category=${categoryId}`, { scroll: false });
  //   } else {
  //     router.push("/products", { scroll: false });
  //   }
  // };
  const handleCategorySelect = (categoryId: string | null) => {
    const nextCategory = categoryId ?? "all";
    setSelectedCategory(nextCategory);

    if (nextCategory !== "all") {
      router.push(`/products?category=${nextCategory}`, { scroll: false });
    } else {
      router.push("/products", { scroll: false });
    }
  };

  return (
    <CategoryCards
      categories={categories}
      selectedCategory={selectedCategory}
      onCategorySelect={handleCategorySelect}
    />
  );
}
