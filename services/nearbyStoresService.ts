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
// never ships presentation. Rating/reviews aren't in the BE yet, so live pins
// carry rating 0 / no reviews (honest, not faked) until that lands.
// ============================================================

import { StoreMapPin, MOCK_MAP_PINS } from "../data/nearbyMapData";

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
  id:         string;
  name:       string;
  type:       string;     // seller type: retail | wholesale | food_packed | food_live | service
  city:       string | null;
  lat:        number;
  lng:        number;
  distance_m: number;
  is_live:    boolean;
}

interface WireNearby {
  origin: { lat: number; lng: number };
  items:  WireNearbyStore[];
  total:  number;
}

// ── Seller type → map category + pin styling (presentation only) ──
interface TypeStyle { category: string; icon: string; accentColor: string; iconBg: string; }

const TYPE_STYLE: Record<string, TypeStyle> = {
  retail:      { category: "grocery",     icon: "basket-outline",        accentColor: "#166534", iconBg: "#D1FAE5" },
  wholesale:   { category: "grocery",     icon: "cube-outline",          accentColor: "#92400E", iconBg: "#FEF3C7" },
  food_packed: { category: "food",        icon: "fast-food-outline",     accentColor: "#92400E", iconBg: "#FEF3C7" },
  food_live:   { category: "food",        icon: "restaurant-outline",    accentColor: "#92400E", iconBg: "#FEF3C7" },
  service:     { category: "service",     icon: "construct-outline",     accentColor: "#6D28D9", iconBg: "#EDE9FE" },
};
const FALLBACK_STYLE: TypeStyle = { category: "grocery", icon: "storefront-outline", accentColor: "#0F4C81", iconBg: "#DBEAFE" };

function styleFor(type: string): TypeStyle {
  return TYPE_STYLE[type] ?? FALLBACK_STYLE;
}

function fromWire(s: WireNearbyStore): StoreMapPin {
  const st = styleFor(s.type);
  return {
    id:          s.id,
    name:        s.name,
    category:    st.category,
    rating:      0,                 // BE has no ratings yet — honest 0, not faked
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
  return MOCK_MAP_PINS;
}
