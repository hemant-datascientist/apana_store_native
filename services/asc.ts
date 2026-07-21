// ============================================================
// ASC SERVICE — Apana Store Classification (§16), customer app.
//
// The 5 store classes (Inventory / Service / Menu / Factory-Direct /
// Wholesale) and their 106 store types, read from the live taxonomy so the
// stores browser can never drift from ASC the way the old hand-written
// STORE_TYPES list did.
//
// Own BE surface (/api/asc/*), same env resolution as services/apc.ts.
// ============================================================

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";

export const ASC_BASE_URL =
  process.env.EXPO_PUBLIC_ASC_API_URL ??
  (API_MODE === "prod"
    ? "https://api.apana.in/api/asc"
    : `http://${TOWER_IP}:8000/api/asc`);

export interface AscClass {
  id: string;        // "inventory" | "service" | "menu" | "factory" | "wholesale"
  name: string;      // "Inventory-Based Stores"
  tagline: string;
  icon: string;      // emoji
  sort_order: number;
}

export interface AscType {
  code: string;              // "ASC-FAC-FOOD"
  class_id: string;
  num: number;
  name: string;              // "Food / Snacks Factory"
  short: string | null;
  subcategories: string[];
  catalog_seed: string[];
  compliance: string | null;
  note: string | null;
  added: boolean;
  sort_order: number;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${ASC_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`ASC ${path} -> ${res.status}`);
  return (await res.json()) as T;
}

export async function getAscClasses(): Promise<AscClass[]> {
  return (await getJson<{ items: AscClass[] }>("/classes")).items;
}

export async function getAscTypes(): Promise<AscType[]> {
  return (await getJson<{ items: AscType[] }>("/types")).items;
}
