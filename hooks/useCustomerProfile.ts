// ============================================================
// useCustomerProfile — who THIS person is.
//
// The profile screen rendered MOCK_USER: "Hemant Sharma",
// "+91 98765 43210", "hemant@apanastore.in" — the same person on every phone.
// Fine while one developer tested alone; wrong the moment several people test
// on their own devices, each expecting to be themselves.
//
// The phone is the identity and comes from the verified OTP (AuthContext). Name
// and email live on customer_db.customers via GET/PATCH /api/customer/me, so
// they survive a reinstall and are the same on every screen.
//
// Null name is NULL — never a placeholder. A person who has not told us their
// name is shown their number, not somebody else's name.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const IS_LIVE = API_MODE === "local" || API_MODE === "prod";
const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api/customer`;

export interface CustomerProfile {
  phone: string;
  name: string | null;
  email: string | null;
  city: string | null;
}

export interface ProfileState {
  profile: CustomerProfile | null;
  loading: boolean;
  /** Server message, verbatim — "that email address does not look right" is
   *  actionable; "something went wrong" is not. */
  error: string | null;
  save: (patch: { name?: string | null; email?: string | null }) => Promise<boolean>;
  reload: () => Promise<void>;
}

/**
 * Write a customer's details WITHOUT the hook.
 *
 * 🔴 Registration collected a name and an email, put them in AuthContext, and
 * never sent them anywhere. `customer_db.customers` kept `name: null,
 * email: null`, so the moment the app read the SERVER copy — Edit Profile, a
 * reinstall, a second device — the details a customer had typed at signup were
 * simply gone. Only the phone survived, because the phone IS the identity.
 *
 * Standalone rather than the hook below because the caller is the OTP screen:
 * it knows the phone from the verification it just completed, while the hook
 * reads it from an AuthContext that has not re-rendered yet.
 *
 * Returns false instead of throwing — a profile write must never be able to
 * fail a sign-in that has already succeeded. The details stay editable in
 * Profile either way.
 */
export async function saveCustomerProfile(
  phone: string,
  patch: { name?: string | null; email?: string | null },
): Promise<boolean> {
  if (!IS_LIVE || !phone) return false;
  // Nothing worth sending — do not spend a round-trip writing two nulls over
  // whatever is already there.
  const name = patch.name?.trim() || null;
  const email = patch.email?.trim() || null;
  if (!name && !email) return false;
  try {
    const res = await fetch(`${BASE_URL}/me`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customer_id: phone, ...(name ? { name } : {}), ...(email ? { email } : {}) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function useCustomerProfile(): ProfileState {
  const { user } = useAuth();
  const phone = user?.phone ?? "";
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!IS_LIVE || !phone) {
      // Signed out or off-backend: no profile, and the screen says so rather
      // than falling back to a bundled person.
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/me?customer_id=${encodeURIComponent(phone)}`);
      if (!res.ok) throw new Error(`profile ${res.status}`);
      setProfile((await res.json()) as CustomerProfile);
      setError(null);
    } catch {
      setProfile(null);
      setError("Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }, [phone]);

  useEffect(() => { void reload(); }, [reload]);

  const save = useCallback(
    async (patch: { name?: string | null; email?: string | null }): Promise<boolean> => {
      if (!IS_LIVE || !phone) {
        setError("Sign in to save your profile.");
        return false;
      }
      try {
        const res = await fetch(`${BASE_URL}/me`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ customer_id: phone, ...patch }),
        });
        const body = (await res.json()) as CustomerProfile & { message?: string };
        if (!res.ok) {
          setError(body.message ?? "Could not save.");
          return false;
        }
        setProfile(body);
        setError(null);
        return true;
      } catch {
        setError("Could not reach the server.");
        return false;
      }
    },
    [phone],
  );

  return { profile, loading, error, save, reload };
}

/** What the header shows when a person has not given a name: their own number,
 *  never a stand-in name. */
export function displayName(p: CustomerProfile | null, fallbackPhone?: string | null): string {
  if (p?.name && p.name.trim().length > 0) return p.name;
  return p?.phone ?? fallbackPhone ?? "Your account";
}
