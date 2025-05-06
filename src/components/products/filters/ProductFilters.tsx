// "use client";

// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { PriceRangeFilterWrapper } from "./PriceRangeFilterWrapper";
// import { InStockFilterWrapper } from "./InStockFilterWrapper";
// import { MaterialFilterWrapper } from "./MaterialFilterWrapper";
// import { ColorFilterWrapper } from "./ColorFilterWrapper";
// import { StickySideFilterWrapper } from "./StickySideFilterWrapper";
// import { useProducts } from "../ProductsProvider";

// export function ProductFilters() {
//   const { resetFilters, hasActiveFilters } = useProducts();

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-lg font-semibold mb-4">Filters</h2>
//         <div className="space-y-6">
//           <PriceRangeFilterWrapper />
//           <Separator />
//           <InStockFilterWrapper />
//           <Separator />
//           <MaterialFilterWrapper />
//           <Separator />
//           <ColorFilterWrapper />
//           <Separator />
//           <StickySideFilterWrapper />
//         </div>
//       </div>

//       {hasActiveFilters && (
//         <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
//           Reset All Filters
//         </Button>
//       )}
//     </div>
//   );
// }
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PriceRangeFilterWrapper } from "./PriceRangeFilterWrapper";
import { InStockFilterWrapper } from "./InStockFilterWrapper";
import { MaterialFilterWrapper } from "./MaterialFilterWrapper";
import { ColorFilterWrapper } from "./ColorFilterWrapper";
import { StickySideFilterWrapper } from "./StickySideFilterWrapper";
import { useProducts } from "../ProductsProvider";
import type { CategoryData } from "@/config/categories";

// Define the props interface for ProductFilters
interface ProductFiltersProps {
  selectedCategory?: string | null;
  onCategoryChange?: (categoryId: string | null) => void;
  categoriesData?: CategoryData[];
}

export function ProductFilters({
  // We're accepting these props for type safety, but not using them in this component
  selectedCategory,
  onCategoryChange,
  categoriesData
}: ProductFiltersProps) {
  const { resetFilters, hasActiveFilters } = useProducts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-6">
          <PriceRangeFilterWrapper />
          <Separator />
          <InStockFilterWrapper />
          <Separator />
          <MaterialFilterWrapper />
          <Separator />
          <ColorFilterWrapper />
          <Separator />
          <StickySideFilterWrapper />
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
          Reset All Filters
        </Button>
      )}
    </div>
  );
}
