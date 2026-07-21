// ============================================================
// SCREEN HEADER — back arrow, centred title, optional subtitle.
//
// Shared by the booking and menu screens so their chrome cannot drift apart.
// Older screens keep their own inline headers; this is not a migration.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string | null;
  right?: React.ReactNode;
}

export default function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.side} onPress={() => router.back()} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text
          numberOfLines={1}
          style={[styles.title, {
            color: colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.size.md,
          }]}
        >
          {title}
        </Text>
        {subtitle != null && subtitle.length > 0 && (
          <Text
            numberOfLines={1}
            style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: { width: 44, height: 40, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, alignItems: "center" },
  title: {},
  sub: { fontSize: typography.size.xs, marginTop: 1 },
});
