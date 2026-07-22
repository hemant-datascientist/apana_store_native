// ============================================================
// CHECKOUT SERVICE — Apana Store (Customer App)
//
// All typed request/response interfaces for the checkout flow,
// plus stub functions that simulate the backend API.
//
// To wire the real backend: replace the stub body inside each
// function with a fetch() call — no component changes needed.
//
// Endpoints:
//   POST /api/orders              → PlaceOrderResponse
//   POST /api/promo/validate      → PromoValidateResponse
// ============================================================

import { FulfillmentMode } from "../data/cartData";

// ── Order item (one line on a store's sub-order) ──────────
export interface OrderItemInput {
  itemId:    string;
  // seller_products.id — what the backend actually orders against. Absent for
  // a legacy/mock row, which checkout now refuses rather than silently drops.
  productId?: string;
  // §23 seller_product_variants.id — which SKU.
  variantId?: string | null;
  name:      string;
  qty:       number;
  unitPrice: number;   // ₹ per unit at time of order (price snapshot)
}

// ── One store's complete sub-order in the request ─────────
export interface StoreOrderInput {
  storeId:   string;
  storeName: string;
  items:     OrderItemInput[];
}

// ── Per-store result returned by the backend ──────────────
// Each store gets its own scannable order ID.
// The partner / store staff app scans storeOrderId, not the master orderId.
export interface StoreOrderResult {
  storeOrderId:  string;   // unique per store, e.g. "APX-20260419-S1-4821"
  storeId:       string;
  storeName:     string;
  storeType:     string;
  storeTypeColor:string;
  storeTypeBg:   string;
  subtotal:      number;   // this store's items total (₹)
  estimatedMins: number;   // mins until order is ready at this store
}

// ── Full POST /api/orders request body ────────────────────
export interface PlaceOrderRequest {
  mode:            FulfillmentMode;
  addressId:       string | null;    // null for pickup
  paymentMethodId: string;
  storeOrders:     StoreOrderInput[];
  promoCode:       string | null;
  note:            string;
  // The signed-in phone. §13 checkout keys orders on it (there is no customer
  // FK yet), so without it an order could never be found again.
  customerId?:     string | null;
}

// ── POST /api/orders success response ────────────────────
// orderId     = master order (groups all stores, shown on receipts)
// storeOrders = one entry per store — each has its own QR + invoice
export interface PlaceOrderResponse {
  success:       boolean;
  orderId:       string;             // e.g. "APX-20260419-7X3K" — always server-generated
  storeOrders:   StoreOrderResult[]; // one per store — used for per-store QR codes + invoices
  estimatedTime: number;             // overall ETA in minutes (max across stores)
  paymentStatus: "pending" | "authorized" | "captured";
  message:       string;
}

// ── Promo / coupon code ───────────────────────────────────
export interface PromoValidateRequest {
  code:     string;
  subtotal: number;
  mode:     FulfillmentMode;
}

export interface PromoValidateResponse {
  valid:       boolean;
  discountAmt: number;
  message:     string;
}

// ── Live §13 checkout ─────────────────────────────────────
// POST {BASE}/orders/checkout — modules/orders/src/service.ts.
// One request, N orders back: the backend splits a multi-store basket into one
// order per seller, because each seller fulfils and is paid independently.
// There is no "master order" server-side, so the id shown to the customer is
// the first order's §17 invoice rather than an invented wrapper id.

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `http://${TOWER_IP}:8000/api/customer`;

const CHECKOUT_TIMEOUT_MS = 20_000;

// The cart's three modes collapse to the backend's fulfillment enum. "ride"
// and "delivery" are both instant fulfilment; they differ in who carries it,
// which is a delivery-module concern, not an order-state one.
const FULFILLMENT: Record<FulfillmentMode, "instant" | "scheduled" | "pickup"> = {
  pickup: "pickup",
  delivery: "instant",
  ride: "instant",
};

interface WireOrderItem {
  product_id: string;
  variant_id: string | null;
  name: string;
  qty: number;
  unit_price_cents: number;
  line_total_cents: number;
}
interface WireOrder {
  id: string;
  invoice_display: string;
  seller_id: string;
  seller_name: string | null;
  status: string;
  subtotal_cents: number;
  total_cents: number;
  payment_status: string;
  fulfillment: string;
  items: WireOrderItem[];
}

export async function placeOrder(
  req: PlaceOrderRequest,
): Promise<PlaceOrderResponse> {
  if (!IS_LIVE) {
    throw new Error("Ordering needs a live connection.");
  }

  const customerId = (req.customerId ?? "").trim();
  if (!customerId) {
    throw new Error("Sign in before placing an order.");
  }

  // Flatten to the backend's shape. A row without a productId came from an
  // older cart and cannot be ordered — surfacing that beats posting a partial
  // basket and charging for less than the customer sees.
  const items: { product_id: string; variant_id: string | null; qty: number }[] = [];
  for (const store of req.storeOrders) {
    for (const item of store.items) {
      if (!item.productId) {
        throw new Error(
          `"${item.name}" is from an older cart and can no longer be ordered. Remove it and add it again.`,
        );
      }
      items.push({
        product_id: item.productId,
        variant_id: item.variantId ?? null,
        qty: item.qty,
      });
    }
  }
  if (items.length === 0) throw new Error("Your cart is empty.");

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), CHECKOUT_TIMEOUT_MS);
  let body: { orders: WireOrder[] };
  try {
    const res = await fetch(`${BASE_URL}/orders/checkout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: ctl.signal,
      body: JSON.stringify({
        customer_id: customerId,
        items,
        // V1 settles on collection/delivery; the payment module owns the rest.
        payment_mode: "cod",
        fulfillment: FULFILLMENT[req.mode],
        delivery_address: req.addressId ? { address_id: req.addressId } : null,
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      // The backend's message is the useful one — "Cotton Tee (L / Navy):
      // have 3, need 4" tells the customer exactly what to change.
      let message = `Order failed (${res.status})`;
      try {
        const err = JSON.parse(text) as { message?: string; error?: string };
        message = err.message ?? err.error ?? message;
      } catch {
        // non-JSON body — keep the status message
      }
      throw new Error(message);
    }
    body = JSON.parse(text) as { orders: WireOrder[] };
  } finally {
    clearTimeout(timer);
  }

  const orders = body.orders ?? [];
  if (orders.length === 0) throw new Error("The order did not come back. Please check your orders before retrying.");

  // Echo the cart's own store styling back — the backend has no colours, and
  // re-deriving them here would make the confirmation screen disagree with the
  // cart the customer just left.
  const styleBySeller = new Map(
    req.storeOrders.map((s) => [s.storeId, s]),
  );

  const storeOrders: StoreOrderResult[] = orders.map((o) => ({
    // The §17 invoice IS the scannable per-store id — no parallel scheme.
    storeOrderId: o.invoice_display,
    storeId: o.seller_id,
    storeName: o.seller_name ?? styleBySeller.get(o.seller_id)?.storeName ?? "Store",
    storeType: "Store",
    storeTypeColor: "#6B7280",
    storeTypeBg: "#F3F4F6",
    subtotal: o.subtotal_cents / 100,
    // No ETA engine yet — the delivery module owns it. 0 reads as "not known"
    // to the tracking screen instead of a fabricated number (§19.8).
    estimatedMins: 0,
  }));

  return {
    success: true,
    orderId: orders[0].invoice_display,
    storeOrders,
    estimatedTime: 0,
    paymentStatus: orders[0].payment_status === "paid" ? "captured" : "pending",
    message: "Order placed",
  };
}

// POST /api/promo/validate
export async function validatePromoCode(
  req: PromoValidateRequest,
): Promise<PromoValidateResponse> {
  // TODO: replace stub with real call ↓
  // const res = await fetch(`${API_BASE}/promo/validate`, { method: "POST", … });
  // return res.json();

  await new Promise(r => setTimeout(r, 600));
  const MOCK_CODES: Record<string, number> = { FIRST10: 50, APANA20: 80, SAVE30: 30 };
  const discount = MOCK_CODES[req.code.toUpperCase()] ?? 0;
  return discount > 0
    ? { valid: true,  discountAmt: discount, message: `₹${discount} off applied!` }
    : { valid: false, discountAmt: 0,        message: "Invalid or expired promo code" };
}
