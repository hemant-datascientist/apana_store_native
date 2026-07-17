// ============================================================
// LIVE CATALOG SERVICE — Apana Store (Customer App)
//
// The customer-facing view of "what sellers have actually scanned / added".
// Reads the public catalog surface backed by seller_products:
//   GET {BASE}/catalog/products?q=&page=&limit=
//     → { items:[CustomerProductOut], page, limit, total }
//   GET {BASE}/catalog/stores/:storeId/products?...   (same shape)
// (modules/catalog listLiveProducts / listStoreProducts — approved store +
//  active listing + stock_qty > 0, newest-add first, honest-empty §19.8.)
//
// Mode gate (same as services/api/client.ts):
//   EXPO_PUBLIC_API_MODE=local|prod → real fetch; errors PROPAGATE so the
//     screen shows a retry state — never invents products in live mode.
//   anything else (mock)            → empty (there is no bundled mock for
//     real seller inventory; the whole point is that it is real).
// ============================================================

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `http://${TOWER_IP}:8000/api/customer`;

// BE origin — seller-uploaded images are stored as BE-relative refs
// (/api/seller/uploads/file/… or bare assets/…); master/CDN images are
// already absolute and pass through untouched.
const API_ORIGIN = BASE_URL.replace(/\/api\/customer$/, "");

const FETCH_TIMEOUT_MS = 10_000;

export const LIVE_CATALOG_IS_LIVE = IS_LIVE;

// ── FE-facing product shape (rupees, resolved image) ──────────
export interface LiveProductStore {
  id: string;
  name: string;
  type: string;
  city: string;
  ascCode: string | null;
}

export interface LiveProduct {
  id: string;
  name: string;
  brand: string | null;
  price: number; // rupees
  mrp: number | null;
  dealPrice: number | null;
  unit: string;
  stockQty: number;
  isVeg: boolean | null;
  image: string | null; // absolute URL, resolved
  category: string | null;
  apcClassCode: string | null;
  store: LiveProductStore;
}

// ── BE wire shape (snake_case, cents) ─────────────────────────
interface WireStore {
  id: string;
  name: string;
  type: string;
  city: string;
  asc_code: string | null;
}
interface WireProduct {
  id: string;
  name: string;
  brand: string | null;
  price_cents: number;
  mrp_cents: number | null;
  deal_price_cents: number | null;
  unit: string;
  stock_qty: number;
  is_veg: boolean | null;
  images: string[];
  category: string | null;
  apc_class_code: string | null;
  store: WireStore;
}
interface WireList {
  items: WireProduct[];
  page: number;
  limit: number;
  total: number;
}

function resolveImage(u: string | undefined): string | null {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_ORIGIN}${u.startsWith("/") ? "" : "/"}${u}`;
}

function toLiveProduct(w: WireProduct): LiveProduct {
  return {
    id: w.id,
    name: w.name,
    brand: w.brand,
    price: w.price_cents / 100,
    mrp: w.mrp_cents != null ? w.mrp_cents / 100 : null,
    dealPrice: w.deal_price_cents != null ? w.deal_price_cents / 100 : null,
    unit: w.unit,
    stockQty: w.stock_qty,
    isVeg: w.is_veg,
    image: resolveImage(w.images?.[0]),
    category: w.category,
    apcClassCode: w.apc_class_code,
    store: {
      id: w.store.id,
      name: w.store.name,
      type: w.store.type,
      city: w.store.city,
      ascCode: w.store.asc_code,
    },
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

// ── Public API ────────────────────────────────────────────────

// Every visible product across all sellers, newest-add first.
export async function fetchLiveProducts(limit = 30, q = ""): Promise<LiveProduct[]> {
  if (!IS_LIVE) return []; // mock: no real inventory to show
  const params = new URLSearchParams({ limit: String(limit) });
  if (q.trim()) params.set("q", q.trim());
  const body = await fetchJson<WireList>(`${BASE_URL}/catalog/products?${params.toString()}`);
  return body.items.map(toLiveProduct);
}

// One store's visible products.
export async function fetchStoreProducts(storeId: string, limit = 50): Promise<LiveProduct[]> {
  if (!IS_LIVE) return [];
  const body = await fetchJson<WireList>(
    `${BASE_URL}/catalog/stores/${encodeURIComponent(storeId)}/products?limit=${limit}`,
  );
  return body.items.map(toLiveProduct);
}
