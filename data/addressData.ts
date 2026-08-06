// ============================================================
// ADDRESS DATA — Apana Store (Customer App)
//
// The UserAddress shape. Real addresses come from the server
// (services/addressService → GET /api/customer/addresses).
//
// There is deliberately NO bundled address list here any more. Four screens
// used to read one, so a brand-new install shipped with someone's flat in
// Kothrud already "saved" — and skipping the location screen confirmed it as
// the customer's real location. An order could be paid for and dispatched to
// an address nobody had ever entered (§19.8: empty is empty).
// ============================================================

export interface UserAddress {
  id:                 string;
  label:              string;    // "Home" | "Work" | "Current Location" | custom
  icon:               string;    // Ionicons glyph
  name?:              string;    // Recipient name (optional for GPS-detected)
  line1:              string;    // House / flat / building
  line2:              string;    // Street / area
  city:               string;    // City name — used as key in getTrendingForCity
  state:              string;
  pincode:            string;
  lat?:               number;    // GPS latitude  (set when location-detected)
  lng?:               number;    // GPS longitude (set when location-detected)
  isCurrentLocation?: boolean;   // true = detected via device GPS
  // The address checkout preselects. The server keeps exactly one per customer
  // and always leaves one standing, so the app never has to reconcile it.
  isDefault?:         boolean;
}

// Shown before the customer has set a location, and after they skip that
// screen. Its id is not a server row, so checkout will not accept it — which
// is the point: the app says "set your location" instead of quietly picking
// a city and ordering to it.
export const UNSET_ADDRESS: UserAddress = {
  id:      "unset",
  label:   "Set your location",
  icon:    "location-outline",
  line1:   "",
  line2:   "",
  city:    "",
  state:   "",
  pincode: "",
};
