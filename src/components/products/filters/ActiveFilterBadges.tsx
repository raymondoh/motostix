"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FilterBadge } from "./FilterBadge";
import { Button } from "@/components/ui/button";
import { useProducts } from "../ProductsProvider";
import { formatPriceWithCode } from "@/lib/utils";

export function ActiveFilterBadges() {
  const {
    priceRange,
    currentPriceRange,
    inStockOnly,
    selectedMaterials,
    selectedColors,
    selectedStickySides,
    resetFilters,
    toggleInStock,
    toggleMaterial,
    toggleColor,
    toggleStickySide,
    updatePriceRange,
    hasActiveFilters
  } = useProducts();

  if (!hasActiveFilters) {
    return null;
  }

  const isPriceFiltered = currentPriceRange[0] > priceRange[0] || currentPriceRange[1] < priceRange[1];

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <AnimatePresence>
          {isPriceFiltered && (
            <FilterBadge
              key="price-filter"
              label={`Price: ${formatPriceWithCode(currentPriceRange[0], "GB")} - ${formatPriceWithCode(
                currentPriceRange[1],
                "GB"
              )}`}
              onRemove={() => updatePriceRange(priceRange[0], priceRange[1])}
            />
          )}

          {inStockOnly && <FilterBadge key="in-stock-filter" label="In Stock Only" onRemove={toggleInStock} />}

          {selectedMaterials.map(material => (
            <FilterBadge
              key={`material-${material}`}
              label={`Material: ${material}`}
              onRemove={() => toggleMaterial(material)}
            />
          ))}

          {selectedColors.map(color => (
            <FilterBadge
              key={`color-${color}`}
              label={`Color: ${color.charAt(0).toUpperCase() + color.slice(1)}`}
              onRemove={() => toggleColor(color)}
            />
          ))}

          {selectedStickySides.map(side => (
            <FilterBadge key={`side-${side}`} label={`Sticky Side: ${side}`} onRemove={() => toggleStickySide(side)} />
          ))}
        </AnimatePresence>
      </div>

      {hasActiveFilters && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
          <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
