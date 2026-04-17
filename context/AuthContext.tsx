// ============================================================
// AUTH CONTEXT — Apana Store (Customer App)
//
// Provides auth state globally:
//   user          — logged-in user object (null = guest/logged out)
//   isLoggedIn    — true when user is authenticated
//   isGuest       — true when user explicitly skipped login
//   login()       — called after OTP verified, sets user
//   logout()      — clears auth state
//   skipAsGuest() — sets guest mode (can browse but not order)
//
// Auth guard rules:
//   Add to cart   → requires isLoggedIn
//   Checkout      → requires isLoggedIn
//   Saved address → requires isLoggedIn
//   Browse/search → allowed for guests
//
// Backend: POST /auth/verify-otp → returns { access_token, user }
//          POST /auth/refresh    → refreshes access token
// Persistence: AsyncStorage → access_token + refresh_token
// ============================================================

import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  isGuest:      boolean;
  isLoading:    boolean;        // true while checking AsyncStorage on startup
  login:        (user: AuthUser, tokens: { access: string; refresh: string }) => Promise<void>;
  logout:       () => Promise<void>;
  skipAsGuest:  () => void;
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
  const [isGuest,   setIsGuest]   = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from AsyncStorage on app start
  useEffect(() => {
    (async () => {
      try {
        const [storedUser, storedAccess] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.user),
          AsyncStorage.getItem(STORAGE_KEYS.access),
        ]);
        if (storedUser && storedAccess) {
          setUser(JSON.parse(storedUser));
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
    setIsGuest(false);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.user,    JSON.stringify(authUser)),
      AsyncStorage.setItem(STORAGE_KEYS.access,  tokens.access),
      AsyncStorage.setItem(STORAGE_KEYS.refresh, tokens.refresh),
    ]);
  }

  async function logout() {
    setUser(null);
    setIsGuest(false);
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.user),
      AsyncStorage.removeItem(STORAGE_KEYS.access),
      AsyncStorage.removeItem(STORAGE_KEYS.refresh),
    ]);
  }

  function skipAsGuest() {
    setIsGuest(true);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isGuest,
      isLoading,
      login,
      logout,
      skipAsGuest,
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
