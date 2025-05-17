"use client";

import { toast } from "sonner";
import type { UpdateProductInput } from "@/schemas/product";
import type { UpdateProductResult } from "@/types/product";

/**
 * Client-friendly wrapper for the updateProduct server action
 * This function calls the API endpoint which then calls the server action
 */
export async function updateProductClient(productId: string, data: UpdateProductInput): Promise<UpdateProductResult> {
  try {
    console.log("Updating product with data:", JSON.stringify(data, null, 2));

    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from API:", errorData);
      return {
        success: false,
        error: errorData.error || `Failed to update product: ${response.statusText}`
      };
    }

    const result = await response.json();
    console.log("Update product result:", result);
    return result;
  } catch (error) {
    console.error("[UPDATE_PRODUCT_CLIENT]", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error updating product";

    toast.error(errorMessage);

    return {
      success: false,
      error: errorMessage
    };
  }
}
