// ============================================================
// PRODUCT DETAIL DATA — Apana Store (Customer App)
//
// Full typed interfaces + mock data for the Product Detail screen.
// Covers all multi-category product types (grocery, electronics,
// fashion, pharmacy, food, beauty, sports, home).
//
// Backend: GET /api/products/:id → ProductDetail
// ============================================================

export type ProductCategory =
  | "grocery" | "electronics" | "pharmacy" | "fashion"
  | "food" | "beauty" | "sports" | "home" | "books" | "toys";

// ── Image placeholder (replace uri with real URL when backend ready) ──
export interface ProductImage {
  id:    string;
  color: string;   // placeholder background color
  icon:  string;   // Ionicons glyph centered on placeholder
}

// ── Variant option (e.g. "500g", "Blue", "Large") ─────────────
export interface ProductVariantOption {
  id:      string;
  label:   string;
  price:   number;
  mrp:     number;
  inStock: boolean;
}

// ── A group of variant options (e.g. Weight: [250g, 500g, 1kg]) ──
export interface ProductVariantGroup {
  type:    string;   // "Weight" | "Size" | "Color" | "Pack"
  options: ProductVariantOption[];
}

// ── Offer / coupon card ────────────────────────────────────────
export interface ProductOffer {
  id:          string;
  icon:        string;
  title:       string;
  description: string;
  color:       string;
}

// ── Review image placeholder ───────────────────────────────────
export interface ReviewImage {
  id:    string;
  color: string;
}

// ── Customer review ────────────────────────────────────────────
export interface ProductReview {
  id:       string;
  author:   string;
  initials: string;
  avatarBg: string;
  rating:   number;   // 1–5
  date:     string;
  title:    string;
  body:     string;
  images:   ReviewImage[];
  helpful:  number;
  verified: boolean;
}

// ── Specification row ──────────────────────────────────────────
export interface ProductSpec {
  label: string;
  value: string;
}

// ── Similar product card ───────────────────────────────────────
export interface SimilarProduct {
  id:     string;
  name:   string;
  price:  number;
  mrp:    number;
  rating: number;
  color:  string;   // placeholder bg
  icon:   string;   // Ionicons glyph
}

// ── Full product detail ────────────────────────────────────────
export interface ProductDetail {
  id:               string;
  storeId:          string;
  storeName:        string;
  storeType:        string;
  storeTypeColor:   string;
  storeTypeBg:      string;
  category:         ProductCategory;
  categoryLabel:    string;
  name:             string;
  brand:            string;
  unit:             string;      // "500 g", "1 piece", "1 pair"
  cartIcon:         string;      // Ionicons glyph for cart item
  cartBg:           string;      // bg color for cart item placeholder
  images:           ProductImage[];
  price:            number;
  mrp:              number;
  inStock:          boolean;
  stockCount:       number;      // 0 = out of stock, >10 = abundant
  rating:           number;      // 0.0–5.0
  reviewCount:      number;
  ratingBreakdown:  Record<number, number>;  // { 5: 120, 4: 45, 3: 20, 2: 8, 1: 5 }
  description:      string;
  highlights:       string[];
  variantGroups:    ProductVariantGroup[];
  offers:           ProductOffer[];
  specifications:   ProductSpec[];
  reviews:          ProductReview[];
  deliveryDays:     number;
  freeDeliveryAbove: number;
  returnDays:       number;
  isCodAvailable:   boolean;
  similarProducts:  SimilarProduct[];
}

// ── Helper ─────────────────────────────────────────────────────

export function getProductById(id: string): ProductDetail {
  return MOCK_PRODUCTS.find(p => p.id === id) ?? MOCK_PRODUCTS[0];
}

export function discountPercent(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

// ── Mock Products ──────────────────────────────────────────────

export const MOCK_PRODUCTS: ProductDetail[] = [

  // ── P1: Grocery — Organic Apples ──────────────────────────
  {
    id:             "p1",
    storeId:        "s1",
    storeName:      "Sharma General Store",
    storeType:      "Grocery",
    storeTypeColor: "#166534",
    storeTypeBg:    "#DCFCE7",
    category:       "grocery",
    categoryLabel:  "Fresh Fruits",
    name:           "Organic Kashmiri Apples",
    brand:          "Farm Fresh",
    unit:           "1 kg",
    cartIcon:       "nutrition-outline",
    cartBg:         "#FEF3C7",
    images: [
      { id: "p1i1", color: "#FEF3C7", icon: "nutrition-outline"   },
      { id: "p1i2", color: "#DCFCE7", icon: "leaf-outline"        },
      { id: "p1i3", color: "#FEE2E2", icon: "basket-outline"      },
      { id: "p1i4", color: "#FFF7ED", icon: "star-outline"        },
    ],
    price:           89,
    mrp:             120,
    inStock:         true,
    stockCount:      45,
    rating:          4.3,
    reviewCount:     218,
    ratingBreakdown: { 5: 110, 4: 65, 3: 28, 2: 10, 1: 5 },
    description:
      "Handpicked from the orchards of Kashmir, these premium organic apples are grown without synthetic pesticides or fertilisers. Crisp, juicy, and naturally sweet — perfect for snacking, salads, or baking. Each batch is cold-stored immediately after harvest to lock in freshness.",
    highlights: [
      "Certified organic — no synthetic pesticides",
      "Handpicked from Kashmir orchards",
      "Rich in dietary fibre and Vitamin C",
      "Cold-stored for maximum freshness",
      "Suitable for diabetics (low GI variety)",
    ],
    variantGroups: [
      {
        type: "Weight",
        options: [
          { id: "v1a", label: "500 g",  price: 49,  mrp: 65,  inStock: true  },
          { id: "v1b", label: "1 kg",   price: 89,  mrp: 120, inStock: true  },
          { id: "v1c", label: "2 kg",   price: 169, mrp: 230, inStock: true  },
          { id: "v1d", label: "5 kg",   price: 399, mrp: 550, inStock: false },
        ],
      },
    ],
    offers: [
      { id: "o1", icon: "pricetag-outline",  color: "#7C3AED", title: "Bank Offer",      description: "10% off on HDFC Bank Credit Cards. Max ₹50 off"   },
      { id: "o2", icon: "gift-outline",      color: "#0F4C81", title: "Apana Cashback",  description: "Get ₹15 Apana Cash on orders above ₹199"          },
      { id: "o3", icon: "refresh-outline",   color: "#059669", title: "Free Replacement",description: "Get free replacement if product is damaged on delivery" },
    ],
    specifications: [
      { label: "Brand",           value: "Farm Fresh"       },
      { label: "Origin",          value: "Kashmir, India"   },
      { label: "Variety",         value: "Royal Delicious"  },
      { label: "Net Weight",      value: "1 kg"             },
      { label: "Certification",   value: "India Organic"    },
      { label: "Storage",         value: "Cool & dry place" },
      { label: "Shelf Life",      value: "7–10 days"        },
      { label: "Calories",        value: "52 kcal / 100 g"  },
    ],
    reviews: [
      {
        id: "r1", author: "Priya Sharma", initials: "PS", avatarBg: "#DBEAFE",
        rating: 5, date: "12 Apr 2025", verified: true, helpful: 34,
        title: "Absolutely fresh and tasty!",
        body: "Got these delivered within 2 hours. The apples are crisp and sweet — definitely organic quality. Pack was well sealed. Will order again!",
        images: [
          { id: "ri1", color: "#FEF3C7" },
          { id: "ri2", color: "#DCFCE7" },
        ],
      },
      {
        id: "r2", author: "Rahul Verma", initials: "RV", avatarBg: "#FCE7F3",
        rating: 4, date: "8 Apr 2025", verified: true, helpful: 18,
        title: "Good quality but slightly small size",
        body: "Taste is great and clearly organic. Just wished the apples were a bit bigger. Overall very happy with the purchase.",
        images: [],
      },
      {
        id: "r3", author: "Anjali Nair", initials: "AN", avatarBg: "#DCFCE7",
        rating: 4, date: "3 Apr 2025", verified: false, helpful: 9,
        title: "Fresh produce at good price",
        body: "Much better than supermarket apples. You can actually taste the difference with organic. Delivery was fast.",
        images: [{ id: "ri3", color: "#FEE2E2" }],
      },
    ],
    deliveryDays:      1,
    freeDeliveryAbove: 199,
    returnDays:        2,
    isCodAvailable:    true,
    similarProducts: [
      { id: "p6",  name: "Alphonso Mangoes",    price: 149, mrp: 199, rating: 4.5, color: "#FFF7ED", icon: "nutrition-outline"   },
      { id: "p7",  name: "Fresh Bananas",       price: 39,  mrp: 55,  rating: 4.2, color: "#FEF9C3", icon: "leaf-outline"        },
      { id: "p8",  name: "Pomegranate 500g",    price: 79,  mrp: 99,  rating: 4.4, color: "#FEE2E2", icon: "rose-outline"        },
      { id: "p9",  name: "Green Grapes 500g",   price: 65,  mrp: 85,  rating: 4.1, color: "#DCFCE7", icon: "ellipse-outline"     },
    ],
  },

  // ── P2: Electronics — Wireless Earbuds ────────────────────
  {
    id:             "p2",
    storeId:        "s2",
    storeName:      "TechZone Electronics",
    storeType:      "Electronics",
    storeTypeColor: "#1E3A5F",
    storeTypeBg:    "#DBEAFE",
    category:       "electronics",
    categoryLabel:  "Audio & Headphones",
    name:           "ProSound X1 Wireless Earbuds",
    brand:          "ProSound",
    unit:           "1 pair",
    cartIcon:       "headset-outline",
    cartBg:         "#DBEAFE",
    images: [
      { id: "p2i1", color: "#1E3A5F", icon: "headset-outline"   },
      { id: "p2i2", color: "#DBEAFE", icon: "bluetooth-outline" },
      { id: "p2i3", color: "#EDE9FE", icon: "musical-note-outline" },
      { id: "p2i4", color: "#F1F5F9", icon: "battery-charging-outline" },
    ],
    price:           1299,
    mrp:             2499,
    inStock:         true,
    stockCount:      12,
    rating:          4.1,
    reviewCount:     543,
    ratingBreakdown: { 5: 220, 4: 180, 3: 90, 2: 35, 1: 18 },
    description:
      "ProSound X1 delivers studio-quality sound in a truly wireless form factor. Features Active Noise Cancellation (ANC), 28-hour total battery life with the charging case, IPX5 water resistance, and touch controls. Compatible with iOS and Android.",
    highlights: [
      "Active Noise Cancellation (ANC) — deep focus mode",
      "28 hours total playback (7 hrs buds + 21 hrs case)",
      "IPX5 sweat & water resistant",
      "Touch controls — play, pause, skip, call",
      "Low-latency Gaming Mode (< 60 ms)",
      "Dual mic with AI noise reduction for clear calls",
    ],
    variantGroups: [
      {
        type: "Color",
        options: [
          { id: "v2a", label: "Midnight Black", price: 1299, mrp: 2499, inStock: true  },
          { id: "v2b", label: "Pearl White",    price: 1299, mrp: 2499, inStock: true  },
          { id: "v2c", label: "Navy Blue",      price: 1399, mrp: 2599, inStock: false },
        ],
      },
    ],
    offers: [
      { id: "o4", icon: "card-outline",      color: "#1D4ED8", title: "EMI Available", description: "No-cost EMI from ₹433/month on HDFC & SBI cards"     },
      { id: "o5", icon: "pricetag-outline",  color: "#7C3AED", title: "Launch Offer",  description: "Extra ₹100 off with code TECH100. Limited period"    },
      { id: "o6", icon: "swap-horizontal-outline", color: "#059669", title: "Exchange Offer", description: "Get up to ₹300 off on exchange of old earbuds" },
    ],
    specifications: [
      { label: "Brand",           value: "ProSound"           },
      { label: "Model",           value: "X1 Pro"             },
      { label: "Connectivity",    value: "Bluetooth 5.3"      },
      { label: "Driver Size",     value: "10 mm dynamic"      },
      { label: "ANC",             value: "Yes (-35 dB)"       },
      { label: "Battery (Buds)",  value: "7 hours"            },
      { label: "Battery (Case)",  value: "21 hours"           },
      { label: "Water Resistance",value: "IPX5"               },
      { label: "Charging",        value: "USB-C + Qi wireless"},
      { label: "Warranty",        value: "1 year"             },
    ],
    reviews: [
      {
        id: "r4", author: "Karan Mehta", initials: "KM", avatarBg: "#DBEAFE",
        rating: 5, date: "15 Apr 2025", verified: true, helpful: 89,
        title: "Best earbuds under ₹1500!",
        body: "ANC works really well in office. Sound quality is excellent for the price. Battery easily lasts a full workday. Highly recommended!",
        images: [
          { id: "ri4", color: "#1E3A5F" },
          { id: "ri5", color: "#DBEAFE" },
        ],
      },
      {
        id: "r5", author: "Sita Reddy", initials: "SR", avatarBg: "#EDE9FE",
        rating: 3, date: "10 Apr 2025", verified: true, helpful: 42,
        title: "Good but call quality could be better",
        body: "Music sounds great. ANC is impressive for the price. However, call quality is average — people complain about my voice being unclear. Otherwise solid product.",
        images: [],
      },
    ],
    deliveryDays:      2,
    freeDeliveryAbove: 499,
    returnDays:        7,
    isCodAvailable:    false,
    similarProducts: [
      { id: "p10", name: "BassMax Earphones",   price: 799,  mrp: 1299, rating: 3.9, color: "#1E3A5F", icon: "headset-outline"        },
      { id: "p11", name: "SoundCore BT Speaker",price: 1599, mrp: 2299, rating: 4.3, color: "#1E3A5F", icon: "volume-high-outline"     },
      { id: "p12", name: "NeckBand Pro",         price: 599,  mrp: 999,  rating: 4.0, color: "#DBEAFE", icon: "radio-outline"          },
    ],
  },

  // ── P3: Fashion — Men's Kurta ──────────────────────────────
  {
    id:             "p3",
    storeId:        "s4",
    storeName:      "Style Hub Fashion",
    storeType:      "Fashion",
    storeTypeColor: "#6D28D9",
    storeTypeBg:    "#EDE9FE",
    category:       "fashion",
    categoryLabel:  "Men's Ethnic Wear",
    name:           "Cotton Blend Printed Kurta",
    brand:          "Ethnix",
    unit:           "1 piece",
    cartIcon:       "shirt-outline",
    cartBg:         "#EDE9FE",
    images: [
      { id: "p3i1", color: "#EDE9FE", icon: "shirt-outline"    },
      { id: "p3i2", color: "#DDD6FE", icon: "color-palette-outline" },
      { id: "p3i3", color: "#F3E8FF", icon: "resize-outline"   },
      { id: "p3i4", color: "#FAF5FF", icon: "star-outline"     },
    ],
    price:           549,
    mrp:             999,
    inStock:         true,
    stockCount:      8,
    rating:          4.0,
    reviewCount:     312,
    ratingBreakdown: { 5: 130, 4: 100, 3: 55, 2: 18, 1: 9 },
    description:
      "Crafted from a premium cotton-blend fabric, this printed kurta combines traditional craftsmanship with modern comfort. Ideal for festivals, casual outings, or work-from-home days. Machine washable and colour-fast.",
    highlights: [
      "60% cotton, 40% viscose blend — soft & breathable",
      "Block-printed motif — handcrafted artisan design",
      "Machine washable — colour-safe up to 40°C",
      "Regular fit — suitable for all body types",
      "Available in sizes S to 3XL",
    ],
    variantGroups: [
      {
        type: "Size",
        options: [
          { id: "v3a", label: "S",   price: 549, mrp: 999, inStock: true  },
          { id: "v3b", label: "M",   price: 549, mrp: 999, inStock: true  },
          { id: "v3c", label: "L",   price: 549, mrp: 999, inStock: true  },
          { id: "v3d", label: "XL",  price: 549, mrp: 999, inStock: true  },
          { id: "v3e", label: "2XL", price: 599, mrp: 999, inStock: false },
          { id: "v3f", label: "3XL", price: 649, mrp: 999, inStock: false },
        ],
      },
      {
        type: "Color",
        options: [
          { id: "v3g", label: "Indigo", price: 549, mrp: 999, inStock: true  },
          { id: "v3h", label: "Sage",   price: 549, mrp: 999, inStock: true  },
          { id: "v3i", label: "Terracotta", price: 549, mrp: 999, inStock: false },
        ],
      },
    ],
    offers: [
      { id: "o7", icon: "pricetag-outline", color: "#6D28D9", title: "Festival Sale",   description: "Buy 2 get 10% off. Buy 3 get 20% off"               },
      { id: "o8", icon: "gift-outline",     color: "#0F4C81", title: "Gift Wrapping",   description: "Free gift wrapping available at checkout"           },
    ],
    specifications: [
      { label: "Brand",       value: "Ethnix"               },
      { label: "Fabric",      value: "60% Cotton, 40% Viscose" },
      { label: "Pattern",     value: "Block Print"           },
      { label: "Fit",         value: "Regular"               },
      { label: "Neck",        value: "Mandarin Collar"       },
      { label: "Sleeve",      value: "3/4 Sleeve"            },
      { label: "Occasion",    value: "Casual / Festive"      },
      { label: "Care",        value: "Machine wash cold"     },
      { label: "Country",     value: "Made in India"         },
    ],
    reviews: [
      {
        id: "r6", author: "Amit Joshi", initials: "AJ", avatarBg: "#EDE9FE",
        rating: 5, date: "11 Apr 2025", verified: true, helpful: 56,
        title: "Perfect for Diwali!",
        body: "Fabric quality is really good for the price. Fits perfectly — not too loose, not tight. The colour matches the photos exactly. Very happy.",
        images: [{ id: "ri6", color: "#EDE9FE" }, { id: "ri7", color: "#DDD6FE" }],
      },
      {
        id: "r7", author: "Deepak Singh", initials: "DS", avatarBg: "#DBEAFE",
        rating: 3, date: "5 Apr 2025", verified: true, helpful: 22,
        title: "Good but sizing runs small",
        body: "I ordered XL but it fits more like a L. The fabric and print are nice. If you're between sizes, go one size up.",
        images: [],
      },
    ],
    deliveryDays:      3,
    freeDeliveryAbove: 499,
    returnDays:        15,
    isCodAvailable:    true,
    similarProducts: [
      { id: "p13", name: "Linen Nehru Jacket", price: 799,  mrp: 1499, rating: 4.2, color: "#EDE9FE", icon: "shirt-outline"       },
      { id: "p14", name: "Casual Polo T-Shirt",price: 349,  mrp: 599,  rating: 3.8, color: "#DBEAFE", icon: "shirt-outline"       },
      { id: "p15", name: "Dhoti Pant Set",     price: 699,  mrp: 1199, rating: 4.1, color: "#FEF3C7", icon: "body-outline"        },
    ],
  },

  // ── P4: Pharmacy — Vitamin D3 ──────────────────────────────
  {
    id:             "p4",
    storeId:        "s3",
    storeName:      "Gupta Medical Store",
    storeType:      "Pharmacy",
    storeTypeColor: "#0F5132",
    storeTypeBg:    "#DCFCE7",
    category:       "pharmacy",
    categoryLabel:  "Vitamins & Supplements",
    name:           "Vitamin D3 + K2 Capsules",
    brand:          "HealthFirst",
    unit:           "60 capsules",
    cartIcon:       "fitness-outline",
    cartBg:         "#DCFCE7",
    images: [
      { id: "p4i1", color: "#DCFCE7", icon: "fitness-outline"       },
      { id: "p4i2", color: "#D1FAE5", icon: "medical-outline"       },
      { id: "p4i3", color: "#FEF9C3", icon: "sunny-outline"         },
    ],
    price:           349,
    mrp:             499,
    inStock:         true,
    stockCount:      30,
    rating:          4.6,
    reviewCount:     892,
    ratingBreakdown: { 5: 560, 4: 220, 3: 80, 2: 22, 1: 10 },
    description:
      "HealthFirst Vitamin D3 2000 IU with Vitamin K2 (MK-7) 75 mcg supports calcium absorption, bone health, and immune function. Formulated with olive oil for optimal fat-soluble absorption. Third-party tested for purity and potency.",
    highlights: [
      "Vitamin D3 2000 IU + K2 MK-7 75 mcg per capsule",
      "Olive oil base for superior absorption",
      "Third-party lab tested — no artificial additives",
      "Supports bone health, immunity & mood",
      "60 capsules — 2-month supply",
      "Vegetarian-friendly softgel capsule",
    ],
    variantGroups: [
      {
        type: "Pack",
        options: [
          { id: "v4a", label: "60 caps",  price: 349, mrp: 499, inStock: true },
          { id: "v4b", label: "120 caps", price: 649, mrp: 899, inStock: true },
          { id: "v4c", label: "180 caps", price: 899, mrp: 1299, inStock: true },
        ],
      },
    ],
    offers: [
      { id: "o9",  icon: "pricetag-outline", color: "#059669", title: "Subscribe & Save", description: "Save an extra 15% with monthly auto-delivery" },
      { id: "o10", icon: "gift-outline",     color: "#0F4C81", title: "Bundle Deal",      description: "Buy with Omega-3 and save ₹100"               },
    ],
    specifications: [
      { label: "Brand",          value: "HealthFirst"              },
      { label: "Vitamin D3",     value: "2000 IU per capsule"      },
      { label: "Vitamin K2",     value: "MK-7 75 mcg per capsule"  },
      { label: "Base Oil",       value: "Extra Virgin Olive Oil"   },
      { label: "Capsule Type",   value: "Softgel (Vegetarian)"     },
      { label: "Quantity",       value: "60 capsules"              },
      { label: "Shelf Life",     value: "24 months from MFG"       },
      { label: "Storage",        value: "Cool, dry place"          },
      { label: "Certification",  value: "GMP certified facility"   },
    ],
    reviews: [
      {
        id: "r8", author: "Dr. Meena Kapoor", initials: "MK", avatarBg: "#DCFCE7",
        rating: 5, date: "14 Apr 2025", verified: true, helpful: 145,
        title: "Best D3+K2 combo available",
        body: "As a nutritionist I recommend this brand to my clients. The MK-7 form of K2 is the most bioavailable. Olive oil base ensures proper absorption. Lab reports are transparent.",
        images: [],
      },
      {
        id: "r9", author: "Vinod Pillai", initials: "VP", avatarBg: "#FEF3C7",
        rating: 4, date: "9 Apr 2025", verified: true, helpful: 67,
        title: "Noticeable improvement in energy",
        body: "Been taking this for 2 months after my doctor found low D3 levels. Levels are back to normal now and I feel much more energetic. No side effects at all.",
        images: [{ id: "ri8", color: "#DCFCE7" }],
      },
    ],
    deliveryDays:      1,
    freeDeliveryAbove: 299,
    returnDays:        0,
    isCodAvailable:    true,
    similarProducts: [
      { id: "p16", name: "Omega-3 Fish Oil",   price: 449, mrp: 599, rating: 4.4, color: "#DBEAFE", icon: "water-outline"    },
      { id: "p17", name: "Multivitamin Daily",  price: 299, mrp: 449, rating: 4.1, color: "#DCFCE7", icon: "fitness-outline"  },
      { id: "p18", name: "Magnesium Glycinate", price: 399, mrp: 549, rating: 4.5, color: "#EDE9FE", icon: "medical-outline"  },
    ],
  },

  // ── P5: Food — Artisan Sourdough Bread ────────────────────
  {
    id:             "p5",
    storeId:        "s5",
    storeName:      "Fresh Bakes",
    storeType:      "Bakery",
    storeTypeColor: "#92400E",
    storeTypeBg:    "#FEF3C7",
    category:       "food",
    categoryLabel:  "Artisan Breads",
    name:           "Classic Sourdough Loaf",
    brand:          "Fresh Bakes",
    unit:           "450 g loaf",
    cartIcon:       "restaurant-outline",
    cartBg:         "#FEF3C7",
    images: [
      { id: "p5i1", color: "#FEF3C7", icon: "restaurant-outline" },
      { id: "p5i2", color: "#FED7AA", icon: "flame-outline"      },
      { id: "p5i3", color: "#FFEDD5", icon: "leaf-outline"       },
    ],
    price:           149,
    mrp:             180,
    inStock:         true,
    stockCount:      6,
    rating:          4.7,
    reviewCount:     156,
    ratingBreakdown: { 5: 110, 4: 32, 3: 9, 2: 3, 1: 2 },
    description:
      "Slow-fermented for 20 hours using a 5-year-old wild yeast starter. Our Classic Sourdough has a crispy crust, open crumb, and a mild tang. Made with organic whole wheat and bread flour — no preservatives, no additives.",
    highlights: [
      "20-hour cold fermentation for complex flavour",
      "Wild yeast starter — no commercial yeast",
      "Organic whole wheat + bread flour blend",
      "Zero preservatives or artificial additives",
      "High in natural probiotics — good for gut health",
      "Best consumed within 3 days of bake date",
    ],
    variantGroups: [
      {
        type: "Size",
        options: [
          { id: "v5a", label: "Half (225g)",  price: 79,  mrp: 95,  inStock: true },
          { id: "v5b", label: "Full (450g)",  price: 149, mrp: 180, inStock: true },
          { id: "v5c", label: "XL (900g)",    price: 279, mrp: 340, inStock: false },
        ],
      },
    ],
    offers: [
      { id: "o11", icon: "gift-outline",     color: "#92400E", title: "Morning Fresh",   description: "Order before 8 AM — baked & delivered by noon" },
      { id: "o12", icon: "pricetag-outline", color: "#0F4C81", title: "Weekly Bundle",   description: "Subscribe for 3 loaves/week and save ₹60"       },
    ],
    specifications: [
      { label: "Baker",         value: "Fresh Bakes Kitchen"    },
      { label: "Weight",        value: "450 g (approx.)"        },
      { label: "Flour",         value: "Organic Whole Wheat + Bread Flour" },
      { label: "Leavening",     value: "Wild Yeast Starter"     },
      { label: "Fermentation",  value: "20 hours cold proof"    },
      { label: "Preservatives", value: "None"                   },
      { label: "Shelf Life",    value: "3 days at room temp"    },
      { label: "Allergens",     value: "Wheat, Gluten"          },
    ],
    reviews: [
      {
        id: "r10", author: "Neha Kulkarni", initials: "NK", avatarBg: "#FEF3C7",
        rating: 5, date: "16 Apr 2025", verified: true, helpful: 38,
        title: "Best sourdough in Pune!",
        body: "I have tried many bakeries. This is genuinely the best sourdough I have had outside a European bakery. The crust is perfect and the crumb is beautiful. Highly recommend!",
        images: [{ id: "ri9", color: "#FEF3C7" }, { id: "ri10", color: "#FED7AA" }],
      },
      {
        id: "r11", author: "Rohan Das", initials: "RD", avatarBg: "#DBEAFE",
        rating: 5, date: "13 Apr 2025", verified: true, helpful: 24,
        title: "Arrived fresh, tastes amazing",
        body: "Ordered at 7:30 AM and it arrived by 11 AM. Still warm! The tang is perfect — not too sour. Great with butter or avocado.",
        images: [],
      },
    ],
    deliveryDays:      0,
    freeDeliveryAbove: 199,
    returnDays:        0,
    isCodAvailable:    false,
    similarProducts: [
      { id: "p19", name: "Multigrain Loaf",     price: 129, mrp: 160, rating: 4.5, color: "#FEF3C7", icon: "restaurant-outline" },
      { id: "p20", name: "Croissant (4 pcs)",   price: 120, mrp: 149, rating: 4.6, color: "#FED7AA", icon: "cafe-outline"       },
      { id: "p21", name: "Banana Walnut Muffin", price: 89,  mrp: 109, rating: 4.3, color: "#FFEDD5", icon: "cafe-outline"       },
    ],
  },
];
