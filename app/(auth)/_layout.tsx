// ============================================================
// AUTH LAYOUT — Apana Store (Customer App)
//
// Route group layout for all auth and account screens:
//   get-started, login, create-account, otp, location-access,
//   edit-profile, notifications
//
// All screens manage their own headers via AuthHeader,
// so the Stack navigator runs header-less.
// ============================================================

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="get-started"    />
      <Stack.Screen name="login"          />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="otp"             />
      <Stack.Screen name="location-access"/>
      <Stack.Screen name="edit-profile"   />
      <Stack.Screen name="notifications"  />
    </Stack>
  );
}
