"use client";

import type React from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { formatPriceWithCode } from "@/lib/utils";

export interface ProductCarouselProps {
  /**
   * Array of products to display
   */
  products?: Product[];
  /**
   * Title for the carousel section
   */
  title?: string;
  /**
   * Whether to show the title
   * @default true
   */
  showTitle?: boolean;
  /**
   * Whether to loop the carousel
   * @default true
   */
  loop?: boolean;
  /**
   * Whether to show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Callback when a product is clicked
   */
  onProductClick?: (product: Product) => void;
  /**
   * Callback when add to cart button is clicked
   */
  onAddToCart?: (product: Product) => void;
  /**
   * Custom button text for the add to cart button
   * @default "Add to Cart"
   */
  addToCartText?: string;
  /**
   * Whether to show the quick view button
   * @default false
   */
  showQuickView?: boolean;
  /**
   * URL for "View All" link
   * @default "/products"
   */
  viewAllUrl?: string;
}

export function ProductCarousel({
  products = [],
  title = "Trending Stickers",
  showTitle = true,
  loop = true,
  showArrows = true,
  className,
  onProductClick,
  onAddToCart,
  addToCartText = "Add to Cart",
  showQuickView = false,
  viewAllUrl = "/products"
}: ProductCarouselProps) {
  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Function to handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load:", e.currentTarget.src);
    e.currentTarget.src = "https://placehold.co/400x400/png";
  };

  return (
    <div className={cn("py-16 w-full bg-secondary/5 border-y border-border/40", className)}>
      <div className="container mx-auto px-4">
        {showTitle && title && (
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{title}</h2>
            <div className="w-12 h-0.5 bg-primary mb-6"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              Discover our most popular designs loved by riders everywhere.
            </p>
          </div>
        )}

        <Carousel
          opts={{
            align: "start",
            loop
          }}
          className="w-full">
          <CarouselContent className="-ml-3 md:-ml-6">
            {products.length === 0 ? (
              <CarouselItem className="pl-3 md:pl-6 basis-full">
                <div className="h-[300px] flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white">
                  <p className="text-muted-foreground">No products available</p>
                </div>
              </CarouselItem>
            ) : (
              products.map(product => (
                <CarouselItem
                  key={product.id}
                  className="pl-3 md:pl-6 w-[65%] md:w-[40%] lg:w-[30%] xl:w-[22%] flex-none">
                  <Link href={`/products/${product.id}`} key={product.id} className="block group h-full">
                    <div
                      className="relative overflow-hidden rounded-lg bg-white transition-all hover:shadow-md h-[250px] sm:h-[280px] md:h-[320px]"
                      onClick={() => handleProductClick(product)}>
                      {/* Using standard img tag with error handling */}
                      <img
                        src={product.image || "https://placehold.co/400x400/png"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={handleImageError}
                      />

                      {/* Product badge if available */}
                      {product.badge && (
                        <Badge className="absolute top-2 right-2 z-10" variant="secondary">
                          {product.badge}
                        </Badge>
                      )}

                      {/* 
                      Overlay with product details - only visible on hover on desktop
                      On mobile, we'll show a permanent footer with basic info
                    */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:block hidden">
                        <h3 className="font-medium text-white text-lg">{product.name}</h3>
                        <p className="text-base text-white/90 mt-1">{formatPriceWithCode(product.price, "GB")}</p>

                        {/* Quick view button - only shown on hover */}
                        {showQuickView && (
                          <Button
                            variant="secondary"
                            size="default"
                            className="gap-1 mt-4 w-full"
                            onClick={e => {
                              e.preventDefault();
                              handleProductClick(product);
                            }}>
                            <Eye className="h-4 w-4" />
                            Quick View
                          </Button>
                        )}

                        {/* Add to cart button - only shown on hover */}
                        {onAddToCart && (
                          <Button
                            className="w-full mt-2"
                            variant="secondary"
                            size="default"
                            disabled={product.inStock === false}
                            onClick={e => {
                              e.preventDefault();
                              handleAddToCart(e, product);
                            }}>
                            {product.inStock === false ? (
                              "Out of Stock"
                            ) : (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {addToCartText}
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Mobile footer - always visible on mobile */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:hidden">
                        <h3 className="font-medium text-white text-base truncate">{product.name}</h3>
                        <p className="text-sm text-white/90">{formatPriceWithCode(product.price, "GB")}</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))
            )}
          </CarouselContent>

          {showArrows && products.length > 0 && (
            <>
              <CarouselPrevious className="-left-4 md:-left-6" />
              <CarouselNext className="-right-4 md:-right-6" />
            </>
          )}
        </Carousel>

        {/* View All link - larger button */}
        <div className="mt-12 text-center">
          <Link
            href={viewAllUrl}
            className="inline-block rounded-full bg-black text-white dark:bg-white dark:text-black px-10 py-4 text-lg font-medium hover:bg-black/90 dark:hover:bg-white/90 transition-colors">
            View All Stickers
          </Link>
        </div>
      </div>
    </div>
  );
}
