// ============================================================
// geo.ts — small great-circle helpers (WGS-84 sphere).
//
// Shared by the live-tracking layer: usePartnerMarker (§19.5)
// reckons a marker forward along a bearing; useMockPartnerFix
// drives a mock partner toward the customer the same way. Kept
// dependency-free and pure so both can import one source of truth.
// ============================================================

export const EARTH_M = 6_371_000; // mean Earth radius, metres
export const DEG = Math.PI / 180;

// Great-circle distance between two points, in metres (haversine).
export function distanceMeters(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const dLat = (bLat - aLat) * DEG;
  const dLng = (bLng - aLng) * DEG;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * DEG) * Math.cos(bLat * DEG) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.sqrt(h));
}

// Initial compass bearing a → b, degrees clockwise from north [0, 360).
export function bearingDeg(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const φ1 = aLat * DEG;
  const φ2 = bLat * DEG;
  const dλ = (bLng - aLng) * DEG;
  const y = Math.sin(dλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dλ);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

// Move a point `meters` along a compass bearing; returns the new lat/lng.
export function movePoint(
  lat: number,
  lng: number,
  bearing: number,
  meters: number,
): { lat: number; lng: number } {
  const br = bearing * DEG;
  const φ1 = lat * DEG;
  const λ1 = lng * DEG;
  const dr = meters / EARTH_M;
  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(dr) + Math.cos(φ1) * Math.sin(dr) * Math.cos(br),
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(br) * Math.sin(dr) * Math.cos(φ1),
      Math.cos(dr) - Math.sin(φ1) * Math.sin(φ2),
    );
  return { lat: φ2 / DEG, lng: λ2 / DEG };
}
