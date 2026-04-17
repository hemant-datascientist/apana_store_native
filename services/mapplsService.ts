// ============================================================
// MAPPLS SERVICE — Apana Store (Customer App)
//
// Centralised wrapper for all MapMyIndia (Mappls) API calls:
//   - OAuth token management (auto-refreshes before expiry)
//   - Reverse Geocoding  → lat/lng → address
//   - Place Autosuggest  → query string → suggestions list
//   - Place Details      → eLoc → full address
//
// Keys: Fill in from https://apis.mappls.com/console/
//   CLIENT_ID     → "Client ID" in your Mappls project
//   CLIENT_SECRET → "Client Secret" in your Mappls project
//   REST_KEY      → "Rest API Key" in your Mappls project
//
// Backend note:
//   In production, token exchange should happen server-side
//   to avoid exposing CLIENT_SECRET in the app bundle.
//   Replace getToken() with a call to your own token endpoint.
// ============================================================

// ── Mappls credentials — fill in from Mappls developer console ──
const CLIENT_ID     = "YOUR_MAPPLS_CLIENT_ID";
const CLIENT_SECRET = "YOUR_MAPPLS_CLIENT_SECRET";
const REST_KEY      = "YOUR_MAPPLS_REST_KEY";

// ── API base URLs ─────────────────────────────────────────────
const TOKEN_URL      = "https://outpost.mappls.com/api/security/oauth/token";
const AUTOSUGGEST_URL= "https://atlas.mappls.com/api/places/search/json";
const REV_GEOCODE_URL= `https://apis.mappls.com/advancedmaps/v1/${REST_KEY}/rev_geocode`;

// ── Cached OAuth token ────────────────────────────────────────
let _accessToken:  string | null = null;
let _tokenExpiry:  number        = 0;   // epoch ms when token expires

// ── Types ─────────────────────────────────────────────────────

export interface PlaceSuggestion {
  eLoc:         string;   // Mappls unique place ID
  placeName:    string;   // Short display name
  placeAddress: string;   // Full formatted address
  city:         string;
  state:        string;
  pincode:      string;
  lat:          number;
  lng:          number;
}

export interface ReverseGeocodeResult {
  formattedAddress: string;
  area:             string;   // locality / suburb
  city:             string;
  state:            string;
  pincode:          string;
}

// ── OAuth token ───────────────────────────────────────────────

async function getToken(): Promise<string> {
  // Return cached token if still valid (with 60 s buffer)
  if (_accessToken && Date.now() < _tokenExpiry - 60_000) {
    return _accessToken;
  }

  const res = await fetch(TOKEN_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  if (!res.ok) throw new Error(`Mappls token error: ${res.status}`);

  const data = await res.json();
  _accessToken = data.access_token as string;
  _tokenExpiry = Date.now() + (data.expires_in as number) * 1_000;
  return _accessToken;
}

// ── Reverse Geocoding ─────────────────────────────────────────
// Convert a GPS lat/lng into a readable address.

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeResult | null> {
  try {
    const res = await fetch(`${REV_GEOCODE_URL}?lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;

    const data = await res.json();
    const r    = data?.results?.[0];
    if (!r) return null;

    return {
      formattedAddress: r.formatted_address ?? "",
      area:             r.area             ?? r.subDistrict ?? "",
      city:             r.city             ?? "",
      state:            r.state            ?? "",
      pincode:          r.pincode          ?? "",
    };
  } catch {
    return null;
  }
}

// ── Place Autosuggest ─────────────────────────────────────────
// Returns a list of matching place suggestions for a query string.

export async function autosuggest(query: string): Promise<PlaceSuggestion[]> {
  if (!query.trim()) return [];
  try {
    const token = await getToken();
    const url   = `${AUTOSUGGEST_URL}?query=${encodeURIComponent(query)}&region=IND&tokenizeAddress=true`;
    const res   = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];

    const data        = await res.json();
    const suggestions = (data?.suggestedLocations ?? []) as any[];

    return suggestions.map(s => ({
      eLoc:         s.eLoc         ?? "",
      placeName:    s.placeName    ?? "",
      placeAddress: s.placeAddress ?? "",
      city:         s.addressTokens?.city     ?? s.city    ?? "",
      state:        s.addressTokens?.state    ?? s.state   ?? "",
      pincode:      s.addressTokens?.pincode  ?? s.pincode ?? "",
      lat:          parseFloat(s.latitude  ?? "0"),
      lng:          parseFloat(s.longitude ?? "0"),
    }));
  } catch {
    return [];
  }
}
