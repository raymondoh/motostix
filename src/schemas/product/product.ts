// //src/schemas/products/product.ts
// import { z } from "zod";

// // Base product schema (for stickers)
// export const productSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(2, "Sticker name must be at least 2 characters"),
//   description: z.string().min(5, "Description must be at least 5 characters").optional(),
//   image: z.string().url("Must be a valid image URL"),
//   price: z.number().positive("Price must be a positive number"),
//   inStock: z.boolean(),
//   badge: z.string().optional(),
//   isFeatured: z.boolean().optional(),
//   isHero: z.boolean().optional(),
//   createdAt: z.date().optional(),
//   updatedAt: z.date().optional()
// });

// // Schema for creating a new sticker (new product)
// export const createProductSchema = productSchema
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true
//   })
//   .strict(); // Enforce no unknown fields on creation

// // Schema for updating an existing sticker (partial fields allowed)
// export const updateProductSchema = productSchema
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true
//   })
//   .partial()
//   .strict();

// // TypeScript types generated from schemas
// export type CreateProductInput = z.infer<typeof createProductSchema>;
// export type UpdateProductInput = z.infer<typeof updateProductSchema>;
import { z } from "zod";

// Base product schema (for stickers)
export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters").optional(),
  details: z.string().min(5, "Details must be at least 5 characters").optional(),
  dimensions: z.string().min(2, "Dimensions must be at least 2 characters").optional(),
  material: z.string().min(2, "Material must be at least 2 characters").optional(),
  color: z.string().min(2, "Color must be at least 2 characters").optional(),
  stickySide: z.enum(["Front", "Back"]).optional(),
  category: z.string().optional(),
  image: z.string().url("Must be a valid image URL"),
  price: z.number().positive("Price must be a positive number"),
  inStock: z.boolean(),

  badge: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isHero: z.boolean().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Schema for creating a new product (new sticker)
export const createProductSchema = productSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .strict(); // ✅ No unknown fields allowed

// Schema for updating an existing product (partial fields allowed)
export const updateProductSchema = productSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .partial()
  .strict(); // ✅ Also strict here

// TypeScript types generated from schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
