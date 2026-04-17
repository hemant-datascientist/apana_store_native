// ============================================================
// ALLOW LOCATION BUTTON — Apana Store (Location Component)
//
// Primary CTA on the location-access screen.
// Requests device GPS permission then fetches current position.
// Shows a spinner while the permission dialog / GPS fix is pending.
//
// Props:
//   onSuccess — (lat, lng) called when GPS position is obtained
//   onDenied  — called when user denies permission
// ============================================================

import React, { useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { Ionicons }    from "@expo/vector-icons";
import * as Location   from "expo-location";
import useTheme        from "../../theme/useTheme";
import { typography }  from "../../theme/typography";

interface AllowLocationButtonProps {
  onSuccess: (lat: number, lng: number) => void;
  onDenied:  () => void;
}

export default function AllowLocationButton({ onSuccess, onDenied }: AllowLocationButtonProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  async function handlePress() {
    setLoading(true);
    try {
      // ── Request foreground permission ─────────────────────────
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        onDenied();
        return;
      }

      // ── Get current GPS position ──────────────────────────────
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      onSuccess(pos.coords.latitude, pos.coords.longitude);
    } catch {
      Alert.alert(
        "Location Error",
        "Could not get your location. Please try again or search manually.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.btn, {
        backgroundColor: colors.primary,
        shadowColor:     colors.primary,
      }]}
      activeOpacity={0.88}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Ionicons name="navigate" size={20} color={colors.white} />
          <Text style={[styles.label, {
            color:      colors.white,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.md,
          }]}>
            Use My Location
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    borderRadius:    16,
    paddingVertical: 17,
    width:           "100%",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.28,
    shadowRadius:    10,
    elevation:       5,
  },
  label: {},
});
