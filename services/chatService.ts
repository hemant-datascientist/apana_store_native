// ============================================================
// ORDER CHAT — this customer and this shop, about one order.
//
//   GET  {BASE}/orders/:id/messages?customer_id=
//   POST {BASE}/orders/:id/messages?customer_id=   { body }
//
// The seller half shipped first, so a shopkeeper could ask "500 g instead of
// 1 kg?" and the customer had no screen to answer on. The shop was messaging
// into silence.
//
// 🔴 THE customer_id IS NOT OPTIONAL AND IS NOT DECORATION. The server scopes
// every read by the caller's own identity — an order id is not a secret, and a
// thread fetched by id alone would hand a stranger somebody's conversation
// about their own delivery, address included. Without it the request is
// refused as order_not_found, which is the correct answer, not a bug.
//
// ⚠ NO PUSH EXISTS IN THIS SYSTEM. A message cannot ring the other phone; it
// lands in the inbox their app polls. Nothing here should suggest otherwise.
// ============================================================

import { API_BASE_URL } from "./api/client";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
/** Mock mode has no orders to converse about, so there is nothing to fetch. */
export const CHAT_IS_LIVE = API_MODE === "local" || API_MODE === "prod";

const TIMEOUT_MS = 12_000;

export interface ChatMessage {
  id: string;
  sender: "seller" | "customer";
  body: string;
  created_at: string;
  /** Null while the shop has not opened it. */
  read_at: string | null;
  /** True when this reader wrote it — the screen renders sides, not names. */
  mine: boolean;
}

export interface ChatThread {
  order_id: string;
  invoice_display: string;
  messages: ChatMessage[];
}

async function call(path: string, init?: RequestInit): Promise<Response> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${API_BASE_URL}${path}`, { ...init, signal: ctl.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Read the thread. Throws on anything but a 200 — the screen must be able to
 * tell "no messages" from "could not reach the server", because a blank
 * conversation invites the customer to repeat themselves to somebody who
 * already answered.
 */
export async function fetchThread(orderId: string, customerId: string): Promise<ChatThread> {
  const res = await call(
    `/orders/${encodeURIComponent(orderId)}/messages?customer_id=${encodeURIComponent(customerId)}`,
  );
  if (!res.ok) throw new Error(`thread ${res.status}`);
  const w = (await res.json()) as ChatThread;
  return { ...w, messages: w.messages ?? [] };
}

/** Send one. Throws if it did not land, so the caller can put the draft back. */
export async function sendMessage(
  orderId: string,
  customerId: string,
  body: string,
): Promise<ChatMessage> {
  const res = await call(
    `/orders/${encodeURIComponent(orderId)}/messages?customer_id=${encodeURIComponent(customerId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    },
  );
  if (!res.ok) throw new Error(`send ${res.status}`);
  return (await res.json()) as ChatMessage;
}
