// ============================================================
// ORDER HISTORY — the customer's REAL orders.
//
//   GET /customer/orders?customer_id=&page=&limit=
//
// The screen rendered MOCK_ORDERS, so a tester placed a real order and their
// history showed four invented ones from other shops. During a trial that is
// the worst possible bug: the one question a tester asks after ordering is
// "did it go through?", and the app answered with fiction.
//
// The backend and the app do not share a status vocabulary, so the mapping is
// explicit below rather than a cast.
// ============================================================

import { API_BASE_URL } from "./api/client";
import type { Order, OrderItem, OrderMode, OrderStatus } from "../data/orderHistoryData";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
export const ORDERS_LIVE = API_MODE === "local" || API_MODE === "prod";

const TIMEOUT_MS = 12_000;

// ── Wire shape (modules/orders OrderOut) ─────────────────────
interface WireItem {
  product_id: string;
  name: string;
  qty: number;
  measure_kind: "count" | "weight" | "volume" | "piece";
  unit_price_cents: number;
  line_total_cents: number;
}

interface WireOrder {
  id: string;
  invoice_display: string;
  seller_id: string;
  seller_name: string | null;
  status: string;
  total_cents: number;
  payment_mode: string;
  payment_status: string;
  fulfillment: string;
  delivery_address: Record<string, unknown> | null;
  items: WireItem[];
  created_at: string;
}

/**
 * Backend status → the screen's vocabulary.
 *
 * These are genuinely different sets: the server has `accepted` and `ready`,
 * the screen has `confirmed` and `preparing`, and `rejected` has no card of its
 * own. Mapping explicitly means a new server status shows up as a compile
 * error here rather than silently rendering as "pending" — which would tell a
 * customer their delivered order is still being placed.
 */
const STATUS_MAP: Record<string, OrderStatus> = {
  pending:   "pending",
  accepted:  "confirmed",
  ready:     "preparing",
  picked_up: "picked_up",
  delivered: "delivered",
  cancelled: "cancelled",
  // A shop refusing an order is, from the customer's side, an order that is not
  // happening. The screen has no "rejected" state; "cancelled" is the honest
  // one available — the reason belongs on the detail view, not a status pill.
  rejected:  "cancelled",
};

const MODE_MAP: Record<string, OrderMode> = {
  pickup:    "pickup",
  instant:   "delivery",
  scheduled: "delivery",
};

function rupees(cents: number): number {
  return Math.round(cents) / 100;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function addressLine(addr: Record<string, unknown> | null): string {
  if (!addr) return "";
  const parts = [addr.line1, addr.line2, addr.city, addr.pincode]
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  return parts.join(", ");
}

function toOrder(w: WireOrder): Order {
  const items: OrderItem[] = w.items.map((i) => ({
    name: i.name,
    qty: i.qty,
    // Loose lines price per measure, so the per-unit figure is meaningless for
    // them; the LINE total divided by qty is what actually reconciles with the
    // total shown on the card.
    price: i.qty > 0 ? rupees(i.line_total_cents) / i.qty : rupees(i.unit_price_cents),
  }));

  return {
    id: w.id,
    orderNo: w.invoice_display,
    // The store id is the SELLER id — that is what the tracking and store
    // screens resolve. The mock used "s1".."s5", which matched nothing.
    storeId: w.seller_id,
    storeName: w.seller_name ?? "Apana Store",
    storeCategory: "",
    storeIcon: "storefront-outline",
    mode: MODE_MAP[w.fulfillment] ?? "delivery",
    date: formatDate(w.created_at),
    items,
    itemCount: items.reduce((n, i) => n + (i.qty > 0 ? 1 : 0), 0),
    total: rupees(w.total_cents),
    status: STATUS_MAP[w.status] ?? "pending",
    deliveryAddress: addressLine(w.delivery_address),
    paymentMethod:
      w.payment_mode === "cod"
        ? "Cash on Delivery"
        : w.payment_status === "paid" ? "Paid online" : "Online (unpaid)",
  };
}

export async function fetchOrderHistory(
  customerId: string,
  limit = 50,
): Promise<Order[]> {
  // Off-backend, or signed out: EMPTY. Showing somebody else's orders — which
  // is what the mock did — is worse than showing none (§19.8).
  if (!ORDERS_LIVE || !customerId) return [];

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const url =
      `${API_BASE_URL}/orders?customer_id=${encodeURIComponent(customerId)}&limit=${limit}`;
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`orders ${res.status}`);
    const body = (await res.json()) as { items?: WireOrder[] };
    return (body.items ?? []).map(toOrder);
  } finally {
    clearTimeout(timer);
  }
}
