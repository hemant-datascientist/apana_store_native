// ============================================================
// COVERAGE GEO — Apana Store (Customer App)
//
// Offline resolver for the Store Coverage map. Bundles the real admin
// outlines for the customer's state (extracted from the Testing/ GADM
// data via tools/extract-coverage-geo.mjs) and point-in-polygons the
// customer's pin against them to return their TRUE sub-district
// (Nearest) and district (Long) shapes — no backend required.
//
// This is the same admin geometry the §19.10 partition is built from,
// so the offline shape matches what the backend serves. Outside the
// bundled state it returns null and the caller falls back to an H3
// approximation.
//
// Bundled JSON is required lazily so its parse cost is paid only when
// the coverage map is first opened, not at app start.
// ============================================================

export interface LatLng { lat: number; lng: number }
export type Ring = LatLng[];

export interface LocalCoverage {
  subdistrict: string;
  district:    string | null;
  state:       string;
  nearestRings: Ring[]; // sub-district outline
  longRings:    Ring[]; // district outline
}

// Bundled feature: rings are arrays of [lng, lat] pairs (GeoJSON order).
interface GeoFeature {
  district: string | null;
  name:     string | null;
  rings:    number[][][];
}
interface GeoFile {
  state:    string;
  level:    string;
  features: GeoFeature[];
}

let subs:      GeoFile | null = null;
let districts: GeoFile | null = null;

function load(): void {
  if (subs && districts) return;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  subs      = require("../assets/coverage/mh_subdistricts.json") as GeoFile;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  districts = require("../assets/coverage/mh_districts.json") as GeoFile;
}

// Ray-casting point-in-polygon. ring = [[lng,lat], …]; x=lng, y=lat.
function inRing(lat: number, lng: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i]![0]!, yi = ring[i]![1]!;
    const xj = ring[j]![0]!, yj = ring[j]![1]!;
    const hit =
      (yi > lat) !== (yj > lat) &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

function inFeature(lat: number, lng: number, f: GeoFeature): boolean {
  return f.rings.some((ring) => inRing(lat, lng, ring));
}

function toLatLngRings(rings: number[][][]): Ring[] {
  return rings.map((ring) => ring.map(([lng, lat]) => ({ lat: lat!, lng: lng! })));
}

// Some GADM sub-districts carry placeholder names ("n.a. ( 1612)") —
// fall back to the district label rather than showing the placeholder.
function cleanName(name: string | null, district: string | null): string {
  if (!name || /^n\.a\./i.test(name.trim())) return district ?? "your area";
  return name;
}

// Resolve a pin to its bundled sub-district + district outlines.
// Returns null when the pin isn't inside the bundled state.
export function resolveLocalCoverage(lat: number, lng: number): LocalCoverage | null {
  load();
  if (!subs || !districts) return null;

  const sub = subs.features.find((f) => inFeature(lat, lng, f));
  if (!sub) return null;

  const dist =
    sub.district != null
      ? districts.features.find((f) => f.name === sub.district)
      : undefined;

  return {
    subdistrict:  cleanName(sub.name, sub.district),
    district:     sub.district,
    state:        subs.state,
    nearestRings: toLatLngRings(sub.rings),
    longRings:    toLatLngRings(dist ? dist.rings : sub.rings),
  };
}
