// ============================================================
// MAP PRODUCT DATA — Apana Store (Map View · Find Products)
//
// In "Find Products" mode the customer searches a product (e.g. "maggi"),
// picks the exact one, and the map narrows to the stores that stock it. This
// is the product → store availability index, mocked FE-first.
//
// availableStoreIds reference the StoreMapPin ids in nearbyMapData (s1–s5).
//
// Backend: replace searchProducts() with
//   GET /api/customer/products/search?q=         → MapProduct[]
// and availability with
//   GET /api/customer/products/:id/stores?lat&lng → storeIds (live stock)
// ============================================================

export interface MapProduct {
  id:                string;
  name:              string;
  variant?:          string;   // pack / size, e.g. "70 g"
  brand?:            string;
  icon:              string;   // Ionicons glyph
  iconBg:            string;
  availableStoreIds: string[]; // StoreMapPin ids stocking this product
}

export const MAP_PRODUCTS: MapProduct[] = [
  { id: "p-maggi-masala",  name: "Maggi Masala Noodles",  variant: "70 g",   brand: "Nestlé",   icon: "fast-food-outline",     iconBg: "#FEF3C7", availableStoreIds: ["s1"] },
  { id: "p-maggi-chicken", name: "Maggi Chicken Noodles", variant: "70 g",   brand: "Nestlé",   icon: "fast-food-outline",     iconBg: "#FEF3C7", availableStoreIds: ["s1"] },
  { id: "p-maggi-atta",    name: "Maggi Atta Noodles",    variant: "75 g",   brand: "Nestlé",   icon: "fast-food-outline",     iconBg: "#FEF3C7", availableStoreIds: ["s1", "s3"] },
  { id: "p-parleg",        name: "Parle-G Biscuit",       variant: "100 g",  brand: "Parle",    icon: "nutrition-outline",     iconBg: "#FDE68A", availableStoreIds: ["s1"] },
  { id: "p-lays",          name: "Lays Magic Masala",     variant: "52 g",   brand: "Lays",     icon: "fast-food-outline",     iconBg: "#FEE2E2", availableStoreIds: ["s1", "s5"] },
  { id: "p-dettol",        name: "Dettol Handwash",       variant: "250 ml", brand: "Reckitt",  icon: "water-outline",         iconBg: "#DBEAFE", availableStoreIds: ["s3", "s1"] },
  { id: "p-vitc",          name: "Vitamin C Tablets",     variant: "60 tabs",brand: "HealthVit",icon: "fitness-outline",       iconBg: "#DCFCE7", availableStoreIds: ["s3"] },
  { id: "p-croissant",     name: "Butter Croissant",      variant: "1 pc",   brand: "Fresh Bakes", icon: "cafe-outline",       iconBg: "#FEF3C7", availableStoreIds: ["s5"] },
  { id: "p-charger",       name: "USB-C Fast Charger",    variant: "25 W",   brand: "TechZone", icon: "hardware-chip-outline", iconBg: "#DBEAFE", availableStoreIds: ["s2"] },
];

// Product matches by name / brand. Empty query → empty (no dropdown noise).
export function searchProducts(query: string): MapProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MAP_PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q),
  );
}
