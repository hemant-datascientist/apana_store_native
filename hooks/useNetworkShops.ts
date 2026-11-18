// useNetworkShops — one ONDC network search for where the customer is, then
// polling while seller apps are still answering (about 30 seconds).
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "../context/LocationContext";
import { networkResults, startNetworkSearch, type NetworkShop } from "../services/ondcNetworkService";

const POLL_MS = 3000;

export function useNetworkShops() {
  const { deviceCoords, selectedAddress } = useLocation();
  const point = deviceCoords
    ?? (selectedAddress.lat != null && selectedAddress.lng != null ? { lat: selectedAddress.lat, lng: selectedAddress.lng } : null);
  const pincode = /^[1-9][0-9]{5}$/.test(selectedAddress.pincode) ? selectedAddress.pincode : undefined;

  const [shops, setShops] = useState<NetworkShop[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txn, setTxn] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };

  const search = useCallback(async () => {
    stop();
    // No point = no search: a guessed location would show shops near somewhere else.
    if (!point) { setError("Set your location to see ONDC shops near you."); return; }
    setError(null); setShops([]); setSearching(true);
    try {
      const { transaction_id } = await startNetworkSearch({ ...point, pincode });
      setTxn(transaction_id);
      const poll = async () => {
        try {
          const r = await networkResults(transaction_id);
          setShops(r.shops);
          if (r.open) { timer.current = setTimeout(poll, POLL_MS); return; }
          setSearching(false);
        } catch (e) {
          setSearching(false);
          setError((e as Error).message);
        }
      };
      timer.current = setTimeout(poll, POLL_MS);
    } catch (e) {
      setSearching(false);
      setError((e as Error).message);
    }
  }, [point?.lat, point?.lng, pincode]);

  useEffect(() => { void search(); return stop; }, [search]);

  return { shops, searching, error, retry: search, txn, point, pincode };
}
