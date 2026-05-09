// Apana internal barcode codec — generates EAN-13 compatible barcodes for products without real GTIN.
//
// Strategy: GS1 reserves prefixes 200-299 for "internal/restricted use within store" — barcodes in
// this range will never collide with real-world GTIN. Apana uses prefix "2" + platform marker "0".
//
// Layout (13 digits, EAN-13 compatible so retail scanners read it natively):
//   [0]    "2"  -> GS1 internal-use prefix
//   [1]    "0"  -> Apana platform marker (0=production; 1-9 reserved for future tiers)
//   [2..6] 5 digits -> Seller short code (capacity 100,000 sellers)
//   [7..11] 5 digits -> Per-seller product sequential (capacity 100,000 products per seller)
//   [12]   1 digit -> EAN-13 mod-10 checksum
//
// Storage: lives in seller_products.internal_barcode (NOT master_products) because each seller
// generates their own barcode for their own packaging, even when listing the same master product.

import { gtinChecksum } from "./gtinValidator";

// Static prefix bytes — never change without a format-version bump.
const APANA_PREFIX = "2";       // GS1 internal range
const APANA_PLATFORM = "0";     // production; 1-9 reserved

// Field widths — adjustments require migration of every existing internal barcode.
const SELLER_FIELD_WIDTH = 5;
const PRODUCT_FIELD_WIDTH = 5;

// Maximums implied by the field widths.
export const MAX_SELLER_CODE = 99999;
export const MAX_PRODUCT_SEQ = 99999;

// Encode (sellerCode, productSeq) -> 13-digit Apana internal EAN-13 string.
// Throws on out-of-range inputs to surface bugs early instead of silently truncating.
export function encodeInternalBarcode(sellerCode: number, productSeq: number): string {
  if (!Number.isInteger(sellerCode) || sellerCode < 0 || sellerCode > MAX_SELLER_CODE) {
    throw new Error(`sellerCode out of range [0, ${MAX_SELLER_CODE}]: ${sellerCode}`);
  }
  if (!Number.isInteger(productSeq) || productSeq < 0 || productSeq > MAX_PRODUCT_SEQ) {
    throw new Error(`productSeq out of range [0, ${MAX_PRODUCT_SEQ}]: ${productSeq}`);
  }
  const sellerStr = String(sellerCode).padStart(SELLER_FIELD_WIDTH, "0");
  const productStr = String(productSeq).padStart(PRODUCT_FIELD_WIDTH, "0");
  // Body = first 12 digits; checksum is the 13th.
  const body = `${APANA_PREFIX}${APANA_PLATFORM}${sellerStr}${productStr}`;
  const check = gtinChecksum(body);
  return `${body}${check}`;
}

// Decoded structure when an internal Apana barcode is parsed.
export interface DecodedInternalBarcode {
  prefix: string;        // always "2" for valid Apana internal
  platform: string;      // "0" today; future tiers may use 1-9
  sellerCode: number;
  productSeq: number;
  checksum: number;
}

// Decode a 13-digit Apana internal barcode -> structured fields.
// Throws if format does not match expected Apana layout (does NOT validate against real-world GTIN range).
export function decodeInternalBarcode(barcode: string): DecodedInternalBarcode {
  if (barcode.length !== 13) {
    throw new Error(`Internal barcode must be 13 digits: ${barcode}`);
  }
  if (!/^\d{13}$/.test(barcode)) {
    throw new Error(`Internal barcode must be all digits: ${barcode}`);
  }
  if (barcode[0] !== APANA_PREFIX) {
    throw new Error(`Not an Apana internal barcode (prefix !== "${APANA_PREFIX}"): ${barcode}`);
  }
  // Verify checksum so we surface scan/typo errors immediately.
  const body = barcode.slice(0, 12);
  const expected = gtinChecksum(body);
  const actual = parseInt(barcode[12], 10);
  if (expected !== actual) {
    throw new Error(`Internal barcode checksum mismatch (expected ${expected}, got ${actual}): ${barcode}`);
  }
  return {
    prefix: barcode[0],
    platform: barcode[1],
    sellerCode: parseInt(barcode.slice(2, 2 + SELLER_FIELD_WIDTH), 10),
    productSeq: parseInt(barcode.slice(2 + SELLER_FIELD_WIDTH, 2 + SELLER_FIELD_WIDTH + PRODUCT_FIELD_WIDTH), 10),
    checksum: actual,
  };
}

// Quick test: is this barcode an Apana internal one?
// Cheap path used by scanner flows before deciding which lookup table to query.
export function isInternalBarcode(barcode: string): boolean {
  return barcode.length === 13 && barcode[0] === APANA_PREFIX;
}
