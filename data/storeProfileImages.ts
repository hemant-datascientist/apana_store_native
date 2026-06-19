// ============================================================
// STORE PROFILE IMAGES — Apana Store (Customer App)
//
// The store's 1:1 PROFILE photo: the storefront seen from OUTSIDE with
// the shop's name board / poster, so a customer instantly recognises a
// shop they know while scrolling the list.
//
// DISTINCT from storeHeroImages (the cover/banner — an inside-the-store
// shot). The list-card thumbnail must use THIS, never the cover.
//
// Sourced from the seller's uploaded 1:1 storePhoto via the backend.
// The demo stores have no outside-storefront asset yet, so this is
// empty → the card falls back to its coloured type icon (§19.8 — show
// nothing rather than the wrong image).
// ============================================================

export const STORE_PROFILE_IMAGES: Record<string, number> = {
  // e.g. s1: require("../assets/images/home/stores/profile_sharma.png"),
};

export function getStoreProfileImage(id: string): number | undefined {
  return STORE_PROFILE_IMAGES[id];
}
