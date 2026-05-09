// User ID codec for the Apana ecosystem (customer / seller / partner).
//
// Format spec (uppercase base36 throughout):
//   Customer: C + Platform(1) + State(1) + Date(3) + "-" + Random(8) + "-" + Checksum(1)   [16 chars]
//   Seller:   S + LegalPlatformCombo(1) + State(1) + Date(3) + "-" + Random(8) + "-" + Checksum(1) [16 chars]
//   Partner:  P + VehicleCombo(2) + State(1) + Date(3) + "-" + Random(8) + "-" + Checksum(1) [17 chars]
//
// Frontend usage: encode/decode for preview, validation, debug screens.
// Production rule: real ID generation MUST happen server-side at signup. Never trust a client-generated ID.
//
// Limitations to remember:
//   - 3-char date overflows around year 2046 (36³ = 46656 caps YYDDD).
//   - Partner combo is 96% full at 648/676; any new dimension value forces a format-version bump.
//   - Stable index orders in lookup files MUST NOT be reordered — would invalidate every existing ID.

import {
  Role,
  Platform,
  ROLE_TO_CODE,
  CODE_TO_ROLE,
  PLATFORM_TO_CODE,
  CODE_TO_PLATFORM,
  BASE36,
  int36,
  char36,
} from "./userIdLookups/shared_codes";
import {
  encodeState,
  decodeState,
} from "./userIdLookups/state_codes";
import {
  LegalType,
  encodeSellerCombo,
  decodeSellerCombo,
} from "./userIdLookups/seller_combo";
import {
  Wheels,
  VehicleType,
  FuelType,
  encodePartnerCombo,
  decodePartnerCombo,
} from "./userIdLookups/partner_combo";

// =========================================================================
// Date codec — YYDDD packed into 3 base36 chars (high-to-low).
// =========================================================================

// Day-of-year (1..366) for the given Date in UTC.
// Trick: Date.UTC(year, 0, 0) returns Dec 31 of (year-1) — diff in days = day-of-year (Jan 1 = 1).
function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const diff = d.getTime() - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Encode a Date -> 3-char base36 code.
// Algorithm: n = (year - 2000) * 1000 + dayOfYear; emit base36 high digit, mid, low.
// Per spec example: 07-05-2026 -> n=26127 -> "K5R".
export function encodeDate(d: Date): string {
  const yy = d.getUTCFullYear() - 2000;
  if (yy < 0) throw new Error(`Year before 2000 not supported: ${d.toISOString()}`);
  const ddd = dayOfYear(d);
  const n = yy * 1000 + ddd;
  // 36³ = 46656. Once n hits that, we lose the high digit. ~year 2046.
  if (n >= 46656) {
    throw new Error(
      `Date out of range for 3-char base36 (year ~2046+): ${d.toISOString()}. ` +
      `Bump ID format version before this point.`
    );
  }
  // Extract base36 digits high-to-low.
  const c2 = Math.floor(n / 1296) % 36; // 36² = 1296
  const c1 = Math.floor(n / 36) % 36;
  const c0 = n % 36;
  return int36(c2) + int36(c1) + int36(c0);
}

// Decode 3-char date code -> {year, dayOfYear}.
export function decodeDate(code: string): { year: number; dayOfYear: number } {
  if (code.length !== 3) throw new Error(`Date code must be 3 chars: ${code}`);
  const c2 = char36(code[0]);
  const c1 = char36(code[1]);
  const c0 = char36(code[2]);
  const n = c2 * 1296 + c1 * 36 + c0;
  const yy = Math.floor(n / 1000);
  const ddd = n % 1000;
  return { year: 2000 + yy, dayOfYear: ddd };
}

// =========================================================================
// Random codec — 8 uppercase base36 chars from CSPRNG.
// =========================================================================

// Length of the random segment. ~2.82 × 10¹² space per (role+state+date) bucket.
const RANDOM_LEN = 8;

// Get N cryptographically secure random bytes.
// Looks up globalThis.crypto which is supplied by:
//   - React Native: react-native-get-random-values (must be imported once at app entry).
//   - Web: window.crypto.
//   - Node 18+: built-in crypto global.
// Falls back to Math.random with a console warning — NEVER acceptable for production server-side IDs.
function getCryptoRandomBytes(n: number): Uint8Array {
  const c: any = (globalThis as any).crypto;
  if (c?.getRandomValues) {
    const buf = new Uint8Array(n);
    c.getRandomValues(buf);
    return buf;
  }
  // Last-resort fallback. Surfaced loudly so this never silently ships.
  // eslint-disable-next-line no-console
  console.warn(
    "[userIdCodec] CSPRNG unavailable — falling back to Math.random. " +
    "Do not use the resulting ID for anything beyond local preview."
  );
  const buf = new Uint8Array(n);
  for (let i = 0; i < n; i++) buf[i] = Math.floor(Math.random() * 256);
  return buf;
}

// Generate a random base36 segment of the given length.
// Maps each random byte (0-255) to a base36 digit via mod 36. Slight bias is acceptable here
// since the random portion already provides ~10¹² space per bucket.
export function generateRandom(len: number = RANDOM_LEN): string {
  const bytes = getCryptoRandomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += BASE36[bytes[i] % 36];
  }
  return out;
}

// =========================================================================
// Checksum — single base36 char from sum(charCode) mod 36.
// =========================================================================

// Compute checksum char for an ID body (everything before the trailing "-Checksum").
// Catches single-char typos and most transpositions when scanning or hand-typing IDs.
export function checksum(body: string): string {
  let sum = 0;
  for (let i = 0; i < body.length; i++) sum += body.charCodeAt(i);
  return BASE36[sum % 36];
}

// Verify a full ID's trailing checksum char. Returns true on match.
// Format requirement: "<body>-<checksumChar>" where the second-to-last char is "-".
export function verifyChecksum(fullId: string): boolean {
  if (fullId.length < 3) return false;
  const sep = fullId[fullId.length - 2];
  if (sep !== "-") return false;
  const body = fullId.slice(0, -2);
  const expected = fullId[fullId.length - 1];
  return checksum(body) === expected;
}

// =========================================================================
// High-level role-specific encode inputs.
// =========================================================================

export interface CustomerInput {
  platform: Platform;
  state: string;       // canonical name, e.g., "Andhra Pradesh"
  signupDate: Date;
}

export interface SellerInput {
  legal: LegalType;
  platform: Platform;
  state: string;
  signupDate: Date;
}

export interface PartnerInput {
  platform: Platform;
  state: string;
  signupDate: Date;
  wheels: Wheels;
  vehicle: VehicleType;
  fuel: FuelType;
}

// =========================================================================
// High-level encoders.
// =========================================================================

// Customer: C + platform(1) + state(1) + date(3) + "-" + random(8) + "-" + checksum(1)
export function encodeCustomerId(input: CustomerInput): string {
  const role = ROLE_TO_CODE.Customer;
  const plat = PLATFORM_TO_CODE[input.platform];
  if (!plat) throw new Error(`Unknown platform: ${input.platform}`);
  const st = encodeState(input.state);
  const dt = encodeDate(input.signupDate);
  const rand = generateRandom();
  const body = `${role}${plat}${st}${dt}-${rand}`;
  const cs = checksum(body);
  return `${body}-${cs}`;
}

// Seller: S + legalPlatformCombo(1) + state(1) + date(3) + "-" + random(8) + "-" + checksum(1)
export function encodeSellerId(input: SellerInput): string {
  const role = ROLE_TO_CODE.Seller;
  const combo = encodeSellerCombo(input.legal, input.platform);
  const st = encodeState(input.state);
  const dt = encodeDate(input.signupDate);
  const rand = generateRandom();
  const body = `${role}${combo}${st}${dt}-${rand}`;
  const cs = checksum(body);
  return `${body}-${cs}`;
}

// Partner: P + vehicleCombo(2) + state(1) + date(3) + "-" + random(8) + "-" + checksum(1)
export function encodePartnerId(input: PartnerInput): string {
  const role = ROLE_TO_CODE.Partner;
  const combo = encodePartnerCombo(input.platform, input.wheels, input.vehicle, input.fuel);
  const st = encodeState(input.state);
  const dt = encodeDate(input.signupDate);
  const rand = generateRandom();
  const body = `${role}${combo}${st}${dt}-${rand}`;
  const cs = checksum(body);
  return `${body}-${cs}`;
}

// =========================================================================
// Decoder — parses any role's ID back into structured fields.
// =========================================================================

// Discriminated union over role so callers get type-safe access to role-specific fields.
export type DecodedId =
  | {
      role: "Customer";
      platform: Platform;
      state: string;
      date: { year: number; dayOfYear: number };
      random: string;
    }
  | {
      role: "Seller";
      legal: LegalType;
      platform: Platform;
      state: string;
      date: { year: number; dayOfYear: number };
      random: string;
    }
  | {
      role: "Partner";
      platform: Platform;
      wheels: Wheels;
      vehicle: VehicleType;
      fuel: FuelType;
      state: string;
      date: { year: number; dayOfYear: number };
      random: string;
    };

// Decode a full ID string. Verifies checksum first; throws on mismatch / malformed input.
export function decodeId(fullId: string): DecodedId {
  if (!verifyChecksum(fullId)) {
    throw new Error(`Checksum mismatch — ID may be corrupted: ${fullId}`);
  }
  const parts = fullId.split("-");
  // Expect exactly 3 parts: head | random | checksum.
  if (parts.length !== 3) throw new Error(`Malformed ID (expected 2 hyphens): ${fullId}`);
  const [head, random] = parts;

  const roleChar = head[0];
  const role = CODE_TO_ROLE[roleChar];
  if (!role) throw new Error(`Unknown role char: ${roleChar}`);

  if (role === "Customer") {
    // C + plat(1) + state(1) + date(3) -> head length 6
    if (head.length !== 6) throw new Error(`Customer head length must be 6: ${head}`);
    const platform = CODE_TO_PLATFORM[head[1]];
    if (!platform) throw new Error(`Unknown platform char: ${head[1]}`);
    const state = decodeState(head[2]);
    const date = decodeDate(head.slice(3, 6));
    return { role: "Customer", platform, state, date, random };
  }

  if (role === "Seller") {
    // S + combo(1) + state(1) + date(3) -> head length 6
    if (head.length !== 6) throw new Error(`Seller head length must be 6: ${head}`);
    const { legal, platform } = decodeSellerCombo(head[1]);
    const state = decodeState(head[2]);
    const date = decodeDate(head.slice(3, 6));
    return { role: "Seller", legal, platform, state, date, random };
  }

  if (role === "Partner") {
    // P + combo(2) + state(1) + date(3) -> head length 7
    if (head.length !== 7) throw new Error(`Partner head length must be 7: ${head}`);
    const { platform, wheels, vehicle, fuel } = decodePartnerCombo(head.slice(1, 3));
    const state = decodeState(head[3]);
    const date = decodeDate(head.slice(4, 7));
    return { role: "Partner", platform, wheels, vehicle, fuel, state, date, random };
  }

  // Unreachable given Role union, but TS needs the throw for exhaustiveness.
  throw new Error(`Unhandled role: ${role as string}`);
}

// =========================================================================
// Re-exports for convenience so callers can import everything from this file.
// =========================================================================
export type { Role, Platform } from "./userIdLookups/shared_codes";
export type { LegalType } from "./userIdLookups/seller_combo";
export type { Wheels, VehicleType, FuelType } from "./userIdLookups/partner_combo";
