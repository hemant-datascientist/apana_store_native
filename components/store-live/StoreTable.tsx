// ============================================================
// STORE TABLE — Apana Store (Store Live Screen)
//
// Data table: Types of Stores | Live | Close Now
// Footer: Total Stores Online row with highlighted count.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StoreTypeData, TOTAL_LIVE } from "../../data/storeLiveData";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface StoreTableProps {
  data: StoreTypeData[];
}

export default function StoreTable({ data }: StoreTableProps) {
  const { colors } = useTheme();

  const totalClosed = data.reduce((s, d) => s + d.closedCount, 0);

  const headerCellStyle = [styles.headerCell, {
    color:      "#fff",
    fontFamily: typography.fontFamily.semiBold,
    fontSize:   typography.size.xs,
  }];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header row ── */}
      <View style={[styles.headerRow, { backgroundColor: "#1E3A5F" }]}>
        <Text style={[headerCellStyle, styles.colLabel]}>Types of Stores</Text>
        <Text style={[headerCellStyle, styles.colNum, { color: "#22C55E" }]}>Live</Text>
        <Text style={[headerCellStyle, styles.colNum, { color: "#EF4444" }]}>Close Now</Text>
      </View>

      {/* ── Data rows ── */}
      {data.map((item, i) => {
        const isEven = i % 2 === 0;
        return (
          <View
            key={item.key}
            style={[
              styles.dataRow,
              { backgroundColor: isEven ? colors.background : colors.card },
            ]}
          >
            {/* Color dot + label */}
            <View style={styles.labelRow}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text
                numberOfLines={1}
                style={[styles.colLabel, {
                  color:      colors.text,
                  fontFamily: typography.fontFamily.regular,
                  fontSize:   typography.size.xs,
                }]}
              >
                {item.fullLabel}
              </Text>
            </View>

            {/* Live count */}
            <Text style={[styles.colNum, {
              color:      "#22C55E",
              fontFamily: typography.fontFamily.bold,
              fontSize:   typography.size.sm,
            }]}>
              {item.liveCount}
            </Text>

            {/* Closed count */}
            <Text style={[styles.colNum, {
              color:      item.closedCount > 0 ? "#EF4444" : colors.subText,
              fontFamily: typography.fontFamily.bold,
              fontSize:   typography.size.sm,
            }]}>
              {item.closedCount}
            </Text>
          </View>
        );
      })}

      {/* ── Total row ── */}
      <View style={[styles.totalRow, { backgroundColor: "#1E3A5F" }]}>
        <Text style={[styles.colLabel, {
          color:      "#fff",
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.xs,
        }]}>
          Total Stores Online
        </Text>
        <Text style={[styles.colNum, {
          color:      "#22C55E",
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.md,
        }]}>
          {TOTAL_LIVE}
        </Text>
        <Text style={[styles.colNum, {
          color:      "#EF4444",
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.sm,
        }]}>
          {totalClosed}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius:     14,
    borderWidth:       1,
    overflow:         "hidden",
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingVertical:   10,
    paddingHorizontal: 12,
  },
  dataRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingVertical:   10,
    paddingHorizontal: 12,
  },
  totalRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingVertical:   12,
    paddingHorizontal: 12,
  },
  labelRow: {
    flex:          1,
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
    marginRight:   4,
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: 4,
    flexShrink:   0,
  },
  colLabel: {
    flex: 1,
  },
  colNum: {
    width:     54,
    textAlign: "center",
  },
});
