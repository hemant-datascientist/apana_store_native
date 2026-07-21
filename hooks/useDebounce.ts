// ============================================================
// useDebounce — settle a fast-changing value before acting on it.
//
// Search boxes here drive network calls; without this, every keystroke is a
// request and the last response to arrive wins, which is not necessarily the
// one for the current query.
// ============================================================

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
