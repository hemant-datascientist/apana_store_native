// ============================================================
// BHARAT DATA — Apana Store (Customer App)
//
// All Indian states + UTs grouped by region.
// SVG shapes live in data/stateSvgMap.ts (keyed by state key).
// ============================================================

export interface StateInfo {
  key:  string;
  name: string;
  abbr: string;
}

export interface RegionGroup {
  key:    string;
  title:  string;
  states: StateInfo[];
}

export const REGION_GROUPS: RegionGroup[] = [

  // ── Northern States ──────────────────────────────────────────
  {
    key:   "north",
    title: "Northern States",
    states: [
      { key: "jk",          name: "Jammu & Kashmir",   abbr: "J&K" },
      { key: "himachal",    name: "Himachal Pradesh",  abbr: "HP"  },
      { key: "punjab",      name: "Punjab",             abbr: "PB"  },
      { key: "haryana",     name: "Haryana",            abbr: "HR"  },
      { key: "delhi",       name: "Delhi",              abbr: "DL"  },
      { key: "uttarakhand", name: "Uttarakhand",        abbr: "UK"  },
      { key: "up",          name: "Uttar Pradesh",      abbr: "UP"  },
    ],
  },

  // ── Central States ──────────────────────────────────────────
  {
    key:   "central",
    title: "Central States",
    states: [
      { key: "mp", name: "Madhya Pradesh", abbr: "MP" },
      { key: "cg", name: "Chhattisgarh",  abbr: "CG" },
    ],
  },

  // ── Western States ──────────────────────────────────────────
  {
    key:   "west",
    title: "Western States",
    states: [
      { key: "rajasthan",   name: "Rajasthan",   abbr: "RJ" },
      { key: "gujarat",     name: "Gujarat",      abbr: "GJ" },
      { key: "maharashtra", name: "Maharashtra",  abbr: "MH" },
      { key: "goa",         name: "Goa",          abbr: "GA" },
    ],
  },

  // ── Eastern States ──────────────────────────────────────────
  {
    key:   "east",
    title: "Eastern States",
    states: [
      { key: "bihar",      name: "Bihar",       abbr: "BR" },
      { key: "jharkhand",  name: "Jharkhand",   abbr: "JH" },
      { key: "odisha",     name: "Odisha",      abbr: "OD" },
      { key: "westbengal", name: "West Bengal", abbr: "WB" },
    ],
  },

  // ── North-Eastern States ─────────────────────────────────────
  {
    key:   "northeast",
    title: "North-Eastern States",
    states: [
      { key: "sikkim",    name: "Sikkim",             abbr: "SK" },
      { key: "arunachal", name: "Arunachal Pradesh",  abbr: "AR" },
      { key: "assam",     name: "Assam",              abbr: "AS" },
      { key: "nagaland",  name: "Nagaland",           abbr: "NL" },
      { key: "meghalaya", name: "Meghalaya",          abbr: "ML" },
      { key: "manipur",   name: "Manipur",            abbr: "MN" },
      { key: "mizoram",   name: "Mizoram",            abbr: "MZ" },
      { key: "tripura",   name: "Tripura",            abbr: "TR" },
    ],
  },

  // ── Southern States ──────────────────────────────────────────
  {
    key:   "south",
    title: "Southern States",
    states: [
      { key: "ap",         name: "Andhra Pradesh", abbr: "AP" },
      { key: "telangana",  name: "Telangana",      abbr: "TS" },
      { key: "karnataka",  name: "Karnataka",      abbr: "KA" },
      { key: "kerala",     name: "Kerala",         abbr: "KL" },
      { key: "tamilnadu",  name: "Tamil Nadu",     abbr: "TN" },
      { key: "puducherry", name: "Puducherry",     abbr: "PY" },
    ],
  },

  // ── Union Territories ─────────────────────────────────────────
  {
    key:   "uts",
    title: "Union Territories",
    states: [
      { key: "chandigarh",  name: "Chandigarh",           abbr: "CH" },
      { key: "dnh",         name: "Dadra & Nagar Haveli", abbr: "DN" },
      { key: "damandiu",    name: "Daman & Diu",          abbr: "DD" },
      { key: "lakshadweep", name: "Lakshadweep",          abbr: "LD" },
      { key: "andaman",     name: "Andaman & Nicobar",    abbr: "AN" },
    ],
  },
];
