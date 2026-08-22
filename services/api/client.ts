// ============================================================
// API CLIENT — Apana Store (Customer App)
//
// Single typed openapi-fetch client. Types are generated from
// apana-contracts/openapi/customer.yaml -> ../../types/api.ts.
//
// Switch backends via env (set in .env / app.config / EAS):
//   EXPO_PUBLIC_API_MODE=mock    -> Prism mock server (apana-contracts npm run mock:customer)
//   EXPO_PUBLIC_API_MODE=local   -> Tower LAN IP, dev box uvicorn proxied
//   EXPO_PUBLIC_API_MODE=prod    -> production
//
// Auth header is injected per-request by ./auth.ts (token from AsyncStorage).
// ============================================================

import createClient, { type Middleware } from "openapi-fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { paths } from "../../types/api";

// ── Resolve base URL from env (Expo bakes EXPO_PUBLIC_* at build time) ──
const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";

// EXPO_PUBLIC_BE_BASE_URL (a full origin — Cloudflare tunnel, ngrok, LAN) wins
// when set, so the phone works off-Wi-Fi. Else build from the LAN IP.
const BE_ORIGIN =
  (process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`;

export const API_BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : API_MODE === "local"
      ? `${BE_ORIGIN}/api/customer`
      : "http://localhost:4010"; // Prism mock

// ── Auth middleware — pulls JWT from AsyncStorage every request ──
// Async middleware avoids stale tokens after login/logout.
//
// 🔴 This used to be "apana_auth_token" — a key nothing ever wrote. The real
// login flow (context/AuthContext.tsx STORAGE_KEYS.access) has always stored
// the token under "apana_access_token". setAuthToken/clearAuthToken below are
// dead code (nothing calls them; login/logout write AsyncStorage directly in
// AuthContext), so this file's own token storage was never exercised either
// way — getAuthToken() always returned null, and every request through the
// authMiddleware went out with no Authorization header. reviewService.ts is
// the one live caller of getAuthToken(); its store-review POST always 401'd.
const TOKEN_KEY = "apana_access_token";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
};

// ── Typed client — inferred from generated `paths` interface ──
export const api = createClient<paths>({ baseUrl: API_BASE_URL });
api.use(authMiddleware);

// ── Helpers for token storage (called from login + logout flows) ──
export async function setAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}
