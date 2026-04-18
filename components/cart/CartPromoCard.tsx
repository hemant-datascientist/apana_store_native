// ============================================================
// CART PROMO CARD — Apana Store
//
// Promo code entry: text input + Apply button.
// When a valid code is applied, switches to a success pill
// with the savings amount and a remove (×) button.
// ============================================================

import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface CartPromoCardProps {
  promoInput:    string;
  onInputChange: (text: string) => void;
  appliedPromo:  string | null;
  promoError:    string;
  discountAmt:   number;
  promoLabel:    string;   // e.g. "10% off on all items"
  onApply:       () => void;
  onRemove:      () => void;
}

export default function CartPromoCard({
  promoInput, onInputChange,
  appliedPromo, promoError, discountAmt, promoLabel,
  onApply, onRemove,
}: CartPromoCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* Title row */}
      <View style={styles.titleRow}>
        <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Promo Code
        </Text>
      </View>

      {/* ── Applied state ── */}
      {appliedPromo ? (
        <View style={[styles.appliedPill, { backgroundColor: "#DCFCE7", borderColor: "#16A34A" }]}>
          <View style={styles.appliedLeft}>
            <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
            <View>
              <Text style={[styles.appliedCode, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: "#15803D" }]}>
                {appliedPromo}
              </Text>
              <Text style={[styles.appliedLabel, { fontFamily: typography.fontFamily.regular, fontSize: 10.5, color: "#16A34A" }]}>
                {promoLabel} — You save ₹{discountAmt}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
            <Ionicons name="close-circle-outline" size={20} color="#16A34A" />
          </TouchableOpacity>
        </View>

      ) : (
        <>
          {/* ── Input row ── */}
          <View style={[styles.inputRow, { borderColor: promoError ? "#EF4444" : colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}
              placeholder="Enter promo code"
              placeholderTextColor={colors.subText}
              value={promoInput}
              onChangeText={onInputChange}
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={onApply}
            />
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={onApply}
              activeOpacity={0.85}
            >
              <Text style={[styles.applyText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error or hint */}
          {promoError ? (
            <Text style={[styles.error, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {promoError}
            </Text>
          ) : (
            <Text style={[styles.hint, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 10.5 }]}>
              Try: APANA10 · SAVE20 · FIRST50
            </Text>
          )}
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  title: {},

  // Applied pill
  appliedPill: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    padding:           12,
    borderRadius:      12,
    borderWidth:       1.5,
  },
  appliedLeft:  { flexDirection: "row", alignItems: "center", gap: 8 },
  appliedCode:  {},
  appliedLabel: {},

  // Input row
  inputRow: {
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1.5,
    borderRadius:   12,
    overflow:       "hidden",
  },
  input: {
    flex:              1,
    paddingHorizontal: 12,
    paddingVertical:   10,
    letterSpacing:     1,
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical:   11,
  },
  applyText: { color: "#fff" },

  hint:  {},
  error: { color: "#EF4444" },
});
