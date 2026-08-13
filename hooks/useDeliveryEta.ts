// ============================================================
// useDeliveryEta — a routed delivery window for checkout.
//
// Checkout showed "Arrives in 25–45 min" from ETA_CONFIG: the same window for
// every shop, every distance and every city, displayed at the exact moment a
// customer commits. A shop 400 m away and one 9 km away promised the same time.
//
// Now: GET /customer/eta routes shop → address through Mappls.
//
// Returns null when it cannot be computed — a shop with no pin, no address
// selected, or Mappls unreachable. The caller shows the fulfilment label alone
// rather than a number, because a wrong delivery time is the promise a customer
// actually plans around.
// ============================================================

import { useEffect, useState } from "react";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";
const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api`;

export interface DeliveryEta {
  min_minutes: number;
  max_minutes: number;
  distance_meters: number;
  travel_minutes: number;
  prep_minutes: number;
}

export function useDeliveryEta(
  sellerId: string | undefined,
  lat: number | null | undefined,
  lng: number | null | undefined,
): DeliveryEta | null {
  const [eta, setEta] = useState<DeliveryEta | null>(null);

  useEffect(() => {
    if (!IS_LIVE || !sellerId || lat == null || lng == null) {
      setEta(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/customer/eta?seller_id=${encodeURIComponent(sellerId)}&lat=${lat}&lng=${lng}`,
        );
        if (!res.ok) return;
        const body = (await res.json()) as { eta: DeliveryEta | null };
        if (!cancelled) setEta(body.eta);
      } catch {
        // Leave it null. A network blip must not resurrect a made-up window.
      }
    })();
    return () => { cancelled = true; };
  }, [sellerId, lat, lng]);

  return eta;
}

/** "Arrives in 24–33 min". Null eta ⇒ null, so the caller can omit the line. */
export function formatEtaWindow(label: string, eta: DeliveryEta | null): string | null {
  if (!eta) return null;
  return `${label} ${eta.min_minutes}–${eta.max_minutes} min`;
}
