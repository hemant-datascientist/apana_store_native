// ============================================================
// ONBOARDING DATA — Apana Store (Customer App)
//
// Slide content for the Get Started screen.
// Replace with remote config / CMS feed when backend is ready.
//
// Backend:
//   GET /app/onboarding-slides → OnboardingSlide[]
// ============================================================

// ── Types ─────────────────────────────────────────────────────
export interface OnboardingSlide {
  icon:  string;   // Ionicons glyph name
  title: string;
  body:  string;
  bg:    string;   // Icon wrap background color
  color: string;   // Icon + title accent color
}

// ── Slide content ─────────────────────────────────────────────
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    icon:  "storefront-outline",
    title: "Shop from Nearby Stores",
    body:  "Discover hundreds of local shops, kirana stores, and brands right in your neighbourhood.",
    bg:    "#EFF6FF",
    color: "#0F4C81",
  },
  {
    icon:  "bicycle-outline",
    title: "Fast Local Delivery",
    body:  "Get groceries, medicines, food & more delivered in minutes — straight from the store near you.",
    bg:    "#F0FDF4",
    color: "#15803D",
  },
  {
    icon:  "heart-outline",
    title: "Support Local Businesses",
    body:  "Every order you place helps local shop owners grow. Shop local, build community.",
    bg:    "#FFF7ED",
    color: "#C2410C",
  },
];
