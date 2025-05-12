import type { Metadata } from "next";
import { getAllProducts } from "@/firebase/actions";
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
  const result = await getAllProducts();
  const products = result.success ? result.data : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Banner - Full width, outside of container */}
        <HeroBanner />

        {/* Featured Categories - Light background */}
        <FeaturedCategories />

        {/* Trending Products - Subtle background */}
        <ProductCarousel products={products} title="Trending Stickers" showTitle />

        {/* Sticker Grid Sections - Light background */}
        <StickerGridSections />

        {/* Testimonials - Subtle background (uncomment if needed) */}
        <TestimonialSection />

        {/* Promo Section - Light background */}
        <PromoSection />
      </main>
    </div>
  );
}
