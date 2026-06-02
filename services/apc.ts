// ============================================================
// APC SERVICE — Apana Store (Customer App)
//
// Read-only client for the public APC taxonomy (§27 N-level tree).
// Mirrors the registry browser (apana_registry_web/lib/apc.ts) so the
// customer app walks the same cross-retail classification.
//
// APC lives on its own BE surface (/api/apc/*), NOT the customer
// contract — so this is a standalone fetch client, not openapi-fetch.
//
// Base URL resolves from env (Expo bakes EXPO_PUBLIC_* at build):
//   EXPO_PUBLIC_APC_API_URL  -> explicit override (any mode)
//   prod                     -> https://api.apana.in/api/apc
//   else                     -> http://<TOWER_IP>:8000/api/apc
//
// NOTE: never request apc_to_gpc_map / any GPC field — the public API
// does not expose it (§27.1 legal), and neither does this client.
// ============================================================

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";

export const APC_BASE_URL =
  process.env.EXPO_PUBLIC_APC_API_URL ??
  (API_MODE === "prod"
    ? "https://api.apana.in/api/apc"
    : `http://${TOWER_IP}:8000/api/apc`);

// ── Tree node shapes (snake_case — matches BE payload) ──────
export interface ApcTreeNode {
  code: string;
  parent_code: string | null;
  depth: number;
  name: string;
  name_hi: string | null;
  slug: string;
  path: string;
  source: string; // 'google' | 'apana'
  is_leaf: boolean;
  attributes: Record<string, unknown>;
}

export interface ApcNodeContext {
  node: ApcTreeNode;
  children: ApcTreeNode[];
  ancestors: ApcTreeNode[]; // root → parent
}

// ── Node attribute accessors (ingest packs these into `attributes`) ──
export function nodeChildCount(n: ApcTreeNode): number {
  const c = n.attributes?.child_count;
  return typeof c === "number" ? c : 0;
}
export function nodeIcon(n: ApcTreeNode): string | null {
  const i = n.attributes?.icon;
  return typeof i === "string" ? i : null;
}

// BE origin (APC_BASE_URL minus /api/apc) — image_url values are BE-relative
// ("/loose-media/assets/fruits/mango.png"); resolve to an absolute URL.
const API_ORIGIN = APC_BASE_URL.replace(/\/api\/apc$/, "");
export function nodeImage(n: ApcTreeNode): string | null {
  const u = n.attributes?.image_url;
  if (typeof u !== "string" || !u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_ORIGIN}${u.startsWith("/") ? "" : "/"}${u}`;
}
export function nodeApcCode(n: ApcTreeNode): string | null {
  const c = n.attributes?.apc_code;
  return typeof c === "string" ? c : null;
}
export type GroceryLevel = "class" | "family" | "variety";
export function nodeApcLevel(n: ApcTreeNode): GroceryLevel | null {
  const l = n.attributes?.apc_level;
  return l === "class" || l === "family" || l === "variety" ? l : null;
}

// Curated emoji per node: its own icon, else a level glyph for bridged grocery,
// else a keyword match on the name, else a neutral glyph.
const SEGMENT_EMOJI: [RegExp, string][] = [
  [/food|beverage|grocery|mandi/i, "🍎"],
  [/apparel|clothing|wear/i, "👕"],
  [/electronic/i, "📱"],
  [/health|beauty|ayurveda/i, "💄"],
  [/home|garden/i, "🏡"],
  [/furniture/i, "🛋️"],
  [/baby|toddler/i, "🍼"],
  [/toys|games/i, "🧸"],
  [/sport/i, "⚽"],
  [/media|book/i, "📚"],
  [/office/i, "🖇️"],
  [/hardware|tool/i, "🔧"],
  [/vehicle|automotive|part/i, "🚗"],
  [/animal|pet/i, "🐾"],
  [/arts|craft|hobby/i, "🎨"],
  [/business|industrial/i, "🏭"],
  [/camera|optic/i, "📷"],
  [/luggage|bag/i, "🧳"],
  [/software/i, "💿"],
  [/religious|ceremon|pooja|festival/i, "🪔"],
];
export function nodeEmoji(n: ApcTreeNode): string {
  const icon = nodeIcon(n);
  if (icon) return icon;
  const lvl = nodeApcLevel(n);
  if (lvl === "variety") return "🔹";
  if (lvl === "family") return "📂";
  for (const [re, e] of SEGMENT_EMOJI) if (re.test(n.name)) return e;
  return "▦";
}

// ── Fetch helper — never trusts a non-2xx response ──────────
async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${APC_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`APC ${path} -> ${res.status}`);
  return (await res.json()) as T;
}

// Top-level segments (parent_code IS NULL).
export async function getTreeRoots(): Promise<ApcTreeNode[]> {
  return (await getJson<{ items: ApcTreeNode[] }>("/tree/roots")).items;
}

// Node + its children + ancestor chain (for breadcrumb).
export async function getTreeNode(code: string): Promise<ApcNodeContext> {
  return getJson<ApcNodeContext>(`/tree/node/${encodeURIComponent(code)}`);
}

// Name search across the tree (q >= 2 chars enforced by BE).
export async function searchTree(q: string, limit = 30): Promise<ApcTreeNode[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  return (
    await getJson<{ items: ApcTreeNode[] }>(
      `/tree/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    )
  ).items;
}
