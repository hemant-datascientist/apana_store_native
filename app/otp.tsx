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
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator,
  Alert, NativeSyntheticEvent, TextInputKeyPressEventData,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { typography }   from "../theme/typography";
import { useAuth, AuthUser } from "../context/AuthContext";

const BRAND_BLUE      = "#0F4C81";
const OTP_LENGTH      = 6;
const RESEND_COOLDOWN = 60;

// ── Step indicator (register flow only) ───────────────────────
function StepIndicator({ step, phoneVerified }: { step: "phone" | "email"; phoneVerified: boolean }) {
  const step1Done    = phoneVerified;
  const step1Active  = step === "phone";
  const step2Active  = step === "email";

  return (
    <View style={si.row}>
      {/* Step 1 */}
      <View style={si.stepWrap}>
        <View style={[si.circle, step1Done ? si.circleDone : step1Active ? si.circleActive : si.circlePending]}>
          {step1Done
            ? <Ionicons name="checkmark" size={14} color="#fff" />
            : <Text style={[si.circleNum, { fontFamily: typography.fontFamily.bold }]}>1</Text>
          }
        </View>
        <Text style={[si.stepLabel, { fontFamily: step1Active ? typography.fontFamily.semiBold : typography.fontFamily.regular }]}>
          Mobile
        </Text>
      </View>

      {/* Connector line */}
      <View style={si.line}>
        <View style={[si.lineFill, step1Done && si.lineFillDone]} />
      </View>

      {/* Step 2 */}
      <View style={si.stepWrap}>
        <View style={[si.circle, step2Active ? si.circleActive : si.circlePending]}>
          <Text style={[si.circleNum, { fontFamily: typography.fontFamily.bold }]}>2</Text>
        </View>
        <Text style={[si.stepLabel, { fontFamily: step2Active ? typography.fontFamily.semiBold : typography.fontFamily.regular }]}>
          Email
        </Text>
      </View>
    </View>
  );
}

const si = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems:    "center",
    alignSelf:     "stretch",
    marginBottom:  8,
  },
  stepWrap: {
    alignItems: "center",
    gap:         4,
  },
  circle: {
    width:          30,
    height:         30,
    borderRadius:   15,
    alignItems:     "center",
    justifyContent: "center",
  },
  circleDone:    { backgroundColor: "#16A34A" },
  circleActive:  { backgroundColor: BRAND_BLUE },
  circlePending: { backgroundColor: "#E5E7EB" },
  circleNum:     { fontSize: 13, color: "#fff" },
  stepLabel:     { fontSize: 11, color: "#6B7280" },
  line: {
    flex:            1,
    height:          2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 6,
    marginBottom:    14,
    overflow:        "hidden",
  },
  lineFill:     { flex: 1, backgroundColor: "#E5E7EB" },
  lineFillDone: { backgroundColor: "#16A34A" },
});

// ── Main screen ───────────────────────────────────────────────
export default function OtpScreen() {
  const router     = useRouter();
  const { login }  = useAuth();

  // Params — login flow uses method/contact/display;
  // register flow uses phone/phoneDisplay/email/name
  const {
    flow, method, contact, display,
    name, phone, phoneDisplay, email,
  } = useLocalSearchParams<{
    flow?:         string;
    // login params
    method?:       string;
    contact?:      string;
    display?:      string;
    // register params
    name?:         string;
    phone?:        string;
    phoneDisplay?: string;
    email?:        string;
  }>();

  const isRegister = flow === "register";

  // Register: two-step verification state
  const [verifyStep,     setVerifyStep]     = useState<"phone" | "email">("phone");
  const [phoneVerified,  setPhoneVerified]  = useState(false);

  // ── Current target contact ─────────────────────────────────
  // Login: single step using method/contact/display
  // Register step 1: phone  /  step 2: email
  const currentMethod  = isRegister ? verifyStep      : (method  ?? "phone");
  const currentContact = isRegister
    ? (verifyStep === "phone" ? (phone ?? "")  : (email ?? ""))
    : (contact ?? "");
  const currentDisplay = isRegister
    ? (verifyStep === "phone" ? (phoneDisplay ?? phone ?? "") : (email ?? ""))
    : (display ?? contact ?? "");

  // ── OTP digit state ────────────────────────────────────────
  const [digits,    setDigits]    = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [timer,     setTimer]     = useState(RESEND_COOLDOWN);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const otp        = digits.join("");
  const isComplete = digits.every(d => d !== "");
  const canResend  = timer === 0;

  // ── Timer ──────────────────────────────────────────────────
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

  // Re-focus when step changes (register flow)
  useEffect(() => {
    if (isRegister) {
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [verifyStep, isRegister]);

  // ── Input handlers ─────────────────────────────────────────
  function handleChange(text: string, index: number) {
    const digit = text.replace(/\D/g, "").slice(-1);
    const next  = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(text: string, index: number) {
    const cleaned = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (cleaned.length > 1) {
      const next = Array(OTP_LENGTH).fill("");
      cleaned.split("").forEach((d, i) => { next[i] = d; });
      setDigits(next);
      inputRefs.current[Math.min(cleaned.length, OTP_LENGTH - 1)]?.focus();
    } else {
      handleChange(text, index);
    }
  }

  // ── Advance to email step (register only) ──────────────────
  async function advanceToEmailStep() {
    // TODO: POST /auth/send-otp { email, app: "customer", flow: "register" }
    await new Promise(r => setTimeout(r, 500));
    setPhoneVerified(true);
    setVerifyStep("email");
    setDigits(Array(OTP_LENGTH).fill(""));
    startTimer();
  }

  // ── Verify ─────────────────────────────────────────────────
  async function handleVerify() {
    if (!isComplete) return;
    setLoading(true);
    try {
      // TODO: POST /auth/verify-otp { method: currentMethod, contact: currentContact, otp }
      await new Promise(r => setTimeout(r, 800));

      if (isRegister && verifyStep === "phone") {
        // Phone verified → now verify email
        await advanceToEmailStep();
        return;
      }

      // Final verification (login: single step | register: email step)
      const authUser: AuthUser = {
        id:         "usr_" + Date.now(),
        name:       isRegister ? (name ?? "User") : "User",
        phone:      isRegister ? (phone ?? null) : (currentMethod === "phone" ? currentContact : null),
        email:      isRegister ? (email ?? null) : (currentMethod === "email" ? currentContact : null),
        avatar_url: null,
        is_new:     isRegister,
      };

      // TODO: for register, POST /auth/register { name, phone, email, phone_verified: true, email_verified: true }
      await login(authUser, {
        access:  "mock_access_" + Date.now(),
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

  // ── Resend ─────────────────────────────────────────────────
  async function handleResend() {
    if (!canResend) return;
    setResending(true);
    try {
      // TODO: POST /auth/send-otp { [currentMethod]: currentContact, app: "customer" }
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

  // ── Timer display ──────────────────────────────────────────
  const timerMM = String(Math.floor(timer / 60)).padStart(2, "0");
  const timerSS = String(timer % 60).padStart(2, "0");

  // ── Header title ───────────────────────────────────────────
  const headerTitle = isRegister
    ? (verifyStep === "phone" ? "Verify Mobile" : "Verify Email")
    : "Verify OTP";

  // ── Verify button label ────────────────────────────────────
  const btnLabel = isRegister && verifyStep === "phone"
    ? "Verify Mobile"
    : "Verify & Continue";

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          {headerTitle}
        </Text>
        <View style={styles.backBtn} />
      </SafeAreaView>

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* Step indicator — register only */}
        {isRegister && (
          <StepIndicator step={verifyStep} phoneVerified={phoneVerified} />
        )}

        {/* Icon */}
        <View style={styles.iconWrap}>
          <Ionicons
            name={currentMethod === "phone" ? "phone-portrait-outline" : "mail-outline"}
            size={36}
            color={BRAND_BLUE}
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, { fontFamily: typography.fontFamily.bold }]}>
          {isRegister && verifyStep === "phone" && "Verify Your Mobile"}
          {isRegister && verifyStep === "email" && "Now Verify Your Email"}
          {!isRegister && "Enter Verification Code"}
        </Text>

        {/* Subtitle */}
        {isRegister && name && verifyStep === "phone" && (
          <Text style={[styles.subtitle, { fontFamily: typography.fontFamily.regular }]}>
            Hi{" "}
            <Text style={{ fontFamily: typography.fontFamily.semiBold, color: "#111827" }}>
              {name}
            </Text>
            ! We sent a 6-digit OTP to
          </Text>
        )}
        {isRegister && verifyStep === "email" && (
          <Text style={[styles.subtitle, { fontFamily: typography.fontFamily.regular }]}>
            Mobile verified ✓  Now enter the OTP sent to
          </Text>
        )}
        {!isRegister && (
          <Text style={[styles.subtitle, { fontFamily: typography.fontFamily.regular }]}>
            We sent a 6-digit OTP to
          </Text>
        )}

        <Text style={[styles.contact, { fontFamily: typography.fontFamily.semiBold }]}>
          {currentDisplay}
        </Text>

        {/* ── OTP boxes ── */}
        <View style={styles.boxRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={`${verifyStep}-${i}`}
              ref={ref => { inputRefs.current[i] = ref; }}
              style={[
                styles.box,
                digit ? styles.boxFilled : styles.boxEmpty,
                i === digits.findIndex(d => !d) && styles.boxFocused,
              ]}
              value={digit}
              onChangeText={text => handlePaste(text, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              selectTextOnFocus
              textAlign="center"
            />
          ))}
        </View>

        {/* ── Timer / Resend ── */}
        <View style={styles.timerRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} disabled={resending} activeOpacity={0.8}>
              {resending
                ? <ActivityIndicator size="small" color={BRAND_BLUE} />
                : <Text style={[styles.resendText, { fontFamily: typography.fontFamily.semiBold }]}>
                    Resend OTP
                  </Text>
              }
            </TouchableOpacity>
          ) : (
            <Text style={[styles.timerText, { fontFamily: typography.fontFamily.regular }]}>
              Resend OTP in{" "}
              <Text style={{ fontFamily: typography.fontFamily.semiBold, color: BRAND_BLUE }}>
                {timerMM}:{timerSS}
              </Text>
            </Text>
          )}
        </View>

        {/* ── Verify button ── */}
        <TouchableOpacity
          style={[styles.verifyBtn, !isComplete && styles.verifyBtnDisabled]}
          activeOpacity={isComplete ? 0.88 : 1}
          onPress={isComplete ? handleVerify : undefined}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={[styles.verifyBtnText, { fontFamily: typography.fontFamily.bold }]}>
                {btnLabel}
              </Text>
              <Ionicons
                name={isRegister && verifyStep === "phone" ? "arrow-forward" : "checkmark-circle-outline"}
                size={20}
                color="#fff"
              />
            </>
          )}
        </TouchableOpacity>

        {/* Wrong contact */}
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.75}>
          <Text style={[styles.wrongText, { fontFamily: typography.fontFamily.regular }]}>
            Wrong {currentMethod === "phone" ? "number" : "email"}?{" "}
            <Text style={{ fontFamily: typography.fontFamily.semiBold, color: BRAND_BLUE }}>
              Change it
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
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
  backBtn: {
    width:          44,
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

  // ── Body ────────────────────────────────────────────────────
  body: {
    flex:              1,
    alignItems:        "center",
    paddingHorizontal: 32,
    paddingTop:        36,
    gap:               12,
  },

  // Icon circle
  iconWrap: {
    width:           76,
    height:          76,
    borderRadius:    22,
    backgroundColor: "#EFF6FF",
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    4,
  },

  // Text
  title: {
    fontSize:  20,
    color:     "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize:  13,
    color:     "#6B7280",
    textAlign: "center",
  },
  contact: {
    fontSize:     15,
    color:        "#111827",
    marginBottom: 4,
  },

  // ── OTP boxes ───────────────────────────────────────────────
  boxRow: {
    flexDirection: "row",
    gap:           10,
    marginTop:     8,
    marginBottom:  4,
  },
  box: {
    width:        46,
    height:       56,
    borderRadius: 12,
    borderWidth:  1.5,
    fontSize:     22,
    color:        "#111827",
    fontFamily:   "Poppins_600SemiBold",
  },
  boxEmpty:  { borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" },
  boxFilled: { borderColor: BRAND_BLUE, backgroundColor: "#EFF6FF" },
  boxFocused:{ borderColor: BRAND_BLUE },

  // ── Timer ────────────────────────────────────────────────────
  timerRow: {
    height:         28,
    alignItems:     "center",
    justifyContent: "center",
    marginTop:      4,
  },
  timerText:  { fontSize: 13, color: "#6B7280" },
  resendText: { fontSize: 14, color: BRAND_BLUE },

  // ── Verify button ─────────────────────────────────────────────
  verifyBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    backgroundColor: BRAND_BLUE,
    borderRadius:    16,
    paddingVertical: 17,
    width:           "100%",
    shadowColor:     BRAND_BLUE,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.28,
    shadowRadius:    10,
    elevation:       5,
    marginTop:       12,
  },
  verifyBtnDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity:   0,
    elevation:       0,
  },
  verifyBtnText: { color: "#fff", fontSize: 16 },

  // ── Wrong contact ─────────────────────────────────────────────
  wrongText: {
    fontSize:  13,
    color:     "#9CA3AF",
    marginTop: 8,
  },
});
