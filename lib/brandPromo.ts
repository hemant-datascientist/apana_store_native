// ============================================================
// BRAND-FUNDED PROMO ENGINE — Apana Store (Customer App)
//
// Engine-B margin line (business/discounting_and_price_war_strategy.md §4,
// pricing_charter_objection_resolution.md §3 — the "Henkel pattern").
//
// A BRAND (FMCG company) funds a markdown on its own SKU from its marketing
// budget. The customer sees a deal; the SELLER still receives their full
// everyday price (the brand makes up the difference) — so a brand promo can
// NEVER squeeze the kirana's margin. Apana charges the brand a co-op fee on
// the promoted unit → that fee is the Engine-B revenue this layer exists for.
//
// This is the OPPOSITE money-flow to the seller stop-loss discount
// (lib/discount.ts): there the seller funds the markdown from a declared
// floor; here the brand funds it and the seller is untouched. The two can
// coexist on different items. Apana never platform-funds a markdown itself
// (the anti-predatory guardrail) — every rupee of the discount is brand money.
//
// Pure functions, no state. Frontend-first on mock data
// (data/brandPromoData.ts); BE swap = replace the data source, not the maths.
// ============================================================

export type PromoKind = "flat" | "pct";

export interface BrandPromo {
  id:         string;
  brand:      string;     // funding brand, e.g. "Nestlé"
  brandColor: string;     // accent for the card/badge
  productId:  string;     // SKU this promo applies to
  kind:       PromoKind;  // flat ₹ off | pct off
  value:      number;     // ₹ off (flat) | fraction 0..1 (pct)
  apanaCoopRate: number;  // Apana co-op fee as fraction of everyday price (Engine-B take)
  validFrom:  string;     // ISO date
  validTo:    string;     // ISO date
  capPerOrder?: number;   // max units the brand subsidises in one order (rest at everyday)
  tagline?:   string;     // marketing line for the card
}

export interface PromoEconomics {
  units:          number; // units in the line
  subsidised:     number; // units the brand actually funds (after capPerOrder)
  customerPays:   number; // total the customer pays
  sellerReceives: number; // total to the seller — ALWAYS everyday × units (seller kept whole)
  customerSaves:  number; // total discount the customer sees
  brandFunds:     number; // total brand outlay = customerSaves + apanaCoop
  apanaCoop:      number; // Apana Engine-B revenue from this line
}

const round = (n: number): number => Math.round(n);

// Is the promo live at `now`? (Inclusive of both ends, day-granular.)
export function isBrandPromoActive(promo: BrandPromo, now: Date = new Date()): boolean {
  const t    = now.getTime();
  const from = new Date(promo.validFrom).getTime();
  const to   = new Date(promo.validTo).getTime();
  if (Number.isNaN(from) || Number.isNaN(to)) return false;
  return t >= from && t <= to;
}

// ₹ the brand knocks off ONE unit. Never below 0, never above everyday
// (a brand can't make an item free-plus — the markdown is capped at price).
export function brandDiscount(promo: BrandPromo, everyday: number): number {
  const raw = promo.kind === "flat" ? promo.value : everyday * promo.value;
  return Math.max(0, Math.min(round(raw), everyday));
}

// Per-unit price the customer pays under the promo.
export function brandPromoPrice(promo: BrandPromo, everyday: number): number {
  return everyday - brandDiscount(promo, everyday);
}

// Full money split for a line of `qty` units. The seller-whole invariant and
// the cap (only capPerOrder units are brand-subsidised) are enforced here so
// the cart and any analytics read the same numbers.
export function promoEconomics(promo: BrandPromo, everyday: number, qty: number): PromoEconomics {
  const perUnitOff   = brandDiscount(promo, everyday);
  const subsidised   = promo.capPerOrder != null ? Math.min(qty, promo.capPerOrder) : qty;
  const customerSaves = perUnitOff * subsidised;

  const sellerReceives = everyday * qty;            // invariant: seller untouched
  const customerPays   = sellerReceives - customerSaves;
  const apanaCoop      = round(everyday * promo.apanaCoopRate) * subsidised;
  const brandFunds     = customerSaves + apanaCoop; // brand covers discount + Apana's fee

  return { units: qty, subsidised, customerPays, sellerReceives, customerSaves, brandFunds, apanaCoop };
}
