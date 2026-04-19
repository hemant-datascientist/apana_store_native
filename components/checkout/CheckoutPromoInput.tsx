// ============================================================
// CHECKOUT PROMO INPUT — Apana Store
//
// Inline coupon / promo code entry field with Apply button.
// Delegates validation to the parent via onApply — the parent
// calls validatePromoCode() from checkoutService and passes
// the result back via `status` + `discountAmt`.
//
// States:
//   idle     — empty field, grey Apply button
//   loading  — spinner while API validates
//   success  — green tick, discount amount shown, field locked
//   error    — red message below field, field stays editable
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface CheckoutPromoInputProps {
  // Called when the user taps Apply; parent runs the API call
  onApply:     (code: string) => Promise<void>;
  // Called when the user clears an applied promo
  onClear:     () => void;
  status:      "idle" | "loading" | "success" | "error";
  message:     string;    // success/error text from API
  discountAmt: number;    // 0 unless a valid promo is applied
}

export default function CheckoutPromoInput({
  onApply, onClear, status, message, discountAmt,
}: CheckoutPromoInputProps) {
  const { colors } = useTheme();
  const [code, setCode] = useState("");

  const isApplied = status === "success";
  const isLoading = status === "loading";

  // ── Handle Apply tap ─────────────────────────────────────
  async function handleApply() {
    const trimmed = code.trim();
    if (!trimmed) return;
    await onApply(trimmed);
  }

  // ── Handle Clear tap ─────────────────────────────────────
  function handleClear() {
    setCode("");
    onClear();
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header row ── */}
      <View style={styles.titleRow}>
        <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
        <Text style={[styles.cardTitle, {
          color:      colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.sm,
        }]}>
          Promo Code
        </Text>
        {isApplied && (
          <View style={[styles.appliedBadge, { backgroundColor: "#DCFCE7" }]}>
            <Ionicons name="checkmark-circle" size={12} color="#15803D" />
            <Text style={[styles.appliedBadgeText, {
              color:      "#15803D",
              fontFamily: typography.fontFamily.semiBold,
              fontSize:   typography.size.ss,
            }]}>
              Applied
            </Text>
          </View>
        )}
      </View>

      {/* ── Input row ── */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, {
            color:           colors.text,
            borderColor:     isApplied ? "#16A34A" : status === "error" ? "#EF4444" : colors.border,
            backgroundColor: colors.background,
            fontFamily:      typography.fontFamily.medium,
            fontSize:        typography.size.sm,
          }]}
          placeholder="Enter promo code"
          placeholderTextColor={colors.subText}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          editable={!isApplied && !isLoading}
          returnKeyType="done"
          onSubmitEditing={handleApply}
        />

        {isApplied ? (
          // Clear button when promo is active
          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: "#FEE2E2" }]}
            onPress={handleClear}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
            <Text style={[styles.applyBtnText, { color: "#EF4444", fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Remove
            </Text>
          </TouchableOpacity>
        ) : (
          // Apply button — disabled while empty or loading
          <TouchableOpacity
            style={[styles.applyBtn, {
              backgroundColor: (!code.trim() || isLoading) ? colors.border : colors.primary,
            }]}
            onPress={handleApply}
            disabled={!code.trim() || isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator size="small" color="#fff" />
              : (
                <Text style={[styles.applyBtnText, {
                  color:      (!code.trim()) ? colors.subText : "#fff",
                  fontFamily: typography.fontFamily.bold,
                  fontSize:   typography.size.sm,
                }]}>
                  Apply
                </Text>
              )
            }
          </TouchableOpacity>
        )}
      </View>

      {/* ── Status message ── */}
      {(status === "success" || status === "error") && !!message && (
        <View style={styles.messageRow}>
          <Ionicons
            name={status === "success" ? "checkmark-circle-outline" : "alert-circle-outline"}
            size={13}
            color={status === "success" ? "#16A34A" : "#EF4444"}
          />
          <Text style={[styles.messageText, {
            color:      status === "success" ? "#16A34A" : "#EF4444",
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}>
            {message}
            {status === "success" && discountAmt > 0 ? ` (−₹${discountAmt})` : ""}
          </Text>
        </View>
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
    gap:           7,
  },
  cardTitle: {},
  appliedBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    marginLeft:        4,
  },
  appliedBadgeText: {},

  inputRow: {
    flexDirection: "row",
    gap:           8,
    alignItems:    "center",
  },
  input: {
    flex:              1,
    borderWidth:       1,
    borderRadius:      10,
    paddingHorizontal: 12,
    paddingVertical:   10,
  },
  applyBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               5,
    paddingHorizontal: 14,
    paddingVertical:   10,
    borderRadius:      10,
    minWidth:          80,
  },
  applyBtnText: {},

  messageRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
  },
  messageText: {},
});
