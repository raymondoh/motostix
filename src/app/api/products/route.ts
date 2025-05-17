// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, addProduct } from "@/firebase/actions";
import type { ProductFilterOptions } from "@/types/product/filter";
import { auth } from "@/auth";
import { logActivity } from "@/firebase/actions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters: ProductFilterOptions = {
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

    // Note: We don't need to set the SKU here
    // The SKU will be auto-generated in the addProduct function if not provided

    const result = await addProduct(data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Log activity if the logActivity function is available
    try {
      await logActivity({
        userId: session.user.id,
        type: "create", // Changed from 'action' to 'actionType'
        resourceType: "product",
        resourceId: result.id,
        details: `Created product: ${data.name}`
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
