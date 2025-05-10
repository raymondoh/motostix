// types/product.ts
import { Timestamp } from "firebase-admin/firestore"; // ✅ Correct import for client-side types

export interface Product {
  id: string;
  name: string;
  description?: string;
  details?: string;
  dimensions?: string;
  material?: string;
  color?: string;
  baseColor?: string;
  colorDisplayName?: string;
  stickySide?: "Front" | "Back"; // ✨ NEW
  image: string;
  category?: string;
  subcategory?: string; // ✅ NEW
  price: number;
  inStock: boolean;
  badge?: string;
  isFeatured?: boolean;
  isHero?: boolean;
  isLiked?: boolean;
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface SerializedProduct {
  id: string;
  name: string;
  description?: string;
  details?: string;
  dimensions?: string;
  material?: string;
  color?: string;
  baseColor?: string;
  colorDisplayName?: string;
  stickySide?: "Front" | "Back"; // ✨ NEW
  image: string;
  category?: string;
  subcategory?: string; // ✅ NEW
  price: number;
  inStock: boolean;
  badge?: string;
  isFeatured?: boolean;
  isHero?: boolean;
  isLiked?: boolean;
  createdAt: string; // Always a string after serialization
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

// Get product by ID result types
export interface GetProductByIdSuccess {
  success: true;
  product: Product;
}

export interface GetProductByIdError {
  success: false;
  error: string;
}

export type GetProductByIdFromFirestoreResult = GetProductByIdSuccess | GetProductByIdError;
export type GetProductByIdResponse = GetProductByIdFromFirestoreResult;

// Update product input (allow partial updates, excluding id/createdAt)
export type UpdateProductInput = Partial<Omit<Product, "id" | "createdAt">>;

// Update result types
export interface UpdateProductSuccess {
  success: true;
  product: SerializedProduct;
}

export interface UpdateProductError {
  success: false;
  error: string;
}

export type UpdateProductResult = UpdateProductSuccess | UpdateProductError;

// Hero slide type (for featured products / carousel)
export interface HeroSlide {
  title: string;
  description: string;
  backgroundImage: string;
  cta?: string;
  ctaHref?: string;
}
/**
 * Category type representing a group of products with the same category
 */
export interface Category {
  /**
   * Unique identifier for the category (slug format)
   */
  id: string;

  /**
   * Display name of the category
   */
  name: string;

  /**
   * Number of products in this category
   */
  count: number;

  /**
   * Optional image URL for the category (typically from a representative product)
   */
  image?: string;
}

/**
 * Success response when fetching categories
 */
export interface GetCategoriesSuccess {
  success: true;
  data: Category[];
}

/**
 * Error response when fetching categories fails
 */
export interface GetCategoriesError {
  success: false;
  error: string;
}

/**
 * Union type for category fetch results
 */
export type GetCategoriesResult = GetCategoriesSuccess | GetCategoriesError;
