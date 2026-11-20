// ============================================================
// NOTIFICATIONS — the shape of one item in the customer's inbox.
// The feed itself is real: GET /customer/notifications (hooks/useCustomerNotifications).
// ============================================================

// ── Notification item ─────────────────────────────────────────
export type NotifType = "order" | "promo" | "store" | "delivery" | "system";

export interface NotifItem {
  id:    string;
  type:  NotifType;
  icon:  string;   // Ionicons glyph
  color: string;   // Icon color
  bg:    string;   // Icon background color
  title: string;
  body:  string;
  time:  string;   // Human-readable relative time
  read:  boolean;
  target?: import("../lib/notifTarget").NotifTarget; // where a tap goes
}
