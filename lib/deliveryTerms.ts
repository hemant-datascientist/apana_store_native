// The shop's delivery terms on a basket (backend 0162, modules/orders/src/deliveryTerms.ts).
//
// A deliberate MIRROR of the server rule: the cart must say "add Rs 190 more" and "free delivery"
// while the customer edits quantities, with no request per tap. The server stays the authority -
// checkout refuses and charges by the same rule - so a drift here shows a wrong preview, never a wrong
// charge. Money is compared in paise to match the server.

import type { StoreFees } from "../services/checkoutService";

const paise = (rupees: number): number => Math.round(rupees * 100);

/** `charged` = what the shop charges for goods (₹, deals applied). Returns the fees the customer sees. */
export function applyDeliveryTerms(f: StoreFees, charged: number, shopName: string): StoreFees {
  // Unpriced delivery: nothing to waive, and the minimum cannot be judged against a missing fee.
  if (f.delivery == null) return f;
  const basket = paise(charged);
  const min = f.minDelivery == null ? null : paise(f.minDelivery);
  if (min != null && basket < min) {
    const add = Math.ceil((min - basket) / 100);
    return { ...f, block: f.block ?? `${shopName} delivers orders of ₹${Math.ceil(min / 100)} or more. Add ₹${add} more, or choose pickup.` };
  }
  const free = f.freeAbove == null ? null : paise(f.freeAbove);
  if (free == null || basket < free) return f;
  const dGst = f.deliveryGst ?? 0;
  return { ...f, free: true, delivery: 0, gst: f.gst == null ? f.gst : Math.max(0, Math.round((f.gst - dGst) * 100) / 100) };
}
