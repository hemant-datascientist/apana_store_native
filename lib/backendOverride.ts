// ============================================================
// backendOverride — point the app at a scanned backend URL at RUNTIME.
//
// EXPO_PUBLIC_* is inlined at build time, so the baked backend URL can't be
// changed without a rebuild — a problem when the Cloudflare quick-tunnel URL
// rotates. This lets the app scan the backend's /connect QR and persist that
// origin, then rewrites any request aimed at the baked origin to the scanned
// one. Default (no scan) is a no-op → the baked URL keeps working, so this is
// purely additive and can't break a build that never scans.
//
// Customer app uses fetch (openapi-fetch + service fetch calls), so we patch
// global.fetch. The patch is installed once at import and reads the override
// live, so it applies the moment loadOverride() populates it.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "apana_api_override_origin";

// The baked origin (scheme+host[:port]) — same source the API clients use.
export const BAKED_ORIGIN: string = (() => {
  const be = process.env.EXPO_PUBLIC_BE_BASE_URL;
  if (be) return be.replace(/\/+$/, "");
  const ip = process.env.EXPO_PUBLIC_TOWER_IP;
  return ip ? `http://${ip}:8000` : "";
})();

let overrideOrigin: string | null = null;

export function getOverrideOrigin(): string | null {
  return overrideOrigin;
}

// The origin requests actually go to (override if set, else baked).
export function effectiveOrigin(): string {
  return overrideOrigin || BAKED_ORIGIN;
}

export async function loadOverride(): Promise<void> {
  try {
    overrideOrigin = await AsyncStorage.getItem(KEY);
  } catch {
    overrideOrigin = null;
  }
}

export async function setOverrideOrigin(origin: string): Promise<void> {
  overrideOrigin = origin.replace(/\/+$/, "");
  try { await AsyncStorage.setItem(KEY, overrideOrigin); } catch {}
}

export async function clearOverrideOrigin(): Promise<void> {
  overrideOrigin = null;
  try { await AsyncStorage.removeItem(KEY); } catch {}
}

// Swap the baked origin prefix for the override on a request URL.
export function rewriteUrl(url: string): string {
  if (!overrideOrigin || !BAKED_ORIGIN) return url;
  if (url.startsWith(BAKED_ORIGIN)) return overrideOrigin + url.slice(BAKED_ORIGIN.length);
  return url;
}

// Parse an Apana connect-QR payload → the apiBase origin, or null if it's not
// one. Accepts the JSON envelope {t:"apana-connect", apiBase} or a bare http(s)
// URL (so a plain-URL QR also works).
export function parseConnectPayload(raw: string): string | null {
  const s = raw.trim();
  try {
    const o = JSON.parse(s);
    if (o && o.t === "apana-connect" && typeof o.apiBase === "string" && /^https?:\/\//i.test(o.apiBase)) {
      return o.apiBase.replace(/\/+$/, "");
    }
  } catch { /* not JSON — fall through */ }
  if (/^https?:\/\/\S+$/i.test(s)) return s.replace(/\/+$/, "");
  return null;
}

// Install the global.fetch rewrite once. No-op while override is null.
let installed = false;
export function installFetchOverride(): void {
  if (installed) return;
  installed = true;
  const orig = (globalThis as any).fetch;
  (globalThis as any).fetch = ((input: any, init?: any) => {
    try {
      if (typeof input === "string") {
        input = rewriteUrl(input);
      } else if (input && typeof input.url === "string") {
        const next = rewriteUrl(input.url);
        if (next !== input.url) input = new Request(next, input);
      }
    } catch { /* never let the patch break a request */ }
    return orig(input, init);
  }) as typeof fetch;
}

// Install at import so the patch is active from the first request.
installFetchOverride();
