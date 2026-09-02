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
  handover_code: string | null;
  unread_messages: number | null;
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
    // The server sends this reader's own half only; for a customer read that
    // is the delivery code. Never the shop's pickup code.
    handoverCode: w.handover_code ?? undefined,
    // Null means the server did not count (a reader whose side it could not
    // determine); 0 means it counted and none are waiting. Both leave the
    // badge off, but only the second is a claim.
    unreadMessages: w.unread_messages ?? undefined,
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

// ============================================================
// REORDER — what that basket would cost to buy again.
//
// A shop that never answers has its order auto-cancelled after two minutes.
// Retyping the whole basket is that silence landing on the customer, which is
// why this exists at all.
//
// 🔴 THE SERVER REPORTS, IT DOES NOT PLACE. It answers with today's prices and
// what is still on the shelf; the app puts the available lines in the cart and
// the customer checks out as normal. Placing it outright would charge whatever
// the shelf now says and take stock nobody looked at.
// ============================================================

export interface ReorderLine {
  product_id: string;
  variant_id: string | null;
  name: string;
  qty: number;
  unit_price_cents: number | null;
  available: boolean;
  reason: "delisted" | "out_of_stock" | "not_enough_stock" | null;
  stock_qty: number | null;
}

export interface ReorderOut {
  seller_id: string;
  seller_name: string;
  store_is_open: boolean;
  store_closed_reason: string | null;
  lines: ReorderLine[];
  all_available: boolean;
}

export async function fetchReorder(
  orderId: string,
  customerId: string,
): Promise<ReorderOut> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const url = `${API_BASE_URL}/orders/${orderId}/reorder?customer_id=${encodeURIComponent(
      customerId,
    )}`;
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`reorder ${res.status}`);
    return (await res.json()) as ReorderOut;
  } finally {
    clearTimeout(timer);
  }
}

/** What to tell the customer about a line that cannot be bought. */
export function reorderLineReason(line: ReorderLine): string | null {
  switch (line.reason) {
    case "delisted":
      return "no longer sold";
    case "out_of_stock":
      return "out of stock";
    case "not_enough_stock":
      // The number matters: "only 2 left" is actionable, "not enough" is not.
      return line.stock_qty != null ? `only ${line.stock_qty} left` : "not enough stock";
    default:
      return null;
  }
}
