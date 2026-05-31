// ============================================================
// FASHION DATA — Apana Store (Customer App)
//
// Gender/age tabs: Men | Women | Boy (Kids) | Girl (Kids)
// Each tab has its own set of clothing sub-categories.
//
// Replace with GET /customer/fashion/categories when backend ready.
// ============================================================

export type FashionGender = "men" | "women" | "boy" | "girl";

export interface FashionSubCat {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph
  bg:    string;   // placeholder image background color
  imageUrl?: any;
}

export interface FashionGenderConfig {
  key:       FashionGender;
  label:     string;
  subLabel?: string;   // shown below label (e.g. "Kids")
  icon:      string;   // Ionicons glyph for tab button
  subCats:   FashionSubCat[];
}

export const FASHION_GENDERS: FashionGenderConfig[] = [
  // ── MEN ────────────────────────────────────────────────────
  {
    key:   "men",
    label: "Men",
    icon:  "man-outline",
    subCats: [
      { key: "topwear",     label: "Topwear",      icon: "shirt-outline",            bg: "#DBEAFE", imageUrl: require("../assets/images/fashion/men_clothing.png") },
      { key: "innerwear",   label: "Inner-wear",   icon: "body-outline",             bg: "#FEE2E2", imageUrl: require("../assets/images/fashion/men_innerwear.png") },
      { key: "bottomwear",  label: "Bottom-wear",  icon: "reorder-three-outline",    bg: "#DCFCE7", imageUrl: require("../assets/images/fashion/men_bottom_wear.png") },
      { key: "footwear",    label: "Footwear",     icon: "walk-outline",             bg: "#FEF3C7", imageUrl: require("../assets/images/fashion/men_footwear.png") },
      { key: "caps",        label: "Caps",         icon: "happy-outline",            bg: "#EDE9FE" },
      { key: "ties",        label: "Ties",         icon: "ribbon-outline",           bg: "#FCE7F3" },
      { key: "watches",     label: "Watches",      icon: "time-outline",             bg: "#FFEDD5", imageUrl: require("../assets/images/fashion/men_watch.png") },
      { key: "socks",       label: "Socks",        icon: "footsteps-outline",        bg: "#ECFDF5" },
      { key: "wallets",     label: "Wallets",      icon: "wallet-outline",           bg: "#F3F4F6" },
      { key: "traditional", label: "Traditional",  icon: "flag-outline",             bg: "#FEF3C7", imageUrl: require("../assets/images/category/products/ethnic.png") },
      { key: "winterwear",  label: "Winter-wear",  icon: "snow-outline",             bg: "#DBEAFE", imageUrl: require("../assets/images/category/products/winter_wear.png") },
      { key: "raincoats",   label: "Raincoats",    icon: "umbrella-outline",         bg: "#E0F2FE" },
      { key: "eyewear",     label: "Eye-wear",     icon: "glasses-outline",          bg: "#FCE7F3" },
      { key: "shaving",     label: "Shaving",      icon: "cut-outline",              bg: "#DCFCE7", imageUrl: require("../assets/images/category/products/mens_groom.png") },
      { key: "fragrances",  label: "Fragrances",   icon: "flower-outline",           bg: "#F3E8FF", imageUrl: require("../assets/images/category/products/fragrance.png") },
      { key: "belts",       label: "Belts",        icon: "reorder-two-outline",      bg: "#FFEDD5" },
      { key: "blazers",     label: "Blazer",       icon: "business-outline",         bg: "#DBEAFE", imageUrl: require("../assets/images/fashion/blazer.png") },
      { key: "kurti",       label: "Kurti",        icon: "shirt-outline",            bg: "#FCE7F3", imageUrl: require("../assets/images/fashion/men_kurta.png") },
      { key: "sportswear",  label: "Sportswear",   icon: "football-outline",         bg: "#DCFCE7", imageUrl: require("../assets/images/fashion/men_sportswear.png") },
      { key: "mencare",     label: "Men's Care",   icon: "medkit-outline",           bg: "#FEE2E2", imageUrl: require("../assets/images/category/products/mens_groom.png") },
    ],
  },

  // ── WOMEN ──────────────────────────────────────────────────
  {
    key:   "women",
    label: "Women",
    icon:  "woman-outline",
    subCats: [
      { key: "topwear",     label: "Topwear",      icon: "shirt-outline",            bg: "#FCE7F3", imageUrl: require("../assets/images/fashion/women_clothing.png") },
      { key: "innerwear",   label: "Inner-wear",   icon: "body-outline",             bg: "#FEE2E2", imageUrl: require("../assets/images/fashion/women_innerwear.png") },
      { key: "bottomwear",  label: "Bottom-wear",  icon: "reorder-three-outline",    bg: "#DCFCE7", imageUrl: require("../assets/images/fashion/women_bottom_wear.png") },
      { key: "footwear",    label: "Footwear",     icon: "walk-outline",             bg: "#FEF3C7", imageUrl: require("../assets/images/fashion/women_footwear.png") },
      { key: "sarees",      label: "Sarees",       icon: "sparkles-outline",         bg: "#FCE7F3", imageUrl: require("../assets/images/category/products/ethnic.png") },
      { key: "suits",       label: "Suits",        icon: "ribbon-outline",           bg: "#EDE9FE", imageUrl: require("../assets/images/fashion/women_clothing.png") },
      { key: "watches",     label: "Watches",      icon: "time-outline",             bg: "#FFEDD5", imageUrl: require("../assets/images/fashion/women_watch.png") },
      { key: "handbags",    label: "Handbags",     icon: "bag-outline",              bg: "#ECFDF5", imageUrl: require("../assets/images/category/products/bags_luggage.png") },
      { key: "wallets",     label: "Wallets",      icon: "wallet-outline",           bg: "#F3F4F6" },
      { key: "traditional", label: "Traditional",  icon: "flag-outline",             bg: "#FEF3C7", imageUrl: require("../assets/images/category/products/ethnic.png") },
      { key: "winterwear",  label: "Winter-wear",  icon: "snow-outline",             bg: "#DBEAFE", imageUrl: require("../assets/images/category/products/winter_wear.png") },
      { key: "raincoats",   label: "Raincoats",    icon: "umbrella-outline",         bg: "#E0F2FE" },
      { key: "eyewear",     label: "Eye-wear",     icon: "glasses-outline",          bg: "#FCE7F3" },
      { key: "makeup",      label: "Makeup",       icon: "color-palette-outline",    bg: "#FCE7F3", imageUrl: require("../assets/images/category/products/makeup.png") },
      { key: "fragrances",  label: "Fragrances",   icon: "flower-outline",           bg: "#F3E8FF", imageUrl: require("../assets/images/category/products/fragrance.png") },
      { key: "jewellery",   label: "Jewellery",    icon: "diamond-outline",          bg: "#FEF3C7", imageUrl: require("../assets/images/category/products/fashion_jwl.png") },
      { key: "kurties",     label: "Kurties",      icon: "shirt-outline",            bg: "#FCE7F3", imageUrl: require("../assets/images/fashion/women_kurti.png") },
      { key: "lehenga",     label: "Lehenga",      icon: "sparkles-outline",         bg: "#EDE9FE", imageUrl: require("../assets/images/category/products/ethnic.png") },
      { key: "sportswear",  label: "Sportswear",   icon: "football-outline",         bg: "#DCFCE7", imageUrl: require("../assets/images/fashion/women_sportswear.png") },
      { key: "womencare",   label: "Women's Care", icon: "heart-outline",            bg: "#FEE2E2", imageUrl: require("../assets/images/category/products/skincare.png") },
    ],
  },

  // ── BOY (Kids) ─────────────────────────────────────────────
  {
    key:      "boy",
    label:    "Boy",
    subLabel: "Kids",
    icon:     "person-outline",
    subCats: [
      { key: "topwear",     label: "Topwear",      icon: "shirt-outline",            bg: "#DBEAFE", imageUrl: require("../assets/images/category/products/kids_wear.png") },
      { key: "innerwear",   label: "Inner-wear",   icon: "body-outline",             bg: "#FEE2E2", imageUrl: require("../assets/images/fashion/boy_innerwear.png") },
      { key: "bottomwear",  label: "Bottom-wear",  icon: "reorder-three-outline",    bg: "#DCFCE7", imageUrl: require("../assets/images/fashion/boy_bottom_wear.png") },
      { key: "footwear",    label: "Footwear",     icon: "walk-outline",             bg: "#FEF3C7", imageUrl: require("../assets/images/fashion/boy_footwear.png") },
      { key: "caps",        label: "Caps",         icon: "happy-outline",            bg: "#EDE9FE" },
      { key: "schoolwear",  label: "School Wear",  icon: "school-outline",           bg: "#DBEAFE" },
      { key: "watches",     label: "Watches",      icon: "time-outline",             bg: "#FFEDD5", imageUrl: require("../assets/images/fashion/boy_watch.png") },
      { key: "socks",       label: "Socks",        icon: "footsteps-outline",        bg: "#ECFDF5" },
      { key: "jackets",     label: "Jackets",      icon: "layers-outline",           bg: "#F3F4F6", imageUrl: require("../assets/images/category/products/winter_wear.png") },
      { key: "sportswear",  label: "Sportswear",   icon: "football-outline",         bg: "#DCFCE7", imageUrl: require("../assets/images/fashion/boy_sportswear.png") },
      { key: "winterwear",  label: "Winter-wear",  icon: "snow-outline",             bg: "#DBEAFE", imageUrl: require("../assets/images/category/products/winter_wear.png") },
      { key: "raincoats",   label: "Raincoats",    icon: "umbrella-outline",         bg: "#E0F2FE" },
      { key: "eyewear",     label: "Eye-wear",     icon: "glasses-outline",          bg: "#FCE7F3" },
      { key: "casual",      label: "Casual Wear",  icon: "happy-outline",            bg: "#FEF3C7", imageUrl: require("../assets/images/category/products/kids_wear.png") },
      { key: "accessories", label: "Accessories",  icon: "pricetag-outline",         bg: "#FFEDD5" },
      { key: "boycare",     label: "Boy's Care",   icon: "medkit-outline",           bg: "#FEE2E2" },
    ],
  },

  // ── GIRL (Kids) ────────────────────────────────────────────
  {
    key:      "girl",
    label:    "Girl",
    subLabel: "Kids",
    icon:     "person-outline",
    subCats: [
      { key: "topwear",     label: "Topwear",      icon: "shirt-outline",            bg: "#FCE7F3", imageUrl: require("../assets/images/category/products/kids_wear.png") },
      { key: "innerwear",   label: "Inner-wear",   icon: "body-outline",             bg: "#FEE2E2", imageUrl: require("../assets/images/fashion/girl_innerwear.png") },
      { key: "bottomwear",  label: "Bottom-wear",  icon: "reorder-three-outline",    bg: "#DCFCE7", imageUrl: require("../assets/images/fashion/girl_bottom_wear.png") },
      { key: "footwear",    label: "Footwear",     icon: "walk-outline",             bg: "#FEF3C7", imageUrl: require("../assets/images/fashion/girl_footwear.png") },
      { key: "frocks",      label: "Frocks",       icon: "sparkles-outline",         bg: "#FCE7F3", imageUrl: require("../assets/images/category/products/kids_wear.png") },
      { key: "schoolwear",  label: "School Wear",  icon: "school-outline",           bg: "#DBEAFE" },
      { key: "watches",     label: "Watches",      icon: "time-outline",             bg: "#FFEDD5", imageUrl: require("../assets/images/fashion/girl_watch.png") },
      { key: "accessories", label: "Accessories",  icon: "diamond-outline",          bg: "#EDE9FE" },
      { key: "jackets",     label: "Jackets",      icon: "layers-outline",           bg: "#F3F4F6", imageUrl: require("../assets/images/category/products/winter_wear.png") },
      { key: "sportswear",  label: "Sportswear",   icon: "football-outline",         bg: "#DCFCE7", imageUrl: require("../assets/images/fashion/girl_sportswear.png") },
      { key: "winterwear",  label: "Winter-wear",  icon: "snow-outline",             bg: "#DBEAFE", imageUrl: require("../assets/images/category/products/winter_wear.png") },
      { key: "raincoats",   label: "Raincoats",    icon: "umbrella-outline",         bg: "#E0F2FE" },
      { key: "eyewear",     label: "Eye-wear",     icon: "glasses-outline",          bg: "#FCE7F3" },
      { key: "haircare",    label: "Hair Care",    icon: "cut-outline",              bg: "#EDE9FE" },
      { key: "fragrances",  label: "Fragrances",   icon: "flower-outline",           bg: "#F3E8FF", imageUrl: require("../assets/images/category/products/fragrance.png") },
      { key: "girlcare",    label: "Girl's Care",  icon: "heart-outline",            bg: "#FEE2E2" },
    ],
  },
];
