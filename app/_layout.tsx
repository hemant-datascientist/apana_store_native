// ============================================================
// ROOT LAYOUT — Apana Store (Customer App)
//
// Responsibilities:
//   1. Load Poppins font variants (same scale as all Apana apps)
//   2. Wrap the entire app in ThemeProvider (Apana Blue default)
//   3. Wrap in AuthProvider — exposes useAuth() everywhere
//   4. Wrap in LocationProvider — exposes useLocation() everywhere
//   5. Configure expo-router Stack — no default headers
//
// All screens beneath this layout have access to:
//   - useAuth()       → user, isLoggedIn, isGuest, login, logout, skipAsGuest
//   - useTheme()      → colors, isDark, themeMode, brand, setBrand
//   - useLocation()   → selectedAddress, setSelectedAddress
//   - useResponsive() → width, height, isTablet, spacing, columns
//   - typography      → fontFamily and size constants
//
// Auth flow:
//   First launch → (auth)/get-started → (auth)/login → (auth)/otp → (tabs)
//   Return visit → (tabs) directly (AsyncStorage restores session)
//   Guest        → skipAsGuest() → (tabs) with browse-only access
// ============================================================

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { View } from "react-native";
import { ThemeProvider }    from "../theme/ThemeContext";
import { LocationProvider } from "../context/LocationContext";
import { AuthProvider }     from "../context/AuthContext";
import { CartProvider }     from "../context/CartContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Blank screen while fonts load — prevents unstyled text flash
  if (!fontsLoaded) return <View />;

  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Auth flow — get-started, login, otp, create-account, edit-profile */}
            <Stack.Screen name="(auth)"     />
            {/* Bottom tab bar — Home, Category, Cart, Bharat, Profile */}
            <Stack.Screen name="(tabs)"     />
            {/* Store browsing — store-detail, store-live, store-qr */}
            <Stack.Screen name="(store)"    />
            {/* Checkout flow — checkout, checkout-payment, order-tracking, order-qr, order-collected, invoice */}
            <Stack.Screen name="(checkout)" />
            {/* Order history */}
            <Stack.Screen name="(orders)"   />
            {/* Account management — address-book, payment-methods, add-payment, favourite */}
            <Stack.Screen name="(account)"  />
            {/* Discovery — search-results, product-detail, product-finder, scanner, brands, offer-zone, new-launchers */}
            <Stack.Screen name="(discover)" />
            {/* Info + settings — about-us, help-support, sell-ondc, rate-us, language, notifications */}
            <Stack.Screen name="(info)"     />
          </Stack>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
