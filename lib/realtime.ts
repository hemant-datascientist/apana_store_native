// ============================================================
// realtime — live order updates over the backend WebSocket (/api/ws).
//
// subscribeLive(cb) returns an unsubscribe function. One shared socket is open
// while at least one screen is listening. A message means "something changed
// for you" — the listener refreshes from the API, which stays the source of
// truth. The screens keep their timed refresh as a fallback, so a dropped
// socket only costs the old wait, never correctness.
//
// Same module, kept in step, in the seller app: lib/realtime.ts.
// ============================================================

import { AppState } from "react-native";
import { getAuthToken } from "../services/api/client";
import { effectiveOrigin } from "./backendOverride";

export interface LiveMessage {
  type: string;          // "order.placed" | "order.status_changed" | "hello" | …
  order_id?: string;
  status?: string;
}
type Listener = (m: LiveMessage) => void;

const listeners = new Set<Listener>();
let ws: WebSocket | null = null;
let retryMs = 2000;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let pingTimer: ReturnType<typeof setInterval> | null = null;
const MAX_RETRY_MS = 30_000;
const PING_MS = 25_000; // keeps tunnels and proxies from closing an idle socket

// The login token never goes in the socket URL (URLs end up in tunnel and proxy
// logs). It is traded, as a normal header, for a one-use ticket that dies in 30 s.
async function fetchTicket(origin: string, token: string): Promise<string | null> {
  try {
    const r = await fetch(`${origin}/api/ws/ticket`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) return null;
    const body = (await r.json()) as { ticket?: string };
    return typeof body.ticket === "string" ? body.ticket : null;
  } catch {
    return null; // offline: the reconnect loop tries again
  }
}

let connecting = false;
async function connect(): Promise<void> {
  if (ws || connecting || listeners.size === 0) return;
  connecting = true;
  try {
    const token = await getAuthToken();
    const origin = effectiveOrigin();
    if (!token || !origin) return; // signed out or no backend: nothing to do
    const ticket = await fetchTicket(origin, token);
    if (!ticket) { scheduleReconnect(); return; }
    if (ws || listeners.size === 0) return; // another call won, or everyone left, while we waited
    open(`${origin.replace(/^http/, "ws")}/api/ws?ticket=${encodeURIComponent(ticket)}`);
  } finally {
    connecting = false;
  }
}

function open(url: string): void {
  const sock = new WebSocket(url);
  ws = sock;
  sock.onopen = () => {
    retryMs = 2000;
    pingTimer = setInterval(() => { try { sock.send(JSON.stringify({ type: "ping" })); } catch { /* closing */ } }, PING_MS);
  };
  sock.onmessage = (e) => {
    let m: LiveMessage;
    try { m = JSON.parse(String(e.data)) as LiveMessage; } catch { return; }
    if (m.type === "pong" || m.type === "hello") return;
    for (const l of listeners) { try { l(m); } catch { /* one listener must not break the rest */ } }
  };
  sock.onclose = () => {
    if (pingTimer) clearInterval(pingTimer);
    pingTimer = null;
    if (ws === sock) ws = null;
    scheduleReconnect();
  };
  sock.onerror = () => { /* onclose follows and reconnects */ };
}

function scheduleReconnect(): void {
  if (retryTimer || listeners.size === 0) return;
  retryTimer = setTimeout(() => { retryTimer = null; void connect(); }, retryMs);
  retryMs = Math.min(retryMs * 2, MAX_RETRY_MS);
}

function disconnect(): void {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
  const s = ws;
  ws = null;
  try { s?.close(); } catch { /* already closed */ }
}

// Back in the foreground: a socket the OS closed while the app slept comes back at once.
AppState.addEventListener("change", (state) => {
  if (state === "active" && listeners.size > 0 && !ws) { retryMs = 2000; void connect(); }
});

export function subscribeLive(listener: Listener): () => void {
  listeners.add(listener);
  void connect();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) disconnect();
  };
}
