// ============================================================
// CHECKOUT PAYMENT SELECTOR — Apana Store
//
// Radio list of the ways to pay, on the Payment step of checkout.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { PaymentMethod } from "../../data/paymentData";

interface CheckoutPaymentSelectorProps {
  methods:    PaymentMethod[];
  selectedId: string;
  onSelect:   (method: PaymentMethod) => void;
}

export default function CheckoutPaymentSelector({
  methods, selectedId, onSelect,
}: CheckoutPaymentSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
        Pay Using
      </Text>

      {methods.map(method => {
        const isActive = method.id === selectedId;

        return (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.row,
              { borderColor: isActive ? colors.primary : colors.border },
              isActive && { backgroundColor: colors.primary + "08" },
            ]}
            onPress={() => onSelect(method)}
            activeOpacity={0.8}
          >
            {/* Icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + "18" }]}>
              <Ionicons name={method.icon as any} size={18} color={colors.primary} />
            </View>

            {/* Label + detail */}
            <View style={styles.info}>
              <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                {method.label}
              </Text>
              <Text style={[styles.detail, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {method.detail}
              </Text>
            </View>

            {/* Radio indicator */}
            <View style={[
              styles.radio,
              { borderColor: isActive ? colors.primary : colors.border },
            ]}>
              {isActive && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  title: { marginBottom: 2 },

  row: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    padding:           12,
    borderRadius:      12,
    borderWidth:       1.5,
  },
  iconCircle: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  info:   { flex: 1, gap: 2 },
  label:  {},
  detail: {},

  radio: {
    width:          20,
    height:         20,
    borderRadius:   10,
    borderWidth:    2,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  radioDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
});
