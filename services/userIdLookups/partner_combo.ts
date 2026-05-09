// Partner (platform × wheels × vehicle × fuel) combo encoding.
// 4 platform × 3 wheels × 9 vehicle type × 6 fuel = 648 combos → mapped to 2-letter AA-ZZ.
//
// Capacity: 26² = 676. Headroom: ONLY 28 slots (~4%). Adding any new dimension value risks overflow:
//   +1 fuel  -> 4×3×9×7 = 756 > 676 (overflows)
//   +1 vehicle -> 4×3×10×6 = 720 > 676 (overflows)
//   +1 platform -> 5×3×9×6 = 810 > 676 (overflows)
//   +1 wheels -> 4×4×9×6 = 864 > 676 (overflows)
// Any of those forces a 3-char partner combo (26³ = 17576) — would be a format-version bump.
//
// Why 2-char (not 3): single char (26) far too small; 3-char wastes IDs while V1 fits comfortably.

import { Platform } from "./shared_codes";

// Wheel count classification.
export type Wheels = "Two" | "Three" | "Four";

// Vehicle body type. Stable list — all 9 must remain present even if some are rarely used.
export type VehicleType =
  | "Bike"
  | "Scooty"
  | "Auto"
  | "SUV"
  | "Sedan"
  | "MUV"
  | "Hatchback"
  | "Van"
  | "Truck";

// Fuel type. EV/CNG/LPG/Hybrid included for India market reality.
export type FuelType = "Petrol" | "Diesel" | "EV" | "CNG" | "LPG" | "Hybrid";

// Stable index orders. NEVER change — every existing partner ID depends on these orderings.
const PLATFORM_ORDER: Platform[] = ["Android", "iOS", "Windows", "Mac"];
const WHEELS_ORDER: Wheels[] = ["Two", "Three", "Four"];
const VEHICLE_ORDER: VehicleType[] = [
  "Bike", "Scooty", "Auto", "SUV", "Sedan", "MUV", "Hatchback", "Van", "Truck",
];
const FUEL_ORDER: FuelType[] = ["Petrol", "Diesel", "EV", "CNG", "LPG", "Hybrid"];

// Composite index from 4 dimensions using mixed-radix encoding.
// idx = ((p * 3 + w) * 9 + v) * 6 + f. Range 0..647.
function combineIdx(p: number, w: number, v: number, f: number): number {
  return ((p * 3 + w) * 9 + v) * 6 + f;
}

// Encode partner attributes -> 2-letter combo AA..ZZ.
// Some real-world combos are nonsensical (e.g., 2-wheeler SUV) but the codec stays mathematical;
// validation of plausibility is the caller's responsibility (signup form constraints).
export function encodePartnerCombo(
  platform: Platform,
  wheels: Wheels,
  vehicle: VehicleType,
  fuel: FuelType
): string {
  const p = PLATFORM_ORDER.indexOf(platform);
  const w = WHEELS_ORDER.indexOf(wheels);
  const v = VEHICLE_ORDER.indexOf(vehicle);
  const f = FUEL_ORDER.indexOf(fuel);
  if (p < 0) throw new Error(`Unknown platform: ${platform}`);
  if (w < 0) throw new Error(`Unknown wheels: ${wheels}`);
  if (v < 0) throw new Error(`Unknown vehicle: ${vehicle}`);
  if (f < 0) throw new Error(`Unknown fuel: ${fuel}`);
  const idx = combineIdx(p, w, v, f);
  // Split into base-26 high/low → letters A-Z each.
  const hi = Math.floor(idx / 26);
  const lo = idx % 26;
  return String.fromCharCode(65 + hi) + String.fromCharCode(65 + lo);
}

// Decode 2-letter combo -> partner attributes. Inverse of encodePartnerCombo.
export function decodePartnerCombo(combo: string): {
  platform: Platform;
  wheels: Wheels;
  vehicle: VehicleType;
  fuel: FuelType;
} {
  if (combo.length !== 2) throw new Error(`Partner combo must be 2 chars: ${combo}`);
  const upper = combo.toUpperCase();
  const hi = upper.charCodeAt(0) - 65;
  const lo = upper.charCodeAt(1) - 65;
  if (hi < 0 || hi > 25 || lo < 0 || lo > 25) {
    throw new Error(`Invalid partner combo (non-letter): ${combo}`);
  }
  const idx = hi * 26 + lo;
  if (idx > 647) throw new Error(`Partner combo out of range (>647): ${combo}`);
  // Reverse mixed-radix: f = idx%6; idx/=6; v = idx%9; idx/=9; w = idx%3; p = idx/3.
  const f = idx % 6;
  const r1 = Math.floor(idx / 6);
  const v = r1 % 9;
  const r2 = Math.floor(r1 / 9);
  const w = r2 % 3;
  const p = Math.floor(r2 / 3);
  return {
    platform: PLATFORM_ORDER[p],
    wheels: WHEELS_ORDER[w],
    vehicle: VEHICLE_ORDER[v],
    fuel: FUEL_ORDER[f],
  };
}
