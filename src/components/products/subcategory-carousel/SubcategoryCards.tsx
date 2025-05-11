// "use client";

// import { useState, useEffect } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselPrevious,
//   CarouselNext,
//   type CarouselApi
// } from "@/components/ui/carousel";
// import type { Category } from "@/config/categories";
// import { subcategories, categories } from "@/config/categories";

// interface SubcategoryCardsProps {
//   parentCategory: string;
//   selectedSubcategory: string | null;
//   onSubcategorySelect: (subcategoryId: string | null) => void;
// }

// export function SubcategoryCards({ parentCategory, selectedSubcategory, onSubcategorySelect }: SubcategoryCardsProps) {
//   const [api, setApi] = useState<CarouselApi>();
//   const [canScrollPrev, setCanScrollPrev] = useState(false);
//   const [canScrollNext, setCanScrollNext] = useState(false);

//   // Update the scroll buttons state when the carousel changes
//   useEffect(() => {
//     if (!api) return;

//     const onSelect = () => {
//       setCanScrollPrev(api.canScrollPrev());
//       setCanScrollNext(api.canScrollNext());
//     };

//     api.on("select", onSelect);
//     api.on("resize", onSelect);

//     // Initialize
//     onSelect();

//     return () => {
//       api.off("select", onSelect);
//       api.off("resize", onSelect);
//     };
//   }, [api]);

//   // Add debugging to see what's happening
//   useEffect(() => {
//     console.log("SubcategoryCards - parentCategory:", parentCategory);
//     console.log("SubcategoryCards - selectedSubcategory:", selectedSubcategory);
//     console.log("SubcategoryCards - available categories:", categories);
//     console.log("SubcategoryCards - available subcategories object:", subcategories);
//   }, [parentCategory, selectedSubcategory]);

//   // Get the parent category name from the ID
//   const getParentCategoryName = (): Category | undefined => {
//     // Log all transformations to debug case sensitivity issues
//     console.log("SubcategoryCards - categories array:", categories);

//     // Try direct match first
//     const directMatch = categories.find(cat => cat === parentCategory) as Category | undefined;
//     if (directMatch) {
//       console.log("SubcategoryCards - found direct match:", directMatch);
//       return directMatch;
//     }

//     // Try case-insensitive match
//     const lowerCaseMatch = categories.find(cat => cat.toLowerCase() === parentCategory?.toLowerCase()) as
//       | Category
//       | undefined;
//     if (lowerCaseMatch) {
//       console.log("SubcategoryCards - found lowercase match:", lowerCaseMatch);
//       return lowerCaseMatch;
//     }

//     // Try with dash replacement
//     const dashMatch = categories.find(cat => cat.toLowerCase().replace(/\s+/g, "-") === parentCategory) as
//       | Category
//       | undefined;
//     if (dashMatch) {
//       console.log("SubcategoryCards - found dash match:", dashMatch);
//       return dashMatch;
//     }

//     console.log("SubcategoryCards - no match found for:", parentCategory);
//     return undefined;
//   };

//   // Get subcategories for the parent category
//   const getSubcategories = (): string[] => {
//     const categoryName = getParentCategoryName();
//     if (categoryName && subcategories[categoryName]) {
//       console.log("SubcategoryCards - found subcategories:", subcategories[categoryName]);
//       return subcategories[categoryName];
//     }
//     console.log("SubcategoryCards - no subcategories found");
//     return [];
//   };

//   const availableSubcategories = getSubcategories();
//   console.log("SubcategoryCards - final available subcategories:", availableSubcategories);

//   // If no subcategories are available, don't render anything
//   if (availableSubcategories.length === 0) {
//     console.log("SubcategoryCards - no subcategories available, not rendering");
//     return null;
//   }

//   return (
//     <div className="w-full mt-4 relative group">
//       <Carousel setApi={setApi} className="w-full">
//         <CarouselContent className="-ml-2">
//           {/* Subcategories - No "All" card */}
//           {availableSubcategories.map(subcategory => {
//             const subcategoryId = subcategory.toLowerCase().replace(/\s+/g, "-");

//             return (
//               <CarouselItem key={subcategoryId} className="pl-2 basis-[150px]">
//                 <div
//                   className="h-full cursor-pointer transition-all rounded-lg overflow-hidden"
//                   onClick={() => onSubcategorySelect(subcategoryId)}>
//                   <div
//                     className={`h-[40px] flex items-center justify-center px-0.5 py-0.5
//   ${
//     selectedSubcategory === subcategoryId
//       ? "bg-gray-200 dark:bg-gray-200"
//       : "bg-neutral-200 dark:bg-neutral-800 hover:opacity-90"
//   }`}>
//                     <div className="w-full text-center">
//                       <span
//                         className={`font-medium text-sm
//                           ${
//                             selectedSubcategory === subcategoryId
//                               ? "text-neutral-800"
//                               : "text-neutral-800 dark:text-white"
//                           }`}>
//                         {subcategory}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </CarouselItem>
//             );
//           })}
//         </CarouselContent>

//         {/* Navigation buttons with improved styling */}
//         {canScrollPrev && (
//           <CarouselPrevious
//             className="absolute left-0 -translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-md border-neutral-200
//                       opacity-0 group-hover:opacity-100 transition-opacity
//                       disabled:opacity-0 disabled:pointer-events-none"
//           />
//         )}
//         {canScrollNext && (
//           <CarouselNext
//             className="absolute right-0 translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-md border-neutral-200
//                       opacity-0 group-hover:opacity-100 transition-opacity
//                       disabled:opacity-0 disabled:pointer-events-none"
//           />
//         )}
//       </Carousel>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
} from "@/components/ui/carousel";
import type { Category } from "@/config/categories";
import { subcategories, categories } from "@/config/categories";
import { Check } from "lucide-react";

interface SubcategoryCardsProps {
  parentCategory: string;
  selectedSubcategory: string | null;
  onSubcategorySelect: (subcategoryId: string | null) => void;
}

export function SubcategoryCards({ parentCategory, selectedSubcategory, onSubcategorySelect }: SubcategoryCardsProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Update the scroll buttons state when the carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on("select", onSelect);
    api.on("resize", onSelect);

    // Initialize
    onSelect();

    return () => {
      api.off("select", onSelect);
      api.off("resize", onSelect);
    };
  }, [api]);

  // Add debugging to see what's happening
  useEffect(() => {
    console.log("SubcategoryCards - parentCategory:", parentCategory);
    console.log("SubcategoryCards - selectedSubcategory:", selectedSubcategory);
    console.log("SubcategoryCards - available categories:", categories);
    console.log("SubcategoryCards - available subcategories object:", subcategories);
  }, [parentCategory, selectedSubcategory]);

  // Get the parent category name from the ID
  const getParentCategoryName = (): Category | undefined => {
    // Log all transformations to debug case sensitivity issues
    console.log("SubcategoryCards - categories array:", categories);

    // Try direct match first
    const directMatch = categories.find(cat => cat === parentCategory) as Category | undefined;
    if (directMatch) {
      console.log("SubcategoryCards - found direct match:", directMatch);
      return directMatch;
    }

    // Try case-insensitive match
    const lowerCaseMatch = categories.find(cat => cat.toLowerCase() === parentCategory?.toLowerCase()) as
      | Category
      | undefined;
    if (lowerCaseMatch) {
      console.log("SubcategoryCards - found lowercase match:", lowerCaseMatch);
      return lowerCaseMatch;
    }

    // Try with dash replacement
    const dashMatch = categories.find(cat => cat.toLowerCase().replace(/\s+/g, "-") === parentCategory) as
      | Category
      | undefined;
    if (dashMatch) {
      console.log("SubcategoryCards - found dash match:", dashMatch);
      return dashMatch;
    }

    console.log("SubcategoryCards - no match found for:", parentCategory);
    return undefined;
  };

  // Get subcategories for the parent category
  const getSubcategories = (): string[] => {
    const categoryName = getParentCategoryName();
    if (categoryName && subcategories[categoryName]) {
      console.log("SubcategoryCards - found subcategories:", subcategories[categoryName]);
      return subcategories[categoryName];
    }
    console.log("SubcategoryCards - no subcategories found");
    return [];
  };

  const availableSubcategories = getSubcategories();
  console.log("SubcategoryCards - final available subcategories:", availableSubcategories);

  // If no subcategories are available, don't render anything
  if (availableSubcategories.length === 0) {
    console.log("SubcategoryCards - no subcategories available, not rendering");
    return null;
  }

  return (
    <div className="w-full mt-4 relative group">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-2">
          {/* Subcategories - No "All" card */}
          {availableSubcategories.map(subcategory => {
            const subcategoryId = subcategory.toLowerCase().replace(/\s+/g, "-");
            const isSelected = selectedSubcategory === subcategoryId;

            return (
              <CarouselItem key={subcategoryId} className="pl-2 basis-[150px]">
                <div
                  className="h-full cursor-pointer transition-all rounded-lg overflow-hidden"
                  onClick={() => onSubcategorySelect(subcategoryId)}>
                  <div
                    className={`h-[40px] flex items-center justify-center px-3 py-0.5 rounded-lg relative
                      ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 dark:bg-accent dark:text-accent-foreground dark:ring-accent/50" // Enhanced selected state
                          : "bg-black text-white hover:opacity-90 dark:bg-white dark:text-black" // Default state
                      }`}>
                    <div className="w-full text-center flex items-center justify-center gap-1.5">
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                      <span className="font-medium text-sm">{subcategory}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation buttons with improved styling */}
        {canScrollPrev && (
          <CarouselPrevious
            className="absolute left-0 -translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-md border-neutral-200 
                      opacity-0 group-hover:opacity-100 transition-opacity
                      disabled:opacity-0 disabled:pointer-events-none"
          />
        )}
        {canScrollNext && (
          <CarouselNext
            className="absolute right-0 translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-md border-neutral-200 
                      opacity-0 group-hover:opacity-100 transition-opacity
                      disabled:opacity-0 disabled:pointer-events-none"
          />
        )}
      </Carousel>
    </div>
  );
}
