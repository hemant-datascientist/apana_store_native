// ============================================================
// useTheme — Apana Store (Customer App)
//
// Shorthand hook for accessing the theme context.
// Identical pattern to apana_seller and apana_partner.
//
// Usage:
//   const { colors, isDark } = useTheme();
//   const { colors, themeMode, setThemeMode, brand, setBrand } = useTheme();
// ============================================================

import { useAppTheme } from "./ThemeContext";

export default function useTheme() {
  return useAppTheme();
}
