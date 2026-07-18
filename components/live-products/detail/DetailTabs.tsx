// ============================================================
// DetailTabs — horizontal tab bar (Details / Availability / MRP / Company /
// Regulatory / Other …) + the active tab's body. Key/value tabs render a
// generic spec card; the Availability tab renders the stocking-store list.
// Tabs are data-driven so a product with richer GTIN scrape data simply
// grows more tabs — no code change per label.
// ============================================================

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import DetailStores from "./DetailStores";
import type { StockingStore } from "../../../services/liveCatalogService";

export interface KVRow {
  k: string;
  v: string;
}
export type TabDef =
  | { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; kind: "kv"; rows: KVRow[] }
  | { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; kind: "stores"; stores: StockingStore[] };

interface DetailTabsProps {
  tabs: TabDef[];
}

export default function DetailTabs({ tabs }: DetailTabsProps) {
  const { colors } = useTheme();
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;
  const current = tabs[Math.min(active, tabs.length - 1)];

  return (
    <View style={styles.wrap}>
      {/* ── Tab bar ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bar}
      >
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <TouchableOpacity
              key={t.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => setActive(i)}
            >
              <Ionicons name={t.icon} size={20} color={on ? colors.primary : colors.subText} />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: on ? colors.primary : colors.subText,
                    fontFamily: on ? typography.fontFamily.semiBold : typography.fontFamily.medium,
                  },
                ]}
              >
                {t.label}
              </Text>
              <View style={[styles.underline, { backgroundColor: on ? colors.primary : "transparent" }]} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Body ── */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {current.kind === "stores" ? (
          <DetailStores stores={current.stores} />
        ) : (
          current.rows.map((r, i) => (
            <View
              key={`${r.k}-${i}`}
              style={[styles.kvRow, i < current.rows.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
            >
              <Text style={[styles.k, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                {r.k}
              </Text>
              <Text style={[styles.v, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                {r.v}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 18 },
  bar: { gap: 22, paddingHorizontal: 4, paddingBottom: 2 },
  tab: { alignItems: "center", gap: 5, paddingTop: 4 },
  tabLabel: { fontSize: typography.size.sm },
  underline: { height: 3, borderRadius: 2, width: "100%", marginTop: 2 },
  card: { marginTop: 12, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  kvRow: { flexDirection: "row", justifyContent: "space-between", gap: 16, paddingVertical: 13 },
  k: { fontSize: typography.size.md, flex: 1 },
  v: { fontSize: typography.size.md, flex: 1.4, textAlign: "right" },
});
