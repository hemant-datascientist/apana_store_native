// Seller (legal-type × platform) combo encoding.
// 6 legal types × 4 platforms = 24 combinations → mapped to single A-X letter.
//
// Why a single combined char (not separate chars for legal and platform):
//   24 combos fits in 26 letters with 2 spare; a single char keeps the seller ID the same length as customer ID.
// Slots Y, Z are reserved for future legal/platform additions (one extra of either dimension still fits).

import { Platform } from "./shared_codes";

// Seller legal entity type. Matches signup form options.
export type LegalType =
  | "Individual"      // sole proprietor without registration
  | "SoleProprietor"  // registered sole prop
  | "Partnership"     // unregistered or registered partnership
  | "PvtLtd"          // private limited
  | "LLP"             // limited liability partnership
  | "Other";          // co-op, trust, society, etc.

// Stable index order for legal type. NEVER change — every existing seller ID depends on it.
const LEGAL_ORDER: LegalType[] = [
  "Individual",
  "SoleProprietor",
  "Partnership",
  "PvtLtd",
  "LLP",
  "Other",
];

// Stable index order for platform. NEVER change — must match seller signup mapping.
const PLATFORM_ORDER: Platform[] = ["Android", "iOS", "Windows", "Mac"];

// Encode (legal, platform) -> single combo letter A-X.
// Index formula: legalIdx * 4 + platformIdx. Range 0..23. ASCII 'A' (65) + idx.
export function encodeSellerCombo(legal: LegalType, platform: Platform): string {
  const li = LEGAL_ORDER.indexOf(legal);
  const pi = PLATFORM_ORDER.indexOf(platform);
  if (li < 0) throw new Error(`Unknown legal type: ${legal}`);
  if (pi < 0) throw new Error(`Unknown platform: ${platform}`);
  const idx = li * 4 + pi;
  // 0..23 -> 'A'..'X'
  return String.fromCharCode(65 + idx);
}

// Decode combo letter -> (legal, platform). Inverse of encodeSellerCombo.
export function decodeSellerCombo(letter: string): { legal: LegalType; platform: Platform } {
  if (letter.length !== 1) throw new Error(`Seller combo must be 1 char: ${letter}`);
  const idx = letter.toUpperCase().charCodeAt(0) - 65;
  if (idx < 0 || idx > 23) throw new Error(`Seller combo letter out of range A-X: ${letter}`);
  // Inverse of (li * 4 + pi).
  const li = Math.floor(idx / 4);
  const pi = idx % 4;
  return { legal: LEGAL_ORDER[li], platform: PLATFORM_ORDER[pi] };
}
