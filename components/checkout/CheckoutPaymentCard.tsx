// ============================================================
// CHECKOUT PAYMENT CARD — Apana Store
//
// Shows the currently selected payment method with a
// "Change" button that opens the payment picker modal.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { PaymentMethod } from "../../data/paymentData";

interface CheckoutPaymentCardProps {
  method:        PaymentMethod;
  onChangePress: () => void;
}

export default function CheckoutPaymentCard({ method, onChangePress }: CheckoutPaymentCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Section title row ── */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Ionicons name="card-outline" size={16} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Payment Method
          </Text>
        </View>
        <TouchableOpacity onPress={onChangePress} activeOpacity={0.7} style={styles.changeBtn}>
          <Text style={[styles.changeText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Change
          </Text>
          <Ionicons name="chevron-forward" size={13} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Divider ── */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Selected payment method body ── */}
      <View style={styles.body}>

        {/* Icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: method.color + "18" }]}>
          <Ionicons name={method.icon as any} size={22} color={method.color} />
        </View>

        {/* Label + detail */}
        <View style={styles.methodInfo}>
          <Text style={[styles.methodLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            {method.label}
          </Text>
          <Text style={[styles.methodDetail, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {method.detail}
          </Text>
        </View>

        {/* "Selected" checkmark */}
        <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
      </View>

      {/* ── Security note ── */}
      <View style={[styles.secureRow, { borderTopColor: colors.border }]}>
        <Ionicons name="shield-checkmark-outline" size={13} color="#16A34A" />
        <Text style={[styles.secureText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
          Secured with 256-bit encryption
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },

  // Title row
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 14,
    paddingVertical:   12,
  },
  titleLeft: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
  },
  title: {},
  changeBtn: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           2,
  },
  changeText: {},

  divider: { height: 1 },

  // Body
  body: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    padding:           14,
  },
  iconCircle: {
    width:          48,
    height:         48,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
  },
  methodInfo: { flex: 1 },
  methodLabel: {},
  methodDetail: { marginTop: 2 },

  // Security footer
  secureRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 14,
    paddingVertical:   9,
    borderTopWidth:    1,
  },
  secureText: {},
});
