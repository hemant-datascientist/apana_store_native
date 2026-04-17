// ============================================================
// OTP SCREEN — Apana Store (Customer App)
//
// Receives params from /login:
//   method  — "phone" | "email"
//   contact — "+919876543210" or "user@email.com"
//   display — "+91 98765 43210" or "user@email.com"
//
// Flow:
//   Enter 6 digits (auto-advance each box)
//   → "Verify & Continue"
//   → POST /auth/verify-otp { method, contact, otp }
//   → Returns { access_token, refresh_token, user }
//   → useAuth().login() → router.replace("/(tabs)")
//
// Timer: 60s countdown → "Resend OTP" appears
//        Resend → POST /auth/send-otp again, restarts timer
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator,
  Alert, NativeSyntheticEvent, TextInputKeyPressEventData,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }       from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { typography }     from "../theme/typography";
import { useAuth, AuthUser } from "../context/AuthContext";

const BRAND_BLUE = "#0F4C81";
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

// ── Mock user returned after OTP verify ───────────────────────
const MOCK_USER: AuthUser = {
  id:         "usr_001",
  name:       "Hemant",
  phone:      null,
  email:      null,
  avatar_url: null,
  is_new:     false,
};

export default function OtpScreen() {
  const router  = useRouter();
  const { login } = useAuth();

  const { method, contact, display } = useLocalSearchParams<{
    method:  string;
    contact: string;
    display: string;
  }>();

  // ── OTP digit state ────────────────────────────────────────
  const [digits,   setDigits]   = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading,  setLoading]  = useState(false);
  const [timer,    setTimer]    = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const otp      = digits.join("");
  const isComplete = otp.length === OTP_LENGTH && digits.every(d => d !== "");
  const canResend  = timer === 0;

  // ── Countdown timer ────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    // Focus first box
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // ── Digit input handler ────────────────────────────────────
  function handleChange(text: string, index: number) {
    // Accept only one digit
    const digit = text.replace(/\D/g, "").slice(-1);
    const next  = [...digits];
    next[index] = digit;
    setDigits(next);

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // ── Backspace handler ──────────────────────────────────────
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

  // ── Paste handler — fills all boxes from clipboard ─────────
  function handlePaste(text: string, index: number) {
    const cleaned = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (cleaned.length > 1) {
      const next = Array(OTP_LENGTH).fill("");
      cleaned.split("").forEach((d, i) => { next[i] = d; });
      setDigits(next);
      const lastFilled = Math.min(cleaned.length, OTP_LENGTH - 1);
      inputRefs.current[lastFilled]?.focus();
    } else {
      handleChange(text, index);
    }
  }

  // ── Verify OTP ─────────────────────────────────────────────
  async function handleVerify() {
    if (!isComplete) return;
    setLoading(true);
    try {
      // TODO: replace with real API call
      // const res = await fetch("https://api.apanastore.in/auth/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ method, contact, otp }),
      // });
      // if (!res.ok) throw new Error("Invalid OTP");
      // const { access_token, refresh_token, user } = await res.json();

      // Mock: 800ms delay, accept any 6-digit OTP
      await new Promise(r => setTimeout(r, 800));

      // Populate mock user with actual contact
      const authUser: AuthUser = {
        ...MOCK_USER,
        phone: method === "phone" ? contact ?? null : null,
        email: method === "email" ? contact ?? null : null,
      };

      await login(authUser, {
        access:  "mock_access_token_" + Date.now(),
        refresh: "mock_refresh_token_" + Date.now(),
      });

      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Invalid OTP. Please try again.");
      // Clear all digits and refocus first box
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ─────────────────────────────────────────────
  async function handleResend() {
    if (!canResend) return;
    setResending(true);
    try {
      // TODO: replace with real API call
      // await fetch("https://api.apanastore.in/auth/send-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ [method]: contact, app: "customer" }),
      // });

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

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          Verify OTP
        </Text>
        <View style={styles.backBtn} />
      </SafeAreaView>

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* Icon */}
        <View style={styles.iconWrap}>
          <Ionicons
            name={method === "phone" ? "phone-portrait-outline" : "mail-outline"}
            size={36}
            color={BRAND_BLUE}
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, { fontFamily: typography.fontFamily.bold }]}>
          Enter Verification Code
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { fontFamily: typography.fontFamily.regular }]}>
          We sent a 6-digit OTP to
        </Text>
        <Text style={[styles.contact, { fontFamily: typography.fontFamily.semiBold }]}>
          {display ?? contact}
        </Text>

        {/* ── OTP boxes ── */}
        <View style={styles.boxRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
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
              maxLength={OTP_LENGTH}  // allows paste of full OTP
              selectTextOnFocus
              textAlign="center"
              caretHidden={false}
            />
          ))}
        </View>

        {/* ── Timer / Resend ── */}
        <View style={styles.timerRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} disabled={resending} activeOpacity={0.8}>
              {resending ? (
                <ActivityIndicator size="small" color={BRAND_BLUE} />
              ) : (
                <Text style={[styles.resendText, { fontFamily: typography.fontFamily.semiBold }]}>
                  Resend OTP
                </Text>
              )}
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
                Verify &amp; Continue
              </Text>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        {/* ── Wrong number ── */}
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.75}>
          <Text style={[styles.wrongText, { fontFamily: typography.fontFamily.regular }]}>
            Wrong {method === "phone" ? "number" : "email"}?{" "}
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
    paddingTop:        48,
    gap:               12,
  },

  // Icon circle
  iconWrap: {
    width:           80,
    height:          80,
    borderRadius:    24,
    backgroundColor: "#EFF6FF",
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    8,
  },

  // Text
  title: {
    fontSize:  22,
    color:     "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color:    "#6B7280",
  },
  contact: {
    fontSize:     15,
    color:        "#111827",
    marginBottom: 8,
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
  boxEmpty: {
    borderColor:     "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  boxFilled: {
    borderColor:     BRAND_BLUE,
    backgroundColor: "#EFF6FF",
  },
  boxFocused: {
    borderColor: BRAND_BLUE,
  },

  // ── Timer ────────────────────────────────────────────────────
  timerRow: {
    height:         28,
    alignItems:     "center",
    justifyContent: "center",
    marginTop:      4,
  },
  timerText: {
    fontSize: 13,
    color:    "#6B7280",
  },
  resendText: {
    fontSize: 14,
    color:    BRAND_BLUE,
  },

  // ── Verify button ────────────────────────────────────────────
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
  verifyBtnText: {
    color:    "#fff",
    fontSize: 16,
  },

  // ── Wrong contact ─────────────────────────────────────────────
  wrongText: {
    fontSize:  13,
    color:     "#9CA3AF",
    marginTop: 8,
  },
});
