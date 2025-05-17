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

  /**
   * Optional description of the category
   */
  description?: string;

  /**
   * Whether this category is featured on the homepage or in special sections
   */
  featured?: boolean;
}

/**
 * Subcategory type representing a nested category within a parent category
 */
export interface Subcategory {
  /**
   * Unique identifier for the subcategory
   */
  id: string;

  /**
   * Display name of the subcategory
   */
  name: string;

  /**
   * ID of the parent category this subcategory belongs to
   */
  parentId: string;

  /**
   * Number of products in this subcategory
   */
  count?: number;
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

/**
 * Success response when fetching subcategories
 */
export interface GetSubcategoriesSuccess {
  success: true;
  data: Subcategory[];
}

/**
 * Error response when fetching subcategories fails
 */
export interface GetSubcategoriesError {
  success: false;
  error: string;
}

/**
 * Union type for subcategory fetch results
 */
export type GetSubcategoriesResult = GetSubcategoriesSuccess | GetSubcategoriesError;
