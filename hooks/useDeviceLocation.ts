// ============================================================
// useDeviceLocation — the customer's real GPS centre  ·  §19.6
//
// Resolves the device's current position for the map centre. Starts at the
// configured DEFAULT (Pune) so the map renders instantly, then upgrades to
// the last-known fix, then to a fresh fix — each without blocking the UI.
// Permission denial / any failure silently keeps DEFAULT (no crash, no
// phantom — the map still works, just centred on the fallback).
//
// Mirrors the GPS pattern in components/store/CoverageMapPreview.tsx so the
// map view and the coverage preview agree on how location is obtained.
// ============================================================

import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { DEFAULT_LAT, DEFAULT_LNG } from "../config/mapplsConfig";

export interface DeviceLocation {
  lat: number;
  lng: number;
}

interface UseDeviceLocationResult {
  center:  DeviceLocation; // GPS fix when available, else DEFAULT
  located: boolean;        // true once a real fix has been applied
}

export function useDeviceLocation(): UseDeviceLocationResult {
  const [center, setCenter]   = useState<DeviceLocation>({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [located, setLocated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return; // keep DEFAULT — user said no

        // Instant: last-known fix (often cached, no sensor wait).
        const last = await Location.getLastKnownPositionAsync();
        if (last && !cancelled) {
          setCenter({ lat: last.coords.latitude, lng: last.coords.longitude });
          setLocated(true);
        }

        // Accurate: a fresh fix replaces the last-known one.
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!cancelled) {
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocated(true);
        }
      } catch {
        // Permission revoked, services off, timeout → DEFAULT already set.
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { center, located };
}
