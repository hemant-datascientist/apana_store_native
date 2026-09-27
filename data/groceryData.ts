// ============================================================
// GROCERY DATA — Apana Store (Customer App)
//
// Sub-categories for the Grocery category feed's navigation grid.
// ============================================================
import { assetImg } from "../lib/assetImg";

// ── Sub-categories ────────────────────────────────────────────

export interface GrocerySubCategory {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph (shown when no image)
  bg:    string;   // tile background color
  apc:   string;   // APC class this tile opens (§27 grocery, APC-01-*)
  imageUrl?: any;
}

// Grocery sub-categories — grocery ONLY, aligned to the §27 APC grocery
// classes (APC-01-*). Non-grocery tiles (kitchen accessories, soft drinks,
// snacks, chocolates) were removed; each tile opens its APC class.
export const GROCERY_SUB_CATEGORIES: GrocerySubCategory[] = [
  { key: "vegetables", label: "Vegetables",              icon: "leaf-outline",       bg: "#DCFCE7", apc: "APC-01-VEG",  imageUrl: assetImg("grocery/vegetables.png") },
  { key: "fruits",     label: "Fruits",                  icon: "nutrition-outline",  bg: "#FEF3C7", apc: "APC-01-FRT",  imageUrl: assetImg("grocery/fruits.png") },
  { key: "dairy",      label: "Dairy",                   icon: "water-outline",      bg: "#DBEAFE", apc: "APC-01-DAI",  imageUrl: assetImg("grocery/milky_products.png") },
  { key: "dryfruits",  label: "Dry Fruits & Nuts",       icon: "ellipse-outline",    bg: "#FFEDD5", apc: "APC-01-DRYF", imageUrl: assetImg("grocery/dry_fruits.png") },
  { key: "grains",     label: "Grains & Seeds",          icon: "nutrition-outline",  bg: "#FEF9C3", apc: "APC-01-STPL", imageUrl: assetImg("grocery/wheat_pulses.png") },
  { key: "ration",     label: "Ration",                  icon: "basket-outline",     bg: "#FEE2E2", apc: "APC-01-STPL" },
  { key: "spices",     label: "Spices",                  icon: "flask-outline",      bg: "#FCE7F3", apc: "APC-01-SPC" },
  { key: "tea",        label: "Tea, Coffee & Drink Powders", icon: "cafe-outline",   bg: "#FEF3C7", apc: "APC-01-TEA" },
  { key: "oil",        label: "Cooking Oil & Ghee",      icon: "water-outline",      bg: "#ECFDF5", apc: "APC-01-OIL",  imageUrl: assetImg("grocery/oil.png") },
  { key: "batters",    label: "Batters",                 icon: "beaker-outline",     bg: "#EDE9FE", apc: "APC-01-STPL" },
  { key: "masala",     label: "Masala & Sauces",         icon: "flame-outline",      bg: "#FEE2E2", apc: "APC-01-SPC",  imageUrl: assetImg("grocery/masala.png") },
  { key: "pickles",    label: "Pickles, Papad & Chutney", icon: "restaurant-outline", bg: "#FEF9C3", apc: "APC-01-PKGF" },
];

// REGULAR_ITEMS / SEASONAL_ITEMS / GROCERY_SECTIONS were removed (2026-09) —
// hardcoded per-kg price RANGES ("Potatoes ₹20-45/kg") that GroceryFeed never
// rendered. A static price nobody's shop actually charges is exactly the
// phantom-data class §19.8 forbids, and dead code is still a landmine —
// whoever wired it up next would have shipped invented prices as if real.
// Real grocery prices come from CategoryLiveProducts (real seller listings).
