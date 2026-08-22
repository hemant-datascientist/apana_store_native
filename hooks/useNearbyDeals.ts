// ============================================================
// useNearbyDeals — the real deals a customer near here can actually get.
//
// 🔴 THE OFFER ZONE WAS FOURTEEN INVENTED DISCOUNTS.
//
// data/offerZoneData.ts hand-wrote offers and attributed them to named
// businesses: "20% off on all fresh vegetables — Sharma General Store,
// minimum order ₹300, valid Today 11 PM", "Flat ₹500 off on electronics
// above ₹3000 — TechZone Electronics". Those shops never offered them. A
// customer walking in expecting one is a promise a real shopkeeper is left
// to refuse at their own counter — worse than a wrong statistic, because
// someone acts on it and a third party pays for it.
//
// Apana has exactly ONE real discount mechanism: the stop-loss deal engine.
// A seller sets a floor price per item plus a store-wide unlock threshold T;
// the floor applies once that shop's basket reaches T. Both are real columns
// (`deal_price_cents`, `deal_unlock_threshold_cents`) and both are already
// enforced at checkout, so this screen shows what the till will actually
// charge — not a marketing claim sitting beside it.
// ============================================================

import { useMemo } from "react";
import { useLiveProducts } from "./useLiveProducts";
import type { LiveProduct } from "../services/liveCatalogService";

export interface ShopDeals {
  storeId: string;
  storeName: string;
  /** Rupees the basket must reach; null = no threshold, deal is immediate. */
  unlockThreshold: number | null;
  products: LiveProduct[];
}

export interface NearbyDeals {
  /** Deals grouped by shop — the threshold is per shop, so a flat list of
   *  products could not state the condition correctly. */
  shops: ShopDeals[];
  dealCount: number;
  loading: boolean;
  isEmpty: boolean;
}

/** What the customer actually saves, in rupees. 0 when there is no real cut. */
export function savingOn(p: LiveProduct): number {
  if (p.dealPrice == null) return 0;
  const cut = p.price - p.dealPrice;
  return cut > 0 ? cut : 0;
}

export function useNearbyDeals(): NearbyDeals {
  // Already k-ring scoped: a deal at a shop that cannot serve this customer
  // is not an offer, it is a tease.
  const { products, loading } = useLiveProducts();

  const shops = useMemo(() => {
    const byStore = new Map<string, ShopDeals>();
    for (const p of products) {
      // A deal price equal to or above the normal price is not a discount.
      // The seller grid allows it (deal <= price is the only constraint), so
      // filtering here is what keeps "0% off" off this screen.
      if (savingOn(p) <= 0) continue;
      const existing = byStore.get(p.store.id);
      if (existing) {
        existing.products.push(p);
        continue;
      }
      byStore.set(p.store.id, {
        storeId: p.store.id,
        storeName: p.store.name,
        unlockThreshold: p.store.dealUnlockThreshold,
        products: [p],
      });
    }
    return [...byStore.values()]
      // Biggest single saving first, so the strongest real offer leads.
      .map((s) => ({ ...s, products: s.products.sort((a, b) => savingOn(b) - savingOn(a)) }))
      .sort((a, b) => savingOn(b.products[0]!) - savingOn(a.products[0]!));
  }, [products]);

  const dealCount = useMemo(() => shops.reduce((n, s) => n + s.products.length, 0), [shops]);

  return {
    shops,
    dealCount,
    loading,
    isEmpty: !loading && dealCount === 0,
  };
}
