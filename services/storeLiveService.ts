// ============================================================
// STORE LIVE SERVICE — Apana Store (Customer App)
//
// Live store statistics for the Store Live screen (all-India or per-state).
//
// Contract (BE §13 stats surface, swap target):
//   GET {API_BASE_URL}/stores/live-stats[?state={stateKey}]
//   → {
//       scope: "india" | "state", state_key?, state_name?,
//       total_live, total_closed, as_of,           // ISO timestamp
//       breakdown: [{ type_key, label, full_label, live, closed }]
//     }
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
  scope:       "india" | "state";
  stateKey?:   string;
  stateName?:  string;
  totalLive:   number;
  totalClosed: number;
  asOf:        string;            // ISO timestamp of the snapshot
  breakdown:   StoreTypeData[];   // chart-ready (colors assigned)
}

export interface FetchStoreLiveParams {
  stateKey?:  string;
  stateName?: string;
  // Mock-mode only: state total from nav params, used to scale the bundled
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
  scope:        "india" | "state";
  state_key?:   string;
  state_name?:  string;
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
    stateKey:    w.state_key,
    stateName:   w.state_name,
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
  const qs  = params.stateKey ? `?state=${encodeURIComponent(params.stateKey)}` : "";
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

// ── Mock (bundled data; state scope scales the national mix) ──
function fetchMock(params: FetchStoreLiveParams): StoreLiveStats {
  const isState = Boolean(params.stateKey || params.stateName);
  const total   = isState ? (params.mockStateTotal ?? 0) : TOTAL_LIVE;
  const ratio   = TOTAL_LIVE > 0 ? total / TOTAL_LIVE : 0;

  const breakdown = isState
    ? STORE_LIVE_DATA.map(d => ({
        ...d,
        liveCount:   Math.round(d.liveCount * ratio),
        closedCount: Math.round(d.closedCount * ratio),
      }))
    : STORE_LIVE_DATA;

  return {
    scope:       isState ? "state" : "india",
    stateKey:    params.stateKey,
    stateName:   params.stateName,
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
