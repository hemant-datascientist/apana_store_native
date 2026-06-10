// ============================================================
// Notification-prefs hooks — reactive opt-out controls for store updates.
// §30 P4b.
// ============================================================

import { useCallback, useSyncExternalStore } from "react";

import {
  subscribe,
  getVersion,
  storeUpdatesEnabled,
  setStoreUpdatesEnabled,
  isStoreMuted,
  toggleStoreMute,
} from "../lib/notificationPrefs";

export interface UseStoreUpdatesPref {
  storeUpdates: boolean;
  setStoreUpdates: (value: boolean) => void;
}

export function useStoreUpdatesPref(): UseStoreUpdatesPref {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return {
    storeUpdates: storeUpdatesEnabled(),
    setStoreUpdates: setStoreUpdatesEnabled,
  };
}

export interface UseStoreMute {
  muted: boolean;
  toggleMute: () => void;
}

export function useStoreMute(storeId: string): UseStoreMute {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  const muted = isStoreMuted(storeId);
  const toggleMute = useCallback(() => toggleStoreMute(storeId), [storeId]);
  return { muted, toggleMute };
}
