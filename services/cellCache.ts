// ============================================================
// CELL CACHE — Apana Store (Customer App)  ·  §19.6
//
// Cell-keyed spatial cache: stores indexed by their H3 cell, so map
// pan/zoom is instant on revisit. The map view computes the visible
// cells (a k-ring), asks for their stores, and only the cells NOT
// already cached hit the network.
//
// LRU, max 200 cells (~30 km² of r8 coverage — comfortably a whole
// city pan session). A plain Map is the LRU: JS Map keeps insertion
// order, so "delete + re-set" on read moves an entry to the recent
// end and the oldest key is always first.
//
// FE-first: fetchStoresByCells() is a mock stub today. To wire the
// backend, replace its body with:
//   GET /api/customer/stores/by-cells?cells=<csv>  ->  { [cell]: Store[] }
// — nothing else changes (§19.6 endpoint contract).
// ============================================================

import { latLngToCell, H3_RES } from "./h3";
import { StoreMapPin, MOCK_MAP_PINS } from "../data/nearbyMapData";

// ── tiny LRU (Map-backed, dependency-free) ────────────────────
class LRUCache<K, V> {
  private readonly map = new Map<K, V>();

  constructor(private readonly max: number) {}

  has(key: K): boolean {
    return this.map.has(key);
  }

  get(key: K): V | undefined {
    const val = this.map.get(key);
    if (val !== undefined) {
      // Touch — move this entry to the most-recently-used end.
      this.map.delete(key);
      this.map.set(key, val);
    }
    return val;
  }

  set(key: K, val: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.max) {
      // Evict the oldest (first-inserted) key.
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
  }

  clear(): void {
    this.map.clear();
  }

  get size(): number {
    return this.map.size;
  }
}

// ~200 cells ≈ ~30 km² at r8.
const MAX_CELLS = 200;
const cache = new LRUCache<string, StoreMapPin[]>(MAX_CELLS);

// ── backend fetch (stub) ──────────────────────────────────────
// Returns { [cell]: Store[] } for the requested cells. The stub
// buckets the mock pins by their r8 (DISCOVERY) cell so the cache
// behaves correctly offline. Every requested cell is answered — an
// empty cell stays empty, never back-filled with phantom pins
// (§19.8). The real endpoint replaces only this function body.
async function fetchStoresByCells(cells: string[]): Promise<Record<string, StoreMapPin[]>> {
  const want = new Set(cells);
  const out: Record<string, StoreMapPin[]> = {};
  for (const cell of cells) out[cell] = [];
  for (const pin of MOCK_MAP_PINS) {
    const cell = latLngToCell(pin.lat, pin.lng, H3_RES.DISCOVERY);
    if (want.has(cell)) out[cell]?.push(pin);
  }
  return out;
}

// ── public API ────────────────────────────────────────────────

// Stores across the given H3 cells. Cached cells return instantly;
// only misses hit fetchStoresByCells. Dedups by store id so a store
// near a cell edge is never returned twice.
export async function getStoresInCells(cells: string[]): Promise<StoreMapPin[]> {
  const miss = cells.filter((c) => !cache.has(c));
  if (miss.length > 0) {
    const fresh = await fetchStoresByCells(miss);
    for (const c of miss) cache.set(c, fresh[c] ?? []);
  }

  const seen = new Set<string>();
  const result: StoreMapPin[] = [];
  for (const c of cells) {
    for (const store of cache.get(c) ?? []) {
      if (!seen.has(store.id)) {
        seen.add(store.id);
        result.push(store);
      }
    }
  }
  return result;
}

// Drop everything — call on logout or a hard refresh.
export function clearCellCache(): void {
  cache.clear();
}

// Cells currently warm in the cache (diagnostics / tests).
export function cachedCellCount(): number {
  return cache.size;
}
