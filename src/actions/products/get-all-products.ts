// src/actions/products/get-all-products.ts
"use server";

import { getAllProducts as getAllProductsFromDB } from "@/firebase/actions";
import type { GetAllProductsResult } from "@/types/product/result";
import type { ProductFilterOptions } from "@/types/product/filter";

export async function getAllProducts(filters?: ProductFilterOptions): Promise<GetAllProductsResult> {
  return await getAllProductsFromDB(filters);
}
