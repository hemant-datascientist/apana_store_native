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
  storesLive: number;
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
      { key: "jk",          name: "Jammu & Kashmir",   abbr: "J&K", storesLive: 125000 },
      { key: "himachal",    name: "Himachal Pradesh",  abbr: "HP",  storesLive: 85000 },
      { key: "punjab",      name: "Punjab",             abbr: "PB",  storesLive: 450000 },
      { key: "haryana",     name: "Haryana",            abbr: "HR",  storesLive: 320000 },
      { key: "delhi",       name: "Delhi",              abbr: "DL",  storesLive: 580000 },
      { key: "uttarakhand", name: "Uttarakhand",        abbr: "UK",  storesLive: 140000 },
      { key: "up",          name: "Uttar Pradesh",      abbr: "UP",  storesLive: 1850000 },
    ],
  },

  // ── Central States ──────────────────────────────────────────
  {
    key:   "central",
    title: "Central States",
    states: [
      { key: "mp", name: "Madhya Pradesh", abbr: "MP", storesLive: 840000 },
      { key: "cg", name: "Chhattisgarh",  abbr: "CG", storesLive: 290000 },
    ],
  },

  // ── Western States ──────────────────────────────────────────
  {
    key:   "west",
    title: "Western States",
    states: [
      { key: "rajasthan",   name: "Rajasthan",   abbr: "RJ", storesLive: 670000 },
      { key: "gujarat",     name: "Gujarat",      abbr: "GJ", storesLive: 920000 },
      { key: "maharashtra", name: "Maharashtra",  abbr: "MH", storesLive: 1450000 },
      { key: "goa",         name: "Goa",          abbr: "GA", storesLive: 45000 },
    ],
  },

  // ── Eastern States ──────────────────────────────────────────
  {
    key:   "east",
    title: "Eastern States",
    states: [
      { key: "bihar",      name: "Bihar",       abbr: "BR", storesLive: 980000 },
      { key: "jharkhand",  name: "Jharkhand",   abbr: "JH", storesLive: 340000 },
      { key: "odisha",     name: "Odisha",      abbr: "OD", storesLive: 410000 },
      { key: "westbengal", name: "West Bengal", abbr: "WB", storesLive: 1120000 },
    ],
  },

  // ── North-Eastern States ─────────────────────────────────────
  {
    key:   "northeast",
    title: "North-Eastern States",
    states: [
      { key: "sikkim",    name: "Sikkim",             abbr: "SK", storesLive: 12000 },
      { key: "arunachal", name: "Arunachal Pradesh",  abbr: "AR", storesLive: 18000 },
      { key: "assam",     name: "Assam",              abbr: "AS", storesLive: 280000 },
      { key: "nagaland",  name: "Nagaland",           abbr: "NL", storesLive: 22000 },
      { key: "meghalaya", name: "Meghalaya",          abbr: "ML", storesLive: 28000 },
      { key: "manipur",   name: "Manipur",            abbr: "MN", storesLive: 25000 },
      { key: "mizoram",   name: "Mizoram",            abbr: "MZ", storesLive: 15000 },
      { key: "tripura",   name: "Tripura",            abbr: "TR", storesLive: 32000 },
    ],
  },

  // ── Southern States ──────────────────────────────────────────
  {
    key:   "south",
    title: "Southern States",
    states: [
      { key: "ap",         name: "Andhra Pradesh", abbr: "AP", storesLive: 890000 },
      { key: "telangana",  name: "Telangana",      abbr: "TS", storesLive: 1040000 },
      { key: "karnataka",  name: "Karnataka",      abbr: "KA", storesLive: 1320000 },
      { key: "kerala",     name: "Kerala",         abbr: "KL", storesLive: 760000 },
      { key: "tamilnadu",  name: "Tamil Nadu",     abbr: "TN", storesLive: 1480000 },
      { key: "puducherry", name: "Puducherry",     abbr: "PY", storesLive: 42000 },
    ],
  },

  // ── Union Territories ─────────────────────────────────────────
  {
    key:   "uts",
    title: "Union Territories",
    states: [
      { key: "chandigarh",  name: "Chandigarh",           abbr: "CH", storesLive: 64000 },
      { key: "dnh",         name: "Dadra & Nagar Haveli", abbr: "DN", storesLive: 15000 },
      { key: "damandiu",    name: "Daman & Diu",          abbr: "DD", storesLive: 12000 },
      { key: "lakshadweep", name: "Lakshadweep",          abbr: "LD", storesLive: 4500 },
      { key: "andaman",     name: "Andaman & Nicobar",    abbr: "AN", storesLive: 18000 },
    ],
  },
];
