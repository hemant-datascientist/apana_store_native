// ============================================================
// MAP SEARCH ROW — menu · search pill (mic + scan) · cart  (Apana Store)
//
// Sits on the dark map header. Placeholder follows the mode (Find Product /
// Find Store). The pill is a light surface so it pops on the navy header.
// ============================================================

import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import useTheme from "../../theme/useTheme";
import { MapMode } from "./MapModeToggle";

interface MapSearchRowProps {
  value:        string;
  onChangeText: (t: string) => void;
  mode:         MapMode;
  onMenu:       () => void;
  onScan:       () => void;
  onCart:       () => void;
  onFocus?:     () => void;
}

export default function MapSearchRow({ value, onChangeText, mode, onMenu, onScan, onCart, onFocus }: MapSearchRowProps) {
  const { colors } = useTheme();
  const placeholder = mode === "products" ? "Find Product" : "Find Store";

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onMenu} style={styles.sideBtn} activeOpacity={0.8}>
        <Ionicons name="list-outline" size={20} color="#0F4C81" />
      </TouchableOpacity>

      <View style={[styles.pill, { backgroundColor: colors.card }]}>
        <Ionicons name="search-outline" size={17} color={colors.subText} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder={placeholder}
          placeholderTextColor={colors.subText}
          returnKeyType="search"
          style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
        />
        {value.length > 0 ? (
          <TouchableOpacity onPress={() => onChangeText("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={17} color={colors.subText} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="mic-outline" size={17} color={colors.subText} />
        )}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <TouchableOpacity onPress={onScan} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="scan-outline" size={17} color="#0F4C81" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onCart} style={styles.sideBtn} activeOpacity={0.8}>
        <Ionicons name="bag-outline" size={20} color="#0F4C81" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingBottom: 6 },
  sideBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  pill: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, paddingHorizontal: 12, height: 40 },
  input: { flex: 1, padding: 0 },
  divider: { width: 1, height: 18 },
});
