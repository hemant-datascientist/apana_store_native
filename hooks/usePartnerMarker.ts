// ============================================================
// usePartnerMarker — smooth live partner marker  ·  §19.5
//
// The order-tracking screen gets sparse WS pushes (3-10 s gaps).
// Drawn raw, the marker teleports between pushes and looks broken.
// Three layers smooth it:
//
//   1. Kalman filter — on each push, fuse the predicted position
//      with the measured one to damp GPS jitter. A separate
//      outlier gate rejects impossible jumps (a 100 m teleport in
//      1 s is a GPS glitch, not the rider).
//   2. Dead-reckoning — between pushes, lerp the marker forward
//      from the last fix along its bearing at its speed, every
//      animation frame, so it glides instead of jumping.
//   3. Hex-snap fallback — if no push arrives for >15 s the GPS is
//      considered dead; snap the marker to the centre of the last
//      known H3 cell instead of reckoning it off into a wall.
//
// Returns the smoothed marker position + a mode flag, or null until
// the first fix. Feed it the latest WS fix as a fresh object each
// push (a stable ref is treated as "no new fix").
// ============================================================

import { useEffect, useRef, useState } from "react";
import { latLngToCell, cellToLatLng, H3_RES } from "../services/h3";
import { distanceMeters, movePoint } from "../lib/geo";

// ── public types ──────────────────────────────────────────────
export interface PartnerFix {
  lat: number;
  lng: number;
  speedMps?: number; // ground speed, metres / second
  bearingDeg?: number; // heading, degrees clockwise from north
  ts: number; // epoch ms the fix was taken
}

export type MarkerMode = "live" | "reckoning" | "stale";

export interface MarkerState {
  lat: number;
  lng: number;
  mode: MarkerMode;
}

// ── tuning ────────────────────────────────────────────────────
const STALE_MS = 15_000; // no push for this long -> hex-snap
const MAX_SPEED_MPS = 55; // ~200 km/h — above this a fix is a glitch
const KALMAN_PROCESS = 0.01; // kalmanjs "R" — expect slow real change
const KALMAN_MEASURE = 3; // kalmanjs "Q" — distrust noisy raw GPS
const COMMIT_MS = 40; // ~25 fps state commits (rAF is 60 fps; throttled
//                       to spare the RN bridge — visually identical for
//                       a delivery marker)

// ── 1-D Kalman filter ─────────────────────────────────────────
// Matches the kalmanjs convention used in the architecture spec:
// processNoise is added to the predicted covariance, measurementNoise
// sits in the gain denominator. One filter per axis (lat, lng).
class Kalman1D {
  private estimate = Number.NaN;
  private covariance = 0;

  constructor(
    private readonly processNoise: number,
    private readonly measurementNoise: number,
  ) {}

  filter(measurement: number): number {
    if (Number.isNaN(this.estimate)) {
      this.estimate = measurement;
      this.covariance = this.measurementNoise;
      return this.estimate;
    }
    const predictedCov = this.covariance + this.processNoise;
    const gain = predictedCov / (predictedCov + this.measurementNoise);
    this.estimate += gain * (measurement - this.estimate);
    this.covariance = predictedCov * (1 - gain);
    return this.estimate;
  }

  reset(): void {
    this.estimate = Number.NaN;
    this.covariance = 0;
  }
}

// ── hook ──────────────────────────────────────────────────────
export function usePartnerMarker(fix: PartnerFix | null): MarkerState | null {
  const [marker, setMarker] = useState<MarkerState | null>(null);

  // Last accepted (Kalman-smoothed) fix — the reckoning anchor.
  const lastFix = useRef<PartnerFix | null>(null);
  const kfLat = useRef(new Kalman1D(KALMAN_PROCESS, KALMAN_MEASURE));
  const kfLng = useRef(new Kalman1D(KALMAN_PROCESS, KALMAN_MEASURE));

  // ── ingest a new fix: outlier-reject, then Kalman-smooth ──
  useEffect(() => {
    if (!fix) return;
    const prev = lastFix.current;
    const gapMs = prev ? fix.ts - prev.ts : 0;

    if (prev && gapMs > 0 && gapMs <= STALE_MS) {
      // Normal push cadence — gate impossible jumps.
      const dtSec = Math.max(gapMs / 1000, 0.001);
      const moved = distanceMeters(prev.lat, prev.lng, fix.lat, fix.lng);
      if (moved / dtSec > MAX_SPEED_MPS) {
        return; // GPS glitch — keep reckoning from the last good fix
      }
    } else if (prev) {
      // Long gap (a reconnect) — re-seed the filter at the new fix
      // so it does not drag the estimate back toward a stale spot.
      kfLat.current.reset();
      kfLng.current.reset();
    }

    lastFix.current = {
      ...fix,
      lat: kfLat.current.filter(fix.lat),
      lng: kfLng.current.filter(fix.lng),
    };
  }, [fix]);

  // ── animation loop: reckon between pushes, hex-snap when stale ──
  useEffect(() => {
    let raf = 0;
    let lastCommit = 0;

    const frame = (): void => {
      raf = requestAnimationFrame(frame);
      const base = lastFix.current;
      if (!base) return;

      const now = Date.now();
      if (now - lastCommit < COMMIT_MS) return;
      lastCommit = now;

      const ageMs = now - base.ts;
      let next: MarkerState;

      if (ageMs > STALE_MS) {
        // GPS dead — snap to the last known r8 cell, do not drift.
        const [cLat, cLng] = cellToLatLng(latLngToCell(base.lat, base.lng, H3_RES.DISCOVERY));
        next = { lat: cLat, lng: cLng, mode: "stale" };
      } else if (base.speedMps && base.speedMps > 0) {
        // Reckon forward along the last bearing at the last speed.
        const moved = movePoint(
          base.lat,
          base.lng,
          base.bearingDeg ?? 0,
          base.speedMps * (ageMs / 1000),
        );
        next = { lat: moved.lat, lng: moved.lng, mode: "reckoning" };
      } else {
        // Stationary partner — sit on the smoothed fix.
        next = { lat: base.lat, lng: base.lng, mode: "live" };
      }

      setMarker((cur) =>
        cur && cur.lat === next.lat && cur.lng === next.lng && cur.mode === next.mode
          ? cur // unchanged — skip the re-render
          : next,
      );
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return marker;
}
