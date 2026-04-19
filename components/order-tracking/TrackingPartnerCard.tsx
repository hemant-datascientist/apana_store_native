// ============================================================
// TRACKING PARTNER CARD — Apana Store
//
// Shows the delivery partner / driver / store contact:
//   Avatar (initials) + name, vehicle, rating
//   Call + Chat action buttons (masked phone number)
//   Vehicle number plate badge
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { TrackingPartner } from "../../data/orderTrackingData";
import { FulfillmentMode } from "../../data/cartData";
import { TRACKING_MODE_CONFIG } from "../../data/orderTrackingData";

interface TrackingPartnerCardProps {
  partner: TrackingPartner;
  mode:    FulfillmentMode;
}

export default function TrackingPartnerCard({ partner, mode }: TrackingPartnerCardProps) {
  const { colors } = useTheme();
  const cfg = TRACKING_MODE_CONFIG[mode];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Section title ── */}
      <Text style={[styles.sectionTitle, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
        YOUR {cfg.partnerLabel.toUpperCase()}
      </Text>

      <View style={styles.row}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: partner.avatarColor }]}>
          <Text style={[styles.avatarText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            {partner.initials}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            {partner.name}
          </Text>

          {/* Rating row */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.rating, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
              {partner.rating.toFixed(1)}
            </Text>
            <Text style={[styles.ratingCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              · {partner.totalOrders.toLocaleString()} orders
            </Text>
          </View>

          {/* Vehicle */}
          {partner.vehicleNo !== "" && (
            <View style={[styles.vehicleBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="car-outline" size={11} color={colors.subText} />
              <Text style={[styles.vehicleText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {partner.vehicle}
              </Text>
              <View style={[styles.plateChip, { backgroundColor: "#FEF9C3", borderColor: "#FCD34D" }]}>
                <Text style={[styles.plateText, { fontFamily: typography.fontFamily.bold, fontSize: 10 }]}>
                  {partner.vehicleNo}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#22C55E" + "15", borderColor: "#22C55E" + "40" }]}
            onPress={() => Alert.alert("Call", `Calling ${partner.phone}`)}
            activeOpacity={0.75}
          >
            <Ionicons name="call-outline" size={18} color="#22C55E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}
            onPress={() => Alert.alert("Chat", "In-app chat coming soon")}
            activeOpacity={0.75}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  sectionTitle: { letterSpacing: 0.5 },

  row: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           12,
  },

  avatar: {
    width:          52,
    height:         52,
    borderRadius:   16,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  avatarText: { color: "#fff" },

  info: { flex: 1, gap: 4 },
  name: {},

  ratingRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           3,
  },
  rating:      {},
  ratingCount: {},

  vehicleBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      8,
    borderWidth:       1,
    flexWrap:          "wrap",
  },
  vehicleText: {},
  plateChip: {
    paddingHorizontal: 6,
    paddingVertical:   1,
    borderRadius:      4,
    borderWidth:       1,
  },
  plateText: { color: "#78350F", letterSpacing: 0.5 },

  actions: { gap: 8 },
  actionBtn: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    borderWidth:    1,
  },
});
