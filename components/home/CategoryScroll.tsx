// ============================================================
// CATEGORY SCROLL — Apana Store
//
// Horizontal scroll of store/product categories.
// Each item: icon (above) + label (below), vertically stacked.
//
// Active:   white icon + white bold label + subtle underline dot
// Inactive: semi-transparent white icon + regular muted label
//
// Sits at the bottom of the dark hero header section.
// ============================================================

import React from "react";
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { Category } from "../../data/homeData";

interface CategoryScrollProps {
  categories:    Category[];
  activeKey:     string;
  onSelect:      (key: string) => void;
}

export default function CategoryScroll({ categories, activeKey, onSelect }: CategoryScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      style={styles.scroll}
    >
      {categories.map(cat => {
        const active = cat.key === activeKey;
        return (
          <TouchableOpacity
            key={cat.key}
            style={styles.item}
            onPress={() => onSelect(cat.key)}
            activeOpacity={0.7}
          >
            {/* Icon */}
            <Ionicons
              name={cat.icon as any}
              size={24}
              color={active ? "#fff" : "rgba(255,255,255,0.60)"}
            />

            {/* Label */}
            <Text
              style={[
                styles.label,
                {
                  color:      active ? "#fff" : "rgba(255,255,255,0.60)",
                  fontFamily: active
                    ? typography.fontFamily.semiBold
                    : typography.fontFamily.regular,
                  fontSize: typography.size.xs,
                },
              ]}
              numberOfLines={1}
            >
              {cat.label}
            </Text>

            {/* Active indicator dot */}
            {active && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    borderTopWidth:  1,
    borderTopColor:  "rgba(255,255,255,0.10)",
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical:   12,
    gap: 4,
  },
  item: {
    alignItems:     "center",
    justifyContent: "center",
    gap:            5,
    paddingHorizontal: 12,
    minWidth: 62,
  },
  label: {
    textAlign: "center",
    letterSpacing: 0.1,
  },
  activeDot: {
    width:           4,
    height:          4,
    borderRadius:    2,
    backgroundColor: "#fff",
    marginTop:       2,
  },
});
