"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductsFilters } from "./ProductsFilters";
import { useEffect, useState } from "react";
import type { CategoryData } from "@/config/categories";

interface ProductsFiltersWrapperProps {
  selectedCategory: string | null;
  categoriesData?: CategoryData[];
}

export function ProductsFiltersWrapper({
  selectedCategory: initialSelectedCategory,
  categoriesData = []
}: ProductsFiltersWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialSelectedCategory);

  // Update internal state when props change
  useEffect(() => {
    setSelectedCategory(initialSelectedCategory);
  }, [initialSelectedCategory]);

  const handleCategoryChange = (categoryId: string | null) => {
    if (categoryId && categoryId !== "all") {
      router.push(`/products?category=${categoryId}`, { scroll: false });
    } else {
      router.push("/products", { scroll: false });
    }
  };

  return (
    <ProductsFilters
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      categoriesData={categoriesData}
    />
  );
}
