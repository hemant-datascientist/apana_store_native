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

import {
  latLngToCell,
  cellToLatLng,
  cellToBoundary,
  cellToParent,
  gridDisk,
  gridDistance,
  isValidCell,
} from "h3-js";

// Standard Apana resolutions — mirror @apana/geo on backend.
export const H3_RES = {
  HOT:        9,  // store hot-index, partner marker snap
  DISCOVERY:  8,  // map view bucket
  CITY:       7,
  REGION:     6,
} as const;

export type H3Resolution = typeof H3_RES[keyof typeof H3_RES];

export {
  latLngToCell,
  cellToLatLng,
  cellToBoundary,
  cellToParent,
  gridDisk,
  gridDistance,
  isValidCell,
};

// Hot-path cell for a lat/lng (R9 ~150m).
export function cellHot(lat: number, lng: number): string {
  return latLngToCell(lat, lng, H3_RES.HOT);
}

// K=2 ring for q-commerce default nearby lookup (~19 cells, ~600m diameter).
export function ringHot(cell: string, k: number = 2): string[] {
  return gridDisk(cell, k);
}
