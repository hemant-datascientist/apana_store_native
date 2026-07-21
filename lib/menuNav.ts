// ============================================================
// menuNav — shared MenuDrawer selection handler.
//
// Home and Category both open the same hamburger MenuDrawer; routing one
// menu key to a screen should behave identically on both. Centralising the
// switch here keeps them from drifting. Swap the route table for a real
// nav map / feature flags when those screens land.
// ============================================================

import { Alert } from "react-native";
import { useRouter } from "expo-router";

type AppRouter = ReturnType<typeof useRouter>;

export function handleMenuSelect(router: AppRouter, key: string): void {
  switch (key) {
    case "offer_zone":     router.push("/offer-zone");     break;
    case "shop_brands":    router.push("/brands");         break;
    case "new_launches":   router.push("/new-launchers");  break;
    case "about_us":       router.push("/about-us");       break;
    case "sell_ondc":      router.push("/sell-ondc");      break;
    case "product_finder": router.push("/product-finder"); break;
    case "store_qr":       router.push("/store-qr");       break;
    case "address_book":   router.push("/address-book");   break;
    case "favourite":      router.push("/favourite");      break;
    case "auto_riders":    router.push("/auto-riders");    break;
    case "scanner":        router.push("/scanner");        break;
    // §16.11 services + §16.12 food — real taxonomy-backed surfaces.
    case "book_service":   router.push("/service-stores");  break;
    case "order_food":     router.push("/menu-stores");     break;
    case "my_bookings":    router.push("/my-bookings");     break;
    default:
      Alert.alert("Coming Soon", `"${key}" is coming soon.`);
  }
}
