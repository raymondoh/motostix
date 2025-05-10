// src/actions/products/like-product.ts
"use server";

import { revalidatePath } from "next/cache";
import { likeProduct as likeProductInDb } from "@/firebase/actions";
import { logger } from "@/utils/logger";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import type { LikeProductResult } from "@/types/product/result";

interface LikeProductInput {
  userId: string;
  productId: string;
}

export async function likeProduct({ userId, productId }: LikeProductInput): Promise<LikeProductResult> {
  try {
    // ✅ Step 1: Call Firebase function
    const result = await likeProductInDb(userId, productId);

    if (!result.success) {
      logger({
        type: "error",
        message: "Failed to like product",
        metadata: { userId, productId, error: result.error },
        context: "likes"
      });
      return result;
    }

    // ✅ Step 2: Revalidate cache if needed
    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);

    logger({
      type: "info",
      message: "Product liked successfully",
      metadata: { userId, productId },
      context: "likes"
    });

    return result;
  } catch (error: unknown) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unexpected error occurred while liking product";

    logger({
      type: "error",
      message: "Unhandled exception in likeProduct action",
      metadata: { userId, productId, error: message },
      context: "likes"
    });

    return { success: false, error: message };
  }
}
