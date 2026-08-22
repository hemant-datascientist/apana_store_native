// ============================================================
// 404 — an unmatched route.
//
// expo-router renders its own developer-facing "Unmatched Route" screen
// when no file matches. That page names the path and links to a sitemap:
// useful in development, alarming to a shopper who tapped an old shared
// link and is now looking at what appears to be a broken app.
//
// Reachable in normal use through: a shared store link (§30) for a shop
// that was later removed, an old notification deep link, a QR code
// printed before a route was renamed.
// ============================================================

import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import useTheme from "../theme/useTheme";
import StateView from "../components/ui/StateView";

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Not found", headerShown: false }} />
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <StateView
          variant="notFound"
          message="This link may be old, or the shop may no longer be on Apana."
          actionLabel="Go home"
          // replace, not push: the broken route must not stay on the back
          // stack for the user to accidentally return to.
          onAction={() => router.replace("/(tabs)")}
          secondaryLabel={router.canGoBack() ? "Go back" : undefined}
          onSecondary={router.canGoBack() ? () => router.back() : undefined}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
