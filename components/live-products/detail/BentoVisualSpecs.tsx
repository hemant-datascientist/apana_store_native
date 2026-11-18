// ============================================================
// BentoVisualSpecs — "From the Manufacturer" cards.
//
// Shows ONLY the lines the brand entered in the registry (bento_showcase,
// one card per line, "Card 1:" prefixes stripped). No entry = section hidden.
//
// The earlier version drew a phone mock-up (camera lenses, gaming, battery)
// for every product and filled it with category guesses ("5000 mAh",
// "100% Genuine", "Guaranteed"). A card may only say what the brand said.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import { brandBentoLines } from "./brandContent";

interface BentoVisualSpecsProps {
  attributes?: Record<string, unknown>;
}

export default function BentoVisualSpecs({ attributes }: BentoVisualSpecsProps) {
  const { colors } = useTheme();
  const lines = brandBentoLines(attributes);
  if (lines.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="view-dashboard-variant-outline" size={20} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>From the Manufacturer</Text>
      </View>

      <View style={styles.grid}>
        {lines.map((line, idx) => (
          <View
            key={`${idx}-${line}`}
            style={[
              styles.card,
              // First card spans the row when the count is odd, so the grid has no hole.
              lines.length % 2 === 1 && idx === 0 ? styles.cardWide : null,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardText, { color: colors.text }]}>{line}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 18 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { flexBasis: "47%", flexGrow: 1, borderWidth: 1, borderRadius: 14, padding: 14, minHeight: 90 },
  cardWide: { flexBasis: "100%" },
  cardText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, lineHeight: 20 },
});
