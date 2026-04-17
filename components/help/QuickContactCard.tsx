// ============================================================
// QUICK CONTACT CARD — Apana Store (Help Component)
//
// Row of 3 quick-action tiles: WhatsApp, Call, Email.
// Each tile opens the relevant system handler via Linking.
//
// Note: tile colors come from helpData (category-specific
// accent colors, not theme tokens).
//
// Props:
//   actions — QuickAction[] from helpData
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, Linking, Alert, StyleSheet } from "react-native";
import { Ionicons }       from "@expo/vector-icons";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";
import { QuickAction }    from "../../data/helpData";

interface QuickContactCardProps {
  actions: QuickAction[];
}

// ── Build the correct URL for each action type ────────────────
function buildUrl(action: QuickAction): string {
  switch (action.action) {
    case "whatsapp":
      return `https://wa.me/${action.target}?text=${encodeURIComponent("Hi Apana Store Support, I need help with my order.")}`;
    case "call":
    case "email":
      return action.target;
    default:
      return "";
  }
}

export default function QuickContactCard({ actions }: QuickContactCardProps) {
  const { colors } = useTheme();

  async function handlePress(action: QuickAction) {
    const url = buildUrl(action);
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Unavailable", "Could not open this contact option on your device.");
    }
  }

  return (
    <View style={styles.row}>
      {actions.map(action => (
        <TouchableOpacity
          key={action.key}
          style={[styles.tile, {
            backgroundColor: colors.card,
            borderColor:     colors.border,
          }]}
          activeOpacity={0.75}
          onPress={() => handlePress(action)}
        >
          {/* ── Icon circle ── */}
          <View style={[styles.iconWrap, { backgroundColor: action.color + "18" }]}>
            <Ionicons name={action.icon as any} size={22} color={action.color} />
          </View>

          {/* ── Label ── */}
          <Text style={[styles.label, {
            color:      colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.xs,
          }]} numberOfLines={2}>
            {action.label}
          </Text>

          {/* ── Sub text ── */}
          <Text style={[styles.sub, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs - 2,
          }]} numberOfLines={2}>
            {action.sub}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap:           10,
  },
  tile: {
    flex:          1,
    borderRadius:  14,
    borderWidth:   1,
    padding:       14,
    alignItems:    "center",
    gap:           8,
  },
  iconWrap: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  label: { textAlign: "center" },
  sub:   { textAlign: "center", lineHeight: 14 },
});
