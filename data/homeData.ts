// ============================================================
// HOME DATA — Apana Store (Customer App)
//
// Static mock data for the Home screen.
// Replace with GET /customer/home when backend is ready.
// ============================================================

// ── Header ────────────────────────────────────────────────────

export interface UserLocation {
  area:    string;
  state:   string;
  pincode: string;
}

export const MOCK_LOCATION: UserLocation = {
  area:    "Pune",
  state:   "Maharashtra",
  pincode: "411001",
};

export const STORES_LIVE_COUNT = 410;

// ── Discovery mode toggle ──────────────────────────────────────

export type DiscoveryMode = "products" | "stores";

// ── Categories ────────────────────────────────────────────────

export interface Category {
  key:   string;
  label: string;
  icon:  string; // Ionicons glyph name
}

export const CATEGORIES: Category[] = [
  { key: "all",         label: "All Items",       icon: "apps-outline"                   },
  { key: "grocery",     label: "Grocery",          icon: "basket-outline"                 },
  { key: "fashion",     label: "Fashion",          icon: "shirt-outline"                  },
  { key: "mobiles",     label: "Mobiles",          icon: "phone-portrait-outline"         },
  { key: "electronics", label: "Electronics",      icon: "headset-outline"                },
  { key: "appliances",  label: "Appliances",       icon: "tv-outline"                     },
  { key: "beauty",      label: "Beauty",           icon: "flower-outline"                 },
  { key: "sports",      label: "Sports",           icon: "football-outline"               },
  { key: "home",        label: "Home",             icon: "home-outline"                   },
  { key: "pharmacy",    label: "Pharmacy",         icon: "medkit-outline"                 },
  { key: "food",        label: "Food & Drink",     icon: "restaurant-outline"             },
  { key: "books",       label: "Books",            icon: "book-outline"                   },
  { key: "icecream",    label: "Ice Cream",        icon: "ice-cream-outline"              },
  { key: "furniture",   label: "Furniture",        icon: "bed-outline"                    },
  { key: "hardware",    label: "Hardware & Tools", icon: "hammer-outline"                 },
  { key: "misc",        label: "Miscellaneous",    icon: "ellipsis-horizontal-circle-outline" },
  // Miscellaneous covers: Pet Shop, Pet Food, Baby Care, Toys,
  // Stationery, Auto Parts, Garden, Musical Instruments, Art & Craft,
  // Travel Accessories, Gifting, and any other niche categories.
];

// ── Hero header background ────────────────────────────────────
// Deep dark navy — always constant (not theme-dependent).
// Related to Apana Blue (#0F4C81) but darker for header contrast.
export const HEADER_BG = "#0B2D5C";

// ── Banners ───────────────────────────────────────────────────
export interface Banner {
  id:       string;
  title:    string;
  subtitle: string;
  tag:      string;   // pill label (e.g. "New Arrivals")
  bg:       string;   // card background color
  accent:   string;   // title / tag accent color
  icon:     string;   // Ionicons glyph for decorative element
}

export const BANNERS: Banner[] = [
  {
    id:       "b1",
    title:    "Apana Store",
    subtitle: "Shop from local stores near you — groceries, fashion, electronics & more.",
    tag:      "Discover Local",
    bg:       "#0F4C81",
    accent:   "#FFD700",
    icon:     "storefront-outline",
  },
  {
    id:       "b2",
    title:    "Fresh Grocery",
    subtitle: "Farm-fresh vegetables, dairy & daily essentials delivered fast.",
    tag:      "Up to 20% Off",
    bg:       "#15803D",
    accent:   "#BBF7D0",
    icon:     "basket-outline",
  },
  {
    id:       "b3",
    title:    "Fashion Week",
    subtitle: "Ethnic wear, western outfits & accessories from local boutiques.",
    tag:      "New Arrivals",
    bg:       "#9333EA",
    accent:   "#F3E8FF",
    icon:     "shirt-outline",
  },
  {
    id:       "b4",
    title:    "Pune Specials",
    subtitle: "Shrewsbury biscuits, Chitale Bhakharwadi & more local favourites.",
    tag:      "Only on Apana",
    bg:       "#C2410C",
    accent:   "#FED7AA",
    icon:     "heart-outline",
  },
];

// ── Trending ──────────────────────────────────────────────────
export interface TrendingItem {
  id:       string;
  name:     string;
  category: string;
  area:     string;
  icon:     string;   // Ionicons glyph
  color:    string;   // card image bg color
  badge:    string;   // "Open" | "Popular" | "New"
  badgeBg:  string;
  badgeColor: string;
}

export const TRENDING_ITEMS: TrendingItem[] = [
  { id: "t1", name: "Metro Wholesale Mall",    category: "Wholesale",      area: "Wakad",       icon: "business-outline",     color: "#DBEAFE", badge: "Open",    badgeBg: "#DCFCE7", badgeColor: "#15803D" },
  { id: "t2", name: "Shrewsbury Biscuits",     category: "Bakery",         area: "Pune City",   icon: "cafe-outline",         color: "#FEF3C7", badge: "Popular", badgeBg: "#FFEDD5", badgeColor: "#C2410C" },
  { id: "t3", name: "Chitale Bhakharwadi",     category: "Snacks",         area: "Deccan",      icon: "fast-food-outline",    color: "#FFEDD5", badge: "Popular", badgeBg: "#FFEDD5", badgeColor: "#C2410C" },
  { id: "t4", name: "Meridian Ice Cream",      category: "Ice Cream",      area: "FC Road",     icon: "ice-cream-outline",    color: "#FCE7F3", badge: "Open",    badgeBg: "#DCFCE7", badgeColor: "#15803D" },
  { id: "t5", name: "Puneri Pagadi",           category: "Fashion",        area: "Laxmi Road",  icon: "shirt-outline",        color: "#EDE9FE", badge: "Open",    badgeBg: "#DCFCE7", badgeColor: "#15803D" },
  { id: "t6", name: "Maharashtrian Naths",     category: "Jewellery",      area: "Kasba Peth",  icon: "diamond-outline",      color: "#FEF3C7", badge: "Popular", badgeBg: "#FFEDD5", badgeColor: "#C2410C" },
  { id: "t7", name: "Osha Chappals",           category: "Footwear",       area: "MG Road",     icon: "walk-outline",         color: "#DCFCE7", badge: "Open",    badgeBg: "#DCFCE7", badgeColor: "#15803D" },
  { id: "t8", name: "Kolhapuri Chappals",      category: "Footwear",       area: "Kolhapur",    icon: "walk-outline",         color: "#FFEDD5", badge: "Popular", badgeBg: "#FFEDD5", badgeColor: "#C2410C" },
  { id: "t9", name: "Kala Khatta Soda",        category: "Beverages",      area: "Camp",        icon: "wine-outline",         color: "#EDE9FE", badge: "New",     badgeBg: "#DBEAFE", badgeColor: "#1D4ED8" },
  { id: "t10",name: "Run Maika",               category: "Traditional",    area: "Peth Area",   icon: "restaurant-outline",   color: "#FCE7F3", badge: "Open",    badgeBg: "#DCFCE7", badgeColor: "#15803D" },
  { id: "t11",name: "Puran Poli Corner",       category: "Food",           area: "Sadashiv",    icon: "restaurant-outline",   color: "#FEF3C7", badge: "Popular", badgeBg: "#FFEDD5", badgeColor: "#C2410C" },
  { id: "t12",name: "Pittho Sweet House",      category: "Sweets",         area: "Narayan Peth",icon: "gift-outline",         color: "#FCE7F3", badge: "Open",    badgeBg: "#DCFCE7", badgeColor: "#15803D" },
];
