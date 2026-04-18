// ============================================================
// ORDER QR DATA — Apana Store (Customer App)
//
// Status timelines and step-by-step instructions for each
// fulfillment mode shown on the Order QR Handshake screen.
//
// Each mode has a different flow:
//   pickup   — customer goes to the store, shows QR at counter
//   delivery — partner scans QR when handing over at the door
//   ride     — rider scans QR to start / end the ride
// ============================================================

import { FulfillmentMode } from "./cartData";

// ── Status step (timeline) ────────────────────────────────────

export interface QrStatusStep {
  key:    string;
  label:  string;
  icon:   string;         // Ionicons glyph
}

export interface QrModeConfig {
  title:        string;   // Screen heading
  subtitle:     string;   // One-liner below QR code
  qrLabel:      string;   // Text printed under the QR
  steps:        QrStatusStep[];
  activeStep:   number;   // Index of the currently active step (mock)
  instructions: string[]; // Numbered action list shown to the customer
  validityHours: number;  // How long this QR is valid
}

// ── Per-mode config ───────────────────────────────────────────

export const ORDER_QR_CONFIG: Record<FulfillmentMode, QrModeConfig> = {

  // ── Pickup ──────────────────────────────────────────────
  pickup: {
    title:   "Pickup QR Code",
    subtitle:"Show this QR to store staff when collecting your order",
    qrLabel: "SHOW AT COUNTER",
    steps: [
      { key: "placed",   label: "Order Placed",     icon: "checkmark-circle-outline" },
      { key: "prep",     label: "Being Prepared",   icon: "restaurant-outline"       },
      { key: "ready",    label: "Ready to Collect", icon: "bag-check-outline"        },
      { key: "done",     label: "Collected",        icon: "checkmark-done-circle-outline" },
    ],
    activeStep: 1,   // "Being Prepared" is the mock current state
    instructions: [
      "Your order is being prepared at the store",
      "Head to the store when you're ready",
      "Show this QR code to the counter staff",
      "Staff scans it — handshake complete, collect your order!",
    ],
    validityHours: 24,
  },

  // ── Delivery ─────────────────────────────────────────────
  delivery: {
    title:   "Delivery QR Code",
    subtitle:"Your delivery partner will scan this when handing over your order",
    qrLabel: "DELIVERY HANDSHAKE",
    steps: [
      { key: "placed",   label: "Order Placed",      icon: "checkmark-circle-outline"      },
      { key: "assigned", label: "Partner Assigned",  icon: "bicycle-outline"               },
      { key: "enroute",  label: "On the Way",        icon: "navigate-outline"              },
      { key: "done",     label: "Delivered",         icon: "checkmark-done-circle-outline" },
    ],
    activeStep: 1,   // "Partner Assigned" is the mock current state
    instructions: [
      "Your delivery partner has been assigned to your order",
      "Partner will pick up items from the store(s)",
      "Keep this QR ready when they arrive at your door",
      "Partner scans it — handshake confirms delivery!",
    ],
    validityHours: 12,
  },

  // ── Ride ─────────────────────────────────────────────────
  ride: {
    title:   "Ride QR Code",
    subtitle:"Show this to your rider to verify and start the ride",
    qrLabel: "RIDE HANDSHAKE",
    steps: [
      { key: "booked",   label: "Ride Booked",       icon: "checkmark-circle-outline"      },
      { key: "enroute",  label: "Rider En Route",    icon: "car-outline"                   },
      { key: "board",    label: "Show QR to Board",  icon: "qr-code-outline"               },
      { key: "done",     label: "Ride Complete",     icon: "checkmark-done-circle-outline" },
    ],
    activeStep: 1,   // "Rider En Route" is the mock current state
    instructions: [
      "Your rider is on the way to your location",
      "Wait at the pickup point — share location if needed",
      "Show this QR to the rider when they arrive",
      "Rider scans it — ride officially starts, both are verified!",
    ],
    validityHours: 2,
  },
};

// ── Helper: generate a mock order ID ─────────────────────────
// Format: APX-YYYYMMDD-XXXX (e.g. APX-20260418-4821)
// Backend will replace this with a real server-generated ID.

export function generateOrderId(): string {
  const now   = new Date();
  const y     = now.getFullYear();
  const m     = String(now.getMonth() + 1).padStart(2, "0");
  const d     = String(now.getDate()).padStart(2, "0");
  const rand  = Math.floor(1000 + Math.random() * 9000);
  return `APX-${y}${m}${d}-${rand}`;
}
