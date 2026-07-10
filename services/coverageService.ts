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
//   local|prod → real fetch from the backend geolocation module.
//   mock / no backend / fetch failure → NOTHING (returns null). We never
//                fabricate a coverage shape around the pin — empty means
//                empty (§19.8). The map still renders with the "You" dot;
//                there is simply no polygon until the backend resolves one.
// ============================================================

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
  // Raw r8 coverage cells (H3 indexes) — the TRUE partition. When present the
  // map draws a honeycomb (one hexagon per cell). Omitted by the backend for
  // very large areas, where the map falls back to the dissolved `multi`.
  cells?: string[];
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
  source:  "backend"; // coverage geometry is backend-only (never fabricated)
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
  cells?: string[];
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
      cells: w.nearest.cells,
    },
    long: {
      name:  w.long.name,
      res:   w.long.res,
      rings: longRings,
      multi: w.long.multi?.length ? w.long.multi : ringsToMulti(longRings),
      cells: w.long.cells,
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

// ── Public entry — single swap surface ────────────────────────
// The coverage shape is BACKEND TRUTH only. Without a live backend — mock
// mode, an unreachable API, or a route that isn't deployed — we return
// null. The map still renders (centred on the pin, with the "You" dot), but
// no polygon is drawn: we never trace a fake ring around the customer to
// fill the space (§19.8 — empty means empty).
export async function fetchCoverageGeometry(
  lat: number,
  lng: number,
): Promise<CoverageGeometry | null> {
  if (!IS_LIVE) return null;
  try {
    return await fetchLive(lat, lng);
  } catch {
    return null;
  }
}
