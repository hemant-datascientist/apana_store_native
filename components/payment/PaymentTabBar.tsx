// ============================================================
// PAYMENT TAB BAR — Apana Store
//
// Horizontal tab selector: UPI | Card | Net Banking | Wallets
// Active tab has primary color fill; inactive is outlined.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export type PaymentTab = "upi" | "card" | "netbanking" | "wallet";

interface Tab {
  key:   PaymentTab;
  label: string;
  icon:  string;
}

const TABS: Tab[] = [
  { key: "upi",        label: "UPI",          icon: "flash-outline"   },
  { key: "card",       label: "Card",         icon: "card-outline"    },
  { key: "netbanking", label: "Net Banking",  icon: "globe-outline"   },
  { key: "wallet",     label: "Wallets",      icon: "wallet-outline"  },
];

interface PaymentTabBarProps {
  active:   PaymentTab;
  onChange: (tab: PaymentTab) => void;
}

export default function PaymentTabBar({ active, onChange }: PaymentTabBarProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {TABS.map(tab => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor:     isActive ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon as any}
              size={15}
              color={isActive ? "#fff" : colors.subText}
            />
            <Text style={[styles.label, {
              color:      isActive ? "#fff" : colors.subText,
              fontFamily: isActive ? typography.fontFamily.semiBold : typography.fontFamily.regular,
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
    flexDirection: "row",
    gap:           10,
    paddingHorizontal: 16,
    paddingVertical:   4,
  },
  tab: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 16,
    paddingVertical:   10,
    borderRadius:      12,
    borderWidth:       1.5,
  },
  label: {},
});
