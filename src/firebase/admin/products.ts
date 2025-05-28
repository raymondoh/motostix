// ===============================
// 📂 src/firebase/admin/products.ts
// ===============================

// ================= Imports =================
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminStorage } from "@/firebase/admin/firebase-admin-init";
import type { DocumentData } from "firebase-admin/firestore";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import type { UpdateProductInput, Product, HeroSlide, ProductFilterOptions } from "@/types/product";
import { serializeProduct, serializeProductArray } from "@/utils/serializeProduct";
import { productSchema, productUpdateSchema } from "@/schemas/product";
import { normalizeCategory, normalizeSubcategory } from "@/config/categories";
import { updateProduct as updateProductFirebase } from "@/firebase/admin/products";
import { FieldValue } from "firebase-admin/firestore";
import { logActivity } from "./activity";
//import type { FirebaseFirestore } from "@firebase/firestore";

// Helper to map Firestore data to full Product type
// function mapDocToProduct(doc: FirebaseFirestore.DocumentSnapshot): Product {
//   const data = doc.data() ?? {};
//   return {
//     id: doc.id,
//     name: data?.name || "",
//     description: data?.description || "",
//     details: data?.details || "",
//     sku: data?.sku || "",
//     barcode: data?.barcode || "",
//     category: data.category || "",
//     subcategory: data.subcategory || "",
//     designThemes: data.designThemes || [],
//     productType: data.productType || "",
//     tags: data.tags || [],
//     brand: data.brand || "",
//     manufacturer: data.manufacturer || "",
//     dimensions: data?.dimensions || "",
//     weight: data?.weight || "",
//     shippingWeight: data?.shippingWeight || "",
//     material: data?.material || "",
//     finish: data?.finish || undefined,
//     color: data?.color || "",
//     baseColor: data?.baseColor || "",
//     colorDisplayName: data?.colorDisplayName || "",
//     stickySide: data?.stickySide || undefined,
//     size: data?.size || "",
//     image: data?.image || "/placeholder.svg",
//     additionalImages: data?.additionalImages || [],
//     placements: data?.placements || [],
//     price: data?.price || 0,
//     salePrice: data?.salePrice || undefined,
//     onSale: data?.onSale || false,
//     costPrice: data?.costPrice || undefined,
//     stockQuantity: data?.stockQuantity || undefined,
//     lowStockThreshold: data?.lowStockThreshold || undefined,
//     shippingClass: data?.shippingClass || "",
//     inStock: data?.inStock ?? true,
//     badge: data?.badge || "",
//     isFeatured: data?.isFeatured ?? false,
//     isHero: data?.isHero ?? false,
//     isLiked: data?.isLiked ?? false,
//     isCustomizable: data?.isCustomizable ?? false,
//     isNewArrival: data?.isNewArrival ?? false,
//     createdAt: data?.createdAt, // Keep as Timestamp or convert as needed before sending to client
//     updatedAt: data?.updatedAt
//   };
// }
function mapDocToProduct(doc: FirebaseFirestore.DocumentSnapshot): Product {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    name: data?.name || "",
    description: data?.description || "",
    details: data?.details || "",
    sku: data?.sku || "",
    barcode: data?.barcode || "",
    category: data.category || "",
    subcategory: data.subcategory || "",
    designThemes: data.designThemes || [],
    productType: data.productType || "",
    tags: data.tags || [],
    brand: data.brand || "",
    manufacturer: data.manufacturer || "",
    dimensions: data?.dimensions || "",
    weight: data?.weight || "",
    shippingWeight: data?.shippingWeight || "",
    material: data?.material || "",
    finish: data?.finish || undefined,
    color: data?.color || "",
    baseColor: data?.baseColor || "",
    colorDisplayName: data?.colorDisplayName || "",
    stickySide: data?.stickySide || undefined,
    size: data?.size || "",
    image: data?.image || "/placeholder.svg",
    additionalImages: data?.additionalImages || [],
    placements: data?.placements || [],
    price: data?.price || 0,
    salePrice: data?.salePrice || undefined,
    onSale: data?.onSale || false,
    costPrice: data?.costPrice || undefined,
    stockQuantity: data?.stockQuantity || undefined,
    lowStockThreshold: data?.lowStockThreshold || undefined,
    shippingClass: data?.shippingClass || "",
    inStock: data?.inStock ?? true,
    badge: data?.badge || "",
    isFeatured: data?.isFeatured ?? false,
    isHero: data?.isHero ?? false,
    isLiked: data?.isLiked ?? false,
    isCustomizable: data?.isCustomizable ?? false,
    isNewArrival: data?.isNewArrival ?? false,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt
  };
}

// ===================
// GET ALL PRODUCTS
// ===================
export async function getAllProducts(filters?: {
  category?: string;
  subcategory?: string;
  material?: string;
  priceRange?: string;
  isFeatured?: boolean;
  isLiked?: boolean;
  stickySide?: string;
  brand?: string;
  tags?: string[];
  onSale?: boolean;
  isNewArrival?: boolean;
  baseColor?: string;
  productType?: string;
  designThemes?: string[];
  limit?: number; // NEW: Add limit parameter
}) {
  if (filters && Object.keys(filters).some(key => key !== "limit")) {
    return await getFilteredProducts(filters);
  }

  try {
    let query = adminDb.collection("products").orderBy("createdAt", "desc");

    // Apply limit if provided
    if (filters?.limit && typeof filters.limit === "number" && filters.limit > 0) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    const products = snapshot.docs.map(mapDocToProduct);
    return { success: true as const, data: serializeProductArray(products) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching products";
    return { success: false as const, error: message };
  }
}

// ===================
// GET FILTERED PRODUCTS
// ===================

export async function getFilteredProducts(filters: ProductFilterOptions) {
  // Use the imported type
  try {
    console.log("getFilteredProducts - Received filters:", filters);

    // Normalize category and subcategory using the mapping functions
    if (filters.category) {
      const normalizedCategory = normalizeCategory(filters.category);
      if (normalizedCategory) {
        filters.category = normalizedCategory;
        console.log("getFilteredProducts - Normalized category filter:", filters.category);
      }
    }

    if (filters.subcategory && filters.category) {
      const normalizedCategory = normalizeCategory(filters.category);
      const normalizedSubcategory = normalizeSubcategory(filters.subcategory, normalizedCategory);
      if (normalizedSubcategory) {
        filters.subcategory = normalizedSubcategory;
        console.log("getFilteredProducts - Normalized subcategory filter:", filters.subcategory);
      }
    }

    let query = adminDb.collection("products").orderBy("createdAt", "desc");

    // String equality filters
    if (filters.category) {
      console.log("getFilteredProducts - Adding category filter:", filters.category);
      query = query.where("category", "==", filters.category);
    }
    if (filters.subcategory) {
      console.log("getFilteredProducts - Adding subcategory filter:", filters.subcategory);
      query = query.where("subcategory", "==", filters.subcategory);
    }
    if (filters.material) {
      query = query.where("material", "==", filters.material);
    }
    if (filters.finish) {
      query = query.where("finish", "==", filters.finish);
    }
    if (filters.productType) {
      query = query.where("productType", "==", filters.productType);
    }
    if (filters.stickySide) {
      query = query.where("stickySide", "==", filters.stickySide);
    }
    if (filters.brand) {
      query = query.where("brand", "==", filters.brand);
    }
    if (filters.baseColor) {
      query = query.where("baseColor", "==", filters.baseColor);
    }

    // Boolean filters
    if (filters.isFeatured !== undefined) {
      query = query.where("isFeatured", "==", filters.isFeatured);
    }
    if (filters.isCustomizable !== undefined) {
      query = query.where("isCustomizable", "==", filters.isCustomizable);
    }
    if (filters.onSale !== undefined) {
      query = query.where("onSale", "==", filters.onSale);
    }
    if (filters.isNewArrival !== undefined) {
      query = query.where("isNewArrival", "==", filters.isNewArrival);
    }
    if (filters.inStock !== undefined) {
      query = query.where("inStock", "==", filters.inStock);
    }

    // Price range filter
    if (filters.priceRange) {
      const [minPriceStr, maxPriceStr] = filters.priceRange.split("-");
      const minPrice = parseFloat(minPriceStr);
      const maxPrice = parseFloat(maxPriceStr);

      if (!isNaN(minPrice)) {
        query = query.where("price", ">=", minPrice);
      }
      if (!isNaN(maxPrice)) {
        query = query.where("price", "<=", maxPrice);
      }
    }

    const snapshot = await query.get();
    let products = snapshot.docs.map(mapDocToProduct);

    // In-memory filters for array fields
    if (filters.designThemes && filters.designThemes.length > 0) {
      products = products.filter(product => product.designThemes?.some(theme => filters.designThemes?.includes(theme)));
    }
    if (filters.placements && filters.placements.length > 0) {
      products = products.filter(product =>
        product.placements?.some(placement => filters.placements?.includes(placement))
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      products = products.filter(product => product.tags?.some(tag => filters.tags?.includes(tag as string)));
    }
    // Log a sample product to see its structure
    if (products.length > 0) {
      console.log("getFilteredProducts - Sample product:", {
        id: products[0].id,
        category: products[0].category,
        subcategory: products[0].subcategory
      });
    }

    return { success: true as const, data: serializeProductArray(products) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching filtered products";
    console.error("Error in getFilteredProducts:", message, error); // Log the original error too
    return { success: false as const, error: message };
  }
}

// ===================
// ADD PRODUCT
// ===================
/**
 * Add a new product document.
 * Accepts all Product fields *except* id / createdAt / updatedAt (those are added here).
 */
// export async function addProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
//   try {
//     /* ── quick sanity-check (ignores unknown keys) ─────────────── */
//     const parsed = productSchema.safeParse(data);
//     if (!parsed.success) {
//       console.error("❌ Invalid product data:", parsed.error.flatten());
//       return { success: false as const, error: "Invalid product data" };
//     }

//     const now = Timestamp.now();

//     /* ── write to Firestore ────────────────────────────────────── */
//     const docRef = await adminDb.collection("products").add({
//       ...data,
//       createdAt: now,
//       updatedAt: now
//     });

//     /* ── ensure a SKU exists ───────────────────────────────────── */
//     const finalSku = data.sku ?? `SKU-${docRef.id.substring(0, 8).toUpperCase()}`; // generate simple SKU
//     if (!data.sku) await docRef.update({ sku: finalSku });

//     /* ── compose full product object for return ───────────────── */
//     const fullProduct: Product = {
//       id: docRef.id,
//       ...data,
//       sku: finalSku,
//       inStock: data.inStock ?? true, // default when caller omits it
//       createdAt: now,
//       updatedAt: now
//     };

//     return {
//       success: true as const,
//       id: docRef.id,
//       product: serializeProduct(fullProduct)
//     };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error adding product";
//     console.error("Error adding product:", message);
//     return { success: false as const, error: message };
//   }
// }
export async function addProduct(data: any) {
  try {
    console.log("🚀 addProduct - Starting creation");
    console.log("📋 addProduct - Raw input data:", JSON.stringify(data, null, 2));

    // Validate using the full product schema for creation
    const validationResult = productSchema.safeParse(data);

    if (!validationResult.success) {
      console.error("❌ Schema validation failed:", validationResult.error.errors);
      const errorMessages = validationResult.error.errors
        .map(err => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { success: false as const, error: `Validation failed: ${errorMessages}` };
    }

    const validatedData = validationResult.data;
    console.log("✅ Schema validation passed. Validated data:", JSON.stringify(validatedData, null, 2));

    // Create the new product with timestamps
    const newProduct = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("🔥 FINAL - Product data being sent to Firebase:", JSON.stringify(newProduct, null, 2));

    const docRef = await adminDb.collection("products").add(newProduct);

    console.log("✅ Firebase creation completed successfully with ID:", docRef.id);

    return { success: true as const, data: docRef.id };
  } catch (error) {
    console.error("❌ addProduct error:", error);
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error adding product";
    return { success: false as const, error: message };
  }
}

// ===================
// GET PRODUCT BY ID
// ===================
// export async function getProductById(id: string) {
//   try {
//     const doc = await adminDb.collection("products").doc(id).get();
//     if (!doc.exists) return { success: false as const, error: "Product not found" };

//     const product = mapDocToProduct(doc);
//     return { success: true as const, product: serializeProduct(product) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error fetching product by ID";
//     return { success: false as const, error: message };
//   }
// }
// Assuming adminDb is imported somewhat like this at the top of the file:
// import { adminDb } from '../admin/firebase-admin-init'; // ADJUST PATH TO YOUR INIT FILE
// And your helper functions are also available:
// import { mapDocToProduct, serializeProduct } from './mappers'; // Example path
// import { isFirebaseError, firebaseError } from './errorUtils'; // Example path

export async function getProductById(id: string) {
  console.log(`[getProductById] Called for product ID: ${id}`);

  // Critical check: Is adminDb and its app property available?
  if (!adminDb || !adminDb.app) {
    console.error(
      `[getProductById] CRITICAL: adminDb or adminDb.app is NOT INITIALIZED when called for ID: ${id}! This implies a serious issue with Firebase Admin setup.`
    );
    return {
      success: false as const,
      error: "Firebase Admin (adminDb.app) not properly initialized for getProductById"
    };
  }

  // Log the app name to ensure we're using the initialized instance
  console.log(`[getProductById] Using adminDb.app.name: '${adminDb.app.name}' for product ID: ${id}`);
  // This should log '[DEFAULT]' if your initialization was successful and is correctly referenced.

  try {
    console.log(`[getProductById] Attempting Firestore operation: adminDb.collection('products').doc('${id}').get()`);
    const doc = await adminDb.collection("products").doc(id).get();

    if (!doc.exists) {
      console.warn(`[getProductById] Product with ID: '${id}' not found in Firestore.`);
      return { success: false as const, error: "Product not found" };
    }

    console.log(`[getProductById] Successfully fetched document for product ID: '${id}'. Exists: true.`);
    // Assuming mapDocToProduct and serializeProduct are synchronous or you handle their async nature appropriately
    const product = mapDocToProduct(doc); // Ensure mapDocToProduct is defined
    const serialized = serializeProduct(product); // Ensure serializeProduct is defined

    console.log(`[getProductById] Product mapped and serialized for ID: '${id}'.`);
    return { success: true as const, product: serialized };
  } catch (error) {
    console.error(`[getProductById] Firebase error occurred while fetching product ID '${id}':`, error);

    // Attempt to log adminDb.app.name again in case of an error to see if it was available then
    try {
      console.error(
        `[getProductById] State of adminDb.app.name at time of error: '${
          adminDb.app?.name || "adminDb.app NOT DEFINED"
        }'`
      );
    } catch (appError) {
      console.error(
        `[getProductById] Could not access adminDb.app.name at time of error. adminDb might be undefined or app property inaccessible.`
      );
    }

    // Assuming isFirebaseError and firebaseError are defined
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error fetching product by ID";

    console.error(`[getProductById] Processed error message for ID '${id}': ${message}`);
    return { success: false as const, error: message };
  }
}

// ===================
// UPDATE PRODUCT
// ===================
type SafeUpdateProductInput = Omit<UpdateProductInput, "id" | "createdAt">;

export async function updateProduct(id: string, data: any) {
  try {
    if (!id) {
      throw new Error("Product ID is required");
    }

    console.log("🚀 updateProduct - Starting update for:", id);
    console.log("📋 updateProduct - Raw input data:", JSON.stringify(data, null, 2));

    // Use the update schema for validation (all fields optional)
    const validationResult = productUpdateSchema.safeParse(data);

    if (!validationResult.success) {
      console.error("❌ Schema validation failed:", validationResult.error.errors);
      const errorMessages = validationResult.error.errors
        .map(err => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { success: false as const, error: `Validation failed: ${errorMessages}` };
    }

    const validatedData = validationResult.data;
    console.log("✅ Schema validation passed. Validated data:", JSON.stringify(validatedData, null, 2));

    // Specifically log sale-related fields
    console.log("🏷️ Sale fields after validation:", {
      onSale: validatedData.onSale,
      salePrice: validatedData.salePrice,
      price: validatedData.price
    });

    // Create update object with validated fields
    const updateData: Record<string, any> = {
      ...validatedData,
      updatedAt: new Date()
    };

    console.log("🔥 FINAL - Update data being sent to Firebase:", JSON.stringify(updateData, null, 2));

    // Perform the Firebase update
    await adminDb.collection("products").doc(id).update(updateData);

    console.log("✅ Firebase update completed successfully");

    return { success: true as const, data: id };
  } catch (error) {
    console.error("❌ updateProduct error:", error);
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error updating product";
    return { success: false as const, error: message };
  }
}

// ===================
// DELETE PRODUCT
// ===================
export async function deleteProduct(productId: string) {
  try {
    const docRef = adminDb.collection("products").doc(productId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { success: false as const, error: "Product not found" };
    }

    const data = docSnap.data();
    const imageUrl = data?.image;
    const additionalImages = data?.additionalImages || [];

    await docRef.delete();

    // Delete main image
    if (imageUrl) await deleteProductImage(imageUrl);

    // Delete additional images
    for (const imgUrl of additionalImages) {
      await deleteProductImage(imgUrl);
    }

    return { success: true as const };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error deleting product";
    console.error("Error deleting product:", message);
    return { success: false as const, error: message };
  }
}

// ===================
// DELETE PRODUCT IMAGE
// ===================
export async function deleteProductImage(imageUrl: string) {
  try {
    const bucket = adminStorage.bucket();
    const url = new URL(imageUrl);
    const fullPath = url.pathname.slice(1);
    const storagePath = fullPath.replace(`${bucket.name}/`, "");

    await bucket.file(storagePath).delete();

    return { success: true as const };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error deleting image";
    console.error("❌ Error deleting image:", message);
    return { success: false as const, error: message };
  }
}

// ===================
// GET FEATURED PRODUCTS
// ===================
export async function getFeaturedProducts() {
  try {
    const snapshot = await adminDb.collection("products").where("isFeatured", "==", true).get();
    const products = snapshot.docs.map(mapDocToProduct);
    return { success: true as const, data: serializeProductArray(products) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching featured products";
    return { success: false as const, error: message };
  }
}

// ===================
// GET ON SALE PRODUCTS - IMPROVED WITH BETTER ERROR HANDLING
// ===================
export async function getOnSaleProducts(limit = 10) {
  try {
    console.log("🏷️ getOnSaleProducts - Starting query for sale products");

    // Try the direct query first
    let snapshot;
    try {
      snapshot = await adminDb
        .collection("products")
        .where("onSale", "==", true)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      console.log("🏷️ getOnSaleProducts - Direct query found:", snapshot.docs.length, "products");
    } catch (queryError) {
      console.log("🏷️ getOnSaleProducts - Direct query failed, trying fallback approach");

      // Fallback: get all products and filter in memory
      snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();

      console.log("🏷️ getOnSaleProducts - Fallback: got", snapshot.docs.length, "total products");
    }

    const products = snapshot.docs.map(mapDocToProduct);

    // Always filter in memory to be extra sure
    const saleProducts = products.filter(product => {
      const isOnSale = product.onSale === true;
      if (isOnSale) {
        console.log("🏷️ Found sale product:", {
          name: product.name,
          onSale: product.onSale,
          price: product.price,
          salePrice: product.salePrice
        });
      }
      return isOnSale;
    });

    // Apply limit if we did fallback approach
    const finalProducts = saleProducts.slice(0, limit);

    console.log("🏷️ getOnSaleProducts - Final result:", finalProducts.length, "sale products");

    return { success: true as const, data: serializeProductArray(finalProducts) };
  } catch (error) {
    console.error("❌ getOnSaleProducts error:", error);
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching sale products";
    return { success: false as const, error: message };
  }
}

// ===================
// GET NEW ARRIVALS
// ===================
export async function getNewArrivals(limit = 10) {
  try {
    const snapshot = await adminDb
      .collection("products")
      .where("isNewArrival", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const products = snapshot.docs.map(mapDocToProduct);
    return { success: true as const, data: serializeProductArray(products) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching new arrivals";
    return { success: false as const, error: message };
  }
}

// ===================
// GET HERO SLIDES
// ===================
export async function getHeroSlidesFromFirestore() {
  try {
    const snapshot = await adminDb.collection("products").where("isHero", "==", true).get();
    const slides: HeroSlide[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        title: data.name,
        description: data.description,
        backgroundImage: data.image,
        cta: "Shop Now",
        ctaHref: `/products/${doc.id}`
      };
    });
    return { success: true as const, data: slides };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching hero slides";
    return { success: false as const, error: message };
  }
}

// ===================
// GET RELATED PRODUCTS
// ===================
interface GetRelatedProductsParams {
  productId: string;
  category?: string;
  subcategory?: string;
  designTheme?: string; // Keep this as string for flexibility
  productType?: string;
  brand?: string;
  tags?: string[];
  limit?: number;
}

export async function getRelatedProducts({
  productId,
  category,
  subcategory,
  designTheme,
  productType,
  brand,
  tags,
  limit = 4
}: GetRelatedProductsParams) {
  try {
    // Start with a collection reference
    let query = adminDb.collection("products") as FirebaseFirestore.Query<DocumentData>;

    // Apply category filter
    if (category) {
      query = query.where("category", "==", category);
    }

    // Apply subcategory filter if provided
    if (subcategory) {
      query = query.where("subcategory", "==", subcategory);
    }

    // Apply product type filter if provided
    if (productType) {
      query = query.where("productType", "==", productType);
    }

    // Apply brand filter if provided
    if (brand) {
      query = query.where("brand", "==", brand);
    }

    // Apply ordering and limit
    const snapshot = await query
      .orderBy("createdAt", "desc")
      .limit(limit + 1)
      .get();

    let related = snapshot.docs
      .map(doc => mapDocToProduct(doc))
      .filter(product => product.id !== productId)
      .slice(0, limit);

    // If design theme is provided, filter in memory
    if (designTheme && related.length > 0) {
      // Use type assertion to tell TypeScript that we're handling the type correctly
      const filteredByTheme = related.filter(product =>
        product.designThemes?.some(theme => theme === designTheme || theme.toLowerCase() === designTheme.toLowerCase())
      );

      // If we have enough products with the theme, use those
      if (filteredByTheme.length >= 2) {
        related = filteredByTheme.slice(0, limit);
      }
    }

    // If tags are provided, filter in memory
    if (tags && tags.length > 0 && related.length > 0) {
      const filteredByTags = related.filter(product => product.tags?.some(tag => tags.includes(tag)));

      // If we have enough products with matching tags, use those
      if (filteredByTags.length >= 2) {
        related = filteredByTags.slice(0, limit);
      }
    }

    // If no products found with the filters, try a broader search
    if (related.length === 0) {
      const fallbackQuery = adminDb.collection("products").orderBy("createdAt", "desc").limit(limit).get();

      const fallbackSnapshot = await fallbackQuery;
      const fallbackProducts = fallbackSnapshot.docs
        .map(doc => mapDocToProduct(doc))
        .filter(product => product.id !== productId)
        .slice(0, limit);

      return { success: true as const, products: serializeProductArray(fallbackProducts) };
    }

    return { success: true as const, products: serializeProductArray(related) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching related products";
    return { success: false as const, error: message };
  }
}

// ===================
// LIKE A PRODUCT
// ===================
export async function likeProduct(userId: string, productId: string) {
  try {
    const now = Timestamp.now();
    const likeRef = adminDb.collection("users").doc(userId).collection("likes").doc(productId);

    await likeRef.set({
      productId,
      createdAt: now
    });

    return { success: true as const };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error liking product";
    console.error("Error liking product:", message);
    return { success: false as const, error: message };
  }
}

// // ===================
// // UNLIKE A PRODUCT
// // ===================
export async function unlikeProduct(userId: string, productId: string) {
  try {
    const likeRef = adminDb.collection("users").doc(userId).collection("likes").doc(productId);
    await likeRef.delete();
    return { success: true as const };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error unliking product";
    console.error("Error unliking product:", message);
    return { success: false as const, error: message };
  }
}

// // ===================
// // GET LIKED PRODUCTS
// // ===================
export async function getUserLikedProducts(userId: string) {
  try {
    const snapshot = await adminDb.collection("users").doc(userId).collection("likes").get();
    const likedProductIds = snapshot.docs.map(doc => doc.id);

    if (likedProductIds.length === 0) return { success: true as const, data: [] };

    const productDocs = await Promise.all(likedProductIds.map(id => adminDb.collection("products").doc(id).get()));

    const products = productDocs.filter(doc => doc.exists).map(doc => mapDocToProduct(doc));

    return { success: true as const, data: serializeProductArray(products) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching liked products";
    console.error("Error fetching liked products:", message);
    return { success: false as const, error: message };
  }
}
