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
import type { CartStore } from "../data/cartData";
import { fetchBasketFees, type StoreFees } from "../services/checkoutService";

type Pin = { lat: number; lng: number } | null;

export function useCartFees(stores: CartStore[], pin: Pin) {
  // Fees depend on which products (→ which shop), the mode and the drop pin —
  // not on quantity, so a +/- tap does not refetch.
  const key = JSON.stringify([
    stores.map((s) => [s.id, s.fulfillment, s.items.map((i) => i.productId ?? "").sort()]),
    pin ? [pin.lat.toFixed(5), pin.lng.toFixed(5)] : null,
  ]);
  const [fees, setFees] = useState<Record<string, StoreFees>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    setReady(false);
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
      setFees(Object.assign({}, ...parts));
      setReady(true);
    });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return useMemo(() => {
    const list = stores.map((s) => fees[s.id]);
    const known = ready && list.every((f) => f && f.delivery != null);
    return {
      ready,
      feeOf: (storeId: string): StoreFees | undefined => fees[storeId],
      /** null until every store is priced. */
      deliveryTotal: known ? list.reduce((t, f) => t + (f!.delivery ?? 0), 0) : null,
      platformTotal: list.reduce((t, f) => t + (f?.platform ?? 0), 0),
    };
  }, [stores, fees, ready]);
}
