// ============================================================
// PRODUCT HIGHLIGHTS — Apana Store
//
// Description paragraph + bullet list of key product features.
// "Read more" toggle collapses long descriptions.
// ============================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface ProductHighlightsProps {
  description: string;
  highlights:  string[];
}

export default function ProductHighlights({ description, highlights }: ProductHighlightsProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const isLong     = description.length > 180;
  const shortDesc  = isLong && !expanded ? description.slice(0, 180) + "…" : description;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── About this product ── */}
      <View style={styles.titleRow}>
        <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          About this Product
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.body}>
        {/* Description */}
        <Text style={[styles.desc, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
          {shortDesc}
        </Text>
        {isLong && (
          <TouchableOpacity onPress={() => setExpanded(e => !e)}>
            <Text style={[styles.readMore, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {expanded ? "Read less" : "Read more"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Key highlights */}
        {highlights.length > 0 && (
          <>
            <Text style={[styles.highlightTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Key Highlights
            </Text>
            {highlights.map((h, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.bulletText, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
                  {h}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  title:   {},
  divider: { height: 1 },
  body: {
    padding: 16,
    gap:     12,
  },
  desc:           { lineHeight: 22 },
  readMore:       { marginTop: -4 },
  highlightTitle: { marginTop: 4 },
  bulletRow: {
    flexDirection:  "row",
    alignItems:     "flex-start",
    gap:            10,
  },
  bullet: {
    width:        6,
    height:       6,
    borderRadius: 3,
    marginTop:    7,
    flexShrink:   0,
  },
  bulletText: { flex: 1, lineHeight: 21 },
});
