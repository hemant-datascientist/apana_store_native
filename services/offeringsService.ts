// ============================================================
// Offerings — every way ONE product is sold nearby (§ unified_listing_model).
//
// An atta is an atta: the shop down the road scoops fresh chakki atta by the
// kilo, and the same shelf carries a sealed Aashirvaad 5 kg. Those used to be
// two catalogs; they are now one APC identity with several offerings, and this
// is the read that returns them.
//
//   GET /customer/catalog/offerings?variety=|family=|class=
//
// Most-specific filter wins (variety > family > class). Off-backend the hook
// returns an empty list rather than invented rows (§19.8).
// ============================================================

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
export const OFFERINGS_LIVE = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api/customer`;

const FETCH_TIMEOUT_MS = 10_000;

export type MeasureKind = "count" | "weight" | "volume" | "piece";

export interface Offering {
  id: string;
  seller_id: string;
  sale_mode: "packaged" | "loose";
  is_branded: boolean;
  // The trust signal when branded. null = the seller's own reputation carries it.
  brand: string | null;
  name: string;
  images: string[];
  apc_class_code: string | null;
  apc_family_code: string | null;
  apc_variety_code: string | null;
  measure_kind: MeasureKind;
  price_cents: number | null;             // packaged: per unit
  unit: string | null;
  price_per_measure_cents: number | null; // loose: per 100 base units, or per piece
  min_measure: number | null;
  step_measure: number | null;
  stock: number;                          // in the measure's base unit
  is_active: boolean;
}

export interface OfferingsOut {
  apc_class_code: string | null;
  apc_family_code: string | null;
  apc_variety_code: string | null;
  offerings: Offering[];
}

export type OfferingsFilter =
  | { variety: string }
  | { family: string }
  | { class: string };

export async function fetchOfferings(filter: OfferingsFilter): Promise<Offering[]> {
  if (!OFFERINGS_LIVE) return [];
  const qs = new URLSearchParams(filter as Record<string, string>).toString();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/catalog/offerings?${qs}`, { signal: ctrl.signal });
    if (!res.ok) return [];
    const body = (await res.json()) as OfferingsOut;
    return body.offerings ?? [];
  } catch {
    // Unreachable backend shows "no other offerings", never a fabricated one.
    return [];
  } finally {
    clearTimeout(timer);
  }
}
