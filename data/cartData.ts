// ============================================================
// CART DATA — Apana Store (Customer App)
//
// Multi-store cart mock data.
// Replace with global cart state manager (Zustand / Context)
// and POST /cart endpoints when backend is ready.
// ============================================================

export type FulfillmentMode = "pickup" | "delivery" | "ride";

export interface CartItem {
  id:    string;
  name:  string;
  unit:  string;     // display unit e.g. "1 kg", "500 ml"
  price: number;     // per unit in ₹
  qty:   number;
  icon:  string;     // Ionicons glyph
  bg:    string;     // placeholder image bg
}

export interface CartStore {
  id:          string;
  name:        string;
  type:        string;
  typeColor:   string;
  typeBg:      string;
  fulfillment: FulfillmentMode;
  items:       CartItem[];
}

export const INITIAL_CART: CartStore[] = [
  {
    id:        "cs1",
    name:      "Laxmi Vegetable Mart",
    type:      "Grocery",
    typeColor: "#026451",
    typeBg:    "#DCFCE7",
    fulfillment: "pickup",
    items: [
      { id:"i1", name:"Fresh Potatoes",   unit:"1 kg",   price: 35,  qty:2, icon:"earth-outline",       bg:"#FEF3C7" },
      { id:"i2", name:"Tomatoes",         unit:"500 g",  price: 22,  qty:1, icon:"radio-button-on",     bg:"#FEE2E2" },
      { id:"i3", name:"Onions",           unit:"1 kg",   price: 28,  qty:1, icon:"ellipse-outline",     bg:"#FCE7F3" },
    ],
  },
  {
    id:        "cs2",
    name:      "Apollo Pharmacy",
    type:      "Pharmacy",
    typeColor: "#1D4746",
    typeBg:    "#CCFBF1",
    fulfillment: "delivery",
    items: [
      { id:"i4", name:"Dettol Handwash",  unit:"250 ml", price: 89,  qty:1, icon:"water-outline",       bg:"#DBEAFE" },
      { id:"i5", name:"Vitamin C Tablets",unit:"60 tabs",price:145,  qty:1, icon:"fitness-outline",     bg:"#DCFCE7" },
    ],
  },
  {
    id:        "cs3",
    name:      "Meridian Ice Cream",
    type:      "Ice Cream",
    typeColor: "#803E96",
    typeBg:    "#F3E8FF",
    fulfillment: "pickup",
    items: [
      { id:"i6", name:"Vanilla Cone",     unit:"1 piece",price: 40,  qty:2, icon:"ice-cream-outline",   bg:"#FCE7F3" },
    ],
  },
];

// Promo codes
export const PROMO_CODES: Record<string, { label: string; discount: number }> = {
  APANA10:  { label: "10% off on all items",     discount: 0.10 },
  FIRST50:  { label: "Flat ₹50 off (first order)",discount: 0    }, // fixed handled separately
  SAVE20:   { label: "20% off on orders > ₹300", discount: 0.20 },
};

// Delivery fee per fulfillment mode
export const DELIVERY_FEE: Record<FulfillmentMode, number> = {
  pickup:   0,
  delivery: 25,
  ride:     35,
};

// ── Fulfillment display config (used by cart + checkout) ──────
export const FULFILLMENT_CONFIG: Record<FulfillmentMode, {
  label: string; icon: string; color: string; bg: string;
}> = {
  pickup:   { label: "Pickup",   icon: "walk-outline",    color: "#026451", bg: "#DCFCE7" },
  delivery: { label: "Delivery", icon: "bicycle-outline", color: "#1D4ED8", bg: "#DBEAFE" },
  ride:     { label: "Ride",     icon: "car-outline",     color: "#7C3AED", bg: "#EDE9FE" },
};

// ── Helper: subtotal for a single store ───────────────────────
export function storeSubtotal(store: CartStore): number {
  return store.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
