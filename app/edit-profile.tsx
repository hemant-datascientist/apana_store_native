// ============================================================
// EDIT PROFILE — Apana Store (Customer App)
//
// Lets user update their display name and email.
// Phone is read-only (tied to OTP auth — change via re-login).
//
// Backend:
//   GET  /customer/profile         → prefill fields
//   PUT  /customer/profile         { name, email }
//   POST /customer/avatar          multipart/form-data → avatar_url
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, ScrollView, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter }    from "expo-router";
import { typography }   from "../theme/typography";
import { MOCK_USER }    from "../data/profileData";

const BRAND_BLUE = "#0F4C81";

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function EditProfileScreen() {
  const router = useRouter();

  // Pre-fill from mock — swap with useAuth().user or API response
  const [name,    setName]    = useState(MOCK_USER.name);
  const [email,   setEmail]   = useState(MOCK_USER.email);
  const [loading, setLoading] = useState(false);
  const [dirty,   setDirty]   = useState(false);

  function handleName(v: string)  { setName(v);  setDirty(true); }
  function handleEmail(v: string) { setEmail(v); setDirty(true); }

  const nameValid  = name.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSave    = dirty && nameValid && emailValid;

  async function handleSave() {
    if (!canSave) return;
    setLoading(true);
    try {
      // TODO: PUT /customer/profile { name: name.trim(), email: email.trim() }
      await new Promise(r => setTimeout(r, 700));
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

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBack} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          Edit Profile
        </Text>
        {/* Save shortcut in header */}
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={canSave ? handleSave : undefined}
          activeOpacity={canSave ? 0.75 : 1}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[
              styles.headerSave,
              { fontFamily: typography.fontFamily.semiBold },
              !canSave && styles.headerSaveDisabled,
            ]}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={[styles.initials, { fontFamily: typography.fontFamily.bold }]}>
                {getInitials(name || "?")}
              </Text>
            </View>
            {/* Camera badge */}
            <TouchableOpacity
              style={styles.cameraBadge}
              activeOpacity={0.8}
              onPress={() => Alert.alert("Change Photo", "Photo upload coming soon.")}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.avatarHint, { fontFamily: typography.fontFamily.regular }]}>
            Tap camera to change photo
          </Text>
        </View>

        {/* ── Fields ── */}
        <View style={styles.fieldGroup}>

          {/* Name */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { fontFamily: typography.fontFamily.medium }]}>
              Full Name
            </Text>
            <View style={[styles.fieldRow, !nameValid && name.length > 0 && styles.fieldRowError]}>
              <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.fieldIcon} />
              <TextInput
                style={[styles.fieldInput, { fontFamily: typography.fontFamily.regular }]}
                value={name}
                onChangeText={handleName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
                autoCapitalize="words"
              />
              {name.length > 0 && (
                <TouchableOpacity onPress={() => { setName(""); setDirty(true); }}>
                  <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            {!nameValid && name.length > 0 && (
              <Text style={[styles.fieldError, { fontFamily: typography.fontFamily.regular }]}>
                Name must be at least 2 characters
              </Text>
            )}
          </View>

          {/* Phone — read only */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { fontFamily: typography.fontFamily.medium }]}>
              Mobile Number
            </Text>
            <View style={[styles.fieldRow, styles.fieldRowLocked]}>
              <Ionicons name="phone-portrait-outline" size={18} color="#9CA3AF" style={styles.fieldIcon} />
              <Text style={[styles.fieldLocked, { fontFamily: typography.fontFamily.regular }]}>
                {MOCK_USER.phone}
              </Text>
              <View style={styles.lockedBadge}>
                <Ionicons name="lock-closed" size={11} color="#6B7280" />
                <Text style={[styles.lockedBadgeText, { fontFamily: typography.fontFamily.medium }]}>
                  Locked
                </Text>
              </View>
            </View>
            <Text style={[styles.fieldHint, { fontFamily: typography.fontFamily.regular }]}>
              Phone is linked to your OTP login and cannot be changed here
            </Text>
          </View>

          {/* Email */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { fontFamily: typography.fontFamily.medium }]}>
              Email Address
            </Text>
            <View style={[styles.fieldRow, !emailValid && email.length > 0 && styles.fieldRowError]}>
              <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.fieldIcon} />
              <TextInput
                style={[styles.fieldInput, { fontFamily: typography.fontFamily.regular }]}
                value={email}
                onChangeText={handleEmail}
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={canSave ? handleSave : undefined}
              />
              {email.length > 0 && (
                <TouchableOpacity onPress={() => { setEmail(""); setDirty(true); }}>
                  <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            {!emailValid && email.length > 0 && (
              <Text style={[styles.fieldError, { fontFamily: typography.fontFamily.regular }]}>
                Enter a valid email address
              </Text>
            )}
          </View>

        </View>

        {/* ── Save button ── */}
        <TouchableOpacity
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
          activeOpacity={canSave ? 0.88 : 1}
          onPress={canSave ? handleSave : undefined}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={[styles.saveBtnText, { fontFamily: typography.fontFamily.bold }]}>
                Save Changes
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* ── Danger zone ── */}
        <View style={styles.dangerBlock}>
          <Text style={[styles.dangerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
            Danger Zone
          </Text>
          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.8}
            onPress={() => Alert.alert(
              "Delete Account",
              "This will permanently delete your account and all data. This cannot be undone.",
              [
                { text: "Cancel",              style: "cancel"      },
                { text: "Delete My Account",   style: "destructive", onPress: () => {} },
              ],
            )}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text style={[styles.deleteBtnText, { fontFamily: typography.fontFamily.medium }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  // ── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor:   BRAND_BLUE,
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
    paddingBottom:     14,
  },
  headerBtn: {
    width:          48,
    height:         44,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:      1,
    fontSize:  17,
    color:     "#fff",
    textAlign: "center",
  },
  headerSave:         { fontSize: 15, color: "#fff" },
  headerSaveDisabled: { opacity: 0.4 },

  // ── Scroll ──────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingTop:        28,
    paddingBottom:     48,
    gap:               20,
  },

  // ── Avatar ──────────────────────────────────────────────────
  avatarSection: {
    alignItems:   "center",
    gap:          10,
    marginBottom: 4,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width:           88,
    height:          88,
    borderRadius:    44,
    backgroundColor: BRAND_BLUE,
    alignItems:      "center",
    justifyContent:  "center",
  },
  initials: {
    fontSize: 30,
    color:    "#fff",
  },
  cameraBadge: {
    position:        "absolute",
    bottom:          0,
    right:           0,
    width:           28,
    height:          28,
    borderRadius:    14,
    backgroundColor: "#374151",
    alignItems:      "center",
    justifyContent:  "center",
    borderWidth:     2,
    borderColor:     "#fff",
  },
  avatarHint: {
    fontSize: 12,
    color:    "#9CA3AF",
  },

  // ── Fields ──────────────────────────────────────────────────
  fieldGroup: { gap: 16 },
  fieldBlock:  { gap: 6  },
  fieldLabel: {
    fontSize: 13,
    color:    "#374151",
  },
  fieldRow: {
    flexDirection:     "row",
    alignItems:        "center",
    borderWidth:       1.5,
    borderColor:       "#E5E7EB",
    borderRadius:      12,
    backgroundColor:   "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical:   4,
    gap:               8,
  },
  fieldRowError:  { borderColor: "#EF4444" },
  fieldRowLocked: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
  fieldIcon:      {},
  fieldInput: {
    flex:          1,
    fontSize:      15,
    color:         "#111827",
    paddingVertical: 12,
  },
  fieldLocked: {
    flex:          1,
    fontSize:      15,
    color:         "#9CA3AF",
    paddingVertical: 12,
  },
  lockedBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               3,
    backgroundColor:   "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      8,
  },
  lockedBadgeText: {
    fontSize: 10,
    color:    "#6B7280",
  },
  fieldError: {
    fontSize: 11,
    color:    "#EF4444",
    marginTop: 2,
  },
  fieldHint: {
    fontSize: 11,
    color:    "#9CA3AF",
    marginTop: 2,
  },

  // ── Save button ─────────────────────────────────────────────
  saveBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    backgroundColor: BRAND_BLUE,
    borderRadius:    16,
    paddingVertical: 17,
    shadowColor:     BRAND_BLUE,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.28,
    shadowRadius:    10,
    elevation:       5,
    marginTop:       4,
  },
  saveBtnDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity:   0,
    elevation:       0,
  },
  saveBtnText: { color: "#fff", fontSize: 16 },

  // ── Danger zone ─────────────────────────────────────────────
  dangerBlock: {
    marginTop:         8,
    padding:           16,
    borderRadius:      14,
    borderWidth:       1,
    borderColor:       "#FEE2E2",
    backgroundColor:   "#FFF5F5",
    gap:               12,
  },
  dangerTitle: {
    fontSize: 12,
    color:    "#EF4444",
    letterSpacing: 0.6,
  },
  deleteBtn: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            8,
  },
  deleteBtnText: {
    fontSize: 14,
    color:    "#EF4444",
  },
});
