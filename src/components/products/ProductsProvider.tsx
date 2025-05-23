// "use client";

// import type React from "react";

// import { createContext, useContext } from "react";
// import { useProductFilters } from "@/hooks/use-product-filters";
// import type { Product } from "@/types/product";

// interface ProductsContextType {
//   allProducts: Product[];
//   filteredProducts: Product[];
//   priceRange: [number, number];
//   currentPriceRange: [number, number];
//   inStockOnly: boolean;
//   selectedMaterials: string[];
//   availableMaterials: string[];
//   selectedColors: string[];
//   availableColors: string[];
//   selectedStickySides: string[];
//   availableStickySides: string[];
//   updatePriceRange: (min: number, max: number) => void;
//   toggleInStock: () => void;
//   toggleMaterial: (material: string) => void;
//   toggleColor: (color: string) => void;
//   toggleStickySide: (side: string) => void;
//   resetFilters: () => void;
//   isPriceFiltered: boolean;
//   hasActiveFilters: boolean;
// }

// const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// export function useProducts() {
//   const context = useContext(ProductsContext);
//   if (context === undefined) {
//     throw new Error("useProducts must be used within a ProductsProvider");
//   }
//   return context;
// }

// interface ProductsProviderProps {
//   children: React.ReactNode;
//   products: Product[];
// }

// export function ProductsProvider({ children, products }: ProductsProviderProps) {
//   const {
//     priceRange,
//     currentPriceRange,
//     inStockOnly,
//     selectedMaterials,
//     availableMaterials,
//     selectedColors,
//     availableColors,
//     selectedStickySides,
//     availableStickySides,
//     updatePriceRange,
//     toggleInStock,
//     toggleMaterial,
//     toggleColor,
//     toggleStickySide,
//     resetFilters,
//     filteredProducts,
//     isPriceFiltered,
//     hasActiveFilters
//   } = useProductFilters(products);

//   const value = {
//     allProducts: products,
//     filteredProducts,
//     priceRange,
//     currentPriceRange,
//     inStockOnly,
//     selectedMaterials,
//     availableMaterials,
//     selectedColors,
//     availableColors,
//     selectedStickySides,
//     availableStickySides,
//     updatePriceRange,
//     toggleInStock,
//     toggleMaterial,
//     toggleColor,
//     toggleStickySide,
//     resetFilters,
//     isPriceFiltered,
//     hasActiveFilters
//   };

//   return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
// }
// src/components/products/ProductsProvider.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useProductFilters } from "@/hooks/use-product-filters";
import type { Product } from "@/types/product";

// Define props for ProductsProvider
interface ProductsProviderProps {
  children: React.ReactNode;
  initialProducts: Product[];
  currentCategory?: string; // <-- Add currentCategory
  currentSubcategory?: string; // <-- Add currentSubcategory
}

// Create context with a more specific type
// Use ReturnType<typeof useProductFilters> for the context value type
type ProductFiltersContextType = ReturnType<typeof useProductFilters>;
export const ProductsContext = createContext<ProductFiltersContextType | undefined>(undefined);

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
  initialProducts,
  currentCategory, // <-- Destructure
  currentSubcategory // <-- Destructure
}) => {
  // Pass category and subcategory to the hook
  const filterState = useProductFilters(initialProducts, currentCategory, currentSubcategory);

  return <ProductsContext.Provider value={filterState}>{children}</ProductsContext.Provider>;
};

// Custom hook to use the context, ensures context is not undefined
export const useProducts = (): ProductFiltersContextType => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
