import { NextResponse } from "next/server";
import { updateProduct } from "@/actions/products/update-product";
import { deleteProduct } from "@/actions/products/delete-product";
import { updateProductSchema } from "@/schemas/product";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// export async function DELETE(request: Request, { params }: any) {
//   try {
//     const productId = params.id;

//     if (!productId) {
//       return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
//     }

//     const result = await deleteProduct(productId);

//     if (!result.success) {
//       return NextResponse.json({ success: false, error: result.error }, { status: 400 });
//     }

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
export async function DELETE(request: Request, { params }: any) {
  try {
    // Check authentication using auth import
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const result = await deleteProduct(productId);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Revalidate relevant paths
    revalidatePath("/admin/products");
    revalidatePath("/products");

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API_DELETE_PRODUCT]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete product"
      },
      { status: 500 }
    );
  }
}
// export async function PUT(request: Request, { params }: any) {
//   try {
//     const productId = params.id;

//     if (!productId) {
//       return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
//     }

//     const body = await request.json();
//     console.log("Received update request for product:", productId);
//     console.log("Update data:", JSON.stringify(body, null, 2));

//     // Validate the request body against the schema
//     const validated = updateProductSchema.safeParse(body);

//     if (!validated.success) {
//       console.error("Validation error:", validated.error);
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Invalid product data: " + validated.error.message
//         },
//         { status: 400 }
//       );
//     }

//     const result = await updateProduct(productId, validated.data);
//     console.log("Update result:", result);

//     if (!result.success) {
//       return NextResponse.json({ success: false, error: result.error }, { status: 400 });
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("[API_UPDATE_PRODUCT]", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : "Failed to update product"
//       },
//       { status: 500 }
//     );
//   }
// }
export async function PUT(request: Request, { params }: any) {
  try {
    // Check authentication using auth import
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const body = await request.json();
    console.log("Received update request for product:", productId);
    console.log("Update data:", JSON.stringify(body, null, 2));

    // Log specifically for the name field
    if (body.name) {
      console.log(`Attempting to update product name to: "${body.name}"`);
    } else {
      console.log("No name field found in update request");
    }

    // Validate the request body against the schema
    const validated = updateProductSchema.safeParse(body);

    if (!validated.success) {
      console.error("Validation error:", validated.error);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product data: " + validated.error.message
        },
        { status: 400 }
      );
    }

    // Log the validated data, specifically checking for name
    if (validated.data.name) {
      console.log(`Validated product name: "${validated.data.name}"`);
    }

    const result = await updateProduct(productId, validated.data);
    console.log("Update result:", result);

    // Log the updated product name if available
    if (result.success && result.product) {
      console.log(`Product updated successfully. New name: "${result.product.name}"`);
    }

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Revalidate relevant paths to ensure UI updates
    revalidatePath("/admin/products");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/products");

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API_UPDATE_PRODUCT]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update product"
      },
      { status: 500 }
    );
  }
}
