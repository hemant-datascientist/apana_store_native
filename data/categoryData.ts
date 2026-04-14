// ============================================================
// CATEGORY DATA — Apana Store (Customer App)
//
// Full category browser data for the Category screen.
// Each CategoryGroup = one collapsible section with a 3-col
// grid of subcategory tiles.
//
// Replace with GET /customer/categories when backend is ready.
// ============================================================

export interface SubCategory {
  key:   string;
  label: string;
  icon:  string;  // Ionicons glyph
  color: string;  // tile background accent color
}

export interface CategoryGroup {
  key:   string;
  title: string;
  color: string;  // section header accent
  icon:  string;  // Ionicons glyph for section header
  subs:  SubCategory[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  // ── Grocery ────────────────────────────────────────────────
  {
    key:   "grocery",
    title: "Grocery",
    color: "#16A34A",
    icon:  "basket-outline",
    subs: [
      { key: "veg_fruits",    label: "Vegetables & Fruits",      icon: "leaf-outline",            color: "#DCFCE7" },
      { key: "dairy",         label: "Milk & Dairy Products",    icon: "water-outline",           color: "#DBEAFE" },
      { key: "eggs_meat",     label: "Eggs & Meat",              icon: "nutrition-outline",       color: "#FEE2E2" },
      { key: "tea_coffee",    label: "Tea, Coffee & Biscuits",   icon: "cafe-outline",            color: "#FEF3C7" },
      { key: "masala",        label: "Masala & Sauces",          icon: "flame-outline",           color: "#FFEDD5" },
      { key: "dry_fruits",    label: "Dry Fruits & Nuts",        icon: "rose-outline",            color: "#FDE8D8" },
      { key: "ration",        label: "Ration & Wheat (Atta)",    icon: "bag-outline",             color: "#F3E8FF" },
      { key: "cook_oil",      label: "Cooking Oil & Ghee",       icon: "beaker-outline",          color: "#ECFDF5" },
      { key: "baking",        label: "Baking & Condiments",      icon: "color-fill-outline",      color: "#FFF7ED" },
      { key: "chocolates",    label: "Chocolates & Candies",     icon: "gift-outline",            color: "#FCE7F3" },
      { key: "noodles",       label: "Noodles, Pasta & Rice",    icon: "restaurant-outline",      color: "#FFEDD5" },
      { key: "honey_spreads", label: "Honey, Jams & Spreads",    icon: "color-fill-outline",      color: "#FEF3C7" },
      { key: "baby_food",     label: "Baby Food & Formula",      icon: "happy-outline",           color: "#DBEAFE" },
      { key: "frozen_veg",    label: "Frozen Vegetables",        icon: "snow-outline",            color: "#DCFCE7" },
      { key: "packaged_food", label: "Packaged & Ready-to-Eat",  icon: "bag-handle-outline",      color: "#EDE9FE" },
    ],
  },

  // ── Snacks & Beverages ─────────────────────────────────────
  {
    key:   "snacks",
    title: "Snacks & Beverages",
    color: "#F97316",
    icon:  "fast-food-outline",
    subs: [
      { key: "chips",         label: "Chips & Namkeen",          icon: "fast-food-outline",       color: "#FFEDD5" },
      { key: "dry_snacks",    label: "Dry Snacks & Makhana",     icon: "sparkles-outline",        color: "#FEF3C7" },
      { key: "soft_drinks",   label: "Soft Drinks",              icon: "wine-outline",            color: "#DBEAFE" },
      { key: "energy_drinks", label: "Energy Drinks",            icon: "flash-outline",           color: "#FEE2E2" },
      { key: "goti_soda",     label: "Goti Soda",                icon: "sparkles-outline",        color: "#EDE9FE" },
      { key: "packaged_water",label: "Packaged Water",           icon: "water-outline",           color: "#DBEAFE" },
      { key: "juice",         label: "Juices & Shakes",          icon: "nutrition-outline",       color: "#DCFCE7" },
      { key: "sweets",        label: "Indian Sweets & Mithai",   icon: "gift-outline",            color: "#FCE7F3" },
      { key: "instant",       label: "Instant Food",             icon: "timer-outline",           color: "#FEF3C7" },
      { key: "protein_bars",  label: "Protein & Health Bars",    icon: "barbell-outline",         color: "#CCFBF1" },
      { key: "popcorn",       label: "Popcorn & Corn Snacks",    icon: "fast-food-outline",       color: "#FFF7ED" },
    ],
  },

  // ── Ice Cream & Frozen ─────────────────────────────────────
  {
    key:   "icecream",
    title: "Ice Cream & Frozen Desserts",
    color: "#EC4899",
    icon:  "ice-cream-outline",
    subs: [
      { key: "icecream_cups",  label: "Ice Cream Cups",          icon: "ice-cream-outline",       color: "#FCE7F3" },
      { key: "bars",           label: "Ice Cream Bars & Cones",  icon: "snow-outline",            color: "#DBEAFE" },
      { key: "kulfi",          label: "Kulfi & Falooda",         icon: "sparkles-outline",        color: "#FEF3C7" },
      { key: "frozen_dessert", label: "Frozen Desserts",         icon: "sparkles-outline",        color: "#EDE9FE" },
      { key: "yogurt",         label: "Yogurt & Smoothies",      icon: "beaker-outline",          color: "#DCFCE7" },
      { key: "frozen_snacks",  label: "Frozen Snacks & Rolls",   icon: "fast-food-outline",       color: "#FFEDD5" },
    ],
  },

  // ── Fashion ────────────────────────────────────────────────
  {
    key:   "fashion",
    title: "Fashion",
    color: "#EC4899",
    icon:  "shirt-outline",
    subs: [
      { key: "mens",          label: "Men's Clothing",           icon: "man-outline",             color: "#DBEAFE" },
      { key: "womens",        label: "Women's Clothing",         icon: "woman-outline",           color: "#FCE7F3" },
      { key: "kids_wear",     label: "Kids' Wear",               icon: "happy-outline",           color: "#DCFCE7" },
      { key: "ethnic",        label: "Ethnic Wear",              icon: "color-palette-outline",   color: "#F3E8FF" },
      { key: "sportswear",    label: "Sportswear & Activewear",  icon: "fitness-outline",         color: "#CCFBF1" },
      { key: "winter_wear",   label: "Winter Wear",              icon: "snow-outline",            color: "#DBEAFE" },
      { key: "innerwear",     label: "Innerwear & Thermals",     icon: "body-outline",            color: "#FEF3C7" },
      { key: "footwear",      label: "Footwear",                 icon: "walk-outline",            color: "#FFEDD5" },
      { key: "bags_luggage",  label: "Bags & Luggage",           icon: "briefcase-outline",       color: "#EDE9FE" },
      { key: "fashion_jwl",   label: "Fashion Jewellery",        icon: "diamond-outline",         color: "#FCE7F3" },
      { key: "accessories",   label: "Accessories & Belts",      icon: "watch-outline",           color: "#FFF7ED" },
    ],
  },

  // ── Mobiles & Tablets ─────────────────────────────────────
  {
    key:   "mobiles",
    title: "Mobiles & Tablets",
    color: "#3B82F6",
    icon:  "phone-portrait-outline",
    subs: [
      { key: "smartphones",   label: "Smartphones",              icon: "phone-portrait-outline",  color: "#DBEAFE" },
      { key: "feature_phones",label: "Feature Phones",           icon: "call-outline",            color: "#DCFCE7" },
      { key: "tablets",       label: "Tablets",                  icon: "tablet-portrait-outline", color: "#EDE9FE" },
      { key: "covers",        label: "Mobile Covers & Cases",    icon: "shield-outline",          color: "#DCFCE7" },
      { key: "chargers",      label: "Chargers & Cables",        icon: "battery-charging-outline",color: "#FEF3C7" },
      { key: "earphones",     label: "Earphones & TWS",          icon: "headset-outline",         color: "#FFEDD5" },
      { key: "power_banks",   label: "Power Banks",              icon: "battery-full-outline",    color: "#FCE7F3" },
      { key: "memory_cards",  label: "Memory Cards & USB",       icon: "save-outline",            color: "#DBEAFE" },
      { key: "screenguard",   label: "Screen Guards",            icon: "layers-outline",          color: "#EDE9FE" },
    ],
  },

  // ── Electronics ────────────────────────────────────────────
  {
    key:   "electronics",
    title: "Electronics",
    color: "#2563EB",
    icon:  "headset-outline",
    subs: [
      { key: "headphones",    label: "Headphones & Earbuds",     icon: "headset-outline",         color: "#DBEAFE" },
      { key: "speakers",      label: "Speakers & Soundbars",     icon: "volume-high-outline",     color: "#DCFCE7" },
      { key: "cameras",       label: "Cameras & Photography",    icon: "camera-outline",          color: "#FEF3C7" },
      { key: "laptops",       label: "Laptops & PCs",            icon: "laptop-outline",          color: "#EDE9FE" },
      { key: "smartwatch",    label: "Smart Watches",            icon: "watch-outline",           color: "#FCE7F3" },
      { key: "smart_home",    label: "Smart Home Devices",       icon: "home-outline",            color: "#DCFCE7" },
      { key: "gaming",        label: "Gaming",                   icon: "game-controller-outline", color: "#FFEDD5" },
      { key: "printers",      label: "Printers & Scanners",      icon: "print-outline",           color: "#F3F4F6" },
      { key: "storage_drives",label: "Storage & Pen Drives",     icon: "save-outline",            color: "#DBEAFE" },
      { key: "projectors",    label: "Projectors & Displays",    icon: "tv-outline",              color: "#EDE9FE" },
    ],
  },

  // ── Appliances ─────────────────────────────────────────────
  {
    key:   "appliances",
    title: "Home Appliances",
    color: "#6366F1",
    icon:  "tv-outline",
    subs: [
      { key: "tv",            label: "TV & Displays",            icon: "tv-outline",              color: "#EDE9FE" },
      { key: "washing",       label: "Washing Machine",          icon: "refresh-circle-outline",  color: "#DBEAFE" },
      { key: "fridge",        label: "Refrigerator",             icon: "snow-outline",            color: "#DCFCE7" },
      { key: "ac",            label: "Air Conditioner",          icon: "thermometer-outline",     color: "#FEF3C7" },
      { key: "kitchen_app",   label: "Kitchen Appliances",       icon: "restaurant-outline",      color: "#FFEDD5" },
      { key: "water_purifier",label: "Water Purifiers & RO",     icon: "water-outline",           color: "#DBEAFE" },
      { key: "fans",          label: "Fans & Coolers",           icon: "sunny-outline",           color: "#FCE7F3" },
      { key: "geyser",        label: "Geysers & Water Heaters",  icon: "flame-outline",           color: "#FFEDD5" },
      { key: "vacuum",        label: "Vacuum & Broom Cleaners",  icon: "sparkles-outline",        color: "#F3F4F6" },
      { key: "iron",          label: "Iron & Steamers",          icon: "color-fill-outline",      color: "#FEF3C7" },
    ],
  },

  // ── Beauty & Personal Care ─────────────────────────────────
  {
    key:   "beauty",
    title: "Beauty & Personal Care",
    color: "#9333EA",
    icon:  "flower-outline",
    subs: [
      { key: "skincare",      label: "Skin Care",                icon: "flower-outline",          color: "#F3E8FF" },
      { key: "haircare",      label: "Hair Care",                icon: "color-wand-outline",      color: "#FCE7F3" },
      { key: "makeup",        label: "Makeup & Cosmetics",       icon: "brush-outline",           color: "#FEE2E2" },
      { key: "fragrance",     label: "Fragrances & Perfumes",    icon: "rose-outline",            color: "#FFEDD5" },
      { key: "mens_groom",    label: "Men's Grooming",           icon: "man-outline",             color: "#DBEAFE" },
      { key: "bodycare",      label: "Body Care & Lotion",       icon: "body-outline",            color: "#DCFCE7" },
      { key: "oral_care",     label: "Oral Care",                icon: "sparkles-outline",        color: "#EDE9FE" },
      { key: "nail_care",     label: "Nail Care",                icon: "color-palette-outline",   color: "#FCE7F3" },
      { key: "feminine",      label: "Feminine Hygiene",         icon: "woman-outline",           color: "#FEE2E2" },
      { key: "sun_care",      label: "Sun Care & After Sun",     icon: "sunny-outline",           color: "#FEF3C7" },
    ],
  },

  // ── Pharmacy & Health ─────────────────────────────────────
  {
    key:   "pharmacy",
    title: "Pharmacy & Health",
    color: "#EF4444",
    icon:  "medkit-outline",
    subs: [
      { key: "medicines",     label: "Medicines",                icon: "medkit-outline",          color: "#FEE2E2" },
      { key: "vitamins",      label: "Vitamins & Nutrition",     icon: "fitness-outline",         color: "#DCFCE7" },
      { key: "ayurvedic",     label: "Ayurvedic & Herbal",       icon: "leaf-outline",            color: "#DCFCE7" },
      { key: "homeopathy",    label: "Homeopathy",               icon: "water-outline",           color: "#DBEAFE" },
      { key: "first_aid",     label: "First Aid",                icon: "bandage-outline",         color: "#FEF3C7" },
      { key: "health_monitor",label: "Health Monitoring",        icon: "pulse-outline",           color: "#EDE9FE" },
      { key: "diabetic",      label: "Diabetic Care",            icon: "pulse-outline",           color: "#FFEDD5" },
      { key: "ortho",         label: "Orthopaedic Supports",     icon: "body-outline",            color: "#FCE7F3" },
      { key: "baby_health",   label: "Baby Care",                icon: "happy-outline",           color: "#DBEAFE" },
      { key: "eye_care",      label: "Eye Care & Contact Lens",  icon: "glasses-outline",         color: "#EDE9FE" },
    ],
  },

  // ── Sports & Fitness ──────────────────────────────────────
  {
    key:   "sports",
    title: "Sports & Fitness",
    color: "#14B8A6",
    icon:  "football-outline",
    subs: [
      { key: "fitness_eq",    label: "Fitness Equipment",        icon: "barbell-outline",         color: "#CCFBF1" },
      { key: "cricket",       label: "Cricket",                  icon: "baseball-outline",        color: "#FEF3C7" },
      { key: "football",      label: "Football",                 icon: "football-outline",        color: "#DCFCE7" },
      { key: "badminton",     label: "Badminton",                icon: "tennisball-outline",      color: "#DBEAFE" },
      { key: "cycling",       label: "Cycling",                  icon: "bicycle-outline",         color: "#FFEDD5" },
      { key: "yoga",          label: "Yoga & Meditation",        icon: "body-outline",            color: "#EDE9FE" },
      { key: "swimming",      label: "Swimming & Water Sports",  icon: "water-outline",           color: "#DBEAFE" },
      { key: "running",       label: "Running & Athletics",      icon: "walk-outline",            color: "#CCFBF1" },
      { key: "tt_carrom",     label: "Table Tennis & Carrom",    icon: "tennisball-outline",      color: "#FCE7F3" },
      { key: "sports_nutrition",label: "Sports Nutrition",       icon: "nutrition-outline",       color: "#DCFCE7" },
      { key: "outdoor",       label: "Outdoor & Adventure",      icon: "compass-outline",         color: "#FEF3C7" },
    ],
  },

  // ── Home & Furniture ──────────────────────────────────────
  {
    key:   "home_furniture",
    title: "Home & Furniture",
    color: "#F59E0B",
    icon:  "home-outline",
    subs: [
      { key: "bedding",       label: "Beds & Mattresses",        icon: "bed-outline",             color: "#FEF3C7" },
      { key: "sofa",          label: "Sofas & Seating",          icon: "home-outline",            color: "#FFEDD5" },
      { key: "kitchen_din",   label: "Kitchen & Dining",         icon: "restaurant-outline",      color: "#DCFCE7" },
      { key: "bath",          label: "Bath Accessories",         icon: "water-outline",           color: "#DBEAFE" },
      { key: "decor",         label: "Home Decor & Art",         icon: "color-palette-outline",   color: "#FCE7F3" },
      { key: "storage",       label: "Storage & Wardrobes",      icon: "archive-outline",         color: "#EDE9FE" },
      { key: "lighting",      label: "Lighting & Lamps",         icon: "bulb-outline",            color: "#FEF3C7" },
      { key: "curtains",      label: "Curtains & Blinds",        icon: "layers-outline",          color: "#F3E8FF" },
      { key: "cleaning",      label: "Cleaning Supplies",        icon: "sparkles-outline",        color: "#DCFCE7" },
      { key: "kids_furniture",label: "Kids' Furniture",          icon: "happy-outline",           color: "#DBEAFE" },
      { key: "office_furn",   label: "Office Furniture",         icon: "laptop-outline",          color: "#F3F4F6" },
      { key: "garden_outdoor",label: "Garden & Outdoor",         icon: "leaf-outline",            color: "#DCFCE7" },
    ],
  },

  // ── Books & Education ─────────────────────────────────────
  {
    key:   "books",
    title: "Books & Education",
    color: "#0EA5E9",
    icon:  "book-outline",
    subs: [
      { key: "fiction",       label: "Fiction & Literature",     icon: "book-outline",            color: "#DBEAFE" },
      { key: "non_fiction",   label: "Non-Fiction & Biographies",icon: "newspaper-outline",       color: "#EDE9FE" },
      { key: "academic",      label: "Academic & Textbooks",     icon: "school-outline",          color: "#FEF3C7" },
      { key: "competitive",   label: "Competitive Exam Books",   icon: "trophy-outline",          color: "#FFEDD5" },
      { key: "kids_books",    label: "Children's Books",         icon: "happy-outline",           color: "#DCFCE7" },
      { key: "comics",        label: "Comics & Graphic Novels",  icon: "color-palette-outline",   color: "#FCE7F3" },
      { key: "magazines",     label: "Magazines & Newspapers",   icon: "newspaper-outline",       color: "#F3F4F6" },
      { key: "stationery",    label: "Stationery & Office",      icon: "pencil-outline",          color: "#EDE9FE" },
      { key: "art_supplies",  label: "Art Supplies & Craft",     icon: "brush-outline",           color: "#FCE7F3" },
    ],
  },

  // ── Baby & Maternity ──────────────────────────────────────
  {
    key:   "baby",
    title: "Baby & Maternity",
    color: "#F472B6",
    icon:  "happy-outline",
    subs: [
      { key: "baby_food_m",   label: "Baby Food & Cereals",      icon: "nutrition-outline",       color: "#FCE7F3" },
      { key: "diapers",       label: "Diapers & Wipes",          icon: "happy-outline",           color: "#DBEAFE" },
      { key: "baby_clothing", label: "Baby Clothing & Socks",    icon: "shirt-outline",           color: "#DCFCE7" },
      { key: "baby_toys",     label: "Baby Toys & Learning",     icon: "game-controller-outline", color: "#EDE9FE" },
      { key: "baby_skin",     label: "Baby Skin & Bath",         icon: "flower-outline",          color: "#FCE7F3" },
      { key: "maternity",     label: "Maternity Wear",           icon: "woman-outline",           color: "#FEF3C7" },
      { key: "feeding",       label: "Feeding & Nursing",        icon: "water-outline",           color: "#DBEAFE" },
      { key: "strollers",     label: "Strollers & Prams",        icon: "car-outline",             color: "#FFEDD5" },
      { key: "baby_safety",   label: "Baby Safety & Monitors",   icon: "shield-outline",          color: "#DCFCE7" },
    ],
  },

  // ── Automotive ────────────────────────────────────────────
  {
    key:   "automotive",
    title: "Automotive",
    color: "#64748B",
    icon:  "car-outline",
    subs: [
      { key: "car_acc",       label: "Car Accessories",          icon: "car-outline",             color: "#F3F4F6" },
      { key: "bike_acc",      label: "Bike & Scooter Accessories",icon: "bicycle-outline",        color: "#DBEAFE" },
      { key: "car_care",      label: "Car Care & Cleaning",      icon: "sparkles-outline",        color: "#DCFCE7" },
      { key: "tyres",         label: "Tyres & Wheels",           icon: "radio-button-off-outline",color: "#F3F4F6" },
      { key: "spare_parts",   label: "Spare Parts",              icon: "construct-outline",       color: "#FFEDD5" },
      { key: "car_audio",     label: "Car Audio & Electronics",  icon: "volume-high-outline",     color: "#EDE9FE" },
      { key: "ev_charging",   label: "EV Charging Accessories",  icon: "flash-outline",           color: "#DCFCE7" },
      { key: "oils_fluids",   label: "Engine Oils & Fluids",     icon: "beaker-outline",          color: "#FEF3C7" },
    ],
  },

  // ── Pooja & Religious ─────────────────────────────────────
  {
    key:   "pooja",
    title: "Pooja & Religious",
    color: "#D97706",
    icon:  "flame-outline",
    subs: [
      { key: "agarbatti",     label: "Agarbatti & Dhoop",        icon: "flame-outline",           color: "#FEF3C7" },
      { key: "idols",         label: "Idols & Figurines",        icon: "star-outline",            color: "#FFEDD5" },
      { key: "puja_thali",    label: "Puja Thali & Items",       icon: "color-palette-outline",   color: "#FEF3C7" },
      { key: "flowers_garland",label: "Flowers & Garlands",      icon: "flower-outline",          color: "#DCFCE7" },
      { key: "diyas",         label: "Diyas & Candles",          icon: "bulb-outline",            color: "#FFEDD5" },
      { key: "sacred_books",  label: "Sacred Books & Scriptures",icon: "book-outline",            color: "#DBEAFE" },
      { key: "pooja_dress",   label: "Pooja & Festival Wear",    icon: "shirt-outline",           color: "#FCE7F3" },
    ],
  },

  // ── Miscellaneous ─────────────────────────────────────────
  {
    key:   "misc",
    title: "Miscellaneous",
    color: "#6B7280",
    icon:  "ellipsis-horizontal-circle-outline",
    subs: [
      { key: "pet_shop",      label: "Pet Shop",                 icon: "paw-outline",             color: "#FFEDD5" },
      { key: "pet_food",      label: "Pet Food & Accessories",   icon: "fish-outline",            color: "#DCFCE7" },
      { key: "toys",          label: "Toys & Games",             icon: "game-controller-outline", color: "#DBEAFE" },
      { key: "auto_parts",    label: "Auto Parts",               icon: "car-outline",             color: "#FEF3C7" },
      { key: "musical",       label: "Musical Instruments",      icon: "musical-notes-outline",   color: "#FCE7F3" },
      { key: "art_craft",     label: "Art & Craft",              icon: "brush-outline",           color: "#FFF7ED" },
      { key: "travel_acc",    label: "Travel Accessories",       icon: "airplane-outline",        color: "#DBEAFE" },
      { key: "gifting",       label: "Gifting & Greeting Cards", icon: "gift-outline",            color: "#FCE7F3" },
      { key: "office_supply", label: "Office Supplies",          icon: "briefcase-outline",       color: "#F3F4F6" },
      { key: "recycle",       label: "Recycling & Scrap",        icon: "refresh-circle-outline",  color: "#DCFCE7" },
    ],
  },
];

// ── Store Types (Stores mode) ──────────────────────────────────
// Shown as a 2-column large-card grid when discovery mode = "stores".
// Each card represents a category of physical local stores.
export interface StoreType {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph
  color: string;   // card image-area background
  sub:   string;   // short descriptor shown on card
}

export const STORE_TYPES: StoreType[] = [
  { key: "grocery_store",    label: "Grocery Store",              icon: "basket-outline",          color: "#DCFCE7", sub: "Supermarkets & Kirana"    },
  { key: "convenience",      label: "Convenience Store",          icon: "storefront-outline",      color: "#DBEAFE", sub: "General & Daily Needs"    },
  { key: "fashion_store",    label: "Fashion Store",              icon: "shirt-outline",           color: "#FCE7F3", sub: "Clothing & Apparel"       },
  { key: "jewellery",        label: "Jewellery Store",            icon: "diamond-outline",         color: "#FEF3C7", sub: "Gold, Silver & More"      },
  { key: "food_bev",         label: "Food & Beverages",           icon: "restaurant-outline",      color: "#FFEDD5", sub: "Restaurants & Cafes"      },
  { key: "icecream_store",   label: "Ice Cream Stores",           icon: "ice-cream-outline",       color: "#FCE7F3", sub: "Parlours & Dessert Shops" },
  { key: "pharmacy_store",   label: "Medical & Pharmacy",         icon: "medkit-outline",          color: "#FEE2E2", sub: "Chemists & Clinics"       },
  { key: "fitness_store",    label: "Fitness & Protein Store",    icon: "barbell-outline",         color: "#CCFBF1", sub: "Supplements & Gyms"       },
  { key: "personal_care",    label: "Personal Care",              icon: "person-outline",          color: "#EDE9FE", sub: "Salons & Spas"            },
  { key: "beauty_store",     label: "Beauty Care",                icon: "flower-outline",          color: "#FCE7F3", sub: "Cosmetics & Skin Care"    },
  { key: "mobile_store",     label: "Mobile & Accessories",       icon: "phone-portrait-outline",  color: "#DBEAFE", sub: "Phones, Cases & More"     },
  { key: "computer_store",   label: "Computer & Laptop Elec.",    icon: "laptop-outline",          color: "#EDE9FE", sub: "Laptops & Peripherals"    },
  { key: "home_elec",        label: "Home & Kitchen Elec.",       icon: "tv-outline",              color: "#FEF3C7", sub: "Appliances & Gadgets"     },
  { key: "repair_service",   label: "Repair & Installation",      icon: "construct-outline",       color: "#FFEDD5", sub: "Fix It Experts"           },
  { key: "hardware_store",   label: "Hardware & Tools",           icon: "hammer-outline",          color: "#F3F4F6", sub: "Build & DIY"              },
  { key: "furniture_store",  label: "Furniture & Furnishings",    icon: "bed-outline",             color: "#FEF3C7", sub: "Home & Office"            },
  { key: "sports_toys",      label: "Sports & Toys",              icon: "football-outline",        color: "#CCFBF1", sub: "Play & Fitness"           },
  { key: "books_store",      label: "Books & Stationery",         icon: "book-outline",            color: "#DBEAFE", sub: "Read & Write"             },
  { key: "eyewear",          label: "Eye Wear & Sunglasses",      icon: "glasses-outline",         color: "#EDE9FE", sub: "Specs & Shades"           },
  { key: "watches",          label: "Watches",                    icon: "watch-outline",           color: "#FEF3C7", sub: "Luxury & Casual"          },
  { key: "vehicle",          label: "Vehicle Showrooms",          icon: "car-outline",             color: "#F3F4F6", sub: "Cars, Bikes & EVs"        },
  { key: "bakery_sweets",    label: "Bakery & Sweet Shop",        icon: "cafe-outline",            color: "#FEF3C7", sub: "Mithai, Cakes & Breads"   },
  { key: "dairy_booth",      label: "Dairy & Milk Booth",         icon: "water-outline",           color: "#DBEAFE", sub: "Milk, Curd & Paneer"      },
  { key: "flower_shop",      label: "Flower Shop & Nursery",      icon: "flower-outline",          color: "#DCFCE7", sub: "Flowers, Garlands & Plants"},
  { key: "tailoring",        label: "Tailoring & Stitching",      icon: "cut-outline",             color: "#FCE7F3", sub: "Custom Clothes & Alteration"},
  { key: "laundry",          label: "Laundry & Dry Cleaning",     icon: "shirt-outline",           color: "#DBEAFE", sub: "Clothes Cleaning & Pressing"},
  { key: "home_decor",       label: "Home Decor & Interior",      icon: "color-palette-outline",   color: "#FEF3C7", sub: "Decor, Curtains & Art"    },
  { key: "baby_kids",        label: "Baby & Kids Store",          icon: "happy-outline",           color: "#FCE7F3", sub: "Baby Products & Toys"     },
  { key: "organic_food",     label: "Organic & Health Food",      icon: "leaf-outline",            color: "#DCFCE7", sub: "Natural & Organic Products"},
  { key: "paan_shop",        label: "Paan & Tobacco Shop",        icon: "storefront-outline",      color: "#CCFBF1", sub: "Paan, Cigarettes & More"  },
  { key: "footwear_store",   label: "Footwear & Shoe Store",      icon: "walk-outline",            color: "#FFEDD5", sub: "Shoes, Sandals & Boots"   },
  { key: "gift_shop",        label: "Gift & Novelty Shop",        icon: "gift-outline",            color: "#EDE9FE", sub: "Gifts, Cards & Souvenirs" },
  { key: "pooja_items",      label: "Pooja & Religious Items",    icon: "flame-outline",           color: "#FEF3C7", sub: "Agarbatti, Idols & More"  },
  { key: "diagnostic_lab",   label: "Diagnostic Lab & Pathology", icon: "pulse-outline",           color: "#FEE2E2", sub: "Blood Tests & Health Checks"},
  { key: "printing_xerox",   label: "Printing & Xerox",           icon: "print-outline",           color: "#F3F4F6", sub: "Copies, Prints & Binding"  },
  { key: "travel_agency",    label: "Travel Agency",              icon: "airplane-outline",        color: "#DBEAFE", sub: "Tickets, Hotels & Tours"  },
  { key: "catering",         label: "Catering Services",          icon: "restaurant-outline",      color: "#FFEDD5", sub: "Events & Bulk Food Orders" },
  { key: "music_store",      label: "Music & Instruments",        icon: "musical-notes-outline",   color: "#EDE9FE", sub: "Instruments & Accessories" },
  { key: "liquor_store",     label: "Liquor & Wine Shop",         icon: "wine-outline",            color: "#FEE2E2", sub: "Beer, Wine & Spirits"     },
  { key: "electrical_store", label: "Electrical & Wiring",        icon: "flash-outline",           color: "#FEF3C7", sub: "Switches, Wires & Fittings"},
  { key: "paint_store",      label: "Paint & Wall Decor",         icon: "brush-outline",           color: "#FCE7F3", sub: "Paints, Primers & More"   },
  { key: "agri_store",       label: "Agriculture & Seeds",        icon: "leaf-outline",            color: "#DCFCE7", sub: "Seeds, Fertilizers & Tools"},
  { key: "photography",      label: "Photography Studio",         icon: "camera-outline",          color: "#F3F4F6", sub: "Photos, Editing & Prints"  },
  { key: "others_stall",     label: "Others — Stall",             icon: "storefront-outline",      color: "#F9FAFB", sub: "Street & Pop-up Stores"   },
];
