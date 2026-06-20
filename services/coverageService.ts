// ============================================================
// COVERAGE SERVICE — Apana Store (Customer App)
//
// The real admin-area footprint the customer's Store Coverage covers,
// drawn on the Mappls map:
//   nearest → their sub-district   (Nearest Coverage)
//   long    → their whole district (Long Coverage)
//
// Contract (BE geolocation — live):
//   GET {API_BASE_URL}/stores/coverage?lat=&lng=
//   → { center, area:{subdistrict,district,state,…},
//       nearest:{name,res,rings[]}, long:{name,res,rings[]} }
//   rings are the area's boundary outline(s) — the FE draws each as a
//   map polygon, giving the customer their true admin-area shape.
//
// Mode gate (same as services/api/client.ts):
//   local|prod → real fetch; on failure DEGRADE to a local outline so
//                the map is never blank (flagged source:"local").
//   mock       → a local H3 outline around the pin. Names stay null
//                (§19.8 — never invent an area label we didn't resolve).
// ============================================================

import { latLngToCell, cellToParent, cellsToMultiPolygon, gridDisk, H3_RES } from "./h3";
import { resolveLocalCoverage } from "./coverageGeo";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE  = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `http://${TOWER_IP}:8000/api/customer`;

const FETCH_TIMEOUT_MS = 10_000;

// ── Result shape consumed by the preview ──────────────────────
export type LatLng = { lat: number; lng: number };
export type Ring   = LatLng[]; // a closed boundary loop

export interface CoverageScopeGeo {
  name:  string | null;
  res:   number;
  rings: Ring[]; // area outline(s) — draw each as a map polygon
}

export interface CoverageGeometry {
  center:  LatLng;
  area: {
    subdistrict: string | null;
    district:    string | null;
    state:       string | null;
  };
  nearest: CoverageScopeGeo;
  long:    CoverageScopeGeo;
  source:  "backend" | "local"; // honest provenance for the UI caption
}

// ── BE wire shape ─────────────────────────────────────────────
interface WireScope { name: string | null; res: number; rings: Ring[] }
interface WireCoverage {
  center: LatLng;
  area: {
    subdistrict: string | null;
    district:    string | null;
    state:       string | null;
  };
  nearest: WireScope;
  long:    WireScope;
}

function fromWire(w: WireCoverage): CoverageGeometry {
  return {
    center:  w.center,
    area:    w.area,
    nearest: { name: w.nearest.name, res: w.nearest.res, rings: w.nearest.rings ?? [] },
    long:    { name: w.long.name,    res: w.long.res,    rings: w.long.rings ?? [] },
    source:  "backend",
  };
}

// ── Live fetch ────────────────────────────────────────────────
async function fetchLive(lat: number, lng: number): Promise<CoverageGeometry> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `${BASE_URL}/stores/coverage?lat=${lat}&lng=${lng}`,
      { signal: ctl.signal },
    );
    if (!res.ok) throw new Error(`coverage ${res.status}`);
    return fromWire((await res.json()) as WireCoverage);
  } finally {
    clearTimeout(timer);
  }
}

// ── Mock / offline (local H3 outline around the pin) ──────────
// A k-ring of cells around the pin, traced to a single outline polygon —
// the same SHAPE language as the real area, just an approximation around
// the customer instead of the true admin border. Names stay null so the
// UI labels it honestly as approximate (§19.8).
const NEAREST_RES = 7;
const LONG_RES    = 6;

function localScope(lat: number, lng: number, res: number, k: number): CoverageScopeGeo {
  const rings: Ring[] = [];
  try {
    const center = cellToParent(latLngToCell(lat, lng, H3_RES.HOT), res);
    const cells  = gridDisk(center, k);
    const multi  = cellsToMultiPolygon(cells, false) as number[][][][];
    for (const poly of multi) {
      const outer = poly[0];
      if (outer && outer.length) {
        rings.push(outer.map(([la, ln]) => ({ lat: la, lng: ln })));
      }
    }
  } catch {
    // h3 hiccup — return an empty outline; the map + marker still render
  }
  return { name: null, res, rings };
}

// Real bundled admin outline (Testing/ GADM for the customer's state),
// resolved offline by point-in-polygon. The true sub-district / district
// shape + names — perfect without the backend. Null outside the bundle.
function fromBundledGeo(lat: number, lng: number): CoverageGeometry | null {
  const local = resolveLocalCoverage(lat, lng);
  if (!local) return null;
  return {
    center:  { lat, lng },
    area:    { subdistrict: local.subdistrict, district: local.district, state: local.state },
    nearest: { name: local.subdistrict, res: 0, rings: local.nearestRings },
    long:    { name: local.district,    res: 0, rings: local.longRings },
    source:  "local", // offline source, but real admin geometry + names
  };
}

function fetchMock(lat: number, lng: number): CoverageGeometry {
  // Prefer the real bundled admin outline; only fall to an H3 blob when
  // the pin is outside the bundled state (§19.8 — approximate, flagged).
  const real = fromBundledGeo(lat, lng);
  if (real) return real;
  return {
    center:  { lat, lng },
    area:    { subdistrict: null, district: null, state: null },
    nearest: localScope(lat, lng, NEAREST_RES, 2),
    long:    localScope(lat, lng, LONG_RES, 3),
    source:  "local",
  };
}

// ── Public entry — single swap surface ────────────────────────
// Live mode tries the backend first; if it's unreachable or the route
// isn't deployed yet, we DEGRADE to the local H3 approximation rather
// than leaving the map blank — the customer always sees their coverage
// shape, and the `source: "local"` flag lets the UI label it honestly
// as approximate (vs the true admin area the backend returns).
export async function fetchCoverageGeometry(
  lat: number,
  lng: number,
): Promise<CoverageGeometry> {
  if (IS_LIVE) {
    try {
      return await fetchLive(lat, lng);
    } catch {
      return fetchMock(lat, lng);
    }
  }
  return fetchMock(lat, lng);
}
