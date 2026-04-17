// ============================================================
// ALL FEED DATA — Apana Store (Customer App)
//
// Product data for the home-screen "All Items" feed sections:
//   TRENDING_PRODUCTS   — "Trending in {city}" 3-col grid
//   SEASONAL_PRODUCTS   — "Seasonal Picks" 3-col grid
//   DAILY_ESSENTIALS    — horizontal scroll (milk, bread, …)
//   FLASH_DEALS         — horizontal scroll with % off badge
//   NEW_ARRIVALS        — horizontal scroll, new products
//
// Replace with GET /customer/home/feed when backend ready.
// ============================================================

export interface HomeProduct {
  id:     string;
  name:   string;
  unit:   string;
  price:  number;
  icon:   string;   // Ionicons glyph
  bg:     string;   // image placeholder background
  badge?: string;   // e.g. "New", "Season"
}

export interface FlashDeal extends HomeProduct {
  originalPrice: number;
  discountPct:   number;
}

// ── Trending in city ─────────────────────────────────────────
export const TRENDING_PRODUCTS: HomeProduct[] = [
  { id:"tr1",  name:"Fresh Tomatoes",     unit:"500 g",    price:22,   icon:"radio-button-on",    bg:"#FEE2E2" },
  { id:"tr2",  name:"Amul Butter",        unit:"100 g",    price:56,   icon:"restaurant-outline", bg:"#FEF3C7" },
  { id:"tr3",  name:"Samsung Earbuds",    unit:"1 pair",   price:1299, icon:"headset-outline",    bg:"#DBEAFE", badge:"Hot" },
  { id:"tr4",  name:"Dettol Handwash",    unit:"250 ml",   price:89,   icon:"water-outline",      bg:"#DCFCE7" },
  { id:"tr5",  name:"Head & Shoulders",   unit:"200 ml",   price:180,  icon:"leaf-outline",       bg:"#EDE9FE" },
  { id:"tr6",  name:"Maggi Noodles",      unit:"70 g",     price:14,   icon:"restaurant-outline", bg:"#FFEDD5" },
  { id:"tr7",  name:"Colgate Total",      unit:"150 g",    price:95,   icon:"medical-outline",    bg:"#DCFCE7" },
  { id:"tr8",  name:"Good Day Biscuits",  unit:"201 g",    price:30,   icon:"nutrition-outline",  bg:"#FEF3C7" },
  { id:"tr9",  name:"Amul Milk",          unit:"500 ml",   price:28,   icon:"cafe-outline",       bg:"#DBEAFE" },
  { id:"tr10", name:"Parle-G",            unit:"800 g",    price:110,  icon:"nutrition-outline",  bg:"#FEE2E2" },
  { id:"tr11", name:"Vim Dishwash",       unit:"750 ml",   price:109,  icon:"water-outline",      bg:"#ECFDF5" },
  { id:"tr12", name:"Surf Excel",         unit:"500 g",    price:110,  icon:"sparkles-outline",   bg:"#EDE9FE" },
];

// ── Seasonal picks (Summer / April) ──────────────────────────
export const SEASONAL_PRODUCTS: HomeProduct[] = [
  { id:"se1",  name:"Alphonso Mango",     unit:"1 kg",     price:380,  icon:"nutrition-outline",  bg:"#FEF3C7", badge:"Season" },
  { id:"se2",  name:"Watermelon",         unit:"1 kg",     price:25,   icon:"nutrition-outline",  bg:"#FEE2E2" },
  { id:"se3",  name:"Litchi",             unit:"500 g",    price:85,   icon:"leaf-outline",       bg:"#DCFCE7", badge:"Season" },
  { id:"se4",  name:"Kokum Sharbat",      unit:"500 ml",   price:45,   icon:"wine-outline",       bg:"#FCE7F3" },
  { id:"se5",  name:"Coconut Water",      unit:"1 piece",  price:50,   icon:"nutrition-outline",  bg:"#DCFCE7" },
  { id:"se6",  name:"Mango Ice Cream",    unit:"1 litre",  price:130,  icon:"ice-cream-outline",  bg:"#FEF3C7", badge:"New" },
  { id:"se7",  name:"Nivea Sunscreen",    unit:"75 ml",    price:220,  icon:"sunny-outline",      bg:"#DBEAFE", badge:"SPF 50" },
  { id:"se8",  name:"Aam Panna",          unit:"500 ml",   price:25,   icon:"wine-outline",       bg:"#FEF3C7" },
  { id:"se9",  name:"Khus Sharbat",       unit:"750 ml",   price:65,   icon:"wine-outline",       bg:"#ECFDF5" },
  { id:"se10", name:"ORS Powder",         unit:"5 sachets",price:40,   icon:"fitness-outline",    bg:"#DBEAFE" },
  { id:"se11", name:"Cucumber",           unit:"500 g",    price:25,   icon:"leaf-outline",       bg:"#ECFDF5" },
  { id:"se12", name:"Tender Coconut",     unit:"1 piece",  price:55,   icon:"nutrition-outline",  bg:"#DCFCE7" },
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
  { id:"na1",  name:"Galaxy Buds FE",     unit:"1 pair",   price:4999, icon:"headset-outline",    bg:"#DBEAFE", badge:"New" },
  { id:"na2",  name:"Nivea Sunscreen",    unit:"75 ml",    price:220,  icon:"sunny-outline",      bg:"#FEF3C7", badge:"New" },
  { id:"na3",  name:"Organic Green Tea",  unit:"25 bags",  price:180,  icon:"leaf-outline",       bg:"#DCFCE7", badge:"New" },
  { id:"na4",  name:"Mamaearth Face Wash",unit:"100 ml",   price:175,  icon:"water-outline",      bg:"#FCE7F3", badge:"New" },
  { id:"na5",  name:"Oats & Muesli Mix",  unit:"500 g",    price:195,  icon:"nutrition-outline",  bg:"#FFEDD5", badge:"New" },
  { id:"na6",  name:"Protein Bar 6-pack", unit:"6 pcs",    price:450,  icon:"fitness-outline",    bg:"#EDE9FE", badge:"New" },
  { id:"na7",  name:"Premium Basmati",    unit:"5 kg",     price:650,  icon:"nutrition-outline",  bg:"#FEF3C7", badge:"New" },
  { id:"na8",  name:"Bio Enzyme Cleaner", unit:"500 ml",   price:280,  icon:"leaf-outline",       bg:"#ECFDF5", badge:"New" },
  { id:"na9",  name:"Cold Press Coconut Oil",unit:"500 ml",price:380,  icon:"nutrition-outline",  bg:"#FEF3C7", badge:"New" },
  { id:"na10", name:"Charcoal Face Mask", unit:"100 ml",   price:250,  icon:"sparkles-outline",   bg:"#FCE7F3", badge:"New" },
];
