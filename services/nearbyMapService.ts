// ============================================================
// NEARBY MAP SERVICE — Apana Store (Customer App)
//
// Typed request/response interfaces for fetching store pins
// for the Map View discovery feed, plus a stub function that
// simulates the backend API.
//
// To wire the real backend: replace the stub body inside
// fetchNearbyMapPins() with a fetch() call — no component
// changes needed. Swap pinX/pinY for real lat/lng from the
// backend and pass them to MapplsMapView markers.
//
// Endpoint:
//   GET /stores/nearby?lat=<lat>&lng=<lng>&radius=<km>
//   → StoreMapPin[]
// ============================================================

import { StoreMapPin, MOCK_MAP_PINS } from "../data/nearbyMapData";

// Re-export type so importers only need this service file
export type { StoreMapPin };

// ── Request params ────────────────────────────────────────────
export interface FetchNearbyMapParams {
  lat?:      number;   // user's current latitude  (from Mappls / GPS)
  lng?:      number;   // user's current longitude (from Mappls / GPS)
  radiusKm?: number;   // search radius, default 5 km
}

// ── fetchNearbyMapPins ────────────────────────────────────────
// GET /stores/nearby
//
// Returns store pins within `radiusKm` of (lat, lng).
// Real backend returns lat/lng per pin; wire those to
// MapplsMapView marker coordinates.
//
// Real backend call: uncomment the fetch block below and remove
// the stub.
export async function fetchNearbyMapPins(
  params: FetchNearbyMapParams = {},
): Promise<StoreMapPin[]> {
  // TODO: replace stub with real call ↓
  // const qp = new URLSearchParams({
  //   lat:    String(params.lat    ?? 18.5204),   // fallback: Pune
  //   lng:    String(params.lng    ?? 73.8567),
  //   radius: String(params.radiusKm ?? 5),
  // });
  // const res = await fetch(`${API_BASE}/stores/nearby?${qp}`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // if (!res.ok) {
  //   const err = await res.json().catch(() => ({}));
  //   throw new Error(err.message ?? `Nearby fetch failed (${res.status})`);
  // }
  // return res.json() as Promise<StoreMapPin[]>;

  // ── Simulate ~400 ms network latency ─────────────────────────
  await new Promise(r => setTimeout(r, 400));

  return MOCK_MAP_PINS;
}
