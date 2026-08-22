// ============================================================
// SPINNER — inline "this is working" for point actions.
//
// Use when the SHAPE of what is coming is unknown, or the wait belongs to
// one control rather than the page: a button submitting, a row refreshing,
// a modal saving. When the shape IS known (a list, a card), use
// <Skeleton> instead — it tells the user more.
//
// InlineSpinner is deliberately not full-screen: blocking the whole page
// for a 200ms request is what makes an app feel slower than it is.
// ============================================================

import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, type ViewStyle } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface Props {
  /** Optional label. Say what is happening — "Placing order", not "Loading". */
  label?: string;
  size?: "small" | "large";
  /** Override the tint; defaults to the app's primary. */
  color?: string;
  style?: ViewStyle;
}

/** Spinner sized to sit inside a row, button or card. */
export function InlineSpinner({ label, size = "small", color, style }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.inline, style]} accessibilityRole="progressbar" accessibilityLabel={label ?? "Loading"}>
      <ActivityIndicator size={size} color={color ?? colors.primary} />
      {label ? (
        <Text style={[styles.label, { color: colors.subText }]}>{label}</Text>
      ) : null}
    </View>
  );
}

/**
 * Centred in whatever space it is given.
 *
 * For a first page load prefer <SkeletonList>; this is for the cases where
 * a skeleton would be a lie about the shape — a search that may return one
 * row or fifty, a map resolving.
 */
export function CenteredSpinner({ label, size = "large", color, style }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.centered, style]} accessibilityRole="progressbar" accessibilityLabel={label ?? "Loading"}>
      <ActivityIndicator size={size} color={color ?? colors.primary} />
      {label ? (
        <Text style={[styles.label, { color: colors.subText, marginTop: 10 }]}>{label}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inline:   { flexDirection: "row", alignItems: "center", gap: 8 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  label:    { fontSize: typography.size.xs, fontFamily: typography.fontFamily.medium },
});
