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

export const TOTAL_LIVE = 410;

export const STORE_LIVE_DATA: StoreTypeData[] = [
  {
    key:         "kirana",
    label:       "Kirana Stores",
    fullLabel:   "Kirana Stores (Grocery + Convenience Store)",
    liveCount:   97,
    closedCount: 2,
    color:       "#22C55E",
  },
  {
    key:         "fashion",
    label:       "Fashion Stores",
    fullLabel:   "Fashion Stores (Clothing + Eyewear + Watches)",
    liveCount:   81,
    closedCount: 3,
    color:       "#06B6D4",
  },
  {
    key:         "pharmacy",
    label:       "Pharmacy Store",
    fullLabel:   "Pharmacy Store",
    liveCount:   64,
    closedCount: 2,
    color:       "#84CC16",
  },
  {
    key:         "food",
    label:       "Food & Beverages",
    fullLabel:   "Food & Beverages (Cafe + Bakery + More)",
    liveCount:   36,
    closedCount: 2,
    color:       "#EF4444",
  },
  {
    key:         "electronics",
    label:       "Electronics",
    fullLabel:   "Electronics Stores (Mobile + Computer)",
    liveCount:   32,
    closedCount: 4,
    color:       "#3B82F6",
  },
  {
    key:         "appliances",
    label:       "Appliances",
    fullLabel:   "Home Appliances (TV + Fridge + Washing Machine)",
    liveCount:   29,
    closedCount: 0,
    color:       "#8B5CF6",
  },
  {
    key:         "hardware",
    label:       "Hardware",
    fullLabel:   "Hardware & Tools Stores",
    liveCount:   26,
    closedCount: 4,
    color:       "#6366F1",
  },
  {
    key:         "furniture",
    label:       "Furniture",
    fullLabel:   "Furniture & Furnishings Stores",
    liveCount:   23,
    closedCount: 3,
    color:       "#F59E0B",
  },
  {
    key:         "jewellery",
    label:       "Jewellery Store",
    fullLabel:   "Jewellery Store",
    liveCount:   22,
    closedCount: 0,
    color:       "#D97706",
  },
];
