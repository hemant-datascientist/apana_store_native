// ============================================================
// DISCOUNT ENGINE — Apana Store (Customer App)
//
// Combines the TWO discount systems into one per-line price so the cart
// totals and the item rows can never disagree:
//
//   1. Stop-loss basket-unlock (seller-funded) — architecture/discount_model_
//      stoploss_spec.md. Seller sets an everyday price + optional floor; per
//      store an unlock threshold. Basket ≥ threshold → floor items drop to
//      their floor. Apana never knows the seller's cost, only the floor.
//
//   2. Brand-funded promo (brand-funded) — lib/brandPromo.ts. A brand covers
//      a markdown from its own budget; the SELLER still receives the everyday
//      price. Independent of the basket. Engine-B co-op revenue for Apana.
//
// Precedence: a brand-funded line wins over the seller floor — the markdown is
// the brand's money and is always live, so never stack it on top of the floor.
// Savings are reported in two buckets (stop-loss `savings` vs `brandSavings`)
// so the breakdown can label each honestly.
//
// Pure functions, no state.
// ============================================================

import { getActiveBrandPromo } from "../data/brandPromoData";
import type { CartItem, CartStore } from "../data/cartData";
import { brandPromoPrice } from "./brandPromo";

export type LineSource = "everyday" | "floor" | "brand";

export interface LineInfo {
  everyday: number;     // per-unit everyday price
  unit:     number;     // per-unit price the customer actually pays
  source:   LineSource;
  brand?:   string;     // funding brand name when source === "brand"
}

export interface StoreDiscount {
  threshold:    number | null; // seller's unlock threshold (null = no stop-loss deal)
  subtotal:     number;        // basket at everyday prices
  charged:      number;        // what the customer actually pays (floors + brand applied)
  savings:      number;        // stop-loss (bulk) savings applied now
  brandSavings: number;        // brand-funded savings applied now (seller kept whole)
  unlocked:     boolean;       // basket has crossed the threshold
  remaining:    number;        // ₹ still needed to unlock (0 when unlocked / no deal)
  potential:    number;        // extra ₹ they'd save by unlocking (drives the nudge)
}

// Line total at everyday price.
export function lineEveryday(item: CartItem): number {
  return item.price * item.qty;
}

// Canonical per-unit price for one line, applying both systems with
// brand-funded taking precedence over the stop-loss floor.
export function resolveLine(item: CartItem, unlocked: boolean): LineInfo {
  const brand = getActiveBrandPromo(item.brandPromoId);
  if (brand) {
    return { everyday: item.price, unit: brandPromoPrice(brand, item.price), source: "brand", brand: brand.brand };
  }
  if (unlocked && item.floorPrice != null) {
    return { everyday: item.price, unit: item.floorPrice, source: "floor" };
  }
  return { everyday: item.price, unit: item.price, source: "everyday" };
}

// Line total at the price actually charged (floor when unlocked, brand when funded).
export function lineCharged(item: CartItem, unlocked: boolean): number {
  return resolveLine(item, unlocked).unit * item.qty;
}

// Resolve one store's basket: thresholds, unlock state, both savings buckets.
export function resolveStoreDiscount(store: CartStore): StoreDiscount {
  const subtotal     = store.items.reduce((s, i) => s + lineEveryday(i), 0);
  const threshold    = store.unlockThreshold ?? null;
  const hasFloors    = store.items.some((i) => i.floorPrice != null);
  const hasStopLoss  = threshold != null && hasFloors;
  const unlocked     = hasStopLoss && subtotal >= threshold;

  let charged = 0, savings = 0, brandSavings = 0;
  for (const item of store.items) {
    const every = lineEveryday(item);
    const info  = resolveLine(item, unlocked);
    const line  = info.unit * item.qty;
    charged += line;
    if (info.source === "brand")      brandSavings += every - line;
    else if (info.source === "floor") savings      += every - line;
  }

  // Extra stop-loss saving from unlocking = charged-now − charged-if-unlocked.
  // Brand lines are identical in both states, so they cancel — leaving only the
  // floor delta on items not already covered by a brand promo.
  const ifUnlocked = store.items.reduce((s, i) => s + resolveLine(i, true).unit * i.qty, 0);
  const potential  = Math.max(0, charged - ifUnlocked);

  return {
    threshold,
    subtotal,
    charged,
    savings,
    brandSavings,
    unlocked,
    remaining: !hasStopLoss || unlocked ? 0 : Math.max(0, threshold - subtotal),
    potential,
  };
}

// Charged total for a store (convenience for cart totals).
export function storeCharged(store: CartStore): number {
  return resolveStoreDiscount(store).charged;
}
