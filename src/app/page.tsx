import type { Metadata } from "next";
import { getAllProducts } from "@/firebase/actions";
import { getCategories } from "@/actions/categories/get-categories";
import { ProductCarousel } from "@/components/sections/ProductCarousel";
import { HeroBanner } from "@/components/hero/HeroBanner";
import { siteConfig } from "@/config/siteConfig";
import { FeaturedCategories } from "@/components/sections/FeaturedCategories";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { PromoSection } from "@/components/sections/PromoSection";
import StickerGridSections from "@/components/sections/StickerGridSections";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Main Value Proposition`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} - Main Value Proposition`,
    description: siteConfig.description,
    type: "website"
  }
};

export default async function HomePage() {
  // Fetch all products
  const result = await getAllProducts();
  const allProducts = result.success ? result.data : [];

  // Fetch categories
  const categoriesResult = await getCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];

  // Get featured products (products marked as featured or new arrivals)
  const featuredProducts = allProducts.filter(product => product.isFeatured || product.isNewArrival);

  // Get trending products (could be based on sales, views, or just a selection)
  // For now, we'll just use the most recent products as "trending"
  const trendingProducts = [...allProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Find specific category products if needed
  const bikeCategory = categories.find(
    cat =>
      cat.name.toLowerCase().includes("bike") ||
      cat.name.toLowerCase().includes("motorcycle") ||
      cat.slug?.includes("bike")
  );

  const bikeProducts = bikeCategory ? allProducts.filter(product => product.category === bikeCategory.name) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Banner - Full width, outside of container */}
        <HeroBanner />

        {/* Featured Categories - Light background */}
        <FeaturedCategories />

        {/* Trending Products - Subtle background */}
        <ProductCarousel products={trendingProducts} title="Trending Stickers" showTitle viewAllUrl="/products" />

        {/* Sticker Grid Sections - Light background */}
        <StickerGridSections />

        {/* Bike Products - If we have a bike category */}
        {bikeProducts.length > 0 && (
          <ProductCarousel
            products={bikeProducts}
            title={`${bikeCategory?.name || "Bike"} Collection`}
            description="Premium stickers designed specifically for motorcycle enthusiasts."
            viewAllUrl={bikeCategory ? `/products?category=${bikeCategory.id}` : "/products?type=bike"}
            className="bg-background"
          />
        )}

        {/* Featured Products - If we have any */}
        {featuredProducts.length > 0 && (
          <ProductCarousel
            products={featuredProducts}
            title="Featured Products"
            description="Our hand-picked selection of premium stickers and decals."
            viewAllUrl="/products?featured=true"
          />
        )}

        {/* Testimonials - Subtle background */}
        <TestimonialSection />

        {/* Promo Section - Light background */}
        <PromoSection />
      </main>
    </div>
  );
}
