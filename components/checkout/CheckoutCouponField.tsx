// ============================================================
// CHECKOUT COUPON FIELD — type a shop's or a brand's code, Apply.
//
// The server decides (POST /customer/coupons/check). The amount shown is an
// ESTIMATE ("about ₹30 off"); the order carries the exact discount, and a code
// that stops applying refuses checkout with the reason rather than being
// dropped while the customer pays full price.
// ============================================================

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { validatePromoCode } from "../../services/checkoutService";
import type { FulfillmentMode } from "../../data/cartData";

interface Props {
  customerId: string | null;
  items: { productId: string; qty: number }[];
  subtotal: number;
  mode: FulfillmentMode;
  applied: { code: string; discount: number; message: string } | null;
  onChange: (applied: { code: string; discount: number; message: string } | null) => void;
}

export default function CheckoutCouponField({ customerId, items, subtotal, mode, applied, onChange }: Props) {
  const { colors } = useTheme();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apply() {
    const c = code.trim();
    if (c.length < 3) return;
    setBusy(true);
    setError(null);
    const r = await validatePromoCode({ code: c, subtotal, mode, customerId, items });
    setBusy(false);
    if (r.valid) onChange({ code: c.toUpperCase(), discount: r.discountAmt, message: r.message });
    else setError(r.message);
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.titleRow}>
        <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Coupon code
        </Text>
      </View>
      {applied ? (
        <View style={styles.row}>
          <Text style={[styles.applied, { color: colors.success, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {applied.code} · {applied.message}
          </Text>
          <TouchableOpacity onPress={() => onChange(null)} hitSlop={8}>
            <Text style={{ color: colors.danger, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.row}>
          <TextInput
            value={code}
            onChangeText={(t) => { setCode(t); setError(null); }}
            placeholder="Enter code"
            placeholderTextColor={colors.subText}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={30}
            style={[styles.input, { color: colors.text, borderColor: colors.border, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}
          />
          <TouchableOpacity
            onPress={apply}
            disabled={busy || code.trim().length < 3}
            style={[styles.btn, { backgroundColor: colors.primary, opacity: busy || code.trim().length < 3 ? 0.5 : 1 }]}
          >
            {busy ? <ActivityIndicator color={colors.white} size="small" /> : (
              <Text style={{ color: colors.white, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }}>Apply</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      {error && (
        <Text style={{ color: colors.danger, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, marginTop: 6 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginHorizontal: 16, marginTop: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  title: {},
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  btn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, minWidth: 72, alignItems: "center" },
  applied: { flex: 1 },
});
