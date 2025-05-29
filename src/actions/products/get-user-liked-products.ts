// // src/actions/products/get-user-liked-products.ts

"use server";

import { getUserLikedProducts as getUserLikesFromDb } from "@/firebase/actions";
import { logger } from "@/utils/logger";
import type { GetUserLikedProductsResult } from "@/types/product/result";

export async function getUserLikedProducts(userId: string): Promise<GetUserLikedProductsResult> {
  try {
    const result = await getUserLikesFromDb(userId);

    if (!result.success) {
      logger({
        type: "error",
        message: "Failed to get user's liked products",
        metadata: { userId, error: result.error },
        context: "likes"
      });

      return { success: false, error: result.error };
    }

    // Transform the result to match the expected type
    return {
      success: true,
      products: result.data
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error fetching user liked products";

    logger({
      type: "error",
      message: "Unhandled exception in getUserLikedProducts",
      metadata: { userId, error: message },
      context: "likes"
    });

    return { success: false, error: message };
  }
}
