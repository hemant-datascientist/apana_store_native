// ============================================================
// SECTION HEADER — Apana Store (Shared, All Feed)
//
// Reusable row: icon + title (left) + "See All" (right).
// Used by every home-feed section.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";

interface SectionHeaderProps {
  icon:        string;
  title:       string;
  accentColor: string;
  onSeeAll?:   () => void;
}

export default function SectionHeader({
  icon, title, accentColor, onSeeAll,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Ionicons name={icon as any} size={17} color={accentColor} />
        <Text style={[styles.title, { fontFamily: typography.fontFamily.bold }]}>
          {title}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onSeeAll ?? (() => Alert.alert(title, "Full list coming soon."))}
      >
        <Text style={[styles.seeAll, { color: accentColor, fontFamily: typography.fontFamily.semiBold }]}>
          See All
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    marginBottom:   12,
  },
  left: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  title: {
    fontSize: 15,
    color:    "#111827",
  },
  seeAll: {
    fontSize: 12,
  },
});
