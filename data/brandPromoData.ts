// ============================================================
// BRAND-FUNDED PROMO DATA — Apana Store (Customer App)
//
// Mock brand co-op promos (Engine-B margin layer). Each BrandDeal pairs a
// product's display fields + the seller's everyday price with a BrandPromo
// (lib/brandPromo.ts) describing how the funding brand marks it down. The
// seller still receives `everyday`; the brand funds the customer's discount
// + Apana's co-op fee.
//
// Frontend-first: replace getActiveBrandDeals() with
// GET /api/customer/promos/brand-funded?city= when the BE promo module lands.
// No seller cost/margin appears here — Apana never collects it (§ price-war).
// ============================================================

import { BrandPromo, isBrandPromoActive } from "../lib/brandPromo";

export interface BrandDeal {
  productId: string;   // == promo.productId
  name:      string;
  unit:      string;
  everyday:  number;   // seller's everyday price (seller keeps this in full)
  icon:      string;   // Ionicons glyph (placeholder art)
  bg:        string;
  storeName: string;   // the seller offering it (kept whole by the brand)
  promo:     BrandPromo;
}

// Co-op fee blends to the 6–9% Engine-B band in the unit-economics doc.
const WINDOW = { validFrom: "2026-06-01", validTo: "2026-07-31" };

export const BRAND_DEALS: BrandDeal[] = [
  {
    productId: "bd-maggi", name: "Maggi Masala Noodles", unit: "70 g pack",
    everyday: 14, icon: "fast-food-outline", bg: "#FEF3C7", storeName: "Sharma General Store",
    promo: {
      id: "p-maggi", brand: "Nestlé", brandColor: "#D1232A", productId: "bd-maggi",
      kind: "flat", value: 4, apanaCoopRate: 0.07, capPerOrder: 6,
      tagline: "Monsoon stock-up", ...WINDOW,
    },
  },
  {
    productId: "bd-lux", name: "Lux Soft Touch Soap", unit: "100 g",
    everyday: 40, icon: "sparkles-outline", bg: "#FCE7F3", storeName: "Gupta Medical Store",
    promo: {
      id: "p-lux", brand: "HUL", brandColor: "#00A0DF", productId: "bd-lux",
      kind: "pct", value: 0.20, apanaCoopRate: 0.08, capPerOrder: 4,
      tagline: "Brand-funded 20% off", ...WINDOW,
    },
  },
  {
    productId: "bd-cadbury", name: "Cadbury Dairy Milk", unit: "50 g",
    everyday: 50, icon: "gift-outline", bg: "#EDE0D4", storeName: "Sharma General Store",
    promo: {
      id: "p-cadbury", brand: "Mondelez", brandColor: "#4E2A84", productId: "bd-cadbury",
      kind: "flat", value: 10, apanaCoopRate: 0.09, capPerOrder: 3,
      tagline: "Festive sampling", ...WINDOW,
    },
  },
  {
    productId: "bd-tatatea", name: "Tata Tea Gold", unit: "250 g",
    everyday: 160, icon: "cafe-outline", bg: "#FEE2C7", storeName: "Apna Kirana",
    promo: {
      id: "p-tatatea", brand: "Tata Consumer", brandColor: "#0F4C81", productId: "bd-tatatea",
      kind: "pct", value: 0.15, apanaCoopRate: 0.06, capPerOrder: 2,
      tagline: "Trade-up reward", ...WINDOW,
    },
  },
  {
    productId: "bd-goodday", name: "Britannia Good Day", unit: "100 g",
    everyday: 30, icon: "nutrition-outline", bg: "#FDE68A", storeName: "Apna Kirana",
    promo: {
      id: "p-goodday", brand: "Britannia", brandColor: "#E11D48", productId: "bd-goodday",
      kind: "flat", value: 6, apanaCoopRate: 0.07, capPerOrder: 5,
      tagline: "New pack launch", ...WINDOW,
    },
  },
  {
    productId: "bd-surf", name: "Surf Excel Easy Wash", unit: "500 g",
    everyday: 120, icon: "water-outline", bg: "#DBEAFE", storeName: "Gupta Medical Store",
    promo: {
      id: "p-surf", brand: "HUL", brandColor: "#00A0DF", productId: "bd-surf",
      kind: "pct", value: 0.10, apanaCoopRate: 0.08, capPerOrder: 3,
      tagline: "Brand-funded saver", ...WINDOW,
    },
  },
];

// Only deals whose promo window is live now — empty if none (§19.8 no phantom).
export function getActiveBrandDeals(now: Date = new Date()): BrandDeal[] {
  return BRAND_DEALS.filter((d) => isBrandPromoActive(d.promo, now));
}
