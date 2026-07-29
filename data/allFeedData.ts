// ============================================================
// ALL FEED DATA — Apana Store (Customer App)
//
// Seasonal CATEGORY tiles for the home "All" feed (SeasonalCategorySection).
// These are category-discovery tiles, not products — tapping one browses a
// category, it does not add a phantom item.
//
// The old mock PRODUCT / STORE pools (DAILY_ESSENTIALS, FLASH_DEALS,
// NEW_ARRIVALS, POPULAR_STORES, CITY_TRENDING) and their unused rail components
// were deleted — the "All" feed shows REAL inventory via CategoryLiveProducts,
// and real shops live in the Stores discovery mode (§19.8, no phantom data).
// ============================================================

// ── Seasonal sub-category tile ────────────────────────────────
export interface SeasonalCat {
  key:   string;
  label: string;
  icon:  string;
  bg:    string;
  imageUrl?: any;
}

const SUMMER_CATEGORIES: SeasonalCat[] = [
  { key:"sunscreens",  label:"Sunscreens",         icon:"sunny-outline",         bg:"#FEF3C7", imageUrl: require("../assets/images/home/seasons/sunscreens.png") },
  { key:"skincare",    label:"Skincare",            icon:"sparkles-outline",      bg:"#FCE7F3", imageUrl: require("../assets/images/home/seasons/skincare.png") },
  { key:"beverages",   label:"Refreshing Cools",    icon:"wine-outline",          bg:"#DBEAFE", imageUrl: require("../assets/images/home/seasons/beverages.png") },
  { key:"milkshakes",  label:"Milkshakes",          icon:"cafe-outline",          bg:"#FEF3C7", imageUrl: require("../assets/images/home/seasons/milkshakes.png") },
  { key:"aircooler",   label:"Air Coolers",         icon:"snow-outline",          bg:"#E0F2FE", imageUrl: require("../assets/images/home/seasons/aircooler.png") },
  { key:"energy",      label:"Energy Drinks",       icon:"flash-outline",         bg:"#FEE2E2", imageUrl: require("../assets/images/home/seasons/energy.png") },
  { key:"fruits",      label:"Summer Fruits",       icon:"nutrition-outline",     bg:"#DCFCE7", imageUrl: require("../assets/images/home/seasons/fruits.png") },
  { key:"icecream",    label:"Frozen Desserts",     icon:"ice-cream-outline",     bg:"#FCE7F3", imageUrl: require("../assets/images/home/seasons/icecream.png") },
  { key:"hydration",   label:"Body Hydration",      icon:"fitness-outline",       bg:"#ECFDF5", imageUrl: require("../assets/images/home/seasons/hydration.png") },
  { key:"pool",        label:"Pool & Beach",        icon:"water-outline",         bg:"#DBEAFE", imageUrl: require("../assets/images/home/seasons/pool.png") },
  { key:"lightcloth",  label:"Light Clothing",      icon:"shirt-outline",         bg:"#EDE9FE", imageUrl: require("../assets/images/home/seasons/lightcloth.png") },
  { key:"footwear",    label:"Summer Footwear",     icon:"walk-outline",          bg:"#FFEDD5", imageUrl: require("../assets/images/home/seasons/footwear.png") },
];

const MONSOON_CATEGORIES: SeasonalCat[] = [
  { key:"umbrellas",   label:"Umbrellas",           icon:"umbrella-outline",      bg:"#DBEAFE", imageUrl: require("../assets/images/home/seasons/umbrellas.png") },
  { key:"raincoats",   label:"Raincoats",           icon:"rainy-outline",         bg:"#E0F2FE", imageUrl: require("../assets/images/home/seasons/raincoats.png") },
  { key:"gumboots",    label:"Gumboots",            icon:"footsteps-outline",     bg:"#FEF3C7", imageUrl: require("../assets/images/home/seasons/gumboots.png") },
  { key:"hotdrinks",   label:"Hot Beverages",       icon:"cafe-outline",          bg:"#FFEDD5", imageUrl: require("../assets/images/home/seasons/hotdrinks.png") },
  { key:"snacks",      label:"Pakora & Snacks",     icon:"fast-food-outline",     bg:"#FEE2E2", imageUrl: require("../assets/images/home/seasons/snacks.png") },
  { key:"immunity",    label:"Immunity Boost",      icon:"shield-outline",        bg:"#DCFCE7", imageUrl: require("../assets/images/home/seasons/immunity.png") },
  { key:"mosquito",    label:"Mosquito Care",       icon:"bug-outline",           bg:"#ECFDF5", imageUrl: require("../assets/images/home/seasons/mosquito.png") },
  { key:"quickdry",    label:"Quick-Dry Wear",      icon:"shirt-outline",         bg:"#EDE9FE", imageUrl: require("../assets/images/home/seasons/quickdry.png") },
  { key:"indoorgames", label:"Indoor Games",        icon:"game-controller-outline", bg:"#FCE7F3", imageUrl: require("../assets/images/home/seasons/indoorgames.png") },
  { key:"dehumid",     label:"Moisture Control",    icon:"water-outline",         bg:"#DBEAFE", imageUrl: require("../assets/images/home/seasons/dehumid.png") },
  { key:"instnoodles", label:"Instant Noodles",     icon:"restaurant-outline",    bg:"#FEF3C7", imageUrl: require("../assets/images/home/seasons/instnoodles.png") },
  { key:"sanitizer",   label:"Hand Sanitizers",     icon:"hand-left-outline",     bg:"#ECFDF5", imageUrl: require("../assets/images/home/seasons/sanitizer.png") },
];

const WINTER_CATEGORIES: SeasonalCat[] = [
  { key:"moisturizer", label:"Moisturizers",        icon:"sparkles-outline",      bg:"#FCE7F3", imageUrl: require("../assets/images/home/seasons/moisturizer.png") },
  { key:"lipcare",     label:"Lip Care",            icon:"heart-outline",         bg:"#FEE2E2", imageUrl: require("../assets/images/home/seasons/lipcare.png") },
  { key:"woolens",     label:"Woolens",             icon:"shirt-outline",         bg:"#EDE9FE", imageUrl: require("../assets/images/home/seasons/woolens.png") },
  { key:"heaters",     label:"Room Heaters",        icon:"flame-outline",         bg:"#FFEDD5", imageUrl: require("../assets/images/home/seasons/heaters.png") },
  { key:"hotdrinks",   label:"Hot Drinks",          icon:"cafe-outline",          bg:"#FEF3C7", imageUrl: require("../assets/images/home/seasons/hotdrinks_winter.png") },
  { key:"dryfruits",   label:"Dry Fruits",          icon:"nutrition-outline",     bg:"#FDE8D8", imageUrl: require("../assets/images/home/seasons/dryfruits_winter.png") },
  { key:"blankets",    label:"Blankets & Quilts",   icon:"bed-outline",           bg:"#DBEAFE", imageUrl: require("../assets/images/home/seasons/blankets.png") },
  { key:"wintershoes", label:"Winter Footwear",     icon:"walk-outline",          bg:"#E0F2FE", imageUrl: require("../assets/images/home/seasons/wintershoes.png") },
  { key:"coldcough",   label:"Cold & Cough",        icon:"medkit-outline",        bg:"#DCFCE7", imageUrl: require("../assets/images/home/seasons/coldcough.png") },
  { key:"geysers",     label:"Geysers",             icon:"thermometer-outline",   bg:"#ECFDF5", imageUrl: require("../assets/images/home/seasons/geysers.png") },
  { key:"mask",        label:"Masks",               icon:"medical-outline",       bg:"#E0F2FE", imageUrl: require("../assets/images/home/seasons/mask.png") },
  { key:"soups",       label:"Soups & Broths",      icon:"wine-outline",          bg:"#FFEDD5", imageUrl: require("../assets/images/home/seasons/soups.png") },
];

const FESTIVE_CATEGORIES: SeasonalCat[] = [
  { key:"mithai",      label:"Sweets & Mithai",     icon:"gift-outline",          bg:"#FEF3C7", imageUrl: require("../assets/images/home/seasons/mithai.png") },
  { key:"dryfruits",   label:"Dry Fruit Boxes",     icon:"nutrition-outline",     bg:"#FDE8D8", imageUrl: require("../assets/images/home/seasons/dryfruits_festive.png") },
  { key:"diyas",       label:"Diyas & Candles",     icon:"flame-outline",         bg:"#FFEDD5", imageUrl: require("../assets/images/home/seasons/diyas.png") },
  { key:"hampers",     label:"Gift Hampers",        icon:"cube-outline",          bg:"#FCE7F3", imageUrl: require("../assets/images/home/seasons/hampers.png") },
  { key:"decor",       label:"Decor & Rangoli",     icon:"color-palette-outline", bg:"#EDE9FE", imageUrl: require("../assets/images/home/seasons/decor.png") },
  { key:"pooja",       label:"Pooja Needs",         icon:"flower-outline",        bg:"#DCFCE7", imageUrl: require("../assets/images/home/seasons/pooja.png") },
  { key:"ethnic",      label:"Ethnic Wear",         icon:"shirt-outline",         bg:"#FEE2E2", imageUrl: require("../assets/images/home/seasons/ethnic.png") },
  { key:"lights",      label:"Festive Lights",      icon:"bulb-outline",          bg:"#DBEAFE", imageUrl: require("../assets/images/home/seasons/lights.png") },
  { key:"cleaning",    label:"Home Cleaning",       icon:"sparkles-outline",      bg:"#E0F2FE", imageUrl: require("../assets/images/home/seasons/cleaning.png") },
  { key:"idols",       label:"Idols & Murti",       icon:"happy-outline",         bg:"#ECFDF5", imageUrl: require("../assets/images/home/seasons/idols.png") },
  { key:"firecrackers",label:"Firecrackers",        icon:"rocket-outline",        bg:"#FEE2E2", imageUrl: require("../assets/images/home/seasons/firecrackers.png") },
  { key:"namkeen",     label:"Namkeen Mixture",     icon:"fast-food-outline",     bg:"#FFEDD5", imageUrl: require("../assets/images/home/seasons/namkeen.png") },
];

// ── Seasons carousel ──────────────────────────────────────────
// One entry per Indian season; the seasonal section steps through these with
// prev/next arrows. Order matches the Indian calendar.
export interface Season {
  key:        string;
  name:       string;       // shown as "{name} Picks"
  icon:       string;       // Ionicons glyph for the header
  accent:     string;       // section accent colour
  categories: SeasonalCat[];
}

export const SEASONS: Season[] = [
  { key:"summer",  name:"Summer",  icon:"sunny-outline", accent:"#E05A00", categories:SUMMER_CATEGORIES },
  { key:"monsoon", name:"Monsoon", icon:"rainy-outline", accent:"#2563EB", categories:MONSOON_CATEGORIES },
  { key:"winter",  name:"Winter",  icon:"snow-outline",  accent:"#0891B2", categories:WINTER_CATEGORIES },
  { key:"festive", name:"Festive", icon:"gift-outline",  accent:"#DB2777", categories:FESTIVE_CATEGORIES },
];
