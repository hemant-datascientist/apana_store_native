// ============================================================
// NEW LAUNCHERS DATA — Apana Store
//
// Tracks what is new in the city:
//   "store"   — a brand-new store has opened
//   "product" — a new product just hit local shelves
//   "concept" — a new business concept (cloud kitchen, rental
//               fashion, direct farm delivery, etc.)
//
// status:
//   "live"        — already available, show "Just Launched"
//   "coming_soon" — announced, show launch date
//
// highlights — up to 3 short bullet points shown on the card
// ============================================================

export type LaunchType   = "store" | "product" | "concept";
export type LaunchStatus = "live" | "coming_soon";

export interface Launch {
  id:           string;
  type:         LaunchType;
  status:       LaunchStatus;
  title:        string;
  subtitle:     string;
  category:     string;
  color:        string;
  badgeText:    string;
  launchedAgo?: string;    // for live:        "2 days ago" | "This week"
  launchDate?:  string;    // for coming_soon: "May 1" | "Next week"
  storeId?:     string;
  isHot?:       boolean;
  highlights:   string[];  // max 3 key selling points
}

// ── Live launches ─────────────────────────────────────────
// ── Coming soon ───────────────────────────────────────────
export const LAUNCHES: Launch[] = [

  // ── LIVE ─────────────────────────────────────────────────
  {
    id:          "l1",
    type:        "concept",
    status:      "live",
    title:       "Cloud Kitchen by Fresh Bakes",
    subtitle:    "Restaurant-quality meals made fresh, delivered in 30 min",
    category:    "Food & Drink",
    color:       "#92400E",
    badgeText:   "New Concept",
    launchedAgo: "2 days ago",
    storeId:     "s5",
    isHot:       true,
    highlights:  ["30-min delivery", "Chef-curated menu", "Daily specials"],
  },
  {
    id:          "l2",
    type:        "store",
    status:      "live",
    title:       "TechZone Service Centre",
    subtitle:    "Repair, upgrade, and service your devices — same-day turnaround",
    category:    "Electronics",
    color:       "#1E3A5F",
    badgeText:   "Just Launched",
    launchedAgo: "This week",
    storeId:     "s2",
    highlights:  ["Same-day repair", "Certified technicians", "90-day warranty"],
  },
  {
    id:          "l3",
    type:        "product",
    status:      "live",
    title:       "Amul Protein Lassi",
    subtitle:    "High-protein yogurt drink — 20g protein per bottle, no added sugar",
    category:    "Grocery",
    color:       "#1E40AF",
    badgeText:   "New Product",
    launchedAgo: "4 days ago",
    isHot:       true,
    highlights:  ["20g protein", "No added sugar", "₹45 per bottle"],
  },
  {
    id:          "l4",
    type:        "concept",
    status:      "live",
    title:       "Style Hub Rental Fashion",
    subtitle:    "Rent premium outfits for events — wear once, return, repeat",
    category:    "Fashion",
    color:       "#6D28D9",
    badgeText:   "New Concept",
    launchedAgo: "1 week ago",
    storeId:     "s4",
    highlights:  ["From ₹299/day", "200+ styles", "Free dry-cleaning"],
  },
  {
    id:          "l5",
    type:        "product",
    status:      "live",
    title:       "Himalaya Immunity Booster Kit",
    subtitle:    "A curated 7-day wellness kit with Ayurvedic herbs and supplements",
    category:    "Health",
    color:       "#065F46",
    badgeText:   "New Product",
    launchedAgo: "3 days ago",
    highlights:  ["7-day kit", "Ayurvedic formula", "₹399 combo"],
  },

  // ── COMING SOON ───────────────────────────────────────────
  {
    id:         "l6",
    type:       "concept",
    status:     "coming_soon",
    title:      "Apana Meat & Fish Hub",
    subtitle:   "Fresh, locally sourced meat & seafood — delivered cold-chain to your door",
    category:   "Grocery",
    color:      "#DC2626",
    badgeText:  "Coming Soon",
    launchDate: "May 1",
    isHot:      true,
    highlights: ["Daily fresh stock", "Vacuum packed", "Halal & Jhatka certified"],
  },
  {
    id:         "l7",
    type:       "concept",
    status:     "coming_soon",
    title:      "Farmer Direct Produce",
    subtitle:   "Buy vegetables & fruits straight from local farmers — zero middlemen",
    category:   "Grocery",
    color:      "#166534",
    badgeText:  "Coming Soon",
    launchDate: "May 10",
    highlights: ["Farm-to-table", "40% cheaper", "Weekly subscription"],
  },
  {
    id:         "l8",
    type:       "store",
    status:     "coming_soon",
    title:      "boAt Flagship Experience Store",
    subtitle:   "Try every boAt product before you buy — full hands-on demo experience",
    category:   "Electronics",
    color:      "#7C3AED",
    badgeText:  "Coming Soon",
    launchDate: "May 15",
    highlights: ["Full product range", "Live demos", "Exclusive launch deals"],
  },
];

// ── Helper: separate live from coming soon ────────────────
export const getLiveLaunches         = () => LAUNCHES.filter(l => l.status === "live");
export const getComingSoonLaunches   = () => LAUNCHES.filter(l => l.status === "coming_soon");
