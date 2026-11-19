// useNetworkOrder — one order with a shop on another ONDC app.
// Each step sends one message to that shop's app and waits (polls) for its answer:
// price (select) -> final bill (init) -> pay -> confirm.
import { useCallback, useRef, useState } from "react";
import { Linking } from "react-native";
import {
  cancelNetworkOrder, confirmNetworkOrder, getNetworkOrder, initNetworkOrder, payNetworkOrder, refreshNetworkOrder, reselectNetworkOrder, startNetworkOrder,
  type NetworkOrder, type NetworkOrderStatus,
} from "../services/ondcNetworkService";
import { mockGatewayPay } from "../services/paymentsService";

const POLL_MS = 1500;
/** Seller apps answer within the message TTL (30 s); after that it is not coming. */
const WAIT_LIMIT_MS = 35_000;
const WAITING: NetworkOrderStatus[] = ["selecting", "initializing", "confirming", "cancelling"];

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
    // A refused cancellation comes back as a confirmed order carrying the shop's reason.
    if (o.status === "confirmed" && o.error?.startsWith("cancellation refused")) throw new Error(o.error);
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
  // After a shortfall: ask again for only what the shop said it has.
  const takeAvailable = () => {
    if (!order?.shortfall) return;
    const left = order.items
      .map((i) => { const s = order.shortfall!.find((x) => x.id === i.id); return { id: i.id, qty: s ? s.available ?? 0 : i.qty }; })
      .filter((i) => i.qty > 0);
    if (!left.length) { setError("Nothing you chose is in stock at this shop. Search again for another shop."); return; }
    return run(() => reselectNetworkOrder(order.id, left));
  };
  // Swap in other items from the same shop (its still-valid search results), same order.
  const swapItems = (items: Array<{ id: string; qty: number }>, searchTxn: string) =>
    order && run(() => reselectNetworkOrder(order.id, items, searchTxn));
  const payAndConfirm = () => order && run(async () => {
    const step = await payNetworkOrder(order.id);
    if (step.collected_by === "BPP") {
      // ONDC: the shop's app collects. Apana confirms without taking money, then opens the
      // shop's own payment page (or the customer pays on delivery when there is no link).
      const confirmed = await confirmNetworkOrder(order.id, {});
      if (step.payment_uri && /^https:\/\//i.test(step.payment_uri)) void Linking.openURL(step.payment_uri);
      return confirmed;
    }
    // A live gateway needs its payment sheet, which this screen does not have yet:
    // say so rather than report a payment that never happened.
    if (step.is_live) throw new Error("Online payment for ONDC shops is not available yet.");
    const gateway = await mockGatewayPay(step.provider_order_id);
    return confirmNetworkOrder(order.id, gateway);
  });

  const load = async (id: string) => {
    try { setOrder(await getNetworkOrder(id)); } catch (e) { setError((e as Error).message); }
  };
  const cancel = (reasonId: string) => order && run(() => cancelNetworkOrder(order.id, reasonId));
  // The shop's app answers a status request a moment later: read again a few times.
  const refresh = async () => {
    if (!order) return;
    setBusy(true); setError(null);
    try {
      await refreshNetworkOrder(order.id);
      for (let i = 0; i < 3 && !cancelled.current; i++) {
        await new Promise((r) => setTimeout(r, POLL_MS));
        setOrder(await getNetworkOrder(order.id));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return { order, busy, error, getPrice, getFinalBill, takeAvailable, swapItems, payAndConfirm, load, cancel, refresh, stop: () => { cancelled.current = true; } };
}
