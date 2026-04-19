// ============================================================
// SHARED LIST DATA — Apana Store
//
// Collaborative Tasking: User A creates a shopping list and
// assigns it to User B. B sees the list, checks off items
// while shopping, and A can track progress in real time.
//
// Data shapes:
//   Contact      — a person in the user's contact list
//   ShoppingItem — single item on the list (name, qty, checked)
//   SharedList   — a complete list with assignee + items
//
// Backend: POST /lists, PUT /lists/:id/items/:itemId, GET /lists
// ============================================================

export interface Contact {
  id:       string;
  name:     string;
  phone:    string;
  initials: string;
  color:    string;
}

export interface ShoppingItem {
  id:        string;
  name:      string;
  qty:       string;        // "2 kg" | "3 pcs" | "1 bottle"
  storeHint?: string;       // "Sharma General Store" | "Any store"
  checked:   boolean;
  addedBy:   string;        // display name of who added the item
}

export type ListStatus = "active" | "completed" | "pending";

export interface SharedList {
  id:            string;
  name:          string;
  createdByMe:   boolean;   // true = I sent it, false = someone sent it to me
  contact:       Contact;   // who I shared with / who shared with me
  items:         ShoppingItem[];
  createdAt:     string;    // relative time string for mock
  status:        ListStatus;
  locationHint?: string;    // mock live location text
}

// ── Mock contacts ─────────────────────────────────────────
export const MOCK_CONTACTS: Contact[] = [
  { id: "c1", name: "Rahul Singh",   phone: "+91 98765 43210", initials: "RS", color: "#3B82F6" },
  { id: "c2", name: "Priya Patel",   phone: "+91 87654 32109", initials: "PP", color: "#8B5CF6" },
  { id: "c3", name: "Mom",           phone: "+91 76543 21098", initials: "M",  color: "#EC4899" },
  { id: "c4", name: "Amit Kumar",    phone: "+91 65432 10987", initials: "AK", color: "#059669" },
  { id: "c5", name: "Sneha Sharma",  phone: "+91 54321 09876", initials: "SS", color: "#F97316" },
];

// ── Mock shared lists ─────────────────────────────────────
export const MOCK_SHARED_LISTS: SharedList[] = [
  {
    id:          "sl1",
    name:        "Weekly Groceries",
    createdByMe: true,
    contact:     MOCK_CONTACTS[0],
    createdAt:   "2 hours ago",
    status:      "active",
    locationHint: "Rahul is near Sharma General Store",
    items: [
      { id: "i1",  name: "Aashirvaad Atta",    qty: "5 kg",    storeHint: "Sharma Store",   checked: true,  addedBy: "You"   },
      { id: "i2",  name: "Amul Butter",         qty: "2 pcs",   storeHint: "Sharma Store",   checked: true,  addedBy: "You"   },
      { id: "i3",  name: "Tata Salt",           qty: "1 kg",    storeHint: "Any store",      checked: true,  addedBy: "You"   },
      { id: "i4",  name: "Surf Excel Detergent",qty: "1 pack",  storeHint: "Sharma Store",   checked: false, addedBy: "You"   },
      { id: "i5",  name: "Colgate Toothpaste",  qty: "2 pcs",   storeHint: "Any store",      checked: false, addedBy: "You"   },
      { id: "i6",  name: "Basmati Rice",        qty: "2 kg",    storeHint: "Sharma Store",   checked: false, addedBy: "Rahul" },
    ],
  },
  {
    id:          "sl2",
    name:        "Party Supplies",
    createdByMe: true,
    contact:     MOCK_CONTACTS[1],
    createdAt:   "Yesterday",
    status:      "active",
    locationHint: undefined,
    items: [
      { id: "i7",  name: "Paper Plates",       qty: "2 packs", storeHint: "Any store",      checked: false, addedBy: "You"   },
      { id: "i8",  name: "Balloons",            qty: "50 pcs",  storeHint: "Any store",      checked: false, addedBy: "You"   },
      { id: "i9",  name: "Pepsi 2L",           qty: "4 bottles",storeHint: "Sharma Store",  checked: false, addedBy: "You"   },
      { id: "i10", name: "Lay's Chips",         qty: "5 packs", storeHint: "Any store",      checked: false, addedBy: "Priya" },
      { id: "i11", name: "Birthday Candles",    qty: "1 pack",  storeHint: "Any store",      checked: false, addedBy: "You"   },
      { id: "i12", name: "Cake",                qty: "1 kg",    storeHint: "Fresh Bakes",    checked: false, addedBy: "Priya" },
      { id: "i13", name: "Disposable Cups",     qty: "2 packs", storeHint: "Any store",      checked: false, addedBy: "You"   },
      { id: "i14", name: "Napkins",             qty: "3 packs", storeHint: "Any store",      checked: false, addedBy: "You"   },
    ],
  },
  {
    id:          "sl3",
    name:        "Medicine Run",
    createdByMe: false,
    contact:     MOCK_CONTACTS[2],
    createdAt:   "30 min ago",
    status:      "active",
    locationHint: "You are near Gupta Medical Store",
    items: [
      { id: "i15", name: "Crocin 500mg",       qty: "2 strips", storeHint: "Gupta Medical",  checked: true,  addedBy: "Mom"   },
      { id: "i16", name: "Vicks VapoRub",       qty: "1 bottle", storeHint: "Gupta Medical",  checked: false, addedBy: "Mom"   },
      { id: "i17", name: "Dettol Antiseptic",   qty: "1 bottle", storeHint: "Gupta Medical",  checked: false, addedBy: "Mom"   },
      { id: "i18", name: "Vitamin C Tablets",   qty: "1 pack",   storeHint: "Any pharmacy",   checked: false, addedBy: "Mom"   },
    ],
  },
  {
    id:          "sl4",
    name:        "Diwali Shopping",
    createdByMe: true,
    contact:     MOCK_CONTACTS[3],
    createdAt:   "3 days ago",
    status:      "completed",
    locationHint: undefined,
    items: [
      { id: "i19", name: "Diyas (clay lamps)",  qty: "20 pcs",  storeHint: "Any store",      checked: true,  addedBy: "You"   },
      { id: "i20", name: "Rangoli Colors",       qty: "1 set",   storeHint: "Any store",      checked: true,  addedBy: "You"   },
      { id: "i21", name: "Kaju Katli",           qty: "500g",    storeHint: "Fresh Bakes",    checked: true,  addedBy: "You"   },
      { id: "i22", name: "Puja Thali",           qty: "1 pc",    storeHint: "Any store",      checked: true,  addedBy: "Amit"  },
      { id: "i23", name: "Fairy Lights",         qty: "2 rolls", storeHint: "TechZone",       checked: true,  addedBy: "You"   },
    ],
  },
];

// ── Status display config ────────────────────────────────
export const STATUS_CONFIG: Record<ListStatus, { label: string; color: string; bg: string }> = {
  active:    { label: "Active",    color: "#0F4C81", bg: "#EFF6FF" },
  completed: { label: "Completed", color: "#16A34A", bg: "#F0FDF4" },
  pending:   { label: "Pending",   color: "#D97706", bg: "#FEF3C7" },
};
