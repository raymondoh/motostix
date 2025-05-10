// src/actions/products/unlike-product.ts
"use server";

import { revalidatePath } from "next/cache";
import { unlikeProduct as unlikeProductInDb } from "@/firebase/actions";
import { logger } from "@/utils/logger";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import type { UnlikeProductResult } from "@/types/product/result";

interface UnlikeProductInput {
  userId: string;
  productId: string;
}

export async function unlikeProduct({ userId, productId }: UnlikeProductInput): Promise<UnlikeProductResult> {
  try {
    const result = await unlikeProductInDb(userId, productId);

    if (!result.success) {
      logger({
        type: "error",
        message: "Failed to unlike product",
        metadata: { userId, productId, error: result.error },
        context: "likes"
      });
      return result;
    }

    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);

    logger({
      type: "info",
      message: "Product unliked successfully",
      metadata: { userId, productId },
      context: "likes"
    });

    return result;
  } catch (error: unknown) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unexpected error occurred while unliking product";

    logger({
      type: "error",
      message: "Unhandled exception in unlikeProduct action",
      metadata: { userId, productId, error: message },
      context: "likes"
    });

    return { success: false, error: message };
  }
}
