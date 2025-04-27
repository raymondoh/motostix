// import { Timestamp } from "firebase-admin/firestore";
// import { adminDb, adminStorage } from "@/firebase/admin/firebase-admin-init";
// import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
// import type {
//   GetProductByIdFromFirestoreResult,
//   UpdateProductInput,
//   UpdateProductResult,
//   Product,
//   SerializedProduct,
//   HeroSlide
// } from "@/types/product";
// import { serializeProduct, serializeProductArray } from "@/utils/serializeProduct";
// import { productSchema } from "@/schemas/product";

// // ===================
// // GET ALL PRODUCTS
// // ===================
// export async function getAllProducts(): Promise<
//   { success: true; data: Product[] } | { success: false; error: string }
// > {
//   try {
//     const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();

//     const products: Product[] = snapshot.docs.map(doc => {
//       const data = doc.data();

//       return {
//         id: doc.id,
//         name: data.name,
//         description: data.description || "",
//         image: data.image || "/placeholder.svg",
//         price: data.price,
//         inStock: data.inStock ?? true,
//         badge: data.badge || "",
//         isFeatured: data.isFeatured ?? false,
//         isHero: data.isHero ?? false,
//         createdAt: data.createdAt,
//         updatedAt: data.updatedAt
//       };
//     });

//     return { success: true, data: serializeProductArray(products) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error fetching products";
//     return { success: false, error: message };
//   }
// }

// // ===================
// // ADD PRODUCT
// // ===================
// export async function addProduct(
//   data: Omit<Product, "id" | "createdAt" | "updatedAt">
// ): Promise<{ success: true; id: string; product: SerializedProduct } | { success: false; error: string }> {
//   try {
//     const parsed = productSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(data);

//     if (!parsed.success) {
//       console.error("❌ Invalid product data:", parsed.error.flatten());
//       return { success: false, error: "Invalid product data" };
//     }

//     const now = Timestamp.now();
//     const productData = {
//       ...parsed.data,
//       createdAt: now,
//       updatedAt: now
//     };

//     const docRef = await adminDb.collection("products").add(productData);

//     const fullProduct: Product = {
//       id: docRef.id,
//       ...productData
//     };

//     return {
//       success: true,
//       id: docRef.id,
//       product: serializeProduct(fullProduct)
//     };
//   } catch (error: unknown) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error adding product";

//     console.error("Error adding product:", message);
//     return { success: false, error: message };
//   }
// }

// // ===================
// // GET PRODUCT BY ID
// // ===================
// export async function getProductById(id: string): Promise<GetProductByIdFromFirestoreResult> {
//   try {
//     const docRef = adminDb.collection("products").doc(id);
//     const doc = await docRef.get();

//     if (!doc.exists) {
//       return { success: false, error: "Product not found" };
//     }

//     const data = doc.data();

//     const product: Product = {
//       id: doc.id,
//       name: data?.name,
//       description: data?.description || "",
//       image: data?.image || "/placeholder.svg",
//       price: data?.price,
//       inStock: data?.inStock ?? true,
//       badge: data?.badge || "",
//       isFeatured: data?.isFeatured ?? false,
//       isHero: data?.isHero ?? false,
//       createdAt: data?.createdAt,
//       updatedAt: data?.updatedAt
//     };

//     return { success: true, product: serializeProduct(product) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error fetching product by ID";
//     return { success: false, error: message };
//   }
// }

// // ===================
// // UPDATE PRODUCT
// // ===================
// type SafeUpdateProductInput = Omit<UpdateProductInput, "id" | "createdAt">;

// export async function updateProduct(id: string, updatedData: SafeUpdateProductInput): Promise<UpdateProductResult> {
//   try {
//     const parsed = productSchema.partial().omit({ id: true, createdAt: true }).safeParse(updatedData);

//     if (!parsed.success) {
//       console.error("❌ Invalid updated product data:", parsed.error.flatten());
//       return { success: false, error: "Invalid product update data" };
//     }

//     const docRef = adminDb.collection("products").doc(id);

//     await docRef.update({
//       ...parsed.data,
//       updatedAt: Timestamp.now()
//     });

//     const updatedDoc = await docRef.get();
//     if (!updatedDoc.exists) {
//       return { success: false, error: "Product not found after update" };
//     }

//     const data = updatedDoc.data()!;
//     const fullProduct: Product = {
//       id: updatedDoc.id,
//       name: data.name,
//       description: data.description || "",
//       image: data.image || "/placeholder.svg",
//       price: data.price,
//       inStock: data.inStock ?? true,
//       badge: data.badge || "",
//       isFeatured: data.isFeatured ?? false,
//       isHero: data.isHero ?? false,
//       createdAt: data.createdAt,
//       updatedAt: data.updatedAt
//     };

//     return {
//       success: true,
//       product: serializeProduct(fullProduct)
//     };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error updating product";

//     console.error("Error updating product:", message);
//     return { success: false, error: message };
//   }
// }

// // ===================
// // DELETE PRODUCT
// // ===================
// export async function deleteProduct(productId: string): Promise<{ success: true } | { success: false; error: string }> {
//   try {
//     const docRef = adminDb.collection("products").doc(productId);
//     const docSnap = await docRef.get();

//     if (!docSnap.exists) {
//       return { success: false, error: "Product not found" };
//     }

//     const data = docSnap.data();
//     const imageUrl = data?.image;

//     // Delete product from Firestore
//     await docRef.delete();

//     // Delete image if present
//     if (imageUrl) {
//       await deleteProductImage(imageUrl);
//     }

//     return { success: true };
//   } catch (error: unknown) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error deleting product";

//     console.error("Error deleting product:", message);
//     return { success: false, error: message };
//   }
// }

// // ===================
// // DELETE PRODUCT IMAGE
// // ===================
// export async function deleteProductImage(
//   imageUrl: string
// ): Promise<{ success: true } | { success: false; error: string }> {
//   try {
//     const bucket = adminStorage.bucket();

//     const url = new URL(imageUrl);
//     const fullPath = url.pathname.slice(1);

//     const bucketName = bucket.name;
//     const storagePath = fullPath.replace(`${bucketName}/`, "");

//     const file = bucket.file(storagePath);
//     await file.delete();

//     return { success: true };
//   } catch (error: unknown) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error deleting image";

//     console.error("❌ Error deleting image:", message);
//     return { success: false, error: message };
//   }
// }

// // ===================
// // GET FEATURED PRODUCTS
// // ===================
// export async function getFeaturedProducts(): Promise<
//   { success: true; data: Product[] } | { success: false; error: string }
// > {
//   try {
//     const snapshot = await adminDb.collection("products").where("isFeatured", "==", true).get();

//     const products: Product[] = snapshot.docs.map(doc => {
//       const data = doc.data();

//       return {
//         id: doc.id,
//         name: data.name,
//         description: data.description || "",
//         image: data.image || "/placeholder.svg",
//         price: data.price,
//         inStock: data.inStock ?? true,
//         badge: data.badge || "",
//         isFeatured: data.isFeatured ?? false,
//         isHero: data.isHero ?? false,
//         createdAt: data.createdAt,
//         updatedAt: data.updatedAt
//       };
//     });

//     return { success: true, data: serializeProductArray(products) };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error fetching featured products";
//     return { success: false, error: message };
//   }
// }

// // ===================
// // GET HERO SLIDES
// // ===================
// export async function getHeroSlidesFromFirestore(): Promise<
//   { success: true; data: HeroSlide[] } | { success: false; error: string }
// > {
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

//     return { success: true, data: slides };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//       ? error.message
//       : "Unknown error fetching hero slides";
//     return { success: false, error: message };
//   }
// }
import { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminStorage } from "@/firebase/admin/firebase-admin-init";
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
import { productSchema } from "@/schemas/product";

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
    stickySide: data?.stickySide || undefined, // "Front" | "Back" | undefined
    category: data.category || "",
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
export async function getAllProducts() {
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
    const parsed = productSchema.partial().omit({ id: true, createdAt: true }).safeParse(updatedData);
    if (!parsed.success) {
      console.error("❌ Invalid updated product data:", parsed.error.flatten());
      return { success: false as const, error: "Invalid product update data" };
    }

    const docRef = adminDb.collection("products").doc(id);
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
