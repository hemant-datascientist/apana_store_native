// useRazorpay — `collect` for payForOrder, plus the sheet to render.
//
//   const { collect, sheet } = useRazorpay(phone);
//   await payForOrder(orderId, phone, key, collect);
//   …render {sheet} anywhere in the screen.
//
// collect opens RazorpaySheet and resolves with Razorpay's payment id +
// signature, or rejects with the reason the customer should read.

import React, { useCallback, useRef, useState } from "react";
import RazorpaySheet, { type RazorpayResult } from "../components/checkout/RazorpaySheet";
import type { PaymentIntent } from "../services/paymentsService";

export function useRazorpay(contact?: string) {
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const pending = useRef<{ resolve: (r: RazorpayResult) => void; reject: (e: Error) => void } | null>(null);

  const collect = useCallback((i: PaymentIntent) => new Promise<RazorpayResult>((resolve, reject) => {
    pending.current = { resolve, reject };
    setIntent(i);
  }), []);

  const finish = (fn: (p: NonNullable<typeof pending.current>) => void) => {
    const p = pending.current;
    pending.current = null;
    setIntent(null);
    if (p) fn(p);
  };

  const sheet = (
    <RazorpaySheet
      intent={intent}
      contact={contact}
      onPaid={(r) => finish((p) => p.resolve(r))}
      onCancel={(reason) => finish((p) => p.reject(new Error(reason)))}
    />
  );
  return { collect, sheet };
}
