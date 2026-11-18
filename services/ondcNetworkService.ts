// ============================================================
// ONDC NETWORK SHOPS — shops on other ONDC seller apps, near the customer.
//
//   POST {BASE}/ondc/search      { lat, lng, pincode?, query? } -> { transaction_id }
//   GET  {BASE}/ondc/search/:txn -> { shops, answers, open }
//
// Apana sends one search to the ONDC network; seller apps answer over the next
// ~30 seconds, so the screen polls. This is a SEPARATE stream from Apana's own
// shops on purpose: the home feed never waits on the network.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./api/client";

const TIMEOUT_MS = 12_000;

export interface NetworkItem {
  id: string;
  name: string;
  price_paise: number;
  mrp_paise: number | null;
  image: string | null;
  category: string | null;
  in_stock: boolean;
}

export interface NetworkShop {
  bpp_id: string;
  provider_id: string;
  name: string;
  logo: string | null;
  distance_m: number | null;
  items: NetworkItem[];
}

export interface NetworkResults {
  shops: NetworkShop[];
  answers: number;
  /** Seller apps may still be answering. */
  open: boolean;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await AsyncStorage.getItem("apana_access_token");
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: ctl.signal,
    });
    const body = (await res.json().catch(() => null)) as (T & { message?: string }) | null;
    if (!res.ok) throw new Error(body?.message ?? `The network search failed (HTTP ${res.status}).`);
    return body as T;
  } finally {
    clearTimeout(timer);
  }
}

export function startNetworkSearch(input: { lat: number; lng: number; pincode?: string; query?: string }) {
  return call<{ transaction_id: string; expires_in: number }>("/ondc/search", { method: "POST", body: JSON.stringify(input) });
}

export function networkResults(txn: string) {
  return call<NetworkResults>(`/ondc/search/${encodeURIComponent(txn)}`);
}

// ── Phase 2: ordering from one network shop ─────────────────
// The app sends ids and quantities only. The server takes the shop's address,
// names and prices from its own stored search results.

export type NetworkOrderStatus = "selecting" | "quoted" | "initializing" | "initialized" | "confirming" | "confirmed" | "cancelling" | "cancelled" | "failed";

export interface NetworkOrder {
  id: string;
  status: NetworkOrderStatus;
  error: string | null;
  shop_name: string;
  bpp_id: string;
  items: Array<{ id: string; qty: number; name: string; price_paise: number }>;
  total_paise: number | null;
  /** The seller app's own bill lines (items, delivery, packing, tax), exactly as sent. */
  breakup: Array<{ title: string | null; type: string | null; paise: number | null }>;
  paid: boolean;
  ondc_order_id: string | null;
  ondc_state: string | null;
  /** The shop's own delivery state, e.g. "Agent-assigned", "Out-for-delivery", "Order-delivered". */
  fulfillment_state: string | null;
  cancel_reason_id: string | null;
  cancelled_by: "buyer" | "seller" | "apana" | null;
  /** Set once the order is cancelled: what Apana owes back and whether it has been paid. */
  refund: { due_paise: number; note: string | null; refunded_at: string | null } | null;
}

export function startNetworkOrder(input: {
  search_txn: string; bpp_id: string; provider_id: string; items: Array<{ id: string; qty: number }>;
  lat: number; lng: number; pincode?: string;
}) {
  return call<NetworkOrder>("/ondc/orders", { method: "POST", body: JSON.stringify(input) });
}

export function getNetworkOrder(id: string) {
  return call<NetworkOrder>(`/ondc/orders/${encodeURIComponent(id)}`);
}

export function initNetworkOrder(id: string, addressId: string) {
  return call<NetworkOrder>(`/ondc/orders/${encodeURIComponent(id)}/init`, { method: "POST", body: JSON.stringify({ address_id: addressId }) });
}

export function payNetworkOrder(id: string) {
  return call<{ provider_order_id: string; public_key: string; amount_paise: number; is_live: boolean }>(
    `/ondc/orders/${encodeURIComponent(id)}/pay`, { method: "POST" },
  );
}

export function confirmNetworkOrder(id: string, paid: { provider_order_id: string; provider_payment_id: string; signature: string }) {
  return call<NetworkOrder>(`/ondc/orders/${encodeURIComponent(id)}/confirm`, { method: "POST", body: JSON.stringify(paid) });
}

// ── Phase 3: after the sale ─────────────────────────────────

export function listNetworkOrders() {
  return call<{ items: NetworkOrder[] }>("/ondc/orders");
}

export function cancelReasons() {
  return call<{ items: Array<{ id: string; label: string }> }>("/ondc/cancel-reasons");
}

export function cancelNetworkOrder(id: string, reasonId: string) {
  return call<NetworkOrder>(`/ondc/orders/${encodeURIComponent(id)}/cancel`, { method: "POST", body: JSON.stringify({ reason_id: reasonId }) });
}

/** Ask the shop's app for the latest; its answer arrives a moment later (poll getNetworkOrder). */
export function refreshNetworkOrder(id: string) {
  return call<NetworkOrder>(`/ondc/orders/${encodeURIComponent(id)}/status`, { method: "POST" });
}
