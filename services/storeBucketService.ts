// ============================================================
// STORE BUCKETS — the Stores tabs, from real sellers.
//
//   GET /customer/stores/browse?bucket=&lat=&lng=&limit=
//
// The tabs map to buckets, and the mapping is NOT the obvious one:
//
//   Nearby / Map View  -> "local"         shops you can walk to
//   B2C                -> "brand_direct"  manufacturers + own-brand sellers
//   Wholesale          -> "wholesale"
//   Service Based      -> "service"
//
// ⚠ The app's "B2C" tab means brand/manufacturer-direct. The BACKEND's
// `channel: "b2c"` covers all 83 retail types INCLUDING every kirana — wiring
// this tab to that channel would fill the brand tab with exactly the
// neighbourhood shops it exists to separate out. Hence `brand_direct`.
//
// Only `local` is proximity-scoped. A manufacturer ships from wherever it ships
// from, so the others carry no distance and are ranked by rating instead.
// ============================================================

import { API_BASE_URL } from "./api/client";
import { ascStyle } from "../data/ascBadges";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
export const BUCKETS_LIVE = API_MODE === "local" || API_MODE === "prod";

const TIMEOUT_MS = 12_000;

export type StoreBucket = "local" | "brand_direct" | "wholesale" | "service";

/** The app's tab keys → the server's buckets. */
export const TAB_TO_BUCKET: Record<string, StoreBucket> = {
  nearby:        "local",
  map_view:      "local",
  b2c:           "brand_direct",
  wholesale:     "wholesale",
  service_based: "service",
};

export interface BucketStore {
  id: string;
  name: string;
  type: string;
  city: string | null;
  asc_code: string | null;
  category_label: string;
  lat: number | null;
  lng: number | null;
  /** null for non-proximity buckets — NOT 0, which would read as "next door". */
  distance_m: number | null;
  is_live: boolean;
  rating: number;
  review_count: number;
  /** ISO timestamp the shop joined Apana — the only honest source for "new".
   *  The New Launches screen ran on hand-written launch dates before this. */
  joined_at: string;
}

export interface BucketResult {
  bucket: StoreBucket;
  items: BucketStore[];
  total: number;
}

// ── Adapter: server row → the shape the tab cards already render ────────────
// The mock rows carried UI decoration (typeColor, bgColor, icon) that the API
// does not and should not return — colour is a client concern. Derived from the
// ASC code through the SAME `ascStyle` map the Nearby pins use, so a kirana
// looks like a kirana in every feed.
export interface StoreCardData {
  id: string;
  name: string;
  type: string;        // display label, e.g. "Kirana" / "Wholesale"
  typeColor: string;
  typeBg: string;
  rating: number;
  reviews: number;
  /** null when the bucket is not proximity-scoped — render nothing, not "0 km". */
  distanceKm: number | null;
  categories: string[];
  bgColor: string;
  icon: string;
  city: string | null;
  /** The shop pin. null when it never set one — directions must say so, not
   *  send someone to a defaulted city centre. */
  lat?: number;
  lng?: number;
}

const FALLBACK = {
  label: "Apana",
  icon: "storefront-outline",
  accentColor: "#0F4C81",
  iconBg: "#DBEAFE",
};

export function toCardData(s: BucketStore): StoreCardData {
  const st = ascStyle(s.asc_code);
  const label = s.category_label || st?.label || FALLBACK.label;
  const accent = st?.accentColor ?? FALLBACK.accentColor;
  const bg = st?.iconBg ?? FALLBACK.iconBg;
  return {
    id: s.id,
    name: s.name,
    type: label,
    typeColor: accent,
    typeBg: bg,
    rating: s.rating,
    reviews: s.review_count,
    distanceKm: s.distance_m == null ? null : Math.round((s.distance_m / 1000) * 10) / 10,
    // The server does not expose a per-store category list yet; the badge label
    // is the honest single value rather than an invented list.
    categories: label ? [label] : [],
    bgColor: bg,
    icon: st?.icon ?? FALLBACK.icon,
    city: s.city,
    // Carried, not dropped: the server has always returned these, and the card
    // discarding them is why every feed Directions button said "coming soon".
    lat: s.lat ?? undefined,
    lng: s.lng ?? undefined,
  };
}

export async function fetchStoresByBucket(
  bucket: StoreBucket,
  opts: {
    lat?: number | null;
    lng?: number | null;
    limit?: number;
    /** "newest" = most recently joined first, for the New Launches screen. */
    sort?: "default" | "newest";
  } = {},
): Promise<BucketResult> {
  // Off-backend the list is EMPTY, never mock. A fabricated shop is worse than
  // an empty tab: someone taps it, tries to order, and nothing exists (§19.8).
  if (!BUCKETS_LIVE) return { bucket, items: [], total: 0 };

  const qs = new URLSearchParams({ bucket });
  if (opts.lat != null && opts.lng != null) {
    qs.set("lat", String(opts.lat));
    qs.set("lng", String(opts.lng));
  }
  if (opts.limit) qs.set("limit", String(opts.limit));
  if (opts.sort === "newest") qs.set("sort", "newest");

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}/stores/browse?${qs.toString()}`, { signal: ctl.signal });
    if (!res.ok) throw new Error(`stores/browse ${res.status}`);
    const body = (await res.json()) as BucketResult;
    return { bucket, items: body.items ?? [], total: body.total ?? 0 };
  } finally {
    clearTimeout(timer);
  }
}
