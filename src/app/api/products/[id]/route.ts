// import { NextResponse, NextRequest } from "next/server";
// import { updateProduct } from "@/actions";
// import { deleteProduct } from "@/actions";
// import { updateProductSchema } from "@/schemas/product";
// import { revalidatePath } from "next/cache";
// import { logActivity } from "@/firebase/actions";
// import { auth } from "@/auth";

// export async function DELETE(request: Request, { params }: any) {
//   try {
//     // Check authentication using auth import
//     const session = await auth();
//     if (!session || !session.user) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
//     }

//     const productId = params.id;

//     if (!productId) {
//       return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
//     }

//     const result = await deleteProduct(productId);

//     if (!result.success) {
//       return NextResponse.json({ success: false, error: result.error }, { status: 400 });
//     }

//     // Log activity
//     try {
//       await logActivity({
//         userId: session.user.id,
//         type: "delete_product",
//         description: `Deleted product with ID: ${productId}`,
//         status: "success",
//         metadata: {
//           productId
//         }
//       });
//     } catch (logError) {
//       console.error("Failed to log activity:", logError);
//     }

//     // Revalidate relevant paths
//     revalidatePath("/admin/products");
//     revalidatePath("/products");

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("[API_DELETE_PRODUCT]", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : "Failed to delete product"
//       },
//       { status: 500 }
//     );
//   }
// }

// // export async function PUT(request: Request, { params }: any) {
// //   try {
// //     // Check authentication using auth import
// //     const session = await auth();
// //     if (!session || !session.user) {
// //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
// //     }

// //     const productId = params.id;

// //     if (!productId) {
// //       return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
// //     }

// //     const body = await request.json();
// //     console.log("Received update request for product:", productId);
// //     console.log("Update data:", JSON.stringify(body, null, 2));

// //     // Log specifically for the name field
// //     if (body.name) {
// //       console.log(`Attempting to update product name to: "${body.name}"`);
// //     } else {
// //       console.log("No name field found in update request");
// //     }

// //     // Validate the request body against the schema
// //     const validated = updateProductSchema.safeParse(body);

// //     if (!validated.success) {
// //       console.error("Validation error:", validated.error);
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           error: "Invalid product data: " + validated.error.message
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // Log the validated data, specifically checking for name
// //     if (validated.data.name) {
// //       console.log(`Validated product name: "${validated.data.name}"`);
// //     }

// //     const result = await updateProduct(productId, validated.data);
// //     console.log("Update result:", result);

// //     // Log the updated product name if available
// //     if (result.success && result.product) {
// //       console.log(`Product updated successfully. New name: "${result.product.name}"`);

// //       // Log activity
// //       try {
// //         await logActivity({
// //           userId: session.user.id,
// //           type: "update_product",
// //           description: `Updated product: ${result.product.name}`,
// //           status: "success",
// //           metadata: {
// //             productId,
// //             updatedFields: Object.keys(validated.data)
// //           }
// //         });
// //       } catch (logError) {
// //         console.error("Failed to log activity:", logError);
// //       }
// //     }

// //     if (!result.success) {
// //       return NextResponse.json({ success: false, error: result.error }, { status: 400 });
// //     }

// //     // Revalidate relevant paths to ensure UI updates
// //     revalidatePath("/admin/products");
// //     revalidatePath(`/products/${productId}`);
// //     revalidatePath("/products");

// //     return NextResponse.json(result);
// //   } catch (error) {
// //     console.error("[API_UPDATE_PRODUCT]", error);
// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error: error instanceof Error ? error.message : "Failed to update product"
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }
// export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     // Await params for Next.js 15 compatibility
//     const { id } = await params;
//     console.log("🔧 PUT /api/products/[id] - Starting update for product:", id);

//     const session = await auth();
//     if (!session?.user) {
//       console.log("❌ Unauthorized - no session");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     let data: any;
//     try {
//       data = await request.json();
//       console.log("📝 Update data received:", JSON.stringify(data, null, 2));
//     } catch (parseError) {
//       console.error("❌ Failed to parse request JSON:", parseError);
//       return NextResponse.json(
//         {
//           error: "Invalid JSON in request body",
//           details: parseError instanceof Error ? parseError.message : "Unknown parse error"
//         },
//         { status: 400 }
//       );
//     }

//     // Specifically log the sale-related fields
//     console.log("🏷️ Sale fields:", {
//       onSale: data.onSale,
//       salePrice: data.salePrice,
//       price: data.price
//     });

//     // Call updateProduct directly with raw data
//     console.log("🚀 Calling updateProduct with data");
//     const result = await updateProduct(id, data);
//     console.log("💾 Update result:", result);

//     if (!result.success) {
//       console.log("❌ Update failed:", result.error);
//       return NextResponse.json(
//         {
//           error: result.error || "Unknown update error",
//           productId: id,
//           timestamp: new Date().toISOString()
//         },
//         { status: 400 }
//       );
//     }

//     // Log activity if available
//     try {
//       const { logActivity } = await import("@/firebase/actions");
//       await logActivity({
//         userId: session.user.id,
//         type: "update_product",
//         description: `Updated product: ${data.name}`,
//         status: "success",
//         metadata: {
//           productId: id,
//           productName: data.name,
//           onSale: data.onSale,
//           salePrice: data.salePrice
//         }
//       });
//     } catch (logError) {
//       console.error("Failed to log activity:", logError);
//       // Continue execution even if logging fails
//     }

//     // Revalidate paths here in the API route
//     try {
//       const { revalidatePath } = await import("next/cache");
//       revalidatePath("/admin/products");
//       revalidatePath(`/admin/products/${id}`);
//       revalidatePath("/products");
//       revalidatePath("/");
//     } catch (revalidateError) {
//       console.error("Failed to revalidate paths:", revalidateError);
//       // Continue execution even if revalidation fails
//     }

//     console.log("✅ Product update successful");
//     return NextResponse.json({
//       success: true,
//       data: result.data,
//       productId: id,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     console.error("💥 [PUT /api/products/[id]] Unexpected error:", error);

//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     const errorDetails = {
//       error: errorMessage,
//       timestamp: new Date().toISOString(),
//       productId: "unknown",
//       stack: error instanceof Error ? error.stack : undefined
//     };

//     try {
//       const { id } = await params;
//       errorDetails.productId = id;
//     } catch (paramError) {
//       console.error("Could not get product ID from params:", paramError);
//     }

//     return NextResponse.json(errorDetails, { status: 500 });
//   }
// }

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { getProductById } = await import("@/firebase/admin/products");
//     const result = await getProductById(params.id);

//     if (!result.success) {
//       return NextResponse.json({ error: result.error }, { status: 404 });
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("[GET /api/products/[id]]", error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "An unknown error occurred" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse, type NextRequest } from "next/server";
import { updateProduct, deleteProduct } from "@/actions";
import { productUpdateSchema } from "@/schemas/product";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/firebase/actions";
import { auth } from "@/auth";

// GET - Fetch a single product by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params;

    const { getProductById } = await import("@/firebase/admin/products");
    const result = await getProductById(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/products/[id]]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch product"
      },
      { status: 500 }
    );
  }
}

// PUT - Update a product
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params;
    console.log("🔧 PUT /api/products/[id] - Starting update for product:", id);

    // Check authentication
    const session = await auth();
    if (!session?.user) {
      console.log("❌ Unauthorized - no session");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission (admin only for product updates)
    if (session.user.role !== "admin") {
      console.log("❌ Forbidden - user is not admin");
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
      console.log("📝 Update data received:", JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error("❌ Failed to parse request JSON:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          details: parseError instanceof Error ? parseError.message : "Unknown parse error"
        },
        { status: 400 }
      );
    }

    // Log specific fields for debugging
    if (body.name) {
      console.log(`📝 Attempting to update product name to: "${body.name}"`);
    }

    console.log("🏷️ Sale fields:", {
      onSale: body.onSale,
      salePrice: body.salePrice,
      price: body.price
    });

    // Validate the request body against the schema
    const validated = productUpdateSchema.safeParse(body);

    if (!validated.success) {
      console.error("❌ Validation error:", validated.error);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product data",
          validationErrors: validated.error.errors,
          details: validated.error.message
        },
        { status: 400 }
      );
    }

    // Log the validated data
    if (validated.data.name) {
      console.log(`✅ Validated product name: "${validated.data.name}"`);
    }

    // Update the product
    console.log("🚀 Calling updateProduct with validated data");
    const result = await updateProduct(id, validated.data);
    console.log("💾 Update result:", result);

    if (!result.success) {
      console.log("❌ Update failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to update product",
          productId: id,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Log the successful update
    if (result.success && result.product) {
      console.log(`✅ Product updated successfully. New name: "${result.product.name}"`);
    }

    // Log activity for audit trail
    try {
      await logActivity({
        userId: session.user.id,
        type: "update_product",
        description: `Updated product: ${validated.data.name || "Unknown"}`,
        status: "success",
        metadata: {
          productId: id,
          productName: validated.data.name,
          updatedFields: Object.keys(validated.data),
          onSale: validated.data.onSale,
          salePrice: validated.data.salePrice
        }
      });
    } catch (logError) {
      console.error("⚠️ Failed to log activity:", logError);
      // Continue execution even if logging fails
    }

    // Revalidate relevant paths to ensure UI updates
    try {
      revalidatePath("/admin/products");
      revalidatePath(`/admin/products/${id}`);
      revalidatePath(`/products/${id}`);
      revalidatePath("/products");
      revalidatePath("/"); // Home page might show featured products
    } catch (revalidateError) {
      console.error("⚠️ Failed to revalidate paths:", revalidateError);
      // Continue execution even if revalidation fails
    }

    console.log("✅ Product update completed successfully");
    return NextResponse.json({
      success: true,
      product: result.product,
      productId: id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("💥 [PUT /api/products/[id]] Unexpected error:", error);

    // Prepare error response
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const errorDetails = {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      productId: "unknown",
      ...(process.env.NODE_ENV === "development" && {
        stack: error instanceof Error ? error.stack : undefined
      })
    };

    // Try to get product ID for error logging
    try {
      const { id } = await params;
      errorDetails.productId = id;
    } catch (paramError) {
      console.error("Could not get product ID from params:", paramError);
    }

    // Log activity for failed update
    try {
      const session = await auth();
      if (session?.user) {
        await logActivity({
          userId: session.user.id,
          type: "update_product",
          description: `Failed to update product: ${errorMessage}`,
          status: "error",
          metadata: {
            productId: errorDetails.productId,
            error: errorMessage
          }
        });
      }
    } catch (logError) {
      console.error("Failed to log error activity:", logError);
    }

    return NextResponse.json(errorDetails, { status: 500 });
  }
}

// DELETE - Remove a product
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params;
    console.log("🗑️ DELETE /api/products/[id] - Starting deletion for product:", id);

    // Check authentication
    const session = await auth();
    if (!session?.user) {
      console.log("❌ Unauthorized - no session");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission (admin only for product deletion)
    if (session.user.role !== "admin") {
      console.log("❌ Forbidden - user is not admin");
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    // Delete the product
    const result = await deleteProduct(id);

    if (!result.success) {
      console.log("❌ Delete failed:", result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Log activity for audit trail
    try {
      await logActivity({
        userId: session.user.id,
        type: "delete_product",
        description: `Deleted product with ID: ${id}`,
        status: "success",
        metadata: {
          productId: id
        }
      });
    } catch (logError) {
      console.error("⚠️ Failed to log activity:", logError);
      // Continue execution even if logging fails
    }

    // Revalidate relevant paths
    try {
      revalidatePath("/admin/products");
      revalidatePath("/products");
      revalidatePath("/"); // Home page might show featured products
    } catch (revalidateError) {
      console.error("⚠️ Failed to revalidate paths:", revalidateError);
      // Continue execution even if revalidation fails
    }

    console.log("✅ Product deletion completed successfully");
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      productId: id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("💥 [DELETE /api/products/[id]] Unexpected error:", error);

    // Prepare error response
    const errorMessage = error instanceof Error ? error.message : "Failed to delete product";
    const errorDetails = {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      productId: "unknown",
      ...(process.env.NODE_ENV === "development" && {
        stack: error instanceof Error ? error.stack : undefined
      })
    };

    // Try to get product ID for error logging
    try {
      const { id } = await params;
      errorDetails.productId = id;
    } catch (paramError) {
      console.error("Could not get product ID from params:", paramError);
    }

    // Log activity for failed deletion
    try {
      const session = await auth();
      if (session?.user) {
        await logActivity({
          userId: session.user.id,
          type: "delete_product",
          description: `Failed to delete product: ${errorMessage}`,
          status: "error",
          metadata: {
            productId: errorDetails.productId,
            error: errorMessage
          }
        });
      }
    } catch (logError) {
      console.error("Failed to log error activity:", logError);
    }

    return NextResponse.json(errorDetails, { status: 500 });
  }
}
