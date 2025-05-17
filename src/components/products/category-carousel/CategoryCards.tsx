// "use client";

// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
// import { categoryIcons, DefaultIcon } from "@/utils/category-icons";
// import type { CategoryData } from "@/config/categories";
// import { Check } from "lucide-react";

// interface CategoryCardsProps {
//   categories: CategoryData[];
//   selectedCategory: string | null;
//   onCategorySelect: (categoryId: string | null) => void;
// }

// export function CategoryCards({ categories, selectedCategory, onCategorySelect }: CategoryCardsProps) {
//   const AllIcon = categoryIcons["all"] ?? DefaultIcon;

//   return (
//     <div className="w-full mt-8 relative group">
//       <Carousel className="w-full">
//         <CarouselContent className="-ml-2">
//           {/* "All" category - now square with just the icon */}
//           <CarouselItem key="all" className="pl-2 basis-[64px]">
//             <div
//               className="h-full cursor-pointer transition-all rounded-lg overflow-hidden"
//               onClick={() => onCategorySelect(null)}>
//               <div
//                 className={`h-[50px] w-[50px] flex items-center justify-center p-2 rounded-lg relative
//                   ${
//                     selectedCategory === null || selectedCategory === "all"
//                       ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 dark:bg-accent dark:text-accent-foreground dark:ring-accent/50"
//                       : "bg-black text-white hover:opacity-90 dark:bg-white dark:text-black"
//                   }`}>
//                 {(selectedCategory === null || selectedCategory === "all") && (
//                   <div className="absolute top-1 right-1" />
//                 )}
//                 <AllIcon className="h-5 w-5" />
//               </div>
//             </div>
//           </CarouselItem>

//           {/* Dynamic categories */}
//           {categories.map(category => {
//             const IconComponent = categoryIcons[category.icon ?? ""] ?? DefaultIcon;
//             const isSelected = selectedCategory === category.id;

//             return (
//               <CarouselItem key={category.id} className="pl-2 basis-[180px]">
//                 <div
//                   className="h-full cursor-pointer transition-all rounded-lg overflow-hidden"
//                   onClick={() => onCategorySelect(category.id)}>
//                   <div
//                     className={`h-[50px] flex items-center justify-center px-3 py-2 rounded-lg relative
//                       ${
//                         isSelected
//                           ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 dark:bg-accent dark:text-accent-foreground dark:ring-accent/50"
//                           : "bg-black text-white hover:opacity-90 dark:bg-white dark:text-black"
//                       }`}>
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 mr-1.5">
//                         <IconComponent className="h-4 w-4" />
//                       </div>
//                       <div className="truncate flex items-center gap-1.5">
//                         {isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
//                         <span className="font-bold text-xs uppercase">{category.name}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CarouselItem>
//             );
//           })}
//         </CarouselContent>

//         {/* Navigation buttons with improved styling */}
//         <CarouselPrevious
//           className="absolute left-0 -translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-md border-neutral-200
//                      opacity-0 group-hover:opacity-100 transition-opacity
//                      disabled:opacity-0 disabled:pointer-events-none"
//         />
//         <CarouselNext
//           className="absolute right-0 translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-md border-neutral-200
//                      opacity-0 group-hover:opacity-100 transition-opacity
//                      disabled:opacity-0 disabled:pointer-events-none"
//         />
//       </Carousel>
//     </div>
//   );
// }
"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { categoryIcons, DefaultIcon } from "@/utils/category-icons";
import type { CategoryData } from "@/config/categories";
import { cn } from "@/lib/utils"; // small utility wrapper around classNames
import { Check } from "lucide-react";

interface CategoryCardsProps {
  categories: CategoryData[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryCards({ categories, selectedCategory, onCategorySelect }: CategoryCardsProps) {
  const AllIcon = categoryIcons["all"] ?? DefaultIcon;

  // Shared button styles
  const baseBtn =
    "w-full h-[50px] flex items-center justify-center rounded-lg transition-all px-2 py-2 gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const selectedStyles =
    "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50 dark:bg-accent dark:text-accent-foreground dark:ring-accent/50";
  const defaultStyles = "bg-black text-white hover:opacity-90 dark:bg-white dark:text-black";

  // Uniform slide width for every card.
  const slideWidth = "basis-[128px]"; // ≈128 px keeps four‑ish cards visible on most phones.

  return (
    <div className="w-full mt-8 relative group">
      <Carousel className="w-full">
        {/* consistent 8 px gutter via -ml-2 + pl-2 */}
        <CarouselContent className="-ml-2">
          {/* "All" card (same width as others) */}
          <CarouselItem key="all" className={`pl-2 ${slideWidth}`}>
            <button
              type="button"
              aria-label="Show all categories"
              onClick={() => onCategorySelect(null)}
              className={cn(
                baseBtn,
                selectedCategory === null || selectedCategory === "all" ? selectedStyles : defaultStyles
              )}>
              <AllIcon className="h-5 w-5" />
              {/* Optional label — uncomment if you want text on the "All" card */}
              {/* <span className="font-bold text-xs uppercase">All</span> */}
            </button>
          </CarouselItem>

          {categories.map(category => {
            const IconComponent = categoryIcons[category.icon ?? ""] ?? DefaultIcon;
            const isSelected = selectedCategory === category.id;

            return (
              <CarouselItem key={category.id} className={`pl-2 ${slideWidth}`} value={category.id}>
                <button
                  type="button"
                  aria-label={`Filter by ${category.name}`}
                  onClick={() => onCategorySelect(category.id)}
                  className={cn(baseBtn, isSelected ? selectedStyles : defaultStyles)}>
                  <IconComponent className="h-4 w-4 shrink-0" />
                  <span className="font-bold text-xs uppercase truncate">{category.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation */}
        <CarouselPrevious className="absolute left-0 -translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-md border-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 disabled:pointer-events-none" />
        <CarouselNext className="absolute right-0 translate-x-1/2 bg-background/80 backdrop-blur-sm shadow-md border-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 disabled:pointer-events-none" />
      </Carousel>
    </div>
  );
}
