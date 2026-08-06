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
//   UNSET_ADDRESS until the user sets a real one — never a
//   fabricated city standing in for one they never entered.
//
// Backend:
//   GET /api/customer/active-address   → restore on login
//   PUT /api/customer/active-address   → persist selection
// ============================================================

import React, {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from "react";
import AsyncStorage               from "@react-native-async-storage/async-storage";
import * as Location              from "expo-location";
import { UserAddress, UNSET_ADDRESS } from "../data/addressData";
import { fetchAddresses, ADDRESSES_LIVE } from "../services/addressService";
import { useAuth } from "./AuthContext";

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

  // ── Saved addresses, from the server ──────────────────────
  // These used to be a bundled mock, so checkout sent an address id that
  // existed nowhere and a paid order had no real destination. Off-backend the
  // list is EMPTY rather than fake: a wrong address is worse than none, because
  // the customer only finds out when nothing arrives (§19.8).
  addresses:          UserAddress[];
  addressesLoading:   boolean;
  reloadAddresses:    () => Promise<void>;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedAddress, setSelectedAddressState] = useState<UserAddress>(UNSET_ADDRESS);
  const [deviceCity,      setDeviceCity]           = useState<string | null>(null);
  const [deviceCoords,    setDeviceCoords]         = useState<{ lat: number; lng: number } | null>(null);
  const [locationReady,   setLocationReadyState]   = useState(false);
  const [hydrated,        setHydrated]             = useState(false);
  const [addresses,       setAddresses]            = useState<UserAddress[]>([]);
  const [addressesLoading, setAddressesLoading]    = useState(false);

  // Saved addresses come from the server, keyed on the signed-in phone (the
  // same key orders use). No phone = no addresses, not mock ones.
  const { user } = useAuth();
  const customerId = user?.phone ?? "";

  const reloadAddresses = useCallback(async () => {
    if (!customerId || !ADDRESSES_LIVE) { setAddresses([]); return; }
    setAddressesLoading(true);
    try {
      setAddresses(await fetchAddresses(customerId));
    } catch {
      // Keep whatever is already shown. Replacing a real list with an empty one
      // because the network blipped would look like the customer lost their
      // saved addresses.
    } finally {
      setAddressesLoading(false);
    }
  }, [customerId]);

  useEffect(() => { reloadAddresses(); }, [reloadAddresses]);

  // Once the real list arrives, prefer the customer's DEFAULT over the bundled
  // placeholder — but never overwrite an address they have actively chosen.
  useEffect(() => {
    if (addresses.length === 0 || locationReady) return;
    const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (preferred) setSelectedAddressState(preferred);
  }, [addresses, locationReady]);

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
    setSelectedAddressState(UNSET_ADDRESS);
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
      addresses,
      addressesLoading,
      reloadAddresses,
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
