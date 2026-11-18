// useNetworkOrder — one order with a shop on another ONDC app.
// Each step sends one message to that shop's app and waits (polls) for its answer:
// price (select) -> final bill (init) -> pay -> confirm.
import { useCallback, useRef, useState } from "react";
import {
  confirmNetworkOrder, getNetworkOrder, initNetworkOrder, payNetworkOrder, startNetworkOrder,
  type NetworkOrder, type NetworkOrderStatus,
} from "../services/ondcNetworkService";
import { mockGatewayPay } from "../services/paymentsService";

const POLL_MS = 1500;
/** Seller apps answer within the message TTL (30 s); after that it is not coming. */
const WAIT_LIMIT_MS = 35_000;
const WAITING: NetworkOrderStatus[] = ["selecting", "initializing", "confirming"];

export function useNetworkOrder() {
  const [order, setOrder] = useState<NetworkOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelled = useRef(false);

  // Wait for the shop's app to answer the step just sent.
  const settle = useCallback(async (first: NetworkOrder): Promise<NetworkOrder> => {
    let o = first;
    const until = Date.now() + WAIT_LIMIT_MS;
    while (WAITING.includes(o.status) && Date.now() < until && !cancelled.current) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      o = await getNetworkOrder(o.id);
      setOrder(o);
    }
    if (WAITING.includes(o.status)) throw new Error("The shop's app has not answered yet. Check again in a minute.");
    if (o.status === "failed") throw new Error(o.error ?? "The shop's app refused this order.");
    return o;
  }, []);

  const run = useCallback(async (step: () => Promise<NetworkOrder>) => {
    setBusy(true); setError(null);
    try {
      const o = await step();
      setOrder(o);
      setOrder(await settle(o));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [settle]);

  const getPrice = (input: Parameters<typeof startNetworkOrder>[0]) => run(() => startNetworkOrder(input));
  const getFinalBill = (addressId: string) => order && run(() => initNetworkOrder(order.id, addressId));
  const payAndConfirm = () => order && run(async () => {
    const intent = await payNetworkOrder(order.id);
    // A live gateway needs its payment sheet, which this screen does not have yet:
    // say so rather than report a payment that never happened.
    if (intent.is_live) throw new Error("Online payment for ONDC shops is not available yet.");
    const gateway = await mockGatewayPay(intent.provider_order_id);
    return confirmNetworkOrder(order.id, gateway);
  });

  return { order, busy, error, getPrice, getFinalBill, payAndConfirm, stop: () => { cancelled.current = true; } };
}
