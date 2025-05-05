"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate the products to display on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="space-y-8">
      {products.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No products available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastProduct, totalProducts)}</span> of{" "}
                <span className="font-medium">{totalProducts}</span> products
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(i + 1)}
                    className="w-8 h-8">
                    {i + 1}
                  </Button>
                ))}

                <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
