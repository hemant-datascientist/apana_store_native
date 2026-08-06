// ============================================================
// Payments — open a payment for an order, then confirm it.
//
// Shape of the real flow, kept identical for the mock so nothing changes when
// Razorpay is switched on:
//
//   init()    → server opens a payment, returns the gateway's order id + public key
//   (sheet)   → the gateway collects the money and hands back a SIGNATURE
//   confirm() → server checks that signature and only then marks the order paid
//
// The app never computes a signature. It could not be trusted to: a client that
// can produce one can mark any order paid without paying. With the mock, the
// SERVER plays the gateway (POST /payments/mock/pay) — which is what a mock is
// for, standing in for Razorpay's servers rather than for the shopper.
// ============================================================

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
export const PAYMENTS_LIVE = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api/customer`;

const TIMEOUT_MS = 20_000;

export interface PaymentIntent {
  payment_id: string;
  provider: string;
  provider_order_id: string;
  public_key: string;
  amount_cents: number;
  currency: string;
  /** False for the mock. Never present a mock payment as a real charge. */
  is_live: boolean;
}

async function post<T>(path: string, body: unknown, headers: Record<string, string> = {}): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    const text = await res.text();
    let parsed: unknown;
    try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = {}; }
    if (!res.ok) {
      const e = parsed as { message?: string; error?: string };
      // Surface the server's reason verbatim — "have 3, need 4" style messages
      // are the ones a shopper can act on.
      throw new Error(e.message ?? e.error ?? `Payment failed (${res.status})`);
    }
    return parsed as T;
  } finally {
    clearTimeout(timer);
  }
}

// Open (or re-open) a payment. `idempotencyKey` must be STABLE for one attempt:
// a phone on a flaky link cannot know its request landed, and without the key
// the retry opens a second payment and charges twice.
export async function initPayment(
  orderId: string,
  customerId: string,
  idempotencyKey: string,
): Promise<PaymentIntent> {
  if (!PAYMENTS_LIVE) throw new Error("Payments need a live connection.");
  return post<PaymentIntent>(
    "/payments/init",
    { order_id: orderId, customer_id: customerId },
    { "idempotency-key": idempotencyKey },
  );
}

// Hand the gateway's signature back for verification. Only this marks the order paid.
export async function confirmPayment(input: {
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}): Promise<{ paid: boolean; order_id: string }> {
  return post("/payments/verify", {
    provider_order_id: input.providerOrderId,
    provider_payment_id: input.providerPaymentId,
    signature: input.signature,
  });
}

// Dev only: ask the SERVER to act as the gateway. Fails when a live provider is
// configured, so this can never quietly stand in for a real charge.
export async function mockGatewayPay(providerOrderId: string): Promise<{
  provider_order_id: string; provider_payment_id: string; signature: string;
}> {
  return post("/payments/mock/pay", { provider_order_id: providerOrderId });
}

// The whole flow for one order. Returns true when the order is genuinely paid.
//
// Razorpay's sheet slots in where mockGatewayPay is: it returns the same three
// fields, so `confirmPayment` and everything after it stay exactly as they are.
export async function payForOrder(
  orderId: string,
  customerId: string,
  idempotencyKey: string,
): Promise<{ paid: boolean; isLive: boolean }> {
  const intent = await initPayment(orderId, customerId, idempotencyKey);

  if (intent.is_live) {
    // Razorpay checkout goes here (react-native-razorpay). Until it is wired,
    // say so plainly rather than silently reporting a payment that never
    // happened — the shop would hand over goods for money that never moved.
    throw new Error("Online payment is not available in this build yet.");
  }

  const gateway = await mockGatewayPay(intent.provider_order_id);
  const res = await confirmPayment({
    providerOrderId: gateway.provider_order_id,
    providerPaymentId: gateway.provider_payment_id,
    signature: gateway.signature,
  });
  return { paid: res.paid, isLive: intent.is_live };
}
