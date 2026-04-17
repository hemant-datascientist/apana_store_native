// ============================================================
// PAYMENT METHOD CARD — Apana Store (Payment Component)
//
// Single saved payment method row inside a card list:
//   icon circle | label + detail | "Default" badge | chevron
//
// Long-press shows a remove / set-as-default action sheet.
//
// Props:
//   method      — PaymentMethod
//   isLast      — suppresses bottom divider on last item
//   onSetDefault — called when user selects "Set as Default"
//   onRemove     — called when user selects "Remove"
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, Alert, StyleSheet,
} from "react-native";
import { Ionicons }       from "@expo/vector-icons";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";
import { PaymentMethod }  from "../../data/paymentData";

interface PaymentMethodCardProps {
  method:       PaymentMethod;
  isLast:       boolean;
  onSetDefault: (method: PaymentMethod) => void;
  onRemove:     (method: PaymentMethod) => void;
}

export default function PaymentMethodCard({
  method, isLast, onSetDefault, onRemove,
}: PaymentMethodCardProps) {
  const { colors } = useTheme();

  function handleLongPress() {
    const options: { text: string; onPress?: () => void; style?: "destructive" | "cancel" }[] = [];

    if (!method.isDefault) {
      options.push({ text: "Set as Default", onPress: () => onSetDefault(method) });
    }
    if (method.type !== "cod") {
      options.push({ text: "Remove",         onPress: () => onRemove(method), style: "destructive" });
    }
    options.push({ text: "Cancel", style: "cancel" });

    Alert.alert(method.label, "Choose an action", options);
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.75}
        onLongPress={handleLongPress}
        delayLongPress={400}
      >
        {/* ── Icon circle ── */}
        <View style={[styles.iconWrap, { backgroundColor: method.color + "18" }]}>
          <Ionicons name={method.icon as any} size={20} color={method.color} />
        </View>

        {/* ── Label + detail ── */}
        <View style={styles.body}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, {
              color:      colors.text,
              fontFamily: typography.fontFamily.semiBold,
              fontSize:   typography.size.sm,
            }]}>
              {method.label}
            </Text>

            {method.isDefault && (
              <View style={[styles.defaultBadge, {
                backgroundColor: colors.primary + "15",
                borderColor:     colors.primary + "40",
              }]}>
                <Text style={[styles.defaultLabel, {
                  color:      colors.primary,
                  fontFamily: typography.fontFamily.semiBold,
                  fontSize:   typography.size.xs - 1,
                }]}>
                  Default
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.detail, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}>
            {method.detail}
          </Text>
        </View>

        {/* ── Chevron ── */}
        <Ionicons name="chevron-forward" size={16} color={colors.subText} />
      </TouchableOpacity>

      {/* ── Divider (hidden on last item) ── */}
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   14,
    gap:               12,
  },
  iconWrap: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  body:     { flex: 1, gap: 3 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  label:    {},
  detail:   {},

  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      10,
    borderWidth:       1,
  },
  defaultLabel: {},

  divider: {
    height:           1,
    marginHorizontal: 16,
  },
});
