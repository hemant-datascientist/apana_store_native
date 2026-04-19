// ============================================================
// WALLET FORM — Apana Store
//
// Displays 6 wallet apps in a card grid.
// Tap to select → shows a confirmation strip → "Link Wallet".
//
// Wallets shown: Paytm, Amazon Pay, MobiKwik, Airtel Money,
//               JioMoney, FreeCharge
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { WALLET_APPS, WalletApp } from "../../data/addPaymentData";

interface WalletFormProps {
  onAdd: (label: string, detail: string) => Promise<void>;
}

export default function WalletForm({ onAdd }: WalletFormProps) {
  const { colors } = useTheme();

  const [selectedWallet, setSelectedWallet] = useState<WalletApp | null>(null);
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState("");

  function handleSelect(wallet: WalletApp) {
    setSelectedWallet(prev => prev?.id === wallet.id ? null : wallet);
    setError("");
  }

  async function handleAdd() {
    if (!selectedWallet) {
      setError("Please select a wallet to continue");
      return;
    }
    setSaving(true);
    try {
      await onAdd(selectedWallet.name, selectedWallet.desc);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>

      {/* ── Section label ── */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
        Choose Wallet
      </Text>

      {/* ── Wallet grid ── */}
      <View style={styles.grid}>
        {WALLET_APPS.map(wallet => {
          const active = selectedWallet?.id === wallet.id;
          return (
            <TouchableOpacity
              key={wallet.id}
              style={[
                styles.walletCard,
                {
                  backgroundColor: active ? wallet.color + "15" : colors.background,
                  borderColor:     active ? wallet.color        : colors.border,
                },
              ]}
              onPress={() => handleSelect(wallet)}
              activeOpacity={0.8}
            >
              {/* Active tick */}
              {active && (
                <View style={[styles.activeTick, { backgroundColor: wallet.color }]}>
                  <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
              )}

              {/* Icon circle */}
              <View style={[styles.iconCircle, { backgroundColor: wallet.color + "18" }]}>
                <Ionicons name={wallet.icon as any} size={22} color={wallet.color} />
              </View>

              {/* Name + desc */}
              <Text style={[styles.walletName, {
                color:      active ? wallet.color : colors.text,
                fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.medium,
                fontSize:   typography.size.sm,
              }]} numberOfLines={1}>
                {wallet.name}
              </Text>
              <Text style={[styles.walletDesc, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]} numberOfLines={2}>
                {wallet.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Error ── */}
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <Text style={[styles.errorText, { color: "#EF4444", fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {error}
          </Text>
        </View>
      )}

      {/* ── Hint ── */}
      <View style={[styles.hintWrap, { backgroundColor: colors.primary + "0C", borderColor: colors.primary + "25" }]}>
        <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
        <Text style={[styles.hintText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          Linking a wallet lets you pay instantly without entering your password each time.
        </Text>
      </View>

      {/* ── Selected strip ── */}
      {selectedWallet && (
        <View style={[styles.selectedStrip, { backgroundColor: selectedWallet.color + "12", borderColor: selectedWallet.color + "30" }]}>
          <View style={[styles.stripIcon, { backgroundColor: selectedWallet.color + "20" }]}>
            <Ionicons name={selectedWallet.icon as any} size={18} color={selectedWallet.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stripName, { color: selectedWallet.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              {selectedWallet.name}
            </Text>
            <Text style={[styles.stripSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {selectedWallet.desc}
            </Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color={selectedWallet.color} />
        </View>
      )}

      {/* ── Link wallet button ── */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: selectedWallet ? colors.primary : colors.border }]}
        onPress={handleAdd}
        disabled={!selectedWallet || saving}
        activeOpacity={0.85}
      >
        {saving
          ? <ActivityIndicator size="small" color="#fff" />
          : <Ionicons name="link-outline" size={18} color="#fff" />
        }
        <Text style={[styles.addBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          {saving ? "Linking…" : "Link Wallet"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { gap: 14 },
  sectionLabel: {},

  // Wallet grid — 2 columns
  grid: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           12,
  },
  walletCard: {
    width:         "47%",
    padding:       14,
    borderRadius:  14,
    borderWidth:   1.5,
    gap:           8,
    position:      "relative",
    overflow:      "hidden",
  },
  activeTick: {
    position:       "absolute",
    top:            8,
    right:          8,
    width:          18,
    height:         18,
    borderRadius:   9,
    alignItems:     "center",
    justifyContent: "center",
  },
  iconCircle: {
    width:          44,
    height:         44,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
  },
  walletName: {},
  walletDesc: { lineHeight: 16 },

  // Error
  errorRow:  { flexDirection: "row", alignItems: "center", gap: 5 },
  errorText: {},

  // Hint
  hintWrap: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    padding:           12,
    borderRadius:      10,
    borderWidth:       1,
  },
  hintText: { flex: 1, lineHeight: 17 },

  // Selected strip
  selectedStrip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    padding:           12,
    borderRadius:      12,
    borderWidth:       1,
  },
  stripIcon: {
    width:          38,
    height:         38,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  stripName: {},
  stripSub:  { marginTop: 1 },

  // Add button
  addBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             8,
    paddingVertical: 15,
    borderRadius:    14,
    marginTop:       4,
  },
  addBtnText: { color: "#fff" },
});
