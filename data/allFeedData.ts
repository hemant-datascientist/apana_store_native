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

// ── Trending local / city-famous items ───────────────────────
//
// Each city has its OWN trending list — what is famous in Pune
// is NOT the same as what is famous in Mumbai or Delhi.
//
// Backend contract (replace mock when ready):
//   GET /customer/home/trending?city=pune
//   Response: TrendingCityItem[]
//
// To add a new city: add a key to CITY_TRENDING below.
// To go live: replace getTrendingForCity() body with an API call.
// ─────────────────────────────────────────────────────────────

export interface TrendingCityItem {
  id:   string;
  name: string;
  tag:  string;   // short label: "Famous Snack", "Local Brand" …
  icon: string;   // Ionicons glyph
  bg:   string;   // image placeholder background
}

// City slug → trending items map
// slug = city name lowercased + trimmed (matches MOCK_LOCATION.area)
export const CITY_TRENDING: Record<string, TrendingCityItem[]> = {

  // ── Pune ───────────────────────────────────────────────────
  pune: [
    { id:"pn1",  name:"Metro Wholesale",        tag:"Local Store",       icon:"storefront-outline",   bg:"#DBEAFE" },
    { id:"pn2",  name:"Shrewsbury Biscuits",    tag:"Famous Snack",      icon:"nutrition-outline",    bg:"#FEF3C7" },
    { id:"pn3",  name:"Chitale Bhakarwadi",     tag:"Famous Snack",      icon:"nutrition-outline",    bg:"#FFEDD5" },
    { id:"pn4",  name:"Meridian Ice Cream",     tag:"Ice Cream Parlour", icon:"ice-cream-outline",    bg:"#FCE7F3" },
    { id:"pn5",  name:"Puneri Pagadi",          tag:"Traditional Craft", icon:"flag-outline",         bg:"#EDE9FE" },
    { id:"pn6",  name:"Maharashtrian Naths",    tag:"Traditional Jewel", icon:"diamond-outline",      bg:"#FCE7F3" },
    { id:"pn7",  name:"Osha Chappals",          tag:"Local Footwear",    icon:"walk-outline",         bg:"#FEF3C7" },
    { id:"pn8",  name:"Kolhapuri Chappals",     tag:"Famous Footwear",   icon:"walk-outline",         bg:"#FFEDD5" },
    { id:"pn9",  name:"Bun Maska",              tag:"Famous Breakfast",  icon:"cafe-outline",         bg:"#FFEDD5" },
    { id:"pn10", name:"Kala Khatta",            tag:"Famous Drink",      icon:"wine-outline",         bg:"#EDE9FE" },
    { id:"pn11", name:"Pithla Bhakri",          tag:"Local Cuisine",     icon:"restaurant-outline",   bg:"#DCFCE7" },
    { id:"pn12", name:"Puran Poli",             tag:"Famous Sweet",      icon:"nutrition-outline",    bg:"#FEE2E2" },
  ],

  // ── Mumbai ─────────────────────────────────────────────────
  mumbai: [
    { id:"mb1",  name:"Vada Pav",               tag:"Iconic Street Food", icon:"fast-food-outline",   bg:"#FFEDD5" },
    { id:"mb2",  name:"Pav Bhaji",              tag:"Famous Dish",        icon:"restaurant-outline",  bg:"#FEE2E2" },
    { id:"mb3",  name:"Cutting Chai",           tag:"Famous Drink",       icon:"cafe-outline",        bg:"#FEF3C7" },
    { id:"mb4",  name:"Irani Cafe",             tag:"Heritage Cafe",      icon:"cafe-outline",        bg:"#FFEDD5" },
    { id:"mb5",  name:"Colaba Causeway",        tag:"Famous Market",      icon:"storefront-outline",  bg:"#DBEAFE" },
    { id:"mb6",  name:"Crawford Market",        tag:"Heritage Market",    icon:"basket-outline",      bg:"#DCFCE7" },
    { id:"mb7",  name:"Bhel Puri",              tag:"Famous Snack",       icon:"nutrition-outline",   bg:"#FEF3C7" },
    { id:"mb8",  name:"Mumbai Sandwich",        tag:"Famous Breakfast",   icon:"nutrition-outline",   bg:"#DCFCE7" },
    { id:"mb9",  name:"Dabbawalas",             tag:"Iconic Service",     icon:"bicycle-outline",     bg:"#DBEAFE" },
    { id:"mb10", name:"Kanda Poha",             tag:"Local Breakfast",    icon:"restaurant-outline",  bg:"#FEF3C7" },
    { id:"mb11", name:"Kulfi Falooda",          tag:"Famous Dessert",     icon:"ice-cream-outline",   bg:"#FCE7F3" },
    { id:"mb12", name:"Modak",                  tag:"Famous Sweet",       icon:"nutrition-outline",   bg:"#EDE9FE" },
  ],

  // ── Delhi ──────────────────────────────────────────────────
  delhi: [
    { id:"dl1",  name:"Chole Bhature",          tag:"Famous Dish",        icon:"restaurant-outline",  bg:"#FFEDD5" },
    { id:"dl2",  name:"Butter Chicken",         tag:"Iconic Dish",        icon:"flame-outline",       bg:"#FEE2E2" },
    { id:"dl3",  name:"Paranthe Wali Gali",     tag:"Famous Food Street", icon:"storefront-outline",  bg:"#FEF3C7" },
    { id:"dl4",  name:"Chandni Chowk",          tag:"Heritage Market",    icon:"basket-outline",      bg:"#DBEAFE" },
    { id:"dl5",  name:"Sarojini Nagar",         tag:"Famous for Clothes", icon:"shirt-outline",       bg:"#EDE9FE" },
    { id:"dl6",  name:"Dilli Haat",             tag:"Crafts Market",      icon:"color-palette-outline",bg:"#FCE7F3"},
    { id:"dl7",  name:"Gol Gappe",              tag:"Famous Street Food", icon:"nutrition-outline",   bg:"#DCFCE7" },
    { id:"dl8",  name:"Jalebi",                 tag:"Famous Sweet",       icon:"nutrition-outline",   bg:"#FEF3C7" },
    { id:"dl9",  name:"Lajpat Nagar",           tag:"Shopping Hub",       icon:"bag-outline",         bg:"#DBEAFE" },
    { id:"dl10", name:"Karim's",                tag:"Legendary Eatery",   icon:"restaurant-outline",  bg:"#FFEDD5" },
    { id:"dl11", name:"Rajma Chawal",           tag:"Local Comfort Food", icon:"restaurant-outline",  bg:"#FEE2E2" },
    { id:"dl12", name:"Daulat Ki Chaat",        tag:"Seasonal Delicacy",  icon:"sparkles-outline",    bg:"#EDE9FE" },
  ],

  // ── Bangalore ──────────────────────────────────────────────
  bangalore: [
    { id:"bl1",  name:"Masala Dosa (MTR)",      tag:"Iconic Dish",        icon:"restaurant-outline",  bg:"#FFEDD5" },
    { id:"bl2",  name:"Filter Coffee",          tag:"Famous Drink",       icon:"cafe-outline",        bg:"#FEF3C7" },
    { id:"bl3",  name:"Vidyarthi Bhavan",       tag:"Heritage Eatery",    icon:"storefront-outline",  bg:"#DBEAFE" },
    { id:"bl4",  name:"Commercial Street",      tag:"Famous Shopping",    icon:"bag-outline",         bg:"#EDE9FE" },
    { id:"bl5",  name:"Rava Idli",              tag:"Bangalore Invention",icon:"restaurant-outline",  bg:"#DCFCE7" },
    { id:"bl6",  name:"Bisi Bele Bath",         tag:"Local Cuisine",      icon:"flame-outline",       bg:"#FFEDD5" },
    { id:"bl7",  name:"Craft Beer",             tag:"Brewery Culture",    icon:"wine-outline",        bg:"#DBEAFE" },
    { id:"bl8",  name:"Brigade Road",           tag:"Shopping Street",    icon:"storefront-outline",  bg:"#FCE7F3" },
    { id:"bl9",  name:"Mysore Pak",             tag:"Famous Sweet",       icon:"nutrition-outline",   bg:"#FEF3C7" },
    { id:"bl10", name:"Koshy's Bakery",         tag:"Heritage Cafe",      icon:"cafe-outline",        bg:"#FFEDD5" },
    { id:"bl11", name:"Silk Sarees",            tag:"Karnataka Craft",    icon:"sparkles-outline",    bg:"#EDE9FE" },
    { id:"bl12", name:"Churmuri",               tag:"Local Street Food",  icon:"fast-food-outline",   bg:"#DCFCE7" },
  ],

  // ── Hyderabad ──────────────────────────────────────────────
  hyderabad: [
    { id:"hy1",  name:"Hyderabadi Biryani",     tag:"Iconic Dish",        icon:"restaurant-outline",  bg:"#FFEDD5" },
    { id:"hy2",  name:"Haleem",                 tag:"Famous Dish",        icon:"restaurant-outline",  bg:"#FEE2E2" },
    { id:"hy3",  name:"Mirchi Bajji",           tag:"Famous Street Food", icon:"fast-food-outline",   bg:"#DCFCE7" },
    { id:"hy4",  name:"Laad Bazaar",            tag:"Famous for Bangles", icon:"diamond-outline",     bg:"#FCE7F3" },
    { id:"hy5",  name:"Osmania Biscuit",        tag:"Famous Snack",       icon:"nutrition-outline",   bg:"#FEF3C7" },
    { id:"hy6",  name:"Double Ka Meetha",       tag:"Famous Dessert",     icon:"nutrition-outline",   bg:"#EDE9FE" },
    { id:"hy7",  name:"Irani Chai",             tag:"Famous Drink",       icon:"cafe-outline",        bg:"#FFEDD5" },
    { id:"hy8",  name:"Kakatiya Pearls",        tag:"Hyderabad Jewellery",icon:"diamond-outline",     bg:"#DBEAFE" },
    { id:"hy9",  name:"Paradise Biryani",       tag:"Iconic Restaurant",  icon:"storefront-outline",  bg:"#FFEDD5" },
    { id:"hy10", name:"Qubani Ka Meetha",       tag:"Traditional Sweet",  icon:"nutrition-outline",   bg:"#FCE7F3" },
    { id:"hy11", name:"Nimco Snacks",           tag:"Local Snack Brand",  icon:"nutrition-outline",   bg:"#FEF3C7" },
    { id:"hy12", name:"Charminar Area",         tag:"Heritage Market",    icon:"location-outline",    bg:"#DBEAFE" },
  ],

  // ── Chennai ────────────────────────────────────────────────
  chennai: [
    { id:"ch1",  name:"Idli Sambar",            tag:"Iconic Breakfast",   icon:"restaurant-outline",  bg:"#DCFCE7" },
    { id:"ch2",  name:"Filter Coffee",          tag:"Famous Drink",       icon:"cafe-outline",        bg:"#FEF3C7" },
    { id:"ch3",  name:"T Nagar Shopping",       tag:"Shopping Hub",       icon:"bag-outline",         bg:"#EDE9FE" },
    { id:"ch4",  name:"Chennai Silk Sarees",    tag:"Kanchipuram Silk",   icon:"sparkles-outline",    bg:"#FCE7F3" },
    { id:"ch5",  name:"Murukku",                tag:"Famous Snack",       icon:"nutrition-outline",   bg:"#FFEDD5" },
    { id:"ch6",  name:"Kothu Parotta",          tag:"Local Dish",         icon:"restaurant-outline",  bg:"#FEE2E2" },
    { id:"ch7",  name:"Pondy Bazaar",           tag:"Famous Market",      icon:"storefront-outline",  bg:"#DBEAFE" },
    { id:"ch8",  name:"Madurai Malli",          tag:"Jasmine Flower",     icon:"flower-outline",      bg:"#ECFDF5" },
    { id:"ch9",  name:"Chettinad Cuisine",      tag:"Regional Cuisine",   icon:"flame-outline",       bg:"#FFEDD5" },
    { id:"ch10", name:"Mylapore Temple",        tag:"Cultural Heritage",  icon:"location-outline",    bg:"#DBEAFE" },
    { id:"ch11", name:"Pazha Mudhir Solai",     tag:"Famous Fruit Shop",  icon:"nutrition-outline",   bg:"#DCFCE7" },
    { id:"ch12", name:"Adhirasam",              tag:"Traditional Sweet",  icon:"nutrition-outline",   bg:"#FEF3C7" },
  ],

  // ── Kolkata ────────────────────────────────────────────────
  kolkata: [
    { id:"kl1",  name:"Rosogolla",              tag:"Iconic Sweet",       icon:"nutrition-outline",   bg:"#FCE7F3" },
    { id:"kl2",  name:"Mishti Doi",             tag:"Famous Dessert",     icon:"cafe-outline",        bg:"#FEF3C7" },
    { id:"kl3",  name:"Kati Roll",              tag:"Famous Street Food", icon:"fast-food-outline",   bg:"#FFEDD5" },
    { id:"kl4",  name:"Puchka",                 tag:"Iconic Street Food", icon:"nutrition-outline",   bg:"#DCFCE7" },
    { id:"kl5",  name:"Kolkata Biryani",        tag:"Iconic Dish",        icon:"restaurant-outline",  bg:"#FEE2E2" },
    { id:"kl6",  name:"Sandesh",                tag:"Traditional Sweet",  icon:"nutrition-outline",   bg:"#EDE9FE" },
    { id:"kl7",  name:"College Street",         tag:"Famous for Books",   icon:"book-outline",        bg:"#DBEAFE" },
    { id:"kl8",  name:"New Market",             tag:"Heritage Market",    icon:"basket-outline",      bg:"#DCFCE7" },
    { id:"kl9",  name:"Shondesh",               tag:"Bengali Sweet",      icon:"nutrition-outline",   bg:"#FCE7F3" },
    { id:"kl10", name:"Kumartuli Crafts",        tag:"Traditional Craft",  icon:"color-palette-outline",bg:"#EDE9FE"},
    { id:"kl11", name:"Mishti Pan",             tag:"Famous Pan Shop",    icon:"leaf-outline",        bg:"#ECFDF5" },
    { id:"kl12", name:"Durga Puja Decor",       tag:"Cultural Specialty", icon:"sparkles-outline",    bg:"#FEF3C7" },
  ],
};

// ── City trending resolver ────────────────────────────────────
//
// MOCK: returns hardcoded city data.
//
// BACKEND READY — swap this function body with an API call:
//   const res  = await fetch(`/api/customer/home/trending?city=${slug}`);
//   return res.json() as TrendingCityItem[];
//
// The component calling this does NOT change — only this function.
// ─────────────────────────────────────────────────────────────
export function getTrendingForCity(city: string): TrendingCityItem[] {
  const slug = city.toLowerCase().trim();
  return CITY_TRENDING[slug] ?? CITY_TRENDING["pune"]; // fallback to Pune until city is onboarded
}

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
