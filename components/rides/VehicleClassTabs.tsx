// ============================================================
// VEHICLE CLASS TABS — Apana Store (Auto Riders)
//
// All · Bike · Auto · Cab filter chips with live counts. A class the
// passenger count can't fit into is rendered locked (greyed + lock
// icon + "Max N") and not selectable — the smart gating made visible.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import {
  VehicleClass, VEHICLE_CLASSES, VEHICLE_INFO,
} from "../../data/ridersData";
import { isClassAllowed, blockedReason } from "../../lib/rideLogic";

export type ClassFilter = VehicleClass | "all";

interface VehicleClassTabsProps {
  active:     ClassFilter;
  passengers: number;
  counts:     Record<VehicleClass, number>;  // riders per class (post-gating)
  onSelect:   (next: ClassFilter) => void;
}

export default function VehicleClassTabs({
  active, passengers, counts, onSelect,
}: VehicleClassTabsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* All chip */}
      <TouchableOpacity
        onPress={() => onSelect("all")}
        activeOpacity={0.75}
        style={[styles.chip, {
          backgroundColor: active === "all" ? colors.primary : colors.card,
          borderColor:     active === "all" ? colors.primary : colors.border,
        }]}
      >
        <Text style={[styles.chipText, {
          color: active === "all" ? "#fff" : colors.text,
          fontFamily: typography.fontFamily.semiBold,
        }]}>
          All
        </Text>
      </TouchableOpacity>

      {VEHICLE_CLASSES.map((cls) => {
        const info    = VEHICLE_INFO[cls];
        const allowed = isClassAllowed(cls, passengers);
        const isActive = active === cls;
        const reason  = blockedReason(cls, passengers);

        return (
          <TouchableOpacity
            key={cls}
            onPress={() => allowed && onSelect(cls)}
            disabled={!allowed}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityState={{ disabled: !allowed, selected: isActive }}
            style={[styles.chip, {
              backgroundColor: isActive ? info.color : colors.card,
              borderColor:     isActive ? info.color : colors.border,
              opacity:         allowed ? 1 : 0.45,
            }]}
          >
            <Ionicons
              name={allowed ? (info.icon as keyof typeof Ionicons.glyphMap) : "lock-closed"}
              size={13}
              color={isActive ? "#fff" : info.color}
            />
            <Text style={[styles.chipText, {
              color: isActive ? "#fff" : colors.text,
              fontFamily: typography.fontFamily.semiBold,
            }]}>
              {info.label}
            </Text>
            <Text style={[styles.chipMeta, {
              color: isActive ? "rgba(255,255,255,0.85)" : colors.subText,
              fontFamily: typography.fontFamily.regular,
            }]}>
              {allowed ? counts[cls] : reason}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    gap:               8,
    paddingHorizontal: 16,
    marginTop:         12,
  },
  chip: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              5,
    paddingHorizontal: 11,
    paddingVertical:    7,
    borderRadius:      18,
    borderWidth:        1,
  },
  chipText: {
    fontSize: typography.size.xs,
  },
  chipMeta: {
    fontSize: typography.size.ss,
  },
});
