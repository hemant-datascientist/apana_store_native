// ============================================================
// CATEGORY DATA — Apana Store (Customer App)
//
// Full category browser data for the Category screen.
// Each CategoryGroup = one collapsible section with a 3-col
// grid of subcategory tiles.
//
// Replace with GET /customer/categories when backend is ready.
// ============================================================

const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const getAssetUrl = (path: string) => `http://${TOWER_IP}:8000/assets/images/apana_store/${path}`;

export interface SubCategory {
  key: string;
  label: string;
  icon: string;    // Ionicons glyph (fallback/skeleton)
  color: string;    // tile background accent color
  imageUrl?: any;      // Bundled asset or remote URL
}

export interface CategoryGroup {
  key: string;
  title: string;
  color: string;  // section header accent
  icon: string;  // Ionicons glyph for section header
  subs: SubCategory[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  // ── Grocery ────────────────────────────────────────────────
  {
    key: "grocery",
    title: "Grocery",
    color: "#16A34A",
    icon: "basket-outline",
    subs: [
      { key: "veg_fruits", label: "Vegetables & Fruits", icon: "leaf-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/veg_fruits.png") },
      { key: "dairy", label: "Milk & Dairy Products", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/dairy.png") },
      { key: "eggs_meat", label: "Eggs & Meat", icon: "nutrition-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/eggs_meat.png") },
      { key: "tea_coffee", label: "Tea, Coffee & Biscuits", icon: "cafe-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/tea_coffee.png") },
      { key: "masala", label: "Masala & Sauces", icon: "flame-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/masala.png") },
      { key: "dry_fruits", label: "Dry Fruits & Nuts", icon: "rose-outline", color: "#FDE8D8", imageUrl: require("../assets/images/category/products/dry_fruits.png") },
      { key: "ration", label: "Ration & Wheat (Atta)", icon: "bag-outline", color: "#F3E8FF", imageUrl: require("../assets/images/category/products/ration.png") },
      { key: "cook_oil", label: "Cooking Oil & Ghee", icon: "beaker-outline", color: "#ECFDF5", imageUrl: require("../assets/images/category/products/cook_oil.png") },
      { key: "baking", label: "Baking & Condiments", icon: "color-fill-outline", color: "#FFF7ED", imageUrl: require("../assets/images/category/products/baking.png") },
      { key: "chocolates", label: "Chocolates & Candies", icon: "gift-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/chocolates.png") },
      { key: "noodles", label: "Noodles, Pasta & Rice", icon: "restaurant-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/noodles.png") },
      { key: "honey_spreads", label: "Honey, Jams & Spreads", icon: "color-fill-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/honey_spreads.png") },
      { key: "baby_food", label: "Baby Food & Formula", icon: "happy-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/baby_food.png") },
      { key: "frozen_veg", label: "Frozen Vegetables", icon: "snow-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/frozen_veg.png") },
      { key: "packaged_food", label: "Packaged & Ready-to-Eat", icon: "bag-handle-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/packaged_food.png") },
    ],
  },

  // ── Snacks & Beverages ─────────────────────────────────────
  {
    key: "snacks",
    title: "Snacks & Beverages",
    color: "#F97316",
    icon: "fast-food-outline",
    subs: [
      { key: "chips", label: "Chips & Namkeen", icon: "fast-food-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/chips.png") },
      { key: "dry_snacks", label: "Dry Snacks & Makhana", icon: "sparkles-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/dry_snacks.png") },
      { key: "soft_drinks", label: "Soft Drinks", icon: "wine-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/soft_drinks.png") },
      { key: "energy_drinks", label: "Energy Drinks", icon: "flash-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/energy_drinks.png") },
      { key: "goti_soda", label: "Goti Soda", icon: "sparkles-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/goti_soda.png") },
      { key: "packaged_water", label: "Packaged Water", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/packaged_water.png") },
      { key: "juice", label: "Juices & Shakes", icon: "nutrition-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/juice.png") },
      { key: "sweets", label: "Indian Sweets & Mithai", icon: "gift-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/sweets.png") },
      { key: "instant", label: "Instant Food", icon: "timer-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/instant.png") },
      { key: "protein_bars", label: "Protein & Health Bars", icon: "barbell-outline", color: "#CCFBF1", imageUrl: require("../assets/images/category/products/protein_bars.png") },
      { key: "popcorn", label: "Popcorn & Corn Snacks", icon: "fast-food-outline", color: "#FFF7ED", imageUrl: require("../assets/images/category/products/popcorn.png") },
    ],
  },

  // ── Ice Cream & Frozen ─────────────────────────────────────
  {
    key: "icecream",
    title: "Ice Cream & Frozen Desserts",
    color: "#EC4899",
    icon: "ice-cream-outline",
    subs: [
      { key: "icecream_cups", label: "Ice Cream Cups", icon: "ice-cream-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/icecream_cups.png") },
      { key: "bars", label: "Ice Cream Bars & Cones", icon: "snow-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/bars.png") },
      { key: "kulfi", label: "Kulfi & Falooda", icon: "sparkles-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/kulfi.png") },
      { key: "frozen_dessert", label: "Frozen Desserts", icon: "sparkles-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/frozen_dessert.png") },
      { key: "yogurt", label: "Yogurt & Smoothies", icon: "beaker-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/yogurt.png") },
      { key: "frozen_snacks", label: "Frozen Snacks & Rolls", icon: "fast-food-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/frozen_snacks.png") },
    ],
  },

  // ── Fashion ────────────────────────────────────────────────
  {
    key: "fashion",
    title: "Fashion",
    color: "#EC4899",
    icon: "shirt-outline",
    subs: [
      { key: "mens", label: "Men's Clothing", icon: "man-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/mens.png") },
      { key: "womens", label: "Women's Clothing", icon: "woman-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/fashion.png") },
      { key: "kids_wear", label: "Kids' Wear", icon: "happy-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/kids_wear.png") },
      { key: "ethnic", label: "Ethnic Wear", icon: "color-palette-outline", color: "#F3E8FF", imageUrl: require("../assets/images/category/products/ethnic.png") },
      { key: "sportswear", label: "Sportswear & Activewear", icon: "fitness-outline", color: "#CCFBF1", imageUrl: require("../assets/images/category/products/sportswear.png") },
      { key: "winter_wear", label: "Winter Wear", icon: "snow-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/winter_wear.png") },
      { key: "innerwear", label: "Innerwear & Thermals", icon: "body-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/innerwear.png") },
      { key: "footwear", label: "Footwear", icon: "walk-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/footwear.png") },
      { key: "bags_luggage", label: "Bags & Luggage", icon: "briefcase-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/bags_luggage.png") },
      { key: "fashion_jwl", label: "Fashion Jewellery", icon: "diamond-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/fashion_jwl.png") },
      { key: "accessories", label: "Accessories & Belts", icon: "watch-outline", color: "#FFF7ED", imageUrl: require("../assets/images/category/products/accessories.png") },
    ],
  },

  // ── Mobiles & Tablets ─────────────────────────────────────
  {
    key: "mobiles",
    title: "Mobiles & Tablets",
    color: "#3B82F6",
    icon: "phone-portrait-outline",
    subs: [
      { key: "smartphones", label: "Smartphones", icon: "phone-portrait-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/smartphones.png") },
      { key: "feature_phones", label: "Feature Phones", icon: "call-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/feature_phones.png") },
      { key: "tablets", label: "Tablets", icon: "tablet-portrait-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/tablets.png") },
      { key: "covers", label: "Mobile Covers & Cases", icon: "shield-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/covers.png") },
      { key: "chargers", label: "Chargers & Cables", icon: "battery-charging-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/chargers.png") },
      { key: "earphones", label: "Earphones & TWS", icon: "headset-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/earphones.png") },
      { key: "power_banks", label: "Power Banks", icon: "battery-full-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/power_banks.png") },
      { key: "memory_cards", label: "Memory Cards & USB", icon: "save-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/memory_cards.png") },
      { key: "screenguard", label: "Screen Guards", icon: "layers-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/screenguard.png") },
    ],
  },

  // ── Electronics ────────────────────────────────────────────
  {
    key: "electronics",
    title: "Electronics",
    color: "#2563EB",
    icon: "headset-outline",
    subs: [
      { key: "headphones", label: "Headphones & Earbuds", icon: "headset-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/headphones.png") },
      { key: "speakers", label: "Speakers & Soundbars", icon: "volume-high-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/speakers.png") },
      { key: "cameras", label: "Cameras & Photography", icon: "camera-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/cameras.png") },
      { key: "laptops", label: "Laptops & PCs", icon: "laptop-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/laptops.png") },
      { key: "smartwatch", label: "Smart Watches", icon: "watch-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/smartwatch.png") },
      { key: "smart_home", label: "Smart Home Devices", icon: "home-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/smart_home.png") },
      { key: "gaming", label: "Gaming", icon: "game-controller-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/gaming.png") },
      { key: "printers", label: "Printers & Scanners", icon: "print-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/printers.png") },
      { key: "storage_drives", label: "Storage & Pen Drives", icon: "save-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/storage_drives.png") },
      { key: "projectors", label: "Projectors & Displays", icon: "tv-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/projectors.png") },
    ],
  },

  // ── Appliances ─────────────────────────────────────────────
  {
    key: "appliances",
    title: "Home Appliances",
    color: "#6366F1",
    icon: "tv-outline",
    subs: [
      { key: "tv", label: "TV & Displays", icon: "tv-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/tv.png") },
      { key: "washing", label: "Washing Machine", icon: "refresh-circle-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/washing.png") },
      { key: "fridge", label: "Refrigerator", icon: "snow-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/fridge.png") },
      { key: "ac", label: "Air Conditioner", icon: "thermometer-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/ac.png") },
      { key: "kitchen_app", label: "Kitchen Appliances", icon: "restaurant-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/kitchen_app.png") },
      { key: "water_purifier", label: "Water Purifiers & RO", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/water_purifier.png") },
      { key: "fans", label: "Fans & Coolers", icon: "sunny-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/fans.png") },
      { key: "geyser", label: "Geysers & Water Heaters", icon: "flame-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/geyser.png") },
      { key: "vacuum", label: "Vacuum & Broom Cleaners", icon: "sparkles-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/vacuum.png") },
      { key: "iron", label: "Iron & Steamers", icon: "color-fill-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/iron.png") },
    ],
  },

  // ── Beauty & Personal Care ─────────────────────────────────
  {
    key: "beauty",
    title: "Beauty & Personal Care",
    color: "#9333EA",
    icon: "flower-outline",
    subs: [
      { key: "skincare", label: "Skin Care", icon: "flower-outline", color: "#F3E8FF", imageUrl: require("../assets/images/category/products/skincare.png") },
      { key: "haircare", label: "Hair Care", icon: "color-wand-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/haircare.png") },
      { key: "makeup", label: "Makeup & Cosmetics", icon: "brush-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/makeup.png") },
      { key: "fragrance", label: "Fragrances & Perfumes", icon: "rose-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/fragrance.png") },
      { key: "mens_groom", label: "Men's Grooming", icon: "man-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/mens_groom.png") },
      { key: "bodycare", label: "Body Care & Lotion", icon: "body-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/bodycare.png") },
      { key: "oral_care", label: "Oral Care", icon: "sparkles-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/oral_care.png") },
      { key: "nail_care", label: "Nail Care", icon: "color-palette-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/nail_care.png") },
      { key: "feminine", label: "Feminine Hygiene", icon: "woman-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/feminine.png") },
      { key: "sun_care", label: "Sun Care & After Sun", icon: "sunny-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/sun_care.png") },
    ],
  },

  // ── Pharmacy & Health ─────────────────────────────────────
  {
    key: "pharmacy",
    title: "Pharmacy & Health",
    color: "#EF4444",
    icon: "medkit-outline",
    subs: [
      { key: "medicines", label: "Medicines", icon: "medkit-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/medicines.png") },
      { key: "vitamins", label: "Vitamins & Nutrition", icon: "fitness-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/vitamins.png") },
      { key: "ayurvedic", label: "Ayurvedic & Herbal", icon: "leaf-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/ayurvedic.png") },
      { key: "homeopathy", label: "Homeopathy", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/homeopathy.png") },
      { key: "first_aid", label: "First Aid", icon: "bandage-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/first_aid.png") },
      { key: "health_monitor", label: "Health Monitoring", icon: "pulse-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/health_monitor.png") },
      { key: "diabetic", label: "Diabetic Care", icon: "pulse-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/diabetic.png") },
      { key: "ortho", label: "Orthopaedic Supports", icon: "body-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/ortho.png") },
      { key: "baby_health", label: "Baby Care", icon: "happy-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/baby_health.png") },
      { key: "eye_care", label: "Eye Care & Contact Lens", icon: "glasses-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/eye_care.png") },
    ],
  },

  // ── Sports & Fitness ──────────────────────────────────────
  {
    key: "sports",
    title: "Sports & Fitness",
    color: "#14B8A6",
    icon: "football-outline",
    subs: [
      { key: "fitness_eq", label: "Fitness Equipment", icon: "barbell-outline", color: "#CCFBF1", imageUrl: require("../assets/images/category/products/fitness_eq.png") },
      { key: "cricket", label: "Cricket", icon: "baseball-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/cricket.png") },
      { key: "football", label: "Football", icon: "football-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/football.png") },
      { key: "badminton", label: "Badminton", icon: "tennisball-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/badminton.png") },
      { key: "cycling", label: "Cycling", icon: "bicycle-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/cycling.png") },
      { key: "yoga", label: "Yoga & Meditation", icon: "body-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/yoga.png") },
      { key: "swimming", label: "Swimming & Water Sports", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/swimming.png") },
      { key: "running", label: "Running & Athletics", icon: "walk-outline", color: "#CCFBF1", imageUrl: require("../assets/images/category/products/running.png") },
      { key: "tt_carrom", label: "Table Tennis & Carrom", icon: "tennisball-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/tt_carrom.png") },
      { key: "sports_nutrition", label: "Sports Nutrition", icon: "nutrition-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/sports_nutrition.png") },
      { key: "outdoor", label: "Outdoor & Adventure", icon: "compass-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/outdoor.png") },
    ],
  },

  // ── Home & Furniture ──────────────────────────────────────
  {
    key: "home_furniture",
    title: "Home & Furniture",
    color: "#F59E0B",
    icon: "home-outline",
    subs: [
      { key: "bedding", label: "Beds & Mattresses", icon: "bed-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/bedding.png") },
      { key: "sofa", label: "Sofas & Seating", icon: "home-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/sofa.png") },
      { key: "kitchen_din", label: "Kitchen & Dining", icon: "restaurant-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/kitchen_din.png") },
      { key: "bath", label: "Bath Accessories", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/bath.png") },
      { key: "decor", label: "Home Decor & Art", icon: "color-palette-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/decor.png") },
      { key: "storage", label: "Storage & Wardrobes", icon: "archive-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/storage.png") },
      { key: "lighting", label: "Lighting & Lamps", icon: "bulb-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/lighting.png") },
      { key: "curtains", label: "Curtains & Blinds", icon: "layers-outline", color: "#F3E8FF", imageUrl: require("../assets/images/category/products/curtains.png") },
      { key: "cleaning", label: "Cleaning Supplies", icon: "sparkles-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/cleaning.png") },
      { key: "kids_furniture", label: "Kids' Furniture", icon: "happy-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/kids_furniture.png") },
      { key: "office_furn", label: "Office Furniture", icon: "laptop-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/office_furn.png") },
      { key: "garden_outdoor", label: "Garden & Outdoor", icon: "leaf-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/garden_outdoor.png") },
    ],
  },

  // ── Books & Education ─────────────────────────────────────
  {
    key: "books",
    title: "Books & Education",
    color: "#0EA5E9",
    icon: "book-outline",
    subs: [
      { key: "fiction", label: "Fiction & Literature", icon: "book-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/fiction.png") },
      { key: "non_fiction", label: "Non-Fiction & Biographies", icon: "newspaper-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/non_fiction.png") },
      { key: "academic", label: "Academic & Textbooks", icon: "school-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/academic.png") },
      { key: "competitive", label: "Competitive Exam Books", icon: "trophy-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/competitive.png") },
      { key: "kids_books", label: "Children's Books", icon: "happy-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/kids_books.png") },
      { key: "comics", label: "Comics & Graphic Novels", icon: "color-palette-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/comics.png") },
      { key: "magazines", label: "Magazines & Newspapers", icon: "newspaper-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/magazines.png") },
      { key: "stationery", label: "Stationery & Office", icon: "pencil-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/stationery.png") },
      { key: "art_supplies", label: "Art Supplies & Craft", icon: "brush-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/art_supplies.png") },
    ],
  },

  // ── Baby & Maternity ──────────────────────────────────────
  {
    key: "baby",
    title: "Baby & Maternity",
    color: "#F472B6",
    icon: "happy-outline",
    subs: [
      { key: "baby_food_m", label: "Baby Food & Cereals", icon: "nutrition-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/baby_food_m.png") },
      { key: "diapers", label: "Diapers & Wipes", icon: "happy-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/diapers.png") },
      { key: "baby_clothing", label: "Baby Clothing & Socks", icon: "shirt-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/baby_clothing.png") },
      { key: "baby_toys", label: "Baby Toys & Learning", icon: "game-controller-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/baby_toys.png") },
      { key: "baby_skin", label: "Baby Skin & Bath", icon: "flower-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/baby_skin.png") },
      { key: "maternity", label: "Maternity Wear", icon: "woman-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/maternity.png") },
      { key: "feeding", label: "Feeding & Nursing", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/feeding.png") },
      { key: "strollers", label: "Strollers & Prams", icon: "car-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/strollers.png") },
      { key: "baby_safety", label: "Baby Safety & Monitors", icon: "shield-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/baby_safety.png") },
    ],
  },

  // ── Automotive ────────────────────────────────────────────
  {
    key: "automotive",
    title: "Automotive",
    color: "#64748B",
    icon: "car-outline",
    subs: [
      { key: "car_acc", label: "Car Accessories", icon: "car-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/car_acc.png") },
      { key: "bike_acc", label: "Bike & Scooter Accessories", icon: "bicycle-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/bike_acc.png") },
      { key: "car_care", label: "Car Care & Cleaning", icon: "sparkles-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/car_care.png") },
      { key: "tyres", label: "Tyres & Wheels", icon: "radio-button-off-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/tyres.png") },
      { key: "spare_parts", label: "Spare Parts", icon: "construct-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/spare_parts.png") },
      { key: "car_audio", label: "Car Audio & Electronics", icon: "volume-high-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/car_audio.png") },
      { key: "ev_charging", label: "EV Charging Accessories", icon: "flash-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/ev_charging.png") },
      { key: "oils_fluids", label: "Engine Oils & Fluids", icon: "beaker-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/oils_fluids.png") },
    ],
  },

  // ── Pooja & Religious ─────────────────────────────────────
  {
    key: "pooja",
    title: "Pooja & Religious",
    color: "#D97706",
    icon: "flame-outline",
    subs: [
      { key: "agarbatti", label: "Agarbatti & Dhoop", icon: "flame-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/agarbatti.png") },
      { key: "idols", label: "Idols & Figurines", icon: "star-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/idols.png") },
      { key: "puja_thali", label: "Puja Thali & Items", icon: "color-palette-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/puja_thali.png") },
      { key: "flowers_garland", label: "Flowers & Garlands", icon: "flower-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/flowers_garland.png") },
      { key: "diyas", label: "Diyas & Candles", icon: "bulb-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/diyas.png") },
      { key: "sacred_books", label: "Sacred Books & Scriptures", icon: "book-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/sacred_books.png") },
      { key: "pooja_dress", label: "Pooja & Festival Wear", icon: "shirt-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/pooja_dress.png") },
    ],
  },

  // ── Jewellery & Precious ──────────────────────────────────
  // §29 gap-fill: promoted out of Miscellaneous so fine jewellery has a real
  // discovery home (was only "Fashion Jewellery" sub). Icon-only until BE/assets.
  {
    key: "jewellery",
    title: "Jewellery & Precious",
    color: "#CA8A04",
    icon: "diamond-outline",
    subs: [
      { key: "gold", label: "Gold Jewellery", icon: "ribbon-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/gold.png") },
      { key: "silver", label: "Silver Jewellery", icon: "sparkles-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/silver.png") },
      { key: "diamond", label: "Diamond", icon: "diamond-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/diamond.png") },
      { key: "gemstone", label: "Gemstone & Stones", icon: "diamond-outline", color: "#F3E8FF", imageUrl: require("../assets/images/category/products/gemstone.png") },
      { key: "bridal", label: "Bridal & Wedding", icon: "heart-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/bridal.png") },
      { key: "imitation", label: "Imitation Jewellery", icon: "pricetag-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/imitation.png") },
      { key: "coins_bullion", label: "Coins & Bullion", icon: "cash-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/coins_bullion.png") },
      { key: "jwl_repair", label: "Jewellery Repair", icon: "construct-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/jwl_repair.png") },
    ],
  },

  // ── Eyewear ───────────────────────────────────────────────
  {
    key: "eyewear",
    title: "Eyewear",
    color: "#0EA5E9",
    icon: "glasses-outline",
    subs: [
      { key: "eyeglasses", label: "Eyeglasses (Rx)", icon: "glasses-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/eyeglasses.png") },
      { key: "sunglasses", label: "Sunglasses", icon: "sunny-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/sunglasses.png") },
      { key: "contacts", label: "Contact Lenses", icon: "ellipse-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/contacts.png") },
      { key: "reading", label: "Reading Glasses", icon: "book-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/reading.png") },
      { key: "frames", label: "Frames", icon: "glasses-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/frames_eyewear.png") },
      { key: "lens_care", label: "Lens Care", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/lens_care.png") },
      { key: "eyewear_cases", label: "Cases & Accessories", icon: "briefcase-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/eyewear_cases.png") },
    ],
  },

  // ── Watches ───────────────────────────────────────────────
  {
    key: "watches",
    title: "Watches",
    color: "#475569",
    icon: "watch-outline",
    subs: [
      { key: "mens_watch", label: "Men's Watches", icon: "man-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/mens_watch.png") },
      { key: "womens_watch", label: "Women's Watches", icon: "woman-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/womens_watch.png") },
      { key: "smartwatch", label: "Smartwatches", icon: "watch-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/smartwatch.png") },
      { key: "couple_watch", label: "Couple Watches", icon: "heart-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/couple_watch.png") },
      { key: "kids_watch", label: "Kids' Watches", icon: "happy-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/kids_watch.png") },
      { key: "luxury_watch", label: "Luxury Watches", icon: "diamond-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/luxury_watch.png") },
      { key: "watch_repair", label: "Straps & Repair", icon: "construct-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/watch_repair.png") },
    ],
  },

  // ── Pet Supplies ──────────────────────────────────────────
  {
    key: "pet",
    title: "Pet Supplies",
    color: "#D97706",
    icon: "paw-outline",
    subs: [
      { key: "dog", label: "Dog Supplies", icon: "paw-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/pet_shop.png") },
      { key: "cat", label: "Cat Supplies", icon: "paw-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/cat.png") },
      { key: "bird", label: "Bird Supplies", icon: "leaf-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/bird.png") },
      { key: "fish_aqua", label: "Fish & Aquarium", icon: "fish-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/fish_aqua.png") },
      { key: "pet_food", label: "Pet Food", icon: "nutrition-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/pet_food.png") },
      { key: "grooming", label: "Grooming", icon: "cut-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/grooming.png") },
      { key: "pet_acc", label: "Accessories", icon: "pricetag-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/pet_acc.png") },
      { key: "pet_health", label: "Pet Health", icon: "medkit-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/pet_health.png") },
    ],
  },

  // ── Hardware & Tools ──────────────────────────────────────
  {
    key: "hardware",
    title: "Hardware & Tools",
    color: "#78716C",
    icon: "hammer-outline",
    subs: [
      { key: "hand_tools", label: "Hand Tools", icon: "hammer-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/hand_tools.png") },
      { key: "power_tools", label: "Power Tools", icon: "construct-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/power_tools.png") },
      { key: "fasteners", label: "Fasteners & Screws", icon: "build-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/fasteners.png") },
      { key: "plumbing", label: "Plumbing", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/plumbing.png") },
      { key: "safety_gear", label: "Safety Gear", icon: "shield-checkmark-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/safety_gear.png") },
      { key: "adhesives", label: "Adhesives & Sealants", icon: "color-fill-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/adhesives.png") },
      { key: "measuring", label: "Measuring Tools", icon: "resize-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/measuring.png") },
    ],
  },

  // ── Garden & Plants ───────────────────────────────────────
  {
    key: "garden",
    title: "Garden & Plants",
    color: "#15803D",
    icon: "leaf-outline",
    subs: [
      { key: "live_plants", label: "Live Plants", icon: "leaf-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/live_plants.png") },
      { key: "garden_seeds", label: "Seeds & Bulbs", icon: "nutrition-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/garden_seeds.png") },
      { key: "pots", label: "Pots & Planters", icon: "cube-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/pots.png") },
      { key: "soil", label: "Soil & Fertilizer", icon: "color-fill-outline", color: "#F3E8FF", imageUrl: require("../assets/images/category/products/soil.png") },
      { key: "garden_tools", label: "Garden Tools", icon: "construct-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/garden_tools.png") },
      { key: "garden_pest", label: "Pesticides", icon: "bug-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/garden_pest.png") },
    ],
  },

  // ── Musical Instruments ───────────────────────────────────
  {
    key: "music",
    title: "Musical Instruments",
    color: "#7C3AED",
    icon: "musical-notes-outline",
    subs: [
      { key: "string", label: "String", icon: "musical-note-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/musical.png") },
      { key: "percussion", label: "Percussion", icon: "musical-notes-outline", color: "#FEF3C7" },
      { key: "wind", label: "Wind", icon: "musical-note-outline", color: "#DBEAFE" },
      { key: "keyboard", label: "Keyboard & Piano", icon: "musical-notes-outline", color: "#DCFCE7" },
      { key: "traditional", label: "Traditional (Tabla / Harmonium)", icon: "musical-note-outline", color: "#FFEDD5" },
      { key: "music_acc", label: "Accessories", icon: "pricetag-outline", color: "#F3F4F6" },
    ],
  },

  // ── Paint & Finishes ──────────────────────────────────────
  {
    key: "paint",
    title: "Paint & Finishes",
    color: "#DB2777",
    icon: "color-fill-outline",
    subs: [
      { key: "wall_paint", label: "Wall Paint", icon: "color-fill-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/wall_paint.png") },
      { key: "primers", label: "Primers", icon: "color-fill-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/primers.png") },
      { key: "brushes", label: "Brushes & Rollers", icon: "brush-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/brushes.png") },
      { key: "putty", label: "Putty & Fillers", icon: "cube-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/putty.png") },
      { key: "waterproofing", label: "Waterproofing", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/waterproofing.png") },
      { key: "spray_paint", label: "Spray Paint", icon: "color-palette-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/spray_paint.png") },
    ],
  },

  // ── Electrical & Lighting ─────────────────────────────────
  {
    key: "electrical",
    title: "Electrical & Lighting",
    color: "#EAB308",
    icon: "bulb-outline",
    subs: [
      { key: "wires", label: "Wires & Cables", icon: "flash-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/wires.png") },
      { key: "switches", label: "Switches & Sockets", icon: "apps-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/switches.png") },
      { key: "bulbs", label: "Bulbs & Lighting", icon: "bulb-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/bulbs.png") },
      { key: "fans", label: "Fans", icon: "sync-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/fans_elec.png") },
      { key: "mcb", label: "MCB & Boards", icon: "grid-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/mcb.png") },
      { key: "extension", label: "Extension Boards", icon: "flash-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/extension.png") },
    ],
  },

  // ── Agriculture & Farming ─────────────────────────────────
  {
    key: "agriculture",
    title: "Agriculture & Farming",
    color: "#65A30D",
    icon: "leaf-outline",
    subs: [
      { key: "agri_seeds", label: "Seeds", icon: "nutrition-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/agri_seeds.png") },
      { key: "fertilizers", label: "Fertilizers", icon: "color-fill-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/fertilizers.png") },
      { key: "agri_pest", label: "Pesticides", icon: "bug-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/agri_pest.png") },
      { key: "farm_tools", label: "Tools & Equipment", icon: "construct-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/farm_tools.png") },
      { key: "irrigation", label: "Irrigation", icon: "water-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/irrigation.png") },
      { key: "cattle_feed", label: "Cattle Feed", icon: "nutrition-outline", color: "#F3E8FF", imageUrl: require("../assets/images/category/products/cattle_feed.png") },
    ],
  },

  // ── Paan, Tobacco & Mukhwas ───────────────────────────────
  // Tobacco-free Paan/Supari/Mukhwas always-on; Cigarettes/Hookah are
  // regulated → BE must geo + age gate before exposing (no-phantom for now).
  {
    key: "paan",
    title: "Paan, Tobacco & Mukhwas",
    color: "#059669",
    icon: "leaf-outline",
    subs: [
      { key: "paan", label: "Paan", icon: "leaf-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/paan.png") },
      { key: "supari", label: "Supari", icon: "ellipse-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/supari.png") },
      { key: "mukhwas", label: "Mukhwas", icon: "sparkles-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/mukhwas.png") },
      { key: "flavoured", label: "Flavoured (Tobacco-free)", icon: "rose-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/flavoured.png") },
      { key: "cigarettes", label: "Cigarettes", icon: "warning-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/cigarettes.png") },
      { key: "hookah", label: "Hookah", icon: "flame-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/hookah.png") },
    ],
  },

  // ── Gifts & Festive ───────────────────────────────────────
  {
    key: "gifts",
    title: "Gifts & Festive",
    color: "#E11D48",
    icon: "gift-outline",
    subs: [
      { key: "hampers", label: "Gift Hampers", icon: "gift-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/gifting.png") },
      { key: "cards", label: "Greeting Cards", icon: "card-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/cards.png") },
      { key: "decor", label: "Decor & Decoration", icon: "color-palette-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/decor_festive.png") },
      { key: "festival_kits", label: "Festival Kits", icon: "sparkles-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/festival_kits.png") },
      { key: "custom_gifts", label: "Customized Gifts", icon: "create-outline", color: "#EDE9FE", imageUrl: require("../assets/images/category/products/custom_gifts.png") },
      { key: "party", label: "Party Supplies", icon: "balloon-outline", color: "#FEE2E2", imageUrl: require("../assets/images/category/products/party.png") },
    ],
  },

  // ── Office & Stationery ───────────────────────────────────
  {
    key: "office",
    title: "Office & Stationery",
    color: "#0F766E",
    icon: "briefcase-outline",
    subs: [
      { key: "office_sup", label: "Office Supplies", icon: "briefcase-outline", color: "#F3F4F6", imageUrl: require("../assets/images/category/products/office_supply.png") },
      { key: "printers", label: "Printers & Ink", icon: "print-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/printers_office.png") },
      { key: "paper", label: "Paper & Notebooks", icon: "document-text-outline", color: "#FEF3C7", imageUrl: require("../assets/images/category/products/paper.png") },
      { key: "filing", label: "Filing & Storage", icon: "folder-outline", color: "#FFEDD5", imageUrl: require("../assets/images/category/products/filing.png") },
      { key: "art_supplies", label: "Art Supplies", icon: "brush-outline", color: "#FCE7F3", imageUrl: require("../assets/images/category/products/art_craft.png") },
    ],
  },

  // ── Miscellaneous ─────────────────────────────────────────
  // Trimmed to a genuine catch-all. Pet / Musical / Gifting / Office / Art /
  // Auto-parts (dup of Automotive) promoted to their own §29 groups above.
  {
    key: "misc",
    title: "Miscellaneous",
    color: "#6B7280",
    icon: "ellipsis-horizontal-circle-outline",
    subs: [
      { key: "toys", label: "Toys & Games", icon: "game-controller-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/toys.png") },
      { key: "travel_acc", label: "Travel Accessories", icon: "airplane-outline", color: "#DBEAFE", imageUrl: require("../assets/images/category/products/travel_acc.png") },
      { key: "recycle", label: "Recycling & Scrap", icon: "refresh-circle-outline", color: "#DCFCE7", imageUrl: require("../assets/images/category/products/recycle.png") },
    ],
  },
];

// ── Store Types (Stores mode) ──────────────────────────────────
// Shown as a 2-column large-card grid when discovery mode = "stores".
// Each card represents a category of physical local stores.
export interface StoreType {
  key: string;
  label: string;
  icon: string;     // Ionicons glyph (fallback/skeleton)
  color: string;     // card image-area background
  sub: string;     // short descriptor shown on card
  imageUrl?: any;       // Bundled asset or remote URL
}

export const STORE_TYPES: StoreType[] = [
  { key: "grocery_store", label: "Grocery Store", icon: "basket-outline", color: "#DCFCE7", sub: "Supermarkets & Kirana", imageUrl: require("../assets/images/category/stores/grocery_store.png") },
  { key: "convenience", label: "Convenience Store", icon: "storefront-outline", color: "#DBEAFE", sub: "General & Daily Needs", imageUrl: require("../assets/images/category/stores/convenience_store.png") },
  { key: "fashion_store", label: "Fashion Store", icon: "shirt-outline", color: "#FCE7F3", sub: "Clothing & Apparel", imageUrl: require("../assets/images/category/stores/fashion_store.png") },
  { key: "jewellery", label: "Jewellery Store", icon: "diamond-outline", color: "#FEF3C7", sub: "Gold, Silver & More", imageUrl: require("../assets/images/category/stores/jewellery_store.png") },
  { key: "food_bev", label: "Food & Beverages", icon: "restaurant-outline", color: "#FFEDD5", sub: "Restaurants & Cafes", imageUrl: require("../assets/images/category/stores/food_bev_store.png") },
  { key: "icecream_store", label: "Ice Cream Stores", icon: "ice-cream-outline", color: "#FCE7F3", sub: "Parlours & Dessert Shops", imageUrl: require("../assets/images/category/stores/icecream_store.png") },
  { key: "pharmacy_store", label: "Medical & Pharmacy", icon: "medkit-outline", color: "#FEE2E2", sub: "Chemists & Clinics", imageUrl: require("../assets/images/category/stores/pharmacy_store.png") },
  { key: "fitness_store", label: "Fitness & Protein Store", icon: "barbell-outline", color: "#CCFBF1", sub: "Supplements & Gyms", imageUrl: require("../assets/images/category/stores/fitness_store.png") },
  { key: "personal_care", label: "Personal Care", icon: "person-outline", color: "#EDE9FE", sub: "Salons & Spas", imageUrl: require("../assets/images/category/stores/personal_care_store.png") },
  { key: "beauty_store", label: "Beauty Care", icon: "flower-outline", color: "#FCE7F3", sub: "Cosmetics & Skin Care", imageUrl: require("../assets/images/category/stores/beauty_store.png") },
  { key: "mobile_store", label: "Mobile & Accessories", icon: "phone-portrait-outline", color: "#DBEAFE", sub: "Phones, Cases & More", imageUrl: require("../assets/images/category/stores/mobile_store.png") },
  { key: "computer_store", label: "Computer & Laptop Elec.", icon: "laptop-outline", color: "#EDE9FE", sub: "Laptops & Peripherals", imageUrl: require("../assets/images/category/stores/computer_store.png") },
  { key: "home_elec", label: "Home & Kitchen Elec.", icon: "tv-outline", color: "#FEF3C7", sub: "Appliances & Gadgets", imageUrl: require("../assets/images/category/stores/home_elec_store.png") },
  { key: "repair_service", label: "Repair & Installation", icon: "construct-outline", color: "#FFEDD5", sub: "Fix It Experts", imageUrl: require("../assets/images/category/stores/repair_service_store.png") },
  { key: "hardware_store", label: "Hardware & Tools", icon: "hammer-outline", color: "#F3F4F6", sub: "Build & DIY", imageUrl: require("../assets/images/category/stores/hardware_store.png") },
  { key: "furniture_store", label: "Furniture & Furnishings", icon: "bed-outline", color: "#FEF3C7", sub: "Home & Office", imageUrl: require("../assets/images/category/stores/furniture_store.png") },
  { key: "sports_toys", label: "Sports & Toys", icon: "football-outline", color: "#CCFBF1", sub: "Play & Fitness", imageUrl: require("../assets/images/category/stores/sports_toys.png") },
  { key: "books_store", label: "Books & Stationery", icon: "book-outline", color: "#DBEAFE", sub: "Read & Write", imageUrl: require("../assets/images/category/stores/books_store.png") },
  { key: "eyewear", label: "Eye Wear & Sunglasses", icon: "glasses-outline", color: "#EDE9FE", sub: "Specs & Shades", imageUrl: require("../assets/images/category/stores/eyewear.png") },
  { key: "watches", label: "Watches", icon: "watch-outline", color: "#FEF3C7", sub: "Luxury & Casual", imageUrl: require("../assets/images/category/stores/watches.png") },
  { key: "vehicle", label: "Vehicle Showrooms", icon: "car-outline", color: "#F3F4F6", sub: "Cars, Bikes & EVs", imageUrl: require("../assets/images/category/stores/vehicle.png") },
  { key: "bakery_sweets", label: "Bakery & Sweet Shop", icon: "cafe-outline", color: "#FEF3C7", sub: "Mithai, Cakes & Breads", imageUrl: require("../assets/images/category/stores/bakery_sweets.png") },
  { key: "dairy_booth", label: "Dairy & Milk Booth", icon: "water-outline", color: "#DBEAFE", sub: "Milk, Curd & Paneer", imageUrl: require("../assets/images/category/stores/dairy_booth.png") },
  { key: "flower_shop", label: "Flower Shop & Nursery", icon: "flower-outline", color: "#DCFCE7", sub: "Flowers, Garlands & Plants", imageUrl: require("../assets/images/category/stores/flower_shop.png") },
  { key: "tailoring", label: "Tailoring & Stitching", icon: "cut-outline", color: "#FCE7F3", sub: "Custom Clothes & Alteration", imageUrl: require("../assets/images/category/stores/tailoring.png") },
  { key: "laundry", label: "Laundry & Dry Cleaning", icon: "shirt-outline", color: "#DBEAFE", sub: "Clothes Cleaning & Pressing", imageUrl: require("../assets/images/category/stores/laundry.png") },
  { key: "home_decor", label: "Home Decor & Interior", icon: "color-palette-outline", color: "#FEF3C7", sub: "Decor, Curtains & Art", imageUrl: require("../assets/images/category/stores/home_decor.png") },
  { key: "baby_kids", label: "Baby & Kids Store", icon: "happy-outline", color: "#FCE7F3", sub: "Baby Products & Toys", imageUrl: require("../assets/images/category/stores/baby_kids.png") },
  { key: "organic_food", label: "Organic & Health Food", icon: "leaf-outline", color: "#DCFCE7", sub: "Natural & Organic Products", imageUrl: require("../assets/images/category/stores/organic_food.png") },
  { key: "paan_shop", label: "Paan & Tobacco Shop", icon: "storefront-outline", color: "#CCFBF1", sub: "Paan, Cigarettes & More", imageUrl: require("../assets/images/category/stores/paan_shop.png") },
  { key: "footwear_store", label: "Footwear & Shoe Store", icon: "walk-outline", color: "#FFEDD5", sub: "Shoes, Sandals & Boots", imageUrl: require("../assets/images/category/stores/footwear_store.png") },
  { key: "gift_shop", label: "Gift & Novelty Shop", icon: "gift-outline", color: "#EDE9FE", sub: "Gifts, Cards & Souvenirs", imageUrl: require("../assets/images/category/stores/gift_shop.png") },
  { key: "pooja_items", label: "Pooja & Religious Items", icon: "flame-outline", color: "#FEF3C7", sub: "Agarbatti, Idols & More", imageUrl: require("../assets/images/category/stores/pooja_items.png") },
  { key: "diagnostic_lab", label: "Diagnostic Lab & Pathology", icon: "pulse-outline", color: "#FEE2E2", sub: "Blood Tests & Health Checks", imageUrl: require("../assets/images/category/stores/diagnostic_lab.png") },
  { key: "printing_xerox", label: "Printing & Xerox", icon: "print-outline", color: "#F3F4F6", sub: "Copies, Prints & Binding", imageUrl: require("../assets/images/category/stores/printing_xerox.png") },
  { key: "travel_agency", label: "Travel Agency", icon: "airplane-outline", color: "#DBEAFE", sub: "Tickets, Hotels & Tours", imageUrl: require("../assets/images/category/stores/travel_agency.png") },
  { key: "catering", label: "Catering Services", icon: "restaurant-outline", color: "#FFEDD5", sub: "Events & Bulk Food Orders", imageUrl: require("../assets/images/category/stores/catering.png") },
  { key: "music_store", label: "Music & Instruments", icon: "musical-notes-outline", color: "#EDE9FE", sub: "Instruments & Accessories", imageUrl: require("../assets/images/category/stores/music_store.png") },
  { key: "liquor_store", label: "Liquor & Wine Shop", icon: "wine-outline", color: "#FEE2E2", sub: "Beer, Wine & Spirits", imageUrl: require("../assets/images/category/stores/liquor_store.png") },
  { key: "electrical_store", label: "Electrical & Wiring", icon: "flash-outline", color: "#FEF3C7", sub: "Switches, Wires & Fittings", imageUrl: require("../assets/images/category/stores/electrical_store.png") },
  { key: "paint_store", label: "Paint & Wall Decor", icon: "brush-outline", color: "#FCE7F3", sub: "Paints, Primers & More", imageUrl: require("../assets/images/category/stores/paint_store.png") },
  { key: "agri_store", label: "Agriculture & Seeds", icon: "leaf-outline", color: "#DCFCE7", sub: "Seeds, Fertilizers & Tools", imageUrl: require("../assets/images/category/stores/agri_store.png") },
  { key: "photography", label: "Photography Studio", icon: "camera-outline", color: "#F3F4F6", sub: "Photos, Editing & Prints", imageUrl: require("../assets/images/category/stores/photography.png") },
  { key: "others_stall", label: "Others — Stall", icon: "storefront-outline", color: "#F9FAFB", sub: "Street & Pop-up Stores", imageUrl: require("../assets/images/category/stores/others_stall.png") },
];
