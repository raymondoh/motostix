// // Define the base category names as string literals
// export const categories = ["Cars", "Motorbikes", "Bicycles", "EVs", "Other"] as const;

// // CategoryName is a string literal type (for type checking)
// export type Category = (typeof categories)[number];

// // CategoryData is the full interface with all properties
// export interface CategoryData {
//   id: string;
//   name: string;
//   count: number;
//   image?: string;
//   icon?: string; // This will be used to look up the icon component
// }

// // Define subcategories
// export const subcategories: Record<Category, string[]> = {
//   Cars: ["Sports Cars", "Luxury Cars", "SUVs", "Off-road / 4x4"],
//   Motorbikes: ["Harley-Davidson", "Sport Bikes", "Custom Motorcycles", "Dirt Bikes"],
//   Bicycles: ["Mountain Bikes", "Road Bikes", "BMX", "Cruiser Bikes"],
//   EVs: ["Electric Cars", "Electric Bikes", "Electric Scooters"],
//   Other: ["Vans", "Trucks", "Scooters"]
// };

// // Helper function to convert a Category to CategoryData
// export function categoryToData(categoryName: Category): CategoryData {
//   const id = categoryName.toLowerCase().replace(/\s+/g, "-");
//   return {
//     id,
//     name: categoryName,
//     count: 0, // Default count, update if you have actual counts
//     icon: id // Set the icon property to the category ID
//   };
// }

// // Helper function to convert an array of Categories to CategoryData[]
// export function categoriesToData(categoryNames: Category[]): CategoryData[] {
//   return categoryNames.map(categoryToData);
// }
// Define the base category names as string literals
export const categories = ["Cars", "Motorbikes", "Bicycles", "EVs", "Other"] as const;

// CategoryName is a string literal type (for type checking)
export type Category = (typeof categories)[number];

// CategoryData is the full interface with all properties
export interface CategoryData {
  id: string;
  name: string;
  count: number;
  image?: string;
  icon?: string;
}

// Define subcategories
export const subcategories: Record<Category, string[]> = {
  Cars: ["Sports Cars", "Luxury Cars", "SUVs", "Off-road / 4x4"],
  Motorbikes: ["Harley-Davidson", "Sport Bikes", "Custom", "Dirt Bikes"],
  Bicycles: ["Mountain Bikes", "Road Bikes", "BMX", "Cruiser Bikes"],
  EVs: ["Electric Cars", "Electric Bikes", "Electric Scooters"],
  Other: ["Vans", "Trucks", "Scooters"]
};

// Helper function to convert a Category to CategoryData
export function categoryToData(categoryName: Category): CategoryData {
  const id = categoryName.toLowerCase().replace(/\s+/g, "-");
  return {
    id,
    name: categoryName,
    count: 0, // Default count, update if you have actual counts
    icon: id // Set the icon property to the category ID
  };
}

// Helper function to convert an array of Categories to CategoryData[]
export function categoriesToData(categoryNames: Category[]): CategoryData[] {
  return categoryNames.map(categoryToData);
}
