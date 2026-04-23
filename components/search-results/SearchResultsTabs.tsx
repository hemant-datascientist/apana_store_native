// ============================================================
// SEARCH RESULTS TABS — Apana Store
//
// Products | Stores tab toggle with count badges.
// Active tab = filled pill with primary colour; inactive = ghost.
//
// Rendered inside the shared toolbar wrapper in the screen — this
// component intentionally has no outer border / card background,
// so the toolbar reads as a single grouped surface.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export type SearchTab = "products" | "stores";

interface SearchResultsTabsProps {
  activeTab:     SearchTab;
  onSelect:      (tab: SearchTab) => void;
  productCount:  number;
  storeCount:    number;
}

export default function SearchResultsTabs({
  activeTab, onSelect, productCount, storeCount,
}: SearchResultsTabsProps) {
  const { colors } = useTheme();

  const tabs: { key: SearchTab; label: string; count: number }[] = [
    { key: "products", label: "Products", count: productCount },
    { key: "stores",   label: "Stores",   count: storeCount   },
  ];

  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, { backgroundColor: colors.background }]}>
        {tabs.map(tab => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                isActive && { backgroundColor: colors.primary },
              ]}
              onPress={() => onSelect(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.label,
                {
                  color:      isActive ? "#fff" : colors.subText,
                  fontFamily: isActive ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                  fontSize:   typography.size.sm,
                },
              ]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={[
                  styles.badge,
                  { backgroundColor: isActive ? "rgba(255,255,255,0.25)" : colors.border },
                ]}>
                  <Text style={[
                    styles.badgeText,
                    {
                      color:      isActive ? "#fff" : colors.subText,
                      fontFamily: typography.fontFamily.bold,
                      fontSize:   typography.size.ss,
                    },
                  ]}>
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom:     8,
  },
  bar: {
    flexDirection: "row",
    borderRadius:  14,
    padding:       4,
  },
  tab: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             6,
    paddingVertical: 9,
    borderRadius:    10,
  },
  label: {},
  badge: {
    minWidth:          20,
    height:            20,
    borderRadius:      10,
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 5,
  },
  badgeText: {},
});
