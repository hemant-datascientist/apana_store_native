// ============================================================
// COLORS — Apana Store (Customer App)
//
// Extends the shared Apana color system with the customer app's
// brand identity: Apana Blue (#0F4C81) as the primary brand color.
//
// Base light/dark tokens are identical across all Apana apps.
// Brand colors give each app its own identity while sharing the
// same underlying design system.
// ============================================================

// ── Brand Colors ───────────────────────────────────────────────
// "apanaBlue" is the customer app's primary identity color.
// Other brand options available for future customization.
export const brandColors = {
  apanaBlue: "#0F4C81",   // Apana Store primary — deep trust blue
  green:     "#16A34A",
  blue:      "#2563EB",
  red:       "#DC2626",
  orange:    "#F97316",
  purple:    "#9333EA",
  teal:      "#14B8A6",
  pink:      "#EC4899",
};

// ── Category Accent Colors ─────────────────────────────────────
// Used for store/product category pins and badges.
export const categoryColors = {
  grocery:     { color: "#16A34A", bg: "#DCFCE7" },
  pharmacy:    { color: "#EF4444", bg: "#FEE2E2" },
  electronics: { color: "#3B82F6", bg: "#DBEAFE" },
  fashion:     { color: "#EC4899", bg: "#FCE7F3" },
  food:        { color: "#F97316", bg: "#FFEDD5" },
  beauty:      { color: "#8B5CF6", bg: "#EDE9FE" },
  sports:      { color: "#14B8A6", bg: "#CCFBF1" },
  home:        { color: "#F59E0B", bg: "#FEF3C7" },
};

// ── Fulfillment Mode Colors ────────────────────────────────────
// Pickup / Delivery / Ride — each gets a distinct color identity.
export const fulfillmentColors = {
  pickup:   { color: "#16A34A", bg: "#DCFCE7" },   // green — self-service
  delivery: { color: "#3B82F6", bg: "#DBEAFE" },   // blue  — courier
  ride:     { color: "#8B5CF6", bg: "#EDE9FE" },   // violet — ride-hailing
};

// ── Light Base (Fixed) ─────────────────────────────────────────
export const lightBaseColors = {
  green_color:  "#15803D",
  primaryLight: "#E0ECF8",       // Apana Blue light tint
  background:   "#F8FAFC",
  card:         "#FFFFFF",
  border:       "#E5E7EB",

  text:         "#111827",
  subText:      "#6B7280",

  success:      "#22C55E",
  successLight: "#DCFCE7",

  warning:      "#F59E0B",
  warningLight: "#FEF3C7",

  danger:       "#EF4444",
  dangerLight:  "#FEE2E2",
  dangerDark:   "#B91C1C",

  white: "#FFFFFF",
  black: "#000000",
  blue:  "#0F4C81",
};

// ── Dark Base (Fixed) ──────────────────────────────────────────
export const darkBaseColors = {
  green_color:  "#22C55E",
  primaryLight: "#0A1F3D",       // Apana Blue deep tint for dark
  background:   "#0A1628",       // Rich navy — matches brand identity
  card:         "#112240",       // Deep navy card
  border:       "#1E3A5F",       // Subtle navy border

  text:         "#F0F6FF",
  subText:      "#8BA5C2",

  success:      "#22C55E",
  successLight: "#14532D",

  warning:      "#F59E0B",
  warningLight: "#78350F",

  danger:       "#EF4444",
  dangerLight:  "#7F1D1D",
  dangerDark:   "#7F1D1D",

  white: "#FFFFFF",
  black: "#000000",
  blue:  "#4A90D9",              // Lighter blue for dark mode readability
};
