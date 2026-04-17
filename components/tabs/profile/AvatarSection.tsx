// ============================================================
// AVATAR SECTION — Apana Store (Profile Component)
//
// Displays the user's avatar circle (initials-based) with a
// camera badge that triggers photo upload, and a hint text.
//
// Props:
//   name     — user's name (used to derive initials)
//   onCamera — called when camera badge is tapped
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface AvatarSectionProps {
  name:     string;
  onCamera: () => void;
}

// ── Derive up to 2 initials from display name ─────────────────
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0] ?? "")
    .join("")
    .toUpperCase() || "?";
}

export default function AvatarSection({ name, onCamera }: AvatarSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      {/* ── Avatar circle + camera badge ── */}
      <View style={styles.wrap}>
        {/* Initials circle */}
        <View style={[styles.circle, { backgroundColor: colors.primary }]}>
          <Text style={[styles.initials, {
            color:      colors.white,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.xxl + 6,
          }]}>
            {getInitials(name)}
          </Text>
        </View>

        {/* Camera badge — triggers photo picker */}
        <TouchableOpacity
          style={[styles.cameraBadge, {
            backgroundColor: colors.text,
            borderColor:     colors.white,
          }]}
          activeOpacity={0.8}
          onPress={onCamera}
        >
          <Ionicons name="camera" size={14} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── Hint text ── */}
      <Text style={[styles.hint, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.xs,
      }]}>
        Tap camera to change photo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignItems:   "center",
    gap:          10,
    marginBottom: 4,
  },
  wrap: {
    position: "relative",
  },
  circle: {
    width:          88,
    height:         88,
    borderRadius:   44,
    alignItems:     "center",
    justifyContent: "center",
  },
  initials: {},
  cameraBadge: {
    position:     "absolute",
    bottom:       0,
    right:        0,
    width:        28,
    height:       28,
    borderRadius: 14,
    alignItems:   "center",
    justifyContent:"center",
    borderWidth:  2,
  },
  hint: {},
});
