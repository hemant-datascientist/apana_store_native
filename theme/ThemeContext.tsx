// ============================================================
// THEME CONTEXT — Apana Store (Customer App)
//
// Same architecture as apana_partner/apana_seller.
// Provides colors (light/dark base + dynamic brand primary),
// theme mode (system/light/dark), and brand color selection.
// Theme + brand choices are persisted via AsyncStorage.
//
// Default brand: "apanaBlue" (#0F4C81) — customer app identity.
//
// Usage:
//   Wrap your app root with <ThemeProvider>
//   Consume via useTheme() shorthand hook
// ============================================================

import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightBaseColors, darkBaseColors, brandColors } from "./colors";

// ── Types ──────────────────────────────────────────────────────

type ThemeMode = "system" | "light" | "dark";
type BrandType = keyof typeof brandColors;

type ThemeType = {
  colors: typeof lightBaseColors & { primary: string };
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  brand: BrandType;
  setBrand: (brand: BrandType) => void;
};

// ── Context ────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeType | null>(null);

// ── Provider ───────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();

  // Customer app defaults to "apanaBlue" (#0F4C81)
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [brand,     setBrandState]     = useState<BrandType>("apanaBlue");

  // Prevents UI flicker before persisted values are restored
  const [loaded, setLoaded] = useState(false);

  // ── Load saved theme + brand from storage on mount ──
  useEffect(() => {
    AsyncStorage.multiGet(["STORE_THEME", "STORE_BRAND"])
      .then(([[, savedTheme], [, savedBrand]]) => {
        if (savedTheme) setThemeModeState(savedTheme as ThemeMode);
        if (savedBrand) setBrandState(savedBrand as BrandType);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // ── Persist theme mode change ──
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem("STORE_THEME", mode).catch(() => {});
  };

  // ── Persist brand color change ──
  const setBrand = (selected: BrandType) => {
    setBrandState(selected);
    AsyncStorage.setItem("STORE_BRAND", selected).catch(() => {});
  };

  // ── Resolve dark mode ──
  const isDark =
    themeMode === "dark"  ? true  :
    themeMode === "light" ? false :
    systemTheme === "dark";

  // ── Merge base colors with active brand primary ──
  const base   = isDark ? darkBaseColors : lightBaseColors;
  const colors = { ...base, primary: brandColors[brand] };

  // Block render until storage is restored (prevents flicker)
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode, setThemeMode, brand, setBrand }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used inside ThemeProvider");
  return context;
};
