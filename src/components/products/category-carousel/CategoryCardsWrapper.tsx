//src/components/category-carousel/CategoryCardsWrapper.tsx
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
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setSelectedCategory(categoryParam ?? "all");
  }, [searchParams]);

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
