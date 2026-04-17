// ============================================================
// ORDER FILTER TABS — Apana Store (Orders Component)
//
// Horizontally scrollable pill tabs: All | Active | Delivered | Cancelled.
// Active tab gets primary background; inactive tabs get card bg.
//
// Props:
//   tabs      — FilterTab[]
//   active    — currently selected OrderFilter key
//   onChange  — (key) called when a tab is tapped
// ============================================================

import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FilterTab, OrderFilter } from "../../data/orderHistoryData";

interface OrderFilterTabsProps {
  tabs:     FilterTab[];
  active:   OrderFilter;
  onChange: (key: OrderFilter) => void;
}

export default function OrderFilterTabs({ tabs, active, onChange }: OrderFilterTabsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {tabs.map(tab => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, {
              backgroundColor: isActive ? colors.primary          : colors.card,
              borderColor:     isActive ? colors.primary          : colors.border,
            }]}
            activeOpacity={0.75}
            onPress={() => onChange(tab.key)}
          >
            <Text style={[styles.label, {
              color:      isActive ? colors.white : colors.subText,
              fontFamily: isActive
                ? typography.fontFamily.semiBold
                : typography.fontFamily.regular,
              fontSize:   typography.size.sm,
            }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    gap:            8,
    paddingVertical: 2,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical:   8,
    borderRadius:      20,
    borderWidth:       1,
  },
  label: {},
});
