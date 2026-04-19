// ============================================================
// OFFER ZONE DATA — Apana Store
//
// Two data shapes:
//   OfferEvent  — store-run sales events (Weekend Sale, Festival, etc.)
//   Offer       — individual product/category deals from stores
//
// Category filter drives which offers are shown.
// ============================================================

export type OfferCategory = "all" | "grocery" | "electronics" | "fashion" | "food" | "health";

export interface OfferEvent {
  id:          string;
  title:       string;
  subtitle:    string;
  color:       string;
  tag:         string;       // "Weekend Special" | "Seasonal" etc.
  startDate:   string;
  endDate:     string;
  storeCount:  number;
  dealCount:   number;
}

export interface Offer {
  id:          string;
  title:       string;
  subtitle:    string;
  discount:    string;       // "20% OFF" | "₹500 OFF" | "BUY 2 GET 1"
  storeId:     string;
  storeName:   string;
  storeColor:  string;
  category:    OfferCategory;
  validUntil:  string;
  isHot?:      boolean;
  isFeatured?: boolean;
}

// ── Category filter list ──────────────────────────────────
export const OFFER_CATEGORIES: { key: OfferCategory; label: string; icon: string }[] = [
  { key: "all",         label: "All",         icon: "grid-outline"             },
  { key: "grocery",     label: "Grocery",     icon: "cart-outline"             },
  { key: "electronics", label: "Electronics", icon: "phone-portrait-outline"   },
  { key: "fashion",     label: "Fashion",     icon: "shirt-outline"            },
  { key: "food",        label: "Food",        icon: "fast-food-outline"        },
  { key: "health",      label: "Health",      icon: "medkit-outline"           },
];

// ── Store-run events (banner carousel) ───────────────────
export const OFFER_EVENTS: OfferEvent[] = [
  {
    id:         "ev1",
    title:      "Weekend Mega Sale",
    subtitle:   "Up to 60% off across all stores",
    color:      "#7C3AED",
    tag:        "Weekend Special",
    startDate:  "Sat, Apr 19",
    endDate:    "Sun, Apr 20",
    storeCount: 12,
    dealCount:  80,
  },
  {
    id:         "ev2",
    title:      "Summer Essentials",
    subtitle:   "Beat the heat with great deals",
    color:      "#F97316",
    tag:        "Seasonal",
    startDate:  "Apr 18",
    endDate:    "Apr 25",
    storeCount: 8,
    dealCount:  45,
  },
  {
    id:         "ev3",
    title:      "Local Brand Fair",
    subtitle:   "Discover and support local brands",
    color:      "#0F4C81",
    tag:        "Community",
    startDate:  "Apr 20",
    endDate:    "Apr 22",
    storeCount: 20,
    dealCount:  100,
  },
  {
    id:         "ev4",
    title:      "Health & Wellness Week",
    subtitle:   "Medicines, supplements & fitness at lower prices",
    color:      "#059669",
    tag:        "Wellness",
    startDate:  "Apr 21",
    endDate:    "Apr 27",
    storeCount: 6,
    dealCount:  38,
  },
];

// ── Individual deals ──────────────────────────────────────
export const OFFERS: Offer[] = [
  {
    id:         "o1",
    title:      "20% off on all fresh vegetables",
    subtitle:   "Minimum order ₹300",
    discount:   "20% OFF",
    storeId:    "s1",
    storeName:  "Sharma General Store",
    storeColor: "#166534",
    category:   "grocery",
    validUntil: "Today 11 PM",
    isHot:      true,
    isFeatured: true,
  },
  {
    id:         "o2",
    title:      "Flat ₹500 off on electronics above ₹3000",
    subtitle:   "Mobiles, accessories & more",
    discount:   "₹500 OFF",
    storeId:    "s2",
    storeName:  "TechZone Electronics",
    storeColor: "#1E3A5F",
    category:   "electronics",
    validUntil: "2 days left",
    isFeatured: true,
  },
  {
    id:         "o3",
    title:      "Buy 2 medicines, get 1 free",
    subtitle:   "On selected OTC medicines",
    discount:   "BUY 2 GET 1",
    storeId:    "s3",
    storeName:  "Gupta Medical Store",
    storeColor: "#0F5132",
    category:   "health",
    validUntil: "Ends tomorrow",
    isHot:      true,
  },
  {
    id:         "o4",
    title:      "Flat 30% off on fashion items",
    subtitle:   "T-shirts, jeans, kurtas & more",
    discount:   "30% OFF",
    storeId:    "s4",
    storeName:  "Style Hub Fashion",
    storeColor: "#6D28D9",
    category:   "fashion",
    validUntil: "3 days left",
    isFeatured: true,
  },
  {
    id:         "o5",
    title:      "Free pastry with any coffee order",
    subtitle:   "Valid on orders above ₹150",
    discount:   "FREE ITEM",
    storeId:    "s5",
    storeName:  "Fresh Bakes",
    storeColor: "#92400E",
    category:   "food",
    validUntil: "Daily offer",
    isHot:      true,
  },
  {
    id:         "o6",
    title:      "₹200 off on grocery orders above ₹1000",
    subtitle:   "Stock up and save big",
    discount:   "₹200 OFF",
    storeId:    "s1",
    storeName:  "Sharma General Store",
    storeColor: "#166534",
    category:   "grocery",
    validUntil: "5 days left",
  },
  {
    id:         "o7",
    title:      "50% off on phone accessories",
    subtitle:   "Cases, chargers, earphones",
    discount:   "50% OFF",
    storeId:    "s2",
    storeName:  "TechZone Electronics",
    storeColor: "#1E3A5F",
    category:   "electronics",
    validUntil: "Today only",
    isHot:      true,
  },
  {
    id:         "o8",
    title:      "Summer dress collection — 25% off",
    subtitle:   "Breathable fabrics for the season",
    discount:   "25% OFF",
    storeId:    "s4",
    storeName:  "Style Hub Fashion",
    storeColor: "#6D28D9",
    category:   "fashion",
    validUntil: "4 days left",
  },
  {
    id:         "o9",
    title:      "Combo meal at ₹199 — Save ₹80",
    subtitle:   "Sandwich + coffee + dessert",
    discount:   "₹80 OFF",
    storeId:    "s5",
    storeName:  "Fresh Bakes",
    storeColor: "#92400E",
    category:   "food",
    validUntil: "Today only",
  },
  {
    id:         "o10",
    title:      "Immunity booster kit — 15% off",
    subtitle:   "Vitamins, minerals & herbal mix",
    discount:   "15% OFF",
    storeId:    "s3",
    storeName:  "Gupta Medical Store",
    storeColor: "#0F5132",
    category:   "health",
    validUntil: "1 week left",
    isFeatured: true,
  },
];
