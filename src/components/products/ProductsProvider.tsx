"use client";

import type React from "react";

import { createContext, useContext } from "react";
import { useProductFilters } from "@/hooks/use-product-filters";
import type { Product } from "@/types/product";

interface ProductsContextType {
  allProducts: Product[];
  filteredProducts: Product[];
  priceRange: [number, number];
  currentPriceRange: [number, number];
  inStockOnly: boolean;
  selectedMaterials: string[];
  availableMaterials: string[];
  selectedColors: string[];
  availableColors: string[];
  selectedStickySides: string[];
  availableStickySides: string[];
  updatePriceRange: (min: number, max: number) => void;
  toggleInStock: () => void;
  toggleMaterial: (material: string) => void;
  toggleColor: (color: string) => void;
  toggleStickySide: (side: string) => void;
  resetFilters: () => void;
  isPriceFiltered: boolean;
  hasActiveFilters: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}

interface ProductsProviderProps {
  children: React.ReactNode;
  products: Product[];
}

export function ProductsProvider({ children, products }: ProductsProviderProps) {
  const {
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
    isPriceFiltered,
    hasActiveFilters
  } = useProductFilters(products);

  const value = {
    allProducts: products,
    filteredProducts,
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
    isPriceFiltered,
    hasActiveFilters
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
