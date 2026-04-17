// ============================================================
// STORE FILTER BAR — Apana Store (Customer App)
//
// Horizontal filter/sort bar shown at the top of the feed
// when discovery mode = "stores".
//
// Controls:
//   Filter      — opens filter sheet (funnel icon + label)
//   Sort by     — opens sort sheet (swap-vertical icon + label)
//   Nearest     — toggle switch (on by default)
//   Live Only   — toggle switch (on by default)
//   Top Rated   — pill button
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

export interface StoreFilters {
  nearest:   boolean;
  liveOnly:  boolean;
  topRated:  boolean;
}

interface StoreFilterBarProps {
  filters:       StoreFilters;
  onFilterChange:(f: StoreFilters) => void;
  onFilterPress: () => void;
  onSortPress:   () => void;
}

export default function StoreFilterBar({
  filters, onFilterChange, onFilterPress, onSortPress,
}: StoreFilterBarProps) {
  const { colors } = useTheme();

  function toggle(key: keyof StoreFilters) {
    onFilterChange({ ...filters, [key]: !filters[key] });
  }

  const dividerStyle = [styles.divider, { backgroundColor: colors.border }];

  return (
    <View style={[styles.bar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {/* Filter button */}
        <TouchableOpacity style={styles.pill} onPress={onFilterPress} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={15} color={colors.text} />
          <Text style={[styles.pillLabel, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            Filter
          </Text>
        </TouchableOpacity>

        <View style={dividerStyle} />

        {/* Sort by button */}
        <TouchableOpacity style={styles.pill} onPress={onSortPress} activeOpacity={0.7}>
          <Ionicons name="swap-vertical-outline" size={15} color={colors.text} />
          <Text style={[styles.pillLabel, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            Sort by
          </Text>
        </TouchableOpacity>

        <View style={dividerStyle} />

        {/* Nearest toggle */}
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            Nearest
          </Text>
          <Switch
            value={filters.nearest}
            onValueChange={() => toggle("nearest")}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={filters.nearest ? colors.primary : colors.subText}
            style={styles.switch}
          />
        </View>

        <View style={dividerStyle} />

        {/* Live Only toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.liveRow}>
            <View style={[styles.liveDot, { backgroundColor: filters.liveOnly ? "#22C55E" : colors.subText }]} />
            <Text style={[styles.toggleLabel, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
              Live Only
            </Text>
          </View>
          <Switch
            value={filters.liveOnly}
            onValueChange={() => toggle("liveOnly")}
            trackColor={{ false: colors.border, true: "#22C55E80" }}
            thumbColor={filters.liveOnly ? "#22C55E" : colors.subText}
            style={styles.switch}
          />
        </View>

        <View style={dividerStyle} />

        {/* Top Rated pill */}
        <TouchableOpacity
          style={[
            styles.pill,
            styles.topRatedPill,
            {
              backgroundColor: filters.topRated ? colors.primary : "transparent",
              borderColor:     filters.topRated ? colors.primary : colors.border,
            },
          ]}
          onPress={() => toggle("topRated")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="star"
            size={13}
            color={filters.topRated ? "#fff" : colors.subText}
          />
          <Text style={[
            styles.pillLabel,
            {
              color:      filters.topRated ? "#fff" : colors.text,
              fontFamily: typography.fontFamily.medium,
              fontSize:   typography.size.xs,
            },
          ]}>
            Top Rated
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: 1,
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical:    10,
    alignItems:        "center",
    gap:               12,
  },
  divider: {
    width:  1,
    height: 20,
  },
  pill: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
  },
  pillLabel: {},
  toggleRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  toggleLabel: {},
  liveRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  liveDot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  switch: {
    transform:  [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginLeft: -4,
  },
  topRatedPill: {
    borderWidth:       1,
    borderRadius:      20,
    paddingHorizontal: 10,
    paddingVertical:    5,
  },
});
