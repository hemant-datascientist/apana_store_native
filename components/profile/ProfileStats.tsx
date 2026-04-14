// ============================================================
// PROFILE STATS — Apana Store (Customer App)
//
// Horizontal row of 3 stat pills: Orders · Fav Stores · Rides.
// Each pill: big number + label + icon.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProfileStat } from "../../data/profileData";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface ProfileStatsProps {
  stats: ProfileStat[];
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      {stats.map((stat, i) => (
        <React.Fragment key={stat.key}>
          {/* Divider between items */}
          {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}

          <View style={styles.stat}>
            <Ionicons name={stat.icon as any} size={18} color={colors.primary} />
            <Text style={[styles.value, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              {stat.value}
            </Text>
            <Text style={[styles.label, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {stat.label}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:   "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  stat: {
    flex:           1,
    alignItems:     "center",
    gap:            3,
  },
  value: {
    lineHeight: 26,
  },
  label: {
    lineHeight: 16,
  },
  divider: {
    width:      1,
    marginVertical: 4,
  },
});
