"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface HeroBannerProps {
  className?: string;
}

export function HeroBanner({ className }: HeroBannerProps) {
  return (
    <section
      className={cn(
        "relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-black",
        className
      )}>
      {/* Background image using next/image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-banner.jpg"
          alt="MotoStix Hero Banner"
          fill
          priority
          className="object-cover opacity-90"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          The best custom stickers for your car and bike adventures
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Express yourself with premium quality, weather-resistant stickers designed by creators.
        </p>

        {/* Search Bar */}
        <div className="mt-8 w-full max-w-2xl mx-auto">
          <div className="flex overflow-hidden rounded-full bg-white">
            <div className="flex items-center pl-4 pr-2">
              <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">Stickers</span>
            </div>
            <input
              type="text"
              placeholder="Search for sticker designs..."
              className="w-full py-4 px-4 text-black outline-none"
            />
            <button className="bg-gray-100 px-6 text-gray-700 transition hover:bg-gray-200">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Photo Credit */}
      <div className="absolute bottom-2 right-4 text-xs text-white/70">Photo by MotoStix</div>
    </section>
  );
}
