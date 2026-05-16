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
  id:           string;
  name:         string;
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

export const SERVICE_STORES: ServiceStore[] = [
  {
    id:         "sv1",
    name:       "SAI Electrical Repair Shop",
    rating:     4.5,
    reviews:    989,
    distanceKm: 0.1,
    website:    true,
    bgColor:    "#FEF3C7",
    icon:       "flash-outline",
    phone:      "+91 98765 43210",
    ownerName:  "Sai Kumar",
    ownerPhoto: "https://randomuser.me/api/portraits/men/1.jpg",
    ownerMessage: "Professional electrical services for your home and office. Available 24/7 for emergencies.",
  },
  {
    id:         "sv2",
    name:       "Dyjo Hair Salon – Women",
    rating:     3.9,
    reviews:    650,
    distanceKm: 0.5,
    website:    true,
    bgColor:    "#FCE7F3",
    icon:       "cut-outline",
    phone:      "+91 98765 43211",
    ownerName:  "Deepa Jogi",
    ownerPhoto: "https://randomuser.me/api/portraits/women/2.jpg",
    ownerMessage: "Expert styling and beauty treatments tailored for you. Step out with confidence!",
  },
  {
    id:         "sv3",
    name:       "Wrinsely Laundry Room",
    rating:     4.8,
    reviews:    477,
    distanceKm: 1.1,
    website:    true,
    bgColor:    "#DBEAFE",
    icon:       "water-outline",
    phone:      "+91 98765 43212",
    ownerName:  "Sameer Shah",
    ownerPhoto: "https://randomuser.me/api/portraits/men/3.jpg",
    ownerMessage: "Premium laundry and dry cleaning services. We care for your clothes as much as you do.",
  },
  {
    id:         "sv4",
    name:       "Cheap & Best Salon – Men",
    rating:     4.6,
    reviews:    789,
    distanceKm: 1.5,
    website:    true,
    bgColor:    "#E0F2FE",
    icon:       "man-outline",
    phone:      "+91 98765 43213",
    ownerName:  "Anil Kapoor",
    ownerPhoto: "https://randomuser.me/api/portraits/men/4.jpg",
    ownerMessage: "Grooming redefined. Best styles at the most affordable prices in the city.",
  },
  {
    id:         "sv5",
    name:       "Laundry King",
    rating:     4.4,
    reviews:    327,
    distanceKm: 2.1,
    website:    true,
    bgColor:    "#FEF3C7",
    icon:       "shirt-outline",
    phone:      "+91 98765 43214",
    ownerName:  "Karan Singh",
    ownerPhoto: "https://randomuser.me/api/portraits/men/5.jpg",
    ownerMessage: "Express laundry service with home delivery. Quality you can trust.",
  },
  {
    id:         "sv6",
    name:       "Dr Sravanthi Poly Clinic",
    rating:     4.3,
    reviews:    107,
    distanceKm: 2.5,
    website:    true,
    bgColor:    "#FEE2E2",
    icon:       "medkit-outline",
    phone:      "+91 98765 43215",
    ownerName:  "Dr. Sravanthi",
    ownerPhoto: "https://randomuser.me/api/portraits/women/6.jpg",
    ownerMessage: "Comprehensive healthcare for your family. Expert doctors and compassionate care.",
  },
  {
    id:         "sv7",
    name:       "Pearl Makeup Parlour – Women",
    rating:     4.1,
    reviews:    697,
    distanceKm: 2.7,
    website:    true,
    bgColor:    "#FCE7F3",
    icon:       "sparkles-outline",
    phone:      "+91 98765 43216",
    ownerName:  "Priya Mehra",
    ownerPhoto: "https://randomuser.me/api/portraits/women/7.jpg",
    ownerMessage: "Transforming beauty with a touch of elegance. Specializing in bridal and party makeup.",
  },
  {
    id:         "sv8",
    name:       "AF – Anytime Fitness Gym",
    rating:     4.2,
    reviews:    287,
    distanceKm: 2.8,
    website:    true,
    bgColor:    "#DCFCE7",
    icon:       "barbell-outline",
    phone:      "+91 98765 43217",
    ownerName:  "Rahul Varma",
    ownerPhoto: "https://randomuser.me/api/portraits/men/8.jpg",
    ownerMessage: "Your journey to fitness starts here. State-of-the-art equipment and personal training.",
  },
  {
    id:         "sv9",
    name:       "BUG OFF Pest Control",
    rating:     4.9,
    reviews:    452,
    distanceKm: 2.9,
    website:    true,
    bgColor:    "#ECFDF5",
    icon:       "bug-outline",
    phone:      "+91 98765 43218",
    ownerName:  "Suresh G.",
    ownerPhoto: "https://randomuser.me/api/portraits/men/9.jpg",
    ownerMessage: "Eco-friendly pest control solutions. Keep your home safe and pest-free.",
  },
];
