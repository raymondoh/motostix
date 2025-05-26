"use server";

import { revalidatePath } from "next/cache";
import { type CreateProductInput, createProductSchema } from "@/schemas/product";
import { addProduct as addProductToDb } from "@/firebase/actions";
import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
import { logger } from "@/utils/logger";
import type { Product } from "@/types";

export async function addProduct(data: CreateProductInput): Promise<Product.AddProductResult> {
  try {
    /* ── 1) Validate incoming data ───────────────────────────── */
    const validated = createProductSchema.safeParse(data);

    if (!validated.success) {
      logger({
        type: "warn",
        message: "Invalid product data during addProduct",
        metadata: { error: validated.error.flatten() },
        context: "products"
      });
      return {
        success: false,
        error: `Invalid product data: ${validated.error.message}`
      };
    }

    /* ── 2) Build payload expected by the Firebase helper ────── */
    const productData = {
      ...validated.data,

      // Handle stock quantity properly
      stockQuantity: validated.data.stockQuantity || 0,
      inStock: (validated.data.stockQuantity || 0) > 0 // boolean for UI
    };

    /* ── 3) Persist to Firestore ─────────────────────────────── */
    const result = await addProductToDb(productData);

    /* ── 4) Handle the result and map to correct type ─────────── */
    if (!result.success) {
      logger({
        type: "error",
        message: "Failed to add product",
        metadata: { error: result.error },
        context: "products"
      });
      return {
        success: false,
        error: result.error
      };
    }

    // Map the result to match AddProductResult type
    const addProductResult: Product.AddProductResult = {
      success: true,
      id: result.data // Map 'data' to 'id' since data contains the product ID
    };

    /* ── 5) Side-effects & logging ───────────────────────────── */
    revalidatePath("/dev/products");
    revalidatePath("/admin/products");
    revalidatePath("/products");

    logger({
      type: "info",
      message: "Product added successfully",
      metadata: {
        productName: validated.data.name,
        productId: result.data
      },
      context: "products"
    });

    return addProductResult;
  } catch (error: unknown) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error occurred while adding product";

    logger({
      type: "error",
      message: "Unhandled exception in addProduct action",
      metadata: { error: message },
      context: "products"
    });

    return { success: false, error: message };
  }
}
