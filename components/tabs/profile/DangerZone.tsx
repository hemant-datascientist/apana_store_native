// ============================================================
// DANGER ZONE — Apana Store (Profile Component)
//
// Red-outlined card at the bottom of Edit Profile.
// Contains the "Delete Account" destructive action.
//
// Props:
//   onDelete — called after user confirms deletion in Alert
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface DangerZoneProps {
  onDelete: () => void;
}

export default function DangerZone({ onDelete }: DangerZoneProps) {
  const { colors } = useTheme();

  function confirmDelete() {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all data. This cannot be undone.",
      [
        { text: "Cancel",            style: "cancel"      },
        { text: "Delete My Account", style: "destructive", onPress: onDelete },
      ],
    );
  }

  return (
    <View style={[styles.block, {
      borderColor:     colors.danger + "50",
      backgroundColor: colors.danger + "08",
    }]}>
      {/* ── Section title ── */}
      <Text style={[styles.title, {
        color:      colors.danger,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   typography.size.xs,
        letterSpacing: 0.6,
      }]}>
        DANGER ZONE
      </Text>

      {/* ── Delete button ── */}
      <TouchableOpacity
        style={styles.deleteBtn}
        activeOpacity={0.8}
        onPress={confirmDelete}
      >
        <Ionicons name="trash-outline" size={16} color={colors.danger} />
        <Text style={[styles.deleteText, {
          color:      colors.danger,
          fontFamily: typography.fontFamily.medium,
          fontSize:   typography.size.sm,
        }]}>
          Delete Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop:    8,
    padding:      16,
    borderRadius: 14,
    borderWidth:  1,
    gap:          12,
  },
  title: {},
  deleteBtn: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  deleteText: {},
});
