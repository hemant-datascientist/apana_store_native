// ============================================================
// AscCategorySection — one ASC store class: header (icon + name + the
// class's real tagline) and a 2-column grid of its store types.
//
// Types carry no glyph of their own in ASC, so tiles use the class icon —
// nothing invented. Tap opens the store-type detail.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import type { AscBrowseGroup } from "../../../hooks/useAscBrowser";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 12;
const COLS = 2;
const COL_GAP = 8;
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - COL_GAP * (COLS - 1)) / COLS);

interface AscCategorySectionProps {
  group: AscBrowseGroup;
  accent: string;
  onPress: (code: string) => void;
}

function AscCategorySection({ group, accent, onPress }: AscCategorySectionProps) {
  const { colors } = useTheme();
  const { cls, types } = group;

  return (
    <View style={styles.section}>
      {/* Class header — name + the taxonomy's own tagline */}
      <View style={[styles.header, { borderLeftColor: accent }]}>
        <Text style={styles.icon}>{cls.icon}</Text>
        <View style={styles.headText}>
          <Text style={[styles.title, {
            color: colors.text,
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.size.md,
          }]}>
            {cls.name}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.tagline, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}
          >
            {cls.tagline}
          </Text>
        </View>
        <Text style={[styles.count, { color: accent, fontFamily: typography.fontFamily.bold }]}>
          {types.length}
        </Text>
      </View>

      {/* Store types */}
      <View style={styles.grid}>
        {types.map((t) => (
          <TouchableOpacity
            key={t.code}
            style={[styles.card, { width: CARD_WIDTH, backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.75}
            onPress={() => onPress(t.code)}
          >
            <Text style={styles.tileIcon}>{cls.icon}</Text>
            <View style={styles.cardText}>
              <Text
                numberOfLines={2}
                style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.medium }]}
              >
                {t.name}
              </Text>
              {t.subcategories.length > 0 && (
                <Text
                  numberOfLines={1}
                  style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}
                >
                  {t.subcategories.length} categories
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  icon: { fontSize: 22 },
  headText: { flex: 1 },
  title: {},
  tagline: { fontSize: typography.size.xs, marginTop: 2, lineHeight: 15 },
  count: { fontSize: typography.size.md },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: COL_GAP,
    paddingHorizontal: H_PADDING,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
  },
  tileIcon: { fontSize: 18 },
  cardText: { flex: 1 },
  name: { fontSize: typography.size.xs, lineHeight: 15 },
  sub: { fontSize: typography.size.ss, marginTop: 2 },
});

export default React.memo(AscCategorySection);
