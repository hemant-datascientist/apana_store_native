// ============================================================
// PIN ADDRESS — drop a pin, type the door. Nothing else.
//
// Replaces the typed address form. The customer never writes a street again:
// they move the map under a FIXED crosshair, and the server resolves the
// address from that point and derives the DIGIPIN from the same lat/lng.
//
// Why the crosshair is fixed and the map moves under it — this is how every
// q-commerce app does it, and the reason is physical: a draggable pin sits
// under the thumb, so the exact spot you are aiming at is the one spot you
// cannot see. A fixed centre marker is always visible and always at a known
// position on screen.
//
// The ONE typed field is the door: "Flat 402", "Ground floor, green gate".
// A pin finds the BUILDING; only a human can give the door. Remove that and
// every delivery ends at the gate.
//
// Route: /(account)/pin-address
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import MapplsWebView, { MapplsWebViewHandle } from "../../components/map/MapplsWebView";
import { createPinAddress } from "../../services/addressService";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "../../context/LocationContext";

// Pune, as a first frame only. The map jumps to the real GPS fix as soon as
// permission resolves; this is just something to draw before that lands.
const FALLBACK = { lat: 18.5204, lng: 73.8567 };
const PIN_ZOOM = 17;

export default function PinAddressScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { reloadAddresses } = useLocation();
  const customerId = user?.phone ?? "";
  const mapRef = useRef<MapplsWebViewHandle>(null);

  const [center, setCenter] = useState(FALLBACK);
  const [door, setDoor] = useState("");
  const [label, setLabel] = useState("Home");
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(true);
  const [mapFailed, setMapFailed] = useState(false);

  // Jump to the device's own position on open. Without this the customer starts
  // by dragging across a city, which is the exact tedium the pin replaces.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const fix = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if (!alive) return;
        const next = { lat: fix.coords.latitude, lng: fix.coords.longitude };
        setCenter(next);
        mapRef.current?.panTo(next.lat, next.lng, PIN_ZOOM);
      } catch {
        // Permission denied or no fix — the map stays on the fallback frame and
        // the customer pans manually. Nothing is invented on their behalf.
      } finally {
        if (alive) setLocating(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // The map settled — the crosshair is now over these coordinates. Debounced
  // inside the WebView, so this is not called per frame.
  const onCenterChanged = useCallback((lat: number, lng: number) => {
    setCenter({ lat, lng });
  }, []);

  const recentre = useCallback(async () => {
    setLocating(true);
    try {
      const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const next = { lat: fix.coords.latitude, lng: fix.coords.longitude };
      setCenter(next);
      mapRef.current?.panTo(next.lat, next.lng, PIN_ZOOM);
    } catch {
      Alert.alert("Location unavailable", "Turn on location, or move the map to your door.");
    } finally {
      setLocating(false);
    }
  }, []);

  const save = useCallback(async () => {
    if (!customerId) {
      Alert.alert("Sign in needed", "Sign in before saving an address.");
      return;
    }
    setSaving(true);
    try {
      await createPinAddress(customerId, {
        lat: center.lat,
        lng: center.lng,
        door: door.trim(),
        label: label.trim() || "Home",
      });
      // Pull the list again before leaving. The address-book refetches on focus
      // too, but the checkout picker reads the same context — without this the
      // customer can reach checkout and not see the address they just saved.
      await reloadAddresses();
      router.back();
    } catch (err) {
      // The server refuses a pin it cannot resolve rather than saving a
      // half-address. Show its reason verbatim — "move the pin slightly and try
      // again" is actionable; a generic "something went wrong" is not.
      Alert.alert("Could not save", (err as Error)?.message ?? "Try again.");
    } finally {
      setSaving(false);
    }
  }, [customerId, center, door, label, router]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Set delivery location</Text>
      </View>

      <View style={styles.mapWrap}>
        <MapplsWebView
          ref={mapRef}
          height={340}
          center={FALLBACK}
          zoom={PIN_ZOOM}
          zoomControl={false}
          isDark={isDark}
          onCenterChanged={onCenterChanged}
          onMapError={() => setMapFailed(true)}
        />

        {/* FIXED crosshair. Not a marker on the map — a view pinned to the
            centre of the container, so it never moves and is never under the
            thumb. The map slides beneath it. */}
        <View pointerEvents="none" style={styles.crosshairWrap}>
          <Ionicons name="location" size={40} color={colors.primary} />
          <View style={[styles.crosshairStem, { backgroundColor: colors.primary }]} />
        </View>

        <TouchableOpacity
          onPress={recentre}
          style={[styles.gpsBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {locating
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Ionicons name="locate" size={20} color={colors.primary} />}
        </TouchableOpacity>

        {mapFailed && (
          <View style={[styles.mapFail, { backgroundColor: colors.card }]}>
            <Text style={[styles.mapFailText, { color: colors.danger }]}>
              Map could not load. Check your connection — an address cannot be
              set without one.
            </Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.form}
      >
        {/* The coordinates are shown, not the resolved street: the server has
            not resolved it yet, and printing a guessed address here would be a
            claim the app cannot back. */}
        <Text style={[styles.coords, { color: colors.subText }]}>
          Pin at {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
        </Text>

        <Text style={[styles.fieldLabel, { color: colors.subText }]}>
          FLAT / HOUSE / BUILDING
        </Text>
        <TextInput
          value={door}
          onChangeText={setDoor}
          placeholder="Flat 402, green gate"
          placeholderTextColor={colors.subText}
          style={[styles.input, {
            color: colors.text, backgroundColor: colors.card, borderColor: colors.border,
          }]}
          maxLength={200}
        />
        <Text style={[styles.hint, { color: colors.subText }]}>
          The map finds the building. This is what the delivery partner reads at
          the door.
        </Text>

        <Text style={[styles.fieldLabel, { color: colors.subText }]}>SAVE AS</Text>
        <View style={styles.labelRow}>
          {["Home", "Work", "Other"].map((l) => (
            <TouchableOpacity
              key={l}
              onPress={() => setLabel(l)}
              style={[styles.chip, {
                backgroundColor: label === l ? `${colors.primary}18` : colors.card,
                borderColor: label === l ? colors.primary : colors.border,
              }]}
            >
              <Text style={[styles.chipText, { color: label === l ? colors.primary : colors.subText }]}>
                {l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={save}
          disabled={saving}
          style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }]}
        >
          {saving
            ? <ActivityIndicator size="small" color={colors.white} />
            : <Text style={[styles.saveText, { color: colors.white }]}>Save address</Text>}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  title: { fontSize: typography.size.lg, fontFamily: typography.fontFamily.semiBold },

  mapWrap: { height: 340, position: "relative" },
  crosshairWrap: {
    position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
    alignItems: "center", justifyContent: "center",
    // Nudged up by half the pin so the POINT of the marker sits on the centre,
    // not the middle of the glyph — otherwise every saved address is ~20 px of
    // map north of where the customer aimed.
    paddingBottom: 40,
  },
  crosshairStem: { width: 2, height: 10, marginTop: -6, borderRadius: 1 },

  gpsBtn: {
    position: "absolute", right: 14, bottom: 14,
    width: 44, height: 44, borderRadius: 22, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  mapFail: { position: "absolute", left: 16, right: 16, bottom: 16, padding: 12, borderRadius: 10 },
  mapFailText: { fontSize: typography.size.xs, fontFamily: typography.fontFamily.medium },

  form: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  coords: { fontSize: typography.size.xs, fontFamily: typography.fontFamily.regular, marginBottom: 14 },
  fieldLabel: {
    fontSize: typography.size.ss, fontFamily: typography.fontFamily.semiBold,
    letterSpacing: 0.6, marginBottom: 6,
  },
  input: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12,
    fontSize: typography.size.md, fontFamily: typography.fontFamily.regular,
  },
  hint: {
    fontSize: typography.size.xs, fontFamily: typography.fontFamily.regular,
    marginTop: 6, marginBottom: 16,
  },
  labelRow: { flexDirection: "row", gap: 8, marginBottom: 22 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: typography.size.sm, fontFamily: typography.fontFamily.medium },

  saveBtn: { borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  saveText: { fontSize: typography.size.md, fontFamily: typography.fontFamily.semiBold },
});
