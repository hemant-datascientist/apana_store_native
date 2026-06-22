// ============================================================
// CART STORE CARD — Apana Store
//
// Full card for one store in the cart:
//   - Store header (icon, name, type badge, subtotal)
//   - CartFulfillmentSelector
//   - CartItemRow × N
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { CartStore, FulfillmentMode, storeSubtotal } from "../../data/cartData";
import { resolveStoreDiscount, isItemUnlocked } from "../../lib/discount";
import CartFulfillmentSelector from "./CartFulfillmentSelector";
import CartDiscountBar         from "./CartDiscountBar";
import CartItemRow             from "./CartItemRow";

interface CartStoreCardProps {
  store:           CartStore;
  onUpdateQty:     (storeId: string, itemId: string, delta: number) => void;
  onRemoveItem:    (storeId: string, itemId: string) => void;
  onSetFulfillment:(storeId: string, mode: FulfillmentMode) => void;
}

export default function CartStoreCard({
  store, onUpdateQty, onRemoveItem, onSetFulfillment,
}: CartStoreCardProps) {
  const { colors } = useTheme();
  const subtotal   = storeSubtotal(store);
  const disc       = resolveStoreDiscount(store);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Store header ── */}
      <View style={styles.storeHeader}>
        <View style={[styles.storeIconWrap, { backgroundColor: store.typeBg }]}>
          <Ionicons name="storefront-outline" size={18} color={store.typeColor} />
        </View>

        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
            numberOfLines={1}>
            {store.name}
          </Text>
          <View style={[styles.typePill, { backgroundColor: store.typeBg }]}>
            <Text style={[styles.typeText, { color: store.typeColor, fontFamily: typography.fontFamily.semiBold, fontSize: 10 }]}>
              {store.type}
            </Text>
          </View>
        </View>

        {/* Any saving (stop-loss floor OR brand-funded) → show charged with everyday struck through */}
        {disc.charged < subtotal ? (
          <View style={styles.priceCol}>
            <Text style={[styles.strike, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              ₹{subtotal}
            </Text>
            <Text style={[styles.subtotal, { color: "#15803D", fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              ₹{disc.charged}
            </Text>
          </View>
        ) : (
          <Text style={[styles.subtotal, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            ₹{subtotal}
          </Text>
        )}
      </View>

      {/* ── Fulfillment mode selector ── */}
      <CartFulfillmentSelector
        storeId={store.id}
        fulfillment={store.fulfillment}
        onSelect={onSetFulfillment}
      />

      {/* ── Stop-loss discount nudge / unlocked savings ── */}
      <CartDiscountBar disc={disc} />

      {/* ── Item rows ── each item unlocks on its OWN trailing threshold ── */}
      {store.items.map((item, idx) => (
        <CartItemRow
          key={item.id}
          item={item}
          storeId={store.id}
          isLast={idx === store.items.length - 1}
          unlocked={isItemUnlocked(item, disc.subtotal, disc.threshold)}
          onUpdateQty={onUpdateQty}
          onRemove={onRemoveItem}
        />
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },
  storeHeader: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    padding:           12,
  },
  storeIconWrap: {
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
  typeText:  {},
  subtotal:  {},
  priceCol:  { alignItems: "flex-end" },
  strike:    { textDecorationLine: "line-through" },
});
