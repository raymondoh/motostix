// ===============================
// 📂 src/firebase/admin/products.ts
// ===============================

// ================= Imports =================
import { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminStorage } from "@/firebase/admin/firebase-admin-init";
import { DocumentData } from "firebase-admin/firestore";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import type {
  //GetProductByIdFromFirestoreResult,
  UpdateProductInput,
  //UpdateProductResult,
  Product,
  //SerializedProduct,
  HeroSlide
} from "@/types/product";
import { serializeProduct, serializeProductArray } from "@/utils/serializeProduct";
import { productSchema, updateProductSchema } from "@/schemas/product";

// Helper to map Firestore data to full Product type
function mapDocToProduct(doc: FirebaseFirestore.DocumentSnapshot): Product {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    name: data?.name,
    description: data?.description || "",
    details: data?.details || "",
    dimensions: data?.dimensions || "",
    material: data?.material || "",
    color: data?.color || "",
    baseColor: data?.baseColor || "",
    colorDisplayName: data?.colorDisplayName || "",
    stickySide: data?.stickySide || undefined,
    category: data.category || "",
    subcategory: data.subcategory || "", // ✅ NEW
    image: data?.image || "/placeholder.svg",
    price: data?.price,
    inStock: data?.inStock ?? true,
    badge: data?.badge || "",
    isFeatured: data?.isFeatured ?? false,
    isHero: data?.isHero ?? false,
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
  stickySide?: string;
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
// GET PRODUCTS WITH FILTERING
// ===================
export async function getFilteredProducts(filters: {
  category?: string;
  subcategory?: string;
  material?: string;
  priceRange?: string;
  isFeatured?: boolean;
  stickySide?: string;
}) {
  try {
    let query = adminDb.collection("products").orderBy("createdAt", "desc");

    if (filters.category) {
      query = query.where("category", "==", filters.category);
    }

    if (filters.subcategory) {
      query = query.where("subcategory", "==", filters.subcategory);
    }

    if (filters.material) {
      query = query.where("material", "==", filters.material);
    }

    if (filters.priceRange) {
      const priceRange = filters.priceRange.split("-");
      if (priceRange.length === 2) {
        query = query.where("price", ">=", parseFloat(priceRange[0])).where("price", "<=", parseFloat(priceRange[1]));
      }
    }

    if (filters.isFeatured !== undefined) {
      query = query.where("isFeatured", "==", filters.isFeatured);
    }

    if (filters.stickySide) {
      query = query.where("stickySide", "==", filters.stickySide);
    }

    const snapshot = await query.get();
    const products = snapshot.docs.map(mapDocToProduct);

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
export async function addProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  try {
    const parsed = productSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(data);
    if (!parsed.success) {
      console.error("❌ Invalid product data:", parsed.error.flatten());
      return { success: false as const, error: "Invalid product data" };
    }

    const now = Timestamp.now();
    const productData = { ...parsed.data, createdAt: now, updatedAt: now };
    const docRef = await adminDb.collection("products").add(productData);

    const fullProduct: Product = { id: docRef.id, ...productData };
    return { success: true as const, id: docRef.id, product: serializeProduct(fullProduct) };
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
    const parsed = updateProductSchema.safeParse(updatedData);

    if (!parsed.success) {
      console.error("❌ Invalid updated product data:", parsed.error.flatten());
      return { success: false as const, error: "Invalid product update data" };
    }

    const docRef = adminDb.collection("products").doc(id);
    console.log("Parsed update data:", parsed.data);

    await docRef.update({ ...parsed.data, updatedAt: Timestamp.now() });

    const updatedDoc = await docRef.get();
    if (!updatedDoc.exists) return { success: false as const, error: "Product not found after update" };

    const product = mapDocToProduct(updatedDoc);
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

    await docRef.delete();

    if (imageUrl) await deleteProductImage(imageUrl);

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
  limit?: number;
}

export async function getRelatedProducts({ productId, category, limit = 4 }: GetRelatedProductsParams) {
  try {
    // Start with a collection reference
    let query = adminDb.collection("products") as FirebaseFirestore.Query<DocumentData>;

    // If category is provided, apply the where clause
    if (category) {
      query = query.where("category", "==", category);
    }

    // Apply ordering and limit
    const snapshot = await query
      .orderBy("createdAt", "desc") // Ensure 'createdAt' is indexed
      .limit(limit + 1) // Fetch one more than the limit to remove the current product
      .get();

    const related = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Product))
      .filter(product => product.id !== productId) // Filter out the current product
      .slice(0, limit); // Ensure we only return up to the specified limit after filtering
    // If no products found in the same category, try without category filter
    if (related.length === 0 && category) {
      const fallbackQuery = adminDb.collection("products").orderBy("createdAt", "desc").limit(limit).get();

      const fallbackSnapshot = await fallbackQuery;
      const fallbackProducts = fallbackSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Product))
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
