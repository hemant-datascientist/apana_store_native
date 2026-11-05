// The shop's free-delivery term on a basket (backend 0162, modules/orders/src/deliveryTerms.ts).
//
// A deliberate MIRROR of the server rule: the cart must switch to "free delivery" as the customer
// edits quantities, with no request per tap. A small basket is still delivered and paid for. The server stays the authority -
// checkout refuses and charges by the same rule - so a drift here shows a wrong preview, never a wrong
// charge. Money is compared in paise to match the server.

import type { StoreFees } from "../services/checkoutService";

const paise = (rupees: number): number => Math.round(rupees * 100);

/** `charged` = what the shop charges for goods (₹, deals applied). Returns the fees the customer sees. */
export function applyDeliveryTerms(f: StoreFees, charged: number): StoreFees {
  // Unpriced delivery: nothing to waive.
  if (f.delivery == null) return f;
  const free = f.freeAbove == null ? null : paise(f.freeAbove);
  if (free == null || paise(charged) < free) return f;
  const dGst = f.deliveryGst ?? 0;
  // note: null - "delivery costs more" is no reason to give on a delivery the shop is paying for.
  return { ...f, free: true, note: null, delivery: 0, gst: f.gst == null ? f.gst : Math.max(0, Math.round((f.gst - dGst) * 100) / 100) };
}
