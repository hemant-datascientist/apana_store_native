// ============================================================
// usePartnerFix — REAL partner fixes for order tracking (Gap C).
//
// The drop-in replacement for useMockPartnerFix: polls
// GET /customer/orders/:id/tracking and emits a PartnerFix on each new
// position, which usePartnerMarker then smooths + dead-reckons exactly as it
// did the mock. Speed/bearing are derived from the last two trail points so the
// marker reckons forward between polls instead of teleporting.
//
// Honest-empty (§19.8): no partner assigned / no fix / delivered ⇒ returns null,
// so the map shows no marker rather than a fabricated one. Pass no orderId (or
// in mock mode) and it stays inert — the screen falls back to the mock.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { fetchOrderTracking, TrackPoint } from "../services/trackingService";
import { bearingDeg, distanceMeters } from "../lib/geo";
import { PartnerFix } from "./usePartnerMarker";

const POLL_MS = 4_000;

// Derive ground speed + heading from the two most recent trail points, so the
// marker's reckoning matches the partner's real motion. One point (or a zero
// time gap) ⇒ stationary.
function motionFrom(trail: TrackPoint[]): { speedMps: number; bearingDeg: number } {
  if (trail.length < 2) return { speedMps: 0, bearingDeg: 0 };
  const a = trail[trail.length - 2];
  const b = trail[trail.length - 1];
  if (!a || !b) return { speedMps: 0, bearingDeg: 0 };
  const dtSec = (new Date(b.ts).getTime() - new Date(a.ts).getTime()) / 1000;
  if (!(dtSec > 0)) return { speedMps: 0, bearingDeg: 0 };
  const dist = distanceMeters(a.lat, a.lng, b.lat, b.lng);
  // Clamp out GPS jitter (a parked partner still jiggles a few metres).
  const speedMps = dist / dtSec;
  return {
    speedMps: speedMps < 0.5 ? 0 : Math.min(speedMps, 30),
    bearingDeg: bearingDeg(a.lat, a.lng, b.lat, b.lng),
  };
}

export function usePartnerFix(orderId: string | undefined): PartnerFix | null {
  const [fix, setFix] = useState<PartnerFix | null>(null);
  // Last emitted position, to skip re-emitting an unchanged fix (a stable ref
  // reads as "no new fix" to usePartnerMarker and keeps its reckoning smooth).
  const lastKey = useRef<string>("");

  useEffect(() => {
    if (!orderId) {
      setFix(null);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async (): Promise<void> => {
      const t = await fetchOrderTracking(orderId);
      if (cancelled) return;
      if (t?.partner) {
        const key = `${t.partner.lat},${t.partner.lng},${t.partner.ts}`;
        if (key !== lastKey.current) {
          lastKey.current = key;
          const motion = motionFrom(t.trail);
          setFix({
            lat: t.partner.lat,
            lng: t.partner.lng,
            speedMps: motion.speedMps,
            bearingDeg: motion.bearingDeg,
            ts: Date.now(),
          });
        }
      } else {
        // No live partner (unassigned / delivered) — clear the marker honestly.
        lastKey.current = "";
        setFix(null);
      }
      timer = setTimeout(poll, POLL_MS);
    };

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId]);

  return fix;
}
