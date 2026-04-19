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

// ── Helper: generate a deterministic per-store order ID ───
// Format: <masterOrderId>-<storeIndex> e.g. "APX-20260419-7X3K-S1"
// Backend will generate these server-side — this is only the mock.
function generateStoreOrderId(masterOrderId: string, index: number): string {
  return `${masterOrderId}-S${index + 1}`;
}

// ── Service stubs ─────────────────────────────────────────
// Replace each stub body with a real fetch() call when backend is live.
// Type signatures are frozen — no component rewrites needed.

// POST /api/orders
export async function placeOrder(
  req: PlaceOrderRequest,
): Promise<PlaceOrderResponse> {
  // TODO: replace stub with real call ↓
  // const res = await fetch(`${API_BASE}/orders`, {
  //   method:  "POST",
  //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  //   body:    JSON.stringify(req),
  // });
  // if (!res.ok) throw new Error((await res.json()).message ?? "Order failed");
  // return res.json();

  await new Promise(r => setTimeout(r, 1200));   // simulate ~1.2 s network latency

  const masterOrderId = `APX-${Date.now()}`;

  // ── Build per-store results (mock store metadata — real values come from backend) ──
  // The storeType / color / bg are echoed back from the server in the real API.
  const STORE_META: Record<string, { storeType: string; storeTypeColor: string; storeTypeBg: string }> = {
    s1: { storeType: "Grocery",     storeTypeColor: "#166534", storeTypeBg: "#DCFCE7" },
    s2: { storeType: "Electronics", storeTypeColor: "#1E3A5F", storeTypeBg: "#DBEAFE" },
    s3: { storeType: "Pharmacy",    storeTypeColor: "#0F5132", storeTypeBg: "#DCFCE7" },
    s4: { storeType: "Fashion",     storeTypeColor: "#6D28D9", storeTypeBg: "#EDE9FE" },
    s5: { storeType: "Food",        storeTypeColor: "#92400E", storeTypeBg: "#FEF3C7" },
  };

  const storeOrders: StoreOrderResult[] = req.storeOrders.map((s, i) => {
    const meta     = STORE_META[s.storeId] ?? { storeType: "Store", storeTypeColor: "#6B7280", storeTypeBg: "#F3F4F6" };
    const subtotal = s.items.reduce((acc, item) => acc + item.unitPrice * item.qty, 0);
    return {
      storeOrderId:   generateStoreOrderId(masterOrderId, i),
      storeId:        s.storeId,
      storeName:      s.storeName,
      storeType:      meta.storeType,
      storeTypeColor: meta.storeTypeColor,
      storeTypeBg:    meta.storeTypeBg,
      subtotal,
      estimatedMins:  req.mode === "pickup" ? 15 + i * 5 : req.mode === "ride" ? 10 : 35,
    };
  });

  const maxEta = storeOrders.reduce((max, s) => Math.max(max, s.estimatedMins), 0);

  return {
    success:       true,
    orderId:       masterOrderId,
    storeOrders,
    estimatedTime: maxEta,
    paymentStatus: req.mode === "delivery" ? "authorized" : "captured",
    message:       "Order placed successfully",
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
