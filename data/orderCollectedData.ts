// ============================================================
// ORDER COLLECTED DATA — Apana Store (Customer App)
//
// Types + mock data for the QR Handshake Complete screen.
// Shown after the store / delivery partner scans the customer's
// order QR to confirm the handover.
//
// Backend: POST /orders/:id/handshake → HandshakeResult
// ============================================================

import { FulfillmentMode } from "./cartData";

// ── Handshake agent (who scanned the QR) ──────────────────
export interface HandshakeAgent {
  id:          string;
  name:        string;
  role:        string;        // "Store Staff" | "Delivery Partner" | "Rider"
  initials:    string;
  avatarColor: string;
  rating:      number;        // agent's own rating (e.g. 4.8)
  totalOrders: number;
}

// ── Per-mode success copy and colors ─────────────────────
export interface CollectedConfig {
  heroIcon:    string;        // Ionicons glyph
  heroColor:   string;        // primary success color
  heroBg:      string;        // hero circle bg
  title:       string;
  subtitle:    string;
  agentLabel:  string;        // "Collected by" | "Delivered by" | "Rider"
  ctaLabel:    string;        // primary button label
  ctaIcon:     string;
  ctaRoute:    string;        // where CTA navigates
}

export const COLLECTED_CONFIG: Record<FulfillmentMode, CollectedConfig> = {
  pickup: {
    heroIcon:   "bag-check-outline",
    heroColor:  "#0F4C81",
    heroBg:     "#DBEAFE",
    title:      "Order Collected!",
    subtitle:   "Your order has been handed over at the counter. Enjoy your items!",
    agentLabel: "Verified by",
    ctaLabel:   "View Order History",
    ctaIcon:    "receipt-outline",
    ctaRoute:   "/order-history",
  },
  delivery: {
    heroIcon:   "bicycle-outline",
    heroColor:  "#059669",
    heroBg:     "#DCFCE7",
    title:      "Order Picked Up!",
    subtitle:   "Your delivery partner has collected the order and is on the way.",
    agentLabel: "Picked up by",
    ctaLabel:   "Track Delivery",
    ctaIcon:    "navigate-outline",
    ctaRoute:   "/order-history",
  },
  ride: {
    heroIcon:   "car-outline",
    heroColor:  "#7C3AED",
    heroBg:     "#EDE9FE",
    title:      "Ride Started!",
    subtitle:   "Your ride has begun. Sit back, relax — your driver knows the route.",
    agentLabel: "Your driver",
    ctaLabel:   "Track Ride",
    ctaIcon:    "navigate-outline",
    ctaRoute:   "/order-history",
  },
};

// ── Mock handshake agents (one per mode) ─────────────────
export const MOCK_AGENTS: Record<FulfillmentMode, HandshakeAgent> = {
  pickup: {
    id:          "ag1",
    name:        "Ramesh Kumar",
    role:        "Store Staff",
    initials:    "RK",
    avatarColor: "#DBEAFE",
    rating:      4.9,
    totalOrders: 1240,
  },
  delivery: {
    id:          "ag2",
    name:        "Deepak Singh",
    role:        "Delivery Partner",
    initials:    "DS",
    avatarColor: "#DCFCE7",
    rating:      4.7,
    totalOrders: 3820,
  },
  ride: {
    id:          "ag3",
    name:        "Arun Mishra",
    role:        "Apana Rider",
    initials:    "AM",
    avatarColor: "#EDE9FE",
    rating:      4.8,
    totalOrders: 2150,
  },
};

// ── Format handshake timestamp ────────────────────────────
export function formatHandshakeTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatHandshakeDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}
