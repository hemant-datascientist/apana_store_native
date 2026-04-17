// ============================================================
// STORE DISCOVERY TABS — Apana Store (Customer App)
//
// Replaces CategoryScroll when discovery mode = "stores".
// Five store discovery modes arranged in a horizontal row,
// each as a square icon tile + label.
//
// Sits in the dark navy hero, same position as CategoryScroll.
//
// Tabs: Nearby · Map View · Wholesale · B2C · Service Based
// Active:   white icon + white semiBold label + bottom dot
// Inactive: semi-transparent white icon + regular label
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";

export type StoreTab = "nearby" | "map_view" | "wholesale" | "b2c" | "service_based";

interface StoreDiscoveryTabsProps {
  activeTab: StoreTab;
  onChange:  (tab: StoreTab) => void;
}

const TABS: { key: StoreTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "nearby",       label: "Nearby",       icon: "location-outline"    },
  { key: "map_view",     label: "Map View",     icon: "map-outline"         },
  { key: "wholesale",    label: "Wholesale",    icon: "business-outline"    },
  { key: "b2c",          label: "B2C",          icon: "storefront-outline"  },
  { key: "service_based",label: "Service Based",icon: "construct-outline"   },
];

export default function StoreDiscoveryTabs({ activeTab, onChange }: StoreDiscoveryTabsProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        style={styles.scroll}
      >
        {TABS.map(tab => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.item}
              onPress={() => onChange(tab.key)}
              activeOpacity={0.7}
            >
              {/* Icon tile */}
              <View style={[
                styles.iconTile,
                { backgroundColor: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)" },
              ]}>
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color={active ? "#fff" : "rgba(255,255,255,0.55)"}
                />
              </View>

              {/* Label */}
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  {
                    color:      active ? "#fff" : "rgba(255,255,255,0.55)",
                    fontFamily: active
                      ? typography.fontFamily.semiBold
                      : typography.fontFamily.regular,
                    fontSize: typography.size.xs,
                  },
                ]}
              >
                {tab.label}
              </Text>

              {/* Active dot */}
              {active && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth:  1,
    borderTopColor:  "rgba(255,255,255,0.10)",
  },
  scroll: {},
  list: {
    paddingHorizontal: 10,
    paddingVertical:   12,
    gap:               6,
  },
  item: {
    alignItems:        "center",
    gap:                6,
    paddingHorizontal: 10,
    minWidth:           72,
  },
  iconTile: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  label: {
    textAlign:     "center",
    letterSpacing: 0.1,
  },
  dot: {
    width:           4,
    height:          4,
    borderRadius:    2,
    backgroundColor: "#fff",
    marginTop:       2,
  },
});
