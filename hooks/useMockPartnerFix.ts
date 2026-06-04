// ============================================================
// useMockPartnerFix — frontend-first stand-in for the tracking WS.
//
// The real order-tracking marker is driven by WS /ws/tracking/:orderId
// pushing sparse {lat,lng,speed,bearing} fixes every 3-10 s (§19.5).
// Until that lands, this hook simulates exactly that cadence: it walks
// a mock partner from their start point toward the customer, emitting a
// FRESH PartnerFix object on each sparse tick (a stable ref reads as
// "no new fix" to usePartnerMarker). Between ticks, usePartnerMarker's
// dead-reckoning interpolates the marker forward — so the demo shows the
// real smoothing, not teleporting.
//
// Pickup mode = the "partner" is the store: speed 0, the marker sits.
//
// Swap surface: delete this hook, feed real WS fixes into
// usePartnerMarker instead. Nothing else on the screen changes.
// ============================================================

import { useEffect, useState } from "react";
import { FulfillmentMode } from "../data/cartData";
import { MOCK_PARTNER_LOCATION, MOCK_CUSTOMER_LOCATION } from "../data/orderTrackingData";
import { PartnerFix } from "./usePartnerMarker";
import { distanceMeters, bearingDeg, movePoint } from "../lib/geo";

// Plausible ground speeds (m/s): bike courier, car, stationary store.
const SPEED_MPS: Record<FulfillmentMode, number> = {
  delivery: 6, // ~22 km/h
  ride: 11, //    ~40 km/h
  pickup: 0, //   store doesn't move
};
const MIN_GAP_MS = 3_000;
const MAX_GAP_MS = 10_000;
const ARRIVED_M = 8; // within this, treat as arrived → stop moving

export function useMockPartnerFix(mode: FulfillmentMode): PartnerFix | null {
  const [fix, setFix] = useState<PartnerFix | null>(null);

  useEffect(() => {
    const target = MOCK_CUSTOMER_LOCATION;
    const speed = SPEED_MPS[mode];
    let pos = { ...MOCK_PARTNER_LOCATION[mode] };
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = (): void => {
      if (cancelled) return;
      const remaining = distanceMeters(pos.lat, pos.lng, target.lat, target.lng);
      const moving = speed > 0 && remaining > ARRIVED_M;
      const heading = moving ? bearingDeg(pos.lat, pos.lng, target.lat, target.lng) : 0;

      // Emit the current position with the speed/bearing the marker
      // should reckon along until the next push.
      setFix({
        lat: pos.lat,
        lng: pos.lng,
        speedMps: moving ? speed : 0,
        bearingDeg: heading,
        ts: Date.now(),
      });

      // Advance the simulated position to where reckoning will have
      // carried the marker by the next (randomly-spaced) push.
      const gapMs = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
      if (moving) {
        const step = Math.min(speed * (gapMs / 1000), remaining);
        pos = movePoint(pos.lat, pos.lng, heading, step);
      }
      timer = setTimeout(tick, gapMs);
    };

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [mode]);

  return fix;
}
