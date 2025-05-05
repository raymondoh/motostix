//src/utils/category-icons.ts
import {
  Bike,
  Truck,
  Mountain,
  Paintbrush,
  Flame,
  Shield,
  Sparkles,
  Star,
  Zap,
  Compass,
  PenToolIcon as Tool,
  Award,
  Heart,
  Skull,
  Leaf,
  Droplet,
  Grid,
  Film,
  Music
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map of category IDs to icon components
export const categoryIcons: Record<string, LucideIcon> = {
  // All categories
  all: Grid,

  // New categories from your logs
  film: Film,
  music: Music,

  // Sport bikes
  "sport-bike": Bike,
  racing: Flame,
  performance: Zap,

  // Cruisers
  cruiser: Truck,
  touring: Compass,

  // Off-road
  "off-road": Mountain,
  "dirt-bike": Mountain,
  adventure: Compass,

  // Styles
  custom: Paintbrush,
  vintage: Star,
  porn: Star,

  // Features
  protective: Shield,
  reflective: Sparkles,
  premium: Award,
  waterproof: Droplet,

  // Themes
  skull: Skull,
  nature: Leaf,
  love: Heart,

  // Fallback for maintenance
  maintenance: Tool,
  repair: Tool

  // Add more mappings as needed
};

// Default icon if no mapping exists
export const DefaultIcon = Bike;

/**
 * Get the appropriate icon component for a category
 */
export function getCategoryIcon(categoryId: string): LucideIcon {
  return categoryIcons[categoryId] || DefaultIcon;
}

/**
 * Assign an icon to a category based on its name or other properties
 * This is useful when you don't have explicit icon assignments
 */
export function assignCategoryIcon(categoryName: string): LucideIcon {
  // Convert to lowercase for case-insensitive matching
  const name = categoryName.toLowerCase();

  // Try to match based on common keywords
  if (name.includes("all")) return Grid;
  if (name.includes("film") || name.includes("movie")) return Film;
  if (name.includes("music") || name.includes("audio")) return Music;
  if (name.includes("sport") || name.includes("bike")) return Bike;
  if (name.includes("cruiser") || name.includes("touring")) return Truck;
  if (name.includes("off-road") || name.includes("dirt") || name.includes("adventure")) return Mountain;
  if (name.includes("custom") || name.includes("paint")) return Paintbrush;
  if (name.includes("racing") || name.includes("speed") || name.includes("fast")) return Flame;
  if (name.includes("protect") || name.includes("safety")) return Shield;
  if (name.includes("reflect") || name.includes("light") || name.includes("glow")) return Sparkles;
  if (name.includes("premium") || name.includes("luxury") || name.includes("elite")) return Star;

  // Default fallback
  return DefaultIcon;
}
