// ============================================================
// NEARBY MAP DATA — Apana Store (Customer App)
//
// Types + mock data for the Map View store-discovery feed.
// Each StoreMapPin is a store plotted on the real Mappls map.
//
// lat / lng are real Pune coordinates used by the Mappls SDK.
// When the backend is live, these come from
//   GET /stores/nearby?lat=&lng=&radius=5km
// and StoreMapPin maps directly to a MapplsMapView marker.
//
// Backend: GET /stores/nearby?lat=&lng=&radius=5&sort=distance
// ============================================================

// ── Category filter options shown above the map ───────────────
export interface MapCategoryFilter {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph
}

export const MAP_CATEGORY_FILTERS: MapCategoryFilter[] = [
  { key: "all",         label: "All",          icon: "grid-outline"           },
  { key: "grocery",     label: "Grocery",       icon: "basket-outline"         },
  { key: "electronics", label: "Electronics",   icon: "hardware-chip-outline"  },
  { key: "pharmacy",    label: "Pharmacy",      icon: "medical-outline"        },
  { key: "fashion",     label: "Fashion",       icon: "shirt-outline"          },
  { key: "food",        label: "Food & Drink",  icon: "cafe-outline"           },
];

// ── Store pin displayed on the real Mappls map ────────────────
export interface StoreMapPin {
  id:          string;
  name:        string;
  category:    string;   // matches a MapCategoryFilter key
  rating:      number;
  isOpen:      boolean;
  isLive:      boolean;
  distanceKm:  number;
  icon:        string;   // Ionicons glyph (for info card + bottom strip)
  accentColor: string;
  iconBg:      string;
  tags:        string[];

  // Real geographic coordinates — passed to MapplsWebView markers.
  // Mock values are real Pune landmarks; backend returns actual store coords.
  lat: number;
  lng: number;
}

// ── Mock pins — Pune area coordinates ────────────────────────
// Landmarks used as approximate store positions:
//   s1 → Laxmi Road (central Pune grocery hub)
//   s2 → SP Road (electronics market, Pune)
//   s3 → FC Road (pharmacy belt)
//   s4 → MG Road (fashion district)
//   s5 → Koregaon Park (cafe/bakery zone)
export const MOCK_MAP_PINS: StoreMapPin[] = [
  {
    id:          "s1",
    name:        "Sharma General Store",
    category:    "grocery",
    rating:      4.8,
    isOpen:      true,
    isLive:      true,
    distanceKm:  0.8,
    icon:        "basket-outline",
    accentColor: "#166534",
    iconBg:      "#D1FAE5",
    tags:        ["Grocery", "Staples", "Dairy"],
    lat:         18.5167,
    lng:         73.8562,
  },
  {
    id:          "s2",
    name:        "TechZone Electronics",
    category:    "electronics",
    rating:      4.5,
    isOpen:      true,
    isLive:      false,
    distanceKm:  1.4,
    icon:        "hardware-chip-outline",
    accentColor: "#1E3A5F",
    iconBg:      "#DBEAFE",
    tags:        ["Mobiles", "Laptops", "Chargers"],
    lat:         18.5225,
    lng:         73.8478,
  },
  {
    id:          "s3",
    name:        "Gupta Medical Store",
    category:    "pharmacy",
    rating:      4.7,
    isOpen:      true,
    isLive:      true,
    distanceKm:  0.5,
    icon:        "medical-outline",
    accentColor: "#0F5132",
    iconBg:      "#DCFCE7",
    tags:        ["Medicines", "Vitamins"],
    lat:         18.5236,
    lng:         73.8478,
  },
  {
    id:          "s4",
    name:        "Style Hub Fashion",
    category:    "fashion",
    rating:      4.4,
    isOpen:      false,
    isLive:      false,
    distanceKm:  2.1,
    icon:        "shirt-outline",
    accentColor: "#6D28D9",
    iconBg:      "#EDE9FE",
    tags:        ["Men", "Women", "Footwear"],
    lat:         18.5189,
    lng:         73.8739,
  },
  {
    id:          "s5",
    name:        "Fresh Bakes",
    category:    "food",
    rating:      4.9,
    isOpen:      true,
    isLive:      true,
    distanceKm:  1.1,
    icon:        "cafe-outline",
    accentColor: "#92400E",
    iconBg:      "#FEF3C7",
    tags:        ["Bread", "Cakes", "Croissants"],
    lat:         18.5362,
    lng:         73.8940,
  },
];
