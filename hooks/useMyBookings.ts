// ============================================================
// useMyBookings — the customer's own service bookings.
//
// Scoped by the signed-in phone number, which is the only identity a booking
// carries today. A guest (no phone) has no bookings to show — that is an
// honest empty, not a failure.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Booking, cancelBooking, fetchMyBookings } from "../services/bookingService";

export interface MyBookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  cancel: (id: string) => Promise<void>;
}

export function useMyBookings(phone: string | null | undefined): MyBookingsState {
  const p = (phone ?? "").trim();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(Boolean(p));
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    if (!p) { setBookings([]); setLoading(false); setError(null); return; }
    setLoading(true);
    setError(null);
    fetchMyBookings(p)
      .then((items) => {
        if (!alive) return;
        setBookings(items);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Couldn't load your bookings.");
        setBookings([]);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [p, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  // Refetch rather than patch locally: the seller may have moved the booking
  // (confirmed it, completed it) since this list was drawn, and the server's
  // status machine is the truth.
  const cancel = useCallback(
    async (id: string) => {
      await cancelBooking(id, p);
      setNonce((n) => n + 1);
    },
    [p],
  );

  return { bookings, loading, error, reload, cancel };
}
