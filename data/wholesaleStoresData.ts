// ============================================================
// WHOLESALE STORES DATA — Apana Store (Customer App)
//
// Stores → Wholesale tab: category banners (below). The store list itself is
// live (useStoreBucket("wholesale")); WholesaleStore is its card type.
// ============================================================

// ── Promotional Banners ────────────────────────────────────────
// Ad/flyer-style banners (not store photos).

export interface WholesalePromo {
  id:          string;
  brandName:   string;
  tagline:     string;
  promoTitle:  string;
  promoSub:    string;
  bgLeft:      string;   // left panel background
  bgRight:     string;   // right panel (promo area)
  textColor:   string;
  accentColor: string;
  badges:      string[]; // partner/feature logos as text labels
}

// 🔴 CATEGORY BANNERS ONLY (2026-10-15). These were METRO, LOTS and BJs —
// real companies that are not on Apana — with offers nobody made ("Upto 40%
// Off", "20 More Prizes", "Extra 15% for Members"). A customer could walk into
// a real store expecting them. Now: what the Wholesale tab is for, no brand,
// no offer. `brandName` is the banner's headline word.
export const WHOLESALE_PROMOS: WholesalePromo[] = [
  {
    id:          "wp1",
    brandName:   "WHOLESALE",
    tagline:     "Buy in bulk, near you",
    promoTitle:  "FOR YOUR SHOP",
    promoSub:    "Restock from local wholesalers",
    bgLeft:      "#003087",
    bgRight:     "#E8380D",
    textColor:   "#fff",
    accentColor: "#FFD700",
    badges:      ["Bulk", "Local"],
  },
  {
    id:          "wp2",
    brandName:   "STAPLES",
    tagline:     "By the bag",
    promoTitle:  "BULK STAPLES",
    promoSub:    "Rice, atta, oil, sugar",
    bgLeft:      "#145A32",
    bgRight:     "#F39C12",
    textColor:   "#fff",
    accentColor: "#ABEBC6",
    badges:      ["Bulk", "Kirana"],
  },
  {
    id:          "wp3",
    brandName:   "BY THE BOX",
    tagline:     "Packaged goods in cases",
    promoTitle:  "CASE PACKS",
    promoSub:    "Biscuits, soaps, drinks",
    bgLeft:      "#1A237E",
    bgRight:     "#C62828",
    textColor:   "#fff",
    accentColor: "#90CAF9",
    badges:      ["Box", "Bulk"],
  },
];

// ── Wholesale Store Cards ──────────────────────────────────────

export interface WholesaleStore {
  id:         string;
  name:       string;
  type:       string;
  typeColor:  string;
  typeBg:     string;
  rating:     number;
  reviews:    number;
  distanceKm: number;
  categories: string[];
  bgColor:    string;
  icon:       string;
}

export const WHOLESALE_STORES: WholesaleStore[] = [
  {
    id:         "w1",
    name:       "LOTS Wholesale Solutions",
    type:       "Wholesale",
    typeColor:  "#92400E",
    typeBg:     "#FEF3C7",
    rating:     4.5,
    reviews:    41,
    distanceKm: 5.0,
    categories: ["Grocery Staples", "Grocery Shopping"],
    bgColor:    "#DCFCE7",
    icon:       "business-outline",
  },
  {
    id:         "w2",
    name:       "Krishna Baby Care Wholesale",
    type:       "Wholesale",
    typeColor:  "#92400E",
    typeBg:     "#FEF3C7",
    rating:     4.7,
    reviews:    265,
    distanceKm: 5.2,
    categories: ["Baby Care", "Baby Wholesale"],
    bgColor:    "#F3E8FF",
    icon:       "happy-outline",
  },
  {
    id:         "w3",
    name:       "BJs Wholesale Club",
    type:       "Wholesale",
    typeColor:  "#92400E",
    typeBg:     "#FEF3C7",
    rating:     4.7,
    reviews:    459,
    distanceKm: 5.5,
    categories: ["Walmart Shopping", "Bulk Goods"],
    bgColor:    "#DBEAFE",
    icon:       "storefront-outline",
  },
  {
    id:         "w4",
    name:       "Metro Wholesale",
    type:       "Wholesale",
    typeColor:  "#92400E",
    typeBg:     "#FEF3C7",
    rating:     4.2,
    reviews:    92,
    distanceKm: 5.5,
    categories: ["HoReCa", "Bulk Grocery", "Electronics"],
    bgColor:    "#E0F2FE",
    icon:       "cart-outline",
  },
  {
    id:         "w5",
    name:       "Reliance Smart Point",
    type:       "Wholesale",
    typeColor:  "#92400E",
    typeBg:     "#FEF3C7",
    rating:     4.4,
    reviews:    183,
    distanceKm: 6.1,
    categories: ["Grocery", "FMCG", "Dairy"],
    bgColor:    "#DCFCE7",
    icon:       "bag-outline",
  },
  {
    id:         "w6",
    name:       "D-Mart Ready",
    type:       "Wholesale",
    typeColor:  "#92400E",
    typeBg:     "#FEF3C7",
    rating:     4.6,
    reviews:    521,
    distanceKm: 6.8,
    categories: ["Staples", "FMCG", "Household"],
    bgColor:    "#FFEDD5",
    icon:       "pricetag-outline",
  },
];
