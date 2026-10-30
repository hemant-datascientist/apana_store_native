// While a PICKUP order is open and this screen is showing, report where the
// customer is (every ~50 m moved) so the shop is told "customer arriving" when
// they get close. Stops once the shop has been told, or the screen closes.
// Location permission is already granted at signup (the app needs it to find shops).

import { useEffect } from "react";
import * as Location from "expo-location";
import { reportNearShop } from "../services/checkoutService";

export function useCustomerNear(orderId: string, customerId: string | null | undefined, active: boolean): void {
  useEffect(() => {
    if (!active || !orderId || !customerId) return;
    let sub: Location.LocationSubscription | null = null;
    let done = false;
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted" || done) return;
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 50, timeInterval: 20_000 },
        (loc) => {
          void reportNearShop(orderId, customerId, loc.coords.latitude, loc.coords.longitude)
            .then((near) => { if (near) { done = true; sub?.remove(); } })
            .catch(() => {});
        },
      );
      if (done) sub.remove();
    })();
    return () => { done = true; sub?.remove(); };
  }, [orderId, customerId, active]);
}
