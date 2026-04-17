// ============================================================
// PROFILE HEADER — Apana Store (Customer App)
//
// Circular avatar (initials fallback) + name + phone/email +
// Edit Profile button. Sits at the top of the profile scroll.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "../../data/profileData";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

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

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={[styles.initials, { color: "#fff", fontFamily: typography.fontFamily.bold }]}>
          {getInitials(user.name)}
        </Text>
      </View>

      {/* Name + contact */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
          {user.name}
        </Text>
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {user.phone}
        </Text>
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {user.email}
        </Text>
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
