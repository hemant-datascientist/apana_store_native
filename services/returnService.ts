// ============================================================
// RETURNS — goods back from a delivered order (backend returns.ts, 0159).
//
//   GET  /customer/orders/:id/return   can it be returned, until when, its lines
//   POST /customer/orders/:id/return   { items:[{order_item_id, qty}], reason }
//
// The shop decides once the goods are back; the refund follows how the
// customer paid (cash from the shop for COD, the gateway for online).
// ============================================================

import { API_BASE_URL } from "./api/client";

const TIMEOUT_MS = 12_000;

export interface ReturnLine {
  order_item_id: string;
  name: string;
  qty: number;
  measure_kind: "count" | "weight" | "volume" | "piece";
  line_total_cents: number;
}

export interface OrderReturn {
  id: string;
  status: "requested" | "accepted" | "rejected";
  items: { order_item_id: string; qty: number }[];
  refund_cents: number | null;
  refund_done: boolean;
  note: string | null;
}

export interface ReturnInfo {
  eligible: boolean;
  why_not: string | null;
  return_days: number;
  until: string | null;
  payment_mode: string;
  lines: ReturnLine[];
  return: OrderReturn | null;
}

async function call<T>(path: string, customerId: string, init?: RequestInit): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${path}?customer_id=${encodeURIComponent(customerId)}`, {
      ...init, signal: ctl.signal, headers: { "Content-Type": "application/json" },
    });
    const body = await res.json().catch(() => ({}));
    // The server's sentence ("return between 1 and 3") is the useful part.
    if (!res.ok) throw new Error((body as { message?: string }).message ?? `request failed (${res.status})`);
    return body as T;
  } finally {
    clearTimeout(timer);
  }
}

export const fetchReturnInfo = (orderId: string, customerId: string) =>
  call<ReturnInfo>(`${orderId}/return`, customerId);

export const requestReturn = (orderId: string, customerId: string, items: { order_item_id: string; qty: number }[], reason: string) =>
  call<OrderReturn>(`${orderId}/return`, customerId, { method: "POST", body: JSON.stringify({ items, reason: reason.trim() || undefined }) });
