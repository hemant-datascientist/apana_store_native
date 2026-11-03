// ============================================================
// APC CATEGORY IMAGES — Maps APC Departments & Classes to high-res WebP artwork.
//
// Serves dynamic backend-served WebP category illustrations for both
// the Level-1 Department Grid (ApcDeptGrid) and Level-2 Class Grid (ApcClassesScreen).
// ============================================================

import { assetImg, type AssetImage } from "../lib/assetImg";

// ── Department Artwork Mapping (APC-D01 ... APC-D38) ────────
export const APC_DEPARTMENT_IMAGES: Record<string, AssetImage> = {
  "APC-D01": assetImg("category/products/veg_fruits.webp"),      // Grocery
  "APC-D35": assetImg("category/products/packaged_food.webp"),   // Packaged Food
  "APC-D36": assetImg("category/products/sweets.webp"),          // Mithai
  "APC-D37": assetImg("category/products/icecream_cups.webp"),   // Ice Cream & Frozen Desserts
  "APC-D38": assetImg("category/products/frozen_snacks.webp"),   // Frozen Foods
  "APC-D02": assetImg("category/products/tea_coffee.webp"),      // Beverages
  "APC-D03": assetImg("category/products/paan.webp"),            // Paan, Supari & Mukhwas
  "APC-D04": assetImg("category/products/bodycare.webp"),        // Personal Care
  "APC-D05": assetImg("category/products/makeup.webp"),          // Beauty
  "APC-D06": assetImg("category/products/medicines.webp"),       // Medicines
  "APC-D07": assetImg("category/products/ayurvedic.webp"),       // Wellness
  "APC-D08": assetImg("category/products/health_monitor.webp"),  // Elderly Care
  "APC-D09": assetImg("category/products/baby_clothing.webp"),   // Baby & Maternity
  "APC-D10": assetImg("category/products/fashion.webp"),         // Fashion
  "APC-D11": assetImg("category/products/ethnic.webp"),          // Fabric & Dress Material
  "APC-D12": assetImg("category/products/smartphones.webp"),     // Mobile & Accessories
  "APC-D13": assetImg("category/products/headphones.webp"),      // Electronics
  "APC-D14": assetImg("category/products/fridge.webp"),          // Home Appliances
  "APC-D15": assetImg("category/products/switches.webp"),        // Electrical Supplies
  "APC-D16": assetImg("category/products/sofa.webp"),            // Home & Furniture
  "APC-D17": assetImg("category/products/kitchen_din.webp"),     // Kitchenware & Utensils
  "APC-D18": assetImg("category/products/cleaning.webp"),        // Cleaning & Household
  "APC-D19": assetImg("category/products/bath.webp"),            // Sanitaryware & Tiles
  "APC-D20": assetImg("category/products/hand_tools.webp"),      // Tools & Hardware
  "APC-D21": assetImg("category/products/fiction.webp"),         // Books & Education
  "APC-D22": assetImg("category/products/art_craft.webp"),       // Arts, Crafts & Hobby
  "APC-D23": assetImg("category/products/musical.webp"),         // Musical Instruments
  "APC-D24": assetImg("category/products/toys.webp"),            // Toys & Games
  "APC-D25": assetImg("category/products/cricket.webp"),         // Sports & Fitness
  "APC-D26": assetImg("category/products/pet_food.webp"),        // Pet Care & Supplies
  "APC-D27": assetImg("category/products/live_plants.webp"),     // Plants, Flowers & Herbs
  "APC-D28": assetImg("category/products/puja_thali.webp"),      // Pooja & Religious
  "APC-D29": assetImg("category/products/festival_kits.webp"),   // Fireworks & Crackers
  "APC-D30": assetImg("category/products/car_acc.webp"),         // Automotive
  "APC-D31": assetImg("category/products/agri_seeds.webp"),      // Agriculture Inputs
  "APC-D32": assetImg("category/products/soft_drinks.webp"),     // Alcoholic Beverages
  "APC-D33": assetImg("category/products/cigarettes.webp"),      // Tobacco & Demerit Goods
  "APC-D34": assetImg("category/products/stationery.webp"),      // Miscellaneous
};

// ── Class Artwork Mapping (normalized slugs & full codes) ────
export const APC_CLASS_IMAGES: Record<string, AssetImage> = {
  // Food classes
  VEG: assetImg("category/products/veg_fruits.webp"),
  FRT: assetImg("category/products/veg_fruits.webp"),
  DAI: assetImg("category/products/dairy.webp"),
  DRYF: assetImg("category/products/dry_fruits.webp"),
  GRAINSANDSEEDS: assetImg("category/products/ration.webp"),
  RATION: assetImg("category/products/ration.webp"),
  NVG: assetImg("category/products/eggs_meat.webp"),
  SPC: assetImg("category/products/masala.webp"),
  TEA: assetImg("category/products/tea_coffee.webp"),
  OIL: assetImg("category/products/cook_oil.webp"),
  MASALASAUCES: assetImg("category/products/masala.webp"),
  BATTERS: assetImg("category/products/instant.webp"),
  PICKLESPAPADCHUTNEY: assetImg("category/products/dry_snacks.webp"),
  SALT: assetImg("category/products/masala.webp"),
  FROZENFOODS: assetImg("category/products/frozen_snacks.webp"),
  HOT: assetImg("category/products/tea_coffee.webp"),
  CLD: assetImg("category/products/soft_drinks.webp"),
  BISCUITSCOOKIES: assetImg("category/products/dry_snacks.webp"),
  BKY: assetImg("category/products/baking.webp"),
  CHIPSNAMKEEN: assetImg("category/products/chips.webp"),
  DRYSNACKSMAKHANA: assetImg("category/products/dry_snacks.webp"),
  INSTANTFOOD: assetImg("category/products/instant.webp"),
  PROTEINHEALTHBARS: assetImg("category/products/protein_bars.webp"),
  POPCORNCORNSNACKS: assetImg("category/products/popcorn.webp"),
  CHOCOLATESCANDIES: assetImg("category/products/chocolates.webp"),
  NOODLESPASTARICE: assetImg("category/products/noodles.webp"),
  HONEYJAMSSPREADS: assetImg("category/products/honey_spreads.webp"),
  BAKINGCONDIMENTS: assetImg("category/products/baking.webp"),
  BARFIFUDGE: assetImg("category/products/sweets.webp"),
  BENGALISWEETS: assetImg("category/products/sweets.webp"),
  CHIKKIGURSWEETS: assetImg("category/products/sweets.webp"),
  HALWA: assetImg("category/products/sweets.webp"),
  JALEBIFRIEDSWEETS: assetImg("category/products/sweets.webp"),
  KHEERPUDDING: assetImg("category/products/sweets.webp"),
  LADOO: assetImg("category/products/sweets.webp"),
  PEDAKHOYASWEETS: assetImg("category/products/sweets.webp"),
  REGIONALSPECIALTY: assetImg("category/products/sweets.webp"),
  SOUTHINDIANSWEETS: assetImg("category/products/sweets.webp"),
  ICECREAMBARSCUPSCONES: assetImg("category/products/icecream_cups.webp"),
  KULFIFALOODA: assetImg("category/products/kulfi.webp"),
  FROZENDESSERTS: assetImg("category/products/frozen_dessert.webp"),
  GOLA: assetImg("category/products/frozen_dessert.webp"),
  CAKESANDWICHNOVELTY: assetImg("category/products/baking.webp"),
  ICECREAMTUBSFAMILYPACKS: assetImg("category/products/icecream_cups.webp"),

  // General department root classes
  MUKH: assetImg("category/products/mukhwas.webp"),
  PCARE: assetImg("category/products/bodycare.webp"),
  BTY: assetImg("category/products/makeup.webp"),
  MED: assetImg("category/products/medicines.webp"),
  WELL: assetImg("category/products/ayurvedic.webp"),
  ELDR: assetImg("category/products/health_monitor.webp"),
  BABYM: assetImg("category/products/baby_clothing.webp"),
  FASH: assetImg("category/products/fashion.webp"),
  FABR: assetImg("category/products/ethnic.webp"),
  A7: assetImg("category/products/smartphones.webp"),
  A8: assetImg("category/products/headphones.webp"),
  A9: assetImg("category/products/fridge.webp"),
  ELEC: assetImg("category/products/switches.webp"),
  HFUR: assetImg("category/products/sofa.webp"),
  KTCH: assetImg("category/products/kitchen_din.webp"),
  CLN: assetImg("category/products/cleaning.webp"),
  SANI: assetImg("category/products/bath.webp"),
  TOOL: assetImg("category/products/hand_tools.webp"),
  BOOK: assetImg("category/products/fiction.webp"),
  ART: assetImg("category/products/art_craft.webp"),
  MUS: assetImg("category/products/musical.webp"),
  TOY: assetImg("category/products/toys.webp"),
  SPRT: assetImg("category/products/cricket.webp"),
  PET: assetImg("category/products/pet_food.webp"),
  PLANT: assetImg("category/products/live_plants.webp"),
  POOJ: assetImg("category/products/puja_thali.webp"),
  FIRE: assetImg("category/products/festival_kits.webp"),
  AUTO: assetImg("category/products/car_acc.webp"),
  AGRI: assetImg("category/products/agri_seeds.webp"),
  LIQ: assetImg("category/products/soft_drinks.webp"),
  SIN: assetImg("category/products/cigarettes.webp"),
  MISC: assetImg("category/products/stationery.webp"),
};

/**
 * Returns the AssetImage for a department code (e.g. "APC-D01").
 */
export function getApcDeptImage(code: string): AssetImage | null {
  return APC_DEPARTMENT_IMAGES[code] ?? null;
}

/**
 * Returns the AssetImage for a class code or slug (e.g. "APC-01-VEG", "APC-VEG", "VEG").
 */
export function getApcClassImage(codeOrSlug: string): AssetImage | null {
  if (!codeOrSlug) return null;
  const direct = APC_CLASS_IMAGES[codeOrSlug];
  if (direct) return direct;

  const normalized = codeOrSlug.replace(/^APC-(?:[0-9]+-)?/, "").toUpperCase();
  return APC_CLASS_IMAGES[normalized] ?? null;
}
