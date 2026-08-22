// ============================================================
// RIDERS DATA — Apana Store (Customer App, Auto Riders)
//
// Vehicle classes + mock rider fleet for the Auto Riders screen.
// Riders are Apana Partner fleet (Ride mode) — frontend-first mock,
// same precedent as §19.5 useMockPartnerFix. Replace via
// services/ridersService when WS /ws/tracking + §19.4 heartbeats land.
// ============================================================

// ── Vehicle classes ───────────────────────────────────────────
export type VehicleClass = "two_wheeler" | "three_wheeler" | "four_wheeler";

export interface VehicleInfo {
  key:        VehicleClass;
  label:      string;   // chip label
  fullLabel:  string;   // card subtitle
  icon:       string;   // Ionicons glyph
  color:      string;   // marker + chip accent
  capacity:   number;   // max passengers (driver excluded)
}

// Capacity drives the smart gating: a class is bookable only when
// capacity >= passenger count. 4W covers sedans + SUVs (up to 6).
export const VEHICLE_INFO: Record<VehicleClass, VehicleInfo> = {
  two_wheeler: {
    key: "two_wheeler",
    label: "Bike",
    fullLabel: "Bike (2 Wheeler)",
    icon: "bicycle-outline",
    color: "#3B82F6",
    capacity: 1,
  },
  three_wheeler: {
    key: "three_wheeler",
    label: "Auto",
    fullLabel: "Auto Rickshaw (3 Wheeler)",
    icon: "car-sport-outline",
    color: "#F59E0B",
    capacity: 3,
  },
  four_wheeler: {
    key: "four_wheeler",
    label: "Cab",
    fullLabel: "Cab (4 Wheeler · up to 6)",
    icon: "car-outline",
    color: "#8B5CF6",
    capacity: 6,
  },
};

export const VEHICLE_CLASSES: VehicleClass[] = [
  "two_wheeler",
  "three_wheeler",
  "four_wheeler",
];

export const MAX_PASSENGERS = 6;

// ── Rider ─────────────────────────────────────────────────────
export interface Rider {
  id:           string;
  name:         string;
  vehicleClass: VehicleClass;
  vehicleNo:    string;
  rating:       number;
  ridesDone:    number;
  lat:          number;
  lng:          number;
}

// Rider resolved against the customer's position (list/card shape).
export interface NearbyRider extends Rider {
  distanceM: number;   // great-circle metres from the customer
  etaMin:    number;   // arrival estimate from distance
}

// ── Mock fleet ────────────────────────────────────────────────
// Deterministic offsets (NOT random) so the map is stable across
// renders. Offsets are degrees from the customer's position —
// ~0.001° ≈ 110 m. Mix of all three classes within ~2.5 km.
// 🔴 The invented fleet that used to live here is DELETED.
//
// MOCK_SEEDS held named drivers with real-looking vehicle registration
// numbers ("Ramesh Pawar, MH 12 AB 4821, 4.8 stars, 2140 rides") and
// mockRidersAround() placed them a few hundred metres from wherever the
// customer actually stood, on a real Mappls map. Apana runs no rides, so
// none of those people existed and none of those autos were coming.
//
// The TYPES above stay: they are the contract GET /riders/nearby will
// answer with when a rider network is real. The data does not come back.
