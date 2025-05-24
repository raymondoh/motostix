"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPriceWithCode } from "@/lib/utils";
import { SectionHeader } from "@/components/sections/SectionHeader";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  description?: string;
  viewAllUrl?: string;
  centered?: boolean;
}

export function ProductCarousel({ products, title, description, viewAllUrl, centered = false }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4); // Default for SSR
  const [isClient, setIsClient] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);

    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1.33); // Mobile: 1 and 1/3
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2.5); // Tablet: 2 and 1/2
      } else {
        setItemsPerView(4); // Desktop: 4
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - Math.floor(itemsPerView));

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < maxIndex) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  // Use CSS classes for responsive design instead of dynamic calculations
  return (
    <section className="py-16 w-full bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title={title} description={description} viewAllUrl={viewAllUrl} centered={centered} />

        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile */}
          {products.length > Math.floor(itemsPerView) && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hidden md:flex"
                onClick={prevSlide}
                disabled={currentIndex === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hidden md:flex"
                onClick={nextSlide}
                disabled={currentIndex === maxIndex}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Products Grid with touch support */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            {/* Mobile Layout */}
            <div className="block md:hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 75}%)` // 75% for 1.33 items
                }}>
                {products.map(product => {
                  const displayPrice = product.salePrice || product.price;
                  const isOnSale = product.onSale && product.salePrice && product.salePrice < product.price;

                  return (
                    <div key={product.id} className="w-3/4 flex-shrink-0 px-2">
                      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          <Image
                            src={product.image || `/placeholder.svg?height=300&width=300&query=${product.name}+sticker`}
                            alt={product.name}
                            fill
                            sizes="75vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                          />
                          {isOnSale && <Badge className="absolute top-2 left-2 bg-red-500 text-white">Sale</Badge>}
                        </div>
                        <CardContent className="p-3">
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2">
                            {isOnSale ? (
                              <>
                                <span className="font-bold text-primary text-sm">
                                  {formatPriceWithCode(displayPrice, "GB")}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatPriceWithCode(product.price, "GB")}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-sm">{formatPriceWithCode(displayPrice, "GB")}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 25}%)` // 25% for 4 items
                }}>
                {products.map(product => {
                  const displayPrice = product.salePrice || product.price;
                  const isOnSale = product.onSale && product.salePrice && product.salePrice < product.price;

                  return (
                    <div key={product.id} className="w-1/4 flex-shrink-0 px-2">
                      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          <Image
                            src={product.image || `/placeholder.svg?height=300&width=300&query=${product.name}+sticker`}
                            alt={product.name}
                            fill
                            sizes="25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                          />
                          {isOnSale && <Badge className="absolute top-2 left-2 bg-red-500 text-white">Sale</Badge>}
                        </div>
                        <CardContent className="p-4">
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2">
                            {isOnSale ? (
                              <>
                                <span className="font-bold text-primary">
                                  {formatPriceWithCode(displayPrice, "GB")}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPriceWithCode(product.price, "GB")}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold">{formatPriceWithCode(displayPrice, "GB")}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile swipe indicator dots - only show on mobile after hydration */}
          {isClient && (
            <div className="flex justify-center mt-4 md:hidden">
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(products.length / 1.33) }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(currentIndex) === index ? "bg-primary" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
