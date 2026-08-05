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

import { assetImg, type AssetImage } from "../lib/assetImg";

export const ASC_STORE_IMAGES: Record<string, AssetImage> = {
  // ── Inventory-based retail ──────────────────────────────────
  "ASC-INV-KIR": assetImg("category/stores/grocery_store.webp"),
  "ASC-INV-MIX": assetImg("category/stores/convenience_store.webp"),
  "ASC-INV-FAS": assetImg("category/stores/fashion_store.webp"),
  "ASC-INV-JWL": assetImg("category/stores/jewellery_store.webp"),
  "ASC-INV-ICE": assetImg("category/stores/icecream_store.webp"),
  "ASC-INV-PHA": assetImg("category/stores/pharmacy_store.webp"),
  "ASC-INV-FIT": assetImg("category/stores/fitness_store.webp"),
  "ASC-INV-BTY": assetImg("category/stores/beauty_store.webp"),
  "ASC-INV-MOB": assetImg("category/stores/mobile_store.webp"),
  "ASC-INV-CPU": assetImg("category/stores/computer_store.webp"),
  "ASC-INV-APL": assetImg("category/stores/home_elec_store.webp"),
  "ASC-INV-HRD": assetImg("category/stores/hardware_store.webp"),
  "ASC-INV-FUR": assetImg("category/stores/furniture_store.webp"),
  "ASC-INV-SPT": assetImg("category/stores/sports_toys.webp"),
  "ASC-INV-BKS": assetImg("category/stores/books_store.webp"),
  "ASC-INV-EYE": assetImg("category/stores/eyewear.webp"),
  "ASC-INV-OPL": assetImg("category/stores/eyewear.webp"),
  "ASC-INV-WCH": assetImg("category/stores/watches.webp"),
  "ASC-INV-VEH": assetImg("category/stores/vehicle.webp"),
  "ASC-INV-BAK": assetImg("category/stores/bakery_sweets.webp"),
  "ASC-INV-DAI": assetImg("category/stores/dairy_booth.webp"),
  "ASC-INV-FLW": assetImg("category/stores/flower_shop.webp"),
  "ASC-INV-DEC": assetImg("category/stores/home_decor.webp"),
  "ASC-INV-BBY": assetImg("category/stores/baby_kids.webp"),
  "ASC-INV-ORG": assetImg("category/stores/organic_food.webp"),
  "ASC-INV-PAN": assetImg("category/stores/paan_shop.webp"),
  "ASC-INV-FOO": assetImg("category/stores/footwear_store.webp"),
  "ASC-INV-GFT": assetImg("category/stores/gift_shop.webp"),
  "ASC-INV-POO": assetImg("category/stores/pooja_items.webp"),
  "ASC-INV-MUS": assetImg("category/stores/music_store.webp"),
  "ASC-INV-LIQ": assetImg("category/stores/liquor_store.webp"),
  "ASC-INV-ELC": assetImg("category/stores/electrical_store.webp"),
  "ASC-INV-PNT": assetImg("category/stores/paint_store.webp"),
  "ASC-INV-AGR": assetImg("category/stores/agri_store.webp"),
  "ASC-INV-OTH": assetImg("category/stores/others_stall.webp"),

  // ── Service-based ───────────────────────────────────────────
  "ASC-SVC-01": assetImg("category/stores/personal_care_store.webp"),
  "ASC-SVC-02": assetImg("category/stores/repair_service_store.webp"),
  "ASC-SVC-03": assetImg("category/stores/tailoring.webp"),
  "ASC-SVC-04": assetImg("category/stores/laundry.webp"),
  "ASC-SVC-05": assetImg("category/stores/diagnostic_lab.webp"),
  "ASC-SVC-06": assetImg("category/stores/printing_xerox.webp"),
  "ASC-SVC-07": assetImg("category/stores/travel_agency.webp"),
  "ASC-SVC-08": assetImg("category/stores/catering.webp"),
  "ASC-SVC-09": assetImg("category/stores/photography.webp"),
  "ASC-SVC-15": assetImg("category/stores/vehicle.webp"),
  "ASC-SVC-25": assetImg("category/stores/paint_store.webp"),

  // ── Menu-based ──────────────────────────────────────────────
  "ASC-MNU-01": assetImg("category/stores/food_bev_store.webp"),
  "ASC-MNU-02": assetImg("category/stores/icecream_store.webp"),
  "ASC-MNU-03": assetImg("category/stores/bakery_sweets.webp"),
  "ASC-MNU-06": assetImg("category/stores/paan_shop.webp"),
  "ASC-MNU-07": assetImg("category/stores/others_stall.webp"),
  "ASC-MNU-08": assetImg("category/stores/others_stall.webp"),
  "ASC-MNU-11": assetImg("category/stores/catering.webp"),
};

export function ascStoreImage(code: string): AssetImage | null {
  return ASC_STORE_IMAGES[code] ?? null;
}
