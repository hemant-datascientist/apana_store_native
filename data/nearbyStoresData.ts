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
    id:          "h1",
    name:        "Rahul Stores",
    rating:      4.5,
    categories:  ["Grocery", "Snacks & Drinks", "Personal Care"],
    city:        "Pune",
    nearLabel:   "Near your Home",
    bgColor:     "#1a3a2a",
    accentColor: "#0d2b1e",
    icon:        "storefront-outline",
  },
  {
    id:          "h2",
    name:        "Ramu Store",
    rating:      4.5,
    categories:  ["Namkeen & Ration", "Snacks & Drinks", "Personal Care"],
    city:        "Pune",
    nearLabel:   "Near your Home",
    bgColor:     "#3a2a10",
    accentColor: "#2b1e08",
    icon:        "basket-outline",
  },
  {
    id:          "h3",
    name:        "Golawala Beverages",
    rating:      4.5,
    categories:  ["Gola shaved Ice street dessert", "Soft Drinks & Soda", "Ice Cream"],
    city:        "Pune",
    nearLabel:   "Near your Home",
    bgColor:     "#0d2b3a",
    accentColor: "#081e2b",
    icon:        "wine-outline",
  },
  {
    id:          "h4",
    name:        "Virat Stores",
    rating:      4.5,
    categories:  ["Namkeen & Ration", "Snacks & Drinks", "Personal Care", "Groceries"],
    city:        "Pune",
    nearLabel:   "Near your Home",
    bgColor:     "#1a1a2e",
    accentColor: "#0d0d1e",
    icon:        "storefront-outline",
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
    name:       "Grocery Stores",
    type:       "Grocery Stores",
    typeColor:  "#15803D",
    typeBg:     "#DCFCE7",
    rating:     4.5,
    reviews:    969,
    distanceKm: 0.1,
    categories: ["Grocery", "Personal Care"],
    isLive:     true,
    bgColor:    "#DCFCE7",
    icon:       "basket-outline",
  },
  {
    id:         "s2",
    name:       "MobileWorld",
    type:       "Mobile Stores",
    typeColor:  "#1D4ED8",
    typeBg:     "#DBEAFE",
    rating:     4.8,
    reviews:    669,
    distanceKm: 0.2,
    categories: ["Recharge & Sim"],
    isLive:     true,
    bgColor:    "#DBEAFE",
    icon:       "phone-portrait-outline",
  },
  {
    id:         "s3",
    name:       "Allen Solly Fashion",
    type:       "Fashion Stores",
    typeColor:  "#9333EA",
    typeBg:     "#F3E8FF",
    rating:     4.3,
    reviews:    459,
    distanceKm: 0.5,
    categories: ["Men", "Women", "Kids"],
    isLive:     true,
    bgColor:    "#F3E8FF",
    icon:       "shirt-outline",
  },
  {
    id:         "s4",
    name:       "AOEAN Electronics",
    type:       "Electronics",
    typeColor:  "#0369A1",
    typeBg:     "#E0F2FE",
    rating:     4.9,
    reviews:    58,
    distanceKm: 0.8,
    categories: ["Mobiles", "Laptops", "Accessories"],
    isLive:     false,
    bgColor:    "#E0F2FE",
    icon:       "tv-outline",
  },
  {
    id:         "s5",
    name:       "Chitale Dairy",
    type:       "Dairy & Milk",
    typeColor:  "#D97706",
    typeBg:     "#FEF3C7",
    rating:     4.7,
    reviews:    310,
    distanceKm: 0.3,
    categories: ["Milk", "Curd", "Paneer", "Sweets"],
    isLive:     true,
    bgColor:    "#FEF3C7",
    icon:       "cafe-outline",
  },
  {
    id:         "s6",
    name:       "Medplus Pharmacy",
    type:       "Pharmacy",
    typeColor:  "#DC2626",
    typeBg:     "#FEE2E2",
    rating:     4.4,
    reviews:    220,
    distanceKm: 0.6,
    categories: ["Medicines", "Health", "Baby Care"],
    isLive:     false,
    bgColor:    "#FEE2E2",
    icon:       "medkit-outline",
  },
];
