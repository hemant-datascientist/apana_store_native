// ============================================================
// DISCOVERY TOGGLE — Apana Store
//
// Pill-shaped toggle: "Products" | "Stores"
//
// Selected pill: white background + dark text + icon
// Unselected:    transparent + white/muted text + icon
//
// Controls the entire home screen discovery mode —
// determines whether the feed shows products or stores.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import { DiscoveryMode } from "../../../data/homeData";

interface DiscoveryToggleProps {
  mode:     DiscoveryMode;
  onChange: (mode: DiscoveryMode) => void;
}

// Toggle option definition
const OPTIONS: { key: DiscoveryMode; label: string; icon: string }[] = [
  { key: "products", label: "Products", icon: "bag-handle-outline" },
  { key: "stores",   label: "Stores",   icon: "storefront-outline"  },
];

export default function DiscoveryToggle({ mode, onChange }: DiscoveryToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {OPTIONS.map(opt => {
          const active = mode === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => onChange(opt.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={opt.icon as any}
                size={16}
                color={active ? "#0B2D5C" : "rgba(255,255,255,0.75)"}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color:      active ? "#0B2D5C" : "rgba(255,255,255,0.85)",
                    fontFamily: active
                      ? typography.fontFamily.semiBold
                      : typography.fontFamily.medium,
                    fontSize: typography.size.sm,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical:   10,
  },
  track: {
    flexDirection:   "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius:    30,
    padding:         4,
  },
  pill: {
    flex:           1,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            7,
    paddingVertical: 10,
    borderRadius:   26,
  },
  pillActive: {
    backgroundColor: "#fff",
  },
  label: {},
});
