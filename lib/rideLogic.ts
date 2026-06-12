// ============================================================
// rideLogic — passenger/vehicle gating + distance ranking for
// the Auto Riders screen.
//
// Capacity gating ("smart logic"):
//   passengers 1   → Bike · Auto · Cab
//   passengers 2–3 → Auto · Cab        (bike carries one pillion only — gated at 1 for parcel-grade safety V1)
//   passengers 4–6 → Cab only
// A class is allowed iff VEHICLE_INFO[class].capacity >= passengers.
// One rule, no special cases — capacities are the source of truth.
// ============================================================

import { distanceMeters } from "./geo";
import {
  Rider,
  NearbyRider,
  VehicleClass,
  VEHICLE_CLASSES,
  VEHICLE_INFO,
} from "../data/ridersData";

// City average door-to-door approach speed (km/h) for the ETA estimate.
// Deliberately conservative — an estimate, never a promise.
const APPROACH_KMH = 18;
const MIN_ETA_MIN  = 1;

// ── Capacity gating ───────────────────────────────────────────
export function isClassAllowed(cls: VehicleClass, passengers: number): boolean {
  return VEHICLE_INFO[cls].capacity >= passengers;
}

export function allowedClasses(passengers: number): VehicleClass[] {
  return VEHICLE_CLASSES.filter((c) => isClassAllowed(c, passengers));
}

// Why a class is blocked — shown on disabled chips/cards.
export function blockedReason(cls: VehicleClass, passengers: number): string | null {
  if (isClassAllowed(cls, passengers)) return null;
  const cap = VEHICLE_INFO[cls].capacity;
  return `Max ${cap} passenger${cap > 1 ? "s" : ""}`;
}

// ── Distance + ETA resolution ─────────────────────────────────
export function toNearbyRider(
  rider: Rider,
  origin: { lat: number; lng: number },
): NearbyRider {
  const distanceM = distanceMeters(origin.lat, origin.lng, rider.lat, rider.lng);
  const etaMin = Math.max(
    MIN_ETA_MIN,
    Math.round((distanceM / 1000 / APPROACH_KMH) * 60),
  );
  return { ...rider, distanceM, etaMin };
}

// Nearest → farthest, optionally limited to allowed classes for the
// current passenger count and/or one selected class tab.
export function rankRiders(
  riders: Rider[],
  origin: { lat: number; lng: number },
  passengers: number,
  classFilter: VehicleClass | "all",
): NearbyRider[] {
  return riders
    .filter((r) => isClassAllowed(r.vehicleClass, passengers))
    .filter((r) => classFilter === "all" || r.vehicleClass === classFilter)
    .map((r) => toNearbyRider(r, origin))
    .sort((a, b) => a.distanceM - b.distanceM);
}

export function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}
