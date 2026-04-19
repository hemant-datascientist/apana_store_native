// ============================================================
// CHECKOUT PAYMENT SELECTOR — Apana Store
//
// Selectable list of saved payment methods shown on the
// dedicated Payment step of the checkout flow.
// Each row is a radio-style card. Tapping selects it.
// "Add new" row at bottom routes to /add-payment.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { PaymentMethod, PAYMENT_TYPE_META } from "../../data/paymentData";

interface CheckoutPaymentSelectorProps {
  methods:    PaymentMethod[];
  selectedId: string;
  onSelect:   (method: PaymentMethod) => void;
}

export default function CheckoutPaymentSelector({
  methods, selectedId, onSelect,
}: CheckoutPaymentSelectorProps) {
  const { colors } = useTheme();
  const router     = useRouter();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
        Pay Using
      </Text>

      {methods.map(method => {
        const isActive = method.id === selectedId;
        const meta     = PAYMENT_TYPE_META[method.type];

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
            <View style={[styles.iconCircle, { backgroundColor: method.color + "18" }]}>
              <Ionicons name={method.icon as any} size={18} color={method.color} />
            </View>

            {/* Label + detail */}
            <View style={styles.info}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                  {method.label}
                </Text>
                {method.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
                    <Text style={[styles.defaultText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 9 }]}>
                      DEFAULT
                    </Text>
                  </View>
                )}
              </View>
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

      {/* Add new payment method */}
      <TouchableOpacity
        style={[styles.addRow, { borderColor: colors.border }]}
        onPress={() => router.push("/add-payment")}
        activeOpacity={0.8}
      >
        <View style={[styles.addIcon, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "25" }]}>
          <Ionicons name="add" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.addText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
          Add New Payment Method
        </Text>
        <Ionicons name="chevron-forward-outline" size={16} color={colors.primary} />
      </TouchableOpacity>
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
  info: { flex: 1, gap: 2 },
  labelRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
  },
  label: {},
  defaultBadge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
    borderWidth:       1,
  },
  defaultText: {},
  detail:      {},

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

  addRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingVertical:   10,
    borderTopWidth:    1,
    marginTop:         2,
  },
  addIcon: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    borderWidth:    1,
  },
  addText: { flex: 1 },
});
