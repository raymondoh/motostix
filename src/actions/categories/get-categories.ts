//src/actions/categories/get-categories.ts
import { adminDb } from "@/firebase/admin/firebase-admin-init";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import {
  categories,
  subcategories,
  designThemes,
  productTypes,
  materials,
  placements,
  featuredCategoryMappings,
  brands,
  sizes,
  shippingClasses,
  tags,
  type CategoryData as Category
} from "@/config/categories";

// Define the return type for getCategories
export interface GetCategoriesResult {
  success: boolean;
  data?: Category[];
  error?: string;
}

// ===================
// GET ALL CATEGORIES WITH COUNTS
// ===================
export async function getCategories(): Promise<GetCategoriesResult> {
  try {
    // Get all products to calculate counts
    const snapshot = await adminDb().collection("products").get();
    const products = snapshot.docs.map(doc => doc.data());

    // Calculate counts for each category
    const categoryCounts: Record<string, number> = {};

    products.forEach(product => {
      const category = product.category;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    // Create category objects with counts
    const categoryData: Category[] = categories.map(category => ({
      id: category.toLowerCase().replace(/\s+/g, "-"),
      name: category,
      count: categoryCounts[category] || 0,
      // Find a product image to use for the category
      image: products.find(p => p.category === category && p.image)?.image || undefined
    }));

    return { success: true, data: categoryData };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching categories";
    return { success: false, error: message };
  }
}

// ===================
// GET SUBCATEGORIES FOR A CATEGORY
// ===================
export async function getSubcategories(category: string): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Check if the category exists in our predefined subcategories
    if (category in subcategories) {
      return {
        success: true,
        data: subcategories[category as keyof typeof subcategories]
      };
    }

    // If category not found in predefined list, query the database
    const snapshot = await adminDb().collection("products").where("category", "==", category).get();

    const uniqueSubcategories = new Set<string>();

    snapshot.docs.forEach(doc => {
      const subcategory = doc.data().subcategory;
      if (subcategory) {
        uniqueSubcategories.add(subcategory);
      }
    });

    return { success: true, data: Array.from(uniqueSubcategories) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching subcategories";
    return { success: false, error: message };
  }
}

// ===================
// GET AVAILABLE DESIGN THEMES
// ===================
export async function getDesignThemes(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Return predefined design themes
    return { success: true, data: [...designThemes] };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching design themes";
    return { success: false, error: message };
  }
}

// ===================
// GET AVAILABLE PRODUCT TYPES
// ===================
export async function getProductTypes(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Return predefined product types
    return { success: true, data: [...productTypes] };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching product types";
    return { success: false, error: message };
  }
}

// ===================
// GET AVAILABLE MATERIALS
// ===================
export async function getMaterials(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Return predefined materials
    return { success: true, data: [...materials] };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching materials";
    return { success: false, error: message };
  }
}

// ===================
// GET AVAILABLE PLACEMENTS
// ===================
export async function getPlacements(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Return predefined placements
    return { success: true, data: [...placements] };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching placements";
    return { success: false, error: message };
  }
}

// ===================
// GET AVAILABLE BRANDS
// ===================
export async function getBrands(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Return predefined brands
    return { success: true, data: [...brands] };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching brands";
    return { success: false, error: message };
  }
}

// ===================
// GET AVAILABLE SIZES
// ===================
export async function getSizes(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Return predefined sizes
    return { success: true, data: [...sizes] };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching sizes";
    return { success: false, error: message };
  }
}

// ===================
// GET AVAILABLE SHIPPING CLASSES
// ===================
export async function getShippingClasses(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Return predefined shipping classes
    return { success: true, data: [...shippingClasses] };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching shipping classes";
    return { success: false, error: message };
  }
}

// ===================
// GET AVAILABLE TAGS
// ===================
export async function getTags(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    // Return predefined tags
    return { success: true, data: [...tags] };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching tags";
    return { success: false, error: message };
  }
}

// ===================
// GET FEATURED CATEGORIES FOR HOMEPAGE
// ===================
export async function getFeaturedCategories() {
  try {
    const featuredCategories = [
      {
        name: "Sport Bike Decals",
        image: "/bike.jpg",
        slug: "sport-bike",
        count: 0
      },
      {
        name: "Cruiser Graphics",
        image: "/car.jpg",
        slug: "cruiser",
        count: 0
      },
      {
        name: "Off-Road Stickers",
        image: "/bike.jpg",
        slug: "off-road",
        count: 0
      },
      {
        name: "Custom Designs",
        image: "/car.jpg",
        slug: "custom",
        count: 0
      },
      {
        name: "Vintage Collection",
        image: "/car.jpg",
        slug: "vintage",
        count: 0
      }
    ];

    // Calculate counts for each featured category
    const snapshot = await adminDb().collection("products").get();

    // Use a more specific type for the products
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        category: data.category as string | undefined,
        subcategory: data.subcategory as string | undefined,
        productType: data.productType as string | undefined,
        designThemes: data.designThemes as string[] | undefined,
        tags: data.tags as string[] | undefined,
        brand: data.brand as string | undefined
      };
    });

    // Update counts based on the featuredCategoryMappings
    for (const category of featuredCategories) {
      const mapping = featuredCategoryMappings[category.slug];
      if (mapping) {
        let count = 0;

        for (const product of products) {
          let matches = true;

          if (mapping.category && product.category !== mapping.category) {
            matches = false;
          }

          if (mapping.subcategory && product.subcategory !== mapping.subcategory) {
            matches = false;
          }

          if (mapping.productType && product.productType !== mapping.productType) {
            matches = false;
          }

          if (mapping.brand && product.brand !== mapping.brand) {
            matches = false;
          }

          if (mapping.designThemes && mapping.designThemes.length > 0) {
            const hasMatchingTheme = product.designThemes?.some(theme => mapping.designThemes?.includes(theme as any));
            if (!hasMatchingTheme) {
              matches = false;
            }
          }

          if (mapping.tags && mapping.tags.length > 0) {
            const hasMatchingTag = product.tags?.some(tag => mapping.tags?.includes(tag as any));
            if (!hasMatchingTag) {
              matches = false;
            }
          }

          if (matches) {
            count++;
          }
        }

        category.count = count;
      }
    }

    return { success: true as const, data: featuredCategories };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching featured categories";
    return { success: false as const, error: message };
  }
}
