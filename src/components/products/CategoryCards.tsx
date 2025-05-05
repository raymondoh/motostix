"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { getCategoryIcon, DefaultIcon } from "@/utils/category-icons";
import type { CategoryData } from "@/config/categories";

interface CategoryCardsProps {
  categories: CategoryData[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryCards({ categories, selectedCategory, onCategorySelect }: CategoryCardsProps) {
  const AllIcon = getCategoryIcon("all");

  return (
    <div className="w-full mt-8">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2">
          {/* "All" category */}
          <CarouselItem key="all" className="pl-2 basis-[180px]">
            <div
              className={`h-full cursor-pointer transition-all rounded-lg overflow-hidden
                ${
                  selectedCategory === null || selectedCategory === "all"
                    ? "border-2 border-white dark:border-neutral-600"
                    : "hover:opacity-90"
                }`}
              onClick={() => onCategorySelect(null)}>
              <div className="h-[80px] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <AllIcon className="h-8 w-8 text-neutral-800 dark:text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-sm text-neutral-800 dark:text-white uppercase">Categories</span>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Dynamic categories */}
          {categories.map(category => {
            const IconComponent = category.icon ? getCategoryIcon(category.icon) : DefaultIcon;

            return (
              <CarouselItem key={category.id} className="pl-2 basis-[180px]">
                <div
                  className={`h-full cursor-pointer transition-all rounded-lg overflow-hidden
                    ${
                      selectedCategory === category.id
                        ? "border-2 border-white dark:border-neutral-600"
                        : "hover:opacity-90"
                    }`}
                  onClick={() => onCategorySelect(category.id)}>
                  <div className="h-[80px] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center p-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <IconComponent className="h-8 w-8 text-neutral-800 dark:text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-neutral-800 dark:text-white uppercase">
                          {category.name}{" "}
                          {category.count > 0 && (
                            <span className="text-neutral-600 dark:text-neutral-400">({category.count})</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
