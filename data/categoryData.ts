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
      { key: "veg_fruits",  label: "Vegetables & Fruits",        icon: "leaf-outline",           color: "#DCFCE7" },
      { key: "dairy",       label: "Milk & Dairy Products",      icon: "water-outline",          color: "#DBEAFE" },
      { key: "eggs_meat",   label: "Eggs & Meat",                icon: "nutrition-outline",      color: "#FEE2E2" },
      { key: "tea_coffee",  label: "Tea, Coffee & Biscuits",     icon: "cafe-outline",           color: "#FEF3C7" },
      { key: "masala",      label: "Masala & Sauces",            icon: "flame-outline",          color: "#FFEDD5" },
      { key: "dry_fruits",  label: "Dry Fruits",                 icon: "rose-outline",           color: "#FDE8D8" },
      { key: "ration",      label: "Ration & Wheat (Atta)",      icon: "bag-outline",            color: "#F3E8FF" },
      { key: "cook_oil",    label: "Cooking Oil",                icon: "beaker-outline",         color: "#ECFDF5" },
      { key: "baking",      label: "Baking & Condiments",        icon: "color-fill-outline",     color: "#FFF7ED" },
    ],
  },

  // ── Snacks & Beverages ─────────────────────────────────────
  {
    key:   "snacks",
    title: "Snacks & Beverages",
    color: "#F97316",
    icon:  "fast-food-outline",
    subs: [
      { key: "chips",       label: "Chips & Namkeen",            icon: "fast-food-outline",      color: "#FFEDD5" },
      { key: "soft_drinks", label: "Soft Drinks",                icon: "wine-outline",           color: "#DBEAFE" },
      { key: "goti_soda",   label: "Goti Soda",                  icon: "sparkles-outline",       color: "#EDE9FE" },
      { key: "juice",       label: "Juices & Shakes",            icon: "nutrition-outline",      color: "#DCFCE7" },
      { key: "sweets",      label: "Indian Sweets",              icon: "gift-outline",           color: "#FCE7F3" },
      { key: "instant",     label: "Instant Food",               icon: "timer-outline",          color: "#FEF3C7" },
    ],
  },

  // ── Ice Cream & Frozen ─────────────────────────────────────
  {
    key:   "icecream",
    title: "Ice Cream & Frozen Desserts",
    color: "#EC4899",
    icon:  "ice-cream-outline",
    subs: [
      { key: "icecream_cups",  label: "Ice Cream Cups",          icon: "ice-cream-outline",      color: "#FCE7F3" },
      { key: "bars",           label: "Ice Cream Bars",          icon: "snow-outline",           color: "#DBEAFE" },
      { key: "frozen_dessert", label: "Frozen Desserts",         icon: "sparkles-outline",       color: "#EDE9FE" },
      { key: "yogurt",         label: "Yogurt & Shakes",         icon: "beaker-outline",         color: "#DCFCE7" },
    ],
  },

  // ── Fashion ────────────────────────────────────────────────
  {
    key:   "fashion",
    title: "Fashion",
    color: "#EC4899",
    icon:  "shirt-outline",
    subs: [
      { key: "mens",        label: "Men's Clothing",             icon: "man-outline",            color: "#DBEAFE" },
      { key: "womens",      label: "Women's Clothing",           icon: "woman-outline",          color: "#FCE7F3" },
      { key: "kids_wear",   label: "Kids' Wear",                 icon: "happy-outline",          color: "#DCFCE7" },
      { key: "footwear",    label: "Footwear",                   icon: "walk-outline",           color: "#FEF3C7" },
      { key: "ethnic",      label: "Ethnic Wear",                icon: "color-palette-outline",  color: "#F3E8FF" },
      { key: "accessories", label: "Accessories",                icon: "watch-outline",          color: "#FFEDD5" },
    ],
  },

  // ── Mobiles ────────────────────────────────────────────────
  {
    key:   "mobiles",
    title: "Mobiles & Tablets",
    color: "#3B82F6",
    icon:  "phone-portrait-outline",
    subs: [
      { key: "smartphones", label: "Smartphones",               icon: "phone-portrait-outline", color: "#DBEAFE" },
      { key: "tablets",     label: "Tablets",                   icon: "tablet-portrait-outline",color: "#EDE9FE" },
      { key: "covers",      label: "Mobile Covers",             icon: "shield-outline",         color: "#DCFCE7" },
      { key: "chargers",    label: "Chargers & Cables",         icon: "battery-charging-outline",color: "#FEF3C7" },
      { key: "earphones",   label: "Earphones",                 icon: "headset-outline",        color: "#FFEDD5" },
      { key: "screenguard", label: "Screen Guards",             icon: "layers-outline",         color: "#FCE7F3" },
    ],
  },

  // ── Electronics ────────────────────────────────────────────
  {
    key:   "electronics",
    title: "Electronics",
    color: "#2563EB",
    icon:  "headset-outline",
    subs: [
      { key: "headphones",  label: "Headphones",                icon: "headset-outline",        color: "#DBEAFE" },
      { key: "speakers",    label: "Speakers",                  icon: "volume-high-outline",    color: "#DCFCE7" },
      { key: "cameras",     label: "Cameras",                   icon: "camera-outline",         color: "#FEF3C7" },
      { key: "laptops",     label: "Laptops",                   icon: "laptop-outline",         color: "#EDE9FE" },
      { key: "smartwatch",  label: "Smart Watches",             icon: "watch-outline",          color: "#FCE7F3" },
      { key: "gaming",      label: "Gaming",                    icon: "game-controller-outline",color: "#FFEDD5" },
    ],
  },

  // ── Appliances ─────────────────────────────────────────────
  {
    key:   "appliances",
    title: "Home Appliances",
    color: "#6366F1",
    icon:  "tv-outline",
    subs: [
      { key: "tv",          label: "TV & Displays",             icon: "tv-outline",             color: "#EDE9FE" },
      { key: "washing",     label: "Washing Machine",           icon: "refresh-circle-outline", color: "#DBEAFE" },
      { key: "fridge",      label: "Refrigerator",              icon: "snow-outline",           color: "#DCFCE7" },
      { key: "ac",          label: "Air Conditioner",           icon: "thermometer-outline",    color: "#FEF3C7" },
      { key: "kitchen_app", label: "Kitchen Appliances",        icon: "restaurant-outline",     color: "#FFEDD5" },
      { key: "fans",        label: "Fans & Coolers",            icon: "sunny-outline",          color: "#FCE7F3" },
    ],
  },

  // ── Beauty ─────────────────────────────────────────────────
  {
    key:   "beauty",
    title: "Beauty & Personal Care",
    color: "#9333EA",
    icon:  "flower-outline",
    subs: [
      { key: "skincare",    label: "Skin Care",                 icon: "flower-outline",         color: "#F3E8FF" },
      { key: "haircare",    label: "Hair Care",                 icon: "color-wand-outline",     color: "#FCE7F3" },
      { key: "makeup",      label: "Makeup",                    icon: "brush-outline",          color: "#FEE2E2" },
      { key: "fragrance",   label: "Fragrances",                icon: "rose-outline",           color: "#FFEDD5" },
      { key: "mens_groom",  label: "Men's Grooming",            icon: "man-outline",            color: "#DBEAFE" },
      { key: "bodycare",    label: "Body Care",                 icon: "body-outline",           color: "#DCFCE7" },
    ],
  },

  // ── Pharmacy ───────────────────────────────────────────────
  {
    key:   "pharmacy",
    title: "Pharmacy & Health",
    color: "#EF4444",
    icon:  "medkit-outline",
    subs: [
      { key: "medicines",   label: "Medicines",                 icon: "medkit-outline",         color: "#FEE2E2" },
      { key: "vitamins",    label: "Vitamins & Nutrition",      icon: "fitness-outline",        color: "#DCFCE7" },
      { key: "first_aid",   label: "First Aid",                 icon: "bandage-outline",        color: "#FEF3C7" },
      { key: "baby_health", label: "Baby Care",                 icon: "happy-outline",          color: "#DBEAFE" },
      { key: "diabetic",    label: "Diabetic Care",             icon: "pulse-outline",          color: "#EDE9FE" },
    ],
  },

  // ── Sports ─────────────────────────────────────────────────
  {
    key:   "sports",
    title: "Sports & Fitness",
    color: "#14B8A6",
    icon:  "football-outline",
    subs: [
      { key: "fitness_eq",  label: "Fitness Equipment",         icon: "barbell-outline",        color: "#CCFBF1" },
      { key: "cricket",     label: "Cricket",                   icon: "baseball-outline",       color: "#FEF3C7" },
      { key: "football",    label: "Football",                  icon: "football-outline",       color: "#DCFCE7" },
      { key: "badminton",   label: "Badminton",                 icon: "tennisball-outline",     color: "#DBEAFE" },
      { key: "cycling",     label: "Cycling",                   icon: "bicycle-outline",        color: "#FFEDD5" },
      { key: "yoga",        label: "Yoga & Meditation",         icon: "body-outline",           color: "#EDE9FE" },
    ],
  },

  // ── Home & Furniture ───────────────────────────────────────
  {
    key:   "home_furniture",
    title: "Home & Furniture",
    color: "#F59E0B",
    icon:  "home-outline",
    subs: [
      { key: "bedding",     label: "Beds & Mattresses",         icon: "bed-outline",            color: "#FEF3C7" },
      { key: "sofa",        label: "Sofas & Seating",           icon: "home-outline",           color: "#FFEDD5" },
      { key: "kitchen_din", label: "Kitchen & Dining",          icon: "restaurant-outline",     color: "#DCFCE7" },
      { key: "bath",        label: "Bath Accessories",          icon: "water-outline",          color: "#DBEAFE" },
      { key: "decor",       label: "Home Decor",                icon: "color-palette-outline",  color: "#FCE7F3" },
      { key: "storage",     label: "Storage & Wardrobes",       icon: "archive-outline",        color: "#EDE9FE" },
    ],
  },

  // ── Miscellaneous ──────────────────────────────────────────
  {
    key:   "misc",
    title: "Miscellaneous",
    color: "#6B7280",
    icon:  "ellipsis-horizontal-circle-outline",
    subs: [
      { key: "pet_shop",    label: "Pet Shop",                  icon: "paw-outline",            color: "#FFEDD5" },
      { key: "pet_food",    label: "Pet Food",                  icon: "fish-outline",           color: "#DCFCE7" },
      { key: "toys",        label: "Toys & Games",              icon: "game-controller-outline",color: "#DBEAFE" },
      { key: "stationery",  label: "Stationery",                icon: "pencil-outline",         color: "#EDE9FE" },
      { key: "auto_parts",  label: "Auto Parts",                icon: "car-outline",            color: "#FEF3C7" },
      { key: "garden",      label: "Garden & Plants",           icon: "leaf-outline",           color: "#DCFCE7" },
      { key: "musical",     label: "Musical Instruments",       icon: "musical-notes-outline",  color: "#FCE7F3" },
      { key: "art_craft",   label: "Art & Craft",               icon: "brush-outline",          color: "#FFF7ED" },
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
  { key: "others_stall",     label: "Others — Stall",             icon: "storefront-outline",      color: "#F9FAFB", sub: "Street & Pop-up Stores"   },
];
