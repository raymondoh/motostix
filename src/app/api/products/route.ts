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

    const filters: Product.ProductFilterOptions = {
      category: searchParams.get("category") || undefined,
      subcategory: searchParams.get("subcategory") || undefined, // ✅ Added
      material: searchParams.get("material") || undefined,
      priceRange: searchParams.get("priceRange") || undefined,
      isFeatured:
        searchParams.get("isFeatured") === "true"
          ? true
          : searchParams.get("isFeatured") === "false"
          ? false
          : undefined,
      stickySide: searchParams.get("stickySide") || undefined
    };

    const result = await getAllProducts(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/products:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

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
