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
  veg_fruits: "APC-01-VEG",
  dairy: "APC-01-DAI",
  eggs_meat: "APC-01-NVG",
  tea_coffee: "APC-01-TEA",
  masala: "APC-01-SPC",
  dry_fruits: "APC-01-DRYF",
  ration: "APC-01-STPL",
  cook_oil: "APC-01-OIL",
  baking: "APC-01-BKY",
  chocolates: "APC-01-PKGF",
  noodles: "APC-01-PKGF",
  honey_spreads: "APC-01-PKGF",
  baby_food: "APC-09-BABY",
  frozen_veg: "APC-01-VEG",
  packaged_food: "APC-01-PKGF",

  // ── Snacks & Beverages ───────────────────────────────────
  chips: "APC-01-NMK",
  dry_snacks: "APC-01-NMK",
  soft_drinks: "APC-02-BEV",
  energy_drinks: "APC-02-BEV",
  goti_soda: "APC-02-BEV",
  packaged_water: "APC-02-BEV",
  juice: "APC-02-BEV",
  sweets: "APC-01-MITH",
  instant: "APC-01-PKGF",
  protein_bars: "APC-01-PKGF",
  popcorn: "APC-01-NMK",

  // ── Ice Cream & Frozen Desserts (DAI owns frozen-dairy) ──
  icecream_cups: "APC-01-DAI",
  bars: "APC-01-DAI",
  kulfi: "APC-01-DAI",
  frozen_dessert: "APC-01-DAI",
  yogurt: "APC-01-DAI",
  frozen_snacks: "APC-01-PKGF",

  // ── Fashion ──────────────────────────────────────────────
  mens: "APC-10-FASH",
  womens: "APC-10-FASH",
  kids_wear: "APC-10-FASH",
  ethnic: "APC-10-FASH",
  sportswear: "APC-10-FASH",
  winter_wear: "APC-10-FASH",
  innerwear: "APC-10-FASH",
  footwear: "APC-10-FASH",
  bags_luggage: "APC-10-FASH",
  fashion_jwl: "APC-10-FASH",
  accessories: "APC-10-FASH",

  // ── Mobiles & Tablets ────────────────────────────────────
  smartphones: "APC-12-A7",
  feature_phones: "APC-12-A7",
  tablets: "APC-12-A7",
  covers: "APC-12-A7",
  chargers: "APC-12-A7",
  earphones: "APC-12-A7",
  power_banks: "APC-12-A7",
  memory_cards: "APC-12-A7",
  screenguard: "APC-12-A7",

  // ── Electronics ──────────────────────────────────────────
  headphones: "APC-13-A8",
  speakers: "APC-13-A8",
  cameras: "APC-13-A8",
  laptops: "APC-13-A8",
  smartwatch: "APC-13-A8",
  smart_home: "APC-13-A8",
  gaming: "APC-13-A8",
  printers: "APC-13-A8",
  storage_drives: "APC-13-A8",
  projectors: "APC-13-A8",

  // ── Home Appliances ──────────────────────────────────────
  tv: "APC-14-A9",
  washing: "APC-14-A9",
  fridge: "APC-14-A9",
  ac: "APC-14-A9",
  kitchen_app: "APC-14-A9",
  water_purifier: "APC-14-A9",
  fans: "APC-14-A9",
  geyser: "APC-14-A9",
  vacuum: "APC-14-A9",
  iron: "APC-14-A9",

  // ── Beauty & Personal Care (splits BTY vs PCARE at class) ─
  skincare: "APC-05-BTY",
  haircare: "APC-04-PCARE",
  makeup: "APC-05-BTY",
  fragrance: "APC-05-BTY",
  mens_groom: "APC-04-PCARE",
  bodycare: "APC-04-PCARE",
  oral_care: "APC-04-PCARE",
  nail_care: "APC-05-BTY",
  feminine: "APC-04-PCARE",
  sun_care: "APC-05-BTY",

  // ── Pharmacy & Health (MED = drugs, WELL = wellness) ─────
  medicines: "APC-06-MED",
  vitamins: "APC-07-WELL",
  ayurvedic: "APC-07-WELL",
  homeopathy: "APC-07-WELL",
  first_aid: "APC-07-WELL",
  health_monitor: "APC-07-WELL",
  diabetic: "APC-07-WELL",
  ortho: "APC-07-WELL",
  baby_health: "APC-09-BABY",
  eye_care: "APC-07-WELL",

  // ── Sports & Fitness ─────────────────────────────────────
  fitness_eq: "APC-25-SPRT",
  cricket: "APC-25-SPRT",
  football: "APC-25-SPRT",
  badminton: "APC-25-SPRT",
  cycling: "APC-25-SPRT",
  yoga: "APC-25-SPRT",
  swimming: "APC-25-SPRT",
  running: "APC-25-SPRT",

  // ── Paan Corner ──────────────────────────────────────────
  paan: "APC-03-MUKH",
  supari: "APC-03-MUKH",
  mukhwas: "APC-03-MUKH",
  flavoured: "APC-03-MUKH",
  cigarettes: "APC-33-SIN",
  hookah: "APC-33-SIN",

  // ── Gifts & Festive ──────────────────────────────────────
  hampers: "APC-28-POOJ",
  cards: "APC-28-POOJ",
  decor: "APC-28-POOJ",
  festival_kits: "APC-28-POOJ",
  custom_gifts: "APC-28-POOJ",
  party: "APC-28-POOJ",

  // ── Office & Stationery ──────────────────────────────────
  office_sup: "APC-21-BOOK",
  paper: "APC-21-BOOK",
  filing: "APC-21-BOOK",
  art_supplies: "APC-22-ART",

  // ── Home-feed grocery quick-grid (data/groceryData.ts) ───
  // Its own key set (distinct from the tiles above). dairy / masala / chocolates
  // are intentionally omitted — already mapped above to the same class.
  vegetables: "APC-01-VEG",
  fruits: "APC-01-FRT",
  dryfruits: "APC-01-DRYF",
  pulses: "APC-01-STPL",
  snacks: "APC-01-NMK",
  oil: "APC-01-OIL",
  kitchen: "APC-17-KTCH",
  drinks: "APC-02-BEV",
  dairyprod: "APC-01-DAI",
};

/** APC class code for a tile, or null if it has no product mapping. */
export function apcForTile(subKey: string): string | null {
  return CATEGORY_APC[subKey] ?? null;
}
