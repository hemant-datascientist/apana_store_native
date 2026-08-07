// ============================================================
// OTP SCREEN — Apana Store (Customer App)
//
// LOGIN flow  (from /login):
//   params: { flow:"login", method:"phone"|"email", contact, display }
//   → Single OTP step → login() → tabs
//
// REGISTER flow (from /create-account):
//   params: { flow:"register", name, phone, phoneDisplay, email }
//   → Step 1: Verify phone OTP
//   → Step 2: Verify email OTP
//   → login() with full user (name + phone + email) → tabs
//
// Backend:
//   POST /auth/send-otp    { phone|email, app:"customer" }
//   POST /auth/verify-otp  { method, contact, otp, session_token }
//   POST /auth/register    { name, phone, email, phone_otp, email_otp }
//   → { access_token, refresh_token, user }
//
// Components: AuthHeader, StepIndicator, OtpIcon, OtpContactDisplay,
//             OtpInputRow, TimerResend, VerifyButton, WrongContactLink
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View, KeyboardAvoidingView, Platform, StyleSheet,
  StatusBar, Alert, TextInput,
  NativeSyntheticEvent, TextInputKeyPressEventData,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme              from "../../theme/useTheme";
import { useAuth, AuthUser } from "../../context/AuthContext";
import { useLocation }       from "../../context/LocationContext";
import { sendOtp, verifyOtp, toE164 } from "../../services/authService";
import AuthHeader          from "../../components/auth/AuthHeader";
import StepIndicator       from "../../components/otp/StepIndicator";
import OtpIcon             from "../../components/otp/OtpIcon";
import OtpContactDisplay   from "../../components/otp/OtpContactDisplay";
import OtpInputRow         from "../../components/otp/OtpInputRow";
import TimerResend         from "../../components/otp/TimerResend";
import VerifyButton        from "../../components/otp/VerifyButton";
import WrongContactLink    from "../../components/otp/WrongContactLink";

const OTP_LENGTH      = 6;
const RESEND_COOLDOWN = 60;

export default function OtpScreen() {
  const router              = useRouter();
  const { login }           = useAuth();
  const { colors }          = useTheme();
  const { locationReady }   = useLocation();

  // ── Params — login uses method/contact/display; register uses phone/email/name ──
  const {
    flow, method, contact, display,
    name, phone, phoneDisplay, email, devOtp,
  } = useLocalSearchParams<{
    flow?: string; method?: string; contact?: string; display?: string;
    name?: string; phone?: string; phoneDisplay?: string; email?: string;
    devOtp?: string;
  }>();

  const isRegister = flow === "register";

  // ── Two-step state (register only) ───────────────────────────
  const [verifyStep,    setVerifyStep]    = useState<"phone" | "email">("phone");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // ── Derive current target contact from flow + step ───────────
  const currentMethod  = isRegister ? verifyStep     : (method  ?? "phone");
  const currentContact = isRegister
    ? (verifyStep === "phone" ? (phone ?? "") : (email ?? ""))
    : (contact ?? "");
  const currentDisplay = isRegister
    ? (verifyStep === "phone" ? (phoneDisplay ?? phone ?? "") : (email ?? ""))
    : (display ?? contact ?? "");

  // ── OTP digit state ───────────────────────────────────────────
  // Prefilled from the send response when the MOCK provider is in use, so a
  // tester is not staring at empty boxes waiting for an SMS nobody sent.
  const [digits,    setDigits]    = useState<string[]>(() => {
    const code = (devOtp ?? "").replace(/\D/g, "").slice(0, OTP_LENGTH);
    return code
      ? [...code.split(""), ...Array(OTP_LENGTH - code.length).fill("")]
      : Array(OTP_LENGTH).fill("");
  });
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [timer,     setTimer]     = useState(RESEND_COOLDOWN);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const isComplete = digits.every(d => d !== "");

  // ── Countdown timer ───────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // Re-focus first box when step changes in register flow
  useEffect(() => {
    if (isRegister) setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, [verifyStep, isRegister]);

  // ── Input handlers ────────────────────────────────────────────
  function handleChange(text: string, index: number) {
    // Support full OTP paste
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const next = Array(OTP_LENGTH).fill("");
      cleaned.slice(0, OTP_LENGTH).split("").forEach((d, i) => { next[i] = d; });
      setDigits(next);
      inputRefs.current[Math.min(cleaned.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    const digit = cleaned.slice(-1);
    const next  = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyPress(
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  }

  // ── Advance register flow to email step ───────────────────────
  async function advanceToEmailStep() {
    const target = (email ?? "").trim();
    const res = await sendOtp(target, "email");
    setPhoneVerified(true);
    setVerifyStep("email");
    setDigits(res.devOtp ? prefillDigits(res.devOtp) : Array(OTP_LENGTH).fill(""));
    startTimer();
  }

  // With the mock provider the code comes back in the send response, so a
  // tester never waits for an SMS that is never sent. Absent with a real
  // provider and absent in production.
  function prefillDigits(code: string): string[] {
    const next = code.slice(0, OTP_LENGTH).split("");
    return [...next, ...Array(OTP_LENGTH - next.length).fill("")];
  }

  // ── Verify OTP ───────────────────────────────────────────────
  async function handleVerify() {
    if (!isComplete) return;
    setLoading(true);
    try {
      const otp = digits.join("");

      if (isRegister && verifyStep === "phone") {
        // Phone step of registration: verify it, then move to the email step.
        await verifyOtp(toE164(currentContact), otp);
        await advanceToEmailStep();
        return;
      }

      // The identifier the SERVER will know this person by. It is the customer
      // id used by orders and saved addresses, so it must be the canonical form
      // — a phone as E.164, not the ten digits that were typed.
      const identifier =
        currentMethod === "phone" ? toE164(currentContact) : currentContact.trim();

      const { token } = await verifyOtp(identifier, otp);

      const authUser: AuthUser = {
        // The identifier IS the identity — a locally invented "usr_<timestamp>"
        // matched nothing on the server, so orders and addresses keyed off it
        // belonged to nobody.
        id:         identifier,
        name:       isRegister ? (name ?? "User") : "User",
        phone:      isRegister ? toE164(phone ?? "") : (currentMethod === "phone" ? identifier : null),
        email:      isRegister ? (email ?? null)     : (currentMethod === "email" ? identifier : null),
        avatar_url: null,
        is_new:     isRegister,
      };

      // Refresh tokens are a V2 concern; the access token is the real one now.
      await login(authUser, { access: token, refresh: "" });
      // First login → ask for location; returning user → go straight to tabs
      router.replace(locationReady ? "/(tabs)" : "/location-access");
    } catch (e) {
      // Surface the server's own words — "Too many codes requested. Try again
      // in 12 min." tells the person what to do; "Invalid OTP" does not.
      Alert.alert("Could not sign in", e instanceof Error ? e.message : "Please try again.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────
  async function handleResend() {
    if (timer !== 0) return;
    setResending(true);
    try {
      const target =
        currentMethod === "phone" ? toE164(currentContact) : currentContact.trim();
      const res = await sendOtp(target, currentMethod === "phone" ? "sms" : "email");
      setDigits(res.devOtp ? prefillDigits(res.devOtp) : Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      startTimer();
    } catch (e) {
      // The rate limiter refuses after 5 codes in 15 minutes and says how long
      // to wait — much more useful than a generic failure.
      Alert.alert("Could not resend", e instanceof Error ? e.message : "Please try again.");
    } finally {
      setResending(false);
    }
  }

  // ── Header title changes by flow + step ──────────────────────
  const headerTitle = isRegister
    ? (verifyStep === "phone" ? "Verify Mobile" : "Verify Email")
    : "Verify OTP";

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.card }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Header ── */}
      <AuthHeader title={headerTitle} onBack={() => router.back()} />

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* Step indicator (register flow only) */}
        {isRegister && (
          <StepIndicator step={verifyStep} phoneVerified={phoneVerified} />
        )}

        {/* Icon */}
        <OtpIcon method={currentMethod} />

        {/* Title + subtitle + contact display */}
        <OtpContactDisplay
          isRegister={isRegister}
          step={verifyStep}
          name={name}
          display={currentDisplay}
        />

        {/* Six-digit input boxes */}
        <OtpInputRow
          digits={digits}
          inputRefs={inputRefs}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          stepKey={verifyStep}
        />

        {/* Countdown / resend link */}
        <TimerResend
          timer={timer}
          resending={resending}
          onResend={handleResend}
        />

        {/* Verify CTA */}
        <VerifyButton
          isComplete={isComplete}
          loading={loading}
          isRegister={isRegister}
          step={verifyStep}
          onPress={handleVerify}
        />

        {/* Wrong number/email link */}
        <WrongContactLink
          method={currentMethod}
          onPress={() => router.back()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: {
    flex:              1,
    alignItems:        "center",
    paddingHorizontal: 32,
    paddingTop:        36,
    gap:               12,
  },
});
