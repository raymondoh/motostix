// src/schemas/product.ts
import { z } from "zod";
// //import {
//   categories,
//   subcategories,
//   designThemes,
//   productTypes,
//   materials,
//   placements,
//   brands,
//   sizes,
//   shippingClasses,
//   tags
// } from "@/config/categories";

// Base product schema with all fields
export const productSchema = z.object({
  id: z.string().optional(),

  // Basic Information
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  details: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),

  // Classification
  category: z.string().optional(),
  subcategory: z.string().optional(),
  designThemes: z.array(z.string()).optional(),
  productType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  brand: z.string().optional(),
  manufacturer: z.string().optional(),

  // Specifications
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  shippingWeight: z.string().optional(),
  material: z.string().optional(),
  finish: z.string().optional(),
  color: z.string().optional(),
  baseColor: z.string().optional(),
  colorDisplayName: z.string().optional(),
  stickySide: z.enum(["Front", "Back"]).optional(),
  size: z.string().optional(),

  // Media
  image: z.string().url("Image must be a valid URL"),
  additionalImages: z.array(z.string().url("Additional images must be valid URLs")).optional(),
  placements: z.array(z.string()).optional(),

  // Pricing and Inventory
  price: z.number().min(0, "Price must be a positive number"),
  salePrice: z.number().min(0, "Sale price must be a positive number").optional(),
  onSale: z.boolean().optional(),
  costPrice: z.number().min(0, "Cost price must be a positive number").optional(),
  stockQuantity: z
    .number()
    .int("Stock quantity must be a whole number")
    .min(0, "Stock quantity must be a positive number")
    .optional(),
  lowStockThreshold: z
    .number()
    .int("Low stock threshold must be a whole number")
    .min(0, "Low stock threshold must be a positive number")
    .optional(),
  shippingClass: z.string().optional(),

  // Status
  inStock: z.boolean().optional(),
  badge: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isHero: z.boolean().optional(),
  isLiked: z.boolean().optional(),
  isCustomizable: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),

  // Metadata
  createdAt: z.any().optional(), // Accept any for Timestamp objects
  updatedAt: z.any().optional()
});

// Schema for creating a new product (requires certain fields)
export const createProductSchema = productSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .required({
    name: true,
    price: true,
    image: true
  });

// Schema for updating a product (all fields optional except id)
export const updateProductSchema = productSchema.partial().omit({
  id: true,
  createdAt: true
});

// Export the TypeScript type for UpdateProductInput
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Export the TypeScript type for CreateProductInput
export type CreateProductInput = z.infer<typeof createProductSchema>;

// Helper function to validate product data
export function validateProduct(data: unknown) {
  return productSchema.safeParse(data);
}

// Helper function to validate product update data
export function validateProductUpdate(data: unknown) {
  return updateProductSchema.safeParse(data);
}

// Helper function to validate product creation data
export function validateProductCreate(data: unknown) {
  return createProductSchema.safeParse(data);
}
