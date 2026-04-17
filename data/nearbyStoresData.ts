// ============================================================
// NEARBY STORES DATA — Apana Store (Customer App)
//
// Mock data for the Stores → Nearby tab feed.
// Replace with GET /stores/nearby?lat=&lng=&radius= when ready.
// ============================================================

// ── Hero Banner Stores ────────────────────────────────────────
// Shown at the top of Nearby as a full-width carousel.

export interface HeroStore {
  id:         string;
  name:       string;
  rating:     number;
  categories: string[];   // listed on the banner
  city:       string;     // bottom-left label
  nearLabel:  string;     // bottom-right label
  bgColor:    string;     // placeholder bg (real app uses photo)
  accentColor:string;     // overlay tint for the gradient
  icon:       string;     // Ionicons for placeholder centre
}

export const HERO_STORES: HeroStore[] = [
  {
    id:          "s1",
    name:        "Sharma General Store",
    rating:      4.8,
    categories:  ["Grocery", "Staples & Grains", "Personal Care"],
    city:        "Pune",
    nearLabel:   "Near your Home",
    bgColor:     "#166534",
    accentColor: "#0d4022",
    icon:        "basket-outline",
  },
  {
    id:          "s5",
    name:        "Fresh Bakes",
    rating:      4.7,
    categories:  ["Breads & Buns", "Cakes & Pastries", "Meals & Thali"],
    city:        "Pune",
    nearLabel:   "Near your Home",
    bgColor:     "#92400E",
    accentColor: "#6b2d08",
    icon:        "restaurant-outline",
  },
  {
    id:          "s2",
    name:        "TechZone Electronics",
    rating:      4.5,
    categories:  ["Mobiles & Tablets", "Audio & Earphones", "Accessories"],
    city:        "Pune",
    nearLabel:   "Near your Home",
    bgColor:     "#1E3A5F",
    accentColor: "#122540",
    icon:        "headset-outline",
  },
  {
    id:          "s4",
    name:        "Style Hub Fashion",
    rating:      4.3,
    categories:  ["Men's Clothing", "Women's Clothing", "Footwear"],
    city:        "Pune",
    nearLabel:   "Near your Home",
    bgColor:     "#6D28D9",
    accentColor: "#4c1d99",
    icon:        "shirt-outline",
  },
];

// ── Store List Cards ──────────────────────────────────────────

export interface NearbyStore {
  id:         string;
  name:       string;
  type:       string;     // main badge label (e.g. "Grocery Stores")
  typeColor:  string;
  typeBg:     string;
  rating:     number;
  reviews:    number;
  distanceKm: number;
  categories: string[];   // small tag pills
  isLive:     boolean;
  bgColor:    string;     // placeholder thumbnail bg
  icon:       string;     // Ionicons for thumbnail
}

export const NEARBY_STORES: NearbyStore[] = [
  {
    id:         "s1",
    name:       "Sharma General Store",
    type:       "Grocery",
    typeColor:  "#15803D",
    typeBg:     "#DCFCE7",
    rating:     4.8,
    reviews:    312,
    distanceKm: 0.1,
    categories: ["Grocery", "Staples & Grains", "Personal Care"],
    isLive:     true,
    bgColor:    "#166534",
    icon:       "basket-outline",
  },
  {
    id:         "s5",
    name:       "Fresh Bakes",
    type:       "Food & Drink",
    typeColor:  "#92400E",
    typeBg:     "#FEF3C7",
    rating:     4.7,
    reviews:    284,
    distanceKm: 0.3,
    categories: ["Breads & Buns", "Cakes & Pastries", "Meals & Thali"],
    isLive:     true,
    bgColor:    "#92400E",
    icon:       "restaurant-outline",
  },
  {
    id:         "s2",
    name:       "TechZone Electronics",
    type:       "Electronics",
    typeColor:  "#1D4ED8",
    typeBg:     "#DBEAFE",
    rating:     4.5,
    reviews:    189,
    distanceKm: 0.5,
    categories: ["Mobiles & Tablets", "Audio & Earphones", "Accessories"],
    isLive:     true,
    bgColor:    "#1E3A5F",
    icon:       "headset-outline",
  },
  {
    id:         "s4",
    name:       "Style Hub Fashion",
    type:       "Fashion",
    typeColor:  "#9333EA",
    typeBg:     "#F3E8FF",
    rating:     4.3,
    reviews:    156,
    distanceKm: 0.8,
    categories: ["Men's Clothing", "Women's Clothing", "Footwear"],
    isLive:     false,
    bgColor:    "#6D28D9",
    icon:       "shirt-outline",
  },
  {
    id:         "s3",
    name:       "Gupta Medical Store",
    type:       "Pharmacy",
    typeColor:  "#DC2626",
    typeBg:     "#FEE2E2",
    rating:     4.9,
    reviews:    427,
    distanceKm: 0.6,
    categories: ["Medicines", "Health", "Baby Care"],
    isLive:     false,
    bgColor:    "#0F5132",
    icon:       "medkit-outline",
  },
];
