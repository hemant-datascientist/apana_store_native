// ============================================================
// CREATE ACCOUNT — Apana Store (Customer App)
//
// New user registration. Collects name + email + phone.
// Both phone AND email are verified via OTP in sequence:
//   Step 1 → Phone OTP  /  Step 2 → Email OTP  → Account created
//
// Flow:
//   Fill fields → "Create Account" → POST /auth/register (sends OTP to phone)
//   → navigates to /otp with { flow:"register", name, phone, phoneDisplay, email }
//   → OTP screen handles both steps → login() → tabs
//
// Backend:
//   POST /auth/register  { name, email, phone, app: "customer" }
//   → 200 { session_token, expires_in: 300 }   (OTP sent to phone)
//
// Components: AuthHeader, SignupWelcome, VerificationInfoCard,
//             FormField, PhoneFormField, CreateAccountButton,
//             SignInLink, AuthTerms
// ============================================================

import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, StatusBar, Alert, TextInput,
} from "react-native";
import { useRouter }            from "expo-router";
import useTheme                 from "../../theme/useTheme";
import AuthHeader               from "../../components/auth/AuthHeader";
import SignupWelcome            from "../../components/auth/SignupWelcome";
import VerificationInfoCard     from "../../components/auth/VerificationInfoCard";
import FormField                from "../../components/auth/FormField";
import PhoneFormField           from "../../components/auth/PhoneFormField";
import CreateAccountButton      from "../../components/auth/CreateAccountButton";
import SignInLink               from "../../components/auth/SignInLink";
import AuthTerms                from "../../components/auth/AuthTerms";

function isValidPhone(v: string) { return /^[6-9]\d{9}$/.test(v.replace(/\s/g, "")); }
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidName(v: string)  { return v.trim().length >= 2; }

export default function CreateAccountScreen() {
  const router    = useRouter();
  const { colors }= useTheme();

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const nameOk    = isValidName(name);
  const emailOk   = isValidEmail(email);
  const phoneOk   = isValidPhone(phone);
  const canSubmit = nameOk && emailOk && phoneOk;

  async function handleCreateAccount() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      // TODO: POST /auth/register { name: name.trim(), email, phone: "+91...", app:"customer" }
      await new Promise(r => setTimeout(r, 800));

      // Pass all contacts — OTP screen handles step 1 (phone) then step 2 (email)
      router.push({
        pathname: "/otp",
        params: {
          flow:         "register",
          name:         name.trim(),
          phone:        `+91${phone.replace(/\s/g, "")}`,
          phoneDisplay: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
          email:        email.trim(),
        },
      });
    } catch {
      Alert.alert("Error", "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.card }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Header ── */}
      <AuthHeader title="Create Account" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Welcome heading ── */}
        <SignupWelcome />

        {/* ── Two-step verification info card ── */}
        <VerificationInfoCard />

        {/* ── Name field ── */}
        <FormField
          label="Full Name"
          icon="person-outline"
          value={name}
          onChange={setName}
          placeholder="Enter your full name"
          error={!nameOk && name.length > 0 ? "Enter at least 2 characters" : undefined}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmit={() => emailRef.current?.focus()}
          autoFocus
        />

        {/* ── Email field ── */}
        <FormField
          label="Email Address"
          icon="mail-outline"
          value={email}
          onChange={setEmail}
          placeholder="Enter email address"
          error={!emailOk && email.length > 0 ? "Enter a valid email address" : undefined}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmit={() => phoneRef.current?.focus()}
          inputRef={emailRef}
        />

        {/* ── Phone field ── */}
        <PhoneFormField
          value={phone}
          onChange={setPhone}
          error={!phoneOk && phone.length > 0 ? "Enter a valid 10-digit mobile number" : undefined}
          inputRef={phoneRef}
          onSubmit={canSubmit ? handleCreateAccount : undefined}
        />

        {/* ── Submit CTA ── */}
        <CreateAccountButton
          canSubmit={canSubmit}
          loading={loading}
          onPress={handleCreateAccount}
        />

        {/* ── Already have account link ── */}
        <SignInLink onPress={() => router.replace("/login")} />

        {/* ── Terms ── */}
        <AuthTerms action="creating an account" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop:        28,
    paddingBottom:     48,
    gap:               16,
  },
});
