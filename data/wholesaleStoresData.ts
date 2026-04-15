// ============================================================
// WHOLESALE STORES DATA — Apana Store (Customer App)
//
// Mock data for the Stores → Wholesale tab feed.
// Replace with GET /stores/wholesale?lat=&lng= when ready.
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

export const WHOLESALE_PROMOS: WholesalePromo[] = [
  {
    id:          "wp1",
    brandName:   "METRO",
    tagline:     "Hal Na!",
    promoTitle:  "SHOP & WIN",
    promoSub:    "20 More Prizes",
    bgLeft:      "#003087",
    bgRight:     "#E8380D",
    textColor:   "#fff",
    accentColor: "#FFD700",
    badges:      ["EPAY", "KT", "BUY LESS"],
  },
  {
    id:          "wp2",
    brandName:   "LOTS",
    tagline:     "Wholesale Solutions",
    promoTitle:  "BULK SAVINGS",
    promoSub:    "Upto 40% Off on Staples",
    bgLeft:      "#145A32",
    bgRight:     "#F39C12",
    textColor:   "#fff",
    accentColor: "#ABEBC6",
    badges:      ["GST Ready", "B2B", "FSSAI"],
  },
  {
    id:          "wp3",
    brandName:   "BJs",
    tagline:     "Wholesale Club",
    promoTitle:  "MEMBER DEAL",
    promoSub:    "Extra 15% for Members",
    bgLeft:      "#1A237E",
    bgRight:     "#C62828",
    textColor:   "#fff",
    accentColor: "#90CAF9",
    badges:      ["Members Only", "Bulk", "Delivery"],
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
    type:       "Grocery Wholesale",
    typeColor:  "#15803D",
    typeBg:     "#DCFCE7",
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
    type:       "Baby & Kids",
    typeColor:  "#9333EA",
    typeBg:     "#F3E8FF",
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
    type:       "General Wholesale",
    typeColor:  "#1D4ED8",
    typeBg:     "#DBEAFE",
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
    type:       "Cash & Carry",
    typeColor:  "#0369A1",
    typeBg:     "#E0F2FE",
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
    type:       "Grocery Wholesale",
    typeColor:  "#15803D",
    typeBg:     "#DCFCE7",
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
    type:       "Cash & Carry",
    typeColor:  "#C2410C",
    typeBg:     "#FFEDD5",
    rating:     4.6,
    reviews:    521,
    distanceKm: 6.8,
    categories: ["Staples", "FMCG", "Household"],
    bgColor:    "#FFEDD5",
    icon:       "pricetag-outline",
  },
];
