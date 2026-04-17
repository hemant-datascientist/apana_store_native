// ============================================================
// FAVOURITE DATA — Apana Store (Customer App)
//
// Sample data for all 4 Favourite tabs.
// Stores data lives in profileData.ts (FavouriteStore[]).
//
// Backend API contract (when ready):
//   GET  /api/customer/favourites/stores    → FavouriteStore[]
//   GET  /api/customer/favourites/riders    → FavouriteRider[]
//   GET  /api/customer/favourites/delivery  → FavouriteDelivery[]
//   GET  /api/customer/favourites/products  → FavouriteProduct[]
//   POST /api/customer/favourites/riders    { riderId }    → 201
//   POST /api/customer/favourites/delivery  { deliveryId } → 201
//   DELETE /api/customer/favourites/riders/:id    → 204
//   DELETE /api/customer/favourites/delivery/:id  → 204
// ============================================================

// ── Favourite Riders ──────────────────────────────────────────
export interface FavouriteRider {
  id:          string;
  name:        string;
  phone:       string;
  vehicle:     string;        // e.g. "Maruti Swift"
  vehicleNo:   string;        // e.g. "MH 12 AB 1234"
  rating:      number;
  totalRides:  number;
  badge:       string;        // "Top Rated" | "Trusted" | "Verified" | "Regular"
  badgeColor:  string;
  badgeBg:     string;
  avatarBg:    string;
  available:   boolean;
}

export const FAVOURITE_RIDERS: FavouriteRider[] = [
  {
    id:         "r1",
    name:       "Sunil Patil",
    phone:      "+91 93456 78901",
    vehicle:    "Maruti Swift",
    vehicleNo:  "MH 14 CD 5678",
    rating:     4.9,
    totalRides: 312,
    badge:      "Top Rated",
    badgeColor: "#15803D",
    badgeBg:    "#DCFCE7",
    avatarBg:   "#DBEAFE",
    available:  true,
  },
  {
    id:         "r2",
    name:       "Pradeep Jadhav",
    phone:      "+91 97654 32109",
    vehicle:    "Honda City",
    vehicleNo:  "MH 12 EF 9012",
    rating:     4.7,
    totalRides: 198,
    badge:      "Trusted",
    badgeColor: "#1D4ED8",
    badgeBg:    "#DBEAFE",
    avatarBg:   "#EDE9FE",
    available:  false,
  },
  {
    id:         "r3",
    name:       "Amit Sharma",
    phone:      "+91 98234 56789",
    vehicle:    "Hyundai i10",
    vehicleNo:  "MH 15 GH 3456",
    rating:     4.5,
    totalRides: 87,
    badge:      "Verified",
    badgeColor: "#92400E",
    badgeBg:    "#FEF3C7",
    avatarBg:   "#D1FAE5",
    available:  true,
  },
];

// ── Favourite Delivery Boys ───────────────────────────────────
export interface FavouriteDelivery {
  id:                string;
  name:              string;
  phone:             string;
  vehicle:           string;       // e.g. "Honda Activa"
  vehicleNo:         string;
  rating:            number;
  totalDeliveries:   number;
  avgDeliveryTime:   string;       // e.g. "18 min"
  badge:             string;
  badgeColor:        string;
  badgeBg:           string;
  avatarBg:          string;
  available:         boolean;
}

export const FAVOURITE_DELIVERIES: FavouriteDelivery[] = [
  {
    id:              "d1",
    name:            "Ravi Kumar",
    phone:           "+91 91234 56789",
    vehicle:         "Honda Activa",
    vehicleNo:       "MH 12 AB 1234",
    rating:          4.8,
    totalDeliveries: 540,
    avgDeliveryTime: "18 min",
    badge:           "Top Rated",
    badgeColor:      "#15803D",
    badgeBg:         "#DCFCE7",
    avatarBg:        "#FEE2E2",
    available:       true,
  },
  {
    id:              "d2",
    name:            "Kiran More",
    phone:           "+91 96543 21098",
    vehicle:         "TVS Jupiter",
    vehicleNo:       "MH 14 XY 7890",
    rating:          4.6,
    totalDeliveries: 278,
    avgDeliveryTime: "22 min",
    badge:           "Fast",
    badgeColor:      "#1D4ED8",
    badgeBg:         "#DBEAFE",
    avatarBg:        "#FEF3C7",
    available:       true,
  },
  {
    id:              "d3",
    name:            "Nikhil Desai",
    phone:           "+91 99876 54321",
    vehicle:         "Bajaj Pulsar",
    vehicleNo:       "MH 11 ZA 2345",
    rating:          4.4,
    totalDeliveries: 134,
    avgDeliveryTime: "25 min",
    badge:           "Regular",
    badgeColor:      "#374151",
    badgeBg:         "#F3F4F6",
    avatarBg:        "#EDE9FE",
    available:       false,
  },
];
