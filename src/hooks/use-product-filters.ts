"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, ProductFilterOptions, GetAllProductsResult, GetAllProductsSuccess } from "@/types/product";
import { fetchAllProductsClient } from "@/actions/client/fetch-all-products";

export function useProductFilters(initialProducts: Product[], currentCategory?: string, currentSubcategory?: string) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStickySides, setSelectedStickySides] = useState<string[]>([]);

  // NEW: Theme and Sale filtering state
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);

  // Effect to update products and reset filters when initialProducts, category, or subcategory change
  useEffect(() => {
    setProducts(initialProducts);

    if (initialProducts.length > 0) {
      const prices = initialProducts.map(p => p.price).filter(p => typeof p === "number");
      const min = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
      const max = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;
      setPriceRange([min, max]);
      setCurrentPriceRange([min, max]);
    } else {
      setPriceRange([0, 1000]);
      setCurrentPriceRange([0, 1000]);
    }

    setFilteredProducts(initialProducts);
  }, [initialProducts, currentCategory, currentSubcategory]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      setIsLoading(true);
      const activeFilters: ProductFilterOptions = {};

      if (currentCategory) {
        activeFilters.category = currentCategory;
      }
      if (currentSubcategory) {
        activeFilters.subcategory = currentSubcategory;
      }

      const isPriceEffectivelyFiltered =
        currentPriceRange[0] !== priceRange[0] || currentPriceRange[1] !== priceRange[1];
      if (
        isPriceEffectivelyFiltered &&
        (priceRange[0] !== 0 || priceRange[1] !== 1000 || (initialProducts && initialProducts.length > 0))
      ) {
        activeFilters.priceRange = `${currentPriceRange[0]}-${currentPriceRange[1]}`;
      }

      if (inStockOnly) activeFilters.inStock = true;
      if (selectedMaterials.length > 0) activeFilters.material = selectedMaterials[0];
      if (selectedColors.length > 0) activeFilters.baseColor = selectedColors[0];
      if (selectedStickySides.length > 0) activeFilters.stickySide = selectedStickySides[0];

      // NEW: Add theme and sale filters
      if (selectedThemes.length > 0) activeFilters.designThemes = selectedThemes;
      if (onSaleOnly) activeFilters.onSale = true;

      console.log(
        "useProductFilters - fetchFilteredData: activeFilters being sent:",
        JSON.stringify(activeFilters, null, 2)
      );

      try {
        const result: GetAllProductsResult = await fetchAllProductsClient(activeFilters);
        console.log("useProductFilters - fetchFilteredData: Result from fetchAllProductsClient:", result);

        if (result.success) {
          const successResult = result as GetAllProductsSuccess;
          setFilteredProducts(successResult.data);
          if (successResult.data.length === 0) {
            console.log(
              "useProductFilters - fetchFilteredData: WARNING - fetchAllProductsClient returned 0 products with active filters."
            );
          }
        } else {
          setFilteredProducts([]);
          console.error("useProductFilters - fetchFilteredData: Failed to fetch filtered products:", result.error);
        }
      } catch (error) {
        setFilteredProducts([]);
        console.error("useProductFilters - fetchFilteredData: Exception when fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const canFetch = initialProducts || currentCategory || currentSubcategory;

    if (canFetch) {
      fetchFilteredData();
    } else {
      setFilteredProducts([]);
      setIsLoading(false);
    }
  }, [
    currentPriceRange,
    inStockOnly,
    selectedMaterials,
    selectedColors,
    selectedStickySides,
    selectedThemes, // NEW: Add to dependencies
    onSaleOnly, // NEW: Add to dependencies
    currentCategory,
    currentSubcategory,
    initialProducts,
    priceRange
  ]);

  // Existing callbacks
  const updatePriceRange = useCallback((min: number, max: number) => {
    setCurrentPriceRange([min, max]);
  }, []);

  const toggleInStock = useCallback(() => setInStockOnly(prev => !prev), []);

  const toggleMaterial = useCallback((material: string) => {
    setSelectedMaterials(prev => (prev.includes(material) ? prev.filter(m => m !== material) : [material]));
  }, []);

  const toggleColor = useCallback((color: string) => {
    setSelectedColors(prev => (prev.includes(color) ? prev.filter(c => c !== color) : [color.toLowerCase()]));
  }, []);

  const toggleStickySide = useCallback((side: string) => {
    setSelectedStickySides(prev => (prev.includes(side) ? prev.filter(s => s !== side) : [side]));
  }, []);

  // NEW: Theme and Sale callbacks
  const toggleTheme = useCallback((theme: string) => {
    setSelectedThemes(prev => (prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]));
  }, []);

  const toggleOnSale = useCallback(() => setOnSaleOnly(prev => !prev), []);

  const resetFilters = useCallback(() => {
    setCurrentPriceRange(priceRange);
    setInStockOnly(false);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSelectedStickySides([]);
    setSelectedThemes([]); // NEW: Reset themes
    setOnSaleOnly(false); // NEW: Reset sale filter
  }, [priceRange]);

  // Existing available options
  const availableMaterials = useMemo(
    () =>
      initialProducts && initialProducts.length > 0
        ? [...new Set(initialProducts.map(p => p.material).filter(Boolean) as string[])].sort()
        : [],
    [initialProducts]
  );

  const availableColors = useMemo(
    () =>
      initialProducts && initialProducts.length > 0
        ? [
            ...new Set(
              initialProducts
                .map(p => p.baseColor || p.color || "")
                .filter(Boolean)
                .map(c => c.toLowerCase())
            )
          ].sort()
        : [],
    [initialProducts]
  );

  const availableStickySides = useMemo(
    () =>
      initialProducts && initialProducts.length > 0
        ? [...new Set(initialProducts.map(p => p.stickySide).filter(Boolean) as string[])].sort()
        : [],
    [initialProducts]
  );

  // NEW: Available themes from products
  const availableThemes = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return [];

    const allThemes = initialProducts
      .filter(p => p.designThemes && Array.isArray(p.designThemes))
      .flatMap(p => p.designThemes as string[])
      .filter(Boolean);

    return [...new Set(allThemes)].sort();
  }, [initialProducts]);

  const isPriceEffectivelyFiltered = currentPriceRange[0] !== priceRange[0] || currentPriceRange[1] !== priceRange[1];
  const hasActiveUiFilters =
    isPriceEffectivelyFiltered ||
    inStockOnly ||
    selectedMaterials.length > 0 ||
    selectedColors.length > 0 ||
    selectedStickySides.length > 0 ||
    selectedThemes.length > 0 || // NEW: Include themes
    onSaleOnly; // NEW: Include sale filter

  return {
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
    // NEW: Theme and Sale exports
    selectedThemes,
    availableThemes,
    onSaleOnly,
    updatePriceRange,
    toggleInStock,
    toggleMaterial,
    toggleColor,
    toggleStickySide,
    toggleTheme, // NEW: Export theme toggle
    toggleOnSale, // NEW: Export sale toggle
    resetFilters,
    hasActiveFilters: hasActiveUiFilters,
    isLoading
  };
}
