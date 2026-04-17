// ============================================================
// LOCATION ACCESS — Apana Store (Customer App)
//
// Shown once after the user first logs in (or signs up).
// Asks for device GPS permission to personalise the home feed
// with nearby stores. Falls back to manual area search.
//
// Flow:
//   "Use My Location"
//     → expo-location permission → GPS coords
//     → Mappls reverse geocode → UserAddress
//     → confirmLocation() → /(tabs)
//
//   Manual search input
//     → debounced Mappls autosuggest → suggestion list
//     → tap suggestion → UserAddress
//     → confirmLocation() → /(tabs)
//
//   "Skip for now"
//     → confirmLocation(default) → /(tabs)
//
// Backend:
//   PUT /api/customer/active-address  { lat, lng, city, ... }
// ============================================================

import React, { useState, useRef, useCallback } from "react";
import {
  View, Text, ScrollView, StyleSheet, StatusBar, Alert,
} from "react-native";
import { SafeAreaView }   from "react-native-safe-area-context";
import { useRouter }      from "expo-router";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";
import { useLocation }    from "../../context/LocationContext";
import { SAVED_ADDRESSES, UserAddress } from "../../data/addressData";
import {
  autosuggest, reverseGeocode, PlaceSuggestion,
} from "../../services/mapplsService";
import LocationHero          from "../../components/location/LocationHero";
import AllowLocationButton   from "../../components/location/AllowLocationButton";
import OrDivider             from "../../components/shared/OrDivider";
import LocationSearchInput   from "../../components/location/LocationSearchInput";
import PlaceSuggestionList   from "../../components/location/PlaceSuggestionList";
import SkipLocationLink      from "../../components/location/SkipLocationLink";

const DEBOUNCE_MS = 350;

export default function LocationAccessScreen() {
  const router              = useRouter();
  const { colors }          = useTheme();
  const { confirmLocation } = useLocation();

  const [query,       setQuery]       = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching,   setSearching]   = useState(false);
  const [deniedMsg,   setDeniedMsg]   = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Navigate to tabs after location is confirmed ─────────────
  function proceed(addr: UserAddress) {
    confirmLocation(addr);
    router.replace("/(tabs)");
  }

  // ── GPS success — reverse geocode → build address ─────────────
  async function handleGpsSuccess(lat: number, lng: number) {
    setDeniedMsg(false);
    const result = await reverseGeocode(lat, lng);

    const addr: UserAddress = {
      id:                "current",
      label:             "Current Location",
      icon:              "navigate-outline",
      line1:             result?.formattedAddress ?? "",
      line2:             result?.area             ?? "",
      city:              result?.city             ?? "Unknown",
      state:             result?.state            ?? "",
      pincode:           result?.pincode          ?? "",
      lat,
      lng,
      isCurrentLocation: true,
    };

    proceed(addr);
  }

  // ── GPS denied — show inline nudge, focus search ─────────────
  function handleGpsDenied() {
    setDeniedMsg(true);
  }

  // ── Manual search — debounced autosuggest call ────────────────
  function handleSearch(text: string) {
    setQuery(text);
    setDeniedMsg(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const results = await autosuggest(text);
      setSuggestions(results);
      setSearching(false);
    }, DEBOUNCE_MS);
  }

  function clearSearch() {
    setQuery("");
    setSuggestions([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }

  // ── Suggestion tapped — build UserAddress from result ─────────
  function handleSelect(s: PlaceSuggestion) {
    const addr: UserAddress = {
      id:      s.eLoc || "manual_" + Date.now(),
      label:   s.placeName,
      icon:    "location-outline",
      line1:   s.placeAddress,
      line2:   s.city,
      city:    s.city,
      state:   s.state,
      pincode: s.pincode,
      lat:     s.lat,
      lng:     s.lng,
    };
    setSuggestions([]);
    setQuery("");
    proceed(addr);
  }

  // ── Skip — use first saved address as fallback ────────────────
  function handleSkip() {
    proceed(SAVED_ADDRESSES[0]);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero illustration + title ── */}
          <LocationHero />

          {/* ── GPS button ── */}
          <AllowLocationButton
            onSuccess={handleGpsSuccess}
            onDenied={handleGpsDenied}
          />

          {/* Permission denied inline message */}
          {deniedMsg && (
            <Text style={[styles.deniedMsg, {
              color:      colors.danger,
              fontFamily: typography.fontFamily.regular,
              fontSize:   typography.size.xs,
            }]}>
              Location access denied. Please search for your area below or enable it in device settings.
            </Text>
          )}

          <OrDivider />

          {/* ── Manual search ── */}
          <LocationSearchInput
            value={query}
            onChange={handleSearch}
            onClear={clearSearch}
          />

          {/* ── Autosuggest dropdown ── */}
          <PlaceSuggestionList
            suggestions={suggestions}
            loading={searching}
            onSelect={handleSelect}
          />

          {/* ── Skip link ── */}
          <SkipLocationLink onSkip={handleSkip} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  safe:       { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop:        24,
    paddingBottom:     32,
    gap:               16,
  },
  deniedMsg:  { textAlign: "center", lineHeight: 18 },
});
