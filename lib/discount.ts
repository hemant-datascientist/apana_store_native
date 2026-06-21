// ============================================================
// DISCOUNT ENGINE — Apana Store (Customer App)
//
// "Stop-loss" basket-unlock discounting (architecture/discount_model_
// stoploss_spec.md). The seller sets, per item, an everyday price
// (CartItem.price) and an optional floor price (CartItem.floorPrice);
// per store, an unlock threshold (CartStore.unlockThreshold). When the
// basket from that store reaches the threshold, every item with a floor
// drops to its floor — rewarding bigger baskets, never a per-unit price
// war. Apana never knows the seller's cost; only the floor they declare.
//
// Pure functions, no state — the cart UI calls resolveStoreDiscount per
// store and renders the nudge / unlocked savings from the result.
// ============================================================

import { CartItem, CartStore } from "../data/cartData";

export interface StoreDiscount {
  threshold: number | null; // seller's unlock threshold (null = no deal)
  subtotal:  number;        // basket at everyday prices
  charged:   number;        // what the customer actually pays (floors when unlocked)
  savings:   number;        // subtotal − charged (what they saved now)
  unlocked:  boolean;       // basket has crossed the threshold
  remaining: number;        // ₹ still needed to unlock (0 when unlocked / no deal)
  potential: number;        // ₹ they'd save if they unlocked (drives the nudge)
}

// Line total at everyday price.
export function lineEveryday(item: CartItem): number {
  return item.price * item.qty;
}

// Line total at the price actually charged: floor when unlocked + the
// item has a floor, else everyday.
export function lineCharged(item: CartItem, unlocked: boolean): number {
  const price = unlocked && item.floorPrice != null ? item.floorPrice : item.price;
  return price * item.qty;
}

// Resolve one store's basket: thresholds, unlock state, savings.
export function resolveStoreDiscount(store: CartStore): StoreDiscount {
  const subtotal  = store.items.reduce((s, i) => s + lineEveryday(i), 0);
  const threshold = store.unlockThreshold ?? null;
  const hasFloors = store.items.some((i) => i.floorPrice != null);

  // No threshold or no discountable item → no deal on this store.
  if (threshold == null || !hasFloors) {
    return { threshold, subtotal, charged: subtotal, savings: 0, unlocked: false, remaining: 0, potential: 0 };
  }

  const unlocked = subtotal >= threshold;
  const charged  = store.items.reduce((s, i) => s + lineCharged(i, unlocked), 0);
  const atFloor  = store.items.reduce((s, i) => s + lineCharged(i, true), 0);

  return {
    threshold,
    subtotal,
    charged,
    savings:   subtotal - charged,
    unlocked,
    remaining: unlocked ? 0 : Math.max(0, threshold - subtotal),
    potential: subtotal - atFloor, // savings achievable at this basket once unlocked
  };
}

// Charged total for a store (convenience for cart totals).
export function storeCharged(store: CartStore): number {
  return resolveStoreDiscount(store).charged;
}
