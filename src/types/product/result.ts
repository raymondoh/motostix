// types/product/result.ts

import type { Product } from "./product";

export type GetAllProductsResult = { success: true; data: Product[] } | { success: false; error: string };

export type AddProductResult = { success: true; id: string } | { success: false; error: string };
export type DeleteProductResult = { success: true } | { success: false; error: string };
// src/types/product/result.ts

// Used when fetching related products
export type GetRelatedProductsResult = { success: true; products: Product[] } | { success: false; error: string };

export type GetUserLikedProductsResult = { success: true; products: Product[] } | { success: false; error: string };

export type UnlikeProductResult = { success: true } | { success: false; error: string };
export type LikeProductResult = { success: true } | { success: false; error: string };
