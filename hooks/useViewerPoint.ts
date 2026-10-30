// Where the shopper is, for paid placements aimed at a place (promoted
// listings, picked-area banners): the address they are shopping for, else this
// phone. Rounded to ~110 m — enough to find the area, not an exact position.
import { useMemo } from "react";
import { useLocation } from "../context/LocationContext";

export default function useViewerPoint(): { lat: number; lng: number } | null {
  const { selectedAddress, deviceCoords } = useLocation();
  const pin = Number.isFinite(selectedAddress.lat) && Number.isFinite(selectedAddress.lng)
    ? { lat: selectedAddress.lat as number, lng: selectedAddress.lng as number }
    : deviceCoords;
  const lat = pin ? Math.round(pin.lat * 1000) / 1000 : null;
  const lng = pin ? Math.round(pin.lng * 1000) / 1000 : null;
  return useMemo(() => (lat != null && lng != null ? { lat, lng } : null), [lat, lng]);
}
