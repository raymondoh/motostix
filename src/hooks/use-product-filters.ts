// // "use client";

// // import { useCallback, useEffect, useState } from "react";
// // import type { Product } from "@/types/product";

// // export function useProductFilters(products: Product[]) {
// //   // Calculate price range from products
// //   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
// //   const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 1000]);

// //   // In-stock filter
// //   const [inStockOnly, setInStockOnly] = useState<boolean>(false);

// //   // Material filter
// //   const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

// //   // Color filter
// //   const [selectedColors, setSelectedColors] = useState<string[]>([]);

// //   // Sticky side filter
// //   const [selectedStickySides, setSelectedStickySides] = useState<string[]>([]);

// //   // Extract available materials from products - use a default set of materials if none found
// //   const availableMaterials =
// //     products && products.length > 0
// //       ? [
// //           ...new Set(
// //             products
// //               .filter(p => p.material)
// //               .map(p => p.material as string)
// //               .filter(Boolean) // Remove any undefined/null values
// //           )
// //         ].sort()
// //       : ["Vinyl", "Plastic", "Metal"]; // Default materials if none found in products

// //   // Extract available colors from products - use baseColor if available, otherwise normalize color
// //   const availableColors =
// //     products && products.length > 0
// //       ? [
// //           ...new Set(
// //             products
// //               .filter(p => p.baseColor || p.color)
// //               .map(p => (p.baseColor || p.color || "").toLowerCase())
// //               .filter(Boolean) // Remove any undefined/null values
// //           )
// //         ].sort()
// //       : ["red", "blue", "green", "black", "white"]; // Default colors if none found in products

// //   // Extract available sticky sides from products - use a default set if none found
// //   const availableStickySides =
// //     products && products.length > 0
// //       ? [
// //           ...new Set(
// //             products
// //               .filter(p => p.stickySide)
// //               .map(p => p.stickySide as string)
// //               .filter(Boolean) // Remove any undefined/null values
// //           )
// //         ].sort()
// //       : ["Front", "Back", "Both", "None"]; // Default sticky sides if none found in products

// //   // Calculate price range from products on initial load
// //   useEffect(() => {
// //     if (products.length > 0) {
// //       const prices = products.map(p => p.price);
// //       const min = Math.floor(Math.min(...prices));
// //       const max = Math.ceil(Math.max(...prices));

// //       setPriceRange([min, max]);

// //       // Only initialize current range once
// //       setCurrentPriceRange(prev => {
// //         // If the current range is the default, update it
// //         if (prev[0] === 0 && prev[1] === 1000) {
// //           return [min, max];
// //         }
// //         return prev;
// //       });
// //     }
// //   }, [products]);

// //   // Update price range
// //   const updatePriceRange = useCallback((min: number, max: number) => {
// //     setCurrentPriceRange([min, max]);
// //   }, []);

// //   // Toggle in-stock filter
// //   const toggleInStock = useCallback(() => {
// //     setInStockOnly(prev => !prev);
// //   }, []);

// //   // Toggle material selection
// //   const toggleMaterial = useCallback((material: string) => {
// //     setSelectedMaterials(prev => (prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]));
// //   }, []);

// //   // Toggle color selection
// //   const toggleColor = useCallback((color: string) => {
// //     setSelectedColors(prev => (prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]));
// //   }, []);

// //   // Toggle sticky side selection
// //   const toggleStickySide = useCallback((side: string) => {
// //     setSelectedStickySides(prev => (prev.includes(side) ? prev.filter(s => s !== side) : [...prev, side]));
// //   }, []);

// //   // Reset all filters
// //   const resetFilters = useCallback(() => {
// //     setCurrentPriceRange(priceRange);
// //     setInStockOnly(false);
// //     setSelectedMaterials([]);
// //     setSelectedColors([]);
// //     setSelectedStickySides([]);
// //   }, [priceRange]);

// //   // Filter products based on all filters
// //   const filteredProducts = products.filter(product => {
// //     // Price filter
// //     if (product.price < currentPriceRange[0] || product.price > currentPriceRange[1]) {
// //       return false;
// //     }

// //     // In-stock filter
// //     if (inStockOnly && !product.inStock) {
// //       return false;
// //     }

// //     // Material filter - only apply if materials are selected and product has a material
// //     if (selectedMaterials.length > 0) {
// //       // If product has no material property, exclude it when material filter is active
// //       if (!product.material) return false;

// //       // If product's material is not in selected materials, exclude it
// //       if (!selectedMaterials.includes(product.material)) return false;
// //     }

// //     // Color filter - only apply if colors are selected and product has a color
// //     if (selectedColors.length > 0) {
// //       // If product has no color properties, exclude it when color filter is active
// //       if (!product.baseColor && !product.color) return false;

// //       // Use baseColor for filtering if available, otherwise use color
// //       const productColor = (product.baseColor || product.color || "").toLowerCase();

// //       // If product's color is not in selected colors, exclude it
// //       if (!selectedColors.includes(productColor)) return false;
// //     }

// //     // Sticky side filter - only apply if sticky sides are selected and product has a sticky side
// //     if (selectedStickySides.length > 0) {
// //       // If product has no sticky side property, exclude it when sticky side filter is active
// //       if (!product.stickySide) return false;

// //       // If product's sticky side is not in selected sticky sides, exclude it
// //       if (!selectedStickySides.includes(product.stickySide)) return false;
// //     }

// //     return true;
// //   });

// //   return {
// //     priceRange,
// //     currentPriceRange,
// //     inStockOnly,
// //     selectedMaterials,
// //     availableMaterials,
// //     selectedColors,
// //     availableColors,
// //     selectedStickySides,
// //     availableStickySides,
// //     updatePriceRange,
// //     toggleInStock,
// //     toggleMaterial,
// //     toggleColor,
// //     toggleStickySide,
// //     resetFilters,
// //     filteredProducts,
// //     isPriceFiltered: currentPriceRange[0] > priceRange[0] || currentPriceRange[1] < priceRange[1],
// //     hasActiveFilters:
// //       currentPriceRange[0] > priceRange[0] ||
// //       currentPriceRange[1] < priceRange[1] ||
// //       inStockOnly ||
// //       selectedMaterials.length > 0 ||
// //       selectedColors.length > 0 ||
// //       selectedStickySides.length > 0
// //   };
// // }
// // src/hooks/use-product-filters.ts
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react"; // Added useMemo
// import type { Product, ProductFilterOptions, GetAllProductsResult } from "@/types/product";
// import { fetchAllProductsClient } from "@/actions/client/fetch-all-products";

// export function useProductFilters(
//   initialProducts: Product[],
//   currentCategory?: string, // <-- Accept currentCategory
//   currentSubcategory?: string // <-- Accept currentSubcategory
// ) {
//   const [products, setProducts] = useState<Product[]>(initialProducts);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
//   const [isLoading, setIsLoading] = useState(false);

//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
//   const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 1000]);
//   const [inStockOnly, setInStockOnly] = useState<boolean>(false);
//   const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
//   const [selectedColors, setSelectedColors] = useState<string[]>([]);
//   const [selectedStickySides, setSelectedStickySides] = useState<string[]>([]);

//   // Effect to update products and reset filters when initialProducts, category, or subcategory change
//   useEffect(() => {
//     setProducts(initialProducts); // Set the base list of products

//     // Calculate global min/max price from the current `initialProducts` list
//     if (initialProducts.length > 0) {
//       const prices = initialProducts.map(p => p.price).filter(p => typeof p === "number");
//       const min = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
//       const max = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;
//       setPriceRange([min, max]);
//       setCurrentPriceRange([min, max]); // Reset currentPriceRange to full range of new initialProducts
//     } else {
//       setPriceRange([0, 1000]);
//       setCurrentPriceRange([0, 1000]);
//     }

//     // When initialProducts change (e.g. due to category selection),
//     // also reset other filters to apply them freshly onto the new product set.
//     // Or, if you want filters to persist across category changes, you'd have different logic.
//     // For now, let's assume a full refilter based on current filter states.
//     setFilteredProducts(initialProducts); // Start with all initial products for this category/context

//     // Trigger a re-fetch/re-filter if filters were already active
//     // This requires moving the main fetching logic to a separate function
//     // that can be called here and in the dependency-based useEffect.
//     // For now, the main useEffect below will handle fetching.
//   }, [initialProducts, currentCategory, currentSubcategory]);

//   // Main effect to fetch/filter data when UI filter states change
//   // useEffect(() => {
//   //   const fetchFilteredData = async () => {
//   //     setIsLoading(true);
//   //     const activeFilters: ProductFilterOptions = {};

//   //     // IMPORTANT: Always include the current category and subcategory
//   //     if (currentCategory) {
//   //       activeFilters.category = currentCategory;
//   //     }
//   //     if (currentSubcategory) {
//   //       activeFilters.subcategory = currentSubcategory;
//   //     }

//   //     // Price Range
//   //     const isPriceEffectivelyFiltered =
//   //       currentPriceRange[0] !== priceRange[0] || currentPriceRange[1] !== priceRange[1];
//   //     if (isPriceEffectivelyFiltered && (priceRange[0] !== 0 || priceRange[1] !== 1000)) {
//   //       // Avoid sending default 0-1000 if it's the actual full range
//   //       activeFilters.priceRange = `${currentPriceRange[0]}-${currentPriceRange[1]}`;
//   //     }

//   //     if (inStockOnly) activeFilters.inStock = true;
//   //     if (selectedMaterials.length > 0) activeFilters.material = selectedMaterials[0]; // Assuming single material filter
//   //     if (selectedColors.length > 0) activeFilters.baseColor = selectedColors[0]; // Assuming single color filter
//   //     if (selectedStickySides.length > 0) activeFilters.stickySide = selectedStickySides[0]; // Assuming single sticky side

//   //     // Only fetch if there are actual filters applied beyond category/subcategory,
//   //     // or if category/subcategory themselves are the primary filters being set.
//   //     // The `initialProducts` useEffect already sets products based on category/subcategory.
//   //     // This effect should refine that based on *additional* UI filters.
//   //     // However, to ensure consistency, always fetching with all known filters (incl. cat/subcat) is safer.

//   //     try {
//   //       // If no specific UI filters are active beyond category context,
//   //       // and initialProducts already reflect the category, no need to re-fetch.
//   //       // But if category/subcategory are passed to this hook, they are now part of activeFilters.
//   //       // The initial useEffect handles the base set for the category.
//   //       // This useEffect refines it.

//   //       // console.log("Fetching with filters:", activeFilters); // Good for debugging
//   //       const result = await fetchAllProductsClient(activeFilters);
//   //       if (result.success && result.data) {
//   //         setFilteredProducts(result.data);
//   //       } else {
//   //         // If fetch fails or returns no data for the refined filter,
//   //         // what should be shown? Empty list or fallback to category's initialProducts?
//   //         // For now, empty list on failure.
//   //         setFilteredProducts([]);
//   //         console.error("Failed to fetch filtered products:", result.error);
//   //       }
//   //     } catch (error) {
//   //       setFilteredProducts([]);
//   //       console.error("Error fetching products:", error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   // Condition to fetch:
//   //   // Fetch if any of the UI-controlled filters have changed.
//   //   // The initial load by category is handled by the first useEffect.
//   //   // This effect is for subsequent refinements by the user via filter controls.
//   //   if (initialProducts.length > 0) {
//   //     // Only try to filter if there's a base set of products
//   //     fetchFilteredData();
//   //   } else {
//   //     setFilteredProducts([]); // No initial products, so no filtered products.
//   //     setIsLoading(false);
//   //   }
//   // }, [
//   //   currentPriceRange,
//   //   inStockOnly,
//   //   selectedMaterials,
//   //   selectedColors,
//   //   selectedStickySides,
//   //   currentCategory, // Add as dependency
//   //   currentSubcategory, // Add as dependency
//   //   initialProducts, // If initialProducts change (e.g. new category), re-evaluate filters.
//   //   priceRange // also a dependency for price filter logic
//   // ]);

//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setIsLoading(true);
//       const activeFilters: ProductFilterOptions = {};

//       if (currentCategory) {
//         activeFilters.category = currentCategory;
//       }
//       if (currentSubcategory) {
//         activeFilters.subcategory = currentSubcategory;
//       }

//       const isPriceEffectivelyFiltered =
//         currentPriceRange[0] !== priceRange[0] || currentPriceRange[1] !== priceRange[1];
//       if (
//         isPriceEffectivelyFiltered &&
//         (priceRange[0] !== 0 || priceRange[1] !== 1000 || (initialProducts && initialProducts.length > 0))
//       ) {
//         activeFilters.priceRange = `${currentPriceRange[0]}-${currentPriceRange[1]}`;
//       }

//       if (inStockOnly) activeFilters.inStock = true;
//       if (selectedMaterials.length > 0) activeFilters.material = selectedMaterials[0];
//       if (selectedColors.length > 0) activeFilters.baseColor = selectedColors[0];
//       if (selectedStickySides.length > 0) activeFilters.stickySide = selectedStickySides[0];

//       console.log(
//         "useProductFilters - fetchFilteredData: activeFilters being sent:",
//         JSON.stringify(activeFilters, null, 2)
//       );

//       try {
//         const result: GetAllProductsResult = await fetchAllProductsClient(activeFilters); // Explicitly type result
//         console.log("useProductFilters - fetchFilteredData: Result from fetchAllProductsClient:", result);

//         if (result.success) {
//           // Check for success
//           setFilteredProducts(result.data);
//           if (result.data.length === 0) {
//             console.log(
//               "useProductFilters - fetchFilteredData: WARNING - fetchAllProductsClient returned 0 products with active filters."
//             );
//           }
//         } else {
//           // result.success is false, so TypeScript knows 'result' is the error type
//           setFilteredProducts([]);
//           console.error("useProductFilters - fetchFilteredData: Failed to fetch filtered products:", result.error); // Now this is safe
//         }
//       } catch (error) {
//         // Catch errors from the fetchAllProductsClient call itself (e.g., network error)
//         setFilteredProducts([]);
//         console.error("useProductFilters - fetchFilteredData: Exception when fetching products:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // Determine if initialProducts is valid for fetching (not undefined and potentially has items, or category is set)
//     const canFetch = initialProducts || currentCategory || currentSubcategory;

//     if (canFetch) {
//       fetchFilteredData();
//     } else {
//       setFilteredProducts([]); // Clear products if no valid initial set or category
//       setIsLoading(false);
//     }
//   }, [
//     currentPriceRange,
//     inStockOnly,
//     selectedMaterials,
//     selectedColors,
//     selectedStickySides,
//     currentCategory,
//     currentSubcategory,
//     initialProducts,
//     priceRange
//   ]);

//   // Callbacks for UI elements to update filter states
//   const updatePriceRange = useCallback((min: number, max: number) => {
//     setCurrentPriceRange([min, max]);
//   }, []);

//   const toggleInStock = useCallback(() => setInStockOnly(prev => !prev), []);
//   const toggleMaterial = useCallback((material: string) => {
//     setSelectedMaterials(
//       prev => (prev.includes(material) ? prev.filter(m => m !== material) : [material]) // Assuming single select for now to match API
//     );
//   }, []);
//   const toggleColor = useCallback((color: string) => {
//     setSelectedColors(
//       prev => (prev.includes(color) ? prev.filter(c => c !== color) : [color.toLowerCase()]) // Assuming single select
//     );
//   }, []);
//   const toggleStickySide = useCallback((side: string) => {
//     setSelectedStickySides(
//       prev => (prev.includes(side) ? prev.filter(s => s !== side) : [side]) // Assuming single select
//     );
//   }, []);

//   const resetFilters = useCallback(() => {
//     setCurrentPriceRange(priceRange); // Reset to the full range of current initialProducts
//     setInStockOnly(false);
//     setSelectedMaterials([]);
//     setSelectedColors([]);
//     setSelectedStickySides([]);
//     // filteredProducts will be reset via the useEffects reacting to these state changes
//   }, [priceRange]);

//   const availableMaterials = useMemo(
//     () =>
//       initialProducts && initialProducts.length > 0
//         ? [...new Set(initialProducts.map(p => p.material).filter(Boolean) as string[])].sort()
//         : [],
//     [initialProducts]
//   );

//   const availableColors = useMemo(
//     () =>
//       initialProducts && initialProducts.length > 0
//         ? [
//             ...new Set(
//               initialProducts
//                 .map(p => p.baseColor || p.color || "")
//                 .filter(Boolean)
//                 .map(c => c.toLowerCase())
//             )
//           ].sort()
//         : [],
//     [initialProducts]
//   );

//   const availableStickySides = useMemo(
//     () =>
//       initialProducts && initialProducts.length > 0
//         ? [...new Set(initialProducts.map(p => p.stickySide).filter(Boolean) as string[])].sort()
//         : [],
//     [initialProducts]
//   );

//   const isPriceEffectivelyFiltered = currentPriceRange[0] !== priceRange[0] || currentPriceRange[1] !== priceRange[1];
//   const hasActiveUiFilters = // True if any UI filter (beyond category/sub) is active
//     isPriceEffectivelyFiltered ||
//     inStockOnly ||
//     selectedMaterials.length > 0 ||
//     selectedColors.length > 0 ||
//     selectedStickySides.length > 0;

//   return {
//     allProducts: products, // This is effectively initialProducts for the current category scope
//     filteredProducts,
//     priceRange, // Min/max of allProducts
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
//     hasActiveFilters: hasActiveUiFilters, // Renamed to reflect UI filters
//     isLoading
//   };
// }
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, ProductFilterOptions, GetAllProductsResult } from "@/types/product";
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
          setFilteredProducts(result.data);
          if (result.data.length === 0) {
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
