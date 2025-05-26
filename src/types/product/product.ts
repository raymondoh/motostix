// // types/product.ts
// import { Timestamp } from "firebase-admin/firestore"; // ✅ Correct import for server-side types
// import type {
//   Category as CategoryName,
//   DesignTheme,
//   ProductType,
//   Material,
//   Placement,
//   Brand,
//   Size,
//   ShippingClass,
//   Tag
// } from "@/config/categories";

// export interface Product {
//   id: string;

//   // Basic Information
//   name: string;
//   description?: string;
//   details?: string;
//   sku?: string;
//   barcode?: string;

//   // Classification
//   category?: CategoryName | string;
//   subcategory?: string;
//   designThemes?: DesignTheme[] | string[];
//   productType?: ProductType | string;
//   tags?: Tag[] | string[];
//   brand?: Brand | string;
//   manufacturer?: string;

//   // Specifications
//   dimensions?: string;
//   weight?: string;
//   shippingWeight?: string;
//   material?: Material | string;
//   finish?: string;
//   color?: string;
//   baseColor?: string;
//   colorDisplayName?: string;
//   stickySide?: "Front" | "Back";
//   size?: Size | string;

//   // Media
//   image: string;
//   additionalImages?: string[];
//   placements?: Placement[] | string[];

//   // Pricing and Inventory
//   price: number;
//   salePrice?: number;
//   onSale?: boolean;
//   costPrice?: number;
//   stockQuantity?: number;
//   lowStockThreshold?: number;
//   shippingClass?: ShippingClass | string;

//   // Status
//   inStock: boolean;
//   badge?: string;
//   isFeatured?: boolean;
//   isHero?: boolean;
//   isLiked?: boolean;
//   isCustomizable?: boolean;
//   isNewArrival?: boolean;

//   // Metadata
//   createdAt: Timestamp | string;
//   updatedAt?: Timestamp | string;
// }

// export interface SerializedProduct {
//   id: string;

//   // Basic Information
//   name: string;
//   description?: string;
//   details?: string;
//   sku?: string;
//   barcode?: string;

//   // Classification
//   category?: CategoryName | string;
//   subcategory?: string;
//   designThemes?: DesignTheme[] | string[];
//   productType?: ProductType | string;
//   tags?: Tag[] | string[];
//   brand?: Brand | string;
//   manufacturer?: string;

//   // Specifications
//   dimensions?: string;
//   weight?: string;
//   shippingWeight?: string;
//   material?: Material | string;
//   finish?: string;
//   color?: string;
//   baseColor?: string;
//   colorDisplayName?: string;
//   stickySide?: "Front" | "Back";
//   size?: Size | string;

//   // Media
//   image: string;
//   additionalImages?: string[];
//   placements?: Placement[] | string[];

//   // Pricing and Inventory
//   price: number;
//   salePrice?: number;
//   onSale?: boolean;
//   costPrice?: number;
//   stockQuantity?: number;
//   lowStockThreshold?: number;
//   shippingClass?: ShippingClass | string;

//   // Status
//   inStock: boolean;
//   badge?: string;
//   isFeatured?: boolean;
//   isHero?: boolean;
//   isLiked?: boolean;
//   isCustomizable?: boolean;
//   isNewArrival?: boolean;

//   // Metadata
//   createdAt: string; // Always a string after serialization
//   updatedAt?: string;
// }

// export interface CartItem {
//   id: string;
//   product: Product;
//   quantity: number;
// }

// // Get product by ID result types
// export interface GetProductByIdSuccess {
//   success: true;
//   product: Product;
// }

// export interface GetProductByIdError {
//   success: false;
//   error: string;
// }

// export type GetProductByIdFromFirestoreResult = GetProductByIdSuccess | GetProductByIdError;
// export type GetProductByIdResponse = GetProductByIdFromFirestoreResult;

// // Update product input (allow partial updates, excluding id/createdAt)
// export type UpdateProductInput = Partial<Omit<Product, "id" | "createdAt">>;

// // Update result types
// export interface UpdateProductSuccess {
//   success: true;
//   product: SerializedProduct;
// }

// export interface UpdateProductError {
//   success: false;
//   error: string;
// }

// export type UpdateProductResult = UpdateProductSuccess | UpdateProductError;

// // Hero slide type (for featured products / carousel)
// export interface HeroSlide {
//   title: string;
//   description: string;
//   backgroundImage: string;
//   cta?: string;
//   ctaHref?: string;
// }
// types/product.ts
import type { Timestamp } from "firebase-admin/firestore"; // ✅ Correct import for server-side types
import type {
  Category as CategoryName,
  DesignTheme,
  ProductType,
  Material,
  Placement,
  Brand,
  Size,
  ShippingClass,
  Tag
} from "@/config/categories";

export interface Product {
  id: string;

  // Basic Information
  name: string;
  description?: string;
  details?: string;
  sku?: string;
  barcode?: string;

  // Classification
  category?: CategoryName | string;
  subcategory?: string;
  designThemes?: DesignTheme[] | string[];
  productType?: ProductType | string;
  tags?: Tag[] | string[];
  brand?: Brand | string;
  manufacturer?: string;

  // Specifications
  dimensions?: string;
  weight?: string;
  shippingWeight?: string;
  material?: Material | string;
  finish?: string;
  color?: string;
  baseColor?: string;
  colorDisplayName?: string;
  stickySide?: "Front" | "Back";
  size?: Size | string;

  // Media
  image: string;
  additionalImages?: string[];
  placements?: Placement[] | string[];

  // Pricing and Inventory
  price: number;
  salePrice?: number;
  onSale?: boolean;
  costPrice?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  shippingClass?: ShippingClass | string;

  // Status
  inStock: boolean;
  badge?: string;
  isFeatured?: boolean;
  isHero?: boolean;
  isLiked?: boolean;
  isCustomizable?: boolean;
  isNewArrival?: boolean;

  // Metadata
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface SerializedProduct {
  id: string;

  // Basic Information
  name: string;
  description?: string;
  details?: string;
  sku?: string;
  barcode?: string;

  // Classification
  category?: CategoryName | string;
  subcategory?: string;
  designThemes?: DesignTheme[] | string[];
  productType?: ProductType | string;
  tags?: Tag[] | string[];
  brand?: Brand | string;
  manufacturer?: string;

  // Specifications
  dimensions?: string;
  weight?: string;
  shippingWeight?: string;
  material?: Material | string;
  finish?: string;
  color?: string;
  baseColor?: string;
  colorDisplayName?: string;
  stickySide?: "Front" | "Back";
  size?: Size | string;

  // Media
  image: string;
  additionalImages?: string[];
  placements?: Placement[] | string[];

  // Pricing and Inventory
  price: number;
  salePrice?: number;
  onSale?: boolean;
  costPrice?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  shippingClass?: ShippingClass | string;

  // Status
  inStock: boolean;
  badge?: string;
  isFeatured?: boolean;
  isHero?: boolean;
  isLiked?: boolean;
  isCustomizable?: boolean;
  isNewArrival?: boolean;

  // Metadata
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
  product?: SerializedProduct; // Made optional
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
