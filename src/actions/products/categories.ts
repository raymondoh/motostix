//src/actions/products/categories.ts
"use server";

import { cache } from "react";
import { categories as categoryNames, subcategories } from "@/config/categories";
//import type { Category } from "@/types/category";
import type { Category } from "@/types";

// Convert string categories to Category objects
const categories: Category.Category[] = categoryNames.map(name => ({
  id: name.toLowerCase().replace(/\s+/g, "-"), // Convert name to lowercase and replace spaces with hyphens for ID
  name,
  image: `/placeholder.svg?height=200&width=200&query=${name}`, // Placeholder image
  count: 0 // Default count
}));

// Get all categories
export const getAllCategories = cache(async () => {
  return categories;
});

// Get a specific category by slug or name
export const getCategory = cache(async (slugOrName: string) => {
  return categories.find(
    category => category.id === slugOrName || category.name.toLowerCase() === slugOrName.toLowerCase()
  );
});

// Get subcategories for a specific category
export const getCategorySubcategories = cache(async (categoryName: string) => {
  // Find the category in our config
  const category = categoryNames.find(cat => cat.toLowerCase() === categoryName.toLowerCase());

  if (!category) return [];

  // Return the subcategories for this category
  return subcategories[category] || [];
});

// Get featured categories (example implementation)
export const getFeaturedCategories = cache(async () => {
  // For example, return the first 3 categories as featured
  return categories.slice(0, 3);
});
