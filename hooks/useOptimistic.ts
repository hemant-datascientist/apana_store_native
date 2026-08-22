// ============================================================
// useOptimistic — apply a change instantly, reconcile with the server,
// roll back VISIBLY if it is refused.
//
// The pattern already existed in several hooks by hand (notification
// mark-read, partner task claim) and each copy got a slightly different
// piece wrong. The recurring one: the rollback was silent. The UI snapped
// back, the user saw a flicker, and nobody told them the thing they did
// did not happen.
//
// WHAT THIS GUARANTEES
//   1. The optimistic value paints immediately.
//   2. On failure the PREVIOUS value is restored — captured before the
//      change, not re-read after it (re-reading returns the optimistic
//      value and "rolls back" to it, which is no rollback at all).
//   3. A failure always surfaces. `onError` is required, not optional —
//      you cannot construct a silent rollback with this hook.
//   4. One in-flight commit per key. A double-tap cannot fire twice.
//
// WHEN NOT TO USE IT: anything where being briefly wrong is dangerous —
// money moving, stock decrementing, an order transitioning. Show a spinner
// and wait for the server. Optimism is for cheap, reversible, low-stakes
// changes (a read flag, a favourite, a local toggle).
// ============================================================

import { useCallback, useRef, useState } from "react";

interface Options<T> {
  /**
   * Required. Called when the commit fails, AFTER the value has been
   * rolled back — surface it (a toast, an alert). Making this mandatory
   * is the entire point of the hook.
   */
  onError: (error: unknown, rolledBackTo: T) => void;
  onSuccess?: (result: T) => void;
}

export interface OptimisticState<T> {
  value: T;
  /** True while a commit is in flight. */
  pending: boolean;
  /**
   * Apply `next` immediately, then run `commit`. On rejection the previous
   * value is restored and onError fires.
   */
  apply: (next: T, commit: () => Promise<unknown>) => Promise<void>;
  /** Overwrite without a commit — for reconciling with fresh server data. */
  set: (v: T) => void;
}

export function useOptimistic<T>(initial: T, { onError, onSuccess }: Options<T>): OptimisticState<T> {
  const [value, setValue] = useState<T>(initial);
  const [pending, setPending] = useState(false);
  // A ref, not state: the guard must see the current value synchronously
  // on the very next tap, not the value from whichever render closed over
  // this callback.
  const inFlight = useRef(false);

  const apply = useCallback(async (next: T, commit: () => Promise<unknown>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);

    // Captured BEFORE the optimistic write — see the header.
    let previous!: T;
    setValue((current) => { previous = current; return next; });

    try {
      await commit();
      onSuccess?.(next);
    } catch (err) {
      setValue(previous);
      onError(err, previous);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }, [onError, onSuccess]);

  const set = useCallback((v: T) => setValue(v), []);

  return { value, pending, apply, set };
}
