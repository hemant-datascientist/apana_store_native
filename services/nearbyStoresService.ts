// ============================================================
// NEARBY STORES SERVICE — Apana Store (Customer App · Map View)
//
// Real store-discovery pins for the map. The BE already serves them:
//   GET {API_BASE_URL}/stores/nearby?lat=&lng=&limit=
//   → { origin:{lat,lng}, items:[{ id,name,type,city,lat,lng,distance_m,is_live }], total }
// (modules/seller getNearbyStores — H3 k-ring over APPROVED sellers with a pin,
//  sorted by great-circle distance.)
//
// Mode gate (same as services/storeLiveService.ts):
//   EXPO_PUBLIC_API_MODE=local|prod → real fetch; errors PROPAGATE so the map
//     shows a retry — never silently fabricates pins (§19.8 no phantom).
//   anything else (mock)            → bundled MOCK_MAP_PINS.
//
// UI-only fields (icon / colour / category) are assigned client-side from the
// seller type, exactly like storeLiveService assigns chart colours — the BE
// never ships presentation. Rating + review_count ARE real now (AVG over
// customer_db.store_reviews, modules/seller getNearbyStores): a store with no
// reviews reports 0 / 0 — honest, never faked (§19.8).
// ============================================================

import { StoreMapPin, MOCK_MAP_PINS } from "../data/nearbyMapData";
import { ascStyle } from "../data/ascBadges";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE  = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `http://${TOWER_IP}:8000/api/customer`;

const FETCH_TIMEOUT_MS = 10_000;
const DEFAULT_LIMIT    = 50;

export const NEARBY_IS_LIVE = IS_LIVE;

// ── BE wire shape ─────────────────────────────────────────────
interface WireNearbyStore {
  id:           string;
  name:         string;
  type:         string;   // seller type: retail | wholesale | food_packed | food_live | service
  asc_code?:    string | null; // §16 store type (ASC-INV-* | ASC-SVC-* | ASC-MNU-*) when onboarding emits it
  category_label?: string;     // BE-resolved badge text (ASC tag); colour stays FE
  city:         string | null;
  lat:          number;
  lng:          number;
  distance_m:   number;
  is_live:      boolean;
  rating?:      number;   // AVG of store_reviews (1dp); 0/absent when none
  review_count?: number;  // number of reviews; 0/absent when none
}

interface WireNearby {
  origin: { lat: number; lng: number };
  items:  WireNearbyStore[];
  total:  number;
}

// ── Seller type → map category + pin styling (presentation only) ──
interface TypeStyle { category: string; label: string; icon: string; accentColor: string; iconBg: string; }

const TYPE_STYLE: Record<string, TypeStyle> = {
  retail:      { category: "grocery",     label: "Kirana",     icon: "basket-outline",        accentColor: "#166534", iconBg: "#D1FAE5" },
  wholesale:   { category: "grocery",     label: "Wholesale",  icon: "cube-outline",          accentColor: "#92400E", iconBg: "#FEF3C7" },
  food_packed: { category: "food",        label: "Food",       icon: "fast-food-outline",     accentColor: "#92400E", iconBg: "#FEF3C7" },
  food_live:   { category: "food",        label: "Restaurant", icon: "restaurant-outline",    accentColor: "#92400E", iconBg: "#FEF3C7" },
  service:     { category: "service",     label: "Services",   icon: "construct-outline",     accentColor: "#6D28D9", iconBg: "#EDE9FE" },
};
const FALLBACK_STYLE: TypeStyle = { category: "grocery", label: "Apana", icon: "storefront-outline", accentColor: "#0F4C81", iconBg: "#DBEAFE" };

// Full §16 ASC code wins (all 69 types light up); else the coarse seller type;
// else the generic Apana fallback. AscPinStyle and TypeStyle share fields.
function styleFor(s: WireNearbyStore): TypeStyle {
  return ascStyle(s.asc_code) ?? TYPE_STYLE[s.type] ?? FALLBACK_STYLE;
}

function fromWire(s: WireNearbyStore): StoreMapPin {
  const st = styleFor(s);
  return {
    id:            s.id,
    name:          s.name,
    category:      st.category,
    categoryLabel: s.category_label ?? st.label, // label is BE-owned; colour stays FE (st)
    rating:        s.rating ?? 0,        // real AVG from store_reviews; 0 = no reviews yet (honest §19.8)
    reviews:       s.review_count ?? 0,
    isOpen:      s.is_live,
    isLive:      s.is_live,
    distanceKm:  Math.round((s.distance_m / 1000) * 10) / 10,
    icon:        st.icon,
    accentColor: st.accentColor,
    iconBg:      st.iconBg,
    tags:        [],
    lat:         s.lat,
    lng:         s.lng,
  };
}

// ── Mock fetch ────────────────────────────────────────────────
// Spread the bundled mock pins in a tight cluster around the requested
// centre, so the demo shows stores right next to the user dot wherever they
// are (and the bottom store card always has an on-screen shop to show).
// Mock-only — live data is never fabricated or repositioned (§19.8).
function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)) * 10) / 10;
}

// Per-store lat/lng deltas (deg) → a cluster ~0.3–1 km out from centre.
const MOCK_OFFSETS: Array<[number, number]> = [
  [ 0.0040,  0.0030],
  [-0.0060,  0.0050],
  [ 0.0020, -0.0070],
  [-0.0050, -0.0040],
  [ 0.0080,  0.0010],
];

function mockPinsAround(lat: number, lng: number): StoreMapPin[] {
  return MOCK_MAP_PINS.map((p, i) => {
    const [dLat, dLng] = MOCK_OFFSETS[i % MOCK_OFFSETS.length];
    const plat = lat + dLat;
    const plng = lng + dLng;
    return { ...p, lat: plat, lng: plng, distanceKm: haversineKm(lat, lng, plat, plng) };
  });
}

// ── Live fetch ────────────────────────────────────────────────
async function fetchLive(lat: number, lng: number, limit: number): Promise<StoreMapPin[]> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const url = `${BASE_URL}/stores/nearby?lat=${lat}&lng=${lng}&limit=${limit}`;
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`stores/nearby ${res.status}`);
    const body = (await res.json()) as WireNearby;
    return body.items.map(fromWire);
  } finally {
    clearTimeout(timer);
  }
}

// ── Public entry — single swap surface ────────────────────────
// Live mode hits the BE (errors propagate); mock returns the bundled pins.
export async function fetchNearbyStores(
  lat: number,
  lng: number,
  limit: number = DEFAULT_LIMIT,
): Promise<StoreMapPin[]> {
  if (IS_LIVE) return fetchLive(lat, lng, limit);
  return mockPinsAround(lat, lng);
}
