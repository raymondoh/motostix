// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, addProduct } from "@/firebase/actions";
//import type { ProductFilterOptions } from "@/types/product/filter";
import type { Product } from "@/types";
import { auth } from "@/auth";
import { logActivity } from "@/firebase/actions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Helper to get boolean from search params
    const getBooleanParam = (param: string | null): boolean | undefined => {
      if (param === null) return undefined;
      return param === "true";
    };

    // Helper to get array from comma-separated search params
    const getArrayParam = (param: string | null): string[] | undefined => {
      if (param === null) return undefined;
      return param
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
    };

    const filters: Product.ProductFilterOptions = {
      // Existing filters
      category: searchParams.get("category") || undefined,
      subcategory: searchParams.get("subcategory") || undefined,
      material: searchParams.get("material") || undefined,
      priceRange: searchParams.get("priceRange") || undefined,
      isFeatured: getBooleanParam(searchParams.get("isFeatured")),
      stickySide: searchParams.get("stickySide") || undefined,

      // Newly added filters from ProductFilterOptions
      designThemes: getArrayParam(searchParams.get("designThemes")),
      productType: searchParams.get("productType") || undefined,
      finish: searchParams.get("finish") || undefined,
      placements: getArrayParam(searchParams.get("placements")),
      isCustomizable: getBooleanParam(searchParams.get("isCustomizable")),
      brand: searchParams.get("brand") || undefined,
      tags: getArrayParam(searchParams.get("tags")),
      onSale: getBooleanParam(searchParams.get("onSale")),
      isNewArrival: getBooleanParam(searchParams.get("isNewArrival")),
      inStock: getBooleanParam(searchParams.get("inStock")),
      baseColor: searchParams.get("baseColor") || undefined
    };

    // Remove undefined keys to keep the filter object clean
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof Product.ProductFilterOptions] === undefined) {
        delete filters[key as keyof Product.ProductFilterOptions];
      }
    });

    const result = await getAllProducts(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/products:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST handler remains the same
// ... (your existing POST handler)
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const filters: Product.ProductFilterOptions = {
//       category: searchParams.get("category") || undefined,
//       subcategory: searchParams.get("subcategory") || undefined, // ✅ Added
//       material: searchParams.get("material") || undefined,
//       priceRange: searchParams.get("priceRange") || undefined,
//       isFeatured:
//         searchParams.get("isFeatured") === "true"
//           ? true
//           : searchParams.get("isFeatured") === "false"
//           ? false
//           : undefined,
//       stickySide: searchParams.get("stickySide") || undefined
//     };

//     const result = await getAllProducts(filters);
//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Error in /api/products:", error);
//     return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Check if we're getting a valid image URL
    if (!data.image || typeof data.image !== "string" || !data.image.startsWith("http")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product data",
          details: "A valid image URL is required"
        },
        { status: 400 }
      );
    }

    const result = await addProduct(data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Log activity if the logActivity function is available
    try {
      await logActivity({
        userId: session.user.id,
        type: "create_product",
        description: `Created product: ${data.name}`,
        status: "success",
        metadata: {
          productId: result.id,
          productName: data.name,
          price: data.price
        }
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
      // Continue execution even if logging fails
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
