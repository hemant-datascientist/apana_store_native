// ============================================================
// ORDER TRACKING DATA — Apana Store (Customer App)
//
// Static config + mock state for the Order Tracking screen.
// Covers all three fulfillment modes:
//   delivery — partner picks up from store + delivers to customer
//   ride     — driver takes customer to store or destination
//   pickup   — customer collects from store (store prep status)
//
// Backend: GET /customer/orders/:orderId/tracking  (live polling)
//          WS  /ws/tracking/:orderId               (socket stream)
// ============================================================

import { FulfillmentMode } from "./cartData";

// ── Tracking status step ──────────────────────────────────────
export interface TrackingStep {
  key:       string;
  label:     string;
  subLabel:  string;   // Short context shown below label
  icon:      string;   // Ionicons glyph
}

// Steps per mode (ordered from first to last)
export const TRACKING_STEPS: Record<FulfillmentMode, TrackingStep[]> = {
  delivery: [
    { key: "placed",   label: "Order Placed",  subLabel: "Confirmed by store",   icon: "checkmark-circle-outline" },
    { key: "packing",  label: "Packing",        subLabel: "Store is packing",     icon: "cube-outline"             },
    { key: "picked",   label: "Picked Up",      subLabel: "Partner collected",    icon: "bag-handle-outline"       },
    { key: "onway",    label: "On the Way",     subLabel: "Heading to you",       icon: "bicycle-outline"          },
    { key: "delivered",label: "Delivered",      subLabel: "Order complete",       icon: "home-outline"             },
  ],
  pickup: [
    { key: "placed",   label: "Order Placed",   subLabel: "Store confirmed",      icon: "checkmark-circle-outline" },
    { key: "packing",  label: "Being Prepared", subLabel: "Store is packing",     icon: "cube-outline"             },
    { key: "ready",    label: "Ready",          subLabel: "Head to the counter",  icon: "storefront-outline"       },
    { key: "collected",label: "Collected",      subLabel: "Enjoy your order!",    icon: "happy-outline"            },
  ],
  ride: [
    { key: "booked",   label: "Ride Booked",    subLabel: "Finding driver",       icon: "search-outline"           },
    { key: "accepted", label: "Driver Accepted", subLabel: "Coming to pick you up",icon: "person-outline"          },
    { key: "arrived",  label: "Driver Arrived",  subLabel: "Driver at your location",icon: "location-outline"     },
    { key: "onway",    label: "On the Way",      subLabel: "Heading to store",    icon: "car-outline"              },
    { key: "reached",  label: "Reached",         subLabel: "Destination arrived", icon: "flag-outline"             },
  ],
};

// ── Active mock step per mode ─────────────────────────────────
// For UI preview — simulates order in progress
export const MOCK_ACTIVE_STEP: Record<FulfillmentMode, string> = {
  delivery: "onway",
  pickup:   "packing",
  ride:     "accepted",
};

// ── ETA display strings per mode ─────────────────────────────
export const MOCK_ETA: Record<FulfillmentMode, { minutes: number; label: string }> = {
  delivery: { minutes: 18, label: "Arriving in" },
  pickup:   { minutes: 8,  label: "Ready in"    },
  ride:     { minutes: 5,  label: "Driver in"   },
};

// ── Partner (delivery agent / driver / store staff) ───────────
export interface TrackingPartner {
  id:          string;
  name:        string;
  initials:    string;
  avatarColor: string;
  rating:      number;       // 1–5
  totalOrders: number;
  vehicle:     string;       // e.g. "Honda Activa", "Maruti Swift", "On foot"
  vehicleNo:   string;       // e.g. "MH12 AB 1234"
  phone:       string;       // masked
}

// Partners keyed by fulfillment mode
export const MOCK_PARTNERS: Record<FulfillmentMode, TrackingPartner> = {
  delivery: {
    id:          "p_delivery_01",
    name:        "Ramesh Patil",
    initials:    "RP",
    avatarColor: "#0F4C81",
    rating:      4.8,
    totalOrders: 2340,
    vehicle:     "Honda Activa",
    vehicleNo:   "MH12 AB 4521",
    phone:       "+91 98•• ••8821",
  },
  pickup: {
    id:          "p_store_01",
    name:        "Suresh (Counter 3)",
    initials:    "SC",
    avatarColor: "#026451",
    rating:      4.9,
    totalOrders: 1200,
    vehicle:     "Store Counter",
    vehicleNo:   "",
    phone:       "+91 80•• ••3344",
  },
  ride: {
    id:          "p_ride_01",
    name:        "Anil Kumar",
    initials:    "AK",
    avatarColor: "#7C3AED",
    rating:      4.7,
    totalOrders: 980,
    vehicle:     "Maruti Swift Dzire",
    vehicleNo:   "MH14 CD 7810",
    phone:       "+91 91•• ••6677",
  },
};

// ── Live location mock (lat/lng) ──────────────────────────────
// Real value comes from WebSocket stream — this is a Pune mock
export interface LatLng { lat: number; lng: number }

export const MOCK_PARTNER_LOCATION: Record<FulfillmentMode, LatLng> = {
  delivery: { lat: 18.5230, lng: 73.8566 },
  pickup:   { lat: 18.5196, lng: 73.8553 },
  ride:     { lat: 18.5167, lng: 73.8476 },
};

export const MOCK_CUSTOMER_LOCATION: LatLng = { lat: 18.5204, lng: 73.8567 };

// ── Mode display config for tracking screen ───────────────────
export const TRACKING_MODE_CONFIG: Record<FulfillmentMode, {
  label:         string;
  partnerLabel:  string;   // "Delivery Partner" | "Store" | "Driver"
  actionLabel:   string;   // verb for the CTA context
  color:         string;
  bg:            string;
  icon:          string;
}> = {
  delivery: {
    label:        "Delivery",
    partnerLabel: "Delivery Partner",
    actionLabel:  "Track Delivery",
    color:        "#1D4ED8",
    bg:           "#DBEAFE",
    icon:         "bicycle-outline",
  },
  pickup: {
    label:        "Pickup",
    partnerLabel: "Store",
    actionLabel:  "Track Preparation",
    color:        "#026451",
    bg:           "#DCFCE7",
    icon:         "storefront-outline",
  },
  ride: {
    label:        "Ride",
    partnerLabel: "Driver",
    actionLabel:  "Track Ride",
    color:        "#7C3AED",
    bg:           "#EDE9FE",
    icon:         "car-outline",
  },
};
