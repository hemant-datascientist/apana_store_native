// ============================================================
// PRODUCT SELLERS — Apana Store
//
// The multi-seller block: one product, every nearby store that
// stocks it, sorted Nearest → Far. Each seller sets their own
// price, so the customer trades off distance vs price vs rating.
//
// Sorting is done here, not trusted from data — "Nearest to Far"
// is this component's contract.
// ============================================================

import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { ProductSeller, discountPercent } from "../../data/productDetailData";

interface ProductSellersProps {
  sellers:  ProductSeller[];
  onAdd:    (seller: ProductSeller) => void;
  onSelect?: (seller: ProductSeller) => void;
}

// Sub-km reads as metres — "400 m" is more legible than "0.4 km" at a glance.
function distanceLabel(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function etaLabel(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h}h ${m}m`;
}

export default function ProductSellers({ sellers, onAdd, onSelect }: ProductSellersProps) {
  const { colors } = useTheme();

  // Sort nearest → far (copy, never mutate the source array).
  const ordered = useMemo(
    () => [...sellers].sort((a, b) => a.distanceKm - b.distanceKm),
    [sellers],
  );

  // Best price / fastest computed from IN-STOCK sellers only — a badge on a
  // seller you cannot buy from is noise.
  const available   = ordered.filter(s => s.inStock);
  const lowestPrice = available.length ? Math.min(...available.map(s => s.price))   : 0;
  const fastestEta  = available.length ? Math.min(...available.map(s => s.etaMins)) : 0;

  if (ordered.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header ── */}
      <View style={styles.titleRow}>
        <Ionicons name="storefront-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Available Near You
        </Text>
        <View style={[styles.countPill, { backgroundColor: colors.primary + "18" }]}>
          <Text style={[styles.countText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            {available.length} {available.length === 1 ? "store" : "stores"}
          </Text>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
        Same product, sorted nearest to farthest. Each store sets its own price.
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Seller rows ── */}
      {ordered.map((s, i) => {
        const disc       = discountPercent(s.price, s.mrp);
        const isNearest  = i === 0 && s.inStock;
        const isCheapest = s.inStock && s.price   === lowestPrice && available.length > 1;
        const isFastest  = s.inStock && s.etaMins === fastestEta  && available.length > 1;

        return (
          <View key={s.id}>
            {i > 0 && <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />}

            <TouchableOpacity
              style={[styles.row, !s.inStock && styles.rowDim]}
              onPress={() => onSelect?.(s)}
              activeOpacity={onSelect ? 0.75 : 1}
              disabled={!onSelect}
            >
              {/* Distance rail — the axis this whole list is ordered on */}
              <View style={[styles.distRail, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.distValue, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                  {distanceLabel(s.distanceKm)}
                </Text>
                <Text style={[styles.distEta, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                  {etaLabel(s.etaMins)}
                </Text>
              </View>

              {/* Store identity */}
              <View style={styles.body}>
                <Text
                  style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
                  numberOfLines={1}
                >
                  {s.storeName}
                </Text>

                <View style={styles.metaRow}>
                  <View style={[styles.typeBadge, { backgroundColor: s.storeTypeBg }]}>
                    <Text style={[styles.typeText, { color: s.storeTypeColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                      {s.storeType}
                    </Text>
                  </View>
                  <Ionicons name="star" size={10} color="#F59E0B" />
                  <Text style={[styles.meta, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                    {s.rating} ({s.reviewCount})
                  </Text>
                </View>

                {/* Why-pick-this-one tags */}
                {(isNearest || isCheapest || isFastest) && (
                  <View style={styles.tagRow}>
                    {isNearest && (
                      <View style={[styles.tag, { backgroundColor: "#DBEAFE" }]}>
                        <Ionicons name="navigate" size={9} color="#1D4ED8" />
                        <Text style={[styles.tagText, { color: "#1D4ED8", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                          Nearest
                        </Text>
                      </View>
                    )}
                    {isCheapest && (
                      <View style={[styles.tag, { backgroundColor: "#DCFCE7" }]}>
                        <Ionicons name="pricetag" size={9} color="#15803D" />
                        <Text style={[styles.tagText, { color: "#15803D", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                          Lowest price
                        </Text>
                      </View>
                    )}
                    {isFastest && !isNearest && (
                      <View style={[styles.tag, { backgroundColor: "#FEF3C7" }]}>
                        <Ionicons name="flash" size={9} color="#B45309" />
                        <Text style={[styles.tagText, { color: "#B45309", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                          Fastest
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {s.inStock && s.stockCount <= 5 && (
                  <Text style={[styles.lowStock, { color: "#B45309", fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
                    Only {s.stockCount} left
                  </Text>
                )}
              </View>

              {/* Price + action */}
              <View style={styles.priceCol}>
                <Text style={[styles.price, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
                  ₹{s.price}
                </Text>
                {disc > 0 && (
                  <View style={styles.mrpRow}>
                    <Text style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                      ₹{s.mrp}
                    </Text>
                    <Text style={[styles.disc, { color: "#15803D", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                      {disc}% off
                    </Text>
                  </View>
                )}

                {s.inStock ? (
                  <TouchableOpacity
                    style={[styles.addBtn, { borderColor: colors.primary, backgroundColor: colors.primary + "12" }]}
                    onPress={() => onAdd(s)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="add" size={13} color={colors.primary} />
                    <Text style={[styles.addText, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                      Add
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.oosPill, { backgroundColor: colors.border }]}>
                    <Text style={[styles.oosText, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                      Out of stock
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
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
    paddingTop:        12,
  },
  title: { flex: 1 },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },
  countText: {},
  subtitle: {
    paddingHorizontal: 16,
    paddingTop:        4,
    paddingBottom:     12,
    lineHeight:        16,
  },
  divider:    { height: 1 },
  rowDivider: { height: 1, marginLeft: 16 },
  row: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               12,
    paddingHorizontal: 16,
    paddingVertical:   14,
  },
  rowDim: { opacity: 0.55 },
  distRail: {
    width:          58,
    paddingVertical: 8,
    borderRadius:   10,
    borderWidth:    1,
    alignItems:     "center",
    gap:            2,
  },
  distValue: {},
  distEta:   {},
  body:      { flex: 1, gap: 5 },
  storeName: {},
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
    flexWrap:      "wrap",
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  typeText: {},
  meta:     {},
  tagRow: {
    flexDirection: "row",
    gap:           5,
    flexWrap:      "wrap",
  },
  tag: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               3,
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  tagText:  {},
  lowStock: {},
  priceCol: {
    alignItems: "flex-end",
    gap:        3,
    flexShrink: 0,
  },
  price:  {},
  mrpRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  mrp:    { textDecorationLine: "line-through" },
  disc:   {},
  addBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               2,
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      8,
    borderWidth:       1,
    marginTop:         3,
  },
  addText: {},
  oosPill: {
    paddingHorizontal: 8,
    paddingVertical:   5,
    borderRadius:      8,
    marginTop:         3,
  },
  oosText: {},
});
