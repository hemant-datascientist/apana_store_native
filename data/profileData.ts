// ============================================================
// PROFILE DATA — Apana Store (Customer App)
//
// Static mock data for the Profile screen.
// Replace with GET /customer/profile when backend is ready.
// ============================================================

// ── User ──────────────────────────────────────────────────────
export interface UserProfile {
  name:   string;
  phone:  string;
  email:  string;
  avatar: string | null; // null → show initials
}

// MOCK_USER is DELETED. It was "Hemant Sharma" / "+91 98765 43210" /
// "hemant@apanastore.in" — the same person on every phone, which is exactly
// what stops several people testing as themselves. Real identity:
// hooks/useCustomerProfile (GET/PATCH /api/customer/me), with the phone from
// the verified OTP.

// ── Stats ─────────────────────────────────────────────────────
export interface ProfileStat {
  key:   string;
  label: string;
  value: string;
  icon:  string;
}

// PROFILE_STATS was a hardcoded "24 Orders · 7 Fav Stores · 12 Rides", shown
// to every customer including one who had just installed the app (§19.8).
//
// Orders and followed stores are both real and already reachable from the
// screen (fetchOrderHistory + useFollowedStores). Rides are GONE: there is no
// ride system at all, so the tile counted trips that could not have happened.
export function profileStats(orders: number, followedStores: number): ProfileStat[] {
  return [
    { key: "orders", label: "Orders",     value: String(orders),         icon: "bag-check-outline" },
    { key: "stores", label: "Fav Stores", value: String(followedStores), icon: "heart-outline"     },
  ];
}

// NOTE: the old FavouriteStore/FAVOURITE_STORES mock was removed — stores
// merged into the §30 follow relationship (lib/followStore + useFollowedStores).

// ── Partner (Delivery Boy / Rider) ────────────────────────────
export type PartnerType = "delivery" | "rider";

export interface AssignedPartner {
  type:    PartnerType;
  name:    string;
  phone:   string;
  vehicle: string;
  rating:  string;
  eta:     string; // e.g. "8 min"
  active:  boolean;
}

// A rider and a driver with names, phone numbers and ratings, "assigned" to
// every customer. Nobody is assigned a permanent partner — an order gets one
// when it is claimed — and the phone numbers belonged to nobody. Kept as types
// only; the screen no longer renders these cards.
const _UNUSED_MOCK_DELIVERY_BOY: AssignedPartner = {
  type:    "delivery",
  name:    "Ravi Kumar",
  phone:   "+91 91234 56789",
  vehicle: "Honda Activa • MH 12 AB 1234",
  rating:  "4.7",
  eta:     "12 min",
  active:  true,
};

const _UNUSED_MOCK_RIDER: AssignedPartner = {
  type:    "rider",
  name:    "Sunil Patil",
  phone:   "+91 93456 78901",
  vehicle: "Maruti Swift • MH 14 CD 5678",
  rating:  "4.9",
  eta:     "5 min",
  active:  false, // no active ride right now
};

// ── Settings ──────────────────────────────────────────────────
export interface SettingItem {
  key:   string;
  label: string;
  icon:  string;
  badge?: string; // optional badge (e.g. "New")
}

export interface SettingGroup {
  title: string;
  items: SettingItem[];
}

export const SETTING_GROUPS: SettingGroup[] = [
  {
    title: "Account",
    items: [
      { key: "edit_profile",  label: "Edit Profile",      icon: "person-outline"          },
      { key: "addresses",     label: "Saved Addresses",   icon: "location-outline"        },
      { key: "payments",      label: "Payment Methods",   icon: "card-outline"            },
      { key: "orders_hist",   label: "Order History",     icon: "receipt-outline"         },
    ],
  },
  {
    title: "Preferences",
    items: [
      { key: "coverage",      label: "Store Coverage",    icon: "navigate-circle-outline" },
      { key: "notifications", label: "Notifications",     icon: "notifications-outline"   },
      { key: "language",      label: "Language",          icon: "language-outline"        },
      { key: "appearance",    label: "Appearance",        icon: "color-palette-outline"   },
      { key: "connect",       label: "Connect to backend", icon: "qr-code-outline"        },
    ],
  },
  {
    title: "Support",
    items: [
      { key: "help",          label: "Help & Support",    icon: "help-circle-outline"     },
      { key: "rate",          label: "Rate the App",      icon: "star-outline",  badge: "⭐" },
      { key: "about",         label: "About Apana Store", icon: "information-circle-outline" },
    ],
  },
];
