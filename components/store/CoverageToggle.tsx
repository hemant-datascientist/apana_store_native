// ============================================================
// COVERAGE TOGGLE — Apana Store (Customer App)
//
// Two-segment Nearest | Long control bound to CoverageContext, so
// flipping it here updates the same preference set in Profile. Used
// on the Stores map ("show coverage to the customer", Testing/README)
// and reusable anywhere the customer should see/change their scope.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import {
  useCoverage, COVERAGE_META, COVERAGE_ORDER,
} from "../../context/CoverageContext";

interface CoverageToggleProps {
  // When true, render the "Showing stores in your {scope}" caption below
  // the pill so the customer reads what the choice actually does.
  showCaption?: boolean;
}

export default function CoverageToggle({ showCaption = true }: CoverageToggleProps) {
  const { colors } = useTheme();
  const { coverage, meta, setCoverage } = useCoverage();

  return (
    <View style={styles.wrap}>
      <View style={[styles.segment, { backgroundColor: colors.background, borderColor: colors.border }]}>
        {COVERAGE_ORDER.map((key) => {
          const opt    = COVERAGE_META[key];
          const active = key === coverage;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.seg, active && { backgroundColor: colors.primary }]}
              onPress={() => setCoverage(key)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={opt.icon as any}
                size={13}
                color={active ? "#fff" : colors.subText}
              />
              <Text style={[styles.segLabel, {
                color:      active ? "#fff" : colors.subText,
                fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.medium,
                fontSize:   typography.size.xs,
              }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {showCaption && (
        <Text style={[styles.caption, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 11 }]}>
          Showing stores in your {meta.scopeWord}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop:        10,
    gap:               6,
  },
  segment: {
    flexDirection: "row",
    borderRadius:  20,
    borderWidth:   1,
    padding:       3,
    alignSelf:     "flex-start",
    gap:           3,
  },
  seg: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 14,
    paddingVertical:   6,
    borderRadius:      16,
  },
  segLabel: {},
  caption: {
    marginLeft: 2,
  },
});
