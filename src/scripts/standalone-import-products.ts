import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

// Sample products data
const sampleProducts = [
  {
    // Basic Information
    name: "Cosmic Galaxy Vinyl Decal for Cars",
    description: "A vibrant cosmic galaxy design perfect for car windows, bumpers, and body panels.",
    details:
      "This premium vinyl decal features a stunning cosmic galaxy design with vibrant purples, blues, and pinks. Waterproof and UV-resistant for long-lasting color.",
    sku: "DCL-COSMIC-001",
    barcode: "7891234567890",

    // Classification - CORRECTED to match your categories
    category: "Cars",
    subcategory: "Luxury Cars",
    designThemes: ["Space", "Galaxy", "Abstract"],
    productType: "Die-Cut Decal",
    tags: ["Waterproof", "Durable", "Colorful", "Space"],
    brand: "MotoStix",
    manufacturer: "Premium Vinyl Co.",

    // Specifications
    dimensions: "10 x 10 inches",
    weight: "0.05 lbs",
    shippingWeight: "0.1 lbs",
    material: "Vinyl",
    finish: "Glossy",
    color: "#5B3E96",
    baseColor: "purple",
    colorDisplayName: "Cosmic Purple",
    stickySide: "Back",
    size: "Medium",

    // Media
    image: "/placeholder-zk3dj.png",
    additionalImages: ["/placeholder-fcxlp.png", "/placeholder-0qw08.png"],
    placements: ["Window", "Bumper", "Body Panel"],

    // Pricing and Inventory
    price: 14.99,
    salePrice: 11.99,
    onSale: true,
    costPrice: 4.25,
    stockQuantity: 250,
    lowStockThreshold: 50,
    shippingClass: "Standard",

    // Status
    inStock: true,
    badge: "Sale",
    isFeatured: true,
    isHero: true,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: false
  }
];

// Initialize Firebase Admin
// You'll need to provide your own service account key
const serviceAccountPath = path.join(process.cwd(), "service-account-key.json");

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

  // Initialize the app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  process.exit(1);
}

async function importSampleProducts() {
  console.log("Starting import of sample products...");
  const db = admin.firestore();

  try {
    const batch = db.batch();
    const productsRef = db.collection("products");
    const now = admin.firestore.Timestamp.now();

    for (const product of sampleProducts) {
      const docRef = productsRef.doc(); // Auto-generate ID
      const productWithTimestamps = {
        ...product,
        id: docRef.id,
        createdAt: now,
        updatedAt: now
      };

      batch.set(docRef, productWithTimestamps);
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
    }

    await batch.commit();
    console.log("Successfully imported all sample products!");
  } catch (error) {
    console.error("Error importing sample products:", error);
  } finally {
    // Exit the process when done
    process.exit(0);
  }
}

// Execute the import function
importSampleProducts();
