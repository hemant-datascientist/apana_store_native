// ============================================================
// CUSTOMER AUTH — real OTP, so each tester is their own customer.
//
// The OTP screen used to mint `mock_access_<timestamp>` locally and call
// login(). Nothing reached the server, and `user.phone` was whatever the person
// typed — 10 digits, or an email address.
//
// That matters more here than it looks, because `user.phone` IS the customer id
// everywhere downstream: saved addresses, orders, cart resolution. A local mock
// meant anyone could type any number and read another person's order history and
// saved addresses, and two testers typing the same number became one customer.
//
//   POST /auth/otp/send    { identifier, channel }
//   POST /auth/otp/verify  { identifier, otp, role:"customer" }  -> { token }
//
// The MOCK provider returns the code in the send response (mock provider AND
// non-production only), so testers wait for no SMS and there is no bill.
//
// No KYC, no password — this is identity, not security hardening. That is the
// MVP bar: the app must know WHO you are so your orders are yours.
// ============================================================

import { API_BASE_URL } from "./api/client";

// The client's base is /api/customer, but auth is audience-neutral at /api/auth.
const AUTH_BASE = `${API_BASE_URL.replace(/\/api\/customer$/, "")}/api/auth`;

const TIMEOUT_MS = 12_000;

/** India-only in V1. The backend stores and matches E.164. */
export function toE164(input: string): string {
  const digits = input.replace(/\D/g, "");
  return `+91${digits.slice(-10)}`;
}

async function call<T>(path: string, body: unknown): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${AUTH_BASE}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    const text = await res.text();
    let parsed: unknown;
    try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = {}; }
    if (!res.ok) {
      const e = parsed as { message?: string; error?: string };
      // Server messages here are written for a person ("Too many codes
      // requested. Try again in 12 min."), so pass them straight through.
      throw new Error(e.message ?? e.error ?? `Request failed (${res.status})`);
    }
    return parsed as T;
  } finally {
    clearTimeout(timer);
  }
}

export interface OtpSendResult {
  expiresIn: number;
  /** Mock provider in dev only — lets the app prefill so testers do not wait. */
  devOtp?: string;
}

export async function sendOtp(identifier: string, channel: "sms" | "email" = "sms"): Promise<OtpSendResult> {
  const body = await call<{ expiresIn?: number; otp?: string }>("/otp/send", { identifier, channel });
  return { expiresIn: body.expiresIn ?? 300, devOtp: body.otp };
}

export interface VerifyResult {
  token: string;
  /** The identifier the server now knows this person by — the customer id. */
  identifier: string;
}

export async function verifyOtp(identifier: string, otp: string): Promise<VerifyResult> {
  const body = await call<{ token?: string }>("/otp/verify", {
    identifier,
    otp,
    role: "customer",
  });
  if (!body.token) throw new Error("Could not sign in. Please try again.");
  return { token: body.token, identifier };
}

/** Best-effort revocation. Logging out locally must never be blocked by it. */
export async function revokeToken(token: string): Promise<void> {
  try {
    await fetch(`${AUTH_BASE}/logout`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });
  } catch {
    // offline — the local session is cleared regardless
  }
}
