// ============================================================
// STORE LIVE SERVICE — Apana Store (Customer App)
//
// Live store statistics for the Store Live screen (all-India or per-state).
//
// Contract (BE modules/seller — live):
//   GET {API_BASE_URL}/stores/live-stats[?state={state}|?city={city}]
//   → {
//       scope: "india" | "state" | "city", state_name?, city_name?,
//       total_live, total_closed, as_of,           // ISO timestamp
//       breakdown: [{ type_key, label, full_label, live, closed }]
//     }
// Scope rules: state (bharat flow) wins over city (customer location);
// neither → all-India. The BE declares the scope it actually served and
// the screen labels off the response.
//
// Mode gate (same as services/api/client.ts):
//   EXPO_PUBLIC_API_MODE=local|prod → real fetch; errors PROPAGATE so the
//     screen shows a retry state — never silently falls back to mock
//     numbers in live mode (§19.8 no phantom data).
//   anything else (mock)           → bundled STORE_LIVE_DATA.
//
// Colors are a UI concern — assigned client-side from TYPE_COLORS by
// type_key (rotating fallback palette for unknown types), so the BE
// never ships hex codes.
// ============================================================

import { STORE_LIVE_DATA, TOTAL_LIVE, StoreTypeData } from "../data/storeLiveData";

export type { StoreTypeData };

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE  = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `http://${TOWER_IP}:8000/api/customer`;

const FETCH_TIMEOUT_MS = 10_000;

// ── Result shape consumed by the screen/charts ────────────────
export interface StoreLiveStats {
  scope:       "india" | "state" | "city";
  stateName?:  string;
  cityName?:   string;
  totalLive:   number;
  totalClosed: number;
  asOf:        string;            // ISO timestamp of the snapshot
  breakdown:   StoreTypeData[];   // chart-ready (colors assigned)
}

export interface FetchStoreLiveParams {
  stateKey?:  string;   // bharat flow — state scope (wins over city)
  stateName?: string;
  city?:      string;   // customer-location flow — city scope
  // Mock-mode only: scoped total from nav params, used to scale the bundled
  // national distribution. Ignored entirely in live mode.
  mockStateTotal?: number;
}

// ── BE wire shape ─────────────────────────────────────────────
interface WireBreakdownRow {
  type_key:   string;
  label:      string;
  full_label: string;
  live:       number;
  closed:     number;
}

interface WireStats {
  scope:        "india" | "state" | "city";
  state_name?:  string;
  city_name?:   string;
  total_live:   number;
  total_closed: number;
  as_of:        string;
  breakdown:    WireBreakdownRow[];
}

// ── Client-side color map (type_key → chart color) ────────────
const TYPE_COLORS: Record<string, string> = {
  // BE seller types (§18 sellers.type)
  retail:      "#22C55E",
  wholesale:   "#F97316",
  food_packed: "#EAB308",
  food_live:   "#EF4444",
  service:     "#8B5CF6",
  // legacy mock keys (bundled STORE_LIVE_DATA)
  kirana:      "#22C55E",
  fashion:     "#06B6D4",
  pharmacy:    "#84CC16",
  food:        "#EF4444",
  electronics: "#3B82F6",
  hardware:    "#F97316",
  beauty:      "#EC4899",
  other:       "#8B5CF6",
};
const FALLBACK_PALETTE = ["#22C55E", "#06B6D4", "#3B82F6", "#F97316", "#EC4899", "#8B5CF6", "#84CC16", "#EF4444"];

function colorFor(typeKey: string, index: number): string {
  return TYPE_COLORS[typeKey] ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}

function fromWire(w: WireStats): StoreLiveStats {
  return {
    scope:       w.scope,
    stateName:   w.state_name,
    cityName:    w.city_name,
    totalLive:   w.total_live,
    totalClosed: w.total_closed,
    asOf:        w.as_of,
    breakdown:   w.breakdown.map((row, i) => ({
      key:         row.type_key,
      label:       row.label,
      fullLabel:   row.full_label,
      liveCount:   row.live,
      closedCount: row.closed,
      color:       colorFor(row.type_key, i),
    })),
  };
}

// ── Live fetch ────────────────────────────────────────────────
async function fetchLive(params: FetchStoreLiveParams): Promise<StoreLiveStats> {
  // State (bharat) wins over city (customer location) — mirrors the BE rule.
  const qs = params.stateKey
    ? `?state=${encodeURIComponent(params.stateKey)}`
    : params.city
      ? `?city=${encodeURIComponent(params.city)}`
      : "";
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/stores/live-stats${qs}`, { signal: ctl.signal });
    if (!res.ok) throw new Error(`live-stats ${res.status}`);
    return fromWire((await res.json()) as WireStats);
  } finally {
    clearTimeout(timer);
  }
}

// ── Mock (bundled data; scoped views scale the national mix) ──
function fetchMock(params: FetchStoreLiveParams): StoreLiveStats {
  const isState  = Boolean(params.stateKey || params.stateName);
  const isCity   = !isState && Boolean(params.city);
  const isScoped = isState || isCity;
  const total    = isScoped ? (params.mockStateTotal ?? 0) : TOTAL_LIVE;
  const ratio    = TOTAL_LIVE > 0 ? total / TOTAL_LIVE : 0;

  const breakdown = isScoped
    ? STORE_LIVE_DATA.map(d => ({
        ...d,
        liveCount:   Math.round(d.liveCount * ratio),
        closedCount: Math.round(d.closedCount * ratio),
      }))
    : STORE_LIVE_DATA;

  return {
    scope:       isState ? "state" : isCity ? "city" : "india",
    stateName:   params.stateName,
    cityName:    isCity ? params.city : undefined,
    totalLive:   total,
    totalClosed: breakdown.reduce((acc, d) => acc + d.closedCount, 0),
    asOf:        new Date().toISOString(),
    breakdown,
  };
}

// ── Public entry — single swap surface ────────────────────────
export async function fetchStoreLiveStats(
  params: FetchStoreLiveParams = {},
): Promise<StoreLiveStats> {
  if (IS_LIVE) return fetchLive(params);
  return fetchMock(params);
}

// ── Per-state live counts (bharat screen badges) ──────────────
// GET /stores/live-stats/by-state → { as_of, states: [{ state_name, live }] }
// Returns a normalised-name → count map; states absent from the response
// have zero live stores. Returns null in mock mode — the bharat screen
// keeps its bundled per-state numbers there.
//
// Keys are normalised (lowercase, alphanumerics only) so "Tamil Nadu",
// "tamil_nadu" and bharatData keys all collide onto the same entry.
export const normalizeStateKey = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]/g, "");

export async function fetchStateLiveCounts(): Promise<Record<string, number> | null> {
  if (!IS_LIVE) return null;

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/stores/live-stats/by-state`, { signal: ctl.signal });
    if (!res.ok) throw new Error(`live-stats/by-state ${res.status}`);
    const body = (await res.json()) as { states: Array<{ state_name: string; live: number }> };
    const map: Record<string, number> = {};
    for (const row of body.states) map[normalizeStateKey(row.state_name)] = row.live;
    return map;
  } finally {
    clearTimeout(timer);
  }
}
