// ============================================================
// PAYMENT METHODS SCREEN — Apana Store (Customer App)
//
// Sections (top → bottom):
//   Header bar           — back + "Payment Methods"
//   Saved methods card   — PaymentMethodCard list (default at top)
//   AddPaymentButton     — dashed "Add Payment Method"
//   Info card            — security assurance note
//
// State:
//   methods — list of PaymentMethod (sorted: default first)
//
// Long-press a card → Alert with "Set as Default" / "Remove"
//
// Backend: GET    /customer/payment-methods
//          PATCH  /customer/payment-methods/:id/default
//          DELETE /customer/payment-methods/:id
//          POST   /customer/payment-methods
// ============================================================

import React, { useState } from "react";
import {
  View, Text, ScrollView, Alert, StyleSheet,
} from "react-native";
import { SafeAreaView }   from "react-native-safe-area-context";
import { Ionicons }       from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter }      from "expo-router";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";
import {
  MOCK_PAYMENT_METHODS,
  PaymentMethod,
} from "../../data/paymentData";
import PaymentMethodCard from "../../components/payment/PaymentMethodCard";
import AddPaymentButton  from "../../components/payment/AddPaymentButton";

// Sort helper: default method always first
function sortMethods(list: PaymentMethod[]): PaymentMethod[] {
  return [...list].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
}

export default function PaymentMethodsScreen() {
  const { colors } = useTheme();
  const router     = useRouter();

  const [methods, setMethods] = useState<PaymentMethod[]>(
    sortMethods(MOCK_PAYMENT_METHODS),
  );

  // ── Set as default ────────────────────────────────────────────
  function handleSetDefault(target: PaymentMethod) {
    setMethods(prev =>
      sortMethods(prev.map(m => ({ ...m, isDefault: m.id === target.id }))),
    );
  }

  // ── Remove ────────────────────────────────────────────────────
  function handleRemove(target: PaymentMethod) {
    Alert.alert(
      "Remove Payment Method",
      `Remove ${target.label}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text:  "Remove",
          style: "destructive",
          onPress: () =>
            setMethods(prev => prev.filter(m => m.id !== target.id)),
        },
      ],
    );
  }

  // ── Add new (placeholder) ─────────────────────────────────────
  function handleAdd() {
    Alert.alert("Add Payment Method", "Payment method addition coming soon.");
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>

      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, {
          color:      colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.lg,
        }]}>
          Payment Methods
        </Text>

        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ── Saved methods card ── */}
        {methods.length > 0 ? (
          <View style={[styles.card, {
            backgroundColor: colors.card,
            borderColor:     colors.border,
          }]}>
            {methods.map((method, i) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isLast={i === methods.length - 1}
                onSetDefault={handleSetDefault}
                onRemove={handleRemove}
              />
            ))}
          </View>
        ) : (
          // ── Empty state ──
          <View style={[styles.emptyWrap, {
            backgroundColor: colors.card,
            borderColor:     colors.border,
          }]}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.primary + "12" }]}>
              <Ionicons name="card-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, {
              color:      colors.text,
              fontFamily: typography.fontFamily.semiBold,
              fontSize:   typography.size.md,
            }]}>
              No saved methods
            </Text>
            <Text style={[styles.emptySub, {
              color:      colors.subText,
              fontFamily: typography.fontFamily.regular,
              fontSize:   typography.size.sm,
            }]}>
              Add a UPI ID or card to speed up checkout.
            </Text>
          </View>
        )}

        {/* ── Long-press hint ── */}
        <Text style={[styles.hint, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs,
        }]}>
          Long-press a method to set as default or remove it.
        </Text>

        {/* ── Add new method ── */}
        <AddPaymentButton onPress={handleAdd} />

        {/* ── Security info card ── */}
        <View style={[styles.infoCard, {
          backgroundColor: colors.success + "10",
          borderColor:     colors.success + "30",
        }]}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
          <Text style={[styles.infoText, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
            lineHeight: 18,
          }]}>
            Apana Store never stores your card details. All payments are processed through PCI-DSS compliant gateways.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Header ──
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   14,
    borderBottomWidth: 1,
  },
  backBtn:     { width: 36 },
  headerTitle: { textAlign: "center" },

  // ── Scroll ──
  content: {
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     40,
    gap:               14,
  },

  // ── Methods card ──
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },

  // ── Empty state ──
  emptyWrap: {
    alignItems:   "center",
    gap:          10,
    padding:      32,
    borderRadius: 14,
    borderWidth:  1,
  },
  emptyIcon:  {
    width:          64,
    height:         64,
    borderRadius:   20,
    alignItems:     "center",
    justifyContent: "center",
  },
  emptyTitle: {},
  emptySub:   { textAlign: "center" },

  // ── Hint ──
  hint: { textAlign: "center", marginTop: -4 },

  // ── Security info ──
  infoCard: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           10,
    padding:       14,
    borderRadius:  12,
    borderWidth:   1,
    marginTop:     4,
  },
  infoText: { flex: 1 },
});
