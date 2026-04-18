// ============================================================
// ORDER QR CODE — Apana Store
//
// Renders the actual QR code inside a white elevated card.
// The QR encodes a JSON payload: { type, orderId, mode, ts }
// that the store / delivery partner / rider app will scan.
//
// Below the QR: order ID in large monospaced-style text.
// A subtle "tap to brighten" hint helps in low-light scenarios.
// ============================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FulfillmentMode } from "../../data/cartData";

const { width: SW } = Dimensions.get("window");
const QR_SIZE       = SW * 0.60;   // 60% of screen width

interface OrderQrCodeProps {
  orderId:  string;
  mode:     FulfillmentMode;
  modeColor: string;
  qrLabel:  string;
}

export default function OrderQrCode({ orderId, mode, modeColor, qrLabel }: OrderQrCodeProps) {
  const { colors } = useTheme();

  // ── Brightness boost on tap (helpful in low light) ───────
  const [bright, setBright] = useState(false);

  // ── QR payload — scanned by partner/store/rider app ──────
  const qrValue = JSON.stringify({
    type:    "apana_order",
    orderId,
    mode,
    ts:      Date.now(),
  });

  return (
    <View style={styles.wrap}>

      {/* ── QR card ── */}
      <TouchableOpacity
        style={[
          styles.card,
          bright && { backgroundColor: "#FFFFFF", opacity: 1 },
        ]}
        onPress={() => setBright(b => !b)}
        activeOpacity={1}
      >
        {/* Branded corner dots */}
        <View style={[styles.cornerDot, styles.TL, { backgroundColor: modeColor }]} />
        <View style={[styles.cornerDot, styles.TR, { backgroundColor: modeColor }]} />
        <View style={[styles.cornerDot, styles.BL, { backgroundColor: modeColor }]} />
        <View style={[styles.cornerDot, styles.BR, { backgroundColor: modeColor }]} />

        {/* The QR code itself */}
        <QRCode
          value={qrValue}
          size={QR_SIZE}
          color="#111827"
          backgroundColor="#FFFFFF"
          logo={undefined}
          logoBorderRadius={8}
          quietZone={12}
        />

        {/* Brightness hint */}
        {!bright && (
          <View style={[styles.brightHint, { backgroundColor: modeColor + "18" }]}>
            <Ionicons name="sunny-outline" size={12} color={modeColor} />
            <Text style={[styles.brightText, { color: modeColor, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              Tap to brighten
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── QR label ── */}
      <View style={[styles.labelPill, { backgroundColor: modeColor + "14", borderColor: modeColor + "40" }]}>
        <Ionicons name="qr-code-outline" size={13} color={modeColor} />
        <Text style={[styles.qrLabel, { color: modeColor, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          {qrLabel}
        </Text>
      </View>

      {/* ── Order ID ── */}
      <View style={[styles.orderIdRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.orderIdLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          Order ID
        </Text>
        <Text style={[styles.orderId, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
          selectable>
          {orderId}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap:        14,
  },

  // QR card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius:    20,
    padding:         20,
    alignItems:      "center",
    justifyContent:  "center",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.12,
    shadowRadius:    16,
    elevation:       8,
  },

  // Branded corner dots in mode color
  cornerDot: {
    position:     "absolute",
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  TL: { top: 10,  left:  10  },
  TR: { top: 10,  right: 10  },
  BL: { bottom: 10, left: 10 },
  BR: { bottom: 10, right: 10 },

  // Brightness hint overlay
  brightHint: {
    position:          "absolute",
    bottom:            14,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  brightText: {},

  // Label pill below QR
  labelPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 14,
    paddingVertical:   6,
    borderRadius:      20,
    borderWidth:       1,
  },
  qrLabel: { letterSpacing: 1 },

  // Order ID row
  orderIdRow: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   10,
    borderRadius:      12,
    borderWidth:       1,
    alignSelf:         "stretch",
  },
  orderIdLabel: {},
  orderId:      { letterSpacing: 0.5 },
});
