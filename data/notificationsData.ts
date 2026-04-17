// ============================================================
// NOTIFICATIONS DATA — Apana Store (Customer App)
//
// Toggle preferences and mock notification feed.
// Replace with real API responses when backend is ready.
//
// Backend:
//   GET /customer/notification-settings  → NotifToggle[] (with value)
//   GET /customer/notifications          → NotifItem[]
// ============================================================

// ── Notification toggle preference ────────────────────────────
export interface NotifToggle {
  key:   string;
  label: string;
  desc:  string;
  icon:  string;   // Ionicons glyph
  color: string;   // Accent color for the icon
}

export const NOTIF_TOGGLES: NotifToggle[] = [
  {
    key:   "orders",
    label: "Order Updates",
    desc:  "Placement confirmed, out for delivery, delivered",
    icon:  "bag-check-outline",
    color: "#0F4C81",
  },
  {
    key:   "delivery",
    label: "Delivery Tracking",
    desc:  "Real-time partner location and ETA updates",
    icon:  "bicycle-outline",
    color: "#1D4ED8",
  },
  {
    key:   "promo",
    label: "Offers & Promotions",
    desc:  "Flash deals, coupons and seasonal discounts",
    icon:  "pricetag-outline",
    color: "#D97706",
  },
  {
    key:   "stores",
    label: "New Stores Nearby",
    desc:  "Get notified when new stores open near you",
    icon:  "storefront-outline",
    color: "#16A34A",
  },
  {
    key:   "reminders",
    label: "Cart Reminders",
    desc:  "Reminder when you leave items in your cart",
    icon:  "cart-outline",
    color: "#7C3AED",
  },
];

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
}

// ── Mock notification feed ────────────────────────────────────
// Replace with GET /customer/notifications when backend is ready
export const MOCK_NOTIFICATIONS: NotifItem[] = [
  {
    id:    "n1",
    type:  "order",
    icon:  "bag-check-outline",
    color: "#0F4C81",
    bg:    "#EFF6FF",
    title: "Order Delivered!",
    body:  "Your order from Sharma General Store has been delivered. Rate your experience.",
    time:  "2 min ago",
    read:  false,
  },
  {
    id:    "n2",
    type:  "delivery",
    icon:  "bicycle-outline",
    color: "#1D4ED8",
    bg:    "#DBEAFE",
    title: "Out for Delivery",
    body:  "Ravi Kumar is on the way with your order. ETA 8 minutes.",
    time:  "18 min ago",
    read:  false,
  },
  {
    id:    "n3",
    type:  "promo",
    icon:  "pricetag-outline",
    color: "#D97706",
    bg:    "#FEF3C7",
    title: "Flash Deal — 40% Off Groceries",
    body:  "Today only! Use code FLASH40 at checkout on grocery orders above ₹200.",
    time:  "1 hr ago",
    read:  false,
  },
  {
    id:    "n4",
    type:  "store",
    icon:  "storefront-outline",
    color: "#16A34A",
    bg:    "#DCFCE7",
    title: "New Store Near You",
    body:  "Pune Fresh Mart just opened in Kothrud. Check out their opening deals!",
    time:  "3 hr ago",
    read:  true,
  },
  {
    id:    "n5",
    type:  "order",
    icon:  "receipt-outline",
    color: "#0F4C81",
    bg:    "#EFF6FF",
    title: "Order Confirmed — #APL20241",
    body:  "Your order from TechZone Electronics has been confirmed. Estimated delivery: 45 min.",
    time:  "Yesterday",
    read:  true,
  },
  {
    id:    "n6",
    type:  "promo",
    icon:  "gift-outline",
    color: "#7C3AED",
    bg:    "#EDE9FE",
    title: "Refer & Earn ₹100",
    body:  "Invite a friend to Apana Store and earn ₹100 in wallet credits when they place their first order.",
    time:  "2 days ago",
    read:  true,
  },
  {
    id:    "n7",
    type:  "system",
    icon:  "shield-checkmark-outline",
    color: "#16A34A",
    bg:    "#DCFCE7",
    title: "Account Verified",
    body:  "Your Apana Store account has been successfully verified. Happy shopping!",
    time:  "3 days ago",
    read:  true,
  },
];
