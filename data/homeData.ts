// ============================================================
// HOME DATA — Apana Store (Customer App)
//
// Static mock data for the Home screen.
// Replace with GET /customer/home when backend is ready.
// ============================================================
import { assetImg } from "../lib/assetImg";


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

export const STORES_LIVE_COUNT = 12500000;

// ── Discovery mode toggle ──────────────────────────────────────

export type DiscoveryMode = "products" | "stores";

// ── Categories ────────────────────────────────────────────────

export interface Category {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph name
  color: string;   // Brand color — used for active icon/label. "primary" = app primary.
}

export const CATEGORIES: Category[] = [
  // key              label                icon                                    color
  { key: "all",         label: "All Items",       icon: "apps-outline",                        color: "primary"  },
  { key: "grocery",     label: "Grocery",          icon: "basket-outline",                      color: "#026451"  },
  { key: "fashion",     label: "Fashion",          icon: "shirt-outline",                       color: "#660033"  },
  { key: "mobiles",     label: "Mobiles",          icon: "phone-portrait-outline",              color: "#0437B1"  },
  { key: "electronics", label: "Electronics",      icon: "headset-outline",                     color: "#5F75B1"  },
  { key: "appliances",  label: "Appliances",       icon: "tv-outline",                          color: "#2C5282"  },
  { key: "beauty",      label: "Beauty",           icon: "flower-outline",                      color: "#402A62"  },
  { key: "sports",      label: "Sports",           icon: "football-outline",                    color: "#B45309"  },
  { key: "home",        label: "Home Decor",       icon: "home-outline",                        color: "#7C4438"  },
  { key: "pharmacy",    label: "Pharmacy",         icon: "medkit-outline",                      color: "#1D4746"  },
  { key: "food",        label: "Food & Drink",     icon: "restaurant-outline",                  color: "#6F4C81"  },
  { key: "books",       label: "Books",            icon: "book-outline",                        color: "#933A00"  },
  { key: "icecream",    label: "Ice Cream",        icon: "ice-cream-outline",                   color: "#803E96"  },
  { key: "furniture",   label: "Furniture",        icon: "bed-outline",                         color: "#6D4924"  },
  { key: "hardware",    label: "Hardware & Tools", icon: "hammer-outline",                      color: "#374151"  },
  { key: "misc",        label: "Miscellaneous",    icon: "ellipsis-horizontal-circle-outline",  color: "#4A4A6A"  },
  // Miscellaneous covers: Pet Shop, Pet Food, Baby Care, Toys,
  // Stationery, Auto Parts, Garden, Musical Instruments, Art & Craft,
  // Travel Accessories, Gifting, and any other niche categories.
];

// ── Hero header background ────────────────────────────────────
// Deep dark navy — always constant (not theme-dependent).
// Darker than the primary brand color for strong header contrast.
export const HEADER_BG = "#091E4A";

// ── Banners ───────────────────────────────────────────────────
export interface Banner {
  id:       string;
  title:    string;
  subtitle: string;
  // Optional — §19.8: a pill claiming a specific offer ("Up to 20% Off",
  // "Free Delivery") asserts a platform-wide guarantee nothing backs. The
  // only real discount is a seller's own stop-loss deal, set per shop, never
  // category-wide. Only set this for a tagline that's true by construction
  // (e.g. "Discover Local"), never a number or a promise.
  tag?:     string;
  bg:       string;   // card background color
  accent:   string;   // title / tag accent color
  icon:     string;   // Ionicons glyph for decorative element
  imageUrl?: any;
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
    imageUrl: assetImg("home/banners/apana.png"),
  },
  {
    id:       "b2",
    title:    "Fresh Grocery",
    subtitle: "Farm-fresh vegetables, dairy & daily essentials delivered fast.",
    bg:       "#15803D",
    accent:   "#BBF7D0",
    icon:     "basket-outline",
    imageUrl: assetImg("home/banners/grocery.png"),
  },
  {
    id:       "b3",
    title:    "Fashion Week",
    subtitle: "Ethnic wear, western outfits & accessories from local boutiques.",
    bg:       "#9333EA",
    accent:   "#F3E8FF",
    icon:     "shirt-outline",
    imageUrl: assetImg("home/banners/fashion.png"),
  },
  {
    id:       "b4",
    // Named products removed from the subtitle — this banner has no per-city
    // real inventory check behind it, so naming specific items claims they're
    // in stock nearby when nobody has verified that.
    title:    "Local Favourites",
    subtitle: "Specialities from shops around you, not found on any chain app.",
    bg:       "#C2410C",
    accent:   "#FED7AA",
    icon:     "heart-outline",
    imageUrl: assetImg("home/banners/pune.png"),
  },
];

// TRENDING_ITEMS was removed (2026-09) — 12 invented shops (real chain names
// like "Metro Wholesale Mall" mixed with invented ones, fake "Open"/"Popular"
// badges) that nothing ever rendered. Dead phantom data is still phantom
// data: it was a landmine for the next screen that imports it expecting real
// trending shops. §19.8 — real trending would need an actual popularity
// signal (order volume, follows); none exists yet, so there is no
// replacement until one does.
