// ============================================================
// ADDRESS DATA — Apana Store (Customer App)
//
// Saved addresses for the customer.
// Each address maps to a city that drives city-specific data
// (e.g. getTrendingForCity in AllFeed).
//
// Backend: GET /api/customer/addresses  →  UserAddress[]
// ============================================================

export interface UserAddress {
  id:       string;
  label:    string;   // "Home" | "Work" | custom name
  icon:     string;   // Ionicons glyph
  name:     string;   // Recipient name
  line1:    string;   // House / flat / building
  line2:    string;   // Street / area
  city:     string;   // City name — used as key in getTrendingForCity
  state:    string;
  pincode:  string;
}

export const SAVED_ADDRESSES: UserAddress[] = [
  {
    id:      "addr_1",
    label:   "Home",
    icon:    "home-outline",
    name:    "Hemant Lokhande",
    line1:   "Flat 203, Sai Residency",
    line2:   "Kothrud",
    city:    "Pune",
    state:   "Maharashtra",
    pincode: "411038",
  },
  {
    id:      "addr_2",
    label:   "Work",
    icon:    "business-outline",
    name:    "Hemant Lokhande",
    line1:   "Office 4B, Tech Park",
    line2:   "Hinjewadi Phase 1",
    city:    "Pune",
    state:   "Maharashtra",
    pincode: "411057",
  },
  {
    id:      "addr_3",
    label:   "Uncle House",
    icon:    "people-outline",
    name:    "Rajesh Lokhande",
    line1:   "12, Nehru Nagar",
    line2:   "Vijay Nagar",
    city:    "Indore",
    state:   "Madhya Pradesh",
    pincode: "452001",
  },
  {
    id:      "addr_4",
    label:   "College Hostel",
    icon:    "school-outline",
    name:    "Hemant Lokhande",
    line1:   "Room 14, Boys Hostel",
    line2:   "Andheri East",
    city:    "Mumbai",
    state:   "Maharashtra",
    pincode: "400069",
  },
];
