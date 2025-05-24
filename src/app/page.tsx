import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { siteConfig } from "@/config/siteConfig";
import { CategoriesStatic } from "@/components/sections/CategoriesStatic";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { PromoSection } from "@/components/sections/PromoSection";
import StickerGridSectionStatic from "@/components/sections/StickerGridSectionStatic";
import { ProductCarousel } from "@/components/sections/ProductCarousel";
import { getAllProducts } from "@/firebase/actions";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Main Value Proposition`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} - Main Value Proposition`,
    description: siteConfig.description,
    type: "website"
  }
};

// Helper function to get a small sample of products for carousels
async function getFeaturedProducts(limit = 8) {
  try {
    const result = await getAllProducts({ limit });
    return result.success ? result.data?.slice(0, limit) || [] : [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function HomePage() {
  // Only fetch a small number of products for the carousel instead of ALL products
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Banner - Full width, outside of container */}
        <HeroBanner />

        {/* Featured Categories - Left-aligned with action */}
        <CategoriesStatic />

        {/* Trending Products - Left-aligned with action */}
        {featuredProducts.length > 0 && (
          <ProductCarousel
            products={featuredProducts}
            title="Trending Stickers"
            description="Discover the most popular designs loved by our community"
            viewAllUrl="/products?sort=trending"
            centered={false}
          />
        )}

        {/* Sticker Grid Sections - Left-aligned with actions */}
        <StickerGridSectionStatic />

        {/* Featured Products - Left-aligned with action */}
        {featuredProducts.length > 0 && (
          <ProductCarousel
            products={featuredProducts.slice(0, 4)}
            title="Featured Collection"
            description="Hand-picked premium designs that showcase the best of MotoStix craftsmanship"
            viewAllUrl="/products?featured=true"
            centered={false}
          />
        )}

        {/* Testimonials - Already static */}
        <TestimonialSection />

        {/* Promo Section - Already static */}
        <PromoSection />
      </main>
    </div>
  );
}
