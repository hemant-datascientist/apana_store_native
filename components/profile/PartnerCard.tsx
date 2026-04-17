// ============================================================
// PARTNER CARD — Apana Store (Customer App)
//
// Reusable card for both Delivery Boy and Rider.
// Shows: avatar initials, name, vehicle, rating, ETA,
//        Track + Call action buttons.
// When active=false → shows a friendly placeholder state.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AssignedPartner } from "../../data/profileData";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { fulfillmentColors } from "../../theme/colors";

interface PartnerCardProps {
  partner:          AssignedPartner;
  onViewFavourites?: () => void;
}

const CONFIG = {
  delivery: {
    title:       "My Delivery Boy",
    icon:        "bicycle-outline"  as const,
    colorSet:    fulfillmentColors.delivery,
    emptyText:   "No active delivery right now",
    emptyIcon:   "bicycle-outline" as const,
  },
  rider: {
    title:       "My Rider",
    icon:        "car-outline"      as const,
    colorSet:    fulfillmentColors.ride,
    emptyText:   "No active ride right now",
    emptyIcon:   "car-outline"      as const,
  },
};

export default function PartnerCard({ partner, onViewFavourites }: PartnerCardProps) {
  const { colors } = useTheme();
  const cfg        = CONFIG[partner.type];

  return (
    <View style={styles.section}>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Ionicons name={cfg.icon} size={16} color={cfg.colorSet.color} />
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md }]}>
          {cfg.title}
        </Text>
        {onViewFavourites && (
          <TouchableOpacity onPress={onViewFavourites} activeOpacity={0.7} style={styles.viewFavBtn}>
            <Text style={[styles.viewFavText, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

        {partner.active ? (
          <>
            {/* Active partner */}
            <View style={styles.row}>
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: cfg.colorSet.bg }]}>
                <Text style={[styles.avatarText, { color: cfg.colorSet.color, fontFamily: typography.fontFamily.bold }]}>
                  {partner.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </Text>
              </View>

              {/* Info */}
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                  {partner.name}
                </Text>
                <Text style={[styles.vehicle, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  {partner.vehicle}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={[styles.metaText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
                      {partner.rating}
                    </Text>
                  </View>
                  <View style={[styles.dot, { backgroundColor: colors.border }]} />
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color={colors.subText} />
                    <Text style={[styles.metaText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
                      ETA {partner.eta}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ETA badge */}
              <View style={[styles.etaBadge, { backgroundColor: cfg.colorSet.bg }]}>
                <Text style={[styles.etaLabel, { color: cfg.colorSet.color, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                  {partner.eta}
                </Text>
                <Text style={[styles.etaSub, { color: cfg.colorSet.color, fontFamily: typography.fontFamily.regular }]}>
                  away
                </Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={[styles.actions, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: cfg.colorSet.bg }]}
                onPress={() => Alert.alert("Track", `Tracking ${partner.name} coming soon.`)}
                activeOpacity={0.75}
              >
                <Ionicons name="navigate-outline" size={16} color={cfg.colorSet.color} />
                <Text style={[styles.actionLabel, { color: cfg.colorSet.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                  Track
                </Text>
              </TouchableOpacity>

              <View style={[styles.actionDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.background }]}
                onPress={() => Alert.alert("Call", `Calling ${partner.name} at ${partner.phone}`)}
                activeOpacity={0.75}
              >
                <Ionicons name="call-outline" size={16} color={colors.text} />
                <Text style={[styles.actionLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                  Call
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Empty state */
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: cfg.colorSet.bg }]}>
              <Ionicons name={cfg.emptyIcon} size={26} color={cfg.colorSet.color} />
            </View>
            <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
              {cfg.emptyText}
            </Text>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
    marginBottom:  10,
  },
  sectionTitle: { flex: 1 },
  viewFavBtn:   {},
  viewFavText:  {},
  card: {
    borderRadius:  16,
    borderWidth:   1,
    overflow:      "hidden",
  },
  // Active layout
  row: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           12,
    padding:       14,
  },
  avatar: {
    width:         48,
    height:        48,
    borderRadius:  24,
    alignItems:    "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
  },
  info: {
    flex: 1,
    gap:  3,
  },
  name:    {},
  vehicle: {},
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
    marginTop:     2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           3,
  },
  metaText: {},
  dot: {
    width:        3,
    height:       3,
    borderRadius: 2,
  },
  etaBadge: {
    alignItems:   "center",
    paddingHorizontal: 10,
    paddingVertical:    8,
    borderRadius: 10,
    minWidth:     52,
  },
  etaLabel: {
    fontSize: 16,
  },
  etaSub: {
    fontSize: 10,
  },
  // Action buttons
  actions: {
    flexDirection:  "row",
    borderTopWidth: 1,
  },
  actionBtn: {
    flex:           1,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            6,
    paddingVertical: 12,
  },
  actionDivider: {
    width: 1,
    marginVertical: 8,
  },
  actionLabel: {},
  // Empty state
  empty: {
    alignItems:   "center",
    gap:          10,
    paddingVertical: 24,
  },
  emptyIcon: {
    width:         56,
    height:        56,
    borderRadius:  16,
    alignItems:    "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
  },
});
