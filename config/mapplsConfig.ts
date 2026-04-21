// ============================================================
// MAPPLS CONFIG — Apana Store
//
// Single source of truth for all MapMyIndia (Mappls) credentials.
// Fill these in from https://apis.mappls.com/console/
//
// HOW TO GET KEYS:
//   1. Sign up at https://apis.mappls.com/console/
//   2. Create a new project → copy the three values below.
//
// SECURITY NOTE:
//   REST_KEY is embedded in the Map JS SDK URL (unavoidable for
//   client-side map rendering). CLIENT_SECRET must NEVER be
//   shipped in a production build — move OAuth token exchange
//   to your backend when you wire the real API.
//
// Defaults (Pune) — used as map centre before GPS fix is obtained.
// ============================================================

// ── Mappls API credentials ────────────────────────────────────
export const MAPPLS_REST_KEY      = "20e19378c16c46a8092ad0a975d8de55";
export const MAPPLS_CLIENT_ID     = "96dHZVzsAuvuZ87v_HBxR2f53WY49kNwH7xqC1ut8Qbe1u0sILK9pHiEO7_Fna2jM-gEvRD_D2UYDXvtkLxGww==";
export const MAPPLS_CLIENT_SECRET = "lrFxI-iSEg9gIZLHW77UKxBNA1DejP3JlQG3qO7CGK7pD1uncZdCJ9X-KQmcKfjKyEB_1ccT0vBapPwJad_7WFb6MV6XlZk7";

// ── Default map centre (Pune, Maharashtra) ────────────────────
// Overridden by the user's real GPS location once permission is granted.
export const DEFAULT_LAT  = 18.5204;
export const DEFAULT_LNG  = 73.8567;
export const DEFAULT_ZOOM = 13;

// ── API base URLs ─────────────────────────────────────────────
export const MAPPLS_TOKEN_URL      = "https://outpost.mappls.com/api/security/oauth/token";
export const MAPPLS_AUTOSUGGEST_URL= "https://atlas.mappls.com/api/places/search/json";
export const MAPPLS_NEARBY_URL     = "https://atlas.mappls.com/api/places/nearby/json";
export const MAPPLS_GEOCODE_URL    = "https://atlas.mappls.com/api/places/geocode";
export const MAPPLS_REV_GEOCODE_URL= `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_KEY}/rev_geocode`;
export const MAPPLS_ROUTE_URL      = "https://routable.mappls.com/lifeapi/routing/v1/route";

// ── Map JS SDK CDN URLs (loaded inside the WebView) ──────────
export const MAPPLS_MAP_SDK_JS  = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_KEY}/map_sdk?layer=vector&v=3.0&ls=0`;
export const MAPPLS_MAP_SDK_CSS = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_KEY}/map_sdk_plugins?layer=vector&v=3.0`;
