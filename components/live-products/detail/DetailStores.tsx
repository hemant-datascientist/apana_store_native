// ============================================================
// DetailStores — the "Availability" tab: every approved shop that stocks
// this exact item, in stock. Cheapest and the store you came from are
// tagged. No fabricated distances — city only until a customer pin is set
// (§19.8 no phantom data). Ranking (current-first, then price) is BE-side.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import type { StockingStore } from "../../../services/liveCatalogService";

interface DetailStoresProps {
  stores: StockingStore[];
}

function rupee(n: number): string {
  return `₹${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

export default function DetailStores({ stores }: DetailStoresProps) {
  const { colors } = useTheme();

  if (stores.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
        Not in stock at any shop right now.
      </Text>
    );
  }

  const cheapest = Math.min(...stores.map((s) => s.price));

  return (
    <View style={styles.list}>
      {stores.map((s) => {
        const low = s.stockQty > 0 && s.stockQty <= 5;
        return (
          <View
            key={s.sellerProductId}
            style={[styles.row, { borderColor: s.isCurrent ? colors.primary : colors.border }]}
          >
            <View style={[styles.icon, { backgroundColor: colors.background }]}>
              <Ionicons name="storefront-outline" size={18} color={colors.primary} />
            </View>

            <View style={styles.mid}>
              <Text
                numberOfLines={1}
                style={[styles.store, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}
              >
                {s.storeName}
              </Text>
              <Text style={[styles.meta, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                {s.city}
                {low ? ` · only ${s.stockQty} left` : ""}
              </Text>
              <View style={styles.tags}>
                {s.isCurrent && (
                  <Text style={[styles.tag, { color: colors.primary, backgroundColor: colors.primary + "18", fontFamily: typography.fontFamily.medium }]}>
                    You're here
                  </Text>
                )}
                {s.price === cheapest && stores.length > 1 && (
                  <Text style={[styles.tag, { color: colors.success, backgroundColor: colors.success + "18", fontFamily: typography.fontFamily.medium }]}>
                    Lowest price
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.priceCol}>
              <Text style={[styles.price, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                {rupee(s.price)}
              </Text>
              {s.dealPrice != null && (
                <Text style={[styles.deal, { color: colors.primary, fontFamily: typography.fontFamily.medium }]}>
                  deal {rupee(s.dealPrice)}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  empty: { fontSize: typography.size.sm, paddingVertical: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  mid: { flex: 1, gap: 2 },
  store: { fontSize: typography.size.sm },
  meta: { fontSize: typography.size.xs },
  tags: { flexDirection: "row", gap: 6, marginTop: 3 },
  tag: {
    fontSize: typography.size.ss,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  priceCol: { alignItems: "flex-end" },
  price: { fontSize: typography.size.md },
  deal: { fontSize: typography.size.ss, marginTop: 1 },
});
