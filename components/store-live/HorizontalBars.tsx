// ============================================================
// HORIZONTAL BARS — Apana Store (Store Live Screen)
//
// List of colored horizontal progress bars, one per store type.
// Each row: colored bar (width ∝ percentage) + label + pct %.
// Renders inside a themed card, matching the design.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StoreTypeData, TOTAL_LIVE } from "../../data/storeLiveData";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface HorizontalBarsProps {
  data: StoreTypeData[];
  totalLive?: number;
}

export default function HorizontalBars({ data, totalLive }: HorizontalBarsProps) {
  const { colors } = useTheme();
  const maxCount   = Math.max(...data.map(d => d.liveCount));
  const currentTotal = totalLive || TOTAL_LIVE;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {data.map((item, i) => {
        const pct      = (item.liveCount / currentTotal) * 100;
        const barWidth = (item.liveCount / maxCount) * 100; // relative to widest bar
        const isLast   = i === data.length - 1;

        return (
          <View key={item.key}>
            <View style={styles.row}>
              {/* Bar + label */}
              <View style={styles.barWrap}>
                <View style={[styles.bar, { backgroundColor: item.color, width: `${barWidth}%` }]}>
                  <Text
                    numberOfLines={1}
                    style={[styles.barLabel, {
                      fontFamily: typography.fontFamily.medium,
                      fontSize:   typography.size.xs,
                    }]}
                  >
                    {item.fullLabel}
                  </Text>
                </View>
              </View>

              {/* Percentage */}
              <Text style={[styles.pct, {
                color:      colors.subText,
                fontFamily: typography.fontFamily.semiBold,
                fontSize:   typography.size.xs,
              }]}>
                {pct.toFixed(1)}%
              </Text>
            </View>

            {!isLast && <View style={[styles.sep, { backgroundColor: colors.border }]} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius:  14,
    borderWidth:    1,
    overflow:      "hidden",
    marginHorizontal: 16,
  },
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:             8,
    paddingRight:   12,
  },
  barWrap: {
    flex:          1,
    paddingVertical: 0,
  },
  bar: {
    minWidth:      60,
    paddingVertical:  9,
    paddingLeft:    10,
    paddingRight:    6,
    justifyContent: "center",
  },
  barLabel: {
    color:      "#fff",
    lineHeight: 16,
  },
  pct: {
    width:     40,
    textAlign: "right",
  },
  sep: {
    height: 1,
  },
});
