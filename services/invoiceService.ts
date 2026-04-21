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
export async function fetchInvoice(params: FetchInvoiceParams): Promise<Invoice> {
  // TODO: replace stub with real call ↓
  // const qp  = params.storeOrderId
  //   ? `storeOrderId=${encodeURIComponent(params.storeOrderId)}`
  //   : `orderId=${encodeURIComponent(params.orderId ?? "")}`;
  // const res = await fetch(`${API_BASE}/orders/invoice?${qp}`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // if (!res.ok) {
  //   const err = await res.json().catch(() => ({}));
  //   throw new Error(err.message ?? `Invoice fetch failed (${res.status})`);
  // }
  // return res.json() as Promise<Invoice>;

  // ── Simulate ~600 ms network latency ─────────────────────
  await new Promise(r => setTimeout(r, 600));

  if (!params.storeId && !params.storeOrderId && !params.orderId) {
    throw new Error("No order ID provided to fetchInvoice");
  }

  // storeId is the fastest and most accurate path in mock mode
  if (params.storeId) return getInvoiceByStoreId(params.storeId);

  return getInvoiceByOrderId(params.storeOrderId ?? params.orderId ?? "");
}
