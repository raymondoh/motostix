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
    // Log the incoming data for debugging
    logger({
      type: "info",
      message: "Updating product - received data",
      metadata: {
        productId,
        name: data.name,
        price: data.price,
        dataKeys: Object.keys(data)
      },
      context: "products"
    });

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

    // Log the validated data
    logger({
      type: "info",
      message: "Validated product data",
      metadata: {
        productId,
        name: validated.data.name,
        validatedKeys: Object.keys(validated.data)
      },
      context: "products"
    });

    // ✅ Step 2: Update product in database
    const result = await updateProductInDb(productId, validated.data);

    if (result.success) {
      logger({
        type: "info",
        message: "Product updated successfully",
        metadata: {
          productId,
          updatedName: result.product?.name || validated.data.name,
          updatedPrice: result.product?.price || validated.data.price
        },
        context: "products"
      });

      // ✅ Step 3: Revalidate all relevant cache paths
      revalidatePath("/admin/products"); // Admin products list
      revalidatePath(`/admin/products/${productId}`); // Admin product detail
      revalidatePath(`/products/${productId}`); // Public product detail
      revalidatePath("/products"); // Public products list
      revalidatePath("/"); // Homepage (in case featured products are shown)

      // Force revalidation of dynamic routes that might show this product
      revalidatePath("/products/category/[slug]", "page");
      revalidatePath("/search", "page");
    } else {
      logger({
        type: "error",
        message: "Failed to update product",
        metadata: {
          productId,
          error: result.error,
          attemptedName: validated.data.name
        },
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
      metadata: {
        productId,
        error: message,
        attemptedData: JSON.stringify(data)
      },
      context: "products"
    });

    return { success: false, error: message };
  }
}
