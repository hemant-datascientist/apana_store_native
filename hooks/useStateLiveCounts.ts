// ============================================================
// useStateLiveCounts — per-state live store counts for the bharat screen.
//
// Live mode: one bulk fetch (refreshed every 60s) of normalised-state-name
// → live count. Mock mode: returns counts: null so the screen keeps the
// bundled bharatData numbers — the swap is invisible to the cards.
//
// While live counts load, counts stays null and isLoading=true: cards show
// "…" + grey dot rather than claiming a number (§19.8).
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchStateLiveCounts } from "../services/storeLiveService";

const POLL_MS = 60_000;

export interface UseStateLiveCounts {
  // null = mock mode OR still loading (disambiguate via isLive/isLoading)
  counts:    Record<string, number> | null;
  isLive:    boolean;
  isLoading: boolean;
  isError:   boolean;
  refetch:   () => void;
}

const IS_LIVE = (process.env.EXPO_PUBLIC_API_MODE ?? "mock") === "local"
  || process.env.EXPO_PUBLIC_API_MODE === "prod";

export function useStateLiveCounts(): UseStateLiveCounts {
  const [counts,    setCounts]    = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(IS_LIVE);
  const [isError,   setIsError]   = useState(false);

  const aliveRef = useRef(true);

  const load = useCallback(async () => {
    if (!IS_LIVE) return;
    try {
      const next = await fetchStateLiveCounts();
      if (!aliveRef.current) return;
      setCounts(next);
      setIsError(false);
    } catch {
      if (!aliveRef.current) return;
      // Keep the last good map on poll failures; flag error for a retry
      // affordance — never fabricate counts (§19.8).
      setIsError(true);
    } finally {
      if (aliveRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    void load();
    if (!IS_LIVE) return undefined;
    const timer = setInterval(() => void load(), POLL_MS);
    return () => {
      aliveRef.current = false;
      clearInterval(timer);
    };
  }, [load]);

  return { counts, isLive: IS_LIVE, isLoading, isError, refetch: () => void load() };
}
