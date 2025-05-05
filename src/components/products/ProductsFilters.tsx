"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { X } from "lucide-react";
import { categories, subcategories } from "@/config/categories";
import type { Category, CategoryData } from "@/config/categories";

interface ProductsFiltersProps {
  onClose?: () => void;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
  categoriesData?: CategoryData[];
}

export function ProductsFilters({
  onClose,
  selectedCategory,
  onCategoryChange,
  categoriesData = []
}: ProductsFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 100]);

  // Get the display name for a category ID
  const getCategoryDisplayName = (categoryId: string): string => {
    // First check if we can find it in categoriesData
    const categoryData = categoriesData.find(cat => cat.id === categoryId);
    if (categoryData) {
      return categoryData.name;
    }

    // If not found in categoriesData, try to find it in the categories array
    const categoryName = categories.find(cat => cat.toLowerCase().replace(/\s+/g, "-") === categoryId);
    if (categoryName) {
      return categoryName;
    }

    // Fallback to formatting the ID
    return categoryId
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get subcategories for the selected category
  const getSubcategories = (categoryId: string | null): string[] => {
    if (!categoryId) return [];

    // Try to find the category in our config
    const categoryName = categories.find(cat => cat.toLowerCase().replace(/\s+/g, "-") === categoryId) as
      | Category
      | undefined;

    if (categoryName && subcategories[categoryName]) {
      return subcategories[categoryName];
    }

    // Fallback to empty array if no subcategories found
    return [];
  };

  // Handle category checkbox change
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (onCategoryChange) {
      onCategoryChange(checked ? category : null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["category", "price", "material"]}>
        <AccordionItem value="category">
          <AccordionTrigger>
            {selectedCategory && selectedCategory !== "all"
              ? `${getCategoryDisplayName(selectedCategory)} Subcategories`
              : "Categories"}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {/* Always show the "All Categories" option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-all"
                  checked={selectedCategory === "all" || !selectedCategory}
                  onCheckedChange={checked => {
                    if (checked) handleCategoryChange("all", true);
                  }}
                />
                <label
                  htmlFor="category-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  All Categories
                </label>
              </div>

              {selectedCategory && selectedCategory !== "all" ? (
                // Show subcategories when a main category is selected
                getSubcategories(selectedCategory).length > 0 ? (
                  getSubcategories(selectedCategory).map(subcategory => (
                    <div key={subcategory} className="flex items-center space-x-2 ml-4">
                      <Checkbox id={`subcategory-${subcategory.toLowerCase().replace(/\s+/g, "-")}`} />
                      <label
                        htmlFor={`subcategory-${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {subcategory}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground ml-4">No subcategories available</p>
                )
              ) : (
                // Show main categories when no main category is selected or "all" is selected
                categoriesData.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={category.id === selectedCategory}
                      onCheckedChange={checked => {
                        handleCategoryChange(category.id, !!checked);
                      }}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {category.name}
                    </label>
                  </div>
                ))
              )}
            </div>

            {selectedCategory && selectedCategory !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryChange("all", true)}
                className="mt-2 text-xs">
                ← Back to all categories
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 100]} max={100} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">£{priceRange[0]}</span>
                <span className="text-sm font-medium">£{priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rest of the accordion items remain the same */}
        <AccordionItem value="material">
          <AccordionTrigger>Material</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Vinyl", "Reflective", "Matte", "Glossy", "Waterproof"].map(material => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox id={`material-${material.toLowerCase()}`} />
                  <label
                    htmlFor={`material-${material.toLowerCase()}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {material}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Red", color: "bg-red-500" },
                { name: "Blue", color: "bg-blue-500" },
                { name: "Green", color: "bg-green-500" },
                { name: "Yellow", color: "bg-yellow-500" },
                { name: "Black", color: "bg-black" },
                { name: "White", color: "bg-white border border-gray-200" }
              ].map(color => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full ${color.color} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                  title={color.name}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stickySide">
          <AccordionTrigger>Sticky Side</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Front", "Back"].map(side => (
                <div key={side} className="flex items-center space-x-2">
                  <Checkbox id={`side-${side.toLowerCase()}`} />
                  <label
                    htmlFor={`side-${side.toLowerCase()}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {side}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center gap-2 pt-4">
        <Button className="w-full" variant="outline" onClick={() => onCategoryChange?.("all")}>
          Reset
        </Button>
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  );
}
