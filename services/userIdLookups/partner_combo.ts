// Partner (platform x vehicle x fuel) combo encoding.
// 4 platform x 10 vehicle x 7 fuel = 280 combos -> mapped to 2-letter AA-ZZ.
//
// 🔴 RESTRUCTURED 2026-08-30, while zero partner IDs existed — the only moment
// it was free. It used to include WHEELS (4x3x9x6 = 648 of 676 slots, 96%
// full) and therefore could not fit a tenth vehicle:
//   +1 vehicle -> 4x3x10x6 = 720 > 676 (overflows)
// Wheels is derivable from the vehicle — a Bike is always two, an Auto three,
// an SUV four — so it carried nothing the vehicle did not while costing a
// factor of 3. Dropping it made room for Bicycle, which this app has always
// offered and the format could never encode, plus a "None" fuel for
// human-powered vehicles.
//
// Capacity now: 280 of 676. Real headroom again — but every value is an index
// into a PERMANENT identifier, so new ones are appended and none is reordered.
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
  | "Truck"
  // 🔴 Added 2026-08-30. This app has always offered a bicycle and the format
  // could not encode one, so a bicycle courier could be given no ID at all.
  | "Bicycle";

// Fuel type. EV/CNG/LPG/Hybrid included for India market reality.
// "None" is for human-powered vehicles. Calling a bicycle petrol to make it
// encodable would be a fabrication inside a permanent identifier.
export type FuelType =
  | "Petrol" | "Diesel" | "EV" | "CNG" | "LPG" | "Hybrid" | "None";

// Stable index orders. NEVER change — every existing partner ID depends on these orderings.
const PLATFORM_ORDER: Platform[] = ["Android", "iOS", "Windows", "Mac"];
// ⚠ WHEELS IS NO LONGER PART OF THE ID (2026-08-30). It is derivable from the
// vehicle — a Bike is always two, an Auto three, an SUV four — so it carried
// nothing the vehicle did not, while costing a factor of 3 in a combo that had
// reached 648 of 676 slots and could not fit a tenth vehicle.
//   was: 4 platforms x 3 wheels x 9 vehicles x 6 fuels = 648
//   now: 4 platforms x 10 vehicles x 7 fuels = 280
// ⚠ APPEND-ONLY below: an index here is an index into a permanent identifier.
const VEHICLE_ORDER: VehicleType[] = [
  "Bike", "Scooty", "Auto", "SUV", "Sedan", "MUV", "Hatchback", "Van", "Truck",
  "Bicycle",
];
const FUEL_ORDER: FuelType[] = [
  "Petrol", "Diesel", "EV", "CNG", "LPG", "Hybrid", "None",
];

// Composite index from 3 dimensions using mixed-radix encoding.
// idx = (p * 10 + v) * 7 + f. Range 0..279.
function combineIdx(p: number, v: number, f: number): number {
  return (p * 10 + v) * 7 + f;
}

// Encode partner attributes -> 2-letter combo AA..ZZ.
// Some real-world combos are nonsensical (e.g., 2-wheeler SUV) but the codec stays mathematical;
// validation of plausibility is the caller's responsibility (signup form constraints).
export function encodePartnerCombo(
  platform: Platform,
  vehicle: VehicleType,
  fuel: FuelType
): string {
  const p = PLATFORM_ORDER.indexOf(platform);
  const v = VEHICLE_ORDER.indexOf(vehicle);
  const f = FUEL_ORDER.indexOf(fuel);
  if (p < 0) throw new Error(`Unknown platform: ${platform}`);
  if (v < 0) throw new Error(`Unknown vehicle: ${vehicle}`);
  if (f < 0) throw new Error(`Unknown fuel: ${fuel}`);
  const idx = combineIdx(p, v, f);
  // Split into base-26 high/low → letters A-Z each.
  const hi = Math.floor(idx / 26);
  const lo = idx % 26;
  return String.fromCharCode(65 + hi) + String.fromCharCode(65 + lo);
}

// Decode 2-letter combo -> partner attributes. Inverse of encodePartnerCombo.
export function decodePartnerCombo(combo: string): {
  platform: Platform;
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
  if (idx > 279) throw new Error(`Partner combo out of range (>279): ${combo}`);
  // Reverse mixed-radix: f = idx%7; idx/=7; v = idx%10; p = idx/10.
  const f = idx % 7;
  const r1 = Math.floor(idx / 7);
  const v = r1 % 10;
  const p = Math.floor(r1 / 10);
  return {
    platform: PLATFORM_ORDER[p],
    vehicle: VEHICLE_ORDER[v],
    fuel: FUEL_ORDER[f],
  };
}
