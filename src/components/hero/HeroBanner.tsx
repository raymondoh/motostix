// src/components/hero/HeroBanner.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  className?: string;
}

export function HeroBanner({ className }: HeroBannerProps) {
  return (
    <section
      className={cn(
        "relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden bg-black",
        className
      )}>
      {/* Background image using next/image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-banner.jpg"
          alt="MotoStix Hero Banner"
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Make Your Ride Stand Out</h1>
        <p className="text-lg md:text-2xl mb-6 opacity-90">Premium decals & stickers for true riders.</p>
        <Button asChild size="lg" variant="secondary" className="text-black font-bold">
          <Link href="/products">Shop Now</Link>
        </Button>
      </div>
    </section>
  );
}
