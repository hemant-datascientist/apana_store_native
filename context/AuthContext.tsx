// ============================================================
// AUTH CONTEXT — Apana Store (Customer App)
//
// Provides auth state globally:
//   user          — logged-in user object (null = logged out)
//   isLoggedIn    — true when user is authenticated
//   login()       — called after OTP verified, sets user
//   logout()      — clears auth state
//
// 🔴 GUEST MODE IS GONE.
//
// `isGuest` / `skipAsGuest()` let someone into the app with no account: the
// home screen loaded and Profile showed an empty name, no number and no
// orders, because there was nobody to show. The flag it persisted
// (`apana_guest_mode`) was never even written — it only ever read null — so
// "browse as guest" was half-built from the start.
//
// Everything here is keyed to a phone: orders, saved addresses, the cart that
// gets checked out, the DIGIPIN a rider is sent to. A browse-before-signup
// mode is a legitimate product choice, but it has to be BUILT (a feed that
// works without an identity, a cart that survives sign-up), not approximated
// by skipping the login screen.
//
// Backend: POST /auth/verify-otp → returns { access_token, user }
//          POST /auth/refresh    → refreshes access token
// Persistence: AsyncStorage → access_token + refresh_token
// ============================================================

import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { revokeToken } from "../services/authService";
import { isSessionUsable } from "../lib/session";

// ── Types ─────────────────────────────────────────────────────
export interface AuthUser {
  id:         string;
  name:       string | null;
  phone:      string | null;
  email:      string | null;
  avatar_url: string | null;
  is_new:     boolean;          // true → redirect to profile setup
}

interface AuthContextValue {
  user:         AuthUser | null;
  isLoggedIn:   boolean;
  isLoading:    boolean;        // true while checking AsyncStorage on startup
  login:        (user: AuthUser, tokens: { access: string; refresh: string }) => Promise<void>;
  logout:       () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEYS = {
  access:  "apana_access_token",
  refresh: "apana_refresh_token",
  user:    "apana_user",
};

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from AsyncStorage on app start
  useEffect(() => {
    (async () => {
      try {
        const [storedUser, storedAccess] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.user),
          AsyncStorage.getItem(STORAGE_KEYS.access),
        ]);
        // A stored token that has already EXPIRED is still a non-empty string.
        // Restoring the session from its presence alone left the customer
        // "logged in" against a dead token — their orders, addresses and
        // profile all failed, and nothing sent them back to sign-in. Clear it
        // instead, so the next screen that needs an account asks properly.
        if (storedUser && storedAccess && isSessionUsable(storedAccess)) {
          setUser(JSON.parse(storedUser));
        } else if (storedAccess) {
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.user, STORAGE_KEYS.access, STORAGE_KEYS.refresh,
          ]);
        }
      } catch {
        // Storage read failed — start fresh
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function login(authUser: AuthUser, tokens: { access: string; refresh: string }) {
    setUser(authUser);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.user,    JSON.stringify(authUser)),
      AsyncStorage.setItem(STORAGE_KEYS.access,  tokens.access),
      AsyncStorage.setItem(STORAGE_KEYS.refresh, tokens.refresh),
    ]);
  }

  async function logout() {
    // Tell the server first, while the token is still readable. The backend
    // blocklists the jti, so a token that leaves this device stops working —
    // clearing only local storage would leave it valid until it expired.
    // Best-effort: being offline must never prevent signing out locally.
    const token = await AsyncStorage.getItem(STORAGE_KEYS.access);
    if (token) await revokeToken(token);

    setUser(null);
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.user),
      AsyncStorage.removeItem(STORAGE_KEYS.access),
      AsyncStorage.removeItem(STORAGE_KEYS.refresh),
    ]);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
