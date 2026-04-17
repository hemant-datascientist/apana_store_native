// ============================================================
// FASHION DATA — Apana Store (Customer App)
//
// Gender/age tabs: Men | Women | Boy | Girl
// Each gender has its own set of sub-categories (clothing types).
//
// Replace with GET /customer/fashion/categories when backend ready.
// ============================================================

export type FashionGender = "men" | "women" | "boy" | "girl";

export interface FashionSubCat {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph
  bg:    string;   // placeholder image background color
}

export interface FashionGenderConfig {
  key:     FashionGender;
  label:   string;
  icon:    string;   // Ionicons glyph for tab button
  subCats: FashionSubCat[];
}

export const FASHION_GENDERS: FashionGenderConfig[] = [
  // ── MEN ────────────────────────────────────────────────────
  {
    key:   "men",
    label: "Men",
    icon:  "man-outline",
    subCats: [
      { key: "topwear",     label: "Topwear",      icon: "shirt-outline",            bg: "#DBEAFE" },
      { key: "innerwear",   label: "Inner-wear",   icon: "body-outline",             bg: "#FEE2E2" },
      { key: "bottomwear",  label: "Bottom-wear",  icon: "reorder-three-outline",    bg: "#DCFCE7" },
      { key: "footwear",    label: "Footwear",     icon: "walk-outline",             bg: "#FEF3C7" },
      { key: "caps",        label: "Caps",         icon: "happy-outline",            bg: "#EDE9FE" },
      { key: "ties",        label: "Ties",         icon: "ribbon-outline",           bg: "#FCE7F3" },
      { key: "watches",     label: "Watches",      icon: "time-outline",             bg: "#FFEDD5" },
      { key: "socks",       label: "Socks",        icon: "footsteps-outline",        bg: "#ECFDF5" },
      { key: "wallets",     label: "Wallets",      icon: "wallet-outline",           bg: "#F3F4F6" },
      { key: "traditional", label: "Traditional",  icon: "flag-outline",             bg: "#FEF3C7" },
      { key: "winterwear",  label: "Winter-wear",  icon: "snow-outline",             bg: "#DBEAFE" },
      { key: "raincoats",   label: "Raincoats",    icon: "umbrella-outline",         bg: "#E0F2FE" },
      { key: "eyewear",     label: "Eye-wear",     icon: "glasses-outline",          bg: "#FCE7F3" },
      { key: "shaving",     label: "Shaving",      icon: "cut-outline",              bg: "#DCFCE7" },
      { key: "fragrances",  label: "Fragrances",   icon: "flower-outline",           bg: "#F3E8FF" },
      { key: "belts",       label: "Belts",        icon: "reorder-two-outline",      bg: "#FFEDD5" },
      { key: "blazers",     label: "Blazer",       icon: "business-outline",         bg: "#DBEAFE" },
      { key: "kurti",       label: "Kurti",        icon: "shirt-outline",            bg: "#FCE7F3" },
      { key: "sportswear",  label: "Sportswear",   icon: "football-outline",         bg: "#DCFCE7" },
      { key: "mencare",     label: "Men's Care",   icon: "medkit-outline",           bg: "#FEE2E2" },
    ],
  },

  // ── WOMEN ──────────────────────────────────────────────────
  {
    key:   "women",
    label: "Women",
    icon:  "woman-outline",
    subCats: [
      { key: "topwear",     label: "Topwear",      icon: "shirt-outline",            bg: "#FCE7F3" },
      { key: "innerwear",   label: "Inner-wear",   icon: "body-outline",             bg: "#FEE2E2" },
      { key: "bottomwear",  label: "Bottom-wear",  icon: "reorder-three-outline",    bg: "#DCFCE7" },
      { key: "footwear",    label: "Footwear",     icon: "walk-outline",             bg: "#FEF3C7" },
      { key: "sarees",      label: "Sarees",       icon: "sparkles-outline",         bg: "#FCE7F3" },
      { key: "suits",       label: "Suits",        icon: "ribbon-outline",           bg: "#EDE9FE" },
      { key: "watches",     label: "Watches",      icon: "time-outline",             bg: "#FFEDD5" },
      { key: "handbags",    label: "Handbags",     icon: "bag-outline",              bg: "#ECFDF5" },
      { key: "wallets",     label: "Wallets",      icon: "wallet-outline",           bg: "#F3F4F6" },
      { key: "traditional", label: "Traditional",  icon: "flag-outline",             bg: "#FEF3C7" },
      { key: "winterwear",  label: "Winter-wear",  icon: "snow-outline",             bg: "#DBEAFE" },
      { key: "raincoats",   label: "Raincoats",    icon: "umbrella-outline",         bg: "#E0F2FE" },
      { key: "eyewear",     label: "Eye-wear",     icon: "glasses-outline",          bg: "#FCE7F3" },
      { key: "makeup",      label: "Makeup",       icon: "color-palette-outline",    bg: "#FCE7F3" },
      { key: "fragrances",  label: "Fragrances",   icon: "flower-outline",           bg: "#F3E8FF" },
      { key: "jewellery",   label: "Jewellery",    icon: "diamond-outline",          bg: "#FEF3C7" },
      { key: "kurties",     label: "Kurties",      icon: "shirt-outline",            bg: "#FCE7F3" },
      { key: "lehenga",     label: "Lehenga",      icon: "sparkles-outline",         bg: "#EDE9FE" },
      { key: "sportswear",  label: "Sportswear",   icon: "football-outline",         bg: "#DCFCE7" },
      { key: "womencare",   label: "Women's Care", icon: "heart-outline",            bg: "#FEE2E2" },
    ],
  },

  // ── BOY ────────────────────────────────────────────────────
  {
    key:   "boy",
    label: "Boy",
    icon:  "person-outline",
    subCats: [
      { key: "topwear",     label: "Topwear",      icon: "shirt-outline",            bg: "#DBEAFE" },
      { key: "innerwear",   label: "Inner-wear",   icon: "body-outline",             bg: "#FEE2E2" },
      { key: "bottomwear",  label: "Bottom-wear",  icon: "reorder-three-outline",    bg: "#DCFCE7" },
      { key: "footwear",    label: "Footwear",     icon: "walk-outline",             bg: "#FEF3C7" },
      { key: "caps",        label: "Caps",         icon: "happy-outline",            bg: "#EDE9FE" },
      { key: "schoolwear",  label: "School Wear",  icon: "school-outline",           bg: "#DBEAFE" },
      { key: "watches",     label: "Watches",      icon: "time-outline",             bg: "#FFEDD5" },
      { key: "socks",       label: "Socks",        icon: "footsteps-outline",        bg: "#ECFDF5" },
      { key: "jackets",     label: "Jackets",      icon: "layers-outline",           bg: "#F3F4F6" },
      { key: "sportswear",  label: "Sportswear",   icon: "football-outline",         bg: "#DCFCE7" },
      { key: "winterwear",  label: "Winter-wear",  icon: "snow-outline",             bg: "#DBEAFE" },
      { key: "raincoats",   label: "Raincoats",    icon: "umbrella-outline",         bg: "#E0F2FE" },
      { key: "eyewear",     label: "Eye-wear",     icon: "glasses-outline",          bg: "#FCE7F3" },
      { key: "casual",      label: "Casual Wear",  icon: "happy-outline",            bg: "#FEF3C7" },
      { key: "accessories", label: "Accessories",  icon: "pricetag-outline",         bg: "#FFEDD5" },
      { key: "boycare",     label: "Boy's Care",   icon: "medkit-outline",           bg: "#FEE2E2" },
    ],
  },

  // ── GIRL ───────────────────────────────────────────────────
  {
    key:   "girl",
    label: "Girl",
    icon:  "person-outline",
    subCats: [
      { key: "topwear",     label: "Topwear",      icon: "shirt-outline",            bg: "#FCE7F3" },
      { key: "innerwear",   label: "Inner-wear",   icon: "body-outline",             bg: "#FEE2E2" },
      { key: "bottomwear",  label: "Bottom-wear",  icon: "reorder-three-outline",    bg: "#DCFCE7" },
      { key: "footwear",    label: "Footwear",     icon: "walk-outline",             bg: "#FEF3C7" },
      { key: "frocks",      label: "Frocks",       icon: "sparkles-outline",         bg: "#FCE7F3" },
      { key: "schoolwear",  label: "School Wear",  icon: "school-outline",           bg: "#DBEAFE" },
      { key: "watches",     label: "Watches",      icon: "time-outline",             bg: "#FFEDD5" },
      { key: "accessories", label: "Accessories",  icon: "diamond-outline",          bg: "#EDE9FE" },
      { key: "jackets",     label: "Jackets",      icon: "layers-outline",           bg: "#F3F4F6" },
      { key: "sportswear",  label: "Sportswear",   icon: "football-outline",         bg: "#DCFCE7" },
      { key: "winterwear",  label: "Winter-wear",  icon: "snow-outline",             bg: "#DBEAFE" },
      { key: "raincoats",   label: "Raincoats",    icon: "umbrella-outline",         bg: "#E0F2FE" },
      { key: "eyewear",     label: "Eye-wear",     icon: "glasses-outline",          bg: "#FCE7F3" },
      { key: "haircare",    label: "Hair Care",    icon: "cut-outline",              bg: "#EDE9FE" },
      { key: "fragrances",  label: "Fragrances",   icon: "flower-outline",           bg: "#F3E8FF" },
      { key: "girlcare",    label: "Girl's Care",  icon: "heart-outline",            bg: "#FEE2E2" },
    ],
  },
];
