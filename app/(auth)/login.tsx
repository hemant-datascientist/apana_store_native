// ============================================================
// LOGIN — Apana Store (Customer App)
//
// OTP-based login. No passwords.
// Two methods: Phone number (+91) OR Email address.
//
// Flow:
//   Enter phone/email → "Send OTP" → navigates to /otp
//
// Backend:
//   POST /auth/send-otp  { phone | email, app: "customer" }
//   → 200 { expires_in: 300 }
//
// Components: AuthHeader, WelcomeBlock, MethodToggle, PhoneInput,
//             EmailInput, InputHint, SendOtpButton, CreateAccountLink,
//             OrDivider, GuestModeCard, AuthTerms
// ============================================================

import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, StatusBar, Alert,
  TextInput,
} from "react-native";
import { useRouter }        from "expo-router";
import useTheme             from "../../theme/useTheme";
import { useAuth }          from "../../context/AuthContext";
import { useLocation }      from "../../context/LocationContext";
import AuthHeader           from "../../components/auth/AuthHeader";
import WelcomeBlock         from "../../components/auth/WelcomeBlock";
import MethodToggle         from "../../components/auth/MethodToggle";
import PhoneInput           from "../../components/auth/PhoneInput";
import EmailInput           from "../../components/auth/EmailInput";
import InputHint            from "../../components/auth/InputHint";
import SendOtpButton        from "../../components/auth/SendOtpButton";
import CreateAccountLink    from "../../components/auth/CreateAccountLink";
import OrDivider            from "../../components/shared/OrDivider";
import GuestModeCard        from "../../components/auth/GuestModeCard";
import AuthTerms            from "../../components/auth/AuthTerms";

type Method = "phone" | "email";

function isValidPhone(v: string) { return /^[6-9]\d{9}$/.test(v.replace(/\s/g, "")); }
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

export default function LoginScreen() {
  const router          = useRouter();
  const { skipAsGuest }   = useAuth();
  const { colors }        = useTheme();
  const { locationReady } = useLocation();

  const [method,  setMethod]  = useState<Method>("phone");
  const [phone,   setPhone]   = useState("");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);

  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const isPhone  = method === "phone";
  const value    = isPhone ? phone : email;
  const isValid  = isPhone ? isValidPhone(value) : isValidEmail(value);

  // ── Switch method + auto-focus the relevant input ─────────────
  function switchMethod(m: Method) {
    setMethod(m);
    setTimeout(() => {
      if (m === "phone") phoneRef.current?.focus();
      else emailRef.current?.focus();
    }, 100);
  }

  async function handleSendOtp() {
    if (!isValid) return;
    setLoading(true);
    try {
      // TODO: POST /auth/send-otp { [method]: value, app: "customer" }
      await new Promise(r => setTimeout(r, 800));

      router.push({
        pathname: "/otp",
        params: {
          method,
          contact: isPhone ? `+91${phone.replace(/\s/g, "")}` : email,
          display: isPhone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : email,
        },
      });
    } catch {
      Alert.alert("Error", "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    skipAsGuest();
    router.replace(locationReady ? "/(tabs)" : "/location-access");
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.card }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Header ── */}
      <AuthHeader title="Sign In" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <WelcomeBlock />

        {/* ── Method toggle (Phone / Email) ── */}
        <MethodToggle method={method} onChange={switchMethod} />

        {/* ── Input — swaps based on method ── */}
        {isPhone ? (
          <PhoneInput
            value={phone}
            onChange={setPhone}
            inputRef={phoneRef}
            onSubmit={isValid ? handleSendOtp : undefined}
            autoFocus
          />
        ) : (
          <EmailInput
            value={email}
            onChange={setEmail}
            inputRef={emailRef}
            onSubmit={isValid ? handleSendOtp : undefined}
            autoFocus
          />
        )}

        <InputHint method={method} />

        {/* ── Primary CTA ── */}
        <SendOtpButton isValid={isValid} loading={loading} onPress={handleSendOtp} />

        {/* ── Create Account shortcut ── */}
        <CreateAccountLink onPress={() => router.push("/create-account")} />

        <OrDivider />

        {/* ── Guest mode ── */}
        <GuestModeCard onPress={handleSkip} />

        <AuthTerms action="signing in" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop:        32,
    paddingBottom:     48,
    gap:               16,
  },
});
