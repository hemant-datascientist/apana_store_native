// ============================================================
// useHandoverCodes — the REAL handshake code + live status per order.
//
// The QR screens used to encode an invented JSON payload that no scanner in
// Apana accepts, beside "Simulate Scan" buttons that jumped to "collected"
// with nothing happening on the server. The code that actually completes a
// handover (ADL-…) is handed out ONLY on the customer's own order list, so
// this reads it from there and keeps polling: the QR must appear the moment
// it becomes scannable, and the screen must move on once the scan happened.
// ============================================================

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchOrderHistory } from "../services/orderHistoryService";
import type { Order } from "../data/orderHistoryData";

const POLL_MS = 8_000;

export interface HandoverState {
  code: string | null;
  status: Order["status"];
  /** A scanner will accept this code right now. */
  scannable: boolean;
}

export default function useHandoverCodes(orderIds: string[]): Record<string, HandoverState> {
  const { user } = useAuth();
  const customerId = user?.phone ?? "";
  const key = orderIds.filter(Boolean).sort().join(",");
  const [byId, setById] = useState<Record<string, HandoverState>>({});

  useEffect(() => {
    if (!customerId || !key) return;
    const wanted = new Set(key.split(","));
    let alive = true;
    const load = () =>
      fetchOrderHistory(customerId)
        .then((orders) => {
          if (!alive) return;
          const next: Record<string, HandoverState> = {};
          for (const o of orders) {
            if (!wanted.has(o.id)) continue;
            next[o.id] = {
              code: o.handoverCode ?? null,
              status: o.status,
              // Pickup: the shop scans it once the order is packed.
              // Delivery: the rider scans it at the door, after collecting.
              scannable: Boolean(o.handoverCode) && (o.readyToCollect === true || o.status === "picked_up"),
            };
          }
          setById(next);
        })
        // A failed poll keeps the last answer rather than hiding a valid QR.
        .catch(() => {});
    void load();
    const t = setInterval(load, POLL_MS);
    return () => { alive = false; clearInterval(t); };
  }, [customerId, key]);

  return byId;
}
