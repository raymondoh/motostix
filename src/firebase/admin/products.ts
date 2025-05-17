// // ===============================
// // 📂 src/firebase/admin/products.ts
// // ===============================

// // ================= Imports =================
// import { Timestamp } from "firebase-admin/firestore";
// import { adminDb, adminStorage } from "@/firebase/admin/firebase-admin-init";
// import { DocumentData } from "firebase-admin/firestore";
// import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
// import type {
//   //GetProductByIdFromFirestoreResult,
//   UpdateProductInput,
//   //UpdateProductResult,
//   Product,
//   //SerializedProduct,
//   HeroSlide
// } from "@/types/product";
// import { serializeProduct, serializeProductArray } from "@/utils/serializeProduct";
// import { productSchema, updateProductSchema } from "@/schemas/product";

// // Helper to map Firestore data to full Product type
// function mapDocToProduct(doc: FirebaseFirestore.DocumentSnapshot): Product {
//   const data = doc.data() ?? {};
//   return {
//     id: doc.id,
//     name: data?.name,
//     description: data?.description || "",
//     details: data?.details || "",
//     dimensions: data?.dimensions || "",

//     // Enhanced categorization
//     category: data.category || "",
//     subcategory: data.subcategory || "",
//     designThemes: data.designThemes || [],
//     productType: data.productType || "",

//     // Enhanced material properties
//     material: data?.material || "",
//     finish: data?.finish || undefined,

//     // Other existing properties
//     color: data?.color || "",
//     baseColor: data?.baseColor || "",
//     colorDisplayName: data?.colorDisplayName || "",
//     stickySide: data?.stickySide || undefined,
//     image: data?.image || "/placeholder.svg",
//     placements: data?.placements || [],

//     price: data?.price,
//     inStock: data?.inStock ?? true,
//     badge: data?.badge || "",
//     isFeatured: data?.isFeatured ?? false,
//     isHero: data?.isHero ?? false,
//     isLiked: data?.isLiked ?? false,
//     isCustomizable: data?.isCustomizable ?? false,

//     createdAt: data?.createdAt,
//     updatedAt: data?.updatedAt
//   };
// }

// // ===================
// // GET ALL PRODUCTS
// // ===================
// export async function getAllProducts(filters?: {
//   category?: string;
//   subcategory?: string;
//   material?: string;
//   priceRange?: string;
//   isFeatured?: boolean;
//   isLiked?: boolean;
//   stickySide?: string;
// }) {
//   if (filters) {
//     return await getFilteredProducts(filters);
//   }

//   try {
//     const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();
//     const products = snapshot.docs.map(mapDocToProduct);
//     return { success: true as const, data: serializeProductArray(products) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error fetching products";
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // GET FILTERED PRODUCTS
// // ===================
// export async function getFilteredProducts(filters: {
//   category?: string;
//   subcategory?: string;
//   designThemes?: string[];
//   productType?: string;
//   material?: string;
//   finish?: string;
//   placements?: string[];
//   priceRange?: string;
//   isFeatured?: boolean;
//   isCustomizable?: boolean;
//   stickySide?: string;
// }) {
//   try {
//     let query = adminDb.collection("products").orderBy("createdAt", "desc");

//     // Apply basic filters
//     if (filters.category) {
//       query = query.where("category", "==", filters.category);
//     }

//     if (filters.subcategory) {
//       query = query.where("subcategory", "==", filters.subcategory);
//     }

//     if (filters.material) {
//       query = query.where("material", "==", filters.material);
//     }

//     if (filters.finish) {
//       query = query.where("finish", "==", filters.finish);
//     }

//     if (filters.productType) {
//       query = query.where("productType", "==", filters.productType);
//     }

//     if (filters.stickySide) {
//       query = query.where("stickySide", "==", filters.stickySide);
//     }

//     if (filters.isCustomizable !== undefined) {
//       query = query.where("isCustomizable", "==", filters.isCustomizable);
//     }

//     if (filters.isFeatured !== undefined) {
//       query = query.where("isFeatured", "==", filters.isFeatured);
//     }

//     // Price range filter
//     if (filters.priceRange) {
//       const priceRange = filters.priceRange.split("-");
//       if (priceRange.length === 2) {
//         query = query.where("price", ">=", parseFloat(priceRange[0])).where("price", "<=", parseFloat(priceRange[1]));
//       }
//     }

//     // Get initial results
//     const snapshot = await query.get();
//     let products = snapshot.docs.map(mapDocToProduct);

//     // Apply array-based filters in memory (Firestore doesn't support array-contains-any with multiple conditions)
//     if (filters.designThemes && filters.designThemes.length > 0) {
//       products = products.filter(product => product.designThemes?.some(theme => filters.designThemes?.includes(theme)));
//     }

//     if (filters.placements && filters.placements.length > 0) {
//       products = products.filter(product =>
//         product.placements?.some(placement => filters.placements?.includes(placement))
//       );
//     }

//     return { success: true as const, data: serializeProductArray(products) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error fetching filtered products";
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // ADD PRODUCT
// // ===================
// export async function addProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
//   try {
//     const parsed = productSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(data);
//     if (!parsed.success) {
//       console.error("❌ Invalid product data:", parsed.error.flatten());
//       return { success: false as const, error: "Invalid product data" };
//     }

//     const now = Timestamp.now();
//     const productData = { ...parsed.data, createdAt: now, updatedAt: now };
//     const docRef = await adminDb.collection("products").add(productData);

//     const fullProduct: Product = { id: docRef.id, ...productData };
//     return { success: true as const, id: docRef.id, product: serializeProduct(fullProduct) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error adding product";
//     console.error("Error adding product:", message);
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // GET PRODUCT BY ID
// // ===================
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

// // ===================
// // UPDATE PRODUCT
// // ===================
// type SafeUpdateProductInput = Omit<UpdateProductInput, "id" | "createdAt">;

// export async function updateProduct(id: string, updatedData: SafeUpdateProductInput) {
//   try {
//     const parsed = updateProductSchema.safeParse(updatedData);

//     if (!parsed.success) {
//       console.error("❌ Invalid updated product data:", parsed.error.flatten());
//       return { success: false as const, error: "Invalid product update data" };
//     }

//     const docRef = adminDb.collection("products").doc(id);
//     console.log("Parsed update data:", parsed.data);

//     await docRef.update({ ...parsed.data, updatedAt: Timestamp.now() });

//     const updatedDoc = await docRef.get();
//     if (!updatedDoc.exists) return { success: false as const, error: "Product not found after update" };

//     const product = mapDocToProduct(updatedDoc);
//     return { success: true as const, product: serializeProduct(product) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error updating product";
//     console.error("Error updating product:", message);
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // DELETE PRODUCT
// // ===================
// export async function deleteProduct(productId: string) {
//   try {
//     const docRef = adminDb.collection("products").doc(productId);
//     const docSnap = await docRef.get();

//     if (!docSnap.exists) {
//       return { success: false as const, error: "Product not found" };
//     }

//     const data = docSnap.data();
//     const imageUrl = data?.image;

//     await docRef.delete();

//     if (imageUrl) await deleteProductImage(imageUrl);

//     return { success: true as const };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error deleting product";
//     console.error("Error deleting product:", message);
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // DELETE PRODUCT IMAGE
// // ===================
// export async function deleteProductImage(imageUrl: string) {
//   try {
//     const bucket = adminStorage.bucket();
//     const url = new URL(imageUrl);
//     const fullPath = url.pathname.slice(1);
//     const storagePath = fullPath.replace(`${bucket.name}/`, "");

//     await bucket.file(storagePath).delete();

//     return { success: true as const };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error deleting image";
//     console.error("❌ Error deleting image:", message);
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // GET FEATURED PRODUCTS
// // ===================
// export async function getFeaturedProducts() {
//   try {
//     const snapshot = await adminDb.collection("products").where("isFeatured", "==", true).get();
//     const products = snapshot.docs.map(mapDocToProduct);
//     return { success: true as const, data: serializeProductArray(products) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error fetching featured products";
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // GET HERO SLIDES
// // ===================
// export async function getHeroSlidesFromFirestore() {
//   try {
//     const snapshot = await adminDb.collection("products").where("isHero", "==", true).get();
//     const slides: HeroSlide[] = snapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         title: data.name,
//         description: data.description,
//         backgroundImage: data.image,
//         cta: "Shop Now",
//         ctaHref: `/products/${doc.id}`
//       };
//     });
//     return { success: true as const, data: slides };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error fetching hero slides";
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // GET RELATED PRODUCTS
// // ===================
// // interface GetRelatedProductsParams {
// //   productId: string;
// //   category?: string;
// //   limit?: number;
// // }

// // export async function getRelatedProducts({ productId, category, limit = 4 }: GetRelatedProductsParams) {
// //   try {
// //     // Start with a collection reference
// //     let query = adminDb.collection("products") as FirebaseFirestore.Query<DocumentData>;

// //     // If category is provided, apply the where clause
// //     if (category) {
// //       query = query.where("category", "==", category);
// //     }

// //     // Apply ordering and limit
// //     const snapshot = await query
// //       .orderBy("createdAt", "desc") // Ensure 'createdAt' is indexed
// //       .limit(limit + 1) // Fetch one more than the limit to remove the current product
// //       .get();

// //     const related = snapshot.docs
// //       .map(doc => ({ id: doc.id, ...doc.data() } as Product))
// //       .filter(product => product.id !== productId) // Filter out the current product
// //       .slice(0, limit); // Ensure we only return up to the specified limit after filtering
// //     // If no products found in the same category, try without category filter
// //     if (related.length === 0 && category) {
// //       const fallbackQuery = adminDb.collection("products").orderBy("createdAt", "desc").limit(limit).get();

// //       const fallbackSnapshot = await fallbackQuery;
// //       const fallbackProducts = fallbackSnapshot.docs
// //         .map(doc => ({ id: doc.id, ...doc.data() } as Product))
// //         .filter(product => product.id !== productId)
// //         .slice(0, limit);

// //       return { success: true as const, products: serializeProductArray(fallbackProducts) };
// //     }

// //     return { success: true as const, products: serializeProductArray(related) };
// //   } catch (error) {
// //     const message = isFirebaseError(error)
// //       ? firebaseError(error)
// //       : (error as Error)?.message || "Unknown error fetching related products";
// //     return { success: false as const, error: message };
// //   }
// // }
// // ===================
// // GET RELATED PRODUCTS
// // ===================
// // interface GetRelatedProductsParams {
// //   productId: string;
// //   category?: string;
// //   subcategory?: string; // New subcategory filter
// //   limit?: number;
// // }

// // export async function getRelatedProducts({ productId, category, subcategory, limit = 4 }: GetRelatedProductsParams) {
// //   try {
// //     // Start with a collection reference
// //     let query = adminDb.collection("products") as FirebaseFirestore.Query<DocumentData>;

// //     // Apply category filter
// //     if (category) {
// //       query = query.where("category", "==", category);
// //     }

// //     // Apply subcategory filter if provided
// //     if (subcategory) {
// //       query = query.where("subcategory", "==", subcategory);
// //     }

// //     // Apply ordering and limit
// //     const snapshot = await query
// //       .orderBy("createdAt", "desc") // Ensure 'createdAt' is indexed
// //       .limit(limit + 1) // Fetch one more than the limit to remove the current product
// //       .get();

// //     const related = snapshot.docs
// //       .map(doc => ({ id: doc.id, ...doc.data() } as Product))
// //       .filter(product => product.id !== productId) // Filter out the current product
// //       .slice(0, limit); // Ensure we only return up to the specified limit after filtering

// //     // If no products found in the same category, try without category filter
// //     if (related.length === 0 && category) {
// //       const fallbackQuery = adminDb.collection("products").orderBy("createdAt", "desc").limit(limit).get();

// //       const fallbackSnapshot = await fallbackQuery;
// //       const fallbackProducts = fallbackSnapshot.docs
// //         .map(doc => ({ id: doc.id, ...doc.data() } as Product))
// //         .filter(product => product.id !== productId)
// //         .slice(0, limit);

// //       return { success: true as const, products: serializeProductArray(fallbackProducts) };
// //     }

// //     return { success: true as const, products: serializeProductArray(related) };
// //   } catch (error) {
// //     const message = isFirebaseError(error)
// //       ? firebaseError(error)
// //       : (error as Error)?.message || "Unknown error fetching related products";
// //     return { success: false as const, error: message };
// //   }
// // }
// // ===================
// // GET RELATED PRODUCTS
// // ===================
// interface GetRelatedProductsParams {
//   productId: string;
//   category?: string;
//   subcategory?: string;
//   designTheme?: string;
//   productType?: string;
//   limit?: number;
// }

// export async function getRelatedProducts({
//   productId,
//   category,
//   subcategory,
//   designTheme,
//   productType,
//   limit = 4
// }: GetRelatedProductsParams) {
//   try {
//     // Start with a collection reference
//     let query = adminDb.collection("products") as FirebaseFirestore.Query<DocumentData>;

//     // Apply category filter
//     if (category) {
//       query = query.where("category", "==", category);
//     }

//     // Apply subcategory filter if provided
//     if (subcategory) {
//       query = query.where("subcategory", "==", subcategory);
//     }

//     // Apply product type filter if provided
//     if (productType) {
//       query = query.where("productType", "==", productType);
//     }

//     // Apply ordering and limit
//     const snapshot = await query
//       .orderBy("createdAt", "desc")
//       .limit(limit + 1)
//       .get();

//     let related = snapshot.docs
//       .map(doc => mapDocToProduct(doc))
//       .filter(product => product.id !== productId)
//       .slice(0, limit);

//     // If design theme is provided, filter in memory
//     if (designTheme && related.length > 0) {
//       const filteredByTheme = related.filter(product => product.designThemes?.includes(designTheme));

//       // If we have enough products with the theme, use those
//       if (filteredByTheme.length >= 2) {
//         related = filteredByTheme.slice(0, limit);
//       }
//     }

//     // If no products found with the filters, try a broader search
//     if (related.length === 0) {
//       const fallbackQuery = adminDb.collection("products").orderBy("createdAt", "desc").limit(limit).get();

//       const fallbackSnapshot = await fallbackQuery;
//       const fallbackProducts = fallbackSnapshot.docs
//         .map(doc => mapDocToProduct(doc))
//         .filter(product => product.id !== productId)
//         .slice(0, limit);

//       return { success: true as const, products: serializeProductArray(fallbackProducts) };
//     }

//     return { success: true as const, products: serializeProductArray(related) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error fetching related products";
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // LIKE A PRODUCT
// // ===================
// export async function likeProduct(userId: string, productId: string) {
//   try {
//     const now = Timestamp.now();
//     const likeRef = adminDb.collection("users").doc(userId).collection("likes").doc(productId);

//     await likeRef.set({
//       productId,
//       createdAt: now
//     });

//     return { success: true as const };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error liking product";
//     console.error("Error liking product:", message);
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // UNLIKE A PRODUCT
// // ===================
// export async function unlikeProduct(userId: string, productId: string) {
//   try {
//     const likeRef = adminDb.collection("users").doc(userId).collection("likes").doc(productId);
//     await likeRef.delete();
//     return { success: true as const };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error unliking product";
//     console.error("Error unliking product:", message);
//     return { success: false as const, error: message };
//   }
// }

// // ===================
// // GET LIKED PRODUCTS
// // ===================
// export async function getUserLikedProducts(userId: string) {
//   try {
//     const snapshot = await adminDb.collection("users").doc(userId).collection("likes").get();
//     const likedProductIds = snapshot.docs.map(doc => doc.id);

//     if (likedProductIds.length === 0) return { success: true as const, data: [] };

//     const productDocs = await Promise.all(likedProductIds.map(id => adminDb.collection("products").doc(id).get()));

//     const products = productDocs.filter(doc => doc.exists).map(doc => mapDocToProduct(doc));

//     return { success: true as const, data: serializeProductArray(products) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : (error as Error)?.message || "Unknown error fetching liked products";
//     console.error("Error fetching liked products:", message);
//     return { success: false as const, error: message };
//   }
// }
// ===============================
// 📂 src/firebase/admin/products.ts
// ===============================

// ================= Imports =================
import { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminStorage } from "@/firebase/admin/firebase-admin-init";
import type { DocumentData } from "firebase-admin/firestore";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import type { UpdateProductInput, Product, HeroSlide } from "@/types/product";
import { serializeProduct, serializeProductArray } from "@/utils/serializeProduct";
import { productSchema, updateProductSchema } from "@/schemas/product";
//import type { FirebaseFirestore } from "@firebase/firestore";

// Helper to map Firestore data to full Product type
function mapDocToProduct(doc: FirebaseFirestore.DocumentSnapshot): Product {
  const data = doc.data() ?? {};
  return {
    id: doc.id,

    // Basic Information
    name: data?.name,
    description: data?.description || "",
    details: data?.details || "",
    sku: data?.sku || "",
    barcode: data?.barcode || "",

    // Classification
    category: data.category || "",
    subcategory: data.subcategory || "",
    designThemes: data.designThemes || [],
    productType: data.productType || "",
    tags: data.tags || [],
    brand: data.brand || "",
    manufacturer: data.manufacturer || "",

    // Specifications
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

    // Media
    image: data?.image || "/placeholder.svg",
    additionalImages: data?.additionalImages || [],
    placements: data?.placements || [],

    // Pricing and Inventory
    price: data?.price || 0,
    salePrice: data?.salePrice || undefined,
    onSale: data?.onSale || false,
    costPrice: data?.costPrice || undefined,
    stockQuantity: data?.stockQuantity || undefined,
    lowStockThreshold: data?.lowStockThreshold || undefined,
    shippingClass: data?.shippingClass || "",

    // Status
    inStock: data?.inStock ?? true,
    badge: data?.badge || "",
    isFeatured: data?.isFeatured ?? false,
    isHero: data?.isHero ?? false,
    isLiked: data?.isLiked ?? false,
    isCustomizable: data?.isCustomizable ?? false,
    isNewArrival: data?.isNewArrival ?? false,

    // Metadata
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
}) {
  if (filters) {
    return await getFilteredProducts(filters);
  }

  try {
    const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();
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
export async function getFilteredProducts(filters: {
  category?: string;
  subcategory?: string;
  designThemes?: string[];
  productType?: string;
  material?: string;
  finish?: string;
  placements?: string[];
  priceRange?: string;
  isFeatured?: boolean;
  isCustomizable?: boolean;
  stickySide?: string;
  brand?: string;
  tags?: string[];
  onSale?: boolean;
  isNewArrival?: boolean;
  baseColor?: string;
}) {
  try {
    let query = adminDb.collection("products").orderBy("createdAt", "desc");

    // Apply basic filters
    if (filters.category) {
      query = query.where("category", "==", filters.category);
    }

    if (filters.subcategory) {
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

    if (filters.isCustomizable !== undefined) {
      query = query.where("isCustomizable", "==", filters.isCustomizable);
    }

    if (filters.isFeatured !== undefined) {
      query = query.where("isFeatured", "==", filters.isFeatured);
    }

    if (filters.onSale !== undefined) {
      query = query.where("onSale", "==", filters.onSale);
    }

    if (filters.isNewArrival !== undefined) {
      query = query.where("isNewArrival", "==", filters.isNewArrival);
    }

    // Price range filter
    if (filters.priceRange) {
      const priceRange = filters.priceRange.split("-");
      if (priceRange.length === 2) {
        query = query
          .where("price", ">=", Number.parseFloat(priceRange[0]))
          .where("price", "<=", Number.parseFloat(priceRange[1]));
      }
    }

    // Get initial results
    const snapshot = await query.get();
    let products = snapshot.docs.map(mapDocToProduct);

    // Apply array-based filters in memory (Firestore doesn't support array-contains-any with multiple conditions)
    if (filters.designThemes && filters.designThemes.length > 0) {
      products = products.filter(product => product.designThemes?.some(theme => filters.designThemes?.includes(theme)));
    }

    if (filters.placements && filters.placements.length > 0) {
      products = products.filter(product =>
        product.placements?.some(placement => filters.placements?.includes(placement))
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      products = products.filter(product => product.tags?.some(tag => filters.tags?.includes(tag)));
    }

    return { success: true as const, data: serializeProductArray(products) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching filtered products";
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
export async function addProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  try {
    /* ── quick sanity-check (ignores unknown keys) ─────────────── */
    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      console.error("❌ Invalid product data:", parsed.error.flatten());
      return { success: false as const, error: "Invalid product data" };
    }

    const now = Timestamp.now();

    /* ── write to Firestore ────────────────────────────────────── */
    const docRef = await adminDb.collection("products").add({
      ...data,
      createdAt: now,
      updatedAt: now
    });

    /* ── ensure a SKU exists ───────────────────────────────────── */
    const finalSku = data.sku ?? `SKU-${docRef.id.substring(0, 8).toUpperCase()}`; // generate simple SKU
    if (!data.sku) await docRef.update({ sku: finalSku });

    /* ── compose full product object for return ───────────────── */
    const fullProduct: Product = {
      id: docRef.id,
      ...data,
      sku: finalSku,
      inStock: data.inStock ?? true, // default when caller omits it
      createdAt: now,
      updatedAt: now
    };

    return {
      success: true as const,
      id: docRef.id,
      product: serializeProduct(fullProduct)
    };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error adding product";
    console.error("Error adding product:", message);
    return { success: false as const, error: message };
  }
}

// ===================
// GET PRODUCT BY ID
// ===================
export async function getProductById(id: string) {
  try {
    const doc = await adminDb.collection("products").doc(id).get();
    if (!doc.exists) return { success: false as const, error: "Product not found" };

    const product = mapDocToProduct(doc);
    return { success: true as const, product: serializeProduct(product) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching product by ID";
    return { success: false as const, error: message };
  }
}

// ===================
// UPDATE PRODUCT
// ===================
type SafeUpdateProductInput = Omit<UpdateProductInput, "id" | "createdAt">;

export async function updateProduct(id: string, updatedData: SafeUpdateProductInput) {
  try {
    // Log the incoming data with focus on the name field
    console.log(`Updating product ${id} with name: "${updatedData.name}"`);

    const parsed = updateProductSchema.safeParse(updatedData);

    if (!parsed.success) {
      console.error("❌ Invalid updated product data:", parsed.error.flatten());
      return { success: false as const, error: "Invalid product update data" };
    }

    // Log the parsed data to verify name is included
    console.log(`Parsed product data for ${id}:`, {
      name: parsed.data.name,
      price: parsed.data.price
      // Include other key fields you want to monitor
    });

    const docRef = adminDb.collection("products").doc(id);

    // Check if document exists before updating
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      console.error(`❌ Product ${id} not found before update`);
      return { success: false as const, error: "Product not found" };
    }

    // Log the current name before update
    const currentData = docSnapshot.data();
    console.log(`Current product name: "${currentData?.name}", updating to: "${parsed.data.name}"`);

    // Perform the update
    await docRef.update({
      ...parsed.data,
      updatedAt: Timestamp.now()
    });
    console.log(`✅ Update operation completed for product ${id}`);

    // Verify the update by getting the latest document
    const updatedDoc = await docRef.get();
    if (!updatedDoc.exists) {
      console.error(`❌ Product ${id} not found after update`);
      return { success: false as const, error: "Product not found after update" };
    }

    // Log the updated name to verify it changed
    const updatedProductData = updatedDoc.data();
    console.log(`Updated product name: "${updatedProductData?.name}"`);

    const product = mapDocToProduct(updatedDoc);
    console.log(`✅ Product mapped successfully, name: "${product.name}"`);

    return { success: true as const, product: serializeProduct(product) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error updating product";
    console.error("Error updating product:", message);
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
// GET NEW ARRIVALS
// ===================
export async function getNewArrivals(limit = 8) {
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
// GET ON SALE PRODUCTS
// ===================
export async function getOnSaleProducts(limit = 8) {
  try {
    const snapshot = await adminDb
      .collection("products")
      .where("onSale", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const products = snapshot.docs.map(mapDocToProduct);
    return { success: true as const, data: serializeProductArray(products) };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : (error as Error)?.message || "Unknown error fetching on sale products";
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
