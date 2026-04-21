// ============================================================
// MAPPLS SERVICE — Apana Store
//
// Centralised wrapper for all MapMyIndia (Mappls) REST API calls:
//   - OAuth token management (auto-refreshes before expiry)
//   - Reverse Geocoding  → lat/lng → address
//   - Place Autosuggest  → query string → suggestions list
//   - Place Geocode      → eLoc / text → lat/lng
//   - Nearby Places      → category + lat/lng → POI list
//   - Route / ETA        → origin + destination → duration + distance
//
// Keys live in config/mapplsConfig.ts — fill them in once there.
//
// SECURITY NOTE:
//   Move getToken() to your backend before production so that
//   CLIENT_SECRET is never shipped in the app bundle.
// ============================================================

import {
  MAPPLS_CLIENT_ID,
  MAPPLS_CLIENT_SECRET,
  MAPPLS_REST_KEY,
  MAPPLS_TOKEN_URL,
  MAPPLS_AUTOSUGGEST_URL,
  MAPPLS_NEARBY_URL,
  MAPPLS_GEOCODE_URL,
  MAPPLS_REV_GEOCODE_URL,
  MAPPLS_ROUTE_URL,
} from "../config/mapplsConfig";

// ── Cached OAuth token ────────────────────────────────────────
let _accessToken: string | null = null;
let _tokenExpiry: number        = 0;   // epoch ms

// ── Shared types ──────────────────────────────────────────────

export interface PlaceSuggestion {
  eLoc:         string;
  placeName:    string;
  placeAddress: string;
  city:         string;
  state:        string;
  pincode:      string;
  lat:          number;
  lng:          number;
}

export interface ReverseGeocodeResult {
  formattedAddress: string;
  area:             string;
  city:             string;
  state:            string;
  pincode:          string;
}

export interface NearbyPlace {
  eLoc:         string;
  placeName:    string;
  placeAddress: string;
  lat:          number;
  lng:          number;
  distanceMetres: number;
  type:         string;   // category returned by Mappls
}

export interface RouteResult {
  distanceMetres: number;
  durationSeconds: number;
  durationText:   string;   // e.g. "12 mins"
  distanceText:   string;   // e.g. "3.2 km"
}

// ── getToken ──────────────────────────────────────────────────
// Fetches (or returns cached) Mappls OAuth access token.
// Move this call to your backend for production.
async function getToken(): Promise<string> {
  // Return cached token if still valid (60 s safety buffer)
  if (_accessToken && Date.now() < _tokenExpiry - 60_000) {
    return _accessToken;
  }

  const res = await fetch(MAPPLS_TOKEN_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    `grant_type=client_credentials&client_id=${MAPPLS_CLIENT_ID}&client_secret=${MAPPLS_CLIENT_SECRET}`,
  });

  if (!res.ok) throw new Error(`Mappls token error: ${res.status}`);

  const data       = await res.json();
  _accessToken     = data.access_token as string;
  _tokenExpiry     = Date.now() + (data.expires_in as number) * 1_000;
  return _accessToken!;
}

// ── reverseGeocode ────────────────────────────────────────────
// GPS lat/lng → human-readable address.
// Used in location-access screen after GPS fix.
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeResult | null> {
  try {
    const res = await fetch(
      `${MAPPLS_REV_GEOCODE_URL}?lat=${lat}&lng=${lng}`,
    );
    if (!res.ok) return null;

    const data = await res.json();
    const r    = data?.results?.[0];
    if (!r) return null;

    return {
      formattedAddress: r.formatted_address ?? "",
      area:             r.area              ?? r.subDistrict ?? "",
      city:             r.city              ?? "",
      state:            r.state             ?? "",
      pincode:          r.pincode           ?? "",
    };
  } catch {
    return null;
  }
}

// ── autosuggest ───────────────────────────────────────────────
// Debounced place search for the location-access + address-book screens.
// Returns up to 10 suggestions.
export async function autosuggest(query: string): Promise<PlaceSuggestion[]> {
  if (!query.trim()) return [];
  try {
    const token = await getToken();
    const url   = `${MAPPLS_AUTOSUGGEST_URL}?query=${encodeURIComponent(query)}&region=IND&tokenizeAddress=true`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];

    const data        = await res.json();
    const suggestions = (data?.suggestedLocations ?? []) as any[];

    return suggestions.map(s => ({
      eLoc:         s.eLoc            ?? "",
      placeName:    s.placeName       ?? "",
      placeAddress: s.placeAddress    ?? "",
      city:         s.addressTokens?.city    ?? s.city    ?? "",
      state:        s.addressTokens?.state   ?? s.state   ?? "",
      pincode:      s.addressTokens?.pincode ?? s.pincode ?? "",
      lat:          parseFloat(s.latitude  ?? "0"),
      lng:          parseFloat(s.longitude ?? "0"),
    }));
  } catch {
    return [];
  }
}

// ── geocodeELoc ───────────────────────────────────────────────
// Resolve a Mappls eLoc to full lat/lng + address details.
// Useful for resolving a suggestion tapped from autosuggest.
export async function geocodeELoc(eLoc: string): Promise<PlaceSuggestion | null> {
  if (!eLoc) return null;
  try {
    const token = await getToken();
    const url   = `${MAPPLS_GEOCODE_URL}?address=${eLoc}&region=IND`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const r    = data?.copResults?.[0] ?? data?.results?.[0];
    if (!r) return null;

    return {
      eLoc:         eLoc,
      placeName:    r.placeName    ?? "",
      placeAddress: r.placeAddress ?? "",
      city:         r.addressTokens?.city    ?? "",
      state:        r.addressTokens?.state   ?? "",
      pincode:      r.addressTokens?.pincode ?? "",
      lat:          parseFloat(r.latitude  ?? "0"),
      lng:          parseFloat(r.longitude ?? "0"),
    };
  } catch {
    return null;
  }
}

// ── nearbyPlaces ──────────────────────────────────────────────
// Finds points of interest within `radiusMetres` of a lat/lng.
// Used in map view and partner app to discover local POIs.
//
// keyword: Mappls category keyword e.g. "grocery store", "pharmacy",
//          "restaurant", "petrol pump", etc.
export async function nearbyPlaces(
  lat:           number,
  lng:           number,
  keyword:       string  = "store",
  radiusMetres:  number  = 5000,
): Promise<NearbyPlace[]> {
  try {
    const token = await getToken();
    const url   = `${MAPPLS_NEARBY_URL}?keywords=${encodeURIComponent(keyword)}&refLocation=${lat},${lng}&radius=${radiusMetres}&region=IND`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];

    const data        = await res.json();
    const places      = (data?.suggestedLocations ?? []) as any[];

    return places.map(p => ({
      eLoc:           p.eLoc         ?? "",
      placeName:      p.placeName    ?? "",
      placeAddress:   p.placeAddress ?? "",
      lat:            parseFloat(p.latitude  ?? "0"),
      lng:            parseFloat(p.longitude ?? "0"),
      distanceMetres: parseInt(p.distance    ?? "0", 10),
      type:           p.type         ?? "",
    }));
  } catch {
    return [];
  }
}

// ── getRoute ──────────────────────────────────────────────────
// Returns distance + ETA between two lat/lng points.
// Used in order-tracking to show partner ETA to customer.
export async function getRoute(
  originLat:  number,
  originLng:  number,
  destLat:    number,
  destLng:    number,
): Promise<RouteResult | null> {
  try {
    const token = await getToken();
    const url   = `${MAPPLS_ROUTE_URL}?origin=${originLat},${originLng}&destination=${destLat},${destLng}&region=IND&rtype=0&bearings=&radiuses=&steps=false`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;

    const data  = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;

    const distM = route.distance as number;
    const durS  = route.duration as number;

    const durMins = Math.ceil(durS / 60);
    const distKm  = (distM / 1000).toFixed(1);

    return {
      distanceMetres:  distM,
      durationSeconds: durS,
      durationText:    durMins < 60 ? `${durMins} min` : `${Math.floor(durMins / 60)} hr ${durMins % 60} min`,
      distanceText:    `${distKm} km`,
    };
  } catch {
    return null;
  }
}
