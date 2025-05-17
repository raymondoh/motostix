import type { Product } from "@/types/product";

// Sample products with all fields populated to demonstrate the complete product type
export const sampleProducts: Omit<Product, "id" | "createdAt" | "updatedAt">[] = [
  {
    // Basic Information
    name: "Cosmic Galaxy Vinyl Sticker",
    description: "A vibrant cosmic galaxy design perfect for laptops, water bottles, and more.",
    details:
      "This premium vinyl sticker features a stunning cosmic galaxy design with vibrant purples, blues, and pinks. Waterproof and UV-resistant for long-lasting color.",
    sku: "STK-COSMIC-001",
    barcode: "7891234567890",

    // Classification
    category: "Stickers",
    subcategory: "Vinyl Stickers",
    designThemes: ["Space", "Galaxy", "Abstract"],
    productType: "Die-Cut Sticker",
    tags: ["Waterproof", "Durable", "Colorful", "Space"],
    brand: "StickerVerse",
    manufacturer: "Premium Vinyl Co.",

    // Specifications
    dimensions: "3 x 3 inches",
    weight: "0.01 lbs",
    shippingWeight: "0.05 lbs",
    material: "Vinyl",
    finish: "Glossy",
    color: "#5B3E96",
    baseColor: "purple",
    colorDisplayName: "Cosmic Purple",
    stickySide: "Back",
    size: "Medium",

    // Media
    image: "/placeholder-im3mi.png",
    additionalImages: ["/placeholder-kdxyd.png", "/placeholder-mdnl9.png"],
    placements: ["Laptop", "Water Bottle", "Phone Case"],

    // Pricing and Inventory
    price: 4.99,
    salePrice: 3.99,
    onSale: true,
    costPrice: 1.25,
    stockQuantity: 250,
    lowStockThreshold: 50,
    shippingClass: "Standard",

    // Status
    inStock: true,
    badge: "Sale",
    isFeatured: true,
    isHero: true,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: false
  },
  {
    // Basic Information
    name: "Mountain Adventure Holographic Sticker",
    description: "A stunning holographic mountain scene that changes colors as it catches the light.",
    details:
      "This premium holographic sticker features a mountain landscape that shifts colors in different lighting. Waterproof and scratch-resistant for outdoor use.",
    sku: "STK-HOLO-002",
    barcode: "7891234567891",

    // Classification
    category: "Stickers",
    subcategory: "Holographic Stickers",
    designThemes: ["Nature", "Mountains", "Adventure"],
    productType: "Die-Cut Sticker",
    tags: ["Holographic", "Outdoor", "Waterproof", "Nature"],
    brand: "StickerVerse",
    manufacturer: "Holo Premium Co.",

    // Specifications
    dimensions: "4 x 2 inches",
    weight: "0.01 lbs",
    shippingWeight: "0.05 lbs",
    material: "Holographic Vinyl",
    finish: "Holographic",
    color: "#4CAF50",
    baseColor: "green",
    colorDisplayName: "Forest Green",
    stickySide: "Back",
    size: "Medium",

    // Media
    image: "/placeholder-ih8wu.png",
    additionalImages: [
      "/placeholder-qwe93.png",
      "/placeholder.svg?height=500&width=500&query=Mountain%20Holographic%20Sticker%20on%20Water%20Bottle"
    ],
    placements: ["Water Bottle", "Laptop", "Notebook"],

    // Pricing and Inventory
    price: 5.99,
    costPrice: 1.75,
    stockQuantity: 175,
    lowStockThreshold: 35,
    shippingClass: "Standard",

    // Status
    inStock: true,
    badge: "New",
    isFeatured: false,
    isHero: false,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: true
  },
  {
    // Basic Information
    name: "Cute Succulent Plant Sticker Pack",
    description: "A set of 5 adorable succulent plant stickers for plant lovers.",
    details:
      "This pack includes 5 different succulent designs, each printed on premium matte vinyl. Perfect for decorating planners, journals, or plant pots.",
    sku: "STK-PLANT-003",
    barcode: "7891234567892",

    // Classification
    category: "Sticker Packs",
    subcategory: "Plant Stickers",
    designThemes: ["Plants", "Cute", "Botanical"],
    productType: "Sticker Sheet",
    tags: ["Plants", "Cute", "Set", "Gift"],
    brand: "PlantPals",
    manufacturer: "Eco Sticker Co.",

    // Specifications
    dimensions: "5 x 7 inches (sheet)",
    weight: "0.03 lbs",
    shippingWeight: "0.08 lbs",
    material: "Matte Vinyl",
    finish: "Matte",
    color: "#8BC34A",
    baseColor: "green",
    colorDisplayName: "Plant Green",
    stickySide: "Back",
    size: "Small",

    // Media
    image: "/placeholder.svg?height=500&width=500&query=Cute%20Succulent%20Plant%20Sticker%20Pack",
    additionalImages: [
      "/placeholder.svg?height=500&width=500&query=Succulent%20Sticker%20Pack%20Individual%20Stickers",
      "/placeholder.svg?height=500&width=500&query=Succulent%20Stickers%20on%20Journal"
    ],
    placements: ["Journal", "Planner", "Laptop", "Plant Pot"],

    // Pricing and Inventory
    price: 8.99,
    salePrice: 6.99,
    onSale: true,
    costPrice: 2.5,
    stockQuantity: 120,
    lowStockThreshold: 25,
    shippingClass: "Standard",

    // Status
    inStock: true,
    badge: "Sale",
    isFeatured: true,
    isHero: false,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: false
  },
  {
    // Basic Information
    name: "Retro Wave Sunset Bumper Sticker",
    description: "A nostalgic 80s-inspired sunset design perfect for car bumpers or large surfaces.",
    details:
      "This large format bumper sticker features a retro vaporwave sunset design with vibrant pinks and purples. Made with weather-resistant vinyl for outdoor durability.",
    sku: "STK-BUMPER-004",
    barcode: "7891234567893",

    // Classification
    category: "Stickers",
    subcategory: "Bumper Stickers",
    designThemes: ["Retro", "80s", "Vaporwave"],
    productType: "Bumper Sticker",
    tags: ["Car", "Outdoor", "Retro", "Weatherproof"],
    brand: "RetroWave",
    manufacturer: "Auto Decal Pro",

    // Specifications
    dimensions: "10 x 3 inches",
    weight: "0.05 lbs",
    shippingWeight: "0.1 lbs",
    material: "Weather-Resistant Vinyl",
    finish: "Glossy",
    color: "#FF1493",
    baseColor: "pink",
    colorDisplayName: "Neon Pink",
    stickySide: "Back",
    size: "Large",

    // Media
    image: "/placeholder.svg?height=500&width=500&query=Retro%20Wave%20Sunset%20Bumper%20Sticker",
    additionalImages: [
      "/placeholder.svg?height=500&width=500&query=Retro%20Wave%20Bumper%20Sticker%20on%20Car",
      "/placeholder.svg?height=500&width=500&query=Retro%20Wave%20Bumper%20Sticker%20Close%20Up"
    ],
    placements: ["Car Bumper", "Laptop", "Skateboard"],

    // Pricing and Inventory
    price: 7.99,
    costPrice: 2.25,
    stockQuantity: 85,
    lowStockThreshold: 20,
    shippingClass: "Standard",

    // Status
    inStock: true,
    isFeatured: false,
    isHero: false,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: false
  },
  {
    // Basic Information
    name: "Custom Name Decal",
    description: "Personalized name decal available in multiple fonts and colors.",
    details:
      "Create your own custom name decal for walls, laptops, or any smooth surface. Choose from 10 fonts and 15 colors. Minimum 3 characters, maximum 15.",
    sku: "DCL-CUSTOM-005",
    barcode: "7891234567894",

    // Classification
    category: "Decals",
    subcategory: "Wall Decals",
    designThemes: ["Custom", "Typography", "Personalized"],
    productType: "Custom Decal",
    tags: ["Custom", "Personalized", "Name", "Gift"],
    brand: "CustomCuts",
    manufacturer: "Personalization Pro",

    // Specifications
    dimensions: "Varies by name length",
    weight: "0.02 lbs",
    shippingWeight: "0.07 lbs",
    material: "Removable Vinyl",
    finish: "Matte",
    color: "#000000",
    baseColor: "black",
    colorDisplayName: "Classic Black",
    stickySide: "Back",
    size: "Custom",

    // Media
    image: "/placeholder.svg?height=500&width=500&query=Custom%20Name%20Decal",
    additionalImages: [
      "/placeholder.svg?height=500&width=500&query=Custom%20Name%20Decal%20on%20Wall",
      "/placeholder.svg?height=500&width=500&query=Custom%20Name%20Decal%20Font%20Options"
    ],
    placements: ["Wall", "Laptop", "Window", "Car"],

    // Pricing and Inventory
    price: 12.99,
    costPrice: 3.5,
    stockQuantity: 999,
    lowStockThreshold: 50,
    shippingClass: "Standard",

    // Status
    inStock: true,
    isFeatured: true,
    isHero: false,
    isLiked: false,
    isCustomizable: true,
    isNewArrival: false
  },
  {
    // Basic Information
    name: "Minimalist Moon Phases Window Cling",
    description: "Elegant moon phases design that clings to windows without adhesive.",
    details:
      "This static cling decal features the phases of the moon in a minimalist design. Easily removable and reusable with no adhesive residue.",
    sku: "CLING-MOON-006",
    barcode: "7891234567895",

    // Classification
    category: "Window Clings",
    subcategory: "Static Clings",
    designThemes: ["Celestial", "Minimalist", "Moon"],
    productType: "Static Cling",
    tags: ["Window", "Removable", "Reusable", "Moon"],
    brand: "LunarDecor",
    manufacturer: "Static Cling Specialists",

    // Specifications
    dimensions: "12 x 4 inches",
    weight: "0.04 lbs",
    shippingWeight: "0.09 lbs",
    material: "Static Cling Vinyl",
    finish: "Semi-Transparent",
    color: "#E0E0E0",
    baseColor: "white",
    colorDisplayName: "Silver Moon",
    stickySide: "Front",
    size: "Medium",

    // Media
    image: "/placeholder.svg?height=500&width=500&query=Minimalist%20Moon%20Phases%20Window%20Cling",
    additionalImages: [
      "/placeholder.svg?height=500&width=500&query=Moon%20Phases%20Window%20Cling%20on%20Window",
      "/placeholder.svg?height=500&width=500&query=Moon%20Phases%20Window%20Cling%20Close%20Up"
    ],
    placements: ["Window", "Mirror", "Glass Door"],

    // Pricing and Inventory
    price: 9.99,
    costPrice: 2.75,
    stockQuantity: 65,
    lowStockThreshold: 15,
    shippingClass: "Fragile",

    // Status
    inStock: true,
    badge: "Bestseller",
    isFeatured: true,
    isHero: false,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: false
  },
  {
    // Basic Information
    name: "Geometric Animal Heat Transfer",
    description: "Iron-on geometric animal designs for customizing clothing and fabric items.",
    details:
      "This heat transfer vinyl design features a geometric fox that can be ironed onto t-shirts, tote bags, and other fabric items. Includes detailed application instructions.",
    sku: "HTV-GEO-007",
    barcode: "7891234567896",

    // Classification
    category: "Heat Transfers",
    subcategory: "Clothing Transfers",
    designThemes: ["Geometric", "Animals", "Modern"],
    productType: "Heat Transfer Vinyl",
    tags: ["DIY", "Clothing", "Iron-on", "Fox"],
    brand: "FabricFusion",
    manufacturer: "HTV Specialists",

    // Specifications
    dimensions: "6 x 6 inches",
    weight: "0.03 lbs",
    shippingWeight: "0.08 lbs",
    material: "Heat Transfer Vinyl",
    finish: "Matte",
    color: "#FF5722",
    baseColor: "orange",
    colorDisplayName: "Fox Orange",
    stickySide: "Back",
    size: "Medium",

    // Media
    image: "/placeholder.svg?height=500&width=500&query=Geometric%20Animal%20Heat%20Transfer",
    additionalImages: [
      "/placeholder.svg?height=500&width=500&query=Geometric%20Fox%20Heat%20Transfer%20on%20Shirt",
      "/placeholder.svg?height=500&width=500&query=Geometric%20Fox%20Heat%20Transfer%20Application"
    ],
    placements: ["T-shirt", "Tote Bag", "Hoodie"],

    // Pricing and Inventory
    price: 8.99,
    salePrice: 7.49,
    onSale: true,
    costPrice: 2.25,
    stockQuantity: 42,
    lowStockThreshold: 10,
    shippingClass: "Standard",

    // Status
    inStock: true,
    badge: "Sale",
    isFeatured: false,
    isHero: false,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: false
  },
  {
    // Basic Information
    name: "Inspirational Quote Wall Decal",
    description: "Large inspirational quote decal for home or office walls.",
    details:
      "This premium wall decal features the quote 'Dream Big, Work Hard, Stay Focused' in an elegant script font. Easy to apply and remove without damaging walls.",
    sku: "WALL-QUOTE-008",
    barcode: "7891234567897",

    // Classification
    category: "Decals",
    subcategory: "Wall Decals",
    designThemes: ["Typography", "Inspirational", "Home Decor"],
    productType: "Wall Decal",
    tags: ["Quote", "Home", "Office", "Motivational"],
    brand: "WallWisdom",
    manufacturer: "Decor Vinyl Co.",

    // Specifications
    dimensions: "24 x 12 inches",
    weight: "0.2 lbs",
    shippingWeight: "0.3 lbs",
    material: "Removable Vinyl",
    finish: "Matte",
    color: "#212121",
    baseColor: "black",
    colorDisplayName: "Deep Black",
    stickySide: "Back",
    size: "Large",

    // Media
    image: "/placeholder.svg?height=500&width=500&query=Inspirational%20Quote%20Wall%20Decal",
    additionalImages: [
      "/placeholder.svg?height=500&width=500&query=Quote%20Wall%20Decal%20in%20Office",
      "/placeholder.svg?height=500&width=500&query=Quote%20Wall%20Decal%20Application"
    ],
    placements: ["Living Room Wall", "Office Wall", "Bedroom Wall"],

    // Pricing and Inventory
    price: 19.99,
    costPrice: 5.5,
    stockQuantity: 28,
    lowStockThreshold: 10,
    shippingClass: "Large Item",

    // Status
    inStock: true,
    isFeatured: false,
    isHero: false,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: true
  },
  {
    // Basic Information
    name: "Watercolor Floral Laptop Skin",
    description: "Full-coverage laptop skin with a beautiful watercolor floral design.",
    details:
      "This premium laptop skin features a stunning watercolor floral pattern. Precision-cut for your specific laptop model with bubble-free application technology.",
    sku: "SKIN-FLORAL-009",
    barcode: "7891234567898",

    // Classification
    category: "Skins",
    subcategory: "Laptop Skins",
    designThemes: ["Floral", "Watercolor", "Artistic"],
    productType: "Laptop Skin",
    tags: ["Laptop", "Floral", "Protective", "Artistic"],
    brand: "TechSkin",
    manufacturer: "Device Wrap Pro",

    // Specifications
    dimensions: "Varies by laptop model",
    weight: "0.1 lbs",
    shippingWeight: "0.15 lbs",
    material: "3M Vinyl",
    finish: "Matte",
    color: "#FFCDD2",
    baseColor: "pink",
    colorDisplayName: "Blush Pink",
    stickySide: "Back",
    size: "Custom",

    // Media
    image: "/placeholder.svg?height=500&width=500&query=Watercolor%20Floral%20Laptop%20Skin",
    additionalImages: [
      "/placeholder.svg?height=500&width=500&query=Floral%20Laptop%20Skin%20on%20MacBook",
      "/placeholder.svg?height=500&width=500&query=Floral%20Laptop%20Skin%20Close%20Up"
    ],
    placements: ["Laptop", "Tablet"],

    // Pricing and Inventory
    price: 24.99,
    costPrice: 7.5,
    stockQuantity: 15,
    lowStockThreshold: 5,
    shippingClass: "Standard",

    // Status
    inStock: true,
    badge: "Limited Stock",
    isFeatured: true,
    isHero: false,
    isLiked: false,
    isCustomizable: true,
    isNewArrival: false
  },
  {
    // Basic Information
    name: "Glow-in-the-Dark Star Ceiling Decals",
    description: "Set of 150 glow-in-the-dark stars and moon decals for ceiling decoration.",
    details:
      "Transform any room into a starry night sky with these glow-in-the-dark celestial decals. Set includes 1 moon and 150 stars in various sizes. Charges in daylight and glows for hours.",
    sku: "GLOW-STARS-010",
    barcode: "7891234567899",

    // Classification
    category: "Decals",
    subcategory: "Ceiling Decals",
    designThemes: ["Space", "Night Sky", "Kids Room"],
    productType: "Glow Decal",
    tags: ["Glow", "Stars", "Kids", "Bedroom"],
    brand: "NightGlow",
    manufacturer: "Luminous Decor Inc.",

    // Specifications
    dimensions: "Various sizes (0.5-3 inches)",
    weight: "0.15 lbs",
    shippingWeight: "0.2 lbs",
    material: "Glow-in-the-Dark Vinyl",
    finish: "Matte",
    color: "#E6EE9C",
    baseColor: "green",
    colorDisplayName: "Glow Green",
    stickySide: "Back",
    size: "Set",

    // Media
    image: "/placeholder.svg?height=500&width=500&query=Glow%20in%20the%20Dark%20Star%20Ceiling%20Decals",
    additionalImages: [
      "/placeholder.svg?height=500&width=500&query=Glow%20Stars%20on%20Ceiling%20Night",
      "/placeholder.svg?height=500&width=500&query=Glow%20Stars%20on%20Ceiling%20Day"
    ],
    placements: ["Ceiling", "Wall", "Furniture"],

    // Pricing and Inventory
    price: 14.99,
    salePrice: 11.99,
    onSale: true,
    costPrice: 4.25,
    stockQuantity: 0,
    lowStockThreshold: 10,
    shippingClass: "Standard",

    // Status
    inStock: false,
    badge: "Out of Stock",
    isFeatured: false,
    isHero: false,
    isLiked: false,
    isCustomizable: false,
    isNewArrival: false
  }
];
