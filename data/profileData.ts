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

export const MOCK_USER: UserProfile = {
  name:   "Hemant Sharma",
  phone:  "+91 98765 43210",
  email:  "hemant@apanastore.in",
  avatar: null,
};

// ── Stats ─────────────────────────────────────────────────────
export interface ProfileStat {
  key:   string;
  label: string;
  value: string;
  icon:  string;
}

export const PROFILE_STATS: ProfileStat[] = [
  { key: "orders",  label: "Orders",      value: "24",  icon: "bag-check-outline"    },
  { key: "stores",  label: "Fav Stores",  value: "7",   icon: "heart-outline"        },
  { key: "rides",   label: "Rides",       value: "12",  icon: "car-outline"          },
];

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

export const MOCK_DELIVERY_BOY: AssignedPartner = {
  type:    "delivery",
  name:    "Ravi Kumar",
  phone:   "+91 91234 56789",
  vehicle: "Honda Activa • MH 12 AB 1234",
  rating:  "4.7",
  eta:     "12 min",
  active:  true,
};

export const MOCK_RIDER: AssignedPartner = {
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
      { key: "notifications", label: "Notifications",     icon: "notifications-outline"   },
      { key: "language",      label: "Language",          icon: "language-outline"        },
      { key: "appearance",    label: "Appearance",        icon: "color-palette-outline"   },
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
