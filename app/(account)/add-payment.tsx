// ============================================================
// ADD PAYMENT METHOD SCREEN — Apana Store
//
// Tab-driven form for adding payment methods:
//   UPI | Card | Net Banking | Wallets
//
// Route: /add-payment
// Navigates back after successful add.
//
// Backend: POST /customer/payment-methods
// ============================================================

import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView }      from "react-native-safe-area-context";
import { Ionicons }          from "@expo/vector-icons";
import { useRouter }         from "expo-router";

import useTheme              from "../../theme/useTheme";
import { typography }        from "../../theme/typography";
import { addPaymentMethod }  from "../../services/paymentService";

import PaymentTabBar, { PaymentTab } from "../../components/payment/PaymentTabBar";
import UpiForm                       from "../../components/payment/UpiForm";
import CardForm                      from "../../components/payment/CardForm";
import NetBankingForm                from "../../components/payment/NetBankingForm";
import WalletForm                    from "../../components/payment/WalletForm";

export default function AddPaymentScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  const [activeTab, setActiveTab] = useState<PaymentTab>("upi");

  // ── Handle add from any form ──────────────────────────────
  // label  = display name  ("Google Pay" / "Visa Card" / "HDFC Bank" / "Paytm Wallet")
  // detail = masked detail (UPI ID / •••• 4321 / "Net Banking" / wallet desc)
  async function handleAdd(label: string, detail: string) {
    // TODO: swap stub for real API call
    await addPaymentMethod({ type: activeTab, label, detail });
    router.back();
  }

  // ── Render active form ────────────────────────────────────
  function renderForm() {
    switch (activeTab) {
      case "upi":        return <UpiForm        onAdd={handleAdd} />;
      case "card":       return <CardForm       onAdd={handleAdd} />;
      case "netbanking": return <NetBankingForm onAdd={handleAdd} />;
      case "wallet":     return <WalletForm     onAdd={handleAdd} />;
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.headerWrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.background }]}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              Add Payment Method
            </Text>
            <Text style={[styles.headerSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Secured with 256-bit encryption
            </Text>
          </View>

          {/* Lock badge */}
          <View style={[styles.lockBadge, { backgroundColor: colors.success + "15", borderColor: colors.success + "40" }]}>
            <Ionicons name="lock-closed" size={12} color={colors.success} />
          </View>
        </View>

        {/* Tab bar lives inside the header card so it's not sticky */}
        <PaymentTabBar active={activeTab} onChange={setActiveTab} />
      </SafeAreaView>

      {/* ── Scrollable form body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tab-specific helper text */}
        <View style={[styles.helpStrip, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons
            name={
              activeTab === "upi"        ? "flash-outline"  :
              activeTab === "card"       ? "card-outline"   :
              activeTab === "netbanking" ? "globe-outline"  :
                                          "wallet-outline"
            }
            size={14}
            color={colors.primary}
          />
          <Text style={[styles.helpText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {activeTab === "upi"        && "Pay instantly using any UPI app linked to your bank account."}
            {activeTab === "card"       && "Add a debit or credit card. CVV is never stored."}
            {activeTab === "netbanking" && "Pay directly from your bank account via secure net banking."}
            {activeTab === "wallet"     && "Link a prepaid wallet for one-tap checkout."}
          </Text>
        </View>

        {/* Active form */}
        {renderForm()}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  headerWrap:    { borderBottomWidth: 1 },
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   10,
    gap:               10,
  },
  backBtn: {
    width:          38,
    height:         38,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  headerCenter:  { flex: 1, alignItems: "center", gap: 1 },
  headerTitle:   {},
  headerSub:     {},
  lockBadge: {
    width:          34,
    height:         34,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    borderWidth:    1,
    flexShrink:     0,
  },

  // Body
  scroll:  { flex: 1 },
  content: {
    padding: 16,
    gap:     16,
  },

  // Help strip
  helpStrip: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    padding:           12,
    borderRadius:      12,
    borderWidth:       1,
  },
  helpText: { flex: 1, lineHeight: 18 },

  bottomSpacer: { height: 24 },
});
