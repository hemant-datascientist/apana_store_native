// ============================================================
// B2C STORES DATA — Apana Store (Customer App)
//
// Direct-to-Consumer brands/manufacturers.
// Mock data for Stores → B2C tab.
// Replace with GET /stores/b2c when backend is ready.
// ============================================================

// ── Promo Banners ─────────────────────────────────────────────
// Category-theme promotional banners (FMCG product style).

export interface B2CPromo {
  id:         string;
  headline:   string;       // e.g. "SNACKING MADE RIGHT"
  subline:    string;       // e.g. "Brands direct to your door"
  tag:        string;       // pill label
  bgColor:    string;
  accentColor:string;
  textColor:  string;
  icons:      string[];     // Ionicons — product category icons
}

export const B2C_PROMOS: B2CPromo[] = [
  {
    id:          "b1",
    headline:    "SNACKING MADE RIGHT",
    subline:     "Top FMCG brands. Direct to you.",
    tag:         "Manufacturer Direct",
    bgColor:     "#7C3AED",
    accentColor: "#4C1D95",
    textColor:   "#fff",
    icons:       ["fast-food-outline", "cafe-outline", "ice-cream-outline"],
  },
  {
    id:          "b2",
    headline:    "HOME & PERSONAL CARE",
    subline:     "Trusted brands. Factory prices.",
    tag:         "D2C Deals",
    bgColor:     "#0369A1",
    accentColor: "#075985",
    textColor:   "#fff",
    icons:       ["home-outline", "sparkles-outline", "leaf-outline"],
  },
  {
    id:          "b3",
    headline:    "BABY & FAMILY",
    subline:     "Safe certified products. Direct from makers.",
    tag:         "Verified Brands",
    bgColor:     "#BE185D",
    accentColor: "#9D174D",
    textColor:   "#fff",
    icons:       ["happy-outline", "heart-outline", "shield-checkmark-outline"],
  },
];

// ── B2C Store Cards ────────────────────────────────────────────

export interface B2CStore {
  id:          string;
  name:        string;
  category:    string;      // main category badge
  categoryColor: string;
  categoryBg:  string;
  rating:      number;
  reviews:     number;
  distanceKm:  number;
  website:     boolean;     // shows "Website" tag
  tags:        string[];    // other category tags
  description: string;      // 2-3 line company description
  logoColor:   string;      // brand logo bg
  logoText:    string;      // 1-3 letter abbreviation shown in logo
  logoTextColor: string;
  icon:        string;      // Ionicons fallback
}

export const B2C_STORES: B2CStore[] = [
  {
    id:            "b1",
    name:          "Mondelez International Food",
    category:      "Chocolate",
    categoryColor: "#92400E",
    categoryBg:    "#FEF3C7",
    rating:        4.2,
    reviews:       393,
    distanceKm:    5.6,
    website:       true,
    tags:          ["Chocolate", "Biscuits", "Beverages"],
    description:   "Mondelez India (formerly Cadbury India) is the Indian arm of global snacking giant Mondelez International. Known for Dairy Milk, Oreo, Tang and Ritz — operating in chocolates, biscuits, beverages, and candies.",
    logoColor:     "#6B21A8",
    logoText:      "MD",
    logoTextColor: "#fff",
    icon:          "gift-outline",
  },
  {
    id:            "b2",
    name:          "SAMRAT",
    category:      "Flours",
    categoryColor: "#92400E",
    categoryBg:    "#FFEDD5",
    rating:        4.5,
    reviews:       411,
    distanceKm:    5.0,
    website:       true,
    tags:          ["Flours", "Besan", "Pulses"],
    description:   "Samrat is one of India's leading agro-based brands catering to a diverse range of superior quality products including Flours, Besan, Malka, Urad, Dharma Datta and Maida.",
    logoColor:     "#DC2626",
    logoText:      "SR",
    logoTextColor: "#fff",
    icon:          "storefront-outline",
  },
  {
    id:            "b3",
    name:          "Stay Sure",
    category:      "Baby Care",
    categoryColor: "#1D4ED8",
    categoryBg:    "#DBEAFE",
    rating:        4.7,
    reviews:       265,
    distanceKm:    5.2,
    website:       true,
    tags:          ["Diaper", "Napkin", "Baby Care"],
    description:   "Stay Sure provides convenient pre-packaged baby care products — the first company to introduce resalable diapers in India. Committed to quality, safety, and comfort for every family.",
    logoColor:     "#0369A1",
    logoText:      "SS",
    logoTextColor: "#fff",
    icon:          "happy-outline",
  },
  {
    id:            "b4",
    name:          "Gits Since 1963",
    category:      "Packaged Foods",
    categoryColor: "#15803D",
    categoryBg:    "#DCFCE7",
    rating:        4.1,
    reviews:       459,
    distanceKm:    5.5,
    website:       true,
    tags:          ["Packaged Foods", "Instant Mixes", "Ready to Cook"],
    description:   "Gits pioneered the convenience packaged food segment in India by introducing instant mixes. Since 1963, they have set the benchmark for quality, taste, and innovation in ready-to-cook foods.",
    logoColor:     "#166534",
    logoText:      "GITS",
    logoTextColor: "#fff",
    icon:          "fast-food-outline",
  },
  {
    id:            "b5",
    name:          "Writable Instruments",
    category:      "Stationery",
    categoryColor: "#0369A1",
    categoryBg:    "#E0F2FE",
    rating:        4.4,
    reviews:       989,
    distanceKm:    5.7,
    website:       true,
    tags:          ["Stationery", "Pens", "Office Supplies"],
    description:   "Writable Instruments Ltd is a product stationery manufacturer and exporter based in India. Founded in 2017 as a venture under the Forexh Group, offering premium writing instruments at factory prices.",
    logoColor:     "#1E40AF",
    logoText:      "WR",
    logoTextColor: "#fff",
    icon:          "pencil-outline",
  },
  {
    id:            "b6",
    name:          "Peg Partner",
    category:      "Chips",
    categoryColor: "#C2410C",
    categoryBg:    "#FFEDD5",
    rating:        4.0,
    reviews:       495,
    distanceKm:    6.3,
    website:       true,
    tags:          ["Chips", "Snacks", "Beverages"],
    description:   "Peg Partner is a Mumbai-based food and beverage company founded in 2024. Built around the 'Chips Pot' brand under the Chipote umbrella — delivering bold Indian snack flavours direct to consumers.",
    logoColor:     "#B45309",
    logoText:      "PP",
    logoTextColor: "#fff",
    icon:          "cafe-outline",
  },
];
