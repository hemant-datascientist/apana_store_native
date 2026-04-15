// ============================================================
// CATEGORY FEED DATA — Apana Store (Customer App)
//
// Each product category gets its own banner carousel and
// "near you" section. The "All Items" category uses the
// separate BANNERS + TRENDING_ITEMS from homeData.ts.
//
// Replace with GET /customer/category/:key when backend ready.
// ============================================================

import { Banner, TrendingItem } from "./homeData";

export interface CategoryFeed {
  banners:      Banner[];
  sectionTitle: string;
  sectionIcon:  string;   // Ionicons glyph
  items:        TrendingItem[];
}

export const CATEGORY_FEEDS: Record<string, CategoryFeed> = {

  // ── GROCERY ─────────────────────────────────────────────────
  grocery: {
    banners: [
      {
        id:       "g1",
        title:    "Fresh Every Day",
        subtitle: "Farm-fresh vegetables, fruits & dairy delivered fast from local mandis.",
        tag:      "Up to 20% Off",
        bg:       "#026451",
        accent:   "#6EE7B7",
        icon:     "basket-outline",
      },
      {
        id:       "g2",
        title:    "Daily Essentials",
        subtitle: "Rice, dal, oil, spices & packaged foods from trusted local stores.",
        tag:      "Free Delivery",
        bg:       "#065F46",
        accent:   "#A7F3D0",
        icon:     "storefront-outline",
      },
    ],
    sectionTitle: "Fresh Near You",
    sectionIcon:  "leaf-outline",
    items: [
      { id:"gr1", name:"Laxmi Vegetable Mart",    category:"Vegetables",   area:"Wakad",        icon:"leaf-outline",        color:"#D1FAE5", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"gr2", name:"Amrut Dairy & Sweets",    category:"Dairy",        area:"Kothrud",      icon:"cafe-outline",        color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"gr3", name:"Pune Fresh Fruits",       category:"Fruits",       area:"Deccan",       icon:"nutrition-outline",   color:"#FEE2E2", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"gr4", name:"More Supermarket",        category:"Supermarket",  area:"Aundh",        icon:"cart-outline",        color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"gr5", name:"D-Mart Grocery",          category:"Grocery",      area:"Baner",        icon:"bag-outline",         color:"#EDE9FE", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"gr6", name:"Big Basket Local",        category:"Online Store", area:"Hinjewadi",    icon:"bicycle-outline",     color:"#ECFDF5", badge:"Fast",    badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
    ],
  },

  // ── FASHION ─────────────────────────────────────────────────
  fashion: {
    banners: [
      {
        id:       "f1",
        title:    "Ethnic Wear",
        subtitle: "Sarees, kurtas, lehengas & sherwanis from local boutiques.",
        tag:      "New Arrivals",
        bg:       "#660033",
        accent:   "#FBCFE8",
        icon:     "shirt-outline",
      },
      {
        id:       "f2",
        title:    "Western Styles",
        subtitle: "Jeans, tops, dresses & accessories — latest trends at local prices.",
        tag:      "Up to 40% Off",
        bg:       "#7C2D44",
        accent:   "#FDE8EF",
        icon:     "happy-outline",
      },
    ],
    sectionTitle: "Trending Styles",
    sectionIcon:  "sparkles-outline",
    items: [
      { id:"fa1", name:"Puneri Paithani House",   category:"Ethnic Wear",  area:"Laxmi Road",   icon:"shirt-outline",       color:"#FCE7F3", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"fa2", name:"Westside Clothing",       category:"Western",      area:"FC Road",      icon:"accessibility-outline",color:"#EDE9FE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"fa3", name:"Zari Boutique",           category:"Bridal",       area:"Peth Area",    icon:"diamond-outline",     color:"#FEF3C7", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"fa4", name:"Kids Fashion World",      category:"Kids Wear",    area:"Camp",         icon:"balloon-outline",     color:"#DBEAFE", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"fa5", name:"Osha Footwear",           category:"Footwear",     area:"MG Road",      icon:"walk-outline",        color:"#DCFCE7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"fa6", name:"Trenz Men's Studio",      category:"Men's Wear",   area:"Koregaon Pk",  icon:"man-outline",         color:"#FFEDD5", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
    ],
  },

  // ── MOBILES ─────────────────────────────────────────────────
  mobiles: {
    banners: [
      {
        id:       "m1",
        title:    "New Launches",
        subtitle: "Latest smartphones from Samsung, Apple, Vivo, Realme & more.",
        tag:      "Exchange Offers",
        bg:       "#0437B1",
        accent:   "#BFDBFE",
        icon:     "phone-portrait-outline",
      },
      {
        id:       "m2",
        title:    "Best Deals",
        subtitle: "Certified refurbished phones & accessories at unbeatable prices.",
        tag:      "Up to 30% Off",
        bg:       "#1E3A8A",
        accent:   "#DBEAFE",
        icon:     "pricetag-outline",
      },
    ],
    sectionTitle: "Mobile Shops Near You",
    sectionIcon:  "phone-portrait-outline",
    items: [
      { id:"mo1", name:"Sangeetha Mobiles",       category:"Mobile Store", area:"Wakad",        icon:"phone-portrait-outline",color:"#DBEAFE",badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"mo2", name:"Reliance Digital",        category:"Electronics",  area:"Baner",        icon:"storefront-outline",  color:"#EDE9FE", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"mo3", name:"iZone Apple Reseller",    category:"Apple Store",  area:"Koregaon Pk",  icon:"logo-apple",          color:"#F3F4F6", badge:"Premium", badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"mo4", name:"Poorvika Mobiles",        category:"Multi-Brand",  area:"Hinjewadi",    icon:"phone-portrait-outline",color:"#DCFCE7",badge:"Open",   badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"mo5", name:"Mobile Accessories Hub",  category:"Accessories",  area:"Deccan",       icon:"headset-outline",     color:"#FEF3C7", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"mo6", name:"Second Life Mobiles",     category:"Refurbished",  area:"Camp",         icon:"refresh-outline",     color:"#FFEDD5", badge:"Budget",  badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
    ],
  },

  // ── ELECTRONICS ─────────────────────────────────────────────
  electronics: {
    banners: [
      {
        id:       "e1",
        title:    "Smart Home",
        subtitle: "Smart TVs, speakers, routers & IoT devices from top brands.",
        tag:      "Best Sellers",
        bg:       "#5F75B1",
        accent:   "#E0E7FF",
        icon:     "home-outline",
      },
      {
        id:       "e2",
        title:    "Audio & Laptops",
        subtitle: "Headphones, earbuds, laptops & tablets — all in one stop.",
        tag:      "EMI Available",
        bg:       "#3D5A99",
        accent:   "#C7D2FE",
        icon:     "headset-outline",
      },
    ],
    sectionTitle: "Electronics Near You",
    sectionIcon:  "hardware-chip-outline",
    items: [
      { id:"el1", name:"Croma Electronics",       category:"Electronics",  area:"Aundh",        icon:"tv-outline",          color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"el2", name:"Vijay Sales",             category:"Multi-Brand",  area:"Baner",        icon:"storefront-outline",  color:"#EDE9FE", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"el3", name:"Laptop World",            category:"Laptops",      area:"FC Road",      icon:"laptop-outline",      color:"#F3F4F6", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"el4", name:"Sound Zone Audio",        category:"Audio",        area:"Kothrud",      icon:"musical-notes-outline",color:"#FCE7F3",badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"el5", name:"Gadget Hub",              category:"Gadgets",      area:"Wakad",        icon:"hardware-chip-outline",color:"#FEF3C7",badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"el6", name:"Camera Point",            category:"Cameras",      area:"Camp",         icon:"camera-outline",      color:"#DCFCE7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
    ],
  },

  // ── APPLIANCES ──────────────────────────────────────────────
  appliances: {
    banners: [
      {
        id:       "ap1",
        title:    "Kitchen Appliances",
        subtitle: "Mixer grinders, refrigerators, washing machines & more.",
        tag:      "5-Star Rated",
        bg:       "#2C5282",
        accent:   "#BEE3F8",
        icon:     "restaurant-outline",
      },
      {
        id:       "ap2",
        title:    "AC & Coolers",
        subtitle: "Beat the heat — ACs, air coolers & fans at the best prices.",
        tag:      "Installation Free",
        bg:       "#1A3A5C",
        accent:   "#90CDF4",
        icon:     "snow-outline",
      },
    ],
    sectionTitle: "Appliance Stores Near You",
    sectionIcon:  "tv-outline",
    items: [
      { id:"ap1", name:"LG Service & Sales",      category:"Appliances",   area:"Aundh",        icon:"tv-outline",          color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ap2", name:"Samsung Smart Plaza",     category:"Multi-Brand",  area:"Baner",        icon:"storefront-outline",  color:"#EDE9FE", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"ap3", name:"Whirlpool Showroom",      category:"White Goods",  area:"Kothrud",      icon:"water-outline",       color:"#DCFCE7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ap4", name:"Kitchen & More",          category:"Kitchen",      area:"Wakad",        icon:"restaurant-outline",  color:"#FEF3C7", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"ap5", name:"Cool Zone AC",            category:"AC & Coolers", area:"Hinjewadi",    icon:"snow-outline",        color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ap6", name:"Bosch Service Center",    category:"Service",      area:"Camp",         icon:"construct-outline",   color:"#FFEDD5", badge:"Trusted", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
    ],
  },

  // ── BEAUTY ──────────────────────────────────────────────────
  beauty: {
    banners: [
      {
        id:       "be1",
        title:    "Skincare & More",
        subtitle: "Premium skincare, face care & grooming products from local stores.",
        tag:      "Cruelty Free",
        bg:       "#402A62",
        accent:   "#E9D8FD",
        icon:     "flower-outline",
      },
      {
        id:       "be2",
        title:    "Makeup & Hair",
        subtitle: "Lipsticks, foundations, hair oils & serums — all brands available.",
        tag:      "Up to 35% Off",
        bg:       "#553C7B",
        accent:   "#FAF5FF",
        icon:     "color-palette-outline",
      },
    ],
    sectionTitle: "Beauty & Care Near You",
    sectionIcon:  "flower-outline",
    items: [
      { id:"be1", name:"Nykaa Beauty Store",      category:"Cosmetics",    area:"FC Road",      icon:"flower-outline",      color:"#FCE7F3", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"be2", name:"Forest Essentials",       category:"Skincare",     area:"Koregaon Pk",  icon:"leaf-outline",        color:"#DCFCE7", badge:"Premium", badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"be3", name:"Lakme Salon",             category:"Salon",        area:"Baner",        icon:"cut-outline",         color:"#EDE9FE", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"be4", name:"Purplle Cosmetics",       category:"Makeup",       area:"Aundh",        icon:"color-palette-outline",color:"#FEF3C7",badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"be5", name:"Health & Glow",           category:"Wellness",     area:"Wakad",        icon:"heart-outline",       color:"#FEE2E2", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"be6", name:"Mamaearth Store",         category:"Natural Care", area:"Hinjewadi",    icon:"sparkles-outline",    color:"#ECFDF5", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
    ],
  },

  // ── SPORTS ──────────────────────────────────────────────────
  sports: {
    banners: [
      {
        id:       "sp1",
        title:    "Cricket & More",
        subtitle: "Bats, balls, kits, gloves & all cricket essentials from local shops.",
        tag:      "Match Ready",
        bg:       "#B45309",
        accent:   "#FDE68A",
        icon:     "baseball-outline",
      },
      {
        id:       "sp2",
        title:    "Fitness Gear",
        subtitle: "Dumbbells, resistance bands, yoga mats & gym supplements.",
        tag:      "New Stock",
        bg:       "#92400E",
        accent:   "#FEF3C7",
        icon:     "barbell-outline",
      },
    ],
    sectionTitle: "Sports Stores Near You",
    sectionIcon:  "football-outline",
    items: [
      { id:"sp1", name:"Sports Villa",            category:"Multi-Sport",  area:"FC Road",      icon:"football-outline",    color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"sp2", name:"Cricket Express",         category:"Cricket",      area:"Deccan",       icon:"baseball-outline",    color:"#DCFCE7", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"sp3", name:"Decathlon",               category:"All Sports",   area:"Wakad",        icon:"bicycle-outline",     color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"sp4", name:"Fitness Factory",         category:"Gym Gear",     area:"Baner",        icon:"barbell-outline",     color:"#FFEDD5", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"sp5", name:"Yoga & Zen",              category:"Yoga",         area:"Kothrud",      icon:"body-outline",        color:"#EDE9FE", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"sp6", name:"Swimming Gear Shop",      category:"Aquatics",     area:"Aundh",        icon:"water-outline",       color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
    ],
  },

  // ── HOME ────────────────────────────────────────────────────
  home: {
    banners: [
      {
        id:       "ho1",
        title:    "Home Decor",
        subtitle: "Cushions, curtains, wall art & lighting for your perfect home.",
        tag:      "New Collection",
        bg:       "#7C4438",
        accent:   "#FECACA",
        icon:     "home-outline",
      },
      {
        id:       "ho2",
        title:    "Kitchen & Dining",
        subtitle: "Cookware, cutlery, storage & dining essentials at great prices.",
        tag:      "Buy 2 Get 1",
        bg:       "#92400E",
        accent:   "#FDE68A",
        icon:     "restaurant-outline",
      },
    ],
    sectionTitle: "Home & Living Near You",
    sectionIcon:  "home-outline",
    items: [
      { id:"ho1", name:"Hometown Furnishings",    category:"Home Decor",   area:"Baner",        icon:"home-outline",        color:"#FFEDD5", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ho2", name:"Pepperfry Studio",        category:"Furniture",    area:"Koregaon Pk",  icon:"bed-outline",         color:"#FEF3C7", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"ho3", name:"Fabindia Home",           category:"Ethnic Decor", area:"FC Road",      icon:"color-palette-outline",color:"#FCE7F3",badge:"Premium", badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"ho4", name:"IKEA Pune",               category:"Flat-Pack",    area:"Wakad",        icon:"construct-outline",   color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ho5", name:"Good Earth Decor",        category:"Artisan",      area:"Camp",         icon:"sparkles-outline",    color:"#DCFCE7", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"ho6", name:"Kitchen Essentials",      category:"Cookware",     area:"Aundh",        icon:"restaurant-outline",  color:"#FEE2E2", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
    ],
  },

  // ── PHARMACY ────────────────────────────────────────────────
  pharmacy: {
    banners: [
      {
        id:       "ph1",
        title:    "Medicines Fast",
        subtitle: "Prescription & OTC medicines from verified local pharmacies.",
        tag:      "Verified Stores",
        bg:       "#1D4746",
        accent:   "#A7F3D0",
        icon:     "medkit-outline",
      },
      {
        id:       "ph2",
        title:    "Health Supplements",
        subtitle: "Vitamins, protein powders, health drinks & wellness products.",
        tag:      "Genuine Products",
        bg:       "#134E4A",
        accent:   "#CCFBF1",
        icon:     "fitness-outline",
      },
    ],
    sectionTitle: "Pharmacies Near You",
    sectionIcon:  "medkit-outline",
    items: [
      { id:"ph1", name:"Apollo Pharmacy",         category:"Pharmacy",     area:"Baner",        icon:"medkit-outline",      color:"#FEE2E2", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ph2", name:"MedPlus",                 category:"Pharmacy",     area:"Wakad",        icon:"heart-outline",       color:"#DCFCE7", badge:"24/7",    badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"ph3", name:"Sarvottam Medical",       category:"Local Pharma", area:"Kothrud",      icon:"medical-outline",     color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ph4", name:"Netmeds Store",           category:"Online+Store", area:"Aundh",        icon:"bag-outline",         color:"#EDE9FE", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"ph5", name:"GNC Nutrition",           category:"Supplements",  area:"Koregaon Pk",  icon:"fitness-outline",     color:"#FFEDD5", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"ph6", name:"LifeSpring Hospital Phm", category:"Hospital",     area:"Camp",         icon:"business-outline",    color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
    ],
  },

  // ── FOOD & DRINK ─────────────────────────────────────────────
  food: {
    banners: [
      {
        id:       "fo1",
        title:    "Order Local Food",
        subtitle: "Misal, vada pav, biryani & more from restaurants near you.",
        tag:      "30 Min Delivery",
        bg:       "#6F4C81",
        accent:   "#E9D8FD",
        icon:     "restaurant-outline",
      },
      {
        id:       "fo2",
        title:    "Beverages & Drinks",
        subtitle: "Fresh juices, chai, coffee, lassi & soft drinks from local shops.",
        tag:      "Live Counters",
        bg:       "#553C7B",
        accent:   "#FAF5FF",
        icon:     "wine-outline",
      },
    ],
    sectionTitle: "Food Near You",
    sectionIcon:  "restaurant-outline",
    items: [
      { id:"fo1", name:"Cafe Goodluck",           category:"Cafe",         area:"Deccan",       icon:"cafe-outline",        color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"fo2", name:"Vaishali Restaurant",     category:"Restaurant",   area:"FC Road",      icon:"restaurant-outline",  color:"#FFEDD5", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"fo3", name:"Shabree Misal",           category:"Misal Pav",    area:"Kothrud",      icon:"fast-food-outline",   color:"#FEE2E2", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"fo4", name:"Juice Junction",          category:"Juice Bar",    area:"Aundh",        icon:"wine-outline",        color:"#DCFCE7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"fo5", name:"Chitale Bandhu",          category:"Sweet & Snack",area:"Deccan",       icon:"gift-outline",        color:"#FCE7F3", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"fo6", name:"Barbeque Nation",         category:"BBQ",          area:"Wakad",        icon:"bonfire-outline",     color:"#FFEDD5", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
    ],
  },

  // ── BOOKS ───────────────────────────────────────────────────
  books: {
    banners: [
      {
        id:       "bo1",
        title:    "Books & Stationery",
        subtitle: "Academic, fiction, regional & competitive exam books from local shops.",
        tag:      "School Season",
        bg:       "#933A00",
        accent:   "#FEF3C7",
        icon:     "book-outline",
      },
      {
        id:       "bo2",
        title:    "Art & Office",
        subtitle: "Stationery, art supplies, pens & craft materials at student prices.",
        tag:      "Bulk Discounts",
        bg:       "#7C3100",
        accent:   "#FFEDD5",
        icon:     "create-outline",
      },
    ],
    sectionTitle: "Book Shops Near You",
    sectionIcon:  "book-outline",
    items: [
      { id:"bk1", name:"Manney's Book Store",     category:"Books",        area:"MG Road",      icon:"book-outline",        color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"bk2", name:"Crossword Books",         category:"Books",        area:"Aundh",        icon:"library-outline",     color:"#DBEAFE", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"bk3", name:"Academic Publishers",     category:"Academic",     area:"Camp",         icon:"school-outline",      color:"#DCFCE7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"bk4", name:"Art Mart Stationery",     category:"Stationery",   area:"Deccan",       icon:"create-outline",      color:"#FCE7F3", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"bk5", name:"Sapna Book House",        category:"Books",        area:"FC Road",      icon:"book-outline",        color:"#FEE2E2", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"bk6", name:"Landmark Books",          category:"Books & More", area:"Wakad",        icon:"storefront-outline",  color:"#EDE9FE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
    ],
  },

  // ── ICE CREAM ───────────────────────────────────────────────
  icecream: {
    banners: [
      {
        id:       "ic1",
        title:    "Cool Flavours",
        subtitle: "From classic vanilla to exotic flavours — scoops, cones & cups.",
        tag:      "50+ Flavours",
        bg:       "#803E96",
        accent:   "#F3E8FF",
        icon:     "ice-cream-outline",
      },
      {
        id:       "ic2",
        title:    "Desserts & More",
        subtitle: "Ice cream cakes, waffles, sundaes & frozen desserts near you.",
        tag:      "Family Pack",
        bg:       "#6B21A8",
        accent:   "#EDE9FE",
        icon:     "gift-outline",
      },
    ],
    sectionTitle: "Ice Cream Near You",
    sectionIcon:  "ice-cream-outline",
    items: [
      { id:"ic1", name:"Meridian Ice Cream",      category:"Ice Cream",    area:"FC Road",      icon:"ice-cream-outline",   color:"#FCE7F3", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ic2", name:"Naturals Ice Cream",      category:"Natural",      area:"Deccan",       icon:"leaf-outline",        color:"#DCFCE7", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"ic3", name:"Baskin Robbins",          category:"Parlour",      area:"Koregaon Pk",  icon:"ice-cream-outline",   color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ic4", name:"Amul Scooping Parlour",   category:"Amul",         area:"Kothrud",      icon:"storefront-outline",  color:"#FEF3C7", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"ic5", name:"Haagen-Dazs",             category:"Premium",      area:"Camp",         icon:"gift-outline",        color:"#EDE9FE", badge:"Premium", badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"ic6", name:"Cream Bell",              category:"Ice Cream",    area:"Wakad",        icon:"ice-cream-outline",   color:"#FCE7F3", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
    ],
  },

  // ── FURNITURE ───────────────────────────────────────────────
  furniture: {
    banners: [
      {
        id:       "fu1",
        title:    "Living & Bedroom",
        subtitle: "Sofas, beds, wardrobes & dining sets crafted for Indian homes.",
        tag:      "Easy EMI",
        bg:       "#6D4924",
        accent:   "#FEF3C7",
        icon:     "bed-outline",
      },
      {
        id:       "fu2",
        title:    "Office Furniture",
        subtitle: "Ergonomic chairs, desks, storage & modular office solutions.",
        tag:      "Bulk Orders",
        bg:       "#78350F",
        accent:   "#FFEDD5",
        icon:     "desktop-outline",
      },
    ],
    sectionTitle: "Furniture Stores Near You",
    sectionIcon:  "bed-outline",
    items: [
      { id:"fu1", name:"Urban Ladder Studio",     category:"Furniture",    area:"Baner",        icon:"bed-outline",         color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"fu2", name:"Godrej Interio",          category:"Home Furn.",   area:"Aundh",        icon:"storefront-outline",  color:"#DBEAFE", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"fu3", name:"Wooden Street",           category:"Solid Wood",   area:"Wakad",        icon:"construct-outline",   color:"#FFEDD5", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"fu4", name:"Local Carpenter House",   category:"Custom",       area:"Kothrud",      icon:"hammer-outline",      color:"#FEE2E2", badge:"Custom",  badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"fu5", name:"Home Centre",             category:"Multi-Brand",  area:"Camp",         icon:"home-outline",        color:"#DCFCE7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"fu6", name:"Chair Man Ergonomics",    category:"Office",       area:"Hinjewadi",    icon:"desktop-outline",     color:"#EDE9FE", badge:"Premium", badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
    ],
  },

  // ── HARDWARE & TOOLS ─────────────────────────────────────────
  hardware: {
    banners: [
      {
        id:       "hw1",
        title:    "Tools & Hardware",
        subtitle: "Drills, fasteners, plumbing, electrical & construction supplies.",
        tag:      "Trade Prices",
        bg:       "#374151",
        accent:   "#E5E7EB",
        icon:     "hammer-outline",
      },
      {
        id:       "hw2",
        title:    "Paints & Electrical",
        subtitle: "Asian Paints, Berger, switches, wires & fittings from local shops.",
        tag:      "Bulk Discount",
        bg:       "#1F2937",
        accent:   "#D1D5DB",
        icon:     "color-fill-outline",
      },
    ],
    sectionTitle: "Hardware Stores Near You",
    sectionIcon:  "hammer-outline",
    items: [
      { id:"hw1", name:"Buildmart Hardware",      category:"Hardware",     area:"Wakad",        icon:"hammer-outline",      color:"#F3F4F6", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"hw2", name:"Asian Paints Studio",     category:"Paints",       area:"Baner",        icon:"color-fill-outline",  color:"#FEE2E2", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"hw3", name:"Electrical World",        category:"Electrical",   area:"Kothrud",      icon:"flash-outline",       color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"hw4", name:"Plumbing & Pipes",        category:"Plumbing",     area:"Camp",         icon:"water-outline",       color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"hw5", name:"Toolbox Pro",             category:"Power Tools",  area:"Aundh",        icon:"construct-outline",   color:"#FFEDD5", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"hw6", name:"SafetyFirst Supplies",    category:"Safety",       area:"Hinjewadi",    icon:"shield-outline",      color:"#DCFCE7", badge:"Trusted", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
    ],
  },

  // ── MISCELLANEOUS ────────────────────────────────────────────
  misc: {
    banners: [
      {
        id:       "ms1",
        title:    "Pets & Baby Care",
        subtitle: "Pet food, toys, baby essentials & gifting from local stores.",
        tag:      "All in One",
        bg:       "#4A4A6A",
        accent:   "#E0E7FF",
        icon:     "heart-outline",
      },
      {
        id:       "ms2",
        title:    "Gifts & Travel",
        subtitle: "Unique gifts, travel accessories, luggage & seasonal collections.",
        tag:      "New Arrivals",
        bg:       "#3D3D5C",
        accent:   "#C7D2FE",
        icon:     "gift-outline",
      },
    ],
    sectionTitle: "More Stores Near You",
    sectionIcon:  "ellipsis-horizontal-circle-outline",
    items: [
      { id:"ms1", name:"PetZone Store",           category:"Pet Supplies",  area:"Baner",       icon:"paw-outline",         color:"#FEF3C7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ms2", name:"BabyFirst Shop",          category:"Baby Care",     area:"Wakad",       icon:"balloon-outline",     color:"#FCE7F3", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"ms3", name:"The Gift Studio",         category:"Gifting",       area:"Camp",        icon:"gift-outline",        color:"#EDE9FE", badge:"New",     badgeBg:"#DBEAFE", badgeColor:"#1D4ED8" },
      { id:"ms4", name:"VIP Luggage Store",       category:"Travel",        area:"FC Road",     icon:"airplane-outline",    color:"#DBEAFE", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
      { id:"ms5", name:"Archies Gifting",         category:"Cards & Gifts", area:"Deccan",      icon:"heart-outline",       color:"#FEE2E2", badge:"Popular", badgeBg:"#FFEDD5", badgeColor:"#C2410C" },
      { id:"ms6", name:"Hobbycraft India",        category:"Art & Craft",   area:"Kothrud",     icon:"brush-outline",       color:"#DCFCE7", badge:"Open",    badgeBg:"#DCFCE7", badgeColor:"#15803D" },
    ],
  },
};
