// ============================================================
// DELIVERY CODE — the customer's half of the handover handshake.
//
// The rider scans this to complete the delivery. That is what makes "delivered"
// evidence rather than an assertion: before this, a rider tapped a button and
// the system believed them, whether or not they had found the door.
//
// 🔴 IT IS SHOWN ONLY WHILE THE ORDER IS IN TRANSIT. Before pickup there is
// nothing for anyone to scan, and after delivery the code is spent — leaving it
// on screen would invite a customer to show a stranger a code that does nothing
// and looks like it should.
//
// 🔴 THIS ARRIVES ON THE CUSTOMER'S OWN PHONE-SCOPED ORDER READ, never from the
// tracking endpoint, which takes an order id and no identity. On tracking, the
// rider carrying the order could read the code straight off the API and mark it
// delivered from anywhere.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface Props {
  code: string;
}

export default function DeliveryCodeCard({ code }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.qrBox}>
        <QRCode
          value={code}
          size={96}
          // Fixed black-on-white regardless of theme: a scanner needs contrast,
          // and a dark-mode QR drawn in theme greys will not read.
          color="#000000"
          backgroundColor="#FFFFFF"
        />
      </View>

      <View style={styles.copy}>
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.size.sm,
            color: colors.text,
          }}
        >
          Show this on delivery
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.size.xs,
            color: colors.subText,
            marginTop: 2,
          }}
        >
          Your delivery partner scans it to complete the order.
        </Text>

        {/* The code in text too: a camera that will not focus in a dark
            stairwell is a delivery that cannot complete. The alphabet has no
            I, L, O or U, so it can be read out without 1/I or 0/O confusion. */}
        <Text
          selectable
          style={{
            fontFamily: typography.fontFamily.medium,
            fontSize: typography.size.xs,
            color: colors.text,
            marginTop: 6,
            letterSpacing: 0.5,
          }}
        >
          {code}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  qrBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 6,
  },
  copy: { flex: 1 },
});
