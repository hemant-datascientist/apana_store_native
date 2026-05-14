// ============================================================
// STORE LIVE DATA — Apana Store (Customer App)
//
// Real-time store statistics for the Store Live screen.
// Replace with GET /customer/stores/live when backend is ready.
// ============================================================

export interface StoreTypeData {
  key:         string;
  label:       string;   // short label for donut chart
  fullLabel:   string;   // full label for table rows
  liveCount:   number;
  closedCount: number;
  color:       string;
}

export const TOTAL_LIVE = 12500000;

export const STORE_LIVE_DATA: StoreTypeData[] = [
  {
    key:         "kirana",
    label:       "Kirana Stores",
    fullLabel:   "Kirana Stores (Grocery + Convenience Store)",
    liveCount:   4800000,
    closedCount: 12000,
    color:       "#22C55E",
  },
  {
    key:         "fashion",
    label:       "Fashion Stores",
    fullLabel:   "Fashion Stores (Clothing + Eyewear + Watches)",
    liveCount:   2100000,
    closedCount: 8000,
    color:       "#06B6D4",
  },
  {
    key:         "pharmacy",
    label:       "Pharmacy Store",
    fullLabel:   "Pharmacy Store",
    liveCount:   1200000,
    closedCount: 4500,
    color:       "#84CC16",
  },
  {
    key:         "food",
    label:       "Food & Beverages",
    fullLabel:   "Food & Beverages (Cafe + Bakery + More)",
    liveCount:   950000,
    closedCount: 3200,
    color:       "#EF4444",
  },
  {
    key:         "electronics",
    label:       "Electronics",
    fullLabel:   "Electronics Stores (Mobile + Computer)",
    liveCount:   820000,
    closedCount: 2100,
    color:       "#3B82F6",
  },
  {
    key:         "appliances",
    label:       "Appliances",
    fullLabel:   "Home Appliances (TV + Fridge + Washing Machine)",
    liveCount:   740000,
    closedCount: 1500,
    color:       "#8B5CF6",
  },
  {
    key:         "hardware",
    label:       "Hardware",
    fullLabel:   "Hardware & Tools Stores",
    liveCount:   680000,
    closedCount: 2800,
    color:       "#6366F1",
  },
  {
    key:         "furniture",
    label:       "Furniture",
    fullLabel:   "Furniture & Furnishings Stores",
    liveCount:   620000,
    closedCount: 1900,
    color:       "#F59E0B",
  },
  {
    key:         "jewellery",
    label:       "Jewellery Store",
    fullLabel:   "Jewellery Store",
    liveCount:   590000,
    closedCount: 1100,
    color:       "#D97706",
  },
];
