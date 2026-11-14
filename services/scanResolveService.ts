// ============================================================
// SCAN RESOLVE — the one decode entry point (backend GET /api/resolve).
//
// A scanned code (GTIN, APN, per-pack serial, in-store code, APC, or a full
// Digital Link URL) goes to the server, which says what it is and which shops
// stock it. The phone's own position rides along when known: the server keeps
// only the district and a coarse H3 r5 cell, and uses it to spot copied pack
// serials and fakes sold where no Apana shop stocks the brand (0191).
//
// The DEVICE fix is sent, never the delivery address — the address is where
// goods go, not where the pack was scanned.
// ============================================================

import { APC_BASE_URL } from "./apc";

const API_ORIGIN = APC_BASE_URL.replace(/\/api\/apc$/, "");

export interface ScanStore {
  seller_product_id: string;
  store_id: string;
  store_name: string;
  city: string;
  price_cents: number;
  stock_qty: number;
}

export interface ScanResolve {
  code: string;
  kind: "gtin" | "apn" | "internal" | "apc" | "unknown";
  found: boolean;
  product: { name: string | null; brand: string | null; verified: boolean } | null;
  stores: ScanStore[];
  register_hint: string | null;
  status?: "active" | "retired" | "suspended";
  notice?: string | null;
  authenticity?: "genuine" | "not_issued" | "possible_copy";
  authenticity_notice?: string | null;
}

export async function resolveScannedCode(
  code: string,
  where: { lat: number; lng: number } | null,
): Promise<ScanResolve> {
  const q = new URLSearchParams({ code });
  if (where && Number.isFinite(where.lat) && Number.isFinite(where.lng)) {
    q.set("lat", String(where.lat));
    q.set("lng", String(where.lng));
  }
  const res = await fetch(`${API_ORIGIN}/api/resolve?${q.toString()}`);
  if (!res.ok) throw new Error(`resolve failed (${res.status})`);
  return (await res.json()) as ScanResolve;
}
