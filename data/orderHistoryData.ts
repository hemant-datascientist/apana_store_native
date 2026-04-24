// ============================================================
// ORDER HISTORY DATA — Apana Store (Customer App)
//
// Mock orders for the Order History screen.
// Backend: GET /customer/orders?status=all|active|delivered|cancelled
//          GET /customer/orders/:id   → full order detail
//          POST /customer/orders/:id/reorder
// ============================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "picked_up"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  name:  string;
  qty:   number;
  price: number;   // per-unit price in ₹
}

export type OrderMode = "pickup" | "delivery" | "ride";

export interface Order {
  id:              string;
  orderNo:         string;
  storeId:         string;   // canonical store ID (s1–s5) for tracking + invoice
  storeName:       string;
  storeCategory:   string;
  storeIcon:       string;   // Ionicons glyph
  mode:            OrderMode; // fulfillment mode — drives tracking screen layout
  date:            string;   // display string e.g. "18 Apr 2026, 2:45 PM"
  items:           OrderItem[];
  itemCount:       number;   // pre-computed for display
  total:           number;   // in ₹
  status:          OrderStatus;
  deliveryAddress: string;   // one-line summary
  paymentMethod:   string;   // display string
}

// ── Status meta (label + theme key) ──────────────────────────

export interface StatusMeta {
  label:     string;
  colorKey:  "success" | "primary" | "warning" | "danger" | "subText";
  icon:      string;  // Ionicons glyph
}

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending:    { label: "Pending",      colorKey: "warning",  icon: "time-outline"            },
  confirmed:  { label: "Confirmed",    colorKey: "primary",  icon: "checkmark-circle-outline" },
  preparing:  { label: "Preparing",    colorKey: "primary",  icon: "restaurant-outline"      },
  picked_up:  { label: "On the way",   colorKey: "primary",  icon: "bicycle-outline"         },
  delivered:  { label: "Delivered",    colorKey: "success",  icon: "bag-check-outline"       },
  cancelled:  { label: "Cancelled",    colorKey: "danger",   icon: "close-circle-outline"    },
};

// ── Filter tabs ───────────────────────────────────────────────

export type OrderFilter = "all" | "active" | "delivered" | "cancelled";

export interface FilterTab {
  key:   OrderFilter;
  label: string;
}

export const ORDER_FILTER_TABS: FilterTab[] = [
  { key: "all",       label: "All"       },
  { key: "active",    label: "Active"    },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export const ACTIVE_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "picked_up"];

// ── Mock data ─────────────────────────────────────────────────

export const MOCK_ORDERS: Order[] = [
  {
    id:              "ord_001",
    orderNo:         "#AS-2026-0041",
    storeId:         "s1",
    storeName:       "Sharma General Store",
    storeCategory:   "Grocery",
    storeIcon:       "basket-outline",
    mode:            "delivery",
    date:            "18 Apr 2026, 2:45 PM",
    items: [
      { name: "Tata Salt 1 kg",      qty: 2, price: 22  },
      { name: "Amul Butter 500 g",   qty: 1, price: 280 },
      { name: "Parle-G Biscuits",    qty: 3, price: 10  },
    ],
    itemCount:       3,
    total:           354,
    status:          "picked_up",
    deliveryAddress: "Home — 12, Shivajinagar, Pune",
    paymentMethod:   "UPI (GPay)",
  },
  {
    id:              "ord_002",
    orderNo:         "#AS-2026-0038",
    storeId:         "s2",
    storeName:       "TechZone Electronics",
    storeCategory:   "Electronics",
    storeIcon:       "headset-outline",
    mode:            "pickup",
    date:            "16 Apr 2026, 11:10 AM",
    items: [
      { name: "boAt BassHeads 100", qty: 1, price: 499 },
    ],
    itemCount:       1,
    total:           499,
    status:          "delivered",
    deliveryAddress: "Home — 12, Shivajinagar, Pune",
    paymentMethod:   "Card •••• 4321",
  },
  {
    id:              "ord_003",
    orderNo:         "#AS-2026-0035",
    storeId:         "s5",
    storeName:       "Fresh Bakes",
    storeCategory:   "Food & Drink",
    storeIcon:       "restaurant-outline",
    mode:            "delivery",
    date:            "14 Apr 2026, 8:30 AM",
    items: [
      { name: "Pav Bhaji (2 plate)", qty: 1, price: 180 },
      { name: "Cold Coffee",         qty: 2, price: 80  },
    ],
    itemCount:       2,
    total:           340,
    status:          "delivered",
    deliveryAddress: "Office — Baner Road, Pune",
    paymentMethod:   "Cash on Delivery",
  },
  {
    id:              "ord_004",
    orderNo:         "#AS-2026-0031",
    storeId:         "s3",
    storeName:       "Gupta Medical",
    storeCategory:   "Pharmacy",
    storeIcon:       "medkit-outline",
    mode:            "delivery",
    date:            "11 Apr 2026, 5:15 PM",
    items: [
      { name: "Crocin Advance 10s",  qty: 2, price: 35  },
      { name: "Volini Spray 75 g",   qty: 1, price: 175 },
    ],
    itemCount:       2,
    total:           245,
    status:          "delivered",
    deliveryAddress: "Home — 12, Shivajinagar, Pune",
    paymentMethod:   "UPI (PhonePe)",
  },
  {
    id:              "ord_005",
    orderNo:         "#AS-2026-0028",
    storeId:         "s4",
    storeName:       "Style Hub",
    storeCategory:   "Fashion",
    storeIcon:       "shirt-outline",
    mode:            "delivery",
    date:            "9 Apr 2026, 3:00 PM",
    items: [
      { name: "Casual Linen Shirt (M)", qty: 1, price: 899 },
    ],
    itemCount:       1,
    total:           899,
    status:          "cancelled",
    deliveryAddress: "Home — 12, Shivajinagar, Pune",
    paymentMethod:   "Card •••• 4321",
  },
  {
    id:              "ord_006",
    orderNo:         "#AS-2026-0022",
    storeId:         "s1",
    storeName:       "Sharma General Store",
    storeCategory:   "Grocery",
    storeIcon:       "basket-outline",
    mode:            "pickup",
    date:            "4 Apr 2026, 10:00 AM",
    items: [
      { name: "Surf Excel 1 kg",  qty: 1, price: 195 },
      { name: "Vim Bar 200 g",    qty: 2, price: 30  },
      { name: "Lizol 500 ml",     qty: 1, price: 165 },
    ],
    itemCount:       3,
    total:           420,
    status:          "delivered",
    deliveryAddress: "Home — 12, Shivajinagar, Pune",
    paymentMethod:   "UPI (GPay)",
  },
];
