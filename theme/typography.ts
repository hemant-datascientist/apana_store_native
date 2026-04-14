// ============================================================
// TYPOGRAPHY — Apana Store (Customer App)
//
// Shared font system across all Apana apps.
// Font family: Poppins (loaded in app/_layout.tsx via expo-font)
// Size scale: ss → xxl (10px → 24px)
//
// Usage:
//   import { typography } from '../theme/typography';
//   fontFamily: typography.fontFamily.semiBold
//   fontSize:   typography.size.md
// ============================================================

export const typography = {
  // ── Font Families ──────────────────────────────────────────
  fontFamily: {
    small:    "Poppins_300Light",       // Thin / subtle labels
    regular:  "Poppins_400Regular",     // Body text
    medium:   "Poppins_500Medium",      // Slightly emphasized text
    semiBold: "Poppins_600SemiBold",    // Subheadings, card titles
    bold:     "Poppins_700Bold",        // Headings, primary labels
  },

  // ── Size Scale ─────────────────────────────────────────────
  size: {
    ss:  10,  // Extra extra small — badges, micro labels
    xs:  12,  // Extra small — captions, helper text
    sm:  14,  // Small — secondary text, form labels
    md:  16,  // Medium — default body text
    lg:  18,  // Large — section titles
    xl:  20,  // Extra large — screen headings
    xxl: 24,  // Extra extra large — hero text, big numbers
  },
};
