// // src/actions/products/add-product.ts
// "use server";

// import { revalidatePath } from "next/cache";
// import { type CreateProductInput, createProductSchema } from "@/schemas/product";
// import { addProduct as addProductToDb } from "@/firebase/actions";
// import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
// import { logger } from "@/utils/logger";
// import type { AddProductResult } from "@/types/product/result";

// export async function addProduct(data: CreateProductInput): Promise<AddProductResult> {
//   try {
//     // ✅ Step 1: Validate incoming data
//     const validated = createProductSchema.safeParse(data);

//     if (!validated.success) {
//       logger({
//         type: "warn",
//         message: "Invalid product data during addProduct",
//         metadata: { error: validated.error.flatten() },
//         context: "products"
//       });
//       return {
//         success: false,
//         error: "Invalid product data: " + validated.error.message
//       };
//     }

//     // ✅ Step 2: Call Firebase function with validated data
//     // Add default value for inStock if it's undefined
//     const productData = {
//       ...validated.data,

//       // 🔄 Bridge old/new field names ------------
//       image: validated.data.images[0], // first image
//       additionalImages: validated.data.images.slice(1), // rest (if any)

//       stockQuantity: validated.data.stock, // keep numeric
//       inStock: validated.data.stock > 0 // boolean for UI
//     };
//     if (result.success) {
//       // ✅ Revalidate cache for products page
//       revalidatePath("/dev/products");
//       logger({
//         type: "info",
//         message: `Product added successfully`,
//         metadata: { productName: validated.data.name },
//         context: "products"
//       });
//     } else {
//       logger({
//         type: "error",
//         message: "Failed to add product",
//         metadata: { error: result.error },
//         context: "products"
//       });
//     }
//     // now productData satisfies Omit<Product, "id" | "createdAt" | "updatedAt">
//     const result = await addProductToDb(productData);
//     return result;
//   } catch (error: unknown) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error occurred while adding product";

//     logger({
//       type: "error",
//       message: "Unhandled exception in addProduct action",
//       metadata: { error: message },
//       context: "products"
//     });

//     return { success: false, error: message };
//   }
// }
// src/actions/products/add-product.ts
"use server";

import { revalidatePath } from "next/cache";
import { type CreateProductInput, createProductSchema } from "@/schemas/product";
import { addProduct as addProductToDb } from "@/firebase/actions";
import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
import { logger } from "@/utils/logger";
import type { AddProductResult } from "@/types/product/result";

export async function addProduct(data: CreateProductInput): Promise<AddProductResult> {
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

      // map new-schema fields to legacy model
      image: validated.data.images[0], // primary image
      additionalImages: validated.data.images.slice(1), // remaining images

      stockQuantity: validated.data.stock, // numeric
      inStock: validated.data.stock > 0 // boolean for UI
    };

    /* ── 3) Persist to Firestore ─────────────────────────────── */
    const result: AddProductResult = await addProductToDb(productData);

    /* ── 4) Side-effects & logging ───────────────────────────── */
    if (result.success) {
      revalidatePath("/dev/products");
      logger({
        type: "info",
        message: "Product added successfully",
        metadata: { productName: validated.data.name },
        context: "products"
      });
    } else {
      logger({
        type: "error",
        message: "Failed to add product",
        metadata: { error: result.error },
        context: "products"
      });
    }

    return result;
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
