// ============================================================
// BRANDS DATA — Apana Store
//
// A curated list of brand-name search shortcuts, same idea as the Seasonal
// Picks tiles (SeasonalCategorySection): a name to tap that routes into the
// REAL search index. Nothing here is a claim about a specific seller,
// stock level, or city — that was the fabrication that lived here before
// (invented productCount/storeCount/isVerified/isPremium against real
// trademark holders). This file names no store, promises no stock, and
// grants no verification — it is a pointer into search, nothing else.
// ============================================================

export type BrandCategory =
  | "all"
  | "grocery"
  | "food"
  | "electronics"
  | "fashion"
  | "health"
  | "beauty";

export interface Brand {
  id:       string;
  name:     string;
  category: BrandCategory;
  color:    string;   // background for the initial circle (decoration only)
  initial:  string;   // shown when no logo is loaded
}

// ── Category filter list ──────────────────────────────────
export const BRAND_CATEGORIES: { key: BrandCategory; label: string }[] = [
  { key: "all",         label: "All"         },
  { key: "grocery",     label: "Grocery"     },
  { key: "food",        label: "Food"        },
  { key: "electronics", label: "Electronics" },
  { key: "fashion",     label: "Fashion"     },
  { key: "health",      label: "Health"      },
  { key: "beauty",      label: "Beauty"      },
];

// ── Brand name shortcuts (no per-brand stats — search answers that live) ──
export const BRANDS: Brand[] = [
  { id: "b1",  name: "Amul",      category: "grocery",     color: "#1E40AF", initial: "A" },
  { id: "b2",  name: "Tata",      category: "grocery",     color: "#0F4C81", initial: "T" },
  { id: "b3",  name: "Britannia", category: "food",        color: "#B45309", initial: "B" },
  { id: "b4",  name: "Nestlé",    category: "food",        color: "#DC2626", initial: "N" },
  { id: "b5",  name: "Parle",     category: "food",        color: "#92400E", initial: "P" },
  { id: "b6",  name: "Samsung",   category: "electronics", color: "#1D4ED8", initial: "S" },
  { id: "b7",  name: "boAt",      category: "electronics", color: "#7C3AED", initial: "B" },
  { id: "b8",  name: "Lava",      category: "electronics", color: "#0891B2", initial: "L" },
  { id: "b9",  name: "Nike",      category: "fashion",     color: "#111827", initial: "N" },
  { id: "b10", name: "Puma",      category: "fashion",     color: "#D97706", initial: "P" },
  { id: "b11", name: "Adidas",    category: "fashion",     color: "#059669", initial: "A" },
  { id: "b12", name: "Zara",      category: "fashion",     color: "#374151", initial: "Z" },
  { id: "b13", name: "Himalaya",  category: "health",      color: "#065F46", initial: "H" },
  { id: "b14", name: "Dabur",     category: "health",      color: "#78350F", initial: "D" },
  { id: "b15", name: "Patanjali", category: "health",      color: "#166534", initial: "P" },
  { id: "b16", name: "Dove",      category: "beauty",      color: "#DB2777", initial: "D" },
  { id: "b17", name: "Mamaearth", category: "beauty",      color: "#65A30D", initial: "M" },
  { id: "b18", name: "Lakme",     category: "beauty",      color: "#EC4899", initial: "L" },
  { id: "b19", name: "Pepsi",     category: "food",        color: "#1E40AF", initial: "P" },
  { id: "b20", name: "Lays",      category: "food",        color: "#D97706", initial: "L" },
];
