// ============================================================
// STORE DETAIL DATA — Apana Store (Customer App)
//
// Mock store detail records looked up by store ID.
// Backend: GET /stores/:id  → StoreDetail
//          GET /stores/:id/categories → StoreCategory[]
// ============================================================

export interface StoreHours {
  day:   string;
  open:  string;
  close: string;
}

export interface StoreProductCategory {
  key:          string;
  label:        string;
  icon:         string;   // Ionicons glyph
  productCount: number;
}

export interface StoreDetail {
  id:           string;
  name:         string;
  tagline:      string;
  category:     string;
  icon:         string;   // Ionicons glyph
  heroBg:       string;   // hero background color
  address:      string;
  city:         string;
  state:        string;
  pincode:      string;
  phone:        string;
  website?:     string;
  rating:       number;
  reviewCount:  number;
  isOpen:       boolean;
  closesAt:     string;   // e.g. "9:00 PM"
  opensAt:      string;   // e.g. "9:00 AM" (shown when closed)
  isLive:       boolean;
  lat:          number;
  lng:          number;
  hours:        StoreHours[];
  categories:   StoreProductCategory[];
  ownerName:    string;
  ownerPhoto:   string;   // image URL or asset
  ownerMessage: string;   // slogan or message
}

// ── Day helpers ───────────────────────────────────────────────

export const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

export function todayDayName(): string {
  return DAY_NAMES[new Date().getDay()];
}

// ── Mock store catalog ────────────────────────────────────────

export const MOCK_STORES: Record<string, StoreDetail> = {
  s1: {
    id:          "s1",
    name:        "Sharma General Store",
    tagline:     "Your trusted neighbourhood grocery",
    category:    "Grocery",
    icon:        "basket-outline",
    heroBg:      "#166534",
    address:     "12, Shivajinagar Market",
    city:        "Pune",
    state:       "Maharashtra",
    pincode:     "411005",
    phone:       "+91 98765 43210",
    website:     "https://apanastore.in",
    rating:      4.8,
    reviewCount: 312,
    isOpen:      true,
    closesAt:    "9:00 PM",
    opensAt:     "8:00 AM",
    isLive:      true,
    lat:         18.5308,
    lng:         73.8475,
    hours: [
      { day: "Monday",    open: "8:00 AM", close: "9:00 PM" },
      { day: "Tuesday",   open: "8:00 AM", close: "9:00 PM" },
      { day: "Wednesday", open: "8:00 AM", close: "9:00 PM" },
      { day: "Thursday",  open: "8:00 AM", close: "9:00 PM" },
      { day: "Friday",    open: "8:00 AM", close: "10:00 PM" },
      { day: "Saturday",  open: "9:00 AM", close: "10:00 PM" },
      { day: "Sunday",    open: "9:00 AM", close: "8:00 PM" },
    ],
    categories: [
      { key: "fruits",     label: "Fruits & Vegetables",  icon: "leaf-outline",        productCount: 48  },
      { key: "dairy",      label: "Dairy & Eggs",         icon: "egg-outline",         productCount: 22  },
      { key: "staples",    label: "Staples & Grains",     icon: "nutrition-outline",   productCount: 65  },
      { key: "snacks",     label: "Snacks & Beverages",   icon: "cafe-outline",        productCount: 87  },
      { key: "personal",   label: "Personal Care",        icon: "medkit-outline",      productCount: 34  },
      { key: "household",  label: "Household Items",      icon: "home-outline",        productCount: 29  },
    ],
    ownerName:  "Rajesh Sharma",
    ownerPhoto: "https://randomuser.me/api/portraits/men/32.jpg",
    ownerMessage: "Namaste! We provide the freshest groceries with a smile. Your satisfaction is our tradition.",
  },

  s2: {
    id:          "s2",
    name:        "TechZone Electronics",
    tagline:     "Latest gadgets at local prices",
    category:    "Electronics",
    icon:        "headset-outline",
    heroBg:      "#1E3A5F",
    address:     "Shop 4, FC Road Market",
    city:        "Pune",
    state:       "Maharashtra",
    pincode:     "411004",
    phone:       "+91 97654 32109",
    website:     "https://apanastore.in",
    rating:      4.5,
    reviewCount: 189,
    isOpen:      true,
    closesAt:    "8:30 PM",
    opensAt:     "10:00 AM",
    isLive:      true,
    lat:         18.5232,
    lng:         73.8411,
    hours: [
      { day: "Monday",    open: "10:00 AM", close: "8:30 PM" },
      { day: "Tuesday",   open: "10:00 AM", close: "8:30 PM" },
      { day: "Wednesday", open: "10:00 AM", close: "8:30 PM" },
      { day: "Thursday",  open: "10:00 AM", close: "8:30 PM" },
      { day: "Friday",    open: "10:00 AM", close: "9:00 PM"  },
      { day: "Saturday",  open: "10:00 AM", close: "9:00 PM"  },
      { day: "Sunday",    open: "11:00 AM", close: "7:00 PM"  },
    ],
    categories: [
      { key: "mobiles",    label: "Mobiles & Tablets",    icon: "phone-portrait-outline", productCount: 56  },
      { key: "audio",      label: "Audio & Earphones",    icon: "headset-outline",        productCount: 43  },
      { key: "laptops",    label: "Laptops & PCs",        icon: "laptop-outline",         productCount: 28  },
      { key: "tv",         label: "TVs & Displays",       icon: "tv-outline",             productCount: 19  },
      { key: "cameras",    label: "Cameras",              icon: "camera-outline",         productCount: 15  },
      { key: "accessories",label: "Accessories",          icon: "cube-outline",      productCount: 112 },
    ],
    ownerName:  "Vikram Malhotra",
    ownerPhoto: "https://randomuser.me/api/portraits/men/44.jpg",
    ownerMessage: "Latest tech at your doorstep. Helping you stay connected with the best gadgets since 2012.",
  },

  s3: {
    id:          "s3",
    name:        "Gupta Medical Store",
    tagline:     "Medicines, health & wellness",
    category:    "Pharmacy",
    icon:        "medkit-outline",
    heroBg:      "#0F5132",
    address:     "Plot 7, Kothrud Main Road",
    city:        "Pune",
    state:       "Maharashtra",
    pincode:     "411038",
    phone:       "+91 96543 21098",
    rating:      4.9,
    reviewCount: 427,
    isOpen:      false,
    closesAt:    "9:00 PM",
    opensAt:     "9:00 AM",
    isLive:      false,
    lat:         18.5074,
    lng:         73.8077,
    hours: [
      { day: "Monday",    open: "9:00 AM", close: "9:00 PM" },
      { day: "Tuesday",   open: "9:00 AM", close: "9:00 PM" },
      { day: "Wednesday", open: "9:00 AM", close: "9:00 PM" },
      { day: "Thursday",  open: "9:00 AM", close: "9:00 PM" },
      { day: "Friday",    open: "9:00 AM", close: "9:00 PM" },
      { day: "Saturday",  open: "9:00 AM", close: "9:00 PM" },
      { day: "Sunday",    open: "10:00 AM", close: "2:00 PM" },
    ],
    categories: [
      { key: "medicines",  label: "Prescription Medicines", icon: "medical-outline",     productCount: 320 },
      { key: "otc",        label: "OTC Medicines",          icon: "bandage-outline",     productCount: 145 },
      { key: "vitamins",   label: "Vitamins & Supplements", icon: "fitness-outline",     productCount: 67  },
      { key: "baby",       label: "Baby Care",              icon: "happy-outline",       productCount: 38  },
      { key: "devices",    label: "Health Devices",         icon: "pulse-outline",       productCount: 24  },
    ],
    ownerName:  "Dr. Arun Gupta",
    ownerPhoto: "https://randomuser.me/api/portraits/men/22.jpg",
    ownerMessage: "Your health is our priority. Genuine medicines and expert advice, always here for you.",
  },

  s4: {
    id:          "s4",
    name:        "Style Hub Fashion",
    tagline:     "Trending fashion for every occasion",
    category:    "Fashion",
    icon:        "shirt-outline",
    heroBg:      "#6D28D9",
    address:     "2nd Floor, MG Road Mall",
    city:        "Pune",
    state:       "Maharashtra",
    pincode:     "411001",
    phone:       "+91 95432 10987",
    website:     "https://apanastore.in",
    rating:      4.3,
    reviewCount: 156,
    isOpen:      true,
    closesAt:    "10:00 PM",
    opensAt:     "10:00 AM",
    isLive:      false,
    lat:         18.5204,
    lng:         73.8567,
    hours: [
      { day: "Monday",    open: "10:00 AM", close: "10:00 PM" },
      { day: "Tuesday",   open: "10:00 AM", close: "10:00 PM" },
      { day: "Wednesday", open: "10:00 AM", close: "10:00 PM" },
      { day: "Thursday",  open: "10:00 AM", close: "10:00 PM" },
      { day: "Friday",    open: "10:00 AM", close: "11:00 PM" },
      { day: "Saturday",  open: "10:00 AM", close: "11:00 PM" },
      { day: "Sunday",    open: "11:00 AM", close: "9:00 PM"  },
    ],
    categories: [
      { key: "men",        label: "Men's Clothing",         icon: "man-outline",         productCount: 94  },
      { key: "women",      label: "Women's Clothing",       icon: "woman-outline",       productCount: 112 },
      { key: "kids",       label: "Kids' Fashion",          icon: "happy-outline",       productCount: 58  },
      { key: "footwear",   label: "Footwear",               icon: "footsteps-outline",   productCount: 46  },
      { key: "accessories",label: "Accessories & Bags",     icon: "bag-outline",         productCount: 73  },
    ],
    ownerName:  "Sanjana Rao",
    ownerPhoto: "https://randomuser.me/api/portraits/women/45.jpg",
    ownerMessage: "Wear your confidence. Curating the best trends to make you look and feel extraordinary.",
  },

  s5: {
    id:          "s5",
    name:        "Fresh Bakes",
    tagline:     "Freshly baked, made with love",
    category:    "Food & Drink",
    icon:        "restaurant-outline",
    heroBg:      "#92400E",
    address:     "Shop 3, Baner Road",
    city:        "Pune",
    state:       "Maharashtra",
    pincode:     "411045",
    phone:       "+91 94321 09876",
    rating:      4.7,
    reviewCount: 284,
    isOpen:      true,
    closesAt:    "10:00 PM",
    opensAt:     "7:00 AM",
    isLive:      true,
    lat:         18.5590,
    lng:         73.7868,
    hours: [
      { day: "Monday",    open: "7:00 AM", close: "10:00 PM" },
      { day: "Tuesday",   open: "7:00 AM", close: "10:00 PM" },
      { day: "Wednesday", open: "7:00 AM", close: "10:00 PM" },
      { day: "Thursday",  open: "7:00 AM", close: "10:00 PM" },
      { day: "Friday",    open: "7:00 AM", close: "11:00 PM" },
      { day: "Saturday",  open: "7:00 AM", close: "11:00 PM" },
      { day: "Sunday",    open: "8:00 AM", close: "10:00 PM" },
    ],
    categories: [
      { key: "breads",     label: "Breads & Buns",          icon: "cafe-outline",         productCount: 18  },
      { key: "cakes",      label: "Cakes & Pastries",       icon: "gift-outline",         productCount: 32  },
      { key: "snacks",     label: "Snacks & Farsan",        icon: "fast-food-outline",    productCount: 24  },
      { key: "beverages",  label: "Beverages",              icon: "wine-outline",         productCount: 15  },
      { key: "meals",      label: "Meals & Thali",          icon: "restaurant-outline",   productCount: 12  },
    ],
    ownerName:  "Chef Sameer",
    ownerPhoto: "https://randomuser.me/api/portraits/men/85.jpg",
    ownerMessage: "Baked with love, served with joy. Experience the warmth of home in every single bite.",
  },
};

// Fallback for unknown IDs
export const DEFAULT_STORE_ID = "s1";

export function getStoreById(id: string): StoreDetail {
  return MOCK_STORES[id] ?? MOCK_STORES[DEFAULT_STORE_ID];
}
