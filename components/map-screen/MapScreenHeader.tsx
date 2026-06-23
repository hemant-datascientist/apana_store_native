// ============================================================
// MAP SCREEN HEADER — back · "Map" · help  (Apana Store)
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";

interface MapScreenHeaderProps {
  onBack: () => void;
  onHelp: () => void;
}

export default function MapScreenHeader({ onBack, onHelp }: MapScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>
      <Text style={[styles.title, { fontFamily: typography.fontFamily.bold }]}>Map</Text>
      <TouchableOpacity onPress={onHelp} style={styles.iconBtn} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="help-circle-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, height: 48 },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: typography.size.lg },
});
