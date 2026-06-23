// ============================================================
// MAP MODE TOGGLE — Find Products | Find Stores  (Apana Store)
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { typography } from "../../theme/typography";

export type MapMode = "products" | "stores";

interface MapModeToggleProps {
  mode:     MapMode;
  onChange: (m: MapMode) => void;
}

export default function MapModeToggle({ mode, onChange }: MapModeToggleProps) {
  return (
    <View style={styles.wrap}>
      {(["products", "stores"] as MapMode[]).map((m) => {
        const active = m === mode;
        return (
          <TouchableOpacity
            key={m}
            style={[styles.seg, active && styles.segActive]}
            onPress={() => onChange(m)}
            activeOpacity={0.85}
          >
            <Text style={[styles.label, { fontFamily: typography.fontFamily.bold }, active ? styles.labelActive : styles.labelIdle]}>
              {m === "products" ? "Find Products" : "Find Stores"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", marginHorizontal: 16, marginBottom: 10, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 4, gap: 4 },
  seg: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 9, borderRadius: 9 },
  segActive: { backgroundColor: "#fff" },
  label: { fontSize: typography.size.sm },
  labelActive: { color: "#0F4C81" },
  labelIdle: { color: "rgba(255,255,255,0.85)" },
});
