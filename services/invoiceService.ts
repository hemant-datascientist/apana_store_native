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
  storeId?:       string;   // "s1"–"s5" — preferred (correct store name guaranteed)
  storeOrderId?:  string;   // per-store sub-order ID (pickup) — DISPLAY only, live mode
  orderId?:       string;   // master order (delivery / ride fallback) — DISPLAY only, live mode
  // The real backend row id — live mode fetches by primary key, and neither
  // storeOrderId nor orderId above is one (both are the §17 display invoice).
  serverOrderId?: string;
  // The signed-in phone. The receipt endpoint is scoped to its own customer
  // (modules/orders/src/routes.ts resolveCustomerId) — without this, a live
  // fetch is refused before it ever reaches the order.
  customerId?:    string;
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

  // The backend looks this up by primary key — serverOrderId is the only one
  // of these that is one. orderId/storeOrderId are kept as a defensive
  // fallback rather than a throw: every real caller now sends serverOrderId.
  const id = params.serverOrderId ?? params.orderId ?? params.storeOrderId ?? "";
  const qs = params.customerId ? `?customer_id=${encodeURIComponent(params.customerId)}` : "";
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(id)}/invoice${qs}`);
  if (!res.ok) throw new Error(`Could not load this receipt (${res.status}).`);
  const r = (await res.json()) as WireReceipt;

  const rupees = (c: number) => c / 100;
  const items = r.items.map((i, n) => ({
    id:         `${n}`,
    name:       i.name,
    hsn:        i.hsn ?? null,
    qty:        i.qty,
    mrp:        rupees(i.unit_price_cents),
    rate:       rupees(i.unit_price_cents),
    amount:     rupees(i.line_total_cents),
    // 🔴 The rate this line was CHARGED at (0090), frozen at sale. A shop
    // correcting a product's rate next month must not rewrite what this
    // invoice says was collected.
    //
    // ⚠ 0 here means BOTH "zero-rated" and "the shop never declared a rate",
    // because the column this feeds is a number. The distinction is kept where
    // it matters — the slab table below excludes undeclared lines rather than
    // showing them at 0%.
    gstPercent: i.gst_rate_bp != null ? i.gst_rate_bp / 100 : 0,
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
    // 🔴 COMPUTED ON THE SERVER (0090), rendered here. The arithmetic lives
    // once in @apana/shared; a copy in this app would be a third place for the
    // customer's copy and the shop's books to disagree about tax.
    //
    // ⚠ Empty when the shop may not legally show tax, or has declared no rates
    // — an empty table, never invented zeros.
    gstBreakup: (r.gst_slabs ?? []).map((g) => ({
      gstPercent:   g.rate_bp / 100,
      taxableValue: rupees(g.taxable_cents),
      cgst:         rupees(g.cgst_cents),
      sgst:         rupees(g.sgst_cents),
      // No cess is charged or recorded anywhere in Apana. 0 is the true
      // amount, not a placeholder for one that exists and is unknown.
      csee:         0,
      netAmt:       rupees(g.net_cents),
    })),
    netTaxableValue: (r.gst_slabs ?? []).reduce((a, g) => a + rupees(g.taxable_cents), 0),
    netCGST:        (r.gst_slabs ?? []).reduce((a, g) => a + rupees(g.cgst_cents), 0),
    netSGST:        (r.gst_slabs ?? []).reduce((a, g) => a + rupees(g.sgst_cents), 0),
    netCSEE:        0,
    thankYouNote:   "Thank you for shopping with Apana.",
  };
}

interface WireReceipt {
  invoice_display: string;
  placed_at: string;
  store_name: string | null;
  store_city: string | null;
  items: Array<{
    name: string;
    /**
     * HSN as PRINTED on this line (0086) — the snapshot, not the product's
     * current code, so a shop correcting a typo never rewrites an invoice
     * already issued.
     *
     * ⚠ Null is normal and shows nothing: most kiranas are below the GST
     * threshold and issue receipts, where an HSN would imply a tax invoice.
     */
    hsn: string | null;
    /**
     * GST rate CHARGED on this line, in basis points (0090). 500 = 5%.
     *
     * ⚠ Null means the shop declared no rate — which is NOT the same as 0%.
     * Such a line is left out of `gst_slabs` rather than summarised as
     * zero-rated, a status the shop would be asserting.
     */
    gst_rate_bp: number | null;
    qty: number;
    unit_price_cents: number;
    line_total_cents: number;
  }>;
  /**
   * The per-slab tax summary, already computed by the server. Empty for a shop
   * that may not show tax or has declared no rates.
   */
  gst_slabs?: {
    rate_bp: number;
    taxable_cents: number;
    cgst_cents: number;
    sgst_cents: number;
    net_cents: number;
  }[];
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  payment_mode: string;
  payment_status: string;
  is_tax_invoice: boolean;
}

