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
import useTheme            from "../../theme/useTheme";
import { useAuth, AuthUser } from "../../context/AuthContext";
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
  const router    = useRouter();
  const { login } = useAuth();
  const { colors }= useTheme();

  // ── Params — login uses method/contact/display; register uses phone/email/name ──
  const {
    flow, method, contact, display,
    name, phone, phoneDisplay, email,
  } = useLocalSearchParams<{
    flow?: string; method?: string; contact?: string; display?: string;
    name?: string; phone?: string; phoneDisplay?: string; email?: string;
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
  const [digits,    setDigits]    = useState<string[]>(Array(OTP_LENGTH).fill(""));
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
    // TODO: POST /auth/send-otp { email, app:"customer", flow:"register" }
    await new Promise(r => setTimeout(r, 500));
    setPhoneVerified(true);
    setVerifyStep("email");
    setDigits(Array(OTP_LENGTH).fill(""));
    startTimer();
  }

  // ── Verify OTP ───────────────────────────────────────────────
  async function handleVerify() {
    if (!isComplete) return;
    setLoading(true);
    try {
      // TODO: POST /auth/verify-otp { method: currentMethod, contact: currentContact, otp }
      await new Promise(r => setTimeout(r, 800));

      if (isRegister && verifyStep === "phone") {
        // Phone verified → advance to email step
        await advanceToEmailStep();
        return;
      }

      // Final step (login single-step OR register email step)
      const authUser: AuthUser = {
        id:         "usr_" + Date.now(),
        name:       isRegister ? (name ?? "User") : "User",
        phone:      isRegister ? (phone ?? null)  : (currentMethod === "phone" ? currentContact : null),
        email:      isRegister ? (email ?? null)  : (currentMethod === "email" ? currentContact : null),
        avatar_url: null,
        is_new:     isRegister,
      };

      // TODO: for register, POST /auth/register { name, phone, email, verified }
      await login(authUser, {
        access:  "mock_access_"  + Date.now(),
        refresh: "mock_refresh_" + Date.now(),
      });
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Invalid OTP. Please try again.");
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
      // TODO: POST /auth/send-otp { [currentMethod]: currentContact, app:"customer" }
      await new Promise(r => setTimeout(r, 600));
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      startTimer();
    } catch {
      Alert.alert("Error", "Could not resend OTP. Please try again.");
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
