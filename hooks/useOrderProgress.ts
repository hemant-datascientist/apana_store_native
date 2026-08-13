// ============================================================
// useOrderProgress — the REAL state of a real order.
//
// The tracking screen showed MOCK_ACTIVE_STEP, MOCK_ETA and MOCK_PARTNERS: a
// progress bar frozen at a hardcoded step regardless of what the shop had
// actually done, an invented "Arriving in 18 min", and a delivery partner —
// name, initials, avatar colour — who did not exist.
//
// The map marker was already real (usePartnerFix polls the same endpoint), and
// that was the dangerous part: a genuine moving marker lent credibility to the
// invented rider beside it.
//
// This reads the status the endpoint has always returned and the rider's first
// name, which it now returns too.
//
// The ETA is now REAL: the endpoint routes the rider's last known position (or
// the shop, before one is assigned) to the drop through Mappls. It is still
// null whenever it cannot be computed — a missing pin, an unreachable provider
// — and the screen then shows the status line alone. A delivery time is the
// single most load-bearing promise in the app, so it is measured or omitted,
// never defaulted.
// ============================================================

import { useEffect, useState } from "react";
import { fetchOrderTracking } from "../services/trackingService";

const POLL_MS = 8_000;

export interface OrderProgress {
  /** Real order status, or null while loading / in mock mode. */
  status: string | null;
  /** Rider's first name once assigned; null before that. */
  partnerName: string | null;
  /** The active step's KEY (TRACKING_STEPS uses keys, not indexes), or null. */
  stepKey: string | null;
  /** Routed window in minutes, or null when it cannot be computed. */
  eta: { min_minutes: number; max_minutes: number } | null;
  /**
   * The order's REAL drop coordinates, from the address snapshot.
   *
   * The tracking map drew its destination marker at a hardcoded Deccan point
   * for every order, so a customer in Baner watched the rider approach the
   * wrong pin — with the route line drawn to it. Null when the address has no
   * pin (a pre-pin typed address), and the map then shows no destination
   * marker rather than one in the wrong place.
   */
  destination: { lat: number; lng: number } | null;
}

// Order status → the delivery timeline's step key.
//
// `rejected` and `cancelled` map to null, not to a step. They are not points on
// the journey, and giving them one would draw a refused order as though it were
// still making its way to the customer.
const STEP_FOR_STATUS: Record<string, string> = {
  pending: "placed",
  accepted: "packing",
  ready: "packing",
  picked_up: "onway",
  delivered: "delivered",
};

export function useOrderProgress(orderId: string | undefined): OrderProgress {
  const [state, setState] = useState<OrderProgress>({
    status: null,
    partnerName: null,
    stepKey: null,
    eta: null,
    destination: null,
  });

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const poll = async (): Promise<void> => {
      const t = await fetchOrderTracking(orderId);
      if (cancelled) return;
      if (t) {
        setState({
          status: t.status,
          partnerName: t.partnerName,
          stepKey: STEP_FOR_STATUS[t.status] ?? null,
          eta: t.eta,
          destination: t.destination,
        });
      }
    };

    void poll();
    const id = setInterval(() => void poll(), POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [orderId]);

  return state;
}

// Customer-facing label for a status. Plain words a shopper understands, and
// never a time — the shop has accepted the order, which is a fact; when it will
// arrive is not one the system knows.
export function statusLabel(status: string | null): string {
  switch (status) {
    case "pending": return "Waiting for the shop to accept";
    case "accepted": return "Preparing your order";
    case "ready": return "Ready — waiting for a delivery partner";
    case "picked_up": return "On the way to you";
    case "delivered": return "Delivered";
    case "rejected": return "The shop could not take this order";
    case "cancelled": return "Cancelled";
    default: return "Getting the latest…";
  }
}
