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
  stickySide?: "Front" | "Back"; // ✨ NEW
  image: string;
  category?: string;
  price: number;
  inStock: boolean;
  badge?: string;
  isFeatured?: boolean;
  isHero?: boolean;
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
  stickySide?: "Front" | "Back"; // ✨ NEW
  image: string;
  category?: string;
  price: number;
  inStock: boolean;
  badge?: string;
  isFeatured?: boolean;
  isHero?: boolean;
  createdAt: string; // Always a string after serialization
  updatedAt?: string;
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
