// ============================================================
// useCartFees — per-store fees from the server, never a local constant.
//
// One request per fulfillment group: one checkout is one basket, and a
// delivery basket is ONE rider on ONE trip — the server splits a single trip
// fee across its shops (each shop still pays its own ₹5). `ready` stays false
// until every group has answered; a failed or unpriceable store reports
// delivery = null, shown as "—" rather than a guessed number (§19.8).
// ============================================================

import { useEffect, useMemo, useState } from "react";

/** How often, and how many times, to ask again while an ONDC partner is quoting (≈30 s). */
const OUTSIDE_POLL_MS = 4000;
const OUTSIDE_POLL_MAX = 8;
import type { CartStore } from "../data/cartData";
import { fetchBasketFees, type StoreFees } from "../services/checkoutService";
import { storeCharged } from "../lib/discount";
import { applyDeliveryTerms } from "../lib/deliveryTerms";

type Pin = { lat: number; lng: number; pincode?: string } | null;

export function useCartFees(stores: CartStore[], pin: Pin) {
  // Fees depend on which products (→ which shop), the mode and the drop pin —
  // not on quantity, so a +/- tap does not refetch.
  const key = JSON.stringify([
    stores.map((s) => [s.id, s.fulfillment, s.items.map((i) => i.productId ?? "").sort()]),
    pin ? [pin.lat.toFixed(5), pin.lng.toFixed(5), pin.pincode ?? ""] : null,
  ]);
  const [fees, setFees] = useState<Record<string, StoreFees>>({});
  const [ready, setReady] = useState(false);
  // Bumped to ask again while an ONDC delivery partner's quote is still on its way.
  const [round, setRound] = useState(0);
  useEffect(() => { setRound(0); }, [key]);

  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // A re-ask for a partner quote keeps what is shown; only a new basket blanks it.
    if (round === 0) setReady(false);
    const groups = new Map<CartStore["fulfillment"], CartStore[]>();
    for (const s of stores) groups.set(s.fulfillment, [...(groups.get(s.fulfillment) ?? []), s]);
    const unpriced = (list: CartStore[]) =>
      Object.fromEntries(list.map((s) => [s.id, { delivery: null, platform: 0 } as StoreFees]));
    Promise.all(
      [...groups.entries()].map(async ([mode, list]) => {
        const ids = list.flatMap((s) => s.items.map((i) => i.productId)).filter((x): x is string => !!x);
        if (ids.length === 0) return unpriced(list);
        try {
          return { ...unpriced(list), ...(await fetchBasketFees(ids, mode, pin)) };
        } catch {
          return unpriced(list);
        }
      }),
    ).then((parts) => {
      if (!live) return;
      const next: Record<string, StoreFees> = Object.assign({}, ...parts);
      setFees(next);
      setReady(true);
      // Providers answer within ~30 s: ask again a few times, then stop (the cart says "pickup").
      if (round < OUTSIDE_POLL_MAX && Object.values(next).some((f) => f.outside?.status === "pending")) {
        timer = setTimeout(() => { if (live) setRound((r) => r + 1); }, OUTSIDE_POLL_MS);
      }
    });
    return () => { live = false; if (timer) clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, round]);

  return useMemo(() => {
    // The shop's own delivery terms (0162) on this basket: a minimum order for delivery (becomes the
    // same "delivery refused" message checkout already shows) and a delivery the shop pays for.
    const termed: Record<string, StoreFees> = {};
    for (const s of stores) {
      const f = fees[s.id];
      // An ONDC partner's price is the customer's to pay (founder): the shop's free-delivery
      // term covers Apana's own fee only — the server applies the same rule.
      if (f) termed[s.id] = s.fulfillment === "pickup" || f.outside?.status === "ready" ? f : applyDeliveryTerms(f, storeCharged(s));
    }
    const list = stores.map((s) => termed[s.id]);
    const known = ready && list.every((f) => f && f.delivery != null);
    return {
      ready,
      feeOf: (storeId: string): StoreFees | undefined => termed[storeId],
      /** null until every store is priced. */
      deliveryTotal: known ? list.reduce((t, f) => t + (f!.delivery ?? 0), 0) : null,
      platformTotal: list.reduce((t, f) => t + (f?.platform ?? 0), 0),
      /** GST on Apana's delivery + platform fee; null until every store is priced. */
      gstTotal: known ? Math.round(list.reduce((t, f) => t + (f!.gst ?? 0), 0) * 100) / 100 : null,
      /** Why delivery costs more than usual right now; null = normal. */
      deliveryNote: list.find((f) => f?.note)?.note ?? null,
    };
  }, [stores, fees, ready]);
}
