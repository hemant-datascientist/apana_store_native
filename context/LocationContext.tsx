// ============================================================
// LOCATION CONTEXT — Apana Store (Customer App)
//
// Provides the currently selected delivery address globally.
// Any screen that reads location (AllFeed, HomeHeader, etc.)
// pulls from here — no prop drilling needed.
//
// Default: first saved address ("Home" in Pune).
//
// Backend: persist selection to GET/PUT /api/customer/active-address
// ============================================================

import React, {
  createContext, useContext, useState, ReactNode,
} from "react";
import { UserAddress, SAVED_ADDRESSES } from "../data/addressData";

interface LocationContextValue {
  selectedAddress:    UserAddress;
  setSelectedAddress: (addr: UserAddress) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(
    SAVED_ADDRESSES[0]  // default: Home (Pune)
  );

  return (
    <LocationContext.Provider value={{ selectedAddress, setSelectedAddress }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
  return ctx;
}
