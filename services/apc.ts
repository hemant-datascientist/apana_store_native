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

// ── APC classes (§27 class tier) ────────────────────────────
// The canonical browsable classes — "APC-01-VEG" Vegetables, etc. Used to
// drive the category browser straight from the classification, so the UI can
// never drift from the canvas.
export interface ApcClass {
  code: string;          // "APC-01-VEG"
  name: string;
  name_hi: string | null;
  slug: string;          // "VEG"
  icon_emoji: string | null;
  numeric_code: string | null;
  sort_order: number;
}

export async function getClasses(): Promise<ApcClass[]> {
  return (await getJson<{ items: ApcClass[] }>("/classes")).items;
}

// ── APC families (§27 family tier) — the real sub-categories of a class ──
export interface ApcFamily {
  code: string;            // "APC-10-FASH-FOOTWEARS"
  class_code: string;
  name: string;
  name_hi: string | null;
  slug: string;
  icon_emoji: string | null;
  image_url: string | null; // BE-relative tile art when the family has one
  numeric_code: string | null;
  sort_order: number;
}

export async function getFamilies(classCode: string): Promise<ApcFamily[]> {
  return (
    await getJson<{ items: ApcFamily[] }>(`/classes/${encodeURIComponent(classCode)}/families`)
  ).items;
}

// Family tile art -> absolute URL (BE serves these relative, same as nodeImage).
export function familyImage(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Department number a class belongs to: "APC-01-VEG" -> "01" (root "APC-D01").
export function classDeptNo(code: string): string | null {
  const m = /^APC-(\d{2})-/.exec(code);
  return m ? m[1] : null;
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

// ── Curated category search (/apc/search) ───────────────────
// Distinct from the tree search: /apc/search returns the curated
// class → family → variety hits in that order, each with icon_emoji +
// image_url. That ordering is the whole point of the Blinkit-style strip —
// typing "Biscuits" surfaces the tappable CATEGORY (🍪) above the products,
// not buried among them.
export interface ApcSearchHit {
  level: "class" | "family" | "variety";
  code: string;
  name: string;
  class_code: string | null;
  icon_emoji: string | null;
  image_url: string | null;
}

export async function searchApcCategories(q: string, limit = 8): Promise<ApcSearchHit[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  const { items } = await getJson<{ items: ApcSearchHit[] }>(
    `/search?q=${encodeURIComponent(query)}&limit=${limit}`,
  );
  // Classes + families are browsable CATEGORY tiles; a variety is a single
  // product and belongs in the product results, not the category strip.
  return items.filter((h) => h.level !== "variety");
}

// image_url is BE-relative ("assets/fruits/mango.webp") — resolve to absolute.
export function hitImage(h: ApcSearchHit): string | null {
  const u = h.image_url;
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_ORIGIN}${u.startsWith("/") ? "" : "/"}${u}`;
}

// Glyph fallback: the family's own emoji, else a neutral tile. image wins first.
export function hitGlyph(h: ApcSearchHit): string {
  return h.icon_emoji ?? "▦";
}
