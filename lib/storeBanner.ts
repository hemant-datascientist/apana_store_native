// ============================================================
// storeBanner — shared hero-banner model for the Stores tabs.
//
// Every Stores tab (Nearby, Wholesale, B2C, Service) shows the same
// hero banner: the top-N stores of that tab as cards (real photo when
// available via storeHeroImages, else a colour + icon fallback), each
// labelled with the store's city and a "why shown" pill —
// Near you / Sponsored / Popular.
//
// A tab maps its own store list to BannerableStore and calls the
// selectors below, so the four tabs stay visually + behaviourally
// identical and the rule lives in exactly one place.
//
// Backend swap: GET /api/customer/stores/nearby already returns stores
// distance-ranked; these become a thin pass-through once each tab is
// wired to it.
// ============================================================

import { distanceMeters } from "./geo";
import { getStoreHeroImage } from "../data/storeHeroImages";

export interface LatLng {
  lat: number;
  lng: number;
}

// Why a store is in the banner — drives the bottom-right pill.
export type BannerType = "Near you" | "Sponsored" | "Popular";

export interface HeroStore {
  id:          string;
  name:        string;
  rating:      number;
  categories:  string[];   // listed on the banner
  city:        string;     // bottom-left label — store city (e.g. "Pune")
  bannerType:  BannerType; // bottom-right label — why it's shown
  bgColor:     string;     // placeholder bg (real app uses photo)
  accentColor: string;
  icon:        string;     // Ionicons for placeholder centre
  imageUrl?:   number;     // require()'d asset (undefined → colour fallback)
}

// Minimal shape any tab's store must provide to appear in the banner.
export interface BannerableStore {
  id:          string;
  name:        string;
  rating:      number;
  categories:  string[];
  icon:        string;
  bgColor:     string;
  distanceKm:  number;     // baseline distance — ranks when there's no GPS pin
  city?:       string;     // shown bottom-left ("" → hidden)
  lat?:        number;
  lng?:        number;
  isSponsored?: boolean;   // paid placement → "Sponsored" pill (monetization)
}

const POPULAR_RATING = 4.8; // ≥ this → "Popular" pill (when not sponsored)
const HERO_COUNT = 4;       // nearest N stores promoted to the banner

function roundKm(meters: number): number {
  return Math.round((meters / 1000) * 10) / 10;
}

// Why this store earns a banner slot. Paid placement wins; then a
// strong rating reads as "Popular"; otherwise it's simply "Near you".
function bannerTypeFor(s: BannerableStore): BannerType {
  if (s.isSponsored) return "Sponsored";
  if (s.rating >= POPULAR_RATING) return "Popular";
  return "Near you";
}

function toHeroStore(s: BannerableStore): HeroStore {
  return {
    id:          s.id,
    name:        s.name,
    rating:      s.rating,
    categories:  s.categories,
    city:        s.city ?? "",
    bannerType:  bannerTypeFor(s),
    bgColor:     s.bgColor,
    accentColor: s.bgColor,
    icon:        s.icon,
    imageUrl:    getStoreHeroImage(s.id),
  };
}

// Rank stores nearest-first. With the customer's GPS + a store pin we
// use true distance; otherwise each store's baseline distanceKm. Pure +
// immutable — returns a fresh, sorted copy.
export function sortByDistance<T extends BannerableStore>(stores: T[], origin: LatLng | null): T[] {
  const measured = stores.map((s) =>
    origin && s.lat != null && s.lng != null
      ? { ...s, distanceKm: roundKm(distanceMeters(origin.lat, origin.lng, s.lat, s.lng)) }
      : { ...s },
  );
  return measured.sort((a, b) => a.distanceKm - b.distanceKm);
}

// The nearest N stores as banner cards. Pass an already-display-ordered
// list (e.g. the output of sortByDistance) — this just promotes the top N.
export function buildHeroStores(sorted: BannerableStore[], limit: number = HERO_COUNT): HeroStore[] {
  return sorted.slice(0, limit).map(toHeroStore);
}
