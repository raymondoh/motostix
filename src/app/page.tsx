import type { Metadata } from "next";
import { getAllProducts } from "@/firebase/actions";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { HeroBanner } from "@/components/hero/HeroBanner";
import { siteConfig } from "@/config/siteConfig";
import { Footer } from "@/components/footer/footer";
import { FeaturedCategories } from "@/components/sections/FeaturedCategories";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { PromoSection } from "@/components/sections/PromoSection";

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
        <HeroBanner />

        <div className="container py-10">
          <h2 className="text-4xl font-bold mb-6 text-center">Welcome to MotoStix!</h2>
          <p className="text-muted-foreground text-center mb-12">
            Your ultimate destination for premium motorcycle decals and stickers.
          </p>

          <ProductCarousel
            products={products}
            title="Our Stickers Collection"
            showTitle
            itemsPerView={{ sm: 1, md: 2, lg: 3, xl: 4 }}
            className="mt-8"
          />
        </div>

        {/* Featured Categories Section */}
        <FeaturedCategories />

        {/* Promotional Banner */}
        <PromoSection />

        {/* Testimonials Section */}
        <TestimonialSection />
      </main>
    </div>
  );
}
