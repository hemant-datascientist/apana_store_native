// Shared encoding primitives used across role-specific lookups.
// Single source of truth for role/platform character mappings + base36 alphabet.
// Changing ANY value here invalidates every existing user ID — do NOT modify without a format-version bump.

// Platform that the user signed up from. Closed enum, only these 4 supported.
export type Platform = "Android" | "iOS" | "Windows" | "Mac";

// Single-char platform code embedded directly in customer IDs.
// (Seller/Partner platform information is folded into their combo letters instead.)
export const PLATFORM_TO_CODE: Record<Platform, string> = {
  Android: "A",
  iOS: "I",
  Windows: "W", // also represents "any other / web"
  Mac: "M",
};

// Reverse map for decoding. Built once at module load.
export const CODE_TO_PLATFORM: Record<string, Platform> = Object.fromEntries(
  Object.entries(PLATFORM_TO_CODE).map(([p, c]) => [c, p as Platform])
);

// Three role types in the ecosystem. Used as the leading char of every ID.
export type Role = "Customer" | "Seller" | "Partner";

// Role -> single-char code. C/S/P chosen for visual clarity.
export const ROLE_TO_CODE: Record<Role, string> = {
  Customer: "C",
  Seller: "S",
  Partner: "P",
};

// Reverse map for decoding the role char back to enum.
export const CODE_TO_ROLE: Record<string, Role> = Object.fromEntries(
  Object.entries(ROLE_TO_CODE).map(([r, c]) => [c, r as Role])
);

// Uppercase base36 alphabet — used for date encoding, random segment, checksum, state code.
// Index of each char IS its base36 numeric value (0..35).
export const BASE36 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Convert int 0..35 to base36 char. Throws on out-of-range to surface bugs early.
export function int36(n: number): string {
  if (n < 0 || n > 35 || !Number.isInteger(n)) {
    throw new Error(`int36 out of range: ${n}`);
  }
  return BASE36[n];
}

// Convert base36 char to int 0..35. Case-insensitive on input but lookup table is uppercase.
export function char36(c: string): number {
  const i = BASE36.indexOf(c.toUpperCase());
  if (i < 0) throw new Error(`Not base36: ${c}`);
  return i;
}
