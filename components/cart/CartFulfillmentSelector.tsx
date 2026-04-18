// ============================================================
// CART FULFILLMENT SELECTOR — Apana Store
//
// Three pill buttons (Pickup / Delivery / Ride) that let the
// customer choose how they want their order from this store.
// Shows delivery fee on each non-free option.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FulfillmentMode, FULFILLMENT_CONFIG, DELIVERY_FEE } from "../../data/cartData";

interface CartFulfillmentSelectorProps {
  storeId:    string;
  fulfillment: FulfillmentMode;
  onSelect:   (storeId: string, mode: FulfillmentMode) => void;
}

const MODES: FulfillmentMode[] = ["pickup", "delivery", "ride"];

export default function CartFulfillmentSelector({ storeId, fulfillment, onSelect }: CartFulfillmentSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
      {MODES.map(mode => {
        const cfg    = FULFILLMENT_CONFIG[mode];
        const active = fulfillment === mode;

        return (
          <TouchableOpacity
            key={mode}
            style={[
              styles.pill,
              active
                ? { backgroundColor: cfg.bg,          borderColor: cfg.color }
                : { backgroundColor: "transparent",   borderColor: colors.border },
            ]}
            onPress={() => onSelect(storeId, mode)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={cfg.icon as any}
              size={13}
              color={active ? cfg.color : colors.subText}
            />
            <Text style={[styles.label, {
              color:      active ? cfg.color : colors.subText,
              fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
              fontSize:   11,
            }]}>
              {cfg.label}
            </Text>
            {/* Show fee for non-free modes */}
            {DELIVERY_FEE[mode] > 0 && (
              <Text style={[styles.fee, {
                color:      active ? cfg.color : colors.subText,
                fontFamily: typography.fontFamily.regular,
                fontSize:   9.5,
              }]}>
                +₹{DELIVERY_FEE[mode]}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    gap:               6,
    paddingHorizontal: 12,
    paddingVertical:   10,
    borderTopWidth:    1,
    borderBottomWidth: 1,
  },
  pill: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               4,
    paddingVertical:   7,
    borderRadius:      20,
    borderWidth:       1.5,
  },
  label: {},
  fee:   {},
});
