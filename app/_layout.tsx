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
            {/* Main tab group — the primary customer experience */}
            <Stack.Screen name="(tabs)" />
            {/* Menu + utility screens — about-us, address-book, favourite, product-finder, scanner, sell-ondc, store-live, store-qr */}
            <Stack.Screen name="(menu)" />
            {/* Auth + account screens — get-started, login, create-account, otp, edit-profile, notifications */}
            <Stack.Screen name="(auth)" />
          </Stack>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
