// src/actions/client/categories.ts
import type { Category } from "@/types/category";

/**
 * Client-side action to fetch all categories
 */
export async function fetchCategoriesClient(): Promise<{ success: boolean; data: Category[]; error?: string }> {
  try {
    const res = await fetch(`/api/categories`);

    if (!res.ok) {
      console.error("fetchCategoriesClient error:", res.statusText);
      return { success: false, data: [], error: res.statusText || "Failed to fetch categories" };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [], error: "Failed to fetch categories" };
  }
}

/**
 * Client-side action to fetch featured categories
 */
export async function fetchFeaturedCategoriesClient(): Promise<{ success: boolean; data: Category[]; error?: string }> {
  try {
    const res = await fetch(`/api/categories/featured`);

    if (!res.ok) {
      console.error("fetchFeaturedCategoriesClient error:", res.statusText);
      return { success: false, data: [], error: "Failed to fetch featured categories" };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    return { success: false, data: [], error: "Failed to fetch featured categories" };
  }
}
