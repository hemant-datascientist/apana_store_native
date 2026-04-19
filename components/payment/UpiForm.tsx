// ============================================================
// UPI FORM — Apana Store
//
// Two ways to add UPI:
//   1. Quick select — tap a popular UPI app; pre-fills VPA suffix
//   2. Manual entry — type full UPI ID with live validation
//
// Validates: must match pattern username@provider
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import {
  UPI_APPS, UpiApp, isValidUpiId,
} from "../../data/addPaymentData";

interface UpiFormProps {
  onAdd: (label: string, detail: string) => Promise<void>;
}

export default function UpiForm({ onAdd }: UpiFormProps) {
  const { colors } = useTheme();

  const [selectedApp, setSelectedApp] = useState<UpiApp | null>(null);
  const [upiId,       setUpiId]       = useState("");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  function handleSelectApp(app: UpiApp) {
    setSelectedApp(app);
    setError("");
    // Pre-fill the suffix so user only needs to enter username
    if (app.suffix && !upiId.includes("@")) {
      setUpiId(prev => prev.replace(/@.*$/, "") + app.suffix);
    }
  }

  function handleChangeId(text: string) {
    setUpiId(text.toLowerCase().trim());
    setError("");
  }

  async function handleAdd() {
    if (!isValidUpiId(upiId)) {
      setError("Enter a valid UPI ID (e.g. name@okaxis)");
      return;
    }
    setSaving(true);
    try {
      const label = selectedApp ? selectedApp.name : "UPI";
      await onAdd(label, upiId.trim());
    } finally {
      setSaving(false);
    }
  }

  const isValid = isValidUpiId(upiId);

  return (
    <View style={styles.container}>

      {/* ── Popular UPI apps grid ── */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
        Select UPI App
      </Text>
      <View style={styles.appsGrid}>
        {UPI_APPS.map(app => {
          const active = selectedApp?.id === app.id;
          return (
            <TouchableOpacity
              key={app.id}
              style={[
                styles.appChip,
                {
                  backgroundColor: active ? app.color + "18" : colors.background,
                  borderColor:     active ? app.color        : colors.border,
                },
              ]}
              onPress={() => handleSelectApp(app)}
              activeOpacity={0.8}
            >
              <View style={[styles.appIconCircle, { backgroundColor: app.color + "18" }]}>
                <Ionicons name={app.icon as any} size={18} color={app.color} />
              </View>
              <Text style={[styles.appName, {
                color:      active ? app.color : colors.text,
                fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                fontSize:   typography.size.xs,
              }]}>
                {app.name}
              </Text>
              {active && (
                <Ionicons name="checkmark-circle" size={14} color={app.color} style={styles.appCheck} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── UPI ID input ── */}
      <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
        Enter UPI ID
      </Text>

      <View style={[
        styles.inputWrap,
        {
          borderColor:     error ? "#EF4444" : isValid ? "#22C55E" : colors.border,
          backgroundColor: colors.background,
        },
      ]}>
        <Ionicons name="at-outline" size={18} color={colors.subText} />
        <TextInput
          style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
          placeholder="yourname@okaxis"
          placeholderTextColor={colors.subText}
          value={upiId}
          onChangeText={handleChangeId}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="done"
        />
        {isValid && (
          <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
        )}
      </View>

      {/* Error */}
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <Text style={[styles.errorText, { color: "#EF4444", fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {error}
          </Text>
        </View>
      )}

      {/* Hint */}
      <Text style={[styles.hint, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
        Your UPI ID is linked to your bank account. We'll send a ₹1 verification request to confirm it.
      </Text>

      {/* Add button */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: isValid ? colors.primary : colors.border }]}
        onPress={handleAdd}
        disabled={!isValid || saving}
        activeOpacity={0.85}
      >
        {saving
          ? <ActivityIndicator size="small" color="#fff" />
          : <Ionicons name="add-circle-outline" size={18} color="#fff" />
        }
        <Text style={[styles.addBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          {saving ? "Verifying…" : "Add UPI ID"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  sectionLabel: {},

  // UPI app grid
  appsGrid: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           10,
  },
  appChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    paddingHorizontal: 12,
    paddingVertical:   9,
    borderRadius:      12,
    borderWidth:       1.5,
    minWidth:          "44%",
    flex:              1,
    position:          "relative",
  },
  appIconCircle: {
    width:          32,
    height:         32,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  appName:  { flex: 1 },
  appCheck: { position: "absolute", top: 6, right: 6 },

  // Input
  inputWrap: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    borderWidth:       1.5,
    borderRadius:      12,
    paddingHorizontal: 14,
    paddingVertical:   13,
  },
  input: { flex: 1 },

  errorRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: -8 },
  errorText: {},
  hint: { lineHeight: 18 },

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
