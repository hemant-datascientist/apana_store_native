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

// ── Order placement ───────────────────────────────────────────

// One item within a single store's sub-order
export interface OrderItemInput {
  itemId:    string;
  name:      string;
  qty:       number;
  unitPrice: number;   // ₹ per unit at time of order (snapshot)
}

// One store's complete sub-order
export interface StoreOrderInput {
  storeId: string;
  items:   OrderItemInput[];
}

// Full POST /api/orders request body
export interface PlaceOrderRequest {
  mode:            FulfillmentMode;
  addressId:       string | null;    // null for pickup — no delivery address
  paymentMethodId: string;
  storeOrders:     StoreOrderInput[];
  promoCode:       string | null;
  note:            string;
}

// Success response from POST /api/orders
export interface PlaceOrderResponse {
  success:       boolean;
  orderId:       string;            // e.g. "APX-20250419-7X3K"  — always server-generated
  estimatedTime: number;            // minutes until pickup-ready / delivery
  paymentStatus: "pending" | "authorized" | "captured";
  message:       string;
}

// ── Promo / coupon code ───────────────────────────────────────

export interface PromoValidateRequest {
  code:     string;
  subtotal: number;
  mode:     FulfillmentMode;
}

export interface PromoValidateResponse {
  valid:       boolean;
  discountAmt: number;
  message:     string;   // shown verbatim below the input
}

// ── Service stubs ─────────────────────────────────────────────
// Swap the stub body with a real fetch() when backend is live.
// Type signatures stay the same — no component rewrites needed.

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

  await new Promise(r => setTimeout(r, 1200));   // simulate ~1.2 s network round-trip
  return {
    success:       true,
    orderId:       `APX-${Date.now()}`,
    estimatedTime: req.mode === "pickup" ? 15 : req.mode === "ride" ? 10 : 35,
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
