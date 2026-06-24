// ============================================================
// ASC BADGES — Apana Store (Customer App · Map View store card)
//
// Single source for the store-type tag pill on the Map View card: all 69 ASC
// §16 types → { tag label, Ionicon, colour family }. Mirrors the spec in
//   apana_doc/architecture/map_store_card_badges.md
// and the codes in apana_registry_web/lib/asc.ts (ASC-INV-<3> | ASC-SVC-NN |
// ASC-MNU-NN). Self-contained — the registry-web lib is a different package, so
// the canonical 69-row table is duplicated here as presentation data only.
//
// 13 colour families (reuse, never invent per-type colours):
//   accent = pill bg + icon tint · tile = icon-tile bg.
//
// ascStyle(code) is the resolver the live nearby service calls once the BE
// seller emits its ASC code; until then the coarse seller-type map still
// applies (services/nearbyStoresService.ts TYPE_STYLE fallback). §19.8:
// presentation only — never invents a store/rating/state.
// ============================================================

const FAMILY = {
  green:     { accent: "#166534", tile: "#D1FAE5" },
  deepGreen: { accent: "#0F5132", tile: "#DCFCE7" },
  navy:      { accent: "#1E3A5F", tile: "#DBEAFE" },
  blue:      { accent: "#1D4ED8", tile: "#DBEAFE" },
  violet:    { accent: "#6D28D9", tile: "#EDE9FE" },
  indigo:    { accent: "#3730A3", tile: "#E0E7FF" },
  amber:     { accent: "#92400E", tile: "#FEF3C7" },
  orange:    { accent: "#C2410C", tile: "#FFEDD5" },
  rose:      { accent: "#BE185D", tile: "#FCE7F3" },
  brown:     { accent: "#78350F", tile: "#F5E6D8" },
  teal:      { accent: "#0F766E", tile: "#CCFBF1" },
  slate:     { accent: "#334155", tile: "#E2E8F0" },
  maroon:    { accent: "#7F1D1D", tile: "#FEE2E2" },
} as const;

type AscFamily = keyof typeof FAMILY;

interface AscBadge { label: string; icon: string; family: AscFamily; }

// ── 69 store types keyed by full ASC code ────────────────────
export const ASC_BADGES: Record<string, AscBadge> = {
  // Inventory (39) — ASC-INV-*
  "ASC-INV-KIR": { label: "Kirana",      icon: "basket-outline",              family: "green" },
  "ASC-INV-FAS": { label: "Fashion",     icon: "shirt-outline",               family: "violet" },
  "ASC-INV-JWL": { label: "Jewellery",   icon: "diamond-outline",             family: "amber" },
  "ASC-INV-ICE": { label: "Ice Cream",   icon: "ice-cream-outline",           family: "rose" },
  "ASC-INV-PHA": { label: "Pharmacy",    icon: "medical-outline",             family: "deepGreen" },
  "ASC-INV-FIT": { label: "Fitness",     icon: "barbell-outline",             family: "blue" },
  "ASC-INV-BTY": { label: "Beauty",      icon: "sparkles-outline",            family: "rose" },
  "ASC-INV-MOB": { label: "Mobiles",     icon: "phone-portrait-outline",      family: "navy" },
  "ASC-INV-CPU": { label: "Computers",   icon: "laptop-outline",              family: "navy" },
  "ASC-INV-APL": { label: "Appliances",  icon: "tv-outline",                  family: "navy" },
  "ASC-INV-HRD": { label: "Hardware",    icon: "hammer-outline",              family: "amber" },
  "ASC-INV-FUR": { label: "Furniture",   icon: "bed-outline",                 family: "brown" },
  "ASC-INV-SPT": { label: "Sports",      icon: "football-outline",            family: "teal" },
  "ASC-INV-BKS": { label: "Books",       icon: "book-outline",                family: "indigo" },
  "ASC-INV-EYE": { label: "Eyewear",     icon: "glasses-outline",             family: "slate" },
  "ASC-INV-WCH": { label: "Watches",     icon: "watch-outline",               family: "slate" },
  "ASC-INV-VEH": { label: "Vehicles",    icon: "car-sport-outline",           family: "maroon" },
  "ASC-INV-BAK": { label: "Bakery",      icon: "cafe-outline",                family: "amber" },
  "ASC-INV-DAI": { label: "Dairy",       icon: "nutrition-outline",           family: "green" },
  "ASC-INV-FLW": { label: "Florist",     icon: "flower-outline",              family: "green" },
  "ASC-INV-DEC": { label: "Decor",       icon: "color-palette-outline",       family: "violet" },
  "ASC-INV-BBY": { label: "Baby",        icon: "happy-outline",               family: "rose" },
  "ASC-INV-ORG": { label: "Organic",     icon: "leaf-outline",                family: "green" },
  "ASC-INV-PAN": { label: "Paan",        icon: "leaf-outline",                family: "deepGreen" },
  "ASC-INV-FOO": { label: "Footwear",    icon: "footsteps-outline",           family: "brown" },
  "ASC-INV-GFT": { label: "Gifts",       icon: "gift-outline",                family: "rose" },
  "ASC-INV-POO": { label: "Pooja",       icon: "flame-outline",               family: "orange" },
  "ASC-INV-MUS": { label: "Music",       icon: "musical-notes-outline",       family: "indigo" },
  "ASC-INV-LIQ": { label: "Liquor",      icon: "wine-outline",                family: "maroon" },
  "ASC-INV-ELC": { label: "Electrical",  icon: "flash-outline",               family: "amber" },
  "ASC-INV-PNT": { label: "Paint",       icon: "color-fill-outline",          family: "blue" },
  "ASC-INV-AGR": { label: "Agri",        icon: "leaf-outline",                family: "green" },
  "ASC-INV-PET": { label: "Pets",        icon: "paw-outline",                 family: "brown" },
  "ASC-INV-MLL": { label: "Mall",        icon: "storefront-outline",          family: "navy" },
  "ASC-INV-MIX": { label: "Multi-Store", icon: "grid-outline",                family: "slate" },
  "ASC-INV-OTH": { label: "Other",       icon: "ellipsis-horizontal-outline", family: "slate" },
  "ASC-INV-OPL": { label: "Optical",     icon: "eye-outline",                 family: "slate" },
  "ASC-INV-TYR": { label: "Tyre",        icon: "ellipse-outline",             family: "slate" },
  "ASC-INV-CNG": { label: "Fuel",        icon: "flame-outline",               family: "maroon" },

  // Service (19) — ASC-SVC-*
  "ASC-SVC-01": { label: "Salon",        icon: "cut-outline",                 family: "violet" },
  "ASC-SVC-02": { label: "Repair",       icon: "build-outline",               family: "blue" },
  "ASC-SVC-03": { label: "Tailoring",    icon: "cut-outline",                 family: "violet" },
  "ASC-SVC-04": { label: "Laundry",      icon: "water-outline",               family: "blue" },
  "ASC-SVC-05": { label: "Lab",          icon: "flask-outline",               family: "teal" },
  "ASC-SVC-06": { label: "Printing",     icon: "print-outline",               family: "slate" },
  "ASC-SVC-07": { label: "Travel",       icon: "airplane-outline",            family: "blue" },
  "ASC-SVC-08": { label: "Catering",     icon: "restaurant-outline",          family: "orange" },
  "ASC-SVC-09": { label: "Studio",       icon: "camera-outline",              family: "slate" },
  "ASC-SVC-10": { label: "Clinic",       icon: "medkit-outline",              family: "deepGreen" },
  "ASC-SVC-11": { label: "Accountant",   icon: "calculator-outline",          family: "navy" },
  "ASC-SVC-12": { label: "Legal",        icon: "document-text-outline",       family: "navy" },
  "ASC-SVC-13": { label: "Coaching",     icon: "school-outline",              family: "indigo" },
  "ASC-SVC-14": { label: "Service",      icon: "ellipsis-horizontal-outline", family: "slate" },
  "ASC-SVC-15": { label: "Auto Care",    icon: "car-outline",                 family: "blue" },
  "ASC-SVC-16": { label: "Classes",      icon: "body-outline",                family: "violet" },
  "ASC-SVC-17": { label: "Real Estate",  icon: "home-outline",                family: "teal" },
  "ASC-SVC-18": { label: "Insurance",    icon: "shield-checkmark-outline",    family: "navy" },
  "ASC-SVC-19": { label: "CSC",          icon: "globe-outline",               family: "blue" },

  // Menu (11) — ASC-MNU-*
  "ASC-MNU-01": { label: "Restaurant",   icon: "restaurant-outline",          family: "orange" },
  "ASC-MNU-02": { label: "Ice Cream",    icon: "ice-cream-outline",           family: "rose" },
  "ASC-MNU-03": { label: "Bakery",       icon: "cafe-outline",                family: "orange" },
  "ASC-MNU-04": { label: "Cold Drinks",  icon: "nutrition-outline",           family: "teal" },
  "ASC-MNU-05": { label: "Tea & Coffee", icon: "cafe-outline",                family: "brown" },
  "ASC-MNU-06": { label: "Paan",         icon: "leaf-outline",                family: "deepGreen" },
  "ASC-MNU-07": { label: "Street Food",  icon: "fast-food-outline",           family: "orange" },
  "ASC-MNU-08": { label: "Stall",        icon: "fast-food-outline",           family: "slate" },
  "ASC-MNU-09": { label: "Cloud KTN",    icon: "cloud-outline",               family: "orange" },
  "ASC-MNU-10": { label: "Tiffin",       icon: "restaurant-outline",          family: "amber" },
  "ASC-MNU-11": { label: "Banquet",      icon: "business-outline",            family: "violet" },
};

// Inventory 3-letter short codes (§16.8) → full code, so a BE that ships "KIR"
// resolves the same as "ASC-INV-KIR".
const SHORT_TO_CODE: Record<string, string> = Object.keys(ASC_BADGES).reduce((acc, code) => {
  if (code.startsWith("ASC-INV-")) acc[code.slice(-3)] = code;
  return acc;
}, {} as Record<string, string>);

// Map an ASC type onto the coarse Map category-filter bucket (grocery /
// electronics / pharmacy / fashion / food / service). Vestigial today (the /map
// chips don't filter), kept consistent for when they return.
const CATEGORY_OVERRIDE: Record<string, string> = {
  "ASC-INV-MOB": "electronics", "ASC-INV-CPU": "electronics", "ASC-INV-APL": "electronics",
  "ASC-INV-PHA": "pharmacy",
  "ASC-INV-FAS": "fashion",     "ASC-INV-FOO": "fashion",
  "ASC-INV-BAK": "food",
};

function categoryFor(code: string): string {
  const override = CATEGORY_OVERRIDE[code];
  if (override) return override;
  if (code.startsWith("ASC-SVC-")) return "service";
  if (code.startsWith("ASC-MNU-")) return "food";
  return "grocery";
}

// Pin styling resolved from an ASC code (full or inventory short). Shape matches
// the live service's TypeStyle so it drops straight into fromWire.
export interface AscPinStyle {
  category:    string;
  label:       string;
  icon:        string;
  accentColor: string;
  iconBg:      string;
}

export function ascStyle(code?: string | null): AscPinStyle | null {
  if (!code) return null;
  const up = code.toUpperCase();
  const full = ASC_BADGES[up] ? up : SHORT_TO_CODE[up];
  const badge = full ? ASC_BADGES[full] : undefined;
  if (!full || !badge) return null;
  const fam = FAMILY[badge.family];
  return {
    category:    categoryFor(full),
    label:       badge.label,
    icon:        badge.icon,
    accentColor: fam.accent,
    iconBg:      fam.tile,
  };
}
