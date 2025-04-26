// src/actions/client/products.ts
import type { GetAllProductsResult } from "@/types/product/result";

/**
 * Client-side action to fetch all products
 */
export async function fetchAllProductsClient(): Promise<GetAllProductsResult> {
  try {
    const res = await fetch("/api/products");

    if (!res.ok) {
      console.error("fetchAllProductsClient error:", res.statusText);
      return { success: false, error: res.statusText || "Failed to fetch products" };
    }

    const data = await res.json();
    console.log("[fetchAllProductsClient] Fetched products successfully:", data);

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}
