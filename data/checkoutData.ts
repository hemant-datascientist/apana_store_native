// ============================================================
// CHECKOUT DATA — Apana Store (Customer App)
//
// Config and helpers used by the Checkout screen.
// Backend: POST /orders  →  { orderId, estimatedTime, … }
// ============================================================

import { FulfillmentMode } from "./cartData";

// ── ETA estimates per fulfillment mode ────────────────────────
// Shown on each store row so the customer knows when to expect
// their order / when to head to the store.

export interface EtaConfig {
  label:  string;   // verb prefix e.g. "Ready in", "Arrives in"
  minMin: number;   // lower bound in minutes
  maxMin: number;   // upper bound in minutes
}

export const ETA_CONFIG: Record<FulfillmentMode, EtaConfig> = {
  pickup:   { label: "Ready in",   minMin: 10, maxMin: 20 },
  delivery: { label: "Arrives in", minMin: 25, maxMin: 45 },
  ride:     { label: "Ride in",    minMin: 8,  maxMin: 15 },
};

// ── Checkout progress steps ───────────────────────────────────
// Visual breadcrumb shown at the top of the checkout screen.

export interface CheckoutStep {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph
}

export const CHECKOUT_STEPS: CheckoutStep[] = [
  { key: "cart",     label: "Cart",     icon: "bag-outline"            },
  { key: "checkout", label: "Review",   icon: "receipt-outline"        },
  { key: "payment",  label: "Payment",  icon: "card-outline"           },
  { key: "track",    label: "Track",    icon: "location-outline"       },
];

// ── Helper — format ETA string ────────────────────────────────
// Returns e.g. "Ready in 10–20 min"

export function formatEta(mode: FulfillmentMode): string {
  const cfg = ETA_CONFIG[mode];
  return `${cfg.label} ${cfg.minMin}–${cfg.maxMin} min`;
}

// ── Fulfillment display config ────────────────────────────────
// Shared colors/icons for fulfillment mode badges across screens.

export const FULFILLMENT_DISPLAY: Record<FulfillmentMode, {
  label: string; icon: string; color: string; bg: string;
}> = {
  pickup:   { label: "Pickup",   icon: "walk-outline",    color: "#026451", bg: "#DCFCE7" },
  delivery: { label: "Delivery", icon: "bicycle-outline", color: "#1D4ED8", bg: "#DBEAFE" },
  ride:     { label: "Ride",     icon: "car-outline",     color: "#7C3AED", bg: "#EDE9FE" },
};
