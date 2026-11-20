// ============================================================
// PROFILE HEADER — Apana Store (Customer App)
//
// Circular avatar (initials fallback) + name + phone/email +
// Edit Profile button. Sits at the top of the profile scroll.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "../../../data/profileData";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface ProfileHeaderProps {
  user:     UserProfile;
  onEdit:   () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase();
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const { colors } = useTheme();
  // No name given yet → the name slot held the phone, so it showed twice and the
  // avatar's "initial" was "+". Show the number once and invite a name instead.
  const hasName = !!user.name && user.name !== user.phone && /\p{L}/u.test(user.name);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        {hasName ? (
          <Text style={[styles.initials, { color: "#fff", fontFamily: typography.fontFamily.bold }]}>
            {getInitials(user.name)}
          </Text>
        ) : (
          <Ionicons name="person" size={30} color="#fff" />
        )}
      </View>

      {/* Name + contact */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
          {hasName ? user.name : user.phone}
        </Text>
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {hasName ? user.phone : "Tap Edit to add your name"}
        </Text>
        {user.email ? (
          <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {user.email}
          </Text>
        ) : null}
      </View>

      {/* Edit button */}
      <TouchableOpacity
        style={[styles.editBtn, { borderColor: colors.primary }]}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        <Ionicons name="pencil-outline" size={14} color={colors.primary} />
        <Text style={[styles.editLabel, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
          Edit
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   "row",
    alignItems:      "center",
    paddingHorizontal: 16,
    paddingVertical:   18,
    gap:             14,
    borderBottomWidth: 1,
  },
  avatar: {
    width:        64,
    height:       64,
    borderRadius: 32,
    alignItems:   "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap:  2,
  },
  name: {
    lineHeight: 24,
  },
  sub: {
    lineHeight: 18,
  },
  editBtn: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            4,
    paddingHorizontal: 12,
    paddingVertical:    7,
    borderRadius:   20,
    borderWidth:     1,
  },
  editLabel: {},
});
