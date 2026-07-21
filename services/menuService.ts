// ============================================================
// MENU SERVICE — Apana Store (Customer App)
//
// The customer's half of §16.12 AMC: find a kitchen, read the live menu,
// order dishes through the §13 order engine.
//
//   GET  {BASE}/menu/stores?city=&q=&class=
//   GET  {BASE}/menu/stores/:id            → { store, sections[] }
//   POST {BASE}/orders/menu-checkout       → { orders[] }
// (modules/amc/src/customer.ts + modules/orders/src/menuOrders.ts.)
//
// A dish is orderable only when it is active AND available_today — that flag
// is the kitchen's "sold out", and it is the whole availability model. There
// is no stock to reserve, because the cook makes it when the ticket lands.
//
// Mode gate matches services/liveCatalogService.ts.
// ============================================================

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `http://${TOWER_IP}:8000/api/customer`;

const FETCH_TIMEOUT_MS = 10_000;

export const MENU_IS_LIVE = IS_LIVE;

// ── FE-facing shapes ──────────────────────────────────────────
export type Diet = "veg" | "nonveg" | "egg";

export interface MenuStore {
  id: string;
  name: string;
  ascCode: string | null;
  type: string;
  city: string;
  lat: number | null;
  lng: number | null;
  dishCount: number;
  fromPrice: number; // rupees
  hasVeg: boolean;
  hasNonveg: boolean;
  classes: string[];
}

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  diet: Diet | null;
  price: number; // rupees — everyday
  dealPrice: number | null; // rupees — floor, unlocks by the store threshold
  unit: string;
  prepMinutes: number | null;
  itemCode: string | null;
  classCode: string | null;
  groupCode: string | null;
}

export interface MenuSection {
  groupCode: string | null;
  groupName: string;
  items: Dish[];
}

export interface MenuStoreDetail {
  store: MenuStore;
  sections: MenuSection[];
}

export interface MenuOrderLine {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number; // rupees, as charged
  lineTotal: number; // rupees
}

export interface MenuOrder {
  id: string;
  invoiceDisplay: string;
  sellerId: string;
  sellerName: string | null;
  status: string;
  subtotal: number; // rupees
  total: number;
  paymentMode: string;
  paymentStatus: string;
  fulfillment: string;
  items: MenuOrderLine[];
  createdAt: string;
}

export interface MenuCheckoutRequest {
  customerId: string; // phone in dev — the JWT sub once auth lands
  items: { menuItemId: string; qty: number }[];
  paymentMode: "cod" | "mock_upi";
  fulfillment: "instant" | "scheduled" | "pickup";
  deliveryAddress?: Record<string, unknown> | null;
  note?: string | null;
}

// ── BE wire shapes ────────────────────────────────────────────
interface WireStore {
  id: string;
  name: string;
  asc_code: string | null;
  type: string;
  city: string;
  lat: number | null;
  lng: number | null;
  dish_count: number;
  from_price_cents: number;
  has_veg: boolean;
  has_nonveg: boolean;
  classes: string[];
}
interface WireDish {
  id: string;
  name: string;
  description: string | null;
  diet: string | null;
  price_cents: number;
  deal_price_cents: number | null;
  unit: string;
  prep_minutes: number | null;
  amc_item_code: string | null;
  amc_class_code: string | null;
  amc_group_code: string | null;
}
interface WireSection {
  group_code: string | null;
  group_name: string;
  items: WireDish[];
}
interface WireOrder {
  id: string;
  invoice_display: string;
  seller_id: string;
  seller_name: string | null;
  status: string;
  subtotal_cents: number;
  total_cents: number;
  payment_mode: string;
  payment_status: string;
  fulfillment: string;
  items: {
    product_id: string;
    name: string;
    qty: number;
    unit_price_cents: number;
    line_total_cents: number;
  }[];
  created_at: string;
}

function toStore(w: WireStore): MenuStore {
  return {
    id: w.id,
    name: w.name,
    ascCode: w.asc_code,
    type: w.type,
    city: w.city,
    lat: w.lat,
    lng: w.lng,
    dishCount: w.dish_count,
    fromPrice: w.from_price_cents / 100,
    hasVeg: w.has_veg,
    hasNonveg: w.has_nonveg,
    classes: w.classes ?? [],
  };
}

function toDish(w: WireDish): Dish {
  return {
    id: w.id,
    name: w.name,
    description: w.description,
    diet: (w.diet as Diet | null) ?? null,
    price: w.price_cents / 100,
    dealPrice: w.deal_price_cents != null ? w.deal_price_cents / 100 : null,
    unit: w.unit,
    prepMinutes: w.prep_minutes,
    itemCode: w.amc_item_code,
    classCode: w.amc_class_code,
    groupCode: w.amc_group_code,
  };
}

function toOrder(w: WireOrder): MenuOrder {
  return {
    id: w.id,
    invoiceDisplay: w.invoice_display,
    sellerId: w.seller_id,
    sellerName: w.seller_name,
    status: w.status,
    subtotal: w.subtotal_cents / 100,
    total: w.total_cents / 100,
    paymentMode: w.payment_mode,
    paymentStatus: w.payment_status,
    fulfillment: w.fulfillment,
    items: (w.items ?? []).map((i) => ({
      productId: i.product_id,
      name: i.name,
      qty: i.qty,
      unitPrice: i.unit_price_cents / 100,
      lineTotal: i.line_total_cents / 100,
    })),
    createdAt: w.created_at,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...init, signal: ctl.signal });
    const text = await res.text();
    if (!res.ok) {
      // "Dal Tadka is sold out today" is the message the customer must see.
      let message = `Request failed (${res.status})`;
      try {
        const body = JSON.parse(text) as { message?: string; error?: string };
        message = body.message ?? body.error ?? message;
      } catch {
        // non-JSON error body — keep the status message
      }
      throw new Error(message);
    }
    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ── Public API ────────────────────────────────────────────────

export async function fetchMenuStores(opts: {
  city?: string;
  q?: string;
  classCode?: string;
} = {}): Promise<MenuStore[]> {
  if (!IS_LIVE) return [];
  const params = new URLSearchParams();
  if (opts.city?.trim()) params.set("city", opts.city.trim());
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.classCode) params.set("class", opts.classCode);
  const qs = params.toString();
  const body = await request<{ items: WireStore[] }>(`/menu/stores${qs ? `?${qs}` : ""}`);
  return body.items.map(toStore);
}

export async function fetchMenuStore(id: string): Promise<MenuStoreDetail | null> {
  if (!IS_LIVE) return null;
  try {
    const body = await request<{ store: WireStore; sections: WireSection[] }>(
      `/menu/stores/${encodeURIComponent(id)}`,
    );
    return {
      store: toStore(body.store),
      sections: (body.sections ?? []).map((s) => ({
        groupCode: s.group_code,
        groupName: s.group_name,
        items: s.items.map(toDish),
      })),
    };
  } catch {
    return null;
  }
}

// Errors propagate — "sold out today" must reach the customer, not a spinner.
export async function placeMenuOrder(req: MenuCheckoutRequest): Promise<MenuOrder[]> {
  if (!IS_LIVE) throw new Error("Ordering needs a live connection.");
  const body = await request<{ orders: WireOrder[] }>("/orders/menu-checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      customer_id: req.customerId,
      items: req.items.map((i) => ({ menu_item_id: i.menuItemId, qty: i.qty })),
      payment_mode: req.paymentMode,
      fulfillment: req.fulfillment,
      delivery_address: req.deliveryAddress ?? null,
      note: req.note ?? null,
    }),
  });
  return body.orders.map(toOrder);
}
