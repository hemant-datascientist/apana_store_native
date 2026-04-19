// ============================================================
// SHARED LIST ASSIGNEE CARD — Apana Store
//
// Card shown at the top of the list detail screen.
// Displays who is doing the shopping (or who sent the list).
// Shows: avatar, name, phone, status, live location hint,
// and quick action buttons (Call, Message).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { Contact, ListStatus, STATUS_CONFIG } from "../../data/sharedListData";

interface SharedListAssigneeCardProps {
  contact:      Contact;
  createdByMe:  boolean;
  status:       ListStatus;
  locationHint?: string;
}

export default function SharedListAssigneeCard({
  contact, createdByMe, status, locationHint,
}: SharedListAssigneeCardProps) {
  const { colors } = useTheme();
  const statusCfg  = STATUS_CONFIG[status];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* Avatar + name + role label */}
      <View style={styles.personRow}>
        <View style={[styles.avatar, { backgroundColor: contact.color }]}>
          <Text style={[styles.avatarText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            {contact.initials}
          </Text>
        </View>

        <View style={styles.personInfo}>
          <Text style={[styles.roleLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {createdByMe ? "Shopping partner" : "Sent by"}
          </Text>
          <Text style={[styles.contactName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            {contact.name}
          </Text>
          <Text style={[styles.phone, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {contact.phone}
          </Text>
        </View>

        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.statusText, { color: statusCfg.color, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
            {statusCfg.label}
          </Text>
        </View>
      </View>

      {/* Live location pill */}
      {locationHint && (
        <View style={[styles.locationPill, { backgroundColor: "#22C55E" + "18" }]}>
          <View style={styles.liveDot} />
          <Ionicons name="location-outline" size={13} color="#16A34A" />
          <Text style={[styles.locationText, { color: "#15803D", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {locationHint}
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}
          onPress={() => Linking.openURL(`tel:${contact.phone.replace(/\s/g, "")}`)}
          activeOpacity={0.8}
        >
          <Ionicons name="call-outline" size={16} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Call
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#22C55E" + "12", borderColor: "#22C55E" + "30" }]}
          onPress={() => Alert.alert("Message", "In-app chat coming soon.")}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#16A34A" />
          <Text style={[styles.actionText, { color: "#16A34A", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Message
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#7C3AED" + "12", borderColor: "#7C3AED" + "30" }]}
          onPress={() => Alert.alert("Live Map", "Live location tracking coming soon.")}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={16} color="#7C3AED" />
          <Text style={[styles.actionText, { color: "#7C3AED", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Track
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      14,
    gap:          12,
  },

  personRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           12,
  },
  avatar: {
    width:          52,
    height:         52,
    borderRadius:   26,
    alignItems:     "center",
    justifyContent: "center",
  },
  avatarText:  { color: "#fff" },
  personInfo:  { flex: 1 },
  roleLabel:   { marginBottom: 2 },
  contactName: {},
  phone:       { marginTop: 2 },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
    alignSelf:         "flex-start",
  },
  statusText: {},

  locationPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderRadius:      12,
  },
  liveDot: {
    width:        7,
    height:       7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  locationText: { flex: 1, lineHeight: 17 },

  actions: {
    flexDirection: "row",
    gap:           8,
  },
  actionBtn: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               5,
    paddingVertical:   10,
    borderRadius:      10,
    borderWidth:       1,
  },
  actionText: {},
});
