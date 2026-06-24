// ============================================================
// MAP PRODUCT SERVICE — Apana Store (Customer App · Map View "Find Products")
//
// Backs the product → store flow with the BE:
//   GET {BASE}/products/search?q=&lat=&lng=&limit=
//     → { items:[{ key,master_product_id,name,brand,image,store_count,min_price_cents }] }
//   GET {BASE}/products/stores?productId=&q=&lat=&lng=&limit=
//     → { items:[{ id, ... }] }  (same shape as /stores/nearby)
// (modules/seller searchNearbyProducts / getStoresForProduct — scoped to the same
//  approved-store k-ring as nearby, honest-empty §19.8.)
//
// Mode gate (same as services/nearbyStoresService.ts):
//   EXPO_PUBLIC_API_MODE=local|prod → real fetch; errors propagate.
//   anything else (mock)            → bundled mapProductData.
//
// storeIdsForProduct returns the IDS of stores stocking the product — the map
// then filters the already-loaded nearby pins by that set. Product-stores are a
// subset of nearby stores (same ring), so one id filter works for mock and live
// and keeps the on-map coordinates consistent with the rest of the map.
// ============================================================

import { MapProduct, searchProducts } from "../data/mapProductData";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE  = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `http://${TOWER_IP}:8000/api/customer`;

const FETCH_TIMEOUT_MS = 10_000;

export const MAP_PRODUCTS_IS_LIVE = IS_LIVE;

// ── BE wire shapes ────────────────────────────────────────────
interface WireProductHit {
  key:               string;
  master_product_id: string | null;
  name:              string;
  brand:             string | null;
  image:             string | null;
  store_count:       number;
  min_price_cents:   number;
}
interface WireProductSearch { items: WireProductHit[] }
interface WireStores { items: Array<{ id: string }> }

// Branded items get a box glyph; unbranded a generic bag. Presentation only.
function hitToProduct(h: WireProductHit): MapProduct {
  return {
    id:                h.key,
    name:              h.name,
    brand:             h.brand ?? undefined,
    icon:              "cube-outline",
    iconBg:            "#DBEAFE",
    availableStoreIds: [],
    masterProductId:   h.master_product_id,
    storeCount:        h.store_count,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`${url} ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ── Public API — single swap surface ──────────────────────────

export async function searchMapProducts(
  q: string,
  lat: number,
  lng: number,
  limit = 20,
): Promise<MapProduct[]> {
  if (!IS_LIVE) return searchProducts(q); // mock: bundled index
  const term = q.trim();
  if (term.length < 2) return [];
  const url = `${BASE_URL}/products/search?q=${encodeURIComponent(term)}&lat=${lat}&lng=${lng}&limit=${limit}`;
  const body = await fetchJson<WireProductSearch>(url);
  return body.items.map(hitToProduct);
}

// Store IDs (within the nearby set) that stock the product.
export async function storeIdsForProduct(
  product: MapProduct,
  lat: number,
  lng: number,
  limit = 50,
): Promise<string[]> {
  if (!IS_LIVE) return product.availableStoreIds; // mock
  const key = product.masterProductId
    ? `productId=${encodeURIComponent(product.masterProductId)}`
    : `q=${encodeURIComponent(product.name)}`;
  const url = `${BASE_URL}/products/stores?${key}&lat=${lat}&lng=${lng}&limit=${limit}`;
  const body = await fetchJson<WireStores>(url);
  return body.items.map((s) => s.id);
}
