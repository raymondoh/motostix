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

  // Return in the CategoryData format directly
  return Array.from(categoryMap.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count,
    // Set the icon property to the category ID - this will be used to look up the icon
    icon: id,
    // Also set the image path for fallback
    image: `/images/${id.toLowerCase()}.jpg`
  }));
}
