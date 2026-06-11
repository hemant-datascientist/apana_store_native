// ============================================================
// useStoreLiveStats — live store statistics for the Store Live screen.
//
// Wraps services/storeLiveService with loading / error / refetch state and
// a slow poll (counts drift by the minute, not the second). The screen
// renders the same StoreLiveStats in mock and live mode — swapping the BE
// touches only the service.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchStoreLiveStats,
  FetchStoreLiveParams,
  StoreLiveStats,
} from "../services/storeLiveService";

const POLL_MS = 60_000;

export interface UseStoreLiveStats {
  stats:      StoreLiveStats | null;
  isLoading:  boolean;   // first load only
  isError:    boolean;
  refetch:    () => void;
}

export function useStoreLiveStats(params: FetchStoreLiveParams): UseStoreLiveStats {
  const [stats,     setStats]     = useState<StoreLiveStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError,   setIsError]   = useState(false);

  // Depend on the scalar keys (not the params object) so the poll interval
  // doesn't restart every render from a fresh object literal.
  const { stateKey, stateName, city, mockStateTotal } = params;

  const aliveRef = useRef(true);

  const load = useCallback(async () => {
    try {
      const next = await fetchStoreLiveStats({ stateKey, stateName, city, mockStateTotal });
      if (!aliveRef.current) return;
      setStats(next);
      setIsError(false);
    } catch {
      if (!aliveRef.current) return;
      // Keep the last good snapshot on poll failures; flag error so the
      // screen can surface a retry — never fabricate numbers (§19.8).
      setIsError(true);
    } finally {
      if (aliveRef.current) setIsLoading(false);
    }
  }, [stateKey, stateName, city, mockStateTotal]);

  useEffect(() => {
    aliveRef.current = true;
    setIsLoading(true);
    void load();
    const timer = setInterval(() => void load(), POLL_MS);
    return () => {
      aliveRef.current = false;
      clearInterval(timer);
    };
  }, [load]);

  const refetch = useCallback(() => {
    void load();
  }, [load]);

  return { stats, isLoading, isError, refetch };
}
