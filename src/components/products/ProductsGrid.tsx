"use client";

import { useState, useCallback } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductListItem } from "@/components/products/ProductListItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutToggle } from "@/components/products/LayoutToggle";
import type { Product } from "@/types/product";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [visibleProducts, setVisibleProducts] = useState(12);

  const handleLayoutChange = useCallback((newLayout: "grid" | "list") => {
    setLayout(newLayout);
  }, []);

  const loadMore = () => {
    setVisibleProducts(prev => prev + 12);
  };

  const displayedProducts = products.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < products.length;

  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">{products.length} products</p>
            <div className="flex items-center space-x-3">
              <LayoutToggle onLayoutChange={handleLayoutChange} />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Product grid or list based on layout */}
          {layout === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {displayedProducts.map(product => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMoreProducts && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} variant="outline" className="px-8">
                Load More Products
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Showing {displayedProducts.length} of {products.length} products
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
