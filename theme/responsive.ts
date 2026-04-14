// ============================================================
// RESPONSIVE UTILITY — useResponsive() hook
//
// Shared across all Apana apps. Provides reactive layout values
// derived from useWindowDimensions() so all screens respond
// correctly to orientation changes and tablet/phone sizes.
//
// Usage:
//   const { isTablet, isLandscape, spacing, columns, width } = useResponsive();
// ============================================================

import { useWindowDimensions } from "react-native";

const TABLET_BREAKPOINT = 768;

export interface ResponsiveValues {
  width:          number;
  height:         number;
  isTablet:       boolean;
  isLandscape:    boolean;
  spacing: {
    xs: number;   // 4 (phone) / 6 (tablet)
    sm: number;   // 8 (phone) / 12 (tablet)
    md: number;   // 16 (phone) / 20 (tablet)
    lg: number;   // 22 (phone) / 28 (tablet)
    xl: number;   // 28 (phone) / 36 (tablet)
  };
  columns:        number;
  screenPadding:  number;
  maxContentWidth:number;
}

export function useResponsive(): ResponsiveValues {
  const { width, height } = useWindowDimensions();

  const isTablet    = width >= TABLET_BREAKPOINT;
  const isLandscape = width > height;

  const spacing = {
    xs: isTablet ? 6  : 4,
    sm: isTablet ? 12 : 8,
    md: isTablet ? 20 : 16,
    lg: isTablet ? 28 : 22,
    xl: isTablet ? 36 : 28,
  };

  const columns = isTablet
    ? (isLandscape ? 4 : 3)
    : 2;

  const screenPadding   = isTablet ? 32 : 16;
  const maxContentWidth = isTablet ? 720 : width;

  return { width, height, isTablet, isLandscape, spacing, columns, screenPadding, maxContentWidth };
}
