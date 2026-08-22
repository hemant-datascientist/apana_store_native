// ============================================================
// STATE VIEW — one component for "there is nothing here", "it broke",
// "you are offline" and "that page does not exist".
//
// WHY ONE COMPONENT FOR FOUR STATES
// ---------------------------------
// They differ only in icon, tone and whether a retry makes sense — but
// they are constantly confused in practice, and confusing them is the
// actual bug. "No stores near you" (empty, normal, nothing to fix) looked
// identical to "we could not reach the server" (error, retryable) in most
// of this app's screens, so a customer with a dead connection concluded
// there were no shops in their city.
//
// Keeping them in one place forces the distinction to be made at the call
// site, where the screen actually knows which one is true:
//
//   empty   — the request SUCCEEDED and returned nothing. No retry button,
//             because retrying changes nothing (§19.8: empty is empty).
//   error   — the request FAILED. Retry, always.
//   offline — the device has no connection. Retry, and say so plainly
//             rather than blaming the shop.
//   notFound— the thing asked for does not exist. Go back / go home.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export type StateVariant = "empty" | "error" | "offline" | "notFound";

interface Props {
  variant: StateVariant;
  /** Overrides the default headline for this variant. */
  title?: string;
  /** Overrides the default explanation. Say what the user can DO. */
  message?: string;
  /** Overrides the default icon. */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Shown for error/offline/notFound. Omitted for `empty` unless given. */
  actionLabel?: string;
  onAction?: () => void;
  /** A quieter second action, e.g. "Go home" next to "Try again". */
  secondaryLabel?: string;
  onSecondary?: () => void;
  style?: ViewStyle;
}

const DEFAULTS: Record<StateVariant, { icon: keyof typeof Ionicons.glyphMap; title: string; message: string; action?: string }> = {
  empty: {
    icon: "file-tray-outline",
    title: "Nothing here yet",
    message: "When there is something to show, it will appear here.",
  },
  error: {
    icon: "alert-circle-outline",
    title: "Something went wrong",
    // Never blames the user, and never claims to know the cause.
    message: "We couldn't load this. It's not you — try again in a moment.",
    action: "Try again",
  },
  offline: {
    icon: "cloud-offline-outline",
    title: "You're offline",
    message: "Check your connection and try again.",
    action: "Retry",
  },
  notFound: {
    icon: "compass-outline",
    title: "This page doesn't exist",
    message: "The link may be old, or the page may have moved.",
    action: "Go home",
  },
};

export default function StateView({
  variant, title, message, icon, actionLabel, onAction, secondaryLabel, onSecondary, style,
}: Props) {
  const { colors } = useTheme();
  const d = DEFAULTS[variant];

  // Error and offline read in the danger/warning tone; empty and notFound
  // are neutral — nothing has gone wrong in either.
  const tint =
    variant === "error"   ? colors.danger
    : variant === "offline" ? colors.warning
    : colors.subText;

  const label = actionLabel ?? d.action;
  const showAction = Boolean(label && onAction);

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.iconWrap, { backgroundColor: tint + "18" }]}>
        <Ionicons name={icon ?? d.icon} size={34} color={tint} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title ?? d.title}</Text>
      <Text style={[styles.message, { color: colors.subText }]}>{message ?? d.message}</Text>

      {showAction && (
        <TouchableOpacity
          style={[styles.action, { backgroundColor: colors.primary }]}
          onPress={onAction}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>{label}</Text>
        </TouchableOpacity>
      )}

      {secondaryLabel && onSecondary && (
        <TouchableOpacity style={styles.secondary} onPress={onSecondary} activeOpacity={0.7}>
          <Text style={[styles.secondaryText, { color: colors.primary }]}>{secondaryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 10 },
  iconWrap: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  title:    { fontSize: typography.size.lg, fontFamily: typography.fontFamily.bold, textAlign: "center" },
  message:  { fontSize: typography.size.sm, fontFamily: typography.fontFamily.regular, textAlign: "center", lineHeight: 20, maxWidth: 300 },
  action: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 22, paddingVertical: 12, borderRadius: 12, marginTop: 8,
  },
  actionText:    { color: "#fff", fontSize: typography.size.sm, fontFamily: typography.fontFamily.bold },
  secondary:     { paddingVertical: 8, paddingHorizontal: 12 },
  secondaryText: { fontSize: typography.size.sm, fontFamily: typography.fontFamily.semiBold },
});
