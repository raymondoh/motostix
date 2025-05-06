// src/actions/products/get-related-products.ts
"use server";

import { getRelatedProducts as getRelatedProductsFromDb } from "@/firebase/actions";
import { logger } from "@/utils/logger";
import type { GetRelatedProductsResult } from "@/types/product/result";

interface GetRelatedProductsParams {
  productId: string;
  category?: string;
  limit?: number;
}

/**
 * Action to fetch related products by category (excluding current product)
 */
export async function getRelatedProducts(params: GetRelatedProductsParams): Promise<GetRelatedProductsResult> {
  try {
    const result = await getRelatedProductsFromDb(params);

    if (!result.success) {
      logger({
        type: "warn",
        message: "Failed to fetch related products",
        context: "products",
        metadata: { ...params, error: result.error }
      });
    }

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred while fetching related products";

    logger({
      type: "error",
      message: "Unhandled exception in getRelatedProducts action",
      context: "products",
      metadata: { ...params, error: message }
    });

    return { success: false, error: message };
  }
}
