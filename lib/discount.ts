// ============================================================
// DISCOUNT ENGINE — Apana Store (Customer App)
//
// Combines the TWO discount systems into one per-line price so the cart
// totals and the item rows can never disagree:
//
//   1. Stop-loss with a TRAILING per-item threshold (seller-funded) —
//      architecture/discount_model_stoploss_spec.md. The seller sets ONE
//      store-wide threshold T. Each item then gets its OWN effective unlock
//      threshold that TRAILS its price (like a trailing stop-loss):
//        • everyday ≤ T  → effective threshold = T
//        • everyday > T  → next multiple of T strictly above the price
//                          (₹750 with T=₹500 → ₹1000; ₹1200 → ₹1500)
//      An item drops to its deal price only when the WHOLE store basket
//      (at everyday prices) reaches that item's trailing threshold. So a lone
//      high-ticket item never auto-sells at its deal — the customer must build
//      a bigger basket (e.g. a ₹750 cake needs ~₹1000 basket / 2 units).
//
//   2. Brand-funded promo (brand-funded) — lib/brandPromo.ts. A brand covers
//      a markdown from its own budget; the SELLER still receives the everyday
//      price. Independent of the basket. Engine-B co-op revenue for Apana.
//
// Precedence: a brand-funded line wins over the seller deal — the markdown is
// the brand's money and is always live, so never stack it on the deal.
// Savings are reported in two buckets (stop-loss `savings` vs `brandSavings`).
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
  threshold:    number | null; // seller's store-wide threshold T (null = no stop-loss deal)
  subtotal:     number;        // basket at everyday prices
  charged:      number;        // what the customer actually pays (deals + brand applied)
  savings:      number;        // stop-loss (deal) savings applied now
  brandSavings: number;        // brand-funded savings applied now (seller kept whole)
  unlocked:     boolean;       // at least one item reached its trailing threshold
  remaining:    number;        // ₹ to the NEAREST still-locked deal (0 = none / all unlocked)
  potential:    number;        // ₹ saved when that nearest item unlocks (drives the nudge)
}

// Line total at everyday price.
export function lineEveryday(item: CartItem): number {
  return item.price * item.qty;
}

// An item's TRAILING effective threshold given the store-wide T. Returns null
// when the store has no threshold. everyday ≤ T → T; everyday > T → the next
// multiple of T STRICTLY above the price (so one unit of a pricey item never
// unlocks on its own — it needs the basket to climb a full step higher).
export function itemUnlockThreshold(everyday: number, storeThreshold: number | null): number | null {
  if (storeThreshold == null || storeThreshold <= 0) return null;
  if (everyday <= storeThreshold) return storeThreshold;
  return (Math.floor(everyday / storeThreshold) + 1) * storeThreshold;
}

// Has THIS item reached its trailing threshold against the whole-store basket?
// Only items that carry a deal (floorPrice) can unlock.
export function isItemUnlocked(item: CartItem, storeSubtotal: number, storeThreshold: number | null): boolean {
  if (item.floorPrice == null) return false;
  const eff = itemUnlockThreshold(item.price, storeThreshold);
  return eff != null && storeSubtotal >= eff;
}

// Canonical per-unit price for one line, applying both systems with
// brand-funded taking precedence over the (trailing) stop-loss deal.
// `unlocked` is THIS item's own trailing-threshold result (see isItemUnlocked).
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

// Line total at the price actually charged. `unlocked` = this item's trailing result.
export function lineCharged(item: CartItem, unlocked: boolean): number {
  return resolveLine(item, unlocked).unit * item.qty;
}

// Resolve one store's basket with per-item trailing thresholds + both savings buckets.
export function resolveStoreDiscount(store: CartStore): StoreDiscount {
  const subtotal = store.items.reduce((s, i) => s + lineEveryday(i), 0);
  const T        = store.unlockThreshold ?? null;

  let charged = 0, savings = 0, brandSavings = 0;
  let nearestRemaining = Infinity, nearestPotential = 0;

  for (const item of store.items) {
    const every    = lineEveryday(item);
    const unlocked = isItemUnlocked(item, subtotal, T);
    const info     = resolveLine(item, unlocked);
    const line     = info.unit * item.qty;
    charged += line;

    if (info.source === "brand") {
      brandSavings += every - line;
    } else if (info.source === "floor") {
      savings += every - line;
    } else if (item.floorPrice != null && T != null) {
      // Has a deal but its trailing threshold isn't met yet → nudge candidate.
      const eff = itemUnlockThreshold(item.price, T);
      if (eff != null) {
        const rem = eff - subtotal;
        if (rem > 0 && rem < nearestRemaining) {
          nearestRemaining = rem;
          nearestPotential = (item.price - item.floorPrice) * item.qty;
        }
      }
    }
  }

  return {
    threshold:    T,
    subtotal,
    charged,
    savings,
    brandSavings,
    unlocked:     savings > 0,
    remaining:    nearestRemaining === Infinity ? 0 : nearestRemaining,
    potential:    nearestPotential,
  };
}

// Charged total for a store (convenience for cart totals).
export function storeCharged(store: CartStore): number {
  return resolveStoreDiscount(store).charged;
}
