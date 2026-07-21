// ============================================================
// ASC STORE IMAGES — maps a §16 ASC store type to its tile photo.
//
// The store artwork predates ASC (it was keyed to the old hand-written
// STORE_TYPES list), so this is the bridge: an ASC code gets a photo only
// where the existing asset genuinely depicts that kind of shop. Anything
// unmapped falls back to the class emoji rather than borrowing a misleading
// picture — a garment FACTORY must not show a clothing-shop front, and a
// wholesale distributor is not a retail counter, so those stay on emoji.
//
// Add a code here the moment real art for it lands.
// ============================================================

export const ASC_STORE_IMAGES: Record<string, number> = {
  // ── Inventory-based retail ──────────────────────────────────
  "ASC-INV-KIR": require("../assets/images/category/stores/grocery_store.webp"),
  "ASC-INV-MIX": require("../assets/images/category/stores/convenience_store.webp"),
  "ASC-INV-FAS": require("../assets/images/category/stores/fashion_store.webp"),
  "ASC-INV-JWL": require("../assets/images/category/stores/jewellery_store.webp"),
  "ASC-INV-ICE": require("../assets/images/category/stores/icecream_store.webp"),
  "ASC-INV-PHA": require("../assets/images/category/stores/pharmacy_store.webp"),
  "ASC-INV-FIT": require("../assets/images/category/stores/fitness_store.webp"),
  "ASC-INV-BTY": require("../assets/images/category/stores/beauty_store.webp"),
  "ASC-INV-MOB": require("../assets/images/category/stores/mobile_store.webp"),
  "ASC-INV-CPU": require("../assets/images/category/stores/computer_store.webp"),
  "ASC-INV-APL": require("../assets/images/category/stores/home_elec_store.webp"),
  "ASC-INV-HRD": require("../assets/images/category/stores/hardware_store.webp"),
  "ASC-INV-FUR": require("../assets/images/category/stores/furniture_store.webp"),
  "ASC-INV-SPT": require("../assets/images/category/stores/sports_toys.webp"),
  "ASC-INV-BKS": require("../assets/images/category/stores/books_store.webp"),
  "ASC-INV-EYE": require("../assets/images/category/stores/eyewear.webp"),
  "ASC-INV-OPL": require("../assets/images/category/stores/eyewear.webp"),
  "ASC-INV-WCH": require("../assets/images/category/stores/watches.webp"),
  "ASC-INV-VEH": require("../assets/images/category/stores/vehicle.webp"),
  "ASC-INV-BAK": require("../assets/images/category/stores/bakery_sweets.webp"),
  "ASC-INV-DAI": require("../assets/images/category/stores/dairy_booth.webp"),
  "ASC-INV-FLW": require("../assets/images/category/stores/flower_shop.webp"),
  "ASC-INV-DEC": require("../assets/images/category/stores/home_decor.webp"),
  "ASC-INV-BBY": require("../assets/images/category/stores/baby_kids.webp"),
  "ASC-INV-ORG": require("../assets/images/category/stores/organic_food.webp"),
  "ASC-INV-PAN": require("../assets/images/category/stores/paan_shop.webp"),
  "ASC-INV-FOO": require("../assets/images/category/stores/footwear_store.webp"),
  "ASC-INV-GFT": require("../assets/images/category/stores/gift_shop.webp"),
  "ASC-INV-POO": require("../assets/images/category/stores/pooja_items.webp"),
  "ASC-INV-MUS": require("../assets/images/category/stores/music_store.webp"),
  "ASC-INV-LIQ": require("../assets/images/category/stores/liquor_store.webp"),
  "ASC-INV-ELC": require("../assets/images/category/stores/electrical_store.webp"),
  "ASC-INV-PNT": require("../assets/images/category/stores/paint_store.webp"),
  "ASC-INV-AGR": require("../assets/images/category/stores/agri_store.webp"),
  "ASC-INV-OTH": require("../assets/images/category/stores/others_stall.webp"),

  // ── Service-based ───────────────────────────────────────────
  "ASC-SVC-01": require("../assets/images/category/stores/personal_care_store.webp"),
  "ASC-SVC-02": require("../assets/images/category/stores/repair_service_store.webp"),
  "ASC-SVC-03": require("../assets/images/category/stores/tailoring.webp"),
  "ASC-SVC-04": require("../assets/images/category/stores/laundry.webp"),
  "ASC-SVC-05": require("../assets/images/category/stores/diagnostic_lab.webp"),
  "ASC-SVC-06": require("../assets/images/category/stores/printing_xerox.webp"),
  "ASC-SVC-07": require("../assets/images/category/stores/travel_agency.webp"),
  "ASC-SVC-08": require("../assets/images/category/stores/catering.webp"),
  "ASC-SVC-09": require("../assets/images/category/stores/photography.webp"),
  "ASC-SVC-15": require("../assets/images/category/stores/vehicle.webp"),
  "ASC-SVC-25": require("../assets/images/category/stores/paint_store.webp"),

  // ── Menu-based ──────────────────────────────────────────────
  "ASC-MNU-01": require("../assets/images/category/stores/food_bev_store.webp"),
  "ASC-MNU-02": require("../assets/images/category/stores/icecream_store.webp"),
  "ASC-MNU-03": require("../assets/images/category/stores/bakery_sweets.webp"),
  "ASC-MNU-06": require("../assets/images/category/stores/paan_shop.webp"),
  "ASC-MNU-07": require("../assets/images/category/stores/others_stall.webp"),
  "ASC-MNU-08": require("../assets/images/category/stores/others_stall.webp"),
  "ASC-MNU-11": require("../assets/images/category/stores/catering.webp"),
};

export function ascStoreImage(code: string): number | null {
  return ASC_STORE_IMAGES[code] ?? null;
}
