"use server";

import { revalidatePath } from "next/cache";
import { type UpdateProductInput, updateProductSchema } from "@/schemas/product"; // ✅ fix import path
import { updateProduct as updateProductInDb } from "@/firebase/actions";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { logger } from "@/utils/logger";
import type { UpdateProductResult } from "@/types/product";

/**
 * Server action to update a product
 */
export async function updateProduct(productId: string, data: UpdateProductInput): Promise<UpdateProductResult> {
  try {
    // ✅ Step 1: Validate incoming update data
    const validated = updateProductSchema.safeParse(data);

    if (!validated.success) {
      logger({
        type: "warn",
        message: "Invalid product data during updateProduct",
        metadata: { productId, error: validated.error.flatten() },
        context: "products"
      });
      return { success: false, error: "Invalid product data: " + validated.error.message };
    }

    // ✅ Step 2: Update product in database
    const result = await updateProductInDb(productId, validated.data);

    if (result.success) {
      logger({
        type: "info",
        message: "Product updated successfully",
        metadata: { productId },
        context: "products"
      });

      // ✅ Step 3: Revalidate products page cache
      revalidatePath("/admin/products"); // Assuming admin products page
    } else {
      logger({
        type: "error",
        message: "Failed to update product",
        metadata: { productId, error: result.error },
        context: "products"
      });
    }

    return result;
  } catch (error: unknown) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error updating product";

    logger({
      type: "error",
      message: "Unhandled exception in updateProduct",
      metadata: { productId, error: message },
      context: "products"
    });

    return { success: false, error: message };
  }
}
