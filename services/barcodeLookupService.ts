// Barcode lookup service — wires scanner output to product/master/seller resolution.
//
// V1 implementation: pure mock lookup over local data. Backend swap = replace `lookupBarcode`
// body with a fetch() to the lookup endpoint. Public types stay stable so callers do not change.
//
// Routing:
//   - barcode starts with "2" -> Apana internal -> match against seller_products.internal_barcode
//   - otherwise              -> real GTIN -> normalize to GTIN-14 -> match master_products.barcode_gtin
//
// Caller examples:
//   - Customer scanner.tsx: scan -> lookupBarcode -> show master + nearby sellers list.
//   - Seller scanner: scan -> lookupBarcode -> if hit "Add to my store", if miss "Create new product".

import { validateGtin, isInternalApanaBarcode } from "./gtinValidator";
import { isInternalBarcode, decodeInternalBarcode } from "./barcodeCodec";

// Minimal shape returned to UI. UI never sees raw join — server / lookup flattens the override.
export interface BarcodeLookupSeller {
  sellerId: string;        // e.g., "s1"
  sellerName: string;
  pricePaise: number;      // per-seller price
  stockQty: number | null; // null = made-on-demand (food_live)
  distanceKm?: number;     // optional, populated when caller passes user location
}

export interface BarcodeLookupMaster {
  masterProductId: string;
  canonicalName: string;
  brand?: string;
  category?: string;
  defaultImageUrl?: string;
  defaultUnit?: string;
  defaultSize?: string;
}

// One return shape covers both tiers — `master` is always present; `sellers` lists per-seller listings.
export interface BarcodeLookupResult {
  master: BarcodeLookupMaster;
  sellers: BarcodeLookupSeller[];
  source: "real-gtin" | "internal-apana";
}

// Distinct miss reasons so UI can branch:
//   - "no-master" -> show "create new product" CTA (scan didn't match any catalog entry).
//   - "no-sellers" -> show "no sellers near you" (master exists but no listings).
//   - "invalid"   -> show "Invalid barcode" (failed checksum / format).
export type BarcodeLookupMiss =
  | { hit: false; reason: "no-master"; barcode: string }
  | { hit: false; reason: "no-sellers"; master: BarcodeLookupMaster; barcode: string }
  | { hit: false; reason: "invalid"; barcode: string; detail: string };

export type BarcodeLookupResponse =
  | ({ hit: true } & BarcodeLookupResult)
  | BarcodeLookupMiss;

// =========================================================================
// Mock data — V1 only. Replace with backend join at swap time.
// =========================================================================

// A small mock catalog. Real backend reads master_products + seller_products and joins.
const MOCK_MASTER: Record<string, BarcodeLookupMaster> = {
  // Real GTIN-13 example — Maggi 70g (illustrative — not the real Nestle GTIN).
  "00890123456786": {
    masterProductId: "mp_maggi_70g",
    canonicalName: "Maggi 2-Minute Noodles",
    brand: "Nestle",
    category: "Grocery / Instant Food",
    defaultImageUrl: "https://example.invalid/maggi.jpg",
    defaultUnit: "pack",
    defaultSize: "70g",
  },
};

// Mock seller listings keyed by master_product_id (real backend joins via FK).
const MOCK_SELLER_BY_MASTER: Record<string, BarcodeLookupSeller[]> = {
  "mp_maggi_70g": [
    { sellerId: "s1", sellerName: "Sharma General Store", pricePaise: 1400, stockQty: 42 },
    { sellerId: "s2", sellerName: "TechZone Electronics", pricePaise: 1500, stockQty: 0 },
  ],
};

// Mock internal-barcode index — keyed by full 13-digit Apana code.
// Each entry encodes a single seller's listing of one master product.
const MOCK_INTERNAL: Record<string, { master: BarcodeLookupMaster; seller: BarcodeLookupSeller }> = {
  // Pre-computed example: sellerCode=1, productSeq=42 -> encoded barcode (use barcodeCodec.encodeInternalBarcode in real flows).
  // Hand-built here for demo; production never hand-rolls these.
  "2000001000420": {
    master: {
      masterProductId: "mp_local_rice_1kg",
      canonicalName: "Local Sona Masoori Rice",
      category: "Grocery / Staples",
      defaultUnit: "kg",
      defaultSize: "1kg",
    },
    seller: { sellerId: "s1", sellerName: "Sharma General Store", pricePaise: 9000, stockQty: 18 },
  },
};

// =========================================================================
// Public API
// =========================================================================

// Lookup a scanned barcode and return master + per-seller listings (or a structured miss).
// Frontend mock today; swap body to fetch() once backend lookup endpoint is live.
export async function lookupBarcode(rawBarcode: string): Promise<BarcodeLookupResponse> {
  // Internal-Apana path: skip GTIN validation length checks since internal codes are always 13.
  if (isInternalBarcode(rawBarcode)) {
    try {
      // decodeInternalBarcode also validates checksum — surfaces invalid scans.
      decodeInternalBarcode(rawBarcode);
    } catch (e: any) {
      return { hit: false, reason: "invalid", barcode: rawBarcode, detail: e.message };
    }
    const entry = MOCK_INTERNAL[rawBarcode];
    if (!entry) {
      return { hit: false, reason: "no-master", barcode: rawBarcode };
    }
    return {
      hit: true,
      master: entry.master,
      sellers: [entry.seller],
      source: "internal-apana",
    };
  }

  // Real-GTIN path: validate first; reject malformed / wrong-length inputs.
  const validation = validateGtin(rawBarcode);
  if (!validation.valid || !validation.normalized) {
    return {
      hit: false,
      reason: "invalid",
      barcode: rawBarcode,
      detail: validation.reason || "Invalid GTIN",
    };
  }
  // Defensive: if validation reports the normalized form starts as Apana internal, we have a logic bug
  // (should have been caught above). Fall through but flag for diagnostics.
  if (isInternalApanaBarcode(validation.normalized)) {
    return {
      hit: false,
      reason: "invalid",
      barcode: rawBarcode,
      detail: "Routing error: internal barcode reached real-GTIN path",
    };
  }
  const master = MOCK_MASTER[validation.normalized];
  if (!master) {
    return { hit: false, reason: "no-master", barcode: rawBarcode };
  }
  const sellers = MOCK_SELLER_BY_MASTER[master.masterProductId] || [];
  if (sellers.length === 0) {
    return { hit: false, reason: "no-sellers", master, barcode: rawBarcode };
  }
  return {
    hit: true,
    master,
    sellers,
    source: "real-gtin",
  };
}

// Convenience helper for UIs that just want a yes/no plus the miss reason.
export function summarizeLookup(r: BarcodeLookupResponse): string {
  if (r.hit) return `Found: ${r.master.canonicalName} at ${r.sellers.length} seller(s)`;
  if (r.reason === "invalid") return `Invalid barcode: ${r.detail}`;
  if (r.reason === "no-master") return `No catalog match for ${r.barcode}`;
  return `Catalog match (${r.master.canonicalName}) but no sellers nearby`;
}
