"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductsFilters } from "./ProductsFilters";
import type { CategoryData } from "@/config/categories";

interface MobileFiltersButtonProps {
  selectedCategory: string | null;
  categoriesData?: CategoryData[];
}

export function MobileFiltersButton({ selectedCategory, categoriesData = [] }: MobileFiltersButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Product Filters</SheetTitle>
        </SheetHeader>
        <div className="px-1 py-4">
          <ProductsFilters
            onClose={() => setOpen(false)}
            selectedCategory={selectedCategory}
            categoriesData={categoriesData}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
