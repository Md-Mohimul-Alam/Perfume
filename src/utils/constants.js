export const products = [
  { 
    id: 1, 
    name: "Dunhill Desire", 
    category: "perfume", 
    description: "Masculine fragrance with warm amber notes", 
    basePrice: 40,
    notes: ["amber", "woody", "spicy"],
    intensity: "medium",
    bestFor: ["evening", "special"],
    isNew: false,
    isBestseller: true
  },
  { 
    id: 2, 
    name: "Versace Eros", 
    category: "perfume", 
    description: "Fresh mint and vanilla fragrance", 
    basePrice: 45,
    notes: ["fresh", "citrus", "vanilla"],
    intensity: "strong",
    bestFor: ["evening", "all"],
    isNew: false,
    isBestseller: true
  },
  { 
    id: 3, 
    name: "Blueberry", 
    category: "oil", 
    description: "Sweet blueberry aromatic oil", 
    basePrice: 28,
    notes: ["fruity", "sweet"],
    intensity: "light",
    bestFor: ["daytime", "all"],
    isNew: true,
    isBestseller: false
  },
  { 
    id: 4, 
    name: "Vampire Blood", 
    category: "oil", 
    description: "Deep, mysterious blood-inspired scent", 
    basePrice: 30,
    notes: ["oriental", "spicy", "woody"],
    intensity: "strong",
    bestFor: ["evening", "special"],
    isNew: false,
    isBestseller: false
  },
  { 
    id: 5, 
    name: "CK One", 
    category: "perfume", 
    description: "Unisex fresh citrus fragrance", 
    basePrice: 35,
    notes: ["citrus", "fresh", "green"],
    intensity: "light",
    bestFor: ["daytime", "all"],
    isNew: false,
    isBestseller: true
  },
  { 
    id: 6, 
    name: "Lost Cherry", 
    category: "perfume", 
    description: "Sweet cherry with almond notes", 
    basePrice: 50,
    notes: ["fruity", "gourmand", "almond"],
    intensity: "medium",
    bestFor: ["evening", "special"],
    isNew: true,
    isBestseller: false
  },
  { 
    id: 7, 
    name: "Ultra Male", 
    category: "perfume", 
    description: "Spicy and sweet aromatic blend", 
    basePrice: 38,
    notes: ["spicy", "sweet", "woody"],
    intensity: "strong",
    bestFor: ["evening", "all"],
    isNew: false,
    isBestseller: false
  },
  { 
    id: 8, 
    name: "Fantasy", 
    category: "perfume", 
    description: "Fruity and floral fragrance", 
    basePrice: 42,
    notes: ["fruity", "floral", "sweet"],
    intensity: "medium",
    bestFor: ["daytime", "evening"],
    isNew: false,
    isBestseller: true
  },
  { 
    id: 9, 
    name: "Bleu de Chanel", 
    category: "perfume", 
    description: "Fresh citrus with woody base", 
    basePrice: 55,
    notes: ["citrus", "woody", "fresh"],
    intensity: "medium",
    bestFor: ["all"],
    isNew: false,
    isBestseller: true
  },
  { 
    id: 10, 
    name: "Victoria's Secret", 
    category: "perfume", 
    description: "Seductive floral and vanilla", 
    basePrice: 40,
    notes: ["floral", "vanilla", "sweet"],
    intensity: "light",
    bestFor: ["daytime", "evening"],
    isNew: false,
    isBestseller: false
  }
];

export const sizeConfig = {
  perfume: [
    { size: "6ml", multiplier: 1 },
    { size: "15ml", multiplier: 1.6 },
    { size: "30ml", multiplier: 2.6 }
  ],
  oil: [
    { size: "3.5ml", multiplier: 0.8 },
    { size: "6ml", multiplier: 1.12 },
    { size: "15ml", multiplier: 1.8 },
    { size: "30ml", multiplier: 2.8 }
  ]
};

export const productEmojis = {
  perfume: '🌸',
  oil: '💧'
};

export const scentNotes = {
  floral: {
    title: "Floral Notes",
    description: "Floral fragrances are characterized by the scents of various flowers. They can range from light and airy to rich and intoxicating. Common floral notes include rose, jasmine, lily, and violet. These scents are often associated with femininity, romance, and elegance.",
    emoji: "🌸"
  },
  woody: {
    title: "Woody Notes",
    description: "Woody fragrances feature scents derived from woods and mosses. They are often warm, dry, and earthy. Common woody notes include sandalwood, cedar, patchouli, and vetiver. These scents evoke feelings of sophistication, strength, and connection to nature.",
    emoji: "🌲"
  },
  citrus: {
    title: "Citrus Notes",
    description: "Citrus fragrances are fresh, bright, and energizing. They typically feature notes from citrus fruits like lemon, orange, bergamot, and grapefruit. These scents are often used as top notes in fragrance compositions and are associated with cleanliness, vitality, and freshness.",
    emoji: "🍊"
  },
  oriental: {
    title: "Oriental Notes",
    description: "Oriental fragrances are warm, spicy, and often exotic. They feature notes like vanilla, amber, spices, and resins. These rich, sensual scents are known for their longevity and depth, often creating an aura of mystery, luxury, and sophistication.",
    emoji: "🕌"
  }
};