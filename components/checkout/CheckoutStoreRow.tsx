// ============================================================
// CHECKOUT STORE ROW — Apana Store
//
// Per-store summary card on the checkout screen.
// Displays: store name + type, fulfillment badge, ETA chip,
// item count + subtotal.
// Tapping expands to show individual item list.
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { CartStore, DELIVERY_FEE } from "../../data/cartData";
import { FULFILLMENT_DISPLAY, formatEta } from "../../data/checkoutData";

interface CheckoutStoreRowProps {
  store: CartStore;
}

export default function CheckoutStoreRow({ store }: CheckoutStoreRowProps) {
  const { colors }       = useTheme();
  const [expanded, setExpanded] = useState(false);

  // ── Subtotal for this store ──────────────────────────────
  const subtotal      = store.items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee   = DELIVERY_FEE[store.fulfillment];
  const totalItems    = store.items.reduce((s, i) => s + i.qty, 0);
  const fulfillCfg    = FULFILLMENT_DISPLAY[store.fulfillment];
  const etaText       = formatEta(store.fulfillment);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Store header ── */}
      <TouchableOpacity
        style={styles.storeHeader}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.75}
      >
        {/* Store icon */}
        <View style={[styles.storeIcon, { backgroundColor: store.typeBg }]}>
          <Ionicons name="storefront-outline" size={18} color={store.typeColor} />
        </View>

        {/* Store name + type */}
        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
            numberOfLines={1}>
            {store.name}
          </Text>
          <View style={[styles.typePill, { backgroundColor: store.typeBg }]}>
            <Text style={[styles.typeText, { color: store.typeColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
              {store.type}
            </Text>
          </View>
        </View>

        {/* Subtotal + expand toggle */}
        <View style={styles.headerRight}>
          <Text style={[styles.subtotal, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            ₹{subtotal}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.subText}
          />
        </View>
      </TouchableOpacity>

      {/* ── Fulfillment + ETA row ── */}
      <View style={[styles.metaRow, { borderTopColor: colors.border }]}>

        {/* Fulfillment badge */}
        <View style={[styles.fulfillBadge, { backgroundColor: fulfillCfg.bg }]}>
          <Ionicons name={fulfillCfg.icon as any} size={12} color={fulfillCfg.color} />
          <Text style={[styles.fulfillText, { color: fulfillCfg.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {fulfillCfg.label}
          </Text>
        </View>

        {/* ETA chip */}
        <View style={[styles.etaChip, { backgroundColor: colors.background }]}>
          <Ionicons name="time-outline" size={12} color={colors.primary} />
          <Text style={[styles.etaText, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            {etaText}
          </Text>
        </View>

        {/* Item count */}
        <Text style={[styles.itemCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {totalItems} item{totalItems > 1 ? "s" : ""}
        </Text>

        {/* Delivery fee */}
        {deliveryFee > 0 ? (
          <Text style={[styles.fee, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            +₹{deliveryFee} delivery
          </Text>
        ) : (
          <Text style={[styles.fee, { color: "#16A34A", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Free delivery
          </Text>
        )}
      </View>

      {/* ── Expanded item list ── */}
      {expanded && (
        <View style={[styles.itemList, { borderTopColor: colors.border }]}>
          {store.items.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                idx < store.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              {/* Item image placeholder */}
              <View style={[styles.itemImg, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={20} color="rgba(0,0,0,0.2)" />
              </View>

              {/* Name + unit */}
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}
                  numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.itemUnit, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                  {item.unit}
                </Text>
              </View>

              {/* Qty + price */}
              <View style={styles.itemRight}>
                <Text style={[styles.itemQty, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  ×{item.qty}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                  ₹{item.price * item.qty}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },

  // Store header row
  storeHeader: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    padding:           12,
  },
  storeIcon: {
    width:          38,
    height:         38,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  storeInfo: { flex: 1, gap: 3 },
  storeName: {},
  typePill: {
    alignSelf:         "flex-start",
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
  },
  typeText: {},
  headerRight: {
    alignItems:  "flex-end",
    gap:         4,
  },
  subtotal: {},

  // Fulfillment + ETA meta row
  metaRow: {
    flexDirection:     "row",
    alignItems:        "center",
    flexWrap:          "wrap",
    gap:               7,
    paddingHorizontal: 12,
    paddingVertical:   10,
    borderTopWidth:    1,
  },
  fulfillBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      20,
  },
  fulfillText: {},
  etaChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      20,
  },
  etaText:   {},
  itemCount: {},
  fee:       { marginLeft: "auto" },

  // Expanded item list
  itemList: {
    borderTopWidth: 1,
  },
  itemRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    paddingHorizontal: 12,
    paddingVertical:   9,
  },
  itemImg: {
    width:          42,
    height:         42,
    borderRadius:   8,
    alignItems:     "center",
    justifyContent: "center",
  },
  itemInfo:  { flex: 1, gap: 2 },
  itemName:  { lineHeight: 16 },
  itemUnit:  {},
  itemRight: { alignItems: "flex-end", gap: 2 },
  itemQty:   {},
  itemPrice: {},
});
