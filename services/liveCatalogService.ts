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
  image: string | null; // absolute URL, resolved (first image)
  images: string[]; // all images, resolved
  category: string | null;
  subCategory: string | null;
  apcClassCode: string | null;
  store: LiveProductStore;
}

// ── Product detail (SmartConsumer-style) ──────────────────────
export interface EnrichmentCompany {
  name: string | null;
  address: string | null;
}
export interface EnrichmentCustomerCare {
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}
export interface ProductEnrichment {
  gtin: string | null;
  verified: boolean;
  netContent: string | null;
  country: string | null;
  packagingType: string | null;
  shelfLife: string | null;
  mrp: number | null; // rupees
  company: EnrichmentCompany;
  customerCare: EnrichmentCustomerCare | null;
  tabs: Record<string, Record<string, string>>; // rawTabs, label → key/value
}
export interface StockingStore {
  sellerProductId: string;
  storeId: string;
  storeName: string;
  storeType: string;
  city: string;
  lat: number | null;
  lng: number | null;
  price: number; // rupees
  mrp: number | null;
  dealPrice: number | null;
  stockQty: number;
  unit: string;
  isCurrent: boolean;
}
export interface ProductDetail {
  product: LiveProduct;
  enrichment: ProductEnrichment | null;
  stores: StockingStore[];
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
  sub_category: string | null;
  apc_class_code: string | null;
  store: WireStore;
}
interface WireList {
  items: WireProduct[];
  page: number;
  limit: number;
  total: number;
}
interface WireEnrichment {
  gtin: string | null;
  verified: boolean;
  net_content: string | null;
  country: string | null;
  packaging_type: string | null;
  shelf_life: string | null;
  mrp_cents: number | null;
  company: { name: string | null; address: string | null };
  customer_care: EnrichmentCustomerCare | null;
  tabs: Record<string, Record<string, string>>;
}
interface WireStockingStore {
  seller_product_id: string;
  store_id: string;
  store_name: string;
  store_type: string;
  city: string;
  lat: number | null;
  lng: number | null;
  price_cents: number;
  mrp_cents: number | null;
  deal_price_cents: number | null;
  stock_qty: number;
  unit: string;
  is_current: boolean;
}
interface WireDetail {
  product: WireProduct;
  enrichment: WireEnrichment | null;
  stores: WireStockingStore[];
}

function resolveImage(u: string | undefined): string | null {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_ORIGIN}${u.startsWith("/") ? "" : "/"}${u}`;
}

function toLiveProduct(w: WireProduct): LiveProduct {
  const images = (w.images ?? []).map(resolveImage).filter((u): u is string => u != null);
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
    image: images[0] ?? null,
    images,
    category: w.category,
    subCategory: w.sub_category,
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

function toEnrichment(w: WireEnrichment): ProductEnrichment {
  return {
    gtin: w.gtin,
    verified: w.verified,
    netContent: w.net_content,
    country: w.country,
    packagingType: w.packaging_type,
    shelfLife: w.shelf_life,
    mrp: w.mrp_cents != null ? w.mrp_cents / 100 : null,
    company: w.company,
    customerCare: w.customer_care,
    tabs: w.tabs ?? {},
  };
}

function toStockingStore(w: WireStockingStore): StockingStore {
  return {
    sellerProductId: w.seller_product_id,
    storeId: w.store_id,
    storeName: w.store_name,
    storeType: w.store_type,
    city: w.city,
    lat: w.lat,
    lng: w.lng,
    price: w.price_cents / 100,
    mrp: w.mrp_cents != null ? w.mrp_cents / 100 : null,
    dealPrice: w.deal_price_cents != null ? w.deal_price_cents / 100 : null,
    stockQty: w.stock_qty,
    unit: w.unit,
    isCurrent: w.is_current,
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

// Full SmartConsumer-style detail: product + GTIN enrichment + stocking stores.
// null when the id doesn't resolve (404) or in mock mode.
export async function fetchProductDetail(id: string): Promise<ProductDetail | null> {
  if (!IS_LIVE) return null;
  try {
    const body = await fetchJson<WireDetail>(
      `${BASE_URL}/catalog/products/${encodeURIComponent(id)}`,
    );
    return {
      product: toLiveProduct(body.product),
      enrichment: body.enrichment ? toEnrichment(body.enrichment) : null,
      stores: (body.stores ?? []).map(toStockingStore),
    };
  } catch {
    return null;
  }
}
