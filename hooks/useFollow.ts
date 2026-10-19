// ============================================================
// useFollow — follow/unfollow a store, kept in sync across screens via the
// module-level followStore. §30 growth loop.
//
// Follow is THE single store relationship — "favourite stores" was merged
// into it (one heart, one list). Favourite keeps products/riders/delivery.
// ============================================================

import { useCallback, useEffect, useSyncExternalStore } from "react";

import {
  subscribe, getVersion, isFollowing, toggleFollow, followedIds,
  followedStores, syncFollowsFromServer, FollowedStore,
} from "../lib/followStore";

export interface UseFollow {
  following: boolean;
  toggle: () => void;
}

export function useFollow(storeId: string): UseFollow {
  // Re-render this component whenever the follow set changes anywhere.
  useSyncExternalStore(subscribe, getVersion, getVersion);
  const following = isFollowing(storeId);
  const toggle = useCallback(() => toggleFollow(storeId), [storeId]);
  return { following, toggle };
}

// Reactive list of followed store ids (for the Following screen).
export function useFollowedIds(): string[] {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return followedIds();
}

// 🔴 This used to resolve ids through MOCK_STORES — so every REAL shop a
// customer followed was silently dropped and only bundled demo shops ever
// appeared under "Stores You Follow". Now the rows come from the server
// (GET /customer/stores/following/mine); an id without a row is skipped,
// never filled in from demo data (§19.8).
export function useFollowedStores(): FollowedStore[] {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  useEffect(() => {
    // On every mount of a list screen: pulls follows made on another phone or
    // before a reinstall, plus the shop rows the lists render. One small GET.
    void syncFollowsFromServer();
  }, []);
  return followedStores();
}
