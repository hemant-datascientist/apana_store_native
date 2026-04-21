// ============================================================
// SEARCH RESULTS DATA — Apana Store (Customer App)
//
// Types + mock data pool for the global search results screen.
// Covers products from all 5 stores + all 5 stores themselves.
//
// Backend:
//   GET /search/products?q=<query>&category=<cat>&sort=<sort>
//   GET /search/stores?q=<query>&sort=<sort>
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
  rating:    number;
  reviewCount: number;
  storeId:   string;
  storeName: string;
  category:  string;
  badge?:    string;
  icon:      string;   // Ionicons glyph (placeholder for real image)
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

// ── Mock product pool ─────────────────────────────────────────
// 30 products spread across all 5 stores and all major categories.
// Replace with real backend data when available.

const PRODUCT_POOL: SearchProductResult[] = [
  // s1 — Sharma General Store (Grocery)
  { id:"sp1",  name:"Basmati Rice 5 kg",         price:349,  mrp:420,  rating:4.5, reviewCount:312, storeId:"s1", storeName:"Sharma General Store", category:"Grocery",    icon:"layers-outline",         iconBg:"#FEF3C7" },
  { id:"sp2",  name:"Toor Dal 1 kg",              price:149,  mrp:180,  rating:4.3, reviewCount:195, storeId:"s1", storeName:"Sharma General Store", category:"Grocery",    icon:"ellipse-outline",        iconBg:"#FFEDD5" },
  { id:"sp3",  name:"Sunflower Oil 1 L",          price:135,  mrp:165,  rating:4.1, reviewCount:143, storeId:"s1", storeName:"Sharma General Store", category:"Grocery",    icon:"water-outline",          iconBg:"#FEF9C3" },
  { id:"sp4",  name:"Aashirvaad Atta 10 kg",      price:485,  mrp:560,  rating:4.7, reviewCount:520, storeId:"s1", storeName:"Sharma General Store", category:"Grocery",    icon:"apps-outline",           iconBg:"#FEE2E2" },
  { id:"sp5",  name:"Amul Butter 500 g",          price:255,  mrp:280,  rating:4.6, reviewCount:410, storeId:"s1", storeName:"Sharma General Store", category:"Grocery",    badge:"Fresh",                  icon:"cafe-outline",           iconBg:"#DBEAFE" },
  { id:"sp6",  name:"Parle-G Biscuits 800 g",     price:89,   mrp:100,  rating:4.4, reviewCount:890, storeId:"s1", storeName:"Sharma General Store", category:"Grocery",    icon:"grid-outline",           iconBg:"#FCE7F3" },
  // s2 — TechZone Electronics
  { id:"sp7",  name:"boAt Airdopes 141",           price:1299, mrp:2990, rating:4.2, reviewCount:6420, storeId:"s2", storeName:"TechZone Electronics", category:"Electronics", badge:"Best Seller",           icon:"headset-outline",        iconBg:"#DBEAFE" },
  { id:"sp8",  name:"Redmi 13C 4G 128 GB",        price:9499, mrp:11499,rating:4.3, reviewCount:3200, storeId:"s2", storeName:"TechZone Electronics", category:"Mobiles",    icon:"phone-portrait-outline", iconBg:"#EDE9FE" },
  { id:"sp9",  name:"Syska 65 W Charger",         price:549,  mrp:999,  rating:4.1, reviewCount:870, storeId:"s2", storeName:"TechZone Electronics", category:"Electronics", icon:"flash-outline",          iconBg:"#FEF3C7" },
  { id:"sp10", name:"HP 14 Laptop Intel i3",      price:31990,mrp:39990,rating:4.4, reviewCount:1450,storeId:"s2", storeName:"TechZone Electronics", category:"Electronics", icon:"laptop-outline",         iconBg:"#F3F4F6" },
  { id:"sp11", name:"Logitech M235 Mouse",        price:699,  mrp:999,  rating:4.5, reviewCount:2100, storeId:"s2", storeName:"TechZone Electronics", category:"Electronics", icon:"hardware-chip-outline",  iconBg:"#DCFCE7" },
  { id:"sp12", name:"TP-Link Wi-Fi Router",       price:1299, mrp:1899, rating:4.2, reviewCount:980, storeId:"s2", storeName:"TechZone Electronics", category:"Electronics", icon:"wifi-outline",           iconBg:"#DBEAFE" },
  // s3 — Gupta Medical Store (Pharmacy)
  { id:"sp13", name:"Paracetamol 500 mg × 15",   price:30,   mrp:36,   rating:4.8, reviewCount:2300, storeId:"s3", storeName:"Gupta Medical Store",  category:"Pharmacy",   icon:"medkit-outline",         iconBg:"#DCFCE7" },
  { id:"sp14", name:"Vitamin C 1000 mg × 30",    price:249,  mrp:325,  rating:4.7, reviewCount:1100, storeId:"s3", storeName:"Gupta Medical Store",  category:"Pharmacy",   badge:"Immunity",               icon:"leaf-outline",           iconBg:"#ECFDF5" },
  { id:"sp15", name:"Dettol Antiseptic 100 mL",  price:89,   mrp:110,  rating:4.6, reviewCount:3400, storeId:"s3", storeName:"Gupta Medical Store",  category:"Pharmacy",   icon:"shield-checkmark-outline",iconBg:"#DBEAFE" },
  { id:"sp16", name:"BP Monitor Digital",        price:1299, mrp:1999, rating:4.3, reviewCount:560, storeId:"s3", storeName:"Gupta Medical Store",  category:"Pharmacy",   icon:"pulse-outline",          iconBg:"#FEE2E2" },
  { id:"sp17", name:"Glucometer Kit",            price:899,  mrp:1299, rating:4.5, reviewCount:780, storeId:"s3", storeName:"Gupta Medical Store",  category:"Pharmacy",   icon:"analytics-outline",      iconBg:"#FEF3C7" },
  { id:"sp18", name:"Cetaphil Moisturising Cream",price:449, mrp:595,  rating:4.7, reviewCount:1890, storeId:"s3", storeName:"Gupta Medical Store",  category:"Pharmacy",   icon:"color-palette-outline",  iconBg:"#FCE7F3" },
  // s4 — Style Hub Fashion
  { id:"sp19", name:"Men's Polo T-Shirt",        price:499,  mrp:999,  rating:4.2, reviewCount:730, storeId:"s4", storeName:"Style Hub Fashion",    category:"Fashion",    icon:"shirt-outline",          iconBg:"#DBEAFE" },
  { id:"sp20", name:"Women's Kurti Cotton",      price:699,  mrp:1299, rating:4.4, reviewCount:1240, storeId:"s4", storeName:"Style Hub Fashion",    category:"Fashion",    badge:"Trending",               icon:"body-outline",           iconBg:"#FCE7F3" },
  { id:"sp21", name:"Men's Formal Trousers",     price:849,  mrp:1699, rating:4.3, reviewCount:490, storeId:"s4", storeName:"Style Hub Fashion",    category:"Fashion",    icon:"reorder-three-outline",  iconBg:"#EDE9FE" },
  { id:"sp22", name:"Sneakers White Canvas",     price:1299, mrp:2499, rating:4.5, reviewCount:870, storeId:"s4", storeName:"Style Hub Fashion",    category:"Fashion",    icon:"walk-outline",           iconBg:"#DCFCE7" },
  { id:"sp23", name:"Casual Hoodie Unisex",      price:799,  mrp:1499, rating:4.6, reviewCount:1100, storeId:"s4", storeName:"Style Hub Fashion",    category:"Fashion",    badge:"New Arrival",            icon:"shirt-outline",          iconBg:"#FEF3C7" },
  { id:"sp24", name:"Leather Wallet Slim",       price:399,  mrp:799,  rating:4.1, reviewCount:340, storeId:"s4", storeName:"Style Hub Fashion",    category:"Fashion",    icon:"card-outline",           iconBg:"#FFEDD5" },
  // s5 — Fresh Bakes
  { id:"sp25", name:"Multigrain Bread 400 g",    price:65,   mrp:80,   rating:4.7, reviewCount:920, storeId:"s5", storeName:"Fresh Bakes",          category:"Food",       badge:"Fresh",                  icon:"apps-outline",           iconBg:"#FFEDD5" },
  { id:"sp26", name:"Chocolate Truffle Cake 500 g",price:449,mrp:599,  rating:4.9, reviewCount:1560, storeId:"s5", storeName:"Fresh Bakes",          category:"Food",       badge:"Best Seller",            icon:"gift-outline",           iconBg:"#FCE7F3" },
  { id:"sp27", name:"Croissant Butter × 2",      price:99,   mrp:130,  rating:4.6, reviewCount:640, storeId:"s5", storeName:"Fresh Bakes",          category:"Food",       badge:"Fresh",                  icon:"cafe-outline",           iconBg:"#FEF9C3" },
  { id:"sp28", name:"Whole Wheat Rusk 300 g",    price:79,   mrp:100,  rating:4.4, reviewCount:480, storeId:"s5", storeName:"Fresh Bakes",          category:"Food",       icon:"layers-outline",          iconBg:"#FEF3C7" },
  { id:"sp29", name:"Eggless Cupcakes × 6",      price:199,  mrp:249,  rating:4.8, reviewCount:1100, storeId:"s5", storeName:"Fresh Bakes",          category:"Food",       icon:"happy-outline",          iconBg:"#DCFCE7" },
  { id:"sp30", name:"Focaccia with Herbs",       price:149,  mrp:199,  rating:4.5, reviewCount:320, storeId:"s5", storeName:"Fresh Bakes",          category:"Food",       badge:"Chef's Pick",            icon:"leaf-outline",           iconBg:"#ECFDF5" },
];

// ── Mock store pool ───────────────────────────────────────────
const STORE_POOL: SearchStoreResult[] = [
  {
    id:          "s1",
    name:        "Sharma General Store",
    rating:      4.8,
    reviewCount: 2140,
    category:    "Grocery",
    distanceKm:  0.8,
    isOpen:      true,
    isLive:      true,
    icon:        "basket-outline",
    iconBg:      "#D1FAE5",
    accentColor: "#166534",
    tags:        ["Grocery", "Staples", "Personal Care", "Dairy"],
  },
  {
    id:          "s2",
    name:        "TechZone Electronics",
    rating:      4.5,
    reviewCount: 890,
    category:    "Electronics",
    distanceKm:  1.4,
    isOpen:      true,
    isLive:      false,
    icon:        "hardware-chip-outline",
    iconBg:      "#DBEAFE",
    accentColor: "#1E3A5F",
    tags:        ["Mobiles", "Laptops", "Accessories", "Chargers"],
  },
  {
    id:          "s3",
    name:        "Gupta Medical Store",
    rating:      4.7,
    reviewCount: 1560,
    category:    "Pharmacy",
    distanceKm:  0.5,
    isOpen:      true,
    isLive:      true,
    icon:        "medical-outline",
    iconBg:      "#DCFCE7",
    accentColor: "#0F5132",
    tags:        ["Medicines", "Vitamins", "Health Devices", "Skincare"],
  },
  {
    id:          "s4",
    name:        "Style Hub Fashion",
    rating:      4.4,
    reviewCount: 720,
    category:    "Fashion",
    distanceKm:  2.1,
    isOpen:      false,
    isLive:      false,
    icon:        "shirt-outline",
    iconBg:      "#EDE9FE",
    accentColor: "#6D28D9",
    tags:        ["Men", "Women", "Kids", "Footwear", "Accessories"],
  },
  {
    id:          "s5",
    name:        "Fresh Bakes",
    rating:      4.9,
    reviewCount: 3200,
    category:    "Food & Drink",
    distanceKm:  1.1,
    isOpen:      true,
    isLive:      true,
    icon:        "cafe-outline",
    iconBg:      "#FEF3C7",
    accentColor: "#92400E",
    tags:        ["Bread", "Cakes", "Croissants", "Cupcakes", "Rusk"],
  },
];

// ── Helper: score-based relevance search ─────────────────────
function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase().trim());
}

// ── searchProducts ────────────────────────────────────────────
// Filters PRODUCT_POOL by query, then sorts by the chosen sort.
// Returns an empty array if query is blank (caller should handle).
export function searchProducts(
  query:     string,
  sort:      SearchSort = "relevance",
): SearchProductResult[] {
  const q = query.trim();
  if (!q) return [];

  const filtered = PRODUCT_POOL.filter(p =>
    matchesQuery(p.name,      q) ||
    matchesQuery(p.category,  q) ||
    matchesQuery(p.storeName, q),
  );

  switch (sort) {
    case "price_asc":  return [...filtered].sort((a, b) => a.price - b.price);
    case "price_desc": return [...filtered].sort((a, b) => b.price - a.price);
    case "rating":     return [...filtered].sort((a, b) => b.rating - a.rating);
    default:           return filtered;   // relevance = filter order
  }
}

// ── searchStores ──────────────────────────────────────────────
// Filters STORE_POOL by query, then sorts by the chosen sort.
export function searchStores(
  query: string,
  sort:  SearchSort = "relevance",
): SearchStoreResult[] {
  const q = query.trim();
  if (!q) return [];

  const filtered = STORE_POOL.filter(s =>
    matchesQuery(s.name,     q) ||
    matchesQuery(s.category, q) ||
    s.tags.some(t => matchesQuery(t, q)),
  );

  switch (sort) {
    case "price_asc":
    case "price_desc":
      // For stores, price sort → sort by distance instead
      return [...filtered].sort((a, b) =>
        sort === "price_asc" ? a.distanceKm - b.distanceKm : b.distanceKm - a.distanceKm,
      );
    case "rating":     return [...filtered].sort((a, b) => b.rating - a.rating);
    default:           return filtered;
  }
}

// ── Popular suggestions — shown on empty/default state ────────
export const POPULAR_SUGGESTIONS = [
  "Rice", "Dal", "Bread", "Milk", "Laptop", "Cake",
  "Medicines", "T-Shirt", "Charger", "Butter",
];
