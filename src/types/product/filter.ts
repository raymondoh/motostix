// src/types/product/filter.ts

export type ProductFilterOptions = {
  category?: string;
  subcategory?: string;
  material?: string;
  priceRange?: string; // e.g. "10-20"
  isFeatured?: boolean;
  stickySide?: string;
};
