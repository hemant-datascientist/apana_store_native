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
//   First launch → get-started → login → otp → (tabs)
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
          <Stack screenOptions={{ headerShown: false }}>
            {/* Main tab group — the primary customer experience */}
            <Stack.Screen name="(tabs)" />
            {/* Store Live statistics screen */}
            <Stack.Screen name="store-live" />
            {/* Barcode / QR scanner screen */}
            <Stack.Screen name="scanner" />
            {/* Address Book — delivery address selection */}
            <Stack.Screen name="address-book" />
            {/* Menu screens */}
            <Stack.Screen name="about-us" />
            <Stack.Screen name="sell-ondc" />
            <Stack.Screen name="product-finder" />
            <Stack.Screen name="store-qr" />
            <Stack.Screen name="favourite" />
            {/* Auth flow — onboarding + login + OTP */}
            <Stack.Screen name="get-started" />
            <Stack.Screen name="login" />
            <Stack.Screen name="otp" />
          </Stack>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
