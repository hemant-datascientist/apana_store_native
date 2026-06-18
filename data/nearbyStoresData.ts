// ============================================================
// NEARBY STORES DATA — Apana Store (Customer App)
//
// Mock data + selectors for the Stores → Nearby tab feed.
//
// Discovery rule (§19): the customer always sees the *nearest* stores
// first, sorted by real distance from their active location, and the
// top-4 nearest become the hero banner automatically. Both the list
// and the banner are derived from ONE sorted source — never a
// hand-curated banner list — so they can never drift.
//
// Backend swap: GET /api/customer/stores/nearby?lat=&lng=&limit=
//   returns stores already distance-sorted; the FE selectors below
//   become a thin pass-through (server does the sort + distance).
// ============================================================

import { STORE_HERO_IMAGES } from "./storeHeroImages";
import { distanceMeters } from "../lib/geo";

export interface LatLng {
  lat: number;
  lng: number;
}

// ── Hero Banner Stores (derived from the nearest stores) ──────

// Why a store is in the banner — drives the bottom-right pill label/colour.
export type BannerType = "Near you" | "Sponsored" | "Popular";

export interface HeroStore {
  id:         string;
  name:       string;
  rating:     number;
  categories: string[];   // listed on the banner
  city:       string;     // bottom-left label — store city (e.g. "Pune")
  bannerType: BannerType; // bottom-right label — why it's shown
  bgColor:    string;     // placeholder bg (real app uses photo)
  accentColor:string;
  icon:       string;     // Ionicons for placeholder centre
  imageUrl?:  number;     // require()'d asset (undefined → colour fallback)
}

// ── Store List Cards ──────────────────────────────────────────

export interface NearbyStore {
  id:         string;
  name:       string;
  type:       string;     // main badge label (e.g. "Grocery Stores")
  typeColor:  string;
  typeBg:     string;
  rating:     number;
  reviews:    number;
  distanceKm: number;     // baseline; recomputed from the customer's location
  categories: string[];   // small tag pills
  isLive:     boolean;
  bgColor:    string;     // placeholder thumbnail bg
  icon:       string;     // Ionicons for thumbnail
  isSponsored?: boolean;  // paid placement → "Sponsored" banner pill (monetization)
  // Optional so other feeds (e.g. wholesale) can reuse StoreListCard
  // without coords; the nearby list always provides them for sorting.
  city?:      string;     // store city (banner bottom-left)
  lat?:       number;
  lng?:       number;
}

export const NEARBY_STORES: NearbyStore[] = [
  {
    id:         "s1",
    name:       "Sharma General Store",
    type:       "Grocery",
    typeColor:  "#15803D",
    typeBg:     "#DCFCE7",
    rating:     4.8,
    reviews:    312,
    distanceKm: 0.1,
    categories: ["Grocery", "Staples & Grains", "Personal Care"],
    isLive:     true,
    bgColor:    "#166534",
    icon:       "basket-outline",
    city:       "Pune",
    lat:        18.5308,
    lng:        73.8475,
  },
  {
    id:         "s5",
    name:       "Fresh Bakes",
    type:       "Food & Drink",
    typeColor:  "#92400E",
    typeBg:     "#FEF3C7",
    rating:     4.7,
    reviews:    284,
    distanceKm: 0.3,
    categories: ["Breads & Buns", "Cakes & Pastries", "Meals & Thali"],
    isLive:     true,
    bgColor:    "#92400E",
    icon:       "restaurant-outline",
    city:       "Pune",
    lat:        18.5590,
    lng:        73.7868,
  },
  {
    id:         "s2",
    name:       "TechZone Electronics",
    type:       "Electronics",
    typeColor:  "#1D4ED8",
    typeBg:     "#DBEAFE",
    rating:     4.5,
    reviews:    189,
    distanceKm: 0.5,
    categories: ["Mobiles & Tablets", "Audio & Earphones", "Accessories"],
    isLive:     true,
    bgColor:    "#1E3A5F",
    icon:       "headset-outline",
    isSponsored: true,
    city:       "Pune",
    lat:        18.5232,
    lng:        73.8411,
  },
  {
    id:         "s4",
    name:       "Style Hub Fashion",
    type:       "Fashion",
    typeColor:  "#9333EA",
    typeBg:     "#F3E8FF",
    rating:     4.3,
    reviews:    156,
    distanceKm: 0.8,
    categories: ["Men's Clothing", "Women's Clothing", "Footwear"],
    isLive:     false,
    bgColor:    "#6D28D9",
    icon:       "shirt-outline",
    city:       "Pune",
    lat:        18.5204,
    lng:        73.8567,
  },
  {
    id:         "s3",
    name:       "Gupta Medical Store",
    type:       "Pharmacy",
    typeColor:  "#DC2626",
    typeBg:     "#FEE2E2",
    rating:     4.9,
    reviews:    427,
    distanceKm: 0.6,
    categories: ["Medicines", "Health", "Baby Care"],
    isLive:     false,
    bgColor:    "#0F5132",
    icon:       "medkit-outline",
    city:       "Pune",
    lat:        18.5074,
    lng:        73.8077,
  },
];

// ── Discovery selectors (single source for list + banner) ─────
// Pure + immutable: callers pass the customer's active location and
// get a fresh distance-sorted list. The hero banner is just the top
// of that same list, so list order and banner order always agree.

const HERO_COUNT = 4; // nearest N stores promoted to the banner

function roundKm(meters: number): number {
  return Math.round((meters / 1000) * 10) / 10;
}

// Sort the nearby stores by distance from `origin` (nearest first).
// With a real location we recompute each store's distance; without one
// (customer hasn't shared GPS yet) we fall back to the baseline order.
export function selectNearbyStores(origin: LatLng | null): NearbyStore[] {
  const measured = NEARBY_STORES.map((s) =>
    origin && s.lat != null && s.lng != null
      ? { ...s, distanceKm: roundKm(distanceMeters(origin.lat, origin.lng, s.lat, s.lng)) }
      : { ...s },
  );
  return measured.sort((a, b) => a.distanceKm - b.distanceKm);
}

const POPULAR_RATING = 4.8; // ≥ this → "Popular" pill (when not sponsored)

// Why this store earns a banner slot. Paid placement wins; then a
// strong rating reads as "Popular"; otherwise it's simply "Near you".
function bannerTypeFor(s: NearbyStore): BannerType {
  if (s.isSponsored) return "Sponsored";
  if (s.rating >= POPULAR_RATING) return "Popular";
  return "Near you";
}

// Promote a nearby store to a banner descriptor (photo from the shared
// hero-image source; colour fallback when the store has no photo yet).
export function toHeroStore(s: NearbyStore): HeroStore {
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
    imageUrl:    STORE_HERO_IMAGES[s.id],
  };
}

// The top-N nearest stores, ready for the hero carousel.
export function selectHeroStores(sortedNearby: NearbyStore[]): HeroStore[] {
  return sortedNearby.slice(0, HERO_COUNT).map(toHeroStore);
}
