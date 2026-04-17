// ============================================================
// PROFILE SETTING SECTION — Apana Store (Customer App)
//
// Grouped settings block: section title + list of tappable rows.
// Each row: left icon · label · optional badge · chevron right.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SettingGroup } from "../../data/profileData";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface ProfileSettingSectionProps {
  group:   SettingGroup;
  onPress: (key: string) => void;
}

export default function ProfileSettingSection({ group, onPress }: ProfileSettingSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>

      {/* Section title */}
      <Text style={[styles.title, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
        {group.title.toUpperCase()}
      </Text>

      {/* Rows card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {group.items.map((item, i) => (
          <React.Fragment key={item.key}>
            {i > 0 && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
            <TouchableOpacity
              style={styles.row}
              onPress={() => onPress(item.key)}
              activeOpacity={0.7}
            >
              {/* Left icon */}
              <View style={[styles.iconWrap, { backgroundColor: colors.primary + "12" }]}>
                <Ionicons name={item.icon as any} size={18} color={colors.primary} />
              </View>

              {/* Label */}
              <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
                {item.label}
              </Text>

              {/* Optional badge */}
              {item.badge && (
                <Text style={[styles.badge, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  {item.badge}
                </Text>
              )}

              {/* Chevron */}
              <Ionicons name="chevron-forward" size={16} color={colors.subText} />
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop:         16,
    paddingHorizontal: 16,
  },
  title: {
    letterSpacing: 0.8,
    marginBottom:  8,
  },
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            12,
    paddingVertical:   14,
    paddingHorizontal: 14,
  },
  iconWrap: {
    width:          34,
    height:         34,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
  },
  badge: {
    marginRight: 2,
  },
  separator: {
    height:           1,
    marginHorizontal: 14,
  },
});
