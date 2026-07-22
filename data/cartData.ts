// ============================================================
// CART DATA — Apana Store (Customer App)
//
// Multi-store cart mock data.
// Replace with global cart state manager (Zustand / Context)
// and POST /cart endpoints when backend is ready.
// ============================================================

export type FulfillmentMode = "pickup" | "delivery" | "ride";

export interface CartItem {
  // Cart-row key. For a variant listing this is `${productId}::${variantId}`,
  // so two sizes of the same shirt are two rows the customer can count and
  // remove independently — keying on productId alone would merge them.
  id:    string;
  // ── Real backend identity (§13 checkout) ──────────────────
  // seller_products.id. Without it the cart cannot be ordered, only drawn.
  productId?: string;
  // §23 seller_product_variants.id — which SKU. null/absent for listings that
  // do not sell as variants. Checkout 422s a variant product without it, and
  // that is correct: shipping an arbitrary size is worse than an error.
  variantId?: string | null;
  // "L / Navy" — shown under the item name so the customer can see WHICH one
  // they added before they pay, not after it arrives.
  variantLabel?: string | null;
  // Stock available for this exact SKU, captured when added. Caps the qty
  // stepper so the customer is stopped at the shelf, not at checkout.
  maxQty?: number;
  // Resolved product image, when the listing has one (falls back to icon/bg).
  image?: string | null;

  name:  string;
  unit:  string;     // display unit e.g. "1 kg", "500 ml"
  price: number;     // everyday per-unit price in ₹ (≤ MRP)
  qty:   number;
  icon:  string;     // Ionicons glyph
  bg:    string;     // placeholder image bg
  // Stop-loss floor (the deal price unlocked at the store's threshold).
  // Seller-declared; absent = this item never discounts. Apana never
  // stores the seller's cost — only this floor (§ discount engine).
  floorPrice?: number;
  // Brand-FUNDED promo on this line (lib/brandPromo.ts). When set + active,
  // the funding brand covers the markdown — the seller still receives the
  // everyday price. Takes precedence over the stop-loss floor (don't stack).
  brandPromoId?: string;
}

export interface CartStore {
  id:          string;
  name:        string;
  type:        string;
  typeColor:   string;
  typeBg:      string;
  fulfillment: FulfillmentMode;
  items:       CartItem[];
  // Basket subtotal (at everyday prices) that unlocks floor pricing for
  // this store. Seller-set; absent = no basket deal.
  unlockThreshold?: number;
}

// The cart starts EMPTY and fills from real seller listings (§19.8 — no
// phantom items). It used to open pre-loaded with four fake stores of fake
// products, which made the screen demo well and made checkout impossible:
// none of those ids existed in seller_products, so nothing could be ordered.
export const INITIAL_CART: CartStore[] = [];

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
