import type { Metadata } from "next";
import { HeroBanner } from "@/components/hero/HeroBanner";
import { siteConfig } from "@/config/siteConfig";
import { FeaturedCategoriesStatic } from "@/components/sections/FeaturedCategoriesStatic";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { PromoSection } from "@/components/sections/PromoSection";
import StickerGridSectionsStatic from "@/components/sections/StickerGridSectionStatic";
import { TrendingStickersCarousel } from "@/components/sections/TrendingStickersCarousel";
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
    // This could be optimized further by creating a specific "featured products" query
    // For now, we'll get a small sample instead of ALL products
    const result = await getAllProducts({ limit }); // You'd need to add limit support to getAllProducts
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

        {/* Featured Categories - Now static, no Firebase calls */}
        <FeaturedCategoriesStatic />

        {/* Trending Products - Small targeted query instead of filtering all products */}
        {featuredProducts.length > 0 && (
          <TrendingStickersCarousel
            products={featuredProducts}
            title="Trending Stickers"
            showTitle
            viewAllUrl="/products"
          />
        )}

        {/* Sticker Grid Sections - Now static, no Firebase calls */}
        <StickerGridSectionsStatic />

        {/* Testimonials - Already static */}
        <TestimonialSection />

        {/* Promo Section - Already static */}
        <PromoSection />
      </main>
    </div>
  );
}
