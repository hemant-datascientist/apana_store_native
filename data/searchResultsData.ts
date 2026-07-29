// ============================================================
// SEARCH RESULTS DATA — Apana Store (Customer App)
//
// Types + UI constants for the global search results screen. Search reads REAL
// seller inventory (services/searchService → fetchLiveProducts); the old mock
// product / store pools were removed — a search must never surface a product no
// shop actually lists (§19.8).
// ============================================================

// ── Sort options ──────────────────────────────────────────────
export type SearchSort =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "rating";

export const SEARCH_SORT_OPTIONS: { key: SearchSort; label: string }[] = [
  { key: "relevance",  label: "Relevance" },
  { key: "price_asc",  label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "rating",     label: "Top Rated" },
];

// ── Product result ────────────────────────────────────────────
export interface SearchProductResult {
  id:        string;
  name:      string;
  price:     number;
  mrp:       number;
  rating:    number;      // 0 = no ratings yet (card hides the star — no fake stars)
  reviewCount: number;
  storeId:   string;
  storeName: string;
  category:  string;
  badge?:    string;
  image?:    string | null; // real product photo when present; else the icon
  icon:      string;   // Ionicons glyph fallback when there is no image
  iconBg:    string;   // placeholder background color
}

// ── Store result ──────────────────────────────────────────────
export interface SearchStoreResult {
  id:         string;
  name:       string;
  rating:     number;
  reviewCount: number;
  category:   string;
  distanceKm: number;
  isOpen:     boolean;
  isLive:     boolean;
  icon:       string;
  iconBg:     string;
  accentColor: string;
  tags:       string[];
}

// ── Popular suggestions — shown on the empty / default state ──
// Generic search TERMS (not fake products), safe to show before a query.
export const POPULAR_SUGGESTIONS = [
  "Rice", "Dal", "Bread", "Milk", "Laptop", "Cake",
  "Medicines", "T-Shirt", "Charger", "Butter",
];
