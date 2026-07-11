// ============================================================
// h3 shim — Customer app (apana_store_native).
//
// Pure-JS h3-js. Works in Expo Go + dev build, no native step.
// Single import surface so we can swap to a native binding later
// without touching call sites. See §19.1 of
// final_fullstack_ecommerce_qcommerce_architecture_markdown.md.
//
// Customer use-cases:
//   - K-ring lookup for "stores near me" (§19.3, K=2 default)
//   - Cell-keyed spatial cache (§19.6)
//   - Hex-snap fallback when partner GPS dies (§19.5)
// ============================================================

// Side-effect import FIRST — installs a utf-16le-capable TextDecoder
// before h3-js's emscripten glue constructs one at load time. Expo
// SDK 55's TextDecoder throws RangeError on 'utf-16le' otherwise,
// crashing the bundle the moment this module is imported.
import "../polyfills/textDecoder";
import {
  latLngToCell,
  cellToLatLng,
  cellToBoundary,
  cellToParent,
  cellsToMultiPolygon,
  gridDisk,
  gridDistance,
  isValidCell,
} from "h3-js";

// The single Apana resolution — mirror @apana/geo on backend. r8 ONLY:
// one grid for the partition, store/partner cell, discovery and ETA.
// Precision comes from lat/lng + Mappls DIGIPIN, not a finer hex.
export const H3_RES = {
  DISCOVERY: 8,  // ~460 m — THE grid
} as const;

export type H3Resolution = typeof H3_RES[keyof typeof H3_RES];

export {
  latLngToCell,
  cellToLatLng,
  cellToBoundary,
  cellToParent,
  cellsToMultiPolygon,
  gridDisk,
  gridDistance,
  isValidCell,
};

// The r8 index cell for a lat/lng.
export function cellHot(lat: number, lng: number): string {
  return latLngToCell(lat, lng, H3_RES.DISCOVERY);
}

// K=2 ring for q-commerce default nearby lookup (19 cells, ~2 km across at r8).
export function ringHot(cell: string, k: number = 2): string[] {
  return gridDisk(cell, k);
}
