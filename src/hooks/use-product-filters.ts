"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";

export function useProductFilters(products: Product[]) {
  // Calculate price range from products
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 1000]);

  // In-stock filter
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Material filter
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // Color filter
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Sticky side filter
  const [selectedStickySides, setSelectedStickySides] = useState<string[]>([]);

  // Extract available materials from products - use a default set of materials if none found
  const availableMaterials =
    products && products.length > 0
      ? [
          ...new Set(
            products
              .filter(p => p.material)
              .map(p => p.material as string)
              .filter(Boolean) // Remove any undefined/null values
          )
        ].sort()
      : ["Vinyl", "Plastic", "Metal"]; // Default materials if none found in products

  // Extract available colors from products - use baseColor if available, otherwise normalize color
  const availableColors =
    products && products.length > 0
      ? [
          ...new Set(
            products
              .filter(p => p.baseColor || p.color)
              .map(p => (p.baseColor || p.color || "").toLowerCase())
              .filter(Boolean) // Remove any undefined/null values
          )
        ].sort()
      : ["red", "blue", "green", "black", "white"]; // Default colors if none found in products

  // Extract available sticky sides from products - use a default set if none found
  const availableStickySides =
    products && products.length > 0
      ? [
          ...new Set(
            products
              .filter(p => p.stickySide)
              .map(p => p.stickySide as string)
              .filter(Boolean) // Remove any undefined/null values
          )
        ].sort()
      : ["Front", "Back", "Both", "None"]; // Default sticky sides if none found in products

  // Calculate price range from products on initial load
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));

      setPriceRange([min, max]);

      // Only initialize current range once
      setCurrentPriceRange(prev => {
        // If the current range is the default, update it
        if (prev[0] === 0 && prev[1] === 1000) {
          return [min, max];
        }
        return prev;
      });
    }
  }, [products]);

  // Update price range
  const updatePriceRange = useCallback((min: number, max: number) => {
    setCurrentPriceRange([min, max]);
  }, []);

  // Toggle in-stock filter
  const toggleInStock = useCallback(() => {
    setInStockOnly(prev => !prev);
  }, []);

  // Toggle material selection
  const toggleMaterial = useCallback((material: string) => {
    setSelectedMaterials(prev => (prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]));
  }, []);

  // Toggle color selection
  const toggleColor = useCallback((color: string) => {
    setSelectedColors(prev => (prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]));
  }, []);

  // Toggle sticky side selection
  const toggleStickySide = useCallback((side: string) => {
    setSelectedStickySides(prev => (prev.includes(side) ? prev.filter(s => s !== side) : [...prev, side]));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setCurrentPriceRange(priceRange);
    setInStockOnly(false);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSelectedStickySides([]);
  }, [priceRange]);

  // Filter products based on all filters
  const filteredProducts = products.filter(product => {
    // Price filter
    if (product.price < currentPriceRange[0] || product.price > currentPriceRange[1]) {
      return false;
    }

    // In-stock filter
    if (inStockOnly && !product.inStock) {
      return false;
    }

    // Material filter - only apply if materials are selected and product has a material
    if (selectedMaterials.length > 0) {
      // If product has no material property, exclude it when material filter is active
      if (!product.material) return false;

      // If product's material is not in selected materials, exclude it
      if (!selectedMaterials.includes(product.material)) return false;
    }

    // Color filter - only apply if colors are selected and product has a color
    if (selectedColors.length > 0) {
      // If product has no color properties, exclude it when color filter is active
      if (!product.baseColor && !product.color) return false;

      // Use baseColor for filtering if available, otherwise use color
      const productColor = (product.baseColor || product.color || "").toLowerCase();

      // If product's color is not in selected colors, exclude it
      if (!selectedColors.includes(productColor)) return false;
    }

    // Sticky side filter - only apply if sticky sides are selected and product has a sticky side
    if (selectedStickySides.length > 0) {
      // If product has no sticky side property, exclude it when sticky side filter is active
      if (!product.stickySide) return false;

      // If product's sticky side is not in selected sticky sides, exclude it
      if (!selectedStickySides.includes(product.stickySide)) return false;
    }

    return true;
  });

  return {
    priceRange,
    currentPriceRange,
    inStockOnly,
    selectedMaterials,
    availableMaterials,
    selectedColors,
    availableColors,
    selectedStickySides,
    availableStickySides,
    updatePriceRange,
    toggleInStock,
    toggleMaterial,
    toggleColor,
    toggleStickySide,
    resetFilters,
    filteredProducts,
    isPriceFiltered: currentPriceRange[0] > priceRange[0] || currentPriceRange[1] < priceRange[1],
    hasActiveFilters:
      currentPriceRange[0] > priceRange[0] ||
      currentPriceRange[1] < priceRange[1] ||
      inStockOnly ||
      selectedMaterials.length > 0 ||
      selectedColors.length > 0 ||
      selectedStickySides.length > 0
  };
}
