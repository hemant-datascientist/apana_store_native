// ============================================================
// FASHION GENDER TABS — Apana Store
//
// 4 equal-width gender/age tabs:
//   Men | Women | Boy (Kids) | Girl (Kids)
//
// Each tab: circular icon + main label + optional subLabel.
// Active: fashion-maroon fill + white text/icon.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import { FashionGender, FashionGenderConfig } from "../../../data/fashionData";

interface FashionGenderTabsProps {
  genders:   FashionGenderConfig[];
  activeKey: FashionGender;
  onChange:  (key: FashionGender) => void;
  accent:    string;
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const GAPS          = 3 * 3;   // 3 gaps × 3px
const TAB_W         = Math.floor((SW - H_PAD * 2 - GAPS) / 4);

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
              { width: TAB_W },
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
              { backgroundColor: isActive ? "rgba(255,255,255,0.18)" : "#EBEBEB" },
            ]}>
              <Ionicons
                name={g.icon as any}
                size={24}
                color={isActive ? "#fff" : "#6B7280"}
              />
            </View>

            {/* Main label */}
            <Text style={[
              styles.label,
              {
                color:      isActive ? "#fff" : "#374151",
                fontFamily: isActive
                  ? typography.fontFamily.bold
                  : typography.fontFamily.medium,
              },
            ]}>
              {g.label}
            </Text>

            {/* SubLabel — "Kids" badge for Boy and Girl */}
            {g.subLabel && (
              <View style={[
                styles.kidsBadge,
                { backgroundColor: isActive ? "rgba(255,255,255,0.22)" : "#F3F4F6" },
              ]}>
                <Text style={[
                  styles.kidsText,
                  {
                    color:      isActive ? "#fff" : "#6B7280",
                    fontFamily: typography.fontFamily.semiBold,
                  },
                ]}>
                  {g.subLabel}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection:     "row",
    gap:               3,
    paddingHorizontal: H_PAD,
    marginTop:         16,
    marginBottom:      4,
  },

  tab: {
    alignItems:      "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius:    12,
    borderWidth:     1,
    gap:             4,
  },

  iconWrap: {
    width:          40,
    height:         40,
    borderRadius:   20,
    alignItems:     "center",
    justifyContent: "center",
  },

  label: {
    fontSize:      11.5,
    letterSpacing: 0.1,
  },

  kidsBadge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  kidsText: {
    fontSize: 9,
  },
});
