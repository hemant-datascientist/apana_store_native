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

import { sortByDistance, type LatLng } from "../lib/storeBanner";

// Banner model lives in lib/storeBanner (shared across all Stores tabs);
// re-exported here so existing importers keep working.
export type { LatLng, BannerType, HeroStore } from "../lib/storeBanner";
export { buildHeroStores } from "../lib/storeBanner";

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

// ── Discovery selector ────────────────────────────────────────
// Rank the nearby stores nearest-first from the customer's location
// (falls back to baseline order when no GPS pin). The banner is just
// buildHeroStores() over the top of this same list, so list order and
// banner order always agree.
export function selectNearbyStores(origin: LatLng | null): NearbyStore[] {
  return sortByDistance(NEARBY_STORES, origin);
}
