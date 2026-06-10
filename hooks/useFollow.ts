// ============================================================
// useFollow — follow/unfollow a store, kept in sync across screens via the
// module-level followStore. §30 growth loop.
// ============================================================

import { useCallback, useSyncExternalStore } from "react";

import { subscribe, getVersion, isFollowing, toggleFollow, followedIds } from "../lib/followStore";

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
