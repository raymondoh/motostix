// src/types/product/filter.ts

export type ProductFilterOptions = {
  category?: string;
  subcategory?: string;
  designThemes?: string[]; // NEW: Array of design themes
  productType?: string; // NEW: Type of product
  material?: string;
  finish?: string; // NEW: Finish type
  placements?: string[]; // NEW: Where the sticker can be placed
  priceRange?: string; // e.g. "10-20"
  isFeatured?: boolean;
  isCustomizable?: boolean; // NEW: Flag for customizable products
  stickySide?: string;
};
