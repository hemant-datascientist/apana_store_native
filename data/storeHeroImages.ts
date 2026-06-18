// ============================================================
// STORE HERO IMAGES — Apana Store (Customer App)
//
// Single source for a store's hero / cover photo, keyed by store id.
// Used by BOTH the Nearby home banner (NearbyHeroBanner) and the
// store-detail cover (StoreHeroBanner) so the image a customer taps
// is the exact image they land on — visual continuity, never drifts.
//
// Stores without a photo here fall back to their solid heroBg colour.
// Backend: replace with the store's cover_image URL from GET /stores/:id.
// ============================================================

export const STORE_HERO_IMAGES: Record<string, number> = {
  s1: require("../assets/images/home/stores/hero_sharma.png"),
  s5: require("../assets/images/home/stores/hero_fresh_bakes.png"),
  s2: require("../assets/images/home/stores/hero_techzone.png"),
  s4: require("../assets/images/home/stores/hero_style_hub.png"),
};

export function getStoreHeroImage(id: string): number | undefined {
  return STORE_HERO_IMAGES[id];
}
