// ============================================================
// ERROR BOUNDARY — the app's last line before a white screen.
//
// WHY THIS IS THE MOST IMPORTANT FILE IN components/ui
// ----------------------------------------------------
// Everything else here handles a FAILED REQUEST, which the screen expects
// and can branch on. This handles a THROWN RENDER — a null field read a
// level deeper than a guard, a bad shape from a changed endpoint, a
// malformed persisted blob. Without a boundary, React unmounts the entire
// tree and the customer is left holding a blank screen with no back
// button and no way out except force-quitting the app.
//
// This codebase has already shipped several "field the backend can return
// as null, read without a guard" bugs. Those are fixed one at a time; this
// is what stops the NEXT one from being a dead app instead of one broken
// screen.
//
// Must be a CLASS component: componentDidCatch/getDerivedStateFromError
// have no hook equivalent — there is no useErrorBoundary in React.
//
// SCOPE: this catches render/lifecycle errors in the tree below it. It
// does NOT catch errors inside event handlers or async callbacks (React
// never throws those through the tree) — those still need try/catch at
// the call site.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  children: React.ReactNode;
  /** Optional hook for a crash reporter once one exists (Sentry etc). */
  onError?: (error: Error, stack: string) => void;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Logged loudly. There is no crash reporter wired yet, so the console
    // during a dev/trial run is the only place this is visible — which is
    // exactly why it must not be swallowed.
    console.error("[ErrorBoundary] render crash:", error, info.componentStack);
    this.props.onError?.(error, info.componentStack ?? "");
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      // Theme tokens are deliberately NOT used here. If the crash came from
      // the theme provider itself, useTheme would throw again and the
      // boundary would be caught in a loop. Fixed colours guarantee this
      // screen can always render.
      <View style={styles.root}>
        <View style={styles.iconWrap}>
          <Ionicons name="warning-outline" size={38} color="#B45309" />
        </View>

        <Text style={styles.title}>This screen ran into a problem</Text>
        <Text style={styles.message}>
          Your data is safe — nothing was lost. Try again, and if it keeps
          happening, restart the app.
        </Text>

        {/* Dev only: the message a developer needs, never shown to a real
            user in a release build where it would be noise at best. */}
        {__DEV__ && (
          <ScrollView style={styles.devBox} contentContainerStyle={{ padding: 12 }}>
            <Text style={styles.devText}>{error.message}</Text>
            {error.stack ? <Text style={styles.devStack}>{error.stack}</Text> : null}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.btn} onPress={this.reset} activeOpacity={0.85}>
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1, alignItems: "center", justifyContent: "center",
    padding: 32, gap: 10, backgroundColor: "#FFFFFF",
  },
  iconWrap: {
    width: 76, height: 76, borderRadius: 38, alignItems: "center",
    justifyContent: "center", backgroundColor: "#FEF3C7", marginBottom: 4,
  },
  title:   { fontSize: 18, fontWeight: "700", color: "#111827", textAlign: "center" },
  message: { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 20, maxWidth: 300 },
  devBox: {
    maxHeight: 180, alignSelf: "stretch", backgroundColor: "#F3F4F6",
    borderRadius: 10, marginTop: 12,
  },
  devText:  { fontSize: 12, color: "#B91C1C", fontWeight: "600" },
  devStack: { fontSize: 10, color: "#6B7280", marginTop: 8 },
  btn: {
    flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14,
    paddingHorizontal: 24, paddingVertical: 13, borderRadius: 12,
    backgroundColor: "#0F4C81",
  },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
