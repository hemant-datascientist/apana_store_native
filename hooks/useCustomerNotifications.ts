// ============================================================
// useCustomerNotifications — the shopper's real bell.
//
// Both customer notification screens rendered MOCK_NOTIFICATIONS. The endpoint
// existed but was a stub returning `{ items: [] }`; §13 Phase 2 dispatch now
// writes real order events and the route serves them.
//
// ⚠ THE PHONE MUST BE PERCENT-ENCODED. A literal "+" in a query string decodes
// to a SPACE server-side, the lookup misses, and the inbox reads empty — which
// looks exactly like dispatch being broken. It cost a false failure in the
// backend smoke; encodeURIComponent is not optional here.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { NotifItem, NotifType } from "../data/notificationsData";
import { playSound } from "../lib/sound";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";
const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api/customer`;

const POLL_MS = 30_000;

interface Wire {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

// Backend event → display category + its icon set. Unknown becomes "system"
// rather than being dropped: an uncategorised notification is still one the
// customer should see.
const DISPLAY: Record<string, { type: NotifType; icon: string; color: string; bg: string }> = {
  order_accepted:  { type: "order",    icon: "checkmark-circle-outline", color: "#3B82F6", bg: "#DBEAFE" },
  order_ready:     { type: "order",    icon: "cube-outline",             color: "#3B82F6", bg: "#DBEAFE" },
  order_picked_up: { type: "delivery", icon: "bicycle-outline",          color: "#8B5CF6", bg: "#EDE9FE" },
  order_delivered: { type: "delivery", icon: "home-outline",             color: "#22C55E", bg: "#DCFCE7" },
  order_rejected:  { type: "order",    icon: "close-circle-outline",     color: "#EF4444", bg: "#FEE2E2" },
  order_cancelled: { type: "order",    icon: "close-circle-outline",     color: "#EF4444", bg: "#FEE2E2" },
};

function relative(iso: string): string {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return "Just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export interface CustomerNotificationsState {
  items: NotifItem[];
  unread: number;
  loading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  reload: () => Promise<void>;
}

export function useCustomerNotifications(): CustomerNotificationsState {
  const { user } = useAuth();
  const phone = user?.phone ?? "";
  const [items, setItems] = useState<NotifItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  // Last unread count observed from the server, so the poll can tell "my
  // order just moved" from "the same 2 updates are still unread".
  //
  // null until the first successful load: opening the app to 3 unread
  // updates that arrived while it was closed must be silent. The sound
  // means "this just happened".
  const prevUnread = useRef<number | null>(null);

  const q = `customer_id=${encodeURIComponent(phone)}`;

  const reload = useCallback(async () => {
    if (!IS_LIVE || !phone) {
      setItems([]);
      setUnread(0);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/notifications?${q}`);
      if (!res.ok) throw new Error(String(res.status));
      const body = (await res.json()) as { items: Wire[]; unread: number };
      setItems(
        body.items.map((n) => {
          const d = DISPLAY[n.type] ?? { type: "system" as NotifType, icon: "notifications-outline", color: "#6B7280", bg: "#F3F4F6" };
          return {
            id: n.id,
            type: d.type,
            icon: d.icon,
            color: d.color,
            bg: d.bg,
            title: n.title,
            body: n.body,
            time: relative(n.created_at),
            read: n.read,
          };
        }),
      );
      // Once per poll, not once per notification — two updates landing in
      // the same 30s window is one chime, not two overlapping ones.
      if (prevUnread.current !== null && body.unread > prevUnread.current) {
        playSound("status");
      }
      prevUnread.current = body.unread;
      setUnread(body.unread);
    } catch {
      // Empty, never the bundled feed. No connection means no notifications to
      // show, not somebody else's.
      //
      // prevUnread is deliberately NOT reset: a dropped poll is not
      // "everything became zero". Resetting would make the next good poll
      // look like every still-unread update had just arrived and chime for
      // all of them.
      setItems([]);
      setUnread(0);
    } finally {
      setLoading(false);
    }
  }, [phone, q]);

  useEffect(() => {
    void reload();
    const id = setInterval(() => void reload(), POLL_MS);
    return () => clearInterval(id);
  }, [reload]);

  // Both handlers move prevUnread in step with the optimistic drop, because
  // it tracks "what the shopper last knew the count to be". If it only
  // followed server polls: 2 unread, they read one (badge 1, prevUnread
  // still 2), a new update arrives making the server say 2 again, 2 > 2 is
  // false, and a real update chimes for nobody.
  const markRead = useCallback(async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((u) => Math.max(0, u - 1));
    if (prevUnread.current !== null) {
      prevUnread.current = Math.max(0, prevUnread.current - 1);
    }
    try { await fetch(`${BASE_URL}/notifications/${id}/read?${q}`, { method: "POST" }); }
    catch { void reload(); }
  }, [q, reload]);

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    if (prevUnread.current !== null) prevUnread.current = 0;
    try { await fetch(`${BASE_URL}/notifications/read-all?${q}`, { method: "POST" }); }
    catch { void reload(); }
  }, [q, reload]);

  return { items, unread, loading, markRead, markAllRead, reload };
}
