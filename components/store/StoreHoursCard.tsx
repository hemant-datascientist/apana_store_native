// ============================================================
// STORE HOURS CARD — Apana Store (Store Detail Component)
//
// Weekly opening hours table.
// Today's row is highlighted in bold with primary color.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreHours, todayDayName } from "../../data/storeDetailData";

interface StoreHoursCardProps {
  hours: StoreHours[];
}

export default function StoreHoursCard({ hours }: StoreHoursCardProps) {
  const { colors } = useTheme();
  const today      = todayDayName();

  return (
    <View style={[styles.card, {
      backgroundColor: colors.card,
      borderColor:     colors.border,
    }]}>
      {/* ── Header ── */}
      <View style={styles.cardHeader}>
        <Ionicons name="time-outline" size={18} color={colors.primary} />
        <Text style={[styles.cardTitle, {
          color:      colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.md,
        }]}>
          Opening Hours
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Rows ── */}
      {hours.map((row, i) => {
        const isToday = row.day === today;
        return (
          <View
            key={row.day}
            style={[
              styles.row,
              isToday && { backgroundColor: colors.primary + "0D" },
              i < hours.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border + "80" },
            ]}
          >
            <Text style={[styles.day, {
              color:      isToday ? colors.primary : colors.text,
              fontFamily: isToday ? typography.fontFamily.bold : typography.fontFamily.regular,
              fontSize:   typography.size.sm,
            }]}>
              {row.day}
              {isToday && "  ← Today"}
            </Text>

            <Text style={[styles.time, {
              color:      isToday ? colors.primary : colors.subText,
              fontFamily: isToday ? typography.fontFamily.semiBold : typography.fontFamily.regular,
              fontSize:   typography.size.sm,
            }]}>
              {row.open}  –  {row.close}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius:     14,
    borderWidth:      1,
    overflow:         "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    padding:       14,
    paddingBottom: 12,
  },
  cardTitle: {},
  divider:   { height: 1 },

  row: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 14,
    paddingVertical:   11,
  },
  day:  { flex: 1 },
  time: { textAlign: "right" },
});
