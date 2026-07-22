// ============================================================
// BOOKING SERVICE — Apana Store (Customer App)
//
// The customer's half of §16.11 ASvC: find a service store, see what it
// actually offers, book a slot, track and cancel your own bookings.
//
//   GET  {BASE}/services/stores?city=&q=&class=
//   GET  {BASE}/services/stores/:id          → { store, sections[] }
//   POST {BASE}/services/bookings            → the created booking
//   GET  {BASE}/services/bookings?phone=     → the caller's own bookings
//   POST {BASE}/services/bookings/:id/cancel?phone=
// (modules/asvc/src/customer.ts — approved seller + active offering only.)
//
// Identity is the phone number: service_bookings has no customer FK yet, so
// the phone is what proves a booking is yours. Every own-bookings read and the
// cancel path send it, and the BE filters on it — no phone, no bookings.
//
// Mode gate matches services/liveCatalogService.ts:
//   local|prod → real fetch, errors PROPAGATE so the screen can retry
//   anything else (mock) → empty; there is no bundled mock for real shops.
// ============================================================

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `http://${TOWER_IP}:8000/api/customer`;

const FETCH_TIMEOUT_MS = 10_000;

export const BOOKING_IS_LIVE = IS_LIVE;

// ── FE-facing shapes (rupees, camelCase) ──────────────────────
export interface ServiceStore {
  id: string;
  name: string;
  ascCode: string | null;
  type: string;
  city: string;
  lat: number | null;
  lng: number | null;
  offeringCount: number;
  fromPrice: number; // rupees
  atHome: boolean;
  classes: string[];
}

export interface Offering {
  id: string;
  name: string;
  description: string | null;
  price: number; // rupees
  unit: string;
  durationMin: number | null;
  atHome: boolean;
  itemCode: string;
  classCode: string;
  groupCode: string | null;
}

export interface ServiceSection {
  groupCode: string | null;
  groupName: string;
  items: Offering[];
}

export interface ServiceStoreDetail {
  store: ServiceStore;
  sections: ServiceSection[];
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed";

export interface Booking {
  id: string;
  status: BookingStatus;
  serviceName: string;
  price: number; // rupees
  slotStart: string; // ISO
  durationMin: number | null;
  atHome: boolean;
  address: string | null;
  note: string | null;
  store: { id: string; name: string; city: string; phone: string | null };
  createdAt: string;
}

export interface BookingRequest {
  offeringId: string;
  slotStart: string; // ISO with offset
  customerName: string;
  customerPhone: string; // required — the only identity a booking carries
  address?: string | null;
  note?: string | null;
}

// ── BE wire shapes (snake_case, cents) ────────────────────────
interface WireStore {
  id: string;
  name: string;
  asc_code: string | null;
  type: string;
  city: string;
  lat: number | null;
  lng: number | null;
  offering_count: number;
  from_price_cents: number;
  at_home: boolean;
  classes: string[];
}
interface WireOffering {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  unit: string;
  duration_min: number | null;
  at_home: boolean;
  asvc_item_code: string;
  asvc_class_code: string;
  asvc_group_code: string | null;
}
interface WireSection {
  group_code: string | null;
  group_name: string;
  items: WireOffering[];
}
interface WireBooking {
  id: string;
  status: string;
  service_name: string;
  price_cents: number;
  slot_start: string;
  duration_min: number | null;
  at_home: boolean;
  address: string | null;
  note: string | null;
  store: { id: string; name: string; city: string; phone: string | null };
  created_at: string;
}

function toStore(w: WireStore): ServiceStore {
  return {
    id: w.id,
    name: w.name,
    ascCode: w.asc_code,
    type: w.type,
    city: w.city,
    lat: w.lat,
    lng: w.lng,
    offeringCount: w.offering_count,
    fromPrice: w.from_price_cents / 100,
    atHome: w.at_home,
    classes: w.classes ?? [],
  };
}

function toOffering(w: WireOffering): Offering {
  return {
    id: w.id,
    name: w.name,
    description: w.description,
    price: w.price_cents / 100,
    unit: w.unit,
    durationMin: w.duration_min,
    atHome: w.at_home,
    itemCode: w.asvc_item_code,
    classCode: w.asvc_class_code,
    groupCode: w.asvc_group_code,
  };
}

function toBooking(w: WireBooking): Booking {
  return {
    id: w.id,
    status: w.status as BookingStatus,
    serviceName: w.service_name,
    price: w.price_cents / 100,
    slotStart: w.slot_start,
    durationMin: w.duration_min,
    atHome: w.at_home,
    address: w.address,
    note: w.note,
    store: w.store,
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
      // The BE sends { error, message } — surface the message, because
      // "Eyebrow Threading is not accepting bookings" is what the customer
      // needs to read, not "422".
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

// What the list was scoped to, plus how many live shops sit outside it. The
// screen needs both to explain an empty result instead of just showing one.
export interface DiscoveryScope {
  label: string | null;
  level: "area" | "city" | "all";
}

export interface ServiceStoreList {
  items: ServiceStore[];
  scope: DiscoveryScope;
  elsewhere: number;
}

export async function fetchServiceStores(opts: {
  city?: string;
  q?: string;
  classCode?: string;
  lat?: number | null;
  lng?: number | null;
} = {}): Promise<ServiceStoreList> {
  if (!IS_LIVE) return { items: [], scope: { label: null, level: "all" }, elsewhere: 0 };
  const params = new URLSearchParams();
  // Send BOTH. The backend prefers the §19.10 district the coordinates
  // resolve to; the city is what it falls back to when they resolve to
  // nothing (a fix outside India's cell coverage). Sending coordinates alone
  // would widen an off-grid customer's search to the entire country.
  if (opts.lat != null && opts.lng != null) {
    params.set("lat", String(opts.lat));
    params.set("lng", String(opts.lng));
  }
  if (opts.city?.trim()) params.set("city", opts.city.trim());
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.classCode) params.set("class", opts.classCode);
  const qs = params.toString();
  const body = await request<{ items: WireStore[]; scope: DiscoveryScope; elsewhere: number }>(
    `/services/stores${qs ? `?${qs}` : ""}`,
  );
  return {
    items: body.items.map(toStore),
    scope: body.scope ?? { label: null, level: "all" },
    elsewhere: body.elsewhere ?? 0,
  };
}

export async function fetchServiceStore(id: string): Promise<ServiceStoreDetail | null> {
  if (!IS_LIVE) return null;
  try {
    const body = await request<{ store: WireStore; sections: WireSection[] }>(
      `/services/stores/${encodeURIComponent(id)}`,
    );
    return {
      store: toStore(body.store),
      sections: (body.sections ?? []).map((s) => ({
        groupCode: s.group_code,
        groupName: s.group_name,
        items: s.items.map(toOffering),
      })),
    };
  } catch {
    return null;
  }
}

// Errors propagate — a failed booking must say why, never fail silently.
export async function createBooking(req: BookingRequest): Promise<Booking> {
  if (!IS_LIVE) throw new Error("Booking needs a live connection.");
  const body = await request<WireBooking>("/services/bookings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      offering_id: req.offeringId,
      slot_start: req.slotStart,
      customer_name: req.customerName,
      customer_phone: req.customerPhone,
      address: req.address ?? null,
      note: req.note ?? null,
    }),
  });
  return toBooking(body);
}

export async function fetchMyBookings(phone: string): Promise<Booking[]> {
  if (!IS_LIVE || !phone.trim()) return [];
  const body = await request<{ items: WireBooking[] }>(
    `/services/bookings?phone=${encodeURIComponent(phone.trim())}`,
  );
  return body.items.map(toBooking);
}

export async function cancelBooking(id: string, phone: string): Promise<void> {
  if (!IS_LIVE) throw new Error("Cancelling needs a live connection.");
  await request<{ id: string; status: string }>(
    `/services/bookings/${encodeURIComponent(id)}/cancel?phone=${encodeURIComponent(phone.trim())}`,
    { method: "POST" },
  );
}
