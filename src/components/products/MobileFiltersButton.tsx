"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { ProductFilters } from "./filters/ProductFilters";
import { useProducts } from "./ProductsProvider";

export function MobileFiltersButton() {
  const [open, setOpen] = useState(false);
  const { filteredProducts, allProducts, hasActiveFilters } = useProducts();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && <span className="ml-1 rounded-full bg-primary w-2 h-2 block" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-5 py-4 overflow-y-auto h-full pb-20">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} of {allProducts.length} products
            </p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Close the sheet after applying filters
                  setTimeout(() => setOpen(false), 300);
                }}>
                Apply Filters
              </Button>
            )}
          </div>
          <ProductFilters />
        </div>
      </SheetContent>
    </Sheet>
  );
}
