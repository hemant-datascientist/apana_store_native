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
interface MockSeed {
  name: string; cls: VehicleClass; no: string;
  rating: number; rides: number; dLat: number; dLng: number;
}

const MOCK_SEEDS: MockSeed[] = [
  { name: "Ramesh Pawar",  cls: "two_wheeler",   no: "MH 12 AB 4821", rating: 4.8, rides: 2140, dLat:  0.0021, dLng:  0.0014 },
  { name: "Sagar Jadhav",  cls: "three_wheeler", no: "MH 12 CD 0934", rating: 4.6, rides: 3460, dLat: -0.0032, dLng:  0.0026 },
  { name: "Imran Shaikh",  cls: "two_wheeler",   no: "MH 14 EF 7712", rating: 4.9, rides: 1780, dLat:  0.0044, dLng: -0.0031 },
  { name: "Vitthal More",  cls: "three_wheeler", no: "MH 12 GH 5567", rating: 4.5, rides: 5230, dLat: -0.0058, dLng: -0.0042 },
  { name: "Akshay Kale",   cls: "four_wheeler",  no: "MH 12 JK 2289", rating: 4.7, rides: 980,  dLat:  0.0071, dLng:  0.0055 },
  { name: "Sunil Gaikwad", cls: "four_wheeler",  no: "MH 14 LM 6604", rating: 4.4, rides: 2875, dLat: -0.0089, dLng:  0.0068 },
  { name: "Prakash Bhosale", cls: "three_wheeler", no: "MH 12 NP 1148", rating: 4.7, rides: 4120, dLat: 0.0102, dLng: -0.0079 },
  { name: "Nilesh Shinde", cls: "two_wheeler",   no: "MH 12 QR 9035", rating: 4.6, rides: 1530, dLat: -0.0119, dLng: -0.0096 },
  { name: "Farhan Khan",   cls: "four_wheeler",  no: "MH 14 ST 3372", rating: 4.8, rides: 2210, dLat:  0.0146, dLng:  0.0114 },
  { name: "Ganesh Patil",  cls: "three_wheeler", no: "MH 12 UV 8851", rating: 4.3, rides: 6090, dLat: -0.0171, dLng:  0.0139 },
  { name: "Rohit Deshmukh", cls: "two_wheeler",  no: "MH 12 WX 4467", rating: 4.7, rides: 890,  dLat:  0.0198, dLng: -0.0152 },
  { name: "Manoj Thorat",  cls: "four_wheeler",  no: "MH 14 YZ 7720", rating: 4.5, rides: 3340, dLat: -0.0214, dLng: -0.0177 },
];

// Position the mock fleet around any centre (the customer's location).
export function mockRidersAround(lat: number, lng: number): Rider[] {
  return MOCK_SEEDS.map((s, i) => ({
    id: `r${i + 1}`,
    name: s.name,
    vehicleClass: s.cls,
    vehicleNo: s.no,
    rating: s.rating,
    ridesDone: s.rides,
    lat: lat + s.dLat,
    lng: lng + s.dLng,
  }));
}
