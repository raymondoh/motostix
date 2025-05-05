// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/firebase/actions";
import type { ProductFilterOptions } from "@/types/product/filter";

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
