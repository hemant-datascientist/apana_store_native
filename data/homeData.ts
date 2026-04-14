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
