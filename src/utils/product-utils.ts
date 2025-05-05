// import type { Product } from "@/types/product";
// import type { CategoryData } from "@/config/categories";

// export function extractCategoriesFromProducts(products: Product[]): CategoryData[] {
//   const categoryMap = new Map<string, { name: string; count: number; subcategories: Set<string> }>();

//   products.forEach(product => {
//     if (product.category) {
//       // Use the original category name for display
//       const categoryName = product.category;
//       // Create an ID from the category name
//       const categoryId = product.category.toLowerCase().replace(/\s+/g, "-");

//       if (!categoryMap.has(categoryId)) {
//         categoryMap.set(categoryId, {
//           name: categoryName,
//           count: 0,
//           subcategories: new Set()
//         });
//       }

//       const category = categoryMap.get(categoryId)!;
//       category.count++;

//       if (product.subcategory) {
//         category.subcategories.add(product.subcategory);
//       }
//     }
//   });

//   // Return in the CategoryData format directly
//   return Array.from(categoryMap.entries()).map(([id, { name, count }]) => ({
//     id,
//     name,
//     count,
//     // Set the icon property to the category ID - this will be used to look up the icon
//     icon: id,
//     // Also set the image path for fallback
//     image: `/images/${id.toLowerCase()}.jpg`
//   }));
// }
import type { Product } from "@/types/product";
import type { CategoryData } from "@/config/categories";

export function extractCategoriesFromProducts(products: Product[]): CategoryData[] {
  const categoryMap = new Map<string, { name: string; count: number; subcategories: Set<string> }>();

  products.forEach(product => {
    if (product.category) {
      // Use the original category name for display
      const categoryName = product.category;
      // Create an ID from the category name
      const categoryId = product.category.toLowerCase().replace(/\s+/g, "-");

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          name: categoryName,
          count: 0,
          subcategories: new Set()
        });
      }

      const category = categoryMap.get(categoryId)!;
      category.count++;

      if (product.subcategory) {
        category.subcategories.add(product.subcategory);
      }
    }
  });

  // Convert to array of CategoryData
  const categoriesArray = Array.from(categoryMap.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count,
    // Explicitly set the image path based on the category ID
    image: `/images/${id.toLowerCase()}.jpg`,
    // You can also set an icon property if you're using icon components
    icon: id.toLowerCase()
  }));

  // Define a custom sort order
  const customOrder = ["cars", "motorbikes", "bicycles", "evs", "other"];

  // Sort the categories based on the custom order
  // Categories not in the custom order will be placed at the end
  return categoriesArray.sort((a, b) => {
    const indexA = customOrder.indexOf(a.id.toLowerCase());
    const indexB = customOrder.indexOf(b.id.toLowerCase());

    // If both categories are in the custom order, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only a is in the custom order, it comes first
    if (indexA !== -1) {
      return -1;
    }

    // If only b is in the custom order, it comes first
    if (indexB !== -1) {
      return 1;
    }

    // If neither is in the custom order, sort alphabetically
    return a.name.localeCompare(b.name);
  });
}
