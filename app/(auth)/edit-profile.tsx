// ============================================================
// EDIT PROFILE — Apana Store (Customer App)
//
// Lets user update their display name and email.
// Phone is read-only (tied to OTP auth — change via re-login).
//
// Backend:
//   GET  /customer/profile   → prefill fields
//   PUT  /customer/profile   { name, email }
//   POST /customer/avatar    multipart/form-data → avatar_url
//
// Components: AuthHeader, AvatarSection, EditableField,
//             LockedField, SaveButton, DangerZone
// ============================================================

import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, StatusBar, Alert, ActivityIndicator, Text,
  TouchableOpacity,
} from "react-native";
import { useRouter }    from "expo-router";
import useTheme         from "../../theme/useTheme";
import { useCustomerProfile } from "../../hooks/useCustomerProfile";
import { typography }   from "../../theme/typography";
import AuthHeader       from "../../components/auth/AuthHeader";
import AvatarSection    from "../../components/tabs/profile/AvatarSection";
import EditableField    from "../../components/tabs/profile/EditableField";
import LockedField      from "../../components/tabs/profile/LockedField";
import SaveButton       from "../../components/tabs/profile/SaveButton";
import DangerZone       from "../../components/tabs/profile/DangerZone";

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

export default function EditProfileScreen() {
  const router     = useRouter();
  const { colors } = useTheme();

  // THIS person's saved details, not MOCK_USER. Empty until they load — and
  // empty is correct for someone who has never given a name.
  const { profile, save } = useCustomerProfile();
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  // Seed once the profile arrives, without clobbering anything already typed.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || !profile) return;
    seeded.current = true;
    setName(profile.name ?? "");
    setEmail(profile.email ?? "");
  }, [profile]);
  const [loading, setLoading] = useState(false);
  const [dirty,   setDirty]   = useState(false);

  function handleName(v: string)  { setName(v);  setDirty(true); }
  function handleEmail(v: string) { setEmail(v); setDirty(true); }

  const nameValid  = name.trim().length >= 2;
  const emailValid = isValidEmail(email);
  const canSave    = dirty && nameValid && emailValid;

  async function handleSave() {
    if (!canSave) return;
    setLoading(true);
    try {
      // A REAL save. This was a 700 ms sleep followed by "Your profile has been
      // updated" — nothing was written, and the next screen still showed the
      // old details. Same shape as the withdrawal that was never processed.
      const okSaved = await save({ name: name.trim(), email: email.trim() });
      if (!okSaved) {
        Alert.alert("Could not save", "Check your connection and try again.");
        return;
      }
      Alert.alert("Saved", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Could not save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (dirty) {
      Alert.alert("Discard Changes?", "You have unsaved changes.", [
        { text: "Keep Editing", style: "cancel" },
        { text: "Discard",      style: "destructive", onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  }

  // ── "Save" text button injected into the header's right slot ──
  const headerSave = (
    <TouchableOpacity
      onPress={canSave ? handleSave : undefined}
      activeOpacity={canSave ? 0.75 : 1}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Text style={[styles.headerSave, {
          color:      colors.white,
          fontFamily: typography.fontFamily.semiBold,
          fontSize:   typography.size.md - 1,
          opacity:    canSave ? 1 : 0.4,
        }]}>
          Save
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.card }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Header with Save shortcut ── */}
      <AuthHeader
        title="Edit Profile"
        onBack={handleBack}
        rightSlot={headerSave}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar + camera badge ── */}
        <AvatarSection
          name={name}
          onCamera={() => Alert.alert("Profile photo", "Apana can't store a profile photo yet, so there is nothing to upload to.")}
        />

        {/* ── Editable fields group ── */}
        <EditableField
          label="Full Name"
          icon="person-outline"
          value={name}
          onChange={handleName}
          placeholder="Enter your full name"
          error={!nameValid && name.length > 0 ? "Name must be at least 2 characters" : undefined}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* Phone is read-only */}
        <LockedField
          label="Mobile Number"
          icon="phone-portrait-outline"
          value={profile?.phone ?? ""}
          hint="Phone is linked to your OTP login and cannot be changed here"
        />

        <EditableField
          label="Email Address"
          icon="mail-outline"
          value={email}
          onChange={handleEmail}
          placeholder="Enter email address"
          error={!emailValid && email.length > 0 ? "Enter a valid email address" : undefined}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmit={canSave ? handleSave : undefined}
        />

        {/* ── Save Changes CTA ── */}
        <SaveButton canSave={canSave} loading={loading} onPress={handleSave} />

        {/* ── Danger zone ── */}
        <DangerZone onDelete={() => {
          // TODO: DELETE /customer/account → logout → get-started
        }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  headerSave: {},
  scroll: {
    paddingHorizontal: 20,
    paddingTop:        28,
    paddingBottom:     48,
    gap:               16,
  },
});
