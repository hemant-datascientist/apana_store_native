// ============================================================
// CATEGORY → APC MAP — Apana Store (Customer App)
//
// The Home/Category tiles (data/categoryData.ts) are a curated MERCHANDISING
// layout — "Tea, Coffee & Biscuits", "Masala & Sauces" — that deliberately does
// not mirror the §27 APC class tree 1:1. This map is the bridge: it points each
// product tile at the APC CLASS it belongs to, so tapping a merchandising tile
// lands in the real classification browser instead of a dead end.
//
// Keyed by the tile's `key` (data/categoryData.ts). Codes are CLASS-level on
// purpose: a class code (APC-DAI, APC-BTY) always exists, so this never routes
// to a 404, and it does not rot when family slugs change. A tile with no entry
// falls back to search (which now shows the APC category strip), so nothing is
// a dead end even when unmapped.
//
// STORE-type tiles (the "Miscellaneous" group — grocery_store, fashion_store…)
// are intentionally absent: they classify STORES (ASC), not products, and route
// through store discovery, not APC.
//
// A few tiles span two classes (Vegetables & Fruits = VEG + FRT); the dominant
// class is chosen. Ice-cream tiles point at DAI, which owns the frozen-dairy
// family.

export const CATEGORY_APC: Record<string, string> = {
  // ── Grocery ──────────────────────────────────────────────
  veg_fruits: "APC-VEG",
  dairy: "APC-DAI",
  eggs_meat: "APC-NVG",
  tea_coffee: "APC-TEA",
  masala: "APC-SPC",
  dry_fruits: "APC-DRYF",
  ration: "APC-STPL",
  cook_oil: "APC-OIL",
  baking: "APC-BKY",
  chocolates: "APC-PKGF",
  noodles: "APC-PKGF",
  honey_spreads: "APC-PKGF",
  baby_food: "APC-BABY",
  frozen_veg: "APC-VEG",
  packaged_food: "APC-PKGF",

  // ── Snacks & Beverages ───────────────────────────────────
  chips: "APC-NMK",
  dry_snacks: "APC-NMK",
  soft_drinks: "APC-BEV",
  energy_drinks: "APC-BEV",
  goti_soda: "APC-BEV",
  packaged_water: "APC-BEV",
  juice: "APC-BEV",
  sweets: "APC-MITH",
  instant: "APC-PKGF",
  protein_bars: "APC-PKGF",
  popcorn: "APC-NMK",

  // ── Ice Cream & Frozen Desserts (DAI owns frozen-dairy) ──
  icecream_cups: "APC-DAI",
  bars: "APC-DAI",
  kulfi: "APC-DAI",
  frozen_dessert: "APC-DAI",
  yogurt: "APC-DAI",
  frozen_snacks: "APC-PKGF",

  // ── Fashion ──────────────────────────────────────────────
  mens: "APC-FASH",
  womens: "APC-FASH",
  kids_wear: "APC-FASH",
  ethnic: "APC-FASH",
  sportswear: "APC-FASH",
  winter_wear: "APC-FASH",
  innerwear: "APC-FASH",
  footwear: "APC-FASH",
  bags_luggage: "APC-FASH",
  fashion_jwl: "APC-FASH",
  accessories: "APC-FASH",

  // ── Mobiles & Tablets ────────────────────────────────────
  smartphones: "APC-A7",
  feature_phones: "APC-A7",
  tablets: "APC-A7",
  covers: "APC-A7",
  chargers: "APC-A7",
  earphones: "APC-A7",
  power_banks: "APC-A7",
  memory_cards: "APC-A7",
  screenguard: "APC-A7",

  // ── Electronics ──────────────────────────────────────────
  headphones: "APC-A8",
  speakers: "APC-A8",
  cameras: "APC-A8",
  laptops: "APC-A8",
  smartwatch: "APC-A8",
  smart_home: "APC-A8",
  gaming: "APC-A8",
  printers: "APC-A8",
  storage_drives: "APC-A8",
  projectors: "APC-A8",

  // ── Home Appliances ──────────────────────────────────────
  tv: "APC-A9",
  washing: "APC-A9",
  fridge: "APC-A9",
  ac: "APC-A9",
  kitchen_app: "APC-A9",
  water_purifier: "APC-A9",
  fans: "APC-A9",
  geyser: "APC-A9",
  vacuum: "APC-A9",
  iron: "APC-A9",

  // ── Beauty & Personal Care (splits BTY vs PCARE at class) ─
  skincare: "APC-BTY",
  haircare: "APC-PCARE",
  makeup: "APC-BTY",
  fragrance: "APC-BTY",
  mens_groom: "APC-PCARE",
  bodycare: "APC-PCARE",
  oral_care: "APC-PCARE",
  nail_care: "APC-BTY",
  feminine: "APC-PCARE",
  sun_care: "APC-BTY",

  // ── Pharmacy & Health (MED = drugs, WELL = wellness) ─────
  medicines: "APC-MED",
  vitamins: "APC-WELL",
  ayurvedic: "APC-WELL",
  homeopathy: "APC-WELL",
  first_aid: "APC-WELL",
  health_monitor: "APC-WELL",
  diabetic: "APC-WELL",
  ortho: "APC-WELL",
  baby_health: "APC-BABY",
  eye_care: "APC-WELL",

  // ── Sports & Fitness ─────────────────────────────────────
  fitness_eq: "APC-SPRT",
  cricket: "APC-SPRT",
  football: "APC-SPRT",
  badminton: "APC-SPRT",
  cycling: "APC-SPRT",
  yoga: "APC-SPRT",
  swimming: "APC-SPRT",
  running: "APC-SPRT",

  // ── Paan Corner ──────────────────────────────────────────
  paan: "APC-MUKH",
  supari: "APC-MUKH",
  mukhwas: "APC-MUKH",
  flavoured: "APC-MUKH",
  cigarettes: "APC-SIN",
  hookah: "APC-SIN",

  // ── Gifts & Festive ──────────────────────────────────────
  hampers: "APC-POOJ",
  cards: "APC-POOJ",
  decor: "APC-POOJ",
  festival_kits: "APC-POOJ",
  custom_gifts: "APC-POOJ",
  party: "APC-POOJ",

  // ── Office & Stationery ──────────────────────────────────
  office_sup: "APC-BOOK",
  paper: "APC-BOOK",
  filing: "APC-BOOK",
  art_supplies: "APC-ART",

  // ── Home-feed grocery quick-grid (data/groceryData.ts) ───
  // Its own key set (distinct from the tiles above). dairy / masala / chocolates
  // are intentionally omitted — already mapped above to the same class.
  vegetables: "APC-VEG",
  fruits: "APC-FRT",
  dryfruits: "APC-DRYF",
  pulses: "APC-STPL",
  snacks: "APC-NMK",
  oil: "APC-OIL",
  kitchen: "APC-KTCH",
  drinks: "APC-BEV",
  dairyprod: "APC-DAI",
};

/** APC class code for a tile, or null if it has no product mapping. */
export function apcForTile(subKey: string): string | null {
  return CATEGORY_APC[subKey] ?? null;
}
