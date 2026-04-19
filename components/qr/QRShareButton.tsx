// ============================================================
// QR SHARE BUTTON — Apana Store
//
// Reusable button that shares a pre-generated QR PNG file via
// the OS native share sheet (expo-sharing).
//
// States:
//   filePath === null → "Preparing QR…"  (disabled, grey)
//   filePath set      → "Share QR Code"  (enabled, primary color)
//   sharing           → "Sharing…"       (disabled, grey)
//
// Usage:
//   <QRShareButton
//     filePath={qrFilePath}
//     dialogTitle={`Share QR for "${name}"`}
//     color={colors.primary}
//   />
// ============================================================

import React, { useState } from "react";
import {
  TouchableOpacity, Text, StyleSheet, ViewStyle, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing  from "expo-sharing";
import { typography } from "../../theme/typography";

interface QRShareButtonProps {
  filePath:    string | null;   // null while QRGenerator is still working
  dialogTitle: string;
  color:       string;          // button background (use colors.primary or mode color)
  style?:      ViewStyle;
}

export default function QRShareButton({
  filePath, dialogTitle, color, style,
}: QRShareButtonProps) {
  const [sharing, setSharing] = useState(false);

  const ready    = filePath !== null;
  const disabled = !ready || sharing;

  // ── Open OS share sheet with the cached PNG ───────────────
  async function handlePress() {
    if (!filePath) return;
    setSharing(true);
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Not supported", "Sharing is not available on this device.");
        return;
      }
      await Sharing.shareAsync(filePath, {
        mimeType:    "image/png",
        dialogTitle,
        UTI:         "public.png",   // iOS: hint that this is an image
      });
    } catch (err: any) {
      Alert.alert("Share failed", err?.message ?? "Could not share QR code.");
    } finally {
      setSharing(false);
    }
  }

  // ── Button label changes to reflect current state ─────────
  const label = !ready
    ? "Preparing QR…"
    : sharing
    ? "Sharing…"
    : "Share QR Code";

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: disabled ? "#CBD5E1" : color },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Ionicons name="share-outline" size={18} color="#fff" />
      <Text style={[styles.label, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    paddingVertical:   14,
    borderRadius:      14,
    alignSelf:         "stretch",
  },
  label: { color: "#fff" },
});
