// ============================================================
// STORE GALLERY — Apana Store (Customer App)
//
// Ordered photo set a customer sees in the store-detail cover carousel.
// Mirrors the seller's upload groups (Step5Photos):
//   coverPhoto · frontPhotos · outsidePhotos · insidePhotos · surroundingPhotos
// (the seller's profilePhoto stays the avatar overlap, not in the carousel.)
//
// Frontend-first: today only the cover photo exists per mock store, so a
// store's gallery is [cover]. The carousel scrolls once a store has more.
// Backend swap: GET /api/customer/stores/:id → photos[] of { url, kind }
//   built from the seller's uploaded cover/front/outside/inside/surrounding.
// ============================================================

import { STORE_HERO_IMAGES } from "./storeHeroImages";

export type StorePhotoKind =
  | "cover"
  | "front"
  | "exterior"
  | "interior"
  | "surrounding";

export interface StorePhoto {
  src:   number | { uri: string }; // require()'d asset (mock) or remote URL (BE)
  label: string;                   // shown as the slide chip
  kind:  StorePhotoKind;
}

export const PHOTO_LABELS: Record<StorePhotoKind, string> = {
  cover:       "Cover",
  front:       "Front View",
  exterior:    "Outside / Exterior",
  interior:    "Inside / Interior",
  surrounding: "Surrounding Area",
};

// Ordered gallery for a store. Empty → the cover falls back to the
// solid heroBg colour + store icon (honest, §19.8 — no fake photos).
export function getStoreGallery(id: string): StorePhoto[] {
  const photos: StorePhoto[] = [];
  const cover = STORE_HERO_IMAGES[id];
  if (cover != null) photos.push({ src: cover, label: PHOTO_LABELS.cover, kind: "cover" });
  // front / exterior / interior / surrounding arrive from seller uploads
  // via the backend; no mock assets for them yet.
  return photos;
}
