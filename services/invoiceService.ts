// ============================================================
// INVOICE SERVICE — Apana Store (Customer App)
//
// Typed request/response interfaces for invoice fetching,
// plus a stub function that simulates the backend API.
//
// To wire the real backend: replace the stub body inside
// fetchInvoice() with a fetch() call — no component changes needed.
//
// Endpoints:
//   GET /api/orders/invoice?storeOrderId=<id>  → Invoice
//   GET /api/orders/invoice?orderId=<id>        → Invoice  (delivery/ride)
// ============================================================

import {
  Invoice,
  getInvoiceByStoreId,
  getInvoiceByOrderId,
} from "../data/invoiceData";

// Re-export Invoice so importers only need this service file
export type { Invoice };

// ── Request params ────────────────────────────────────────
// storeId is the most reliable key for the mock — always pass it
// when available so the correct store name appears on the invoice.
export interface FetchInvoiceParams {
  storeId?:      string;   // "s1"–"s5" — preferred (correct store name guaranteed)
  storeOrderId?: string;   // per-store sub-order ID (pickup)
  orderId?:      string;   // master order (delivery / ride fallback)
}

// ── fetchInvoice ──────────────────────────────────────────
// GET /api/orders/invoice
//
// Lookup priority (mock):
//   1. storeId      → getInvoiceByStoreId()   (always correct store name)
//   2. storeOrderId → getInvoiceByOrderId()   (legacy / order-history)
//   3. orderId      → getInvoiceByOrderId()   (delivery/ride master ID)
//
// Real backend call: uncomment the fetch block below and remove the stub.
/**
 * The receipt for a REAL order, from GET /customer/orders/:id/invoice.
 *
 * The screen previously rendered a bundled sample: "Sharma General Store",
 * order ids "APX-MOCK", invented line items, a cashier called RAHUL — and
 * GSTIN 27ABCDE1234F1Z5 with an FSSAI number, under a heading reading
 * TAX INVOICE.
 *
 * A wrong statistic misleads. A fabricated GSTIN on a document headed TAX
 * INVOICE, issued in a real shop's name for a real payment, is a forged tax
 * document. The backend returns none, and the fields below are left EMPTY
 * rather than filled with something plausible.
 */
const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";
const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api/customer`;

export async function fetchInvoice(params: FetchInvoiceParams): Promise<Invoice> {
  if (!params.storeId && !params.storeOrderId && !params.orderId) {
    throw new Error("No order ID provided to fetchInvoice");
  }

  // Mock mode keeps the bundled sample so FE-only work still has something to
  // lay out. It is never mixed with a real order.
  if (!IS_LIVE) {
    await new Promise(r => setTimeout(r, 600));
    if (params.storeId) return getInvoiceByStoreId(params.storeId);
    return getInvoiceByOrderId(params.storeOrderId ?? params.orderId ?? "");
  }

  const id = params.orderId ?? params.storeOrderId ?? "";
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(id)}/invoice`);
  if (!res.ok) throw new Error(`Could not load this receipt (${res.status}).`);
  const r = (await res.json()) as WireReceipt;

  const rupees = (c: number) => c / 100;
  const items = r.items.map((i, n) => ({
    id:         `${n}`,
    name:       i.name,
    qty:        i.qty,
    mrp:        rupees(i.unit_price_cents),
    rate:       rupees(i.unit_price_cents),
    amount:     rupees(i.line_total_cents),
    // 0, and the UI hides the column: no tax rate is stored against any
    // product, so any split of the total would be arithmetic on a guess.
    gstPercent: 0,
  }));
  const isUpi = r.payment_mode !== "cod";
  const total = rupees(r.total_cents);

  return {
    storeId:        "",
    storeOrderId:   r.invoice_display,
    masterOrderId:  r.invoice_display,
    storeName:      r.store_name ?? "Store",
    storeLogo:      "storefront-outline",
    storeLogoColor: "#166534",
    // EMPTY, not invented. No seller row holds a registered address, GSTIN or
    // FSSAI licence, and putting a plausible one on a document a customer may
    // keep gives a real shop a false legal identity.
    storeAddress:   "",
    storeCity:      r.store_city ?? "",
    storeState:     "",
    storePincode:   "",
    gstNo:          "",
    fssaiNo:        "",
    customerCare:   "",
    billNo:         r.invoice_display,
    cashierName:    "",
    paymentStatus:  r.payment_status,
    isTaxInvoice:   r.is_tax_invoice,
    placedAt:       r.placed_at,
    counter:        "",
    items,
    totalUniqueItems: items.length,
    totalQty:       items.reduce((t, i) => t + i.qty, 0),
    amountInMRP:    rupees(r.subtotal_cents),
    otherCharges:   rupees(r.delivery_fee_cents),
    netAmount:      total,
    payment: {
      billAmount:   total,
      cashReceived: r.payment_mode === "cod" ? total : 0,
      cashReturn:   0,
      cardAmount:   0,
      upiAmount:    isUpi ? total : 0,
    },
    // No MRP is captured separately from the charged price, so there is no
    // saving to claim. 0 rather than an invented discount.
    savedAmount:    0,
    savedPercent:   0,
    // No tax rate exists against any product. An empty breakup and zeroed
    // CGST/SGST are the honest rendering; a split would be invented tax.
    gstBreakup:     [],
    netTaxableValue: 0,
    netCGST:        0,
    netSGST:        0,
    netCSEE:        0,
    thankYouNote:   "Thank you for shopping with Apana.",
  };
}

interface WireReceipt {
  invoice_display: string;
  placed_at: string;
  store_name: string | null;
  store_city: string | null;
  items: Array<{ name: string; qty: number; unit_price_cents: number; line_total_cents: number }>;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  payment_mode: string;
  payment_status: string;
  is_tax_invoice: boolean;
}

