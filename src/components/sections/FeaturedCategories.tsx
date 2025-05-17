import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "@/actions/categories/get-categories";
import { CategoryImage } from "@/components/sections/CategoryImage";
import type { CategoryData } from "@/config/categories"; // Import the correct type

export async function FeaturedCategories() {
  // Fetch categories from the backend
  const categoriesResult = await getCategories();
  const allCategories: CategoryData[] = categoriesResult.success ? categoriesResult.data || [] : [];

  // Select featured categories (either the first 4 or specific ones you want to highlight)
  // Using properties that exist in the CategoryData type
  const featuredCategories = allCategories
    .filter(category => category.image || category.count > 0) // Filter based on available properties
    .slice(0, 4); // Limit to 4 categories

  return (
    <section className="py-16 w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Shop By Category</h2>
          <div className="w-12 h-0.5 bg-primary mb-6"></div>
          <p className="text-muted-foreground text-center max-w-2xl">
            Browse our extensive collection of high-quality decals and stickers for every type of motorcycle and
            vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.length === 0 ? (
            <p className="text-center col-span-full text-muted-foreground">No categories available</p>
          ) : (
            featuredCategories.map(category => (
              <Link href={`/products?category=${category.id}`} key={category.id}>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-sm hover:border-primary/20 group h-full">
                  <div className="relative h-48 w-full overflow-hidden">
                    <CategoryImage
                      src={category.image || `/placeholder.svg?height=400&width=600&query=motorcycle+sticker`}
                      alt={category.name}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <span className="text-sm px-2 py-1 rounded-full bg-secondary/10 text-primary font-medium">
                        {category.count || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* View All Categories button - link text */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-block rounded-full bg-black text-white dark:bg-white dark:text-black px-10 py-4 text-lg font-medium hover:bg-black/90 dark:hover:bg-white/90 transition-colors">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
