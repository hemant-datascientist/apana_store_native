// ============================================================
// LOCATION CONTEXT — Apana Store (Customer App)
//
// Provides the currently selected delivery address globally.
//
// locationReady — false on first install; set to true once the
//   user completes the location-access screen (GPS or manual).
//   Persisted in AsyncStorage so returning users skip the screen.
//
// selectedAddress — the active delivery address. Defaults to
//   SAVED_ADDRESSES[0] until the user sets a real location.
//
// Backend:
//   GET /api/customer/active-address   → restore on login
//   PUT /api/customer/active-address   → persist selection
// ============================================================

import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from "react";
import AsyncStorage               from "@react-native-async-storage/async-storage";
import * as Location              from "expo-location";
import { UserAddress, SAVED_ADDRESSES } from "../data/addressData";

// ── Storage keys ──────────────────────────────────────────────
const KEY_ADDRESS  = "@apana_store:active_address";
const KEY_READY    = "@apana_store:location_ready";

// ── Context shape ─────────────────────────────────────────────
interface LocationContextValue {
  selectedAddress:    UserAddress;
  // The customer's REAL current city, reverse-geocoded from device GPS.
  // null until (and unless) a fix + geocode succeeds. Prefer this over
  // selectedAddress.city for "near me" queries — the saved address is a
  // delivery target, not necessarily where the user is standing now.
  deviceCity:         string | null;
  // The raw fix behind deviceCity. Area-scoped discovery (§19.10 district)
  // needs coordinates, not a name: "Pimpri-Chinchwad" never string-matches
  // "Pune" even though they are one district and twenty minutes apart.
  deviceCoords:       { lat: number; lng: number } | null;
  locationReady:      boolean;          // true once user sets any location
  setSelectedAddress: (addr: UserAddress) => void;
  confirmLocation:    (addr: UserAddress) => void;   // sets address + marks ready
  clearLocation:      () => void;       // resets to default (dev/testing)
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedAddress, setSelectedAddressState] = useState<UserAddress>(SAVED_ADDRESSES[0]);
  const [deviceCity,      setDeviceCity]           = useState<string | null>(null);
  const [deviceCoords,    setDeviceCoords]         = useState<{ lat: number; lng: number } | null>(null);
  const [locationReady,   setLocationReadyState]   = useState(false);
  const [hydrated,        setHydrated]             = useState(false);

  // ── Resolve the real current city from device GPS (reverse-geocode) ──
  // Runs once; permission denial / any failure silently leaves deviceCity
  // null → callers fall back to the saved address (no crash, no phantom).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        // Keep the fix regardless of whether the reverse-geocode names it —
        // the coordinates are the more useful half for discovery.
        if (!cancelled) {
          setDeviceCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
        const places = await Location.reverseGeocodeAsync({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        const p = places[0];
        // city can be null on Indian addresses; subregion/district usually
        // carries the town/district name (e.g. "Jalgaon").
        const name = p?.city ?? p?.subregion ?? p?.district ?? p?.region ?? null;
        if (!cancelled && name) setDeviceCity(name);
      } catch {
        // no permission / no fix / geocode failure → leave null
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Restore persisted state on mount ─────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [addrJson, readyStr] = await Promise.all([
          AsyncStorage.getItem(KEY_ADDRESS),
          AsyncStorage.getItem(KEY_READY),
        ]);
        if (addrJson)  setSelectedAddressState(JSON.parse(addrJson));
        if (readyStr === "true") setLocationReadyState(true);
      } catch {
        // AsyncStorage failure — silently fall back to defaults
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // ── Update address without marking ready ─────────────────────
  function setSelectedAddress(addr: UserAddress) {
    setSelectedAddressState(addr);
    AsyncStorage.setItem(KEY_ADDRESS, JSON.stringify(addr)).catch(() => {});
  }

  // ── Set address AND mark location as confirmed ────────────────
  function confirmLocation(addr: UserAddress) {
    setSelectedAddressState(addr);
    setLocationReadyState(true);
    Promise.all([
      AsyncStorage.setItem(KEY_ADDRESS, JSON.stringify(addr)),
      AsyncStorage.setItem(KEY_READY, "true"),
    ]).catch(() => {});
  }

  // ── Reset (for dev / logout flows) ───────────────────────────
  function clearLocation() {
    setSelectedAddressState(SAVED_ADDRESSES[0]);
    setLocationReadyState(false);
    Promise.all([
      AsyncStorage.removeItem(KEY_ADDRESS),
      AsyncStorage.removeItem(KEY_READY),
    ]).catch(() => {});
  }

  // ── Don't render children until storage has been read ────────
  if (!hydrated) return null;

  return (
    <LocationContext.Provider value={{
      selectedAddress,
      deviceCity,
      deviceCoords,
      locationReady,
      setSelectedAddress,
      confirmLocation,
      clearLocation,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
  return ctx;
}
