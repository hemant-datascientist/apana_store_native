// ============================================================
// FASHION GENDER TABS — Apana Store
//
// Horizontal row of 4 gender/age selector tabs.
// Men | Women | Boy | Girl
// Each tab: Ionicon silhouette + label.
// Active tab: fashion-maroon accent fill + white icon/label.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import { FashionGender, FashionGenderConfig } from "../../../data/fashionData";

interface FashionGenderTabsProps {
  genders:   FashionGenderConfig[];
  activeKey: FashionGender;
  onChange:  (key: FashionGender) => void;
  accent:    string;  // fashion primary color e.g. #660033
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;

export default function FashionGenderTabs({
  genders, activeKey, onChange, accent,
}: FashionGenderTabsProps) {
  return (
    <View style={styles.root}>
      {genders.map(g => {
        const isActive = g.key === activeKey;
        return (
          <TouchableOpacity
            key={g.key}
            style={[
              styles.tab,
              isActive
                ? { backgroundColor: accent, borderColor: accent }
                : { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
            ]}
            activeOpacity={0.75}
            onPress={() => onChange(g.key)}
          >
            {/* Silhouette icon */}
            <View style={[
              styles.iconWrap,
              { backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "#F3F4F6" },
            ]}>
              <Ionicons
                name={g.icon as any}
                size={26}
                color={isActive ? "#fff" : "#6B7280"}
              />
            </View>

            {/* Label */}
            <Text style={[
              styles.label,
              {
                color:      isActive ? "#fff" : "#374151",
                fontFamily: isActive
                  ? typography.fontFamily.bold
                  : typography.fontFamily.regular,
              },
            ]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const TAB_W = (SW - H_PAD * 2 - 9) / 4;   // 4 tabs with 3 gaps of 3px

const styles = StyleSheet.create({
  root: {
    flexDirection:     "row",
    gap:               3,
    paddingHorizontal: H_PAD,
    marginTop:         16,
    marginBottom:      4,
  },

  tab: {
    width:          TAB_W,
    alignItems:     "center",
    paddingVertical: 10,
    borderRadius:   12,
    borderWidth:    1,
    gap:            6,
  },

  iconWrap: {
    width:          44,
    height:         44,
    borderRadius:   22,
    alignItems:     "center",
    justifyContent: "center",
  },

  label: {
    fontSize:      11,
    letterSpacing: 0.1,
  },
});
