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
  rings: Ring[]; // area outline(s) — legacy per-ring shape
  // GeoJSON MultiPolygon coordinates ([lng,lat], holes preserved where the
  // source has them) — the same shape language the Testing/ harness renders
  // through a single MapLibre fill layer. Preferred by the map.
  multi: number[][][][];
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
// `multi` = GeoJSON MultiPolygon coordinates the backend now serves
// (real GADM border from location_db.area_geometry). The FE only
// consumes it — all geometry work stays backend-side.
interface WireScope {
  name:   string | null;
  res:    number;
  rings:  Ring[];
  multi?: number[][][][];
}
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

// Each LatLng ring becomes one single-ring polygon of the MultiPolygon
// (the wire/bundle formats carry outer rings only, so no holes to keep).
function ringsToMulti(rings: Ring[]): number[][][][] {
  return rings
    .filter((ring) => ring.length >= 3)
    .map((ring) => [ring.map((pt) => [pt.lng, pt.lat])]);
}

function fromWire(w: WireCoverage): CoverageGeometry {
  const nearestRings = w.nearest.rings ?? [];
  const longRings    = w.long.rings ?? [];
  return {
    center:  w.center,
    area:    w.area,
    // Prefer the backend's real MultiPolygon (GADM border, holes intact);
    // rings→multi conversion is only the shim for older BE responses.
    nearest: {
      name:  w.nearest.name,
      res:   w.nearest.res,
      rings: nearestRings,
      multi: w.nearest.multi?.length ? w.nearest.multi : ringsToMulti(nearestRings),
    },
    long: {
      name:  w.long.name,
      res:   w.long.res,
      rings: longRings,
      multi: w.long.multi?.length ? w.long.multi : ringsToMulti(longRings),
    },
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
  let multi: number[][][][] = [];
  try {
    const center = cellToParent(latLngToCell(lat, lng, H3_RES.HOT), res);
    const cells  = gridDisk(center, k);
    // geojson mode: [lng,lat] closed loops, holes preserved — exactly what
    // the Testing/ harness feeds its MapLibre fill layer.
    multi = cellsToMultiPolygon(cells, true) as number[][][][];
    for (const poly of multi) {
      const outer = poly[0];
      if (outer && outer.length) {
        rings.push(outer.map(([ln, la]) => ({ lat: la, lng: ln })));
      }
    }
  } catch {
    // h3 hiccup — return an empty shape; the map + marker still render
  }
  return { name: null, res, rings, multi };
}

// Offline/mock = an honest H3 approximation around the pin, anywhere in
// India. The REAL admin shapes (all states) live backend-side only
// (location_db.area_geometry) — no admin geometry is bundled in the app,
// so the FE carries no backend work and no single-state special case.
function fetchMock(lat: number, lng: number): CoverageGeometry {
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
