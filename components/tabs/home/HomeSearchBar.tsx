// ============================================================
// HOME SEARCH BAR — Apana Store
//
// Full search row:
//   [≡]  [🔍 Search for products/stores … 🎙]  [🔔] [⊡] [⊙]
//
// Hamburger  — opens side drawer / filter panel
// Search pill— full-width input with mic for voice search
// Bell       — notifications
// Scan       — barcode / QR scanner
// Locate     — GPS current location pin
//
// The placeholder text changes with the discovery mode.
// ============================================================

import React, { useRef } from "react";
import {
  View, TextInput, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import { DiscoveryMode } from "../../../data/homeData";

// Semi-transparent white pill — sits on the dark header
const PILL_BG    = "rgba(255,255,255,0.14)";
const ICON_COLOR = "#fff";
const ICON_SIZE  = 22;

interface HomeSearchBarProps {
  value:          string;
  onChangeText:   (t: string) => void;
  mode:           DiscoveryMode;
  onMenuPress:    () => void;
  onMicPress:     () => void;
  onBellPress:    () => void;
  onScanPress:    () => void;
  onLocatePress:  () => void;
}

export default function HomeSearchBar({
  value, onChangeText, mode,
  onMenuPress, onMicPress,
  onBellPress, onScanPress, onLocatePress,
}: HomeSearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  const placeholder =
    mode === "products" ? "Search for products" : "Search for stores";

  return (
    <View style={styles.row}>

      {/* ── Hamburger menu ── */}
      <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn} activeOpacity={0.7}>
        <Ionicons name="menu-outline" size={ICON_SIZE + 2} color={ICON_COLOR} />
      </TouchableOpacity>

      {/* ── Search pill ── */}
      <TouchableOpacity
        style={styles.pill}
        activeOpacity={0.85}
        onPress={() => inputRef.current?.focus()}
      >
        <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.65)" />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.55)"
          style={[styles.input, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={onMicPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="mic-outline" size={18} color="rgba(255,255,255,0.75)" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* ── Right action icons ── */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onBellPress} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={ICON_SIZE} color={ICON_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onScanPress} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="scan-outline" size={ICON_SIZE} color={ICON_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onLocatePress} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="locate-outline" size={ICON_SIZE} color={ICON_COLOR} />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    paddingHorizontal: 12,
    paddingVertical:    6,
    gap: 8,
  },

  iconBtn: {
    width:  36,
    height: 36,
    justifyContent: "center",
    alignItems:     "center",
  },

  pill: {
    flex:          1,
    flexDirection: "row",
    alignItems:    "center",
    backgroundColor: PILL_BG,
    borderRadius:  24,
    paddingHorizontal: 12,
    paddingVertical:    9,
    gap: 8,
  },
  input: {
    flex:  1,
    color: "#fff",
    padding: 0,
  },

  actions: {
    flexDirection: "row",
    alignItems:    "center",
  },
});
