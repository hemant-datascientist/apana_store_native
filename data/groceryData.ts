// ============================================================
// GROCERY DATA — Apana Store (Customer App)
//
// Sub-categories, Regular Items & Seasonal sections for the
// Grocery category feed.
// Replace icon+color placeholders with image URIs from backend.
// ============================================================

const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const getAssetUrl = (path: string) => `http://${TOWER_IP}:8000/assets/images/apana_store/${path}`;

// ── Sub-categories ────────────────────────────────────────────

export interface GrocerySubCategory {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph (shown when no image)
  bg:    string;   // tile background color
  apc:   string;   // APC class this tile opens (§27 grocery, APC-01-*)
  imageUrl?: any;
}

// Grocery sub-categories — grocery ONLY, aligned to the §27 APC grocery
// classes (APC-01-*). Non-grocery tiles (kitchen accessories, soft drinks,
// snacks, chocolates) were removed; each tile opens its APC class.
export const GROCERY_SUB_CATEGORIES: GrocerySubCategory[] = [
  { key: "vegetables", label: "Vegetables",              icon: "leaf-outline",       bg: "#DCFCE7", apc: "APC-01-VEG",  imageUrl: require("../assets/images/grocery/vegetables.png") },
  { key: "fruits",     label: "Fruits",                  icon: "nutrition-outline",  bg: "#FEF3C7", apc: "APC-01-FRT",  imageUrl: require("../assets/images/grocery/fruits.png") },
  { key: "dairy",      label: "Dairy",                   icon: "water-outline",      bg: "#DBEAFE", apc: "APC-01-DAI",  imageUrl: require("../assets/images/grocery/milky_products.png") },
  { key: "dryfruits",  label: "Dry Fruits & Nuts",       icon: "ellipse-outline",    bg: "#FFEDD5", apc: "APC-01-DRYF", imageUrl: require("../assets/images/grocery/dry_fruits.png") },
  { key: "grains",     label: "Grains & Seeds",          icon: "nutrition-outline",  bg: "#FEF9C3", apc: "APC-01-STPL", imageUrl: require("../assets/images/grocery/wheat_pulses.png") },
  { key: "ration",     label: "Ration",                  icon: "basket-outline",     bg: "#FEE2E2", apc: "APC-01-STPL" },
  { key: "spices",     label: "Spices",                  icon: "flask-outline",      bg: "#FCE7F3", apc: "APC-01-SPC" },
  { key: "tea",        label: "Tea, Coffee & Drink Powders", icon: "cafe-outline",   bg: "#FEF3C7", apc: "APC-01-TEA" },
  { key: "oil",        label: "Cooking Oil & Ghee",      icon: "water-outline",      bg: "#ECFDF5", apc: "APC-01-OIL",  imageUrl: require("../assets/images/grocery/oil.png") },
  { key: "batters",    label: "Batters",                 icon: "beaker-outline",     bg: "#EDE9FE", apc: "APC-01-STPL" },
  { key: "masala",     label: "Masala & Sauces",         icon: "flame-outline",      bg: "#FEE2E2", apc: "APC-01-SPC",  imageUrl: require("../assets/images/grocery/masala.png") },
  { key: "pickles",    label: "Pickles, Papad & Chutney", icon: "restaurant-outline", bg: "#FEF9C3", apc: "APC-01-PKGF" },
];

// ── Product card ──────────────────────────────────────────────

export interface GroceryProduct {
  id:     string;
  name:   string;
  price:  string;   // display string e.g. "₹20–45/kg"
  icon:   string;   // Ionicons glyph
  bg:     string;   // placeholder bg color
  badge?: string;   // "Fresh" | "Seasonal" | "Offer" etc.
  imageUrl?: any;
}

// ── Regular Items ─────────────────────────────────────────────

export const REGULAR_ITEMS: GroceryProduct[] = [
  { id:"r1",  name:"Potatoes",    price:"₹20–45/kg",        icon:"earth-outline",        bg:"#FEF3C7", badge:"Fresh", imageUrl: require("../assets/images/grocery/vegetables.png") },
  { id:"r2",  name:"Tomato",      price:"₹25–45/kg",        icon:"radio-button-on",      bg:"#FEE2E2", badge:"Fresh", imageUrl: require("../assets/images/grocery/vegetables.png") },
  { id:"r3",  name:"Onion",       price:"₹15–40/kg",        icon:"ellipse-outline",      bg:"#FCE7F3", imageUrl: require("../assets/images/grocery/vegetables.png") },
  { id:"r4",  name:"Cow Milk",    price:"₹50–70/litre",     icon:"water-outline",        bg:"#DBEAFE", badge:"Daily", imageUrl: require("../assets/images/grocery/milky_products.png") },
  { id:"r5",  name:"Buffalo Milk",price:"₹60–80/litre",     icon:"water-outline",        bg:"#E0F2FE", imageUrl: require("../assets/images/grocery/milky_products.png") },
  { id:"r6",  name:"Sugar",       price:"₹30–40/kg",        icon:"cube-outline",         bg:"#F3F4F6", imageUrl: require("../assets/images/grocery/dry_fruits.png") },
  { id:"r7",  name:"Bread",       price:"₹20–50/100g",      icon:"apps-outline",         bg:"#FFEDD5", badge:"Fresh", imageUrl: require("../assets/images/grocery/chocolates.png") },
  { id:"r8",  name:"Eggs",        price:"₹8–15/piece",      icon:"ellipse",              bg:"#FEF9C3", imageUrl: require("../assets/images/grocery/milky_products.png") },
  { id:"r9",  name:"Wheat Flour", price:"₹45–90/kg",        icon:"layers-outline",       bg:"#FEF3C7", imageUrl: require("../assets/images/grocery/wheat_pulses.png") },
  { id:"r10", name:"Tea / Coffee",price:"₹70–100/100g",     icon:"cafe-outline",         bg:"#FEE2E2", imageUrl: require("../assets/images/grocery/drinks.png") },
  { id:"r11", name:"Biscuits",    price:"₹5–700",           icon:"grid-outline",         bg:"#FCE7F3", imageUrl: require("../assets/images/grocery/chocolates.png") },
  { id:"r12", name:"Ghee",        price:"₹500–7000/kg",     icon:"beaker-outline",       bg:"#FEF9C3", badge:"Pure", imageUrl: require("../assets/images/grocery/oil.png") },
];

// ── Seasonal Fruits & Vegetables ──────────────────────────────

export const SEASONAL_ITEMS: GroceryProduct[] = [
  { id:"s1",  name:"Mango",       price:"₹200–450/kg",      icon:"nutrition-outline",    bg:"#FEF3C7", badge:"Season", imageUrl: require("../assets/images/grocery/fruits.png") },
  { id:"s2",  name:"Kothimbir",   price:"₹10–30/kg",        icon:"leaf-outline",         bg:"#DCFCE7", badge:"Fresh",  imageUrl: require("../assets/images/grocery/vegetables.png") },
  { id:"s3",  name:"Lemons",      price:"₹15–40/kg",        icon:"radio-button-on",      bg:"#FEFCE8", imageUrl: require("../assets/images/grocery/vegetables.png") },
  { id:"s4",  name:"Figs",        price:"₹50–70/kg",        icon:"ellipse-outline",      bg:"#FEE2E2", badge:"Season", imageUrl: require("../assets/images/grocery/fruits.png") },
  { id:"s5",  name:"Mosambi",     price:"₹60–180/kg",       icon:"nutrition-outline",    bg:"#FEF9C3", imageUrl: require("../assets/images/grocery/fruits.png") },
  { id:"s6",  name:"Guava",       price:"₹30–40/kg",        icon:"earth-outline",        bg:"#DCFCE7", badge:"Fresh",  imageUrl: require("../assets/images/grocery/fruits.png") },
  { id:"s7",  name:"Ber",         price:"₹50–70/kg",        icon:"ellipse",              bg:"#FEE2E2", imageUrl: require("../assets/images/grocery/fruits.png") },
  { id:"s8",  name:"Kiwi",        price:"₹120–200/kg",      icon:"earth-outline",        bg:"#D1FAE5", badge:"Exotic", imageUrl: require("../assets/images/grocery/fruits.png") },
  { id:"s9",  name:"Banana",      price:"₹30–60/dozen",     icon:"nutrition-outline",    bg:"#FEF3C7", imageUrl: require("../assets/images/grocery/fruits.png") },
];

// ── Grocery sections config ───────────────────────────────────

export interface GrocerySection {
  key:      string;
  title:    string;
  icon:     string;
  iconColor:string;
  products: GroceryProduct[];
}

export const GROCERY_SECTIONS: GrocerySection[] = [
  {
    key:       "regular",
    title:     "Regular Items",
    icon:      "basket-outline",
    iconColor: "#026451",
    products:  REGULAR_ITEMS,
  },
  {
    key:       "seasonal",
    title:     "Seasonal Fruits & Vegetables",
    icon:      "leaf-outline",
    iconColor: "#15803D",
    products:  SEASONAL_ITEMS,
  },
];
