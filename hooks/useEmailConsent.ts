// ============================================================
// useEmailConsent — the customer's marketing-email opt-in.
//
// OFF until they turn it on (founder decision, DPDP Act). Stored on the
// server (GET/PUT /api/customer/notifications/email-consent); every email
// also carries a one-click unsubscribe. A failed save flips the switch back.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";
const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api/customer`;
const URL = `${BASE_URL}/notifications/email-consent`;

async function headers(): Promise<Record<string, string>> {
  const t = await AsyncStorage.getItem("apana_access_token");
  return { "content-type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

export function useEmailConsent() {
  const [optedIn, setOptedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!IS_LIVE) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch(URL, { headers: await headers() });
        if (res.ok && alive) setOptedIn(((await res.json()) as { opted_in: boolean }).opted_in);
      } finally {
        if (alive) setLoaded(true);
      }
    })().catch(() => {});
    return () => { alive = false; };
  }, []);

  const set = useCallback(async (next: boolean) => {
    setOptedIn(next); // optimistic
    try {
      const res = await fetch(URL, { method: "PUT", headers: await headers(), body: JSON.stringify({ opted_in: next }) });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setOptedIn(!next); // the server didn't take it — show the truth
    }
  }, []);

  return { optedIn, loaded, setOptedIn: set };
}
