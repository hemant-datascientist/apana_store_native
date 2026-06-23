// ============================================================
// MAP CONTROL RAIL — Apana Store (Map View)
//
// Right-side stacked controls: zoom in / out, recenter on me, layers,
// navigate. Zoom + recenter are wired to the Mappls map; layers + navigate
// are surfaced to the parent to decide.
// ============================================================

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";

interface MapControlRailProps {
  onZoomIn:   () => void;
  onZoomOut:  () => void;
  onLocate:   () => void;
  onLayers:   () => void;
  onNavigate: () => void;
}

export default function MapControlRail({ onZoomIn, onZoomOut, onLocate, onLayers, onNavigate }: MapControlRailProps) {
  const { colors } = useTheme();
  const btn = (icon: string, onPress: () => void, key: string) => (
    <TouchableOpacity key={key} style={[styles.btn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon as any} size={19} color={colors.text} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.rail} pointerEvents="box-none">
      <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.groupBtn} onPress={onZoomIn} activeOpacity={0.8}>
          <Ionicons name="add" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.groupDivider, { backgroundColor: colors.border }]} />
        <TouchableOpacity style={styles.groupBtn} onPress={onZoomOut} activeOpacity={0.8}>
          <Ionicons name="remove" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {btn("locate", onLocate, "locate")}
      {btn("layers-outline", onLayers, "layers")}
      {btn("navigate", onNavigate, "navigate")}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { position: "absolute", right: 12, top: 16, gap: 10, alignItems: "center" },
  group: { borderRadius: 12, borderWidth: 1, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 5, elevation: 3 },
  groupBtn: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  groupDivider: { height: 1, width: "100%" },
  btn: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 5, elevation: 3 },
});
