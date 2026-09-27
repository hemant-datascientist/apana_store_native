// ============================================================
// CATEGORY FEED DATA — Apana Store (Customer App)
//
// Each product category gets its own banner carousel. Banners carry NO
// tag/pill claim (§19.8) — every one used to assert a platform-wide
// guarantee nothing backs ("Up to 20% Off", "Free Delivery", "Verified
// Stores", "5-Star Rated", "Genuine Products", "30 Min Delivery",
// "Cruelty Free"...). The only real discount is a seller's own stop-loss
// deal, set per shop, never category-wide; there is no delivery SLA, no
// store-verification program, no ratings system behind any of these. Title
// + subtitle stay as plain category-intro copy — not a measurable claim.
//
// A per-category `items` array of ~90 named shops (real chains mixed with
// invented ones, fake "Open"/"Popular" badges) was removed 2026-09 — dead
// code nothing ever rendered, kept only as a landmine for whoever wired it
// up next. Real nearby shops live in the Stores discovery mode; real
// products for this category render via CategoryLiveProducts.
//
// Replace with GET /customer/category/:key when backend ready.
// ============================================================

import { Banner } from "./homeData";
import { assetImg } from "../lib/assetImg";

export interface CategoryFeed {
  banners:      Banner[];
  sectionTitle: string;
  sectionIcon:  string;   // Ionicons glyph
}

export const CATEGORY_FEEDS: Record<string, CategoryFeed> = {

  // ── GROCERY ─────────────────────────────────────────────────
  grocery: {
    banners: [
      {
        id:       "g1",
        title:    "Fresh Every Day",
        subtitle: "Farm-fresh vegetables, fruits & dairy delivered fast from local mandis.",
        bg:       "#026451",
        accent:   "#6EE7B7",
        icon:     "basket-outline",
        imageUrl: assetImg("category/banners/grocery_fresh.png"),
      },
      {
        id:       "g2",
        title:    "Daily Essentials",
        subtitle: "Rice, dal, oil, spices & packaged foods from trusted local stores.",
        bg:       "#065F46",
        accent:   "#A7F3D0",
        icon:     "storefront-outline",
        imageUrl: assetImg("category/banners/grocery_essentials.png"),
      },
    ],
    sectionTitle: "Fresh Near You",
    sectionIcon:  "leaf-outline",
  },

  // ── FASHION ─────────────────────────────────────────────────
  fashion: {
    banners: [
      {
        id:       "f1",
        title:    "Ethnic Wear",
        subtitle: "Sarees, kurtas, lehengas & sherwanis from local boutiques.",
        bg:       "#660033",
        accent:   "#FBCFE8",
        icon:     "shirt-outline",
        imageUrl: assetImg("category/banners/fashion_ethnic.png"),
      },
      {
        id:       "f2",
        title:    "Western Styles",
        subtitle: "Jeans, tops, dresses & accessories — latest trends at local prices.",
        bg:       "#7C2D44",
        accent:   "#FDE8EF",
        icon:     "happy-outline",
        imageUrl: assetImg("category/banners/fashion_western.png"),
      },
    ],
    sectionTitle: "Trending Styles",
    sectionIcon:  "sparkles-outline",
  },

  // ── MOBILES ─────────────────────────────────────────────────
  mobiles: {
    banners: [
      {
        id:       "m1",
        title:    "New Launches",
        subtitle: "Latest smartphones from Samsung, Apple, Vivo, Realme & more.",
        bg:       "#0437B1",
        accent:   "#BFDBFE",
        icon:     "phone-portrait-outline",
        imageUrl: assetImg("category/banners/mobiles_new.png"),
      },
      {
        id:       "m2",
        title:    "Best Deals",
        subtitle: "Certified refurbished phones & accessories at unbeatable prices.",
        bg:       "#1E3A8A",
        accent:   "#DBEAFE",
        icon:     "pricetag-outline",
        imageUrl: assetImg("category/banners/mobiles_deals.png"),
      },
    ],
    sectionTitle: "Mobile Shops Near You",
    sectionIcon:  "phone-portrait-outline",
  },

  // ── ELECTRONICS ─────────────────────────────────────────────
  electronics: {
    banners: [
      {
        id:       "e1",
        title:    "Smart Home",
        subtitle: "Smart TVs, speakers, routers & IoT devices from top brands.",
        bg:       "#5F75B1",
        accent:   "#E0E7FF",
        icon:     "home-outline",
        imageUrl: assetImg("category/banners/electronics_smart.png"),
      },
      {
        id:       "e2",
        title:    "Audio & Laptops",
        subtitle: "Headphones, earbuds, laptops & tablets — all in one stop.",
        bg:       "#3D5A99",
        accent:   "#C7D2FE",
        icon:     "headset-outline",
        imageUrl: assetImg("category/banners/electronics_audio.png"),
      },
    ],
    sectionTitle: "Electronics Near You",
    sectionIcon:  "hardware-chip-outline",
  },

  // ── APPLIANCES ──────────────────────────────────────────────
  appliances: {
    banners: [
      {
        id:       "ap1",
        title:    "Kitchen Appliances",
        subtitle: "Mixer grinders, refrigerators, washing machines & more.",
        bg:       "#2C5282",
        accent:   "#BEE3F8",
        icon:     "restaurant-outline",
        imageUrl: assetImg("category/banners/appliances_kitchen.png"),
      },
      {
        id:       "ap2",
        title:    "AC & Coolers",
        subtitle: "Beat the heat — ACs, air coolers & fans at the best prices.",
        bg:       "#1A3A5C",
        accent:   "#90CDF4",
        icon:     "snow-outline",
        imageUrl: assetImg("category/banners/appliances_ac.png"),
      },
    ],
    sectionTitle: "Appliance Stores Near You",
    sectionIcon:  "tv-outline",
  },

  // ── BEAUTY ──────────────────────────────────────────────────
  beauty: {
    banners: [
      {
        id:       "be1",
        title:    "Skincare & More",
        subtitle: "Premium skincare, face care & grooming products from local stores.",
        bg:       "#402A62",
        accent:   "#E9D8FD",
        icon:     "flower-outline",
        imageUrl: assetImg("category/banners/beauty_skincare.png"),
      },
      {
        id:       "be2",
        title:    "Makeup & Hair",
        subtitle: "Lipsticks, foundations, hair oils & serums — all brands available.",
        bg:       "#553C7B",
        accent:   "#FAF5FF",
        icon:     "color-palette-outline",
        imageUrl: assetImg("category/banners/beauty_makeup.png"),
      },
    ],
    sectionTitle: "Beauty & Care Near You",
    sectionIcon:  "flower-outline",
  },

  // ── SPORTS ──────────────────────────────────────────────────
  sports: {
    banners: [
      {
        id:       "sp1",
        title:    "Cricket & More",
        subtitle: "Bats, balls, kits, gloves & all cricket essentials from local shops.",
        bg:       "#B45309",
        accent:   "#FDE68A",
        icon:     "baseball-outline",
        imageUrl: assetImg("category/banners/sports_cricket.png"),
      },
      {
        id:       "sp2",
        title:    "Fitness Gear",
        subtitle: "Dumbbells, resistance bands, yoga mats & gym supplements.",
        bg:       "#92400E",
        accent:   "#FEF3C7",
        icon:     "barbell-outline",
        imageUrl: assetImg("category/banners/sports_fitness.png"),
      },
    ],
    sectionTitle: "Sports Stores Near You",
    sectionIcon:  "football-outline",
  },

  // ── HOME ────────────────────────────────────────────────────
  home: {
    banners: [
      {
        id:       "ho1",
        title:    "Home Decor",
        subtitle: "Cushions, curtains, wall art & lighting for your perfect home.",
        bg:       "#7C4438",
        accent:   "#FECACA",
        icon:     "home-outline",
        imageUrl: assetImg("category/banners/home_decor.png"),
      },
      {
        id:       "ho2",
        title:    "Kitchen & Dining",
        subtitle: "Cookware, cutlery, storage & dining essentials at great prices.",
        bg:       "#92400E",
        accent:   "#FDE68A",
        icon:     "restaurant-outline",
        imageUrl: assetImg("category/banners/home_kitchen.png"),
      },
    ],
    sectionTitle: "Home & Living Near You",
    sectionIcon:  "home-outline",
  },

  // ── PHARMACY ────────────────────────────────────────────────
  pharmacy: {
    banners: [
      {
        id:       "ph1",
        title:    "Medicines Fast",
        subtitle: "Prescription & OTC medicines from local pharmacies near you.",
        bg:       "#1D4746",
        accent:   "#A7F3D0",
        icon:     "medkit-outline",
        imageUrl: assetImg("category/banners/pharmacy_medicines.png"),
      },
      {
        id:       "ph2",
        title:    "Health Supplements",
        subtitle: "Vitamins, protein powders, health drinks & wellness products.",
        bg:       "#134E4A",
        accent:   "#CCFBF1",
        icon:     "fitness-outline",
        imageUrl: assetImg("category/banners/pharmacy_supplements.png"),
      },
    ],
    sectionTitle: "Pharmacies Near You",
    sectionIcon:  "medkit-outline",
  },

  // ── FOOD & DRINK ─────────────────────────────────────────────
  food: {
    banners: [
      {
        id:       "fo1",
        title:    "Order Local Food",
        subtitle: "Misal, vada pav, biryani & more from restaurants near you.",
        bg:       "#6F4C81",
        accent:   "#E9D8FD",
        icon:     "restaurant-outline",
        imageUrl: assetImg("category/banners/food_order.png"),
      },
      {
        id:       "fo2",
        title:    "Beverages & Drinks",
        subtitle: "Fresh juices, chai, coffee, lassi & soft drinks from local shops.",
        bg:       "#553C7B",
        accent:   "#FAF5FF",
        icon:     "wine-outline",
        imageUrl: assetImg("category/banners/food_beverages.png"),
      },
    ],
    sectionTitle: "Food Near You",
    sectionIcon:  "restaurant-outline",
  },

  // ── BOOKS ───────────────────────────────────────────────────
  books: {
    banners: [
      {
        id:       "bo1",
        title:    "Books & Stationery",
        subtitle: "Academic, fiction, regional & competitive exam books from local shops.",
        bg:       "#933A00",
        accent:   "#FEF3C7",
        icon:     "book-outline",
        imageUrl: assetImg("category/banners/books_stationery.png"),
      },
      {
        id:       "bo2",
        title:    "Art & Office",
        subtitle: "Stationery, art supplies, pens & craft materials for students.",
        bg:       "#7C3100",
        accent:   "#FFEDD5",
        icon:     "create-outline",
        imageUrl: assetImg("category/banners/books_art.png"),
      },
    ],
    sectionTitle: "Book Shops Near You",
    sectionIcon:  "book-outline",
  },

  // ── ICE CREAM ───────────────────────────────────────────────
  icecream: {
    banners: [
      {
        id:       "ic1",
        title:    "Cool Flavours",
        subtitle: "From classic vanilla to exotic flavours — scoops, cones & cups.",
        bg:       "#803E96",
        accent:   "#F3E8FF",
        icon:     "ice-cream-outline",
        imageUrl: assetImg("category/banners/icecream_flavours.png"),
      },
      {
        id:       "ic2",
        title:    "Desserts & More",
        subtitle: "Ice cream cakes, waffles, sundaes & frozen desserts near you.",
        bg:       "#6B21A8",
        accent:   "#EDE9FE",
        icon:     "gift-outline",
        imageUrl: assetImg("category/banners/icecream_desserts.png"),
      },
    ],
    sectionTitle: "Ice Cream Near You",
    sectionIcon:  "ice-cream-outline",
  },

  // ── FURNITURE ───────────────────────────────────────────────
  furniture: {
    banners: [
      {
        id:       "fu1",
        title:    "Living & Bedroom",
        subtitle: "Sofas, beds, wardrobes & dining sets crafted for Indian homes.",
        bg:       "#6D4924",
        accent:   "#FEF3C7",
        icon:     "bed-outline",
        imageUrl: assetImg("category/banners/furniture_living.png"),
      },
      {
        id:       "fu2",
        title:    "Office Furniture",
        subtitle: "Ergonomic chairs, desks, storage & modular office solutions.",
        bg:       "#78350F",
        accent:   "#FFEDD5",
        icon:     "desktop-outline",
        imageUrl: assetImg("category/banners/furniture_office.png"),
      },
    ],
    sectionTitle: "Furniture Stores Near You",
    sectionIcon:  "bed-outline",
  },

  // ── HARDWARE & TOOLS ─────────────────────────────────────────
  hardware: {
    banners: [
      {
        id:       "hw1",
        title:    "Tools & Hardware",
        subtitle: "Drills, fasteners, plumbing, electrical & construction supplies.",
        bg:       "#374151",
        accent:   "#E5E7EB",
        icon:     "hammer-outline",
        imageUrl: assetImg("category/banners/hardware_tools.png"),
      },
      {
        id:       "hw2",
        title:    "Paints & Electrical",
        subtitle: "Asian Paints, Berger, switches, wires & fittings from local shops.",
        bg:       "#1F2937",
        accent:   "#D1D5DB",
        icon:     "color-fill-outline",
        imageUrl: assetImg("category/banners/hardware_paints.png"),
      },
    ],
    sectionTitle: "Hardware Stores Near You",
    sectionIcon:  "hammer-outline",
  },

  // ── MISCELLANEOUS ────────────────────────────────────────────
  misc: {
    banners: [
      {
        id:       "ms1",
        title:    "Pets & Baby Care",
        subtitle: "Pet food, toys, baby essentials & gifting from local stores.",
        bg:       "#4A4A6A",
        accent:   "#E0E7FF",
        icon:     "heart-outline",
        imageUrl: assetImg("category/banners/misc_pets.png"),
      },
      {
        id:       "ms2",
        title:    "Gifts & Travel",
        subtitle: "Unique gifts, travel accessories, luggage & seasonal collections.",
        bg:       "#3D3D5C",
        accent:   "#C7D2FE",
        icon:     "gift-outline",
        imageUrl: assetImg("category/banners/misc_gifts.png"),
      },
    ],
    sectionTitle: "More Stores Near You",
    sectionIcon:  "ellipsis-horizontal-circle-outline",
  },
};
