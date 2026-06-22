// ============================================================
// BRAND DEALS SECTION — Apana Store (Home, All Feed)
//
// Surfaces brand-FUNDED promos (lib/brandPromo.ts) — the Engine-B co-op layer.
// Distinct from Flash Deals (seller-funded): every card carries a "Funded by
// {Brand}" chip and a "Seller paid in full" trust line, because the markdown
// is the BRAND's money, not the kirana's margin. Tapping a card discloses the
// money split transparently (you save / seller receives / brand funds).
//
// Renders nothing when no promo window is live (§19.8 — no phantom deals).
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import SectionHeader  from "./SectionHeader";
import useTheme       from "../../../../theme/useTheme";
import { BrandDeal }  from "../../../../data/brandPromoData";
import {
  brandPromoPrice, brandDiscount, promoEconomics,
} from "../../../../lib/brandPromo";

interface BrandDealsSectionProps {
  deals: BrandDeal[];
}

const ACCENT = "#0F4C81"; // Apana Blue — the platform owns this surface
const CARD_W = 132;
const IMG_H  = 100;

function fmt(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Transparency disclosure — the whole point of the brand-funded model.
function explain(deal: BrandDeal): void {
  const e = promoEconomics(deal.promo, deal.everyday, 1);
  Alert.alert(
    `Funded by ${deal.promo.brand}`,
    `${deal.name}\n\n` +
    `You pay ${fmt(e.customerPays)}  (was ${fmt(deal.everyday)})\n` +
    `You save ${fmt(e.customerSaves)}\n\n` +
    `${deal.storeName} still receives ${fmt(e.sellerReceives)} — the full price.\n` +
    `${deal.promo.brand} funds the discount. The shop's margin is never touched.`,
  );
}

export default function BrandDealsSection({ deals }: BrandDealsSectionProps) {
  const { colors, isDark } = useTheme();

  if (deals.length === 0) return null;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SectionHeader icon="pricetags-outline" title="Brand Deals" accentColor={ACCENT} />
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          Funded by the brand — your shop keeps its full price.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {deals.map((d) => {
          const price = brandPromoPrice(d.promo, d.everyday);
          const off   = brandDiscount(d.promo, d.everyday);
          const pct   = Math.round((off / d.everyday) * 100);
          return (
            <View
              key={d.productId}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: isDark ? colors.border : "#E5EAF0" },
              ]}
            >
              {/* Image + brand-funded badge */}
              <TouchableOpacity
                style={[styles.imgArea, { backgroundColor: d.bg }]}
                activeOpacity={0.85}
                onPress={() => explain(d)}
              >
                <Ionicons name={d.icon as any} size={36} color="rgba(0,0,0,0.20)" />
                <View style={[styles.fundedBadge, { backgroundColor: d.promo.brandColor }]}>
                  <Ionicons name="ribbon-outline" size={9} color="#fff" />
                  <Text style={[styles.fundedText, { fontFamily: typography.fontFamily.semiBold }]}>
                    {pct}% OFF
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Info */}
              <View style={styles.info}>
                {/* Funded-by chip */}
                <View style={[styles.brandChip, { backgroundColor: `${d.promo.brandColor}14` }]}>
                  <Text
                    numberOfLines={1}
                    style={[styles.brandText, { color: d.promo.brandColor, fontFamily: typography.fontFamily.semiBold }]}
                  >
                    Funded by {d.promo.brand}
                  </Text>
                </View>

                <Text numberOfLines={2} style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                  {d.name}
                </Text>
                <Text numberOfLines={1} style={[styles.unit, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                  {d.unit}
                </Text>

                <Text style={[styles.original, { fontFamily: typography.fontFamily.regular }]}>
                  {fmt(d.everyday)}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: ACCENT, fontFamily: typography.fontFamily.bold }]}>
                    {fmt(price)}
                  </Text>
                  <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: ACCENT }]}
                    activeOpacity={0.8}
                    onPress={() => Alert.alert("Added", `${d.name} added to cart.`)}
                  >
                    <Ionicons name="add" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* The Engine-B honesty line */}
                <View style={styles.trustRow}>
                  <Ionicons name="shield-checkmark-outline" size={10} color="#1c7c45" />
                  <Text style={[styles.trustText, { fontFamily: typography.fontFamily.regular }]}>
                    Seller paid in full
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { marginTop: 20 },
  header: { paddingHorizontal: 16 },
  sub:    { fontSize: 11.5, marginTop: -4, marginBottom: 10 },

  scroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },

  card: {
    width:        CARD_W,
    borderRadius: 10,
    overflow:     "hidden",
    borderWidth:  1,
    shadowColor:  "#0F4C81",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation:    2,
  },

  imgArea: {
    width: "100%", height: IMG_H,
    alignItems: "center", justifyContent: "center", position: "relative",
  },
  fundedBadge: {
    position: "absolute", top: 6, right: 6,
    flexDirection: "row", alignItems: "center", gap: 2,
    paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5,
  },
  fundedText: { color: "#fff", fontSize: 8, lineHeight: 10 },

  info: { padding: 7, paddingTop: 6, gap: 1 },

  brandChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, marginBottom: 3,
  },
  brandText: { fontSize: 8.5 },

  name: { fontSize: 11, lineHeight: 14 },
  unit: { fontSize: 9.5, marginBottom: 2 },
  original: { fontSize: 10, color: "#9CA3AF", textDecorationLine: "line-through" },

  priceRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginTop: 3,
  },
  price:  { fontSize: 12 },
  addBtn: { width: 24, height: 24, borderRadius: 6, alignItems: "center", justifyContent: "center" },

  trustRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 5 },
  trustText: { fontSize: 8.5, color: "#1c7c45" },
});
