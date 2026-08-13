// ============================================================
// TRACKING SERVICE — the customer's live view of their partner.
//
//   GET {BASE}/orders/:orderId/tracking
//     → { status, partner:{lat,lng,ts}|null, trail:[{lat,lng,ts}], destination }
// (delivery module getOrderTracking — real partner_locations fix + trail,
//  honest-empty when unassigned / no fix / delivered, §19.8.)
//
// Same mode gate as the rest of the live surface: real fetch in local/prod,
// null in mock (there is no bundled partner to track — the point is that it's
// real). Errors propagate to the caller, which keeps the last known fix rather
// than snapping the marker away on a blip.
// ============================================================

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api/customer`;

const FETCH_TIMEOUT_MS = 8_000;

export const TRACKING_IS_LIVE = IS_LIVE;

export interface TrackPoint {
  lat: number;
  lng: number;
  ts: string;
}

export interface OrderTracking {
  orderId: string;
  status: string;
  partnerId: string | null;
  /** Rider's first name once assigned. No phone: there is no call-masking
   *  layer, and the rider's personal number must not go to every customer. */
  partnerName: string | null;
  /** The rider's real number, and only while they are carrying the order. */
  partnerPhone: string | null;
  /** Routed window, or null when it cannot be computed. Never a constant. */
  eta: { min_minutes: number; max_minutes: number } | null;
  partner: TrackPoint | null;
  trail: TrackPoint[];
  destination: { lat: number; lng: number } | null;
}

interface WireTracking {
  order_id: string;
  status: string;
  partner_id: string | null;
  partner_name: string | null;
  partner_phone: string | null;
  eta: { min_minutes: number; max_minutes: number } | null;
  partner: TrackPoint | null;
  trail: TrackPoint[];
  destination: { lat: number; lng: number } | null;
}

// null in mock mode (no real partner) or on error — the caller decides how to
// degrade (keep last fix / show finding-a-partner), never invents a position.
export async function fetchOrderTracking(orderId: string): Promise<OrderTracking | null> {
  if (!IS_LIVE) return null;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}/tracking`, {
      signal: ctl.signal,
    });
    if (!res.ok) return null;
    const w = (await res.json()) as WireTracking;
    return {
      orderId: w.order_id,
      status: w.status,
      partnerId: w.partner_id,
    partnerName: w.partner_name ?? null,
    partnerPhone: w.partner_phone ?? null,
    eta: w.eta ?? null,
      partner: w.partner,
      trail: w.trail ?? [],
      destination: w.destination,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
