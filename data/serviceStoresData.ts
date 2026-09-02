// ============================================================
// SERVICE STORES DATA — Apana Store (Customer App)
//
// Local service providers for the Stores → Service Based tab.
// Replace with GET /stores/service-based when backend is ready.
// ============================================================

// ── Hero Banners ───────────────────────────────────────────────

export interface ServicePromo {
  id:          string;
  headline:    string;
  subline:     string;
  tag:         string;
  bgColor:     string;
  accentColor: string;
  serviceIcons: { icon: string; label: string }[];
}

export const SERVICE_PROMOS: ServicePromo[] = [
  {
    id:          "sp1",
    headline:    "SERVICES AT YOUR DOOR",
    subline:     "Book local experts in seconds",
    tag:         "Trusted & Verified",
    bgColor:     "#0F4C81",
    accentColor: "#072a4a",
    serviceIcons: [
      { icon: "flash-outline",      label: "Electrical" },
      { icon: "cut-outline",        label: "Salon"      },
      { icon: "medkit-outline",     label: "Clinic"     },
      { icon: "fitness-outline",    label: "Gym"        },
    ],
  },
  {
    id:          "sp2",
    headline:    "HOME REPAIR & CARE",
    subline:     "Electricians, plumbers & pest control",
    tag:         "Same Day Service",
    bgColor:     "#065F46",
    accentColor: "#022c20",
    serviceIcons: [
      { icon: "construct-outline",  label: "Repair"  },
      { icon: "water-outline",      label: "Plumber" },
      { icon: "bug-outline",        label: "Pest"    },
      { icon: "home-outline",       label: "Home"    },
    ],
  },
  {
    id:          "sp3",
    headline:    "BEAUTY & WELLNESS",
    subline:     "Top salons, spas & fitness studios",
    tag:         "LIVE Near You",
    bgColor:     "#7C2D8B",
    accentColor: "#3d1145",
    serviceIcons: [
      { icon: "sparkles-outline",   label: "Beauty"   },
      { icon: "body-outline",       label: "Spa"      },
      { icon: "barbell-outline",    label: "Fitness"  },
      { icon: "color-palette-outline", label: "Parlour" },
    ],
  },
];

// ── Service Store Cards ────────────────────────────────────────

export interface ServiceStore {
  /** Shop pin from the server; absent when it never set one. */
  lat?: number;
  lng?: number;
  id:           string;
  name:         string;
  // ASC §16 service-type badge — same tag system as the map / Nearby cards
  // (data/ascBadges service tags + families). Colour stays FE presentation.
  type:         string;     // ASC SVC tag, e.g. "Salon", "Repair", "Laundry"
  typeColor:    string;
  typeBg:       string;
  rating:       number;
  reviews:      number;
  distanceKm:   number;
  website:      boolean;
  bgColor:      string;    // placeholder thumbnail bg
  icon:         string;    // Ionicons for thumbnail
  phone:        string;    // for Call Now
  ownerName:    string;
  ownerPhoto:   string;
  ownerMessage: string;
}

// 🔴 SERVICE_STORES DELETED. It held bundled shops — "SAI Electrical Repair
// Shop", rating 4.5, 989 reviews — and its only reader was the service-detail
// screen, which looked a REAL shop up by uuid against ids like "sv1" and so
// dead-ended every tap on "Service not available". The live feed and the live
// detail screen (/service-store) read the API; nothing needs a bundled copy.
//
// The TYPE below is kept: the live feed maps API rows into this shape.
