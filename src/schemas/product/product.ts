// import { z } from "zod";
// import {
//   categories,
//   designThemes,
//   productTypes,
//   materials,
//   placements,
//   brands,
//   sizes,
//   shippingClasses,
//   tags
// } from "@/config/categories";

// // Convert const arrays to string arrays for Zod
// const categoryArray = [...categories] as string[];
// const designThemeArray = [...designThemes] as string[];
// const productTypeArray = [...productTypes] as string[];
// const materialArray = [...materials] as string[];
// const placementArray = [...placements] as string[];
// const brandArray = [...brands] as string[];
// const sizeArray = [...sizes] as string[];
// const shippingClassArray = [...shippingClasses] as string[];
// const tagArray = [...tags] as string[];

// // Base schema for product validation
// export const productSchema = z.object({
//   id: z.string().optional(),

//   // Basic Information
//   name: z.string().min(2, "Product name must be at least 2 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   details: z.string().optional(),
//   sku: z.string().optional(),
//   barcode: z.string().optional(),

//   // Classification
//   category: z.enum(categoryArray as [string, ...string[]]).optional(),
//   subcategory: z.string().optional(),
//   designThemes: z.array(z.enum(designThemeArray as [string, ...string[]])).optional(),
//   productType: z.enum(productTypeArray as [string, ...string[]]).optional(),
//   tags: z.array(z.enum(tagArray as [string, ...string[]])).optional(),
//   brand: z.enum(brandArray as [string, ...string[]]).optional(),
//   manufacturer: z.string().optional(),

//   // Specifications
//   dimensions: z.string().optional(),
//   weight: z.string().optional(),
//   shippingWeight: z.string().optional(),
//   material: z.enum(materialArray as [string, ...string[]]).optional(),
//   finish: z.string().optional(),
//   color: z.string().optional(),
//   baseColor: z.string().optional(),
//   colorDisplayName: z.string().optional(),
//   stickySide: z.enum(["Front", "Back"]).optional(),
//   size: z.enum(sizeArray as [string, ...string[]]).optional(),

//   // Media
//   image: z.string().url("Image must be a valid URL"),
//   additionalImages: z.array(z.string().url("Additional images must be valid URLs")).optional(),
//   placements: z.array(z.enum(placementArray as [string, ...string[]])).optional(),

//   // Pricing and Inventory
//   price: z.number().min(0, "Price must be a positive number"),
//   salePrice: z.number().min(0, "Sale price must be a positive number").optional(),
//   onSale: z.boolean().optional(),
//   costPrice: z.number().min(0, "Cost price must be a positive number").optional(),
//   stockQuantity: z
//     .number()
//     .int("Stock quantity must be a whole number")
//     .min(0, "Stock quantity must be a positive number")
//     .optional(),
//   lowStockThreshold: z
//     .number()
//     .int("Low stock threshold must be a whole number")
//     .min(0, "Low stock threshold must be a positive number")
//     .optional(),
//   shippingClass: z.enum(shippingClassArray as [string, ...string[]]).optional(),

//   // Status
//   inStock: z.boolean().optional(),
//   badge: z.string().optional(),
//   isFeatured: z.boolean().optional(),
//   isHero: z.boolean().optional(),
//   isLiked: z.boolean().optional(),
//   isCustomizable: z.boolean().optional(),
//   isNewArrival: z.boolean().optional(),

//   // Metadata
//   createdAt: z.any().optional(),
//   updatedAt: z.any().optional()
// });

// // Schema for updating products (all fields optional)
// export const updateProductSchema = productSchema.partial().omit({ id: true });

// // Schema for creating products (required fields)
// export const createProductSchema = productSchema
//   .omit({ id: true, createdAt: true, updatedAt: true })
//   // Make image field required but allow any string during creation
//   // The actual URL validation will happen after upload
//   .extend({
//     image: z.string()
//   });
// import { z } from "zod";

// // Define the product schema with proper validation
// export const productSchema = z.object({
//   // Basic product information
//   name: z.string().min(3, "Product name must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   price: z.coerce.number().positive("Price must be a positive number"),
//   discountPrice: z.coerce.number().nonnegative("Discount price cannot be negative").optional(),

//   // Inventory information
//   sku: z.string().min(3, "SKU must be at least 3 characters"),
//   stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),

//   // Product categorization
//   category: z.string().min(1, "Category is required"),
//   subcategory: z.string().min(1, "Subcategory is required"),
//   designThemes: z.array(z.string()).min(1, "At least one design theme is required"),
//   productType: z.string().min(1, "Product type is required"),

//   // Product specifications
//   material: z.string().min(1, "Material is required"),
//   brand: z.string().min(1, "Brand is required"),
//   size: z.string().min(1, "Size is required"),
//   shippingClass: z.string().min(1, "Shipping class is required"),

//   // Additional metadata
//   tags: z.array(z.string()).min(1, "At least one tag is required"),

//   // Images
//   images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),

//   // Status
//   isActive: z.boolean().default(true),
//   isFeatured: z.boolean().default(false)
// });

// export type ProductFormValues = z.infer<typeof productSchema>;

// // For partial updates
// export const productUpdateSchema = productSchema.partial();
// export type ProductUpdateValues = z.infer<typeof productUpdateSchema>;

// // TypeScript type definitions inferred from schemas
// export type ProductInput = z.infer<typeof productSchema>;
// export type UpdateProductInput = z.infer<typeof productUpdateSchema>;

// export type CreateProductInput = z.infer<typeof productSchema>;
// export const createProductSchema = productSchema;
// export const updateProductSchema = productUpdateSchema;
import { z } from "zod";

/* ──────────────────────────────────────────────────────────
   Base (streamlined) Product schema
   ────────────────────────────────────────────────────────── */

export const productSchema = z.object({
  /* Basic product information */
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  discountPrice: z.coerce.number().nonnegative("Discount price cannot be negative").optional(),

  /* Inventory information */
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),

  /* Product categorisation */
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  designThemes: z.array(z.string()).min(1, "At least one design theme is required"),
  productType: z.string().min(1, "Product type is required"),

  /* Product specifications */
  material: z.string().min(1, "Material is required"),
  brand: z.string().min(1, "Brand is required"),
  size: z.string().min(1, "Size is required"),
  shippingClass: z.string().min(1, "Shipping class is required"),

  /* Metadata tags */
  tags: z.array(z.string()).min(1, "At least one tag is required"),

  /* Images */
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),

  /* Status flags */
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
});

/* Types inferred from the main schema */
export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductInput = z.infer<typeof productSchema>;

/* ─────────── partial schema for PATCH-style updates ─────────── */

export const productUpdateSchema = productSchema.partial();
export type ProductUpdateValues = z.infer<typeof productUpdateSchema>;
export type UpdateProductInput = z.infer<typeof productUpdateSchema>;

/* ──────────────────────────────────────────────────────────
   Legacy aliases so existing imports keep working:
     import { createProductSchema } from "@/schemas/product";
     import { updateProductSchema } from "@/schemas/product";
   ────────────────────────────────────────────────────────── */

export const createProductSchema = productSchema;
export const updateProductSchema = productUpdateSchema;

/* Handy alias for create routes */
export type CreateProductInput = z.infer<typeof productSchema>;
