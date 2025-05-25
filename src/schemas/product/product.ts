// src/schemas/product.ts (or wherever this schema is defined)
import { z } from "zod";

export const productSchema = z.object({
  /* Basic product information */
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  // REMOVE discountPrice if salePrice is the correct term, or align naming.
  // ADD salePrice:
  salePrice: z.coerce.number().positive("Sale price must be a positive number").optional().nullable(), // Or nonNegative() if 0 is allowed. Nullable if you want to explicitly set it to null.

  /* Inventory information */
  // Consider aligning 'sku' and 'stock' with your database fields (e.g. stockQuantity)
  sku: z.string().optional(), // Often optional or generated
  stockQuantity: z.coerce.number().int().nonnegative("Stock quantity must be a non-negative integer").optional(), // Changed from 'stock'

  /* Product categorisation */
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(), // Often optional
  designThemes: z.array(z.string()).optional(), // Often optional
  productType: z.string().optional(), // Often optional

  /* Product specifications */
  material: z.string().optional(),
  brand: z.string().optional(),
  // size: z.string().min(1, "Size is required"), // This was in your schema, keep if needed
  shippingClass: z.string().optional(),

  /* Metadata tags */
  tags: z.array(z.string()).optional(),

  /* Images */
  // Align with your database fields: image (string) and additionalImages (array)
  image: z.string().url("Image must be a valid URL").optional(),
  additionalImages: z.array(z.string().url("Must be a valid URL")).optional(),

  /* Status flags */
  // isActive: z.boolean().default(true), // Your schema had this, is it used?
  isFeatured: z.boolean().default(false).optional(),
  isHero: z.boolean().default(false).optional(), // ADDED
  isNewArrival: z.boolean().default(false).optional(), // ADDED
  onSale: z.boolean().default(false).optional(), // ADDED

  // Add any other missing fields from your Product type / form
  details: z.string().optional(),
  badge: z.string().optional(),
  dimensions: z.string().optional(),
  baseColor: z.string().optional(),
  colorDisplayName: z.string().optional(),
  color: z.string().optional(), // often derived or same as colorDisplayName
  stickySide: z.string().optional(), // Or z.enum(["Front", "Back"]).optional()
  weight: z.string().optional(),
  shippingWeight: z.string().optional(),
  lowStockThreshold: z.coerce.number().int().nonnegative().optional(),
  inStock: z.boolean().default(true).optional() // This one is important
});

/* Types inferred from the main schema */
export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductInput = z.infer<typeof productSchema>;

/* ─────────── partial schema for PATCH-style updates ─────────── */
// .partial() makes all fields optional, which is usually correct for updates.
export const productUpdateSchema = productSchema.partial();
export type ProductUpdateValues = z.infer<typeof productUpdateSchema>;
export type UpdateProductInput = z.infer<typeof productUpdateSchema>; // This is likely the one used by the problematic validation

/* ──────────────────────────────────────────────────────────
   Legacy aliases so existing imports keep working:
   ────────────────────────────────────────────────────────── */
export const createProductSchema = productSchema; // For creating new products, some fields might not be optional
export const updateProductSchemaLegacy = productUpdateSchema; // If you have 'updateProductSchema' import elsewhere

/* Handy alias for create routes */
export type CreateProductInput = z.infer<typeof productSchema>;
