// GTIN validator — accepts GTIN-8, GTIN-12 (UPC-A), GTIN-13 (EAN-13), GTIN-14.
//
// All GTINs use the same mod-10 checksum algorithm (right-to-left, alternating weights 3 and 1).
// Storage convention: normalize every valid GTIN to 14 digits by left-padding with zeros.
// This way master_products.barcode_gtin is a single uniform format for indexing/dedup.

// Closed enum of supported GTIN tiers — length determines tier.
export type GtinKind = "GTIN-8" | "GTIN-12" | "GTIN-13" | "GTIN-14";

// Map raw length to GtinKind. Returns null for invalid lengths.
export function gtinKindForLength(len: number): GtinKind | null {
  if (len === 8) return "GTIN-8";
  if (len === 12) return "GTIN-12";
  if (len === 13) return "GTIN-13";
  if (len === 14) return "GTIN-14";
  return null;
}

// Compute the mod-10 check digit for a string of digits (excluding the check digit itself).
// Algorithm (per GS1 spec, works for GTIN-8/12/13/14 uniformly):
//   - Walk digits right-to-left.
//   - Rightmost digit gets weight 3; next gets weight 1; alternate.
//   - Check digit = (10 - (sum % 10)) % 10.
export function gtinChecksum(digitsExcludingCheck: string): number {
  let sum = 0;
  for (let i = 0; i < digitsExcludingCheck.length; i++) {
    const d = parseInt(digitsExcludingCheck[digitsExcludingCheck.length - 1 - i], 10);
    if (Number.isNaN(d)) throw new Error(`Non-digit in GTIN: ${digitsExcludingCheck}`);
    // i=0 (rightmost of body) -> weight 3; i=1 -> weight 1; alternate.
    sum += d * (i % 2 === 0 ? 3 : 1);
  }
  return (10 - (sum % 10)) % 10;
}

// Result shape from validation.
export interface GtinValidation {
  valid: boolean;
  kind: GtinKind | null;
  normalized: string | null; // GTIN-14 form if valid; null otherwise
  reason?: string;           // human-readable failure reason if invalid
}

// Validate a barcode string. Returns valid=true only if all checks pass:
//   - String contains digits only (strips whitespace first).
//   - Length matches a known GTIN tier.
//   - Last digit equals computed mod-10 check digit.
export function validateGtin(raw: string): GtinValidation {
  const trimmed = raw.replace(/\s+/g, "");
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, kind: null, normalized: null, reason: "Non-digit characters present" };
  }
  const kind = gtinKindForLength(trimmed.length);
  if (!kind) {
    return { valid: false, kind: null, normalized: null, reason: `Invalid length: ${trimmed.length}` };
  }
  const body = trimmed.slice(0, -1);
  const expected = gtinChecksum(body);
  const actual = parseInt(trimmed[trimmed.length - 1], 10);
  if (expected !== actual) {
    return { valid: false, kind, normalized: null, reason: `Checksum mismatch (expected ${expected}, got ${actual})` };
  }
  // Pad to 14 for uniform storage.
  const normalized = trimmed.padStart(14, "0");
  return { valid: true, kind, normalized };
}

// Detect whether a given normalized GTIN-14 belongs to Apana's internal range.
// Internal codes are 13-digit EAN-13 strings starting with "2", padded to 14 with leading "0".
// So normalized GTIN-14 starts with "02" iff originally a 13-digit code beginning with "2".
export function isInternalApanaBarcode(normalized: string): boolean {
  return normalized.length === 14 && normalized.startsWith("02");
}
