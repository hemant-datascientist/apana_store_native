// ============================================================
// CART FULFILLMENT SELECTOR — Apana Store
//
// Three pill buttons (Pickup / Delivery / Ride) that let the
// customer choose how they want their order from this store.
// Shows delivery fee on each non-free option.
//
// "Ride" is NOT real — no ride booking system exists (no endpoint, no
// partner matching; taskBridge hardcodes every real task as a delivery).
// Same SOON pattern as components/store/StoreActionButtons.tsx's "Book
// Ride" button: stays visible (it's a real roadmap item, not hidden) but
// cannot be selected, and says so instead of silently accepting a mode
// checkout cannot fulfil.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
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
const SOON_MODES: FulfillmentMode[] = ["ride"];

export default function CartFulfillmentSelector({ storeId, fulfillment, onSelect }: CartFulfillmentSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
      {MODES.map(mode => {
        const cfg    = FULFILLMENT_CONFIG[mode];
        const active = fulfillment === mode;
        const soon   = SOON_MODES.includes(mode);

        return (
          <TouchableOpacity
            key={mode}
            style={[
              styles.pill,
              active
                ? { backgroundColor: cfg.bg,          borderColor: cfg.color }
                : { backgroundColor: "transparent",   borderColor: colors.border },
              soon && styles.soonPill,
            ]}
            onPress={() => {
              if (soon) {
                Alert.alert(
                  "Ride — coming soon",
                  "Apana doesn't have a ride system yet. This option will be selectable once one exists.",
                );
                return;
              }
              onSelect(storeId, mode);
            }}
            activeOpacity={0.75}
          >
            {soon && (
              <View style={[styles.soonBadge, { backgroundColor: colors.warning }]}>
                <Text style={styles.soonBadgeText}>SOON</Text>
              </View>
            )}
            <Ionicons
              name={cfg.icon as any}
              size={13}
              color={soon ? colors.subText : active ? cfg.color : colors.subText}
            />
            <Text style={[styles.label, {
              color:      soon ? colors.subText : active ? cfg.color : colors.subText,
              fontFamily: active && !soon ? typography.fontFamily.semiBold : typography.fontFamily.regular,
              fontSize:   11,
            }]}>
              {cfg.label}
            </Text>
            {/* Show fee for non-free, non-soon modes */}
            {!soon && DELIVERY_FEE[mode] > 0 && (
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
    position:          "relative",
  },
  soonPill: { opacity: 0.6 },
  soonBadge: {
    position:          "absolute",
    top:               -7,
    right:             4,
    paddingHorizontal: 5,
    paddingVertical:   1,
    borderRadius:      6,
  },
  soonBadgeText: {
    fontSize:   8,
    color:      "#fff",
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.3,
  },
  label: {},
  fee:   {},
});
