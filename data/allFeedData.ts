// ============================================================
// ALL FEED DATA — Apana Store (Customer App)
//
// Data for the home-screen "All Items" feed sections:
//   TRENDING_CITY_ITEMS — famous local items/brands/food unique to city
//   SUMMER_CATEGORIES   — seasonal sub-categories (Summer)
//   DAILY_ESSENTIALS    — horizontal scroll (milk, bread, …)
//   FLASH_DEALS         — horizontal scroll with % off badge
//   NEW_ARRIVALS        — horizontal scroll, new products
//   POPULAR_STORES      — horizontal scroll of nearby stores
//
// Replace with GET /customer/home/feed when backend ready.
// ============================================================

// ── Common product shape ──────────────────────────────────────
export interface HomeProduct {
  id:     string;
  name:   string;
  unit:   string;
  price:  number;
  icon:   string;   // Ionicons glyph
  bg:     string;   // image placeholder background
  badge?: string;   // e.g. "New", "Hot"
}

export interface FlashDeal extends HomeProduct {
  originalPrice: number;
  discountPct:   number;
}

// ── Trending local/city famous items ─────────────────────────
// These are things the city is KNOWN for — local food, crafts,
// iconic brands, famous dishes. No price — tap to discover.
export interface TrendingCityItem {
  id:   string;
  name: string;
  tag:  string;   // e.g. "Famous Snack", "Local Brand"
  icon: string;
  bg:   string;
}

export const TRENDING_CITY_ITEMS: TrendingCityItem[] = [
  { id:"tc1",  name:"Metro Wholesale",        tag:"Local Store",       icon:"storefront-outline",   bg:"#DBEAFE" },
  { id:"tc2",  name:"Shrewsbury Biscuits",    tag:"Famous Snack",      icon:"nutrition-outline",    bg:"#FEF3C7" },
  { id:"tc3",  name:"Chitale Bhakarwadi",     tag:"Famous Snack",      icon:"nutrition-outline",    bg:"#FFEDD5" },
  { id:"tc4",  name:"Meridian Ice Cream",     tag:"Ice Cream Parlour", icon:"ice-cream-outline",    bg:"#FCE7F3" },
  { id:"tc5",  name:"Puneri Pagadi",          tag:"Traditional Craft", icon:"flag-outline",         bg:"#EDE9FE" },
  { id:"tc6",  name:"Maharashtrian Naths",    tag:"Traditional Jewel", icon:"diamond-outline",      bg:"#FCE7F3" },
  { id:"tc7",  name:"Osha Chappals",          tag:"Local Footwear",    icon:"walk-outline",         bg:"#FEF3C7" },
  { id:"tc8",  name:"Kolhapuri Chappals",     tag:"Famous Footwear",   icon:"walk-outline",         bg:"#FFEDD5" },
  { id:"tc9",  name:"Bun Maska",              tag:"Famous Breakfast",  icon:"cafe-outline",         bg:"#FFEDD5" },
  { id:"tc10", name:"Kala Khatta",            tag:"Famous Drink",      icon:"wine-outline",         bg:"#EDE9FE" },
  { id:"tc11", name:"Pithla Bhakri",          tag:"Local Cuisine",     icon:"restaurant-outline",   bg:"#DCFCE7" },
  { id:"tc12", name:"Puran Poli",             tag:"Famous Sweet",      icon:"nutrition-outline",    bg:"#FEE2E2" },
];

// ── Seasonal sub-categories (Summer / April–June) ─────────────
// Category-based discovery, not individual products.
export interface SeasonalCat {
  key:   string;
  label: string;
  icon:  string;
  bg:    string;
}

export const SUMMER_CATEGORIES: SeasonalCat[] = [
  { key:"sunscreens",  label:"Sunscreens",         icon:"sunny-outline",         bg:"#FEF3C7" },
  { key:"skincare",    label:"Skincare",            icon:"sparkles-outline",      bg:"#FCE7F3" },
  { key:"beverages",   label:"Refreshing Cools",    icon:"wine-outline",          bg:"#DBEAFE" },
  { key:"milkshakes",  label:"Milkshakes",          icon:"cafe-outline",          bg:"#FEF3C7" },
  { key:"aircooler",   label:"Air Coolers",         icon:"snow-outline",          bg:"#E0F2FE" },
  { key:"energy",      label:"Energy Drinks",       icon:"flash-outline",         bg:"#FEE2E2" },
  { key:"fruits",      label:"Summer Fruits",       icon:"nutrition-outline",     bg:"#DCFCE7" },
  { key:"icecream",    label:"Frozen Desserts",     icon:"ice-cream-outline",     bg:"#FCE7F3" },
  { key:"hydration",   label:"Body Hydration",      icon:"fitness-outline",       bg:"#ECFDF5" },
  { key:"pool",        label:"Pool & Beach",        icon:"water-outline",         bg:"#DBEAFE" },
  { key:"lightcloth",  label:"Light Clothing",      icon:"shirt-outline",         bg:"#EDE9FE" },
  { key:"footwear",    label:"Summer Footwear",     icon:"walk-outline",          bg:"#FFEDD5" },
];

// ── Daily Essentials (horizontal scroll) ─────────────────────
export const DAILY_ESSENTIALS: HomeProduct[] = [
  { id:"de1",  name:"Amul Milk",          unit:"500 ml",   price:28,   icon:"cafe-outline",       bg:"#DBEAFE" },
  { id:"de2",  name:"Britannia Bread",    unit:"400 g",    price:42,   icon:"nutrition-outline",  bg:"#FEF3C7" },
  { id:"de3",  name:"Amul Butter",        unit:"100 g",    price:56,   icon:"restaurant-outline", bg:"#FEF3C7" },
  { id:"de4",  name:"Amul Ghee",          unit:"500 ml",   price:290,  icon:"flame-outline",      bg:"#FFEDD5" },
  { id:"de5",  name:"Farm Fresh Eggs",    unit:"6 pcs",    price:72,   icon:"ellipse-outline",    bg:"#FEF3C7" },
  { id:"de6",  name:"Amul Curd",          unit:"400 g",    price:40,   icon:"cafe-outline",       bg:"#EDE9FE" },
  { id:"de7",  name:"Sugar",              unit:"1 kg",     price:48,   icon:"nutrition-outline",  bg:"#DBEAFE" },
  { id:"de8",  name:"Tata Tea Gold",      unit:"250 g",    price:95,   icon:"cafe-outline",       bg:"#FFEDD5" },
  { id:"de9",  name:"Aashirvaad Atta",    unit:"1 kg",     price:55,   icon:"nutrition-outline",  bg:"#FEF3C7" },
  { id:"de10", name:"India Gate Rice",    unit:"1 kg",     price:68,   icon:"nutrition-outline",  bg:"#DCFCE7" },
  { id:"de11", name:"Toor Dal",           unit:"500 g",    price:75,   icon:"nutrition-outline",  bg:"#FEE2E2" },
  { id:"de12", name:"Tata Salt",          unit:"1 kg",     price:22,   icon:"water-outline",      bg:"#ECFDF5" },
];

// ── Flash Deals (horizontal scroll, % off) ───────────────────
export const FLASH_DEALS: FlashDeal[] = [
  { id:"fd1",  name:"Head & Shoulders",   unit:"200 ml",   price:130,  originalPrice:180, discountPct:28, icon:"leaf-outline",       bg:"#EDE9FE" },
  { id:"fd2",  name:"Dettol Soap",        unit:"75 g",     price:32,   originalPrice:45,  discountPct:29, icon:"water-outline",      bg:"#DCFCE7" },
  { id:"fd3",  name:"Maggi 4-pack",       unit:"280 g",    price:44,   originalPrice:56,  discountPct:21, icon:"restaurant-outline", bg:"#FFEDD5" },
  { id:"fd4",  name:"Coca Cola",          unit:"2 L",      price:75,   originalPrice:95,  discountPct:21, icon:"wine-outline",       bg:"#FEE2E2" },
  { id:"fd5",  name:"Lays Classic",       unit:"52 g",     price:15,   originalPrice:20,  discountPct:25, icon:"nutrition-outline",  bg:"#FEF3C7" },
  { id:"fd6",  name:"Colgate Total",      unit:"150 g",    price:72,   originalPrice:95,  discountPct:24, icon:"medical-outline",    bg:"#DCFCE7" },
  { id:"fd7",  name:"Vim Dishwash",       unit:"750 ml",   price:85,   originalPrice:109, discountPct:22, icon:"water-outline",      bg:"#ECFDF5" },
  { id:"fd8",  name:"Surf Excel Bar",     unit:"500 g",    price:88,   originalPrice:110, discountPct:20, icon:"sparkles-outline",   bg:"#EDE9FE" },
  { id:"fd9",  name:"Parle-G",            unit:"800 g",    price:88,   originalPrice:110, discountPct:20, icon:"nutrition-outline",  bg:"#FEF3C7" },
  { id:"fd10", name:"Lifebuoy Soap",      unit:"125 g",    price:32,   originalPrice:42,  discountPct:24, icon:"water-outline",      bg:"#DBEAFE" },
];

// ── New Arrivals (horizontal scroll) ─────────────────────────
export const NEW_ARRIVALS: HomeProduct[] = [
  { id:"na1",  name:"Galaxy Buds FE",       unit:"1 pair",   price:4999, icon:"headset-outline",    bg:"#DBEAFE", badge:"New" },
  { id:"na2",  name:"Nivea Sunscreen",      unit:"75 ml",    price:220,  icon:"sunny-outline",      bg:"#FEF3C7", badge:"New" },
  { id:"na3",  name:"Organic Green Tea",    unit:"25 bags",  price:180,  icon:"leaf-outline",       bg:"#DCFCE7", badge:"New" },
  { id:"na4",  name:"Mamaearth Face Wash",  unit:"100 ml",   price:175,  icon:"water-outline",      bg:"#FCE7F3", badge:"New" },
  { id:"na5",  name:"Oats & Muesli Mix",    unit:"500 g",    price:195,  icon:"nutrition-outline",  bg:"#FFEDD5", badge:"New" },
  { id:"na6",  name:"Protein Bar 6-pack",   unit:"6 pcs",    price:450,  icon:"fitness-outline",    bg:"#EDE9FE", badge:"New" },
  { id:"na7",  name:"Premium Basmati",      unit:"5 kg",     price:650,  icon:"nutrition-outline",  bg:"#FEF3C7", badge:"New" },
  { id:"na8",  name:"Bio Enzyme Cleaner",   unit:"500 ml",   price:280,  icon:"leaf-outline",       bg:"#ECFDF5", badge:"New" },
  { id:"na9",  name:"Cold Press Coconut Oil",unit:"500 ml",  price:380,  icon:"nutrition-outline",  bg:"#FEF3C7", badge:"New" },
  { id:"na10", name:"Charcoal Face Mask",   unit:"100 ml",   price:250,  icon:"sparkles-outline",   bg:"#FCE7F3", badge:"New" },
];

// ── Popular Stores Near You (horizontal scroll) ───────────────
export interface PopularStore {
  id:        string;
  name:      string;
  category:  string;
  area:      string;
  rating:    number;   // e.g. 4.5
  icon:      string;
  bg:        string;
  badge:     string;
  badgeBg:   string;
  badgeColor:string;
}

export const POPULAR_STORES: PopularStore[] = [
  { id:"ps1",  name:"Chitale Bandhu",         category:"Sweets & Snacks",  area:"Deccan",      rating:4.8, icon:"storefront-outline",  bg:"#FEF3C7", badge:"Top Rated", badgeBg:"#FEF3C7", badgeColor:"#B45309" },
  { id:"ps2",  name:"D-Mart Baner",           category:"Supermarket",      area:"Baner",       rating:4.5, icon:"cart-outline",         bg:"#DBEAFE", badge:"Popular",   badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
  { id:"ps3",  name:"Apollo Pharmacy",        category:"Pharmacy",         area:"Wakad",       rating:4.7, icon:"medkit-outline",       bg:"#FEE2E2", badge:"Open 24/7", badgeBg:"#DCFCE7", badgeColor:"#15803D" },
  { id:"ps4",  name:"Cafe Goodluck",          category:"Cafe",             area:"Deccan",      rating:4.9, icon:"cafe-outline",         bg:"#FFEDD5", badge:"Iconic",    badgeBg:"#FEF3C7", badgeColor:"#B45309" },
  { id:"ps5",  name:"Vaishali Restaurant",    category:"Restaurant",       area:"FC Road",     rating:4.8, icon:"restaurant-outline",   bg:"#DCFCE7", badge:"Legendary", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
  { id:"ps6",  name:"Naturals Ice Cream",     category:"Ice Cream",        area:"Kothrud",     rating:4.6, icon:"ice-cream-outline",    bg:"#FCE7F3", badge:"Popular",   badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
  { id:"ps7",  name:"More Supermarket",       category:"Grocery",          area:"Aundh",       rating:4.4, icon:"basket-outline",       bg:"#ECFDF5", badge:"Open",      badgeBg:"#DCFCE7", badgeColor:"#15803D" },
  { id:"ps8",  name:"Westside Clothing",      category:"Fashion",          area:"FC Road",     rating:4.5, icon:"shirt-outline",        bg:"#EDE9FE", badge:"Trending",  badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
];
