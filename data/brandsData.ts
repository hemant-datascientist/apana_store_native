// ============================================================
// BRANDS DATA — Apana Store
//
// All brands available across stores in the city.
// Customers can search and filter by category, then tap
// a brand to browse its products.
//
// color    — placeholder background for the brand initial circle
// initial  — first letter shown when no logo is loaded
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
  id:           string;
  name:         string;
  category:     BrandCategory;
  productCount: number;
  storeCount:   number;
  color:        string;
  initial:      string;
  isVerified:   boolean;
  isPremium?:   boolean;
  tagline?:     string;
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

// ── Brand catalog (mock — replace with /brands?city=Pune API) ─
export const BRANDS: Brand[] = [
  {
    id: "b1", name: "Amul", category: "grocery",
    productCount: 42, storeCount: 5,
    color: "#1E40AF", initial: "A",
    isVerified: true, isPremium: true,
    tagline: "The Taste of India",
  },
  {
    id: "b2", name: "Tata", category: "grocery",
    productCount: 68, storeCount: 4,
    color: "#0F4C81", initial: "T",
    isVerified: true, isPremium: true,
    tagline: "Trusted by Millions",
  },
  {
    id: "b3", name: "Britannia", category: "food",
    productCount: 35, storeCount: 5,
    color: "#B45309", initial: "B",
    isVerified: true,
    tagline: "Eat Healthy, Think Better",
  },
  {
    id: "b4", name: "Nestlé", category: "food",
    productCount: 28, storeCount: 3,
    color: "#DC2626", initial: "N",
    isVerified: true, isPremium: true,
  },
  {
    id: "b5", name: "Parle", category: "food",
    productCount: 22, storeCount: 5,
    color: "#92400E", initial: "P",
    isVerified: true,
  },
  {
    id: "b6", name: "Samsung", category: "electronics",
    productCount: 54, storeCount: 2,
    color: "#1D4ED8", initial: "S",
    isVerified: true, isPremium: true,
    tagline: "Do What You Can't",
  },
  {
    id: "b7", name: "boAt", category: "electronics",
    productCount: 31, storeCount: 3,
    color: "#7C3AED", initial: "B",
    isVerified: true,
  },
  {
    id: "b8", name: "Lava", category: "electronics",
    productCount: 18, storeCount: 2,
    color: "#0891B2", initial: "L",
    isVerified: false,
  },
  {
    id: "b9", name: "Nike", category: "fashion",
    productCount: 89, storeCount: 2,
    color: "#111827", initial: "N",
    isVerified: true, isPremium: true,
    tagline: "Just Do It",
  },
  {
    id: "b10", name: "Puma", category: "fashion",
    productCount: 63, storeCount: 3,
    color: "#D97706", initial: "P",
    isVerified: true, isPremium: true,
  },
  {
    id: "b11", name: "Adidas", category: "fashion",
    productCount: 72, storeCount: 2,
    color: "#059669", initial: "A",
    isVerified: true, isPremium: true,
    tagline: "Impossible Is Nothing",
  },
  {
    id: "b12", name: "Zara", category: "fashion",
    productCount: 45, storeCount: 1,
    color: "#374151", initial: "Z",
    isVerified: true, isPremium: true,
  },
  {
    id: "b13", name: "Himalaya", category: "health",
    productCount: 37, storeCount: 4,
    color: "#065F46", initial: "H",
    isVerified: true,
  },
  {
    id: "b14", name: "Dabur", category: "health",
    productCount: 29, storeCount: 5,
    color: "#78350F", initial: "D",
    isVerified: true,
  },
  {
    id: "b15", name: "Patanjali", category: "health",
    productCount: 51, storeCount: 3,
    color: "#166534", initial: "P",
    isVerified: true,
  },
  {
    id: "b16", name: "Dove", category: "beauty",
    productCount: 24, storeCount: 4,
    color: "#DB2777", initial: "D",
    isVerified: true,
  },
  {
    id: "b17", name: "Mamaearth", category: "beauty",
    productCount: 38, storeCount: 3,
    color: "#65A30D", initial: "M",
    isVerified: true, isPremium: true,
  },
  {
    id: "b18", name: "Lakme", category: "beauty",
    productCount: 47, storeCount: 3,
    color: "#EC4899", initial: "L",
    isVerified: true, isPremium: true,
  },
  {
    id: "b19", name: "Pepsi", category: "food",
    productCount: 15, storeCount: 5,
    color: "#1E40AF", initial: "P",
    isVerified: true,
  },
  {
    id: "b20", name: "Lays", category: "food",
    productCount: 12, storeCount: 5,
    color: "#D97706", initial: "L",
    isVerified: true,
  },
];
