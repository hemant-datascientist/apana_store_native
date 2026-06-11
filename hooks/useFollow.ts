// ============================================================
// useFollow — follow/unfollow a store, kept in sync across screens via the
// module-level followStore. §30 growth loop.
//
// Follow is THE single store relationship — "favourite stores" was merged
// into it (one heart, one list). Favourite keeps products/riders/delivery.
// ============================================================

import { useCallback, useSyncExternalStore } from "react";

import { subscribe, getVersion, isFollowing, toggleFollow, followedIds } from "../lib/followStore";
import { MOCK_STORES, StoreDetail } from "../data/storeDetailData";

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

// Followed ids resolved to KNOWN stores only — ids from scanned external QRs
// we have no data for are skipped (§19.8 no phantom data). Swap MOCK_STORES
// for GET /customer/following when the BE lands.
export function useFollowedStores(): StoreDetail[] {
  const ids = useFollowedIds();
  return ids
    .map((id) => MOCK_STORES[id])
    .filter((s): s is StoreDetail => Boolean(s));
}
