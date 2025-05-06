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
              className="h-full cursor-pointer transition-all rounded-lg overflow-hidden"
              onClick={() => onCategorySelect(null)}>
              <div
                className={`h-[60px] flex items-center justify-center p-2
                  ${
                    selectedCategory === null || selectedCategory === "all"
                      ? "bg-gray-200 dark:bg-gray-200"
                      : "bg-neutral-200 dark:bg-neutral-800 hover:opacity-90"
                  }`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-1.5">
                    <AllIcon
                      className={`h-5 w-5 
                        ${
                          selectedCategory === null || selectedCategory === "all"
                            ? "text-neutral-800"
                            : "text-neutral-800 dark:text-white"
                        }`}
                    />
                  </div>
                  <div className="truncate">
                    <span
                      className={`font-medium text-xs uppercase
                        ${
                          selectedCategory === null || selectedCategory === "all"
                            ? "text-neutral-800"
                            : "text-neutral-800 dark:text-white"
                        }`}>
                      All Categories
                    </span>
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
                  className="h-full cursor-pointer transition-all rounded-lg overflow-hidden"
                  onClick={() => onCategorySelect(category.id)}>
                  <div
                    className={`h-[60px] flex items-center justify-center p-2
                      ${
                        selectedCategory === category.id
                          ? "bg-gray-200 dark:bg-gray-200"
                          : "bg-neutral-200 dark:bg-neutral-800 hover:opacity-90"
                      }`}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-1.5">
                        <IconComponent
                          className={`h-5 w-5 
                            ${
                              selectedCategory === category.id ? "text-neutral-800" : "text-neutral-800 dark:text-white"
                            }`}
                        />
                      </div>
                      <div className="truncate">
                        <span
                          className={`font-medium text-xs uppercase
                            ${
                              selectedCategory === category.id ? "text-neutral-800" : "text-neutral-800 dark:text-white"
                            }`}>
                          {category.name}
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
