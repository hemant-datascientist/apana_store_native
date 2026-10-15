// Brands real shops near the customer stock. Same "near me" point as the home
// feed: the device fix first, else the chosen delivery address.
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";
import { fetchNearbyBrands, type NearbyBrand } from "../services/liveCatalogService";

export function useNearbyBrands(): {
  brands: NearbyBrand[];
  loading: boolean;
  failed: boolean;
  reload: () => void;
} {
  const { selectedAddress, deviceCoords } = useLocation();
  const lat = deviceCoords?.lat ?? selectedAddress.lat ?? null;
  const lng = deviceCoords?.lng ?? selectedAddress.lng ?? null;
  const [brands, setBrands] = useState<NearbyBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (lat == null || lng == null) { setBrands([]); setLoading(false); return; }
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetchNearbyBrands(lat, lng)
      .then((b) => { if (alive) setBrands(b); })
      .catch(() => { if (alive) setFailed(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [lat, lng, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { brands, loading, failed, reload };
}
