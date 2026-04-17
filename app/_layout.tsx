// ============================================================
// ROOT LAYOUT — Apana Store (Customer App)
//
// Responsibilities:
//   1. Load Poppins font variants (same scale as all Apana apps)
//   2. Wrap the entire app in ThemeProvider (Apana Blue default)
//   3. Configure expo-router Stack — no default headers
//
// All screens beneath this layout have access to:
//   - useTheme()      → colors, isDark, themeMode, brand, setBrand
//   - useResponsive() → width, height, isTablet, spacing, columns
//   - typography      → fontFamily and size constants
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
        </Stack>
      </LocationProvider>
    </ThemeProvider>
  );
}
