// ============================================================
// STORE PRODUCT CATEGORIES — Apana Store (Store Detail Component)
//
// Section header + list of product category rows.
// Each row: icon circle | category name + count | chevron.
// Filtered by search query when query is non-empty.
//
// Props:
//   categories  — StoreProductCategory[]
//   storeColor  — hero color for icon accent
//   query       — active search string (filters by label)
//   onSelect    — called when a category row is tapped
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreProductCategory } from "../../data/storeDetailData";

interface StoreProductCategoriesProps {
  categories: StoreProductCategory[];
  storeColor: string;
  query:      string;
  onSelect:   (cat: StoreProductCategory) => void;
}

export default function StoreProductCategories({
  categories, storeColor, query, onSelect,
}: StoreProductCategoriesProps) {
  const { colors } = useTheme();

  const filtered = query.trim()
    ? categories.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : categories;

  return (
    <View>
      {/* ── Section header ── */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, {
          color:      colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.lg,
        }]}>
          Product Categories
        </Text>
        <Text style={[styles.sectionCount, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs,
        }]}>
          {filtered.length} categories
        </Text>
      </View>

      {/* ── Category card ── */}
      {filtered.length > 0 ? (
        <View style={[styles.card, {
          backgroundColor: colors.card,
          borderColor:     colors.border,
        }]}>
          {filtered.map((cat, i) => (
            <View key={cat.key}>
              <TouchableOpacity
                style={styles.row}
                activeOpacity={0.75}
                onPress={() => onSelect(cat)}
              >
                {/* Icon circle */}
                <View style={[styles.iconWrap, { backgroundColor: storeColor + "18" }]}>
                  <Ionicons name={cat.icon as any} size={20} color={storeColor} />
                </View>

                {/* Label + count */}
                <View style={styles.body}>
                  <Text style={[styles.label, {
                    color:      colors.text,
                    fontFamily: typography.fontFamily.medium,
                    fontSize:   typography.size.sm,
                  }]}>
                    {cat.label}
                  </Text>
                  <Text style={[styles.count, {
                    color:      colors.subText,
                    fontFamily: typography.fontFamily.regular,
                    fontSize:   typography.size.xs,
                  }]}>
                    {cat.productCount} products
                  </Text>
                </View>

                {/* Chevron */}
                <Ionicons name="chevron-forward" size={18} color={colors.subText} />
              </TouchableOpacity>

              {/* Divider — hide on last */}
              {i < filtered.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>
      ) : (
        // ── Empty search state ──
        <View style={[styles.empty, {
          backgroundColor: colors.card,
          borderColor:     colors.border,
        }]}>
          <Ionicons name="search-outline" size={28} color={colors.subText} />
          <Text style={[styles.emptyText, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.sm,
          }]}>
            No categories match "{query}"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection:     "row",
    alignItems:        "baseline",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingTop:        4,
    paddingBottom:     10,
  },
  sectionTitle: {},
  sectionCount: {},

  card: {
    marginHorizontal: 16,
    borderRadius:     14,
    borderWidth:      1,
    overflow:         "hidden",
  },
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 14,
    paddingVertical:   14,
    gap:               12,
  },
  iconWrap: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  body:    { flex: 1, gap: 2 },
  label:   {},
  count:   {},
  divider: { height: 1, marginHorizontal: 14 },

  empty: {
    marginHorizontal: 16,
    padding:          28,
    borderRadius:     14,
    borderWidth:      1,
    alignItems:       "center",
    gap:              10,
  },
  emptyText: { textAlign: "center" },
});
