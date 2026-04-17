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
// ============================================================

import React, { useState, useRef } from "react";
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter }    from "expo-router";
import { typography }   from "../theme/typography";
import { useAuth }      from "../context/AuthContext";

const BRAND_BLUE = "#0F4C81";

type Method = "phone" | "email";

function isValidPhone(v: string) { return /^[6-9]\d{9}$/.test(v.replace(/\s/g, "")); }
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

export default function LoginScreen() {
  const router            = useRouter();
  const { skipAsGuest }   = useAuth();

  const [method,   setMethod]   = useState<Method>("phone");
  const [phone,    setPhone]    = useState("");
  const [email,    setEmail]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const phoneRef               = useRef<TextInput>(null);
  const emailRef               = useRef<TextInput>(null);

  const isPhone = method === "phone";
  const value   = isPhone ? phone : email;
  const isValid = isPhone ? isValidPhone(value) : isValidEmail(value);

  async function handleSendOtp() {
    if (!isValid) return;
    setLoading(true);
    try {
      // TODO: replace with real API call
      // const res = await fetch("https://api.apanastore.in/auth/send-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ [method]: value, app: "customer" }),
      // });
      // if (!res.ok) throw new Error("Failed to send OTP");

      // Mock: simulate network delay
      await new Promise(r => setTimeout(r, 800));

      // Navigate to OTP screen with contact info
      router.push({
        pathname: "/otp",
        params: {
          method,
          contact: isPhone ? `+91${phone.replace(/\s/g, "")}` : email,
          display: isPhone ? `+91 ${phone.slice(0,5)} ${phone.slice(5)}` : email,
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
    router.replace("/(tabs)");
  }

  function switchMethod(m: Method) {
    setMethod(m);
    setTimeout(() => {
      if (m === "phone") phoneRef.current?.focus();
      else emailRef.current?.focus();
    }, 100);
  }

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
          Sign In
        </Text>
        <View style={styles.backBtn} />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Welcome text ── */}
        <View style={styles.welcomeBlock}>
          <Text style={[styles.welcomeTitle, { fontFamily: typography.fontFamily.bold }]}>
            Welcome Back 👋
          </Text>
          <Text style={[styles.welcomeSub, { fontFamily: typography.fontFamily.regular }]}>
            Sign in to order from local stores near you
          </Text>
        </View>

        {/* ── Method toggle ── */}
        <View style={styles.methodToggle}>
          <TouchableOpacity
            style={[styles.methodTab, method === "phone" && styles.methodTabActive]}
            onPress={() => switchMethod("phone")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="phone-portrait-outline"
              size={16}
              color={method === "phone" ? "#fff" : "#6B7280"}
            />
            <Text style={[
              styles.methodTabText,
              { fontFamily: method === "phone" ? typography.fontFamily.bold : typography.fontFamily.medium },
              method === "phone" && styles.methodTabTextActive,
            ]}>
              Phone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodTab, method === "email" && styles.methodTabActive]}
            onPress={() => switchMethod("email")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="mail-outline"
              size={16}
              color={method === "email" ? "#fff" : "#6B7280"}
            />
            <Text style={[
              styles.methodTabText,
              { fontFamily: method === "email" ? typography.fontFamily.bold : typography.fontFamily.medium },
              method === "email" && styles.methodTabTextActive,
            ]}>
              Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Input ── */}
        {isPhone ? (
          // Phone input with +91 prefix
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={[styles.flag, { fontFamily: typography.fontFamily.regular }]}>🇮🇳</Text>
              <Text style={[styles.countryCodeText, { fontFamily: typography.fontFamily.semiBold }]}>
                +91
              </Text>
            </View>
            <TextInput
              ref={phoneRef}
              style={[styles.phoneInput, { fontFamily: typography.fontFamily.regular }]}
              placeholder="Enter mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              returnKeyType="done"
              onSubmitEditing={isValid ? handleSendOtp : undefined}
              autoFocus
            />
            {phone.length > 0 && (
              <TouchableOpacity onPress={() => setPhone("")} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // Email input
          <View style={styles.emailRow}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.emailIcon} />
            <TextInput
              ref={emailRef}
              style={[styles.emailInput, { fontFamily: typography.fontFamily.regular }]}
              placeholder="Enter email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              returnKeyType="done"
              onSubmitEditing={isValid ? handleSendOtp : undefined}
              autoFocus
            />
            {email.length > 0 && (
              <TouchableOpacity onPress={() => setEmail("")} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={[styles.inputHint, { fontFamily: typography.fontFamily.regular }]}>
          {isPhone
            ? "We'll send a 6-digit OTP to this number"
            : "We'll send a 6-digit OTP to this email"
          }
        </Text>

        {/* ── Send OTP button ── */}
        <TouchableOpacity
          style={[styles.sendBtn, !isValid && styles.sendBtnDisabled]}
          activeOpacity={isValid ? 0.88 : 1}
          onPress={isValid ? handleSendOtp : undefined}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={[styles.sendBtnText, { fontFamily: typography.fontFamily.bold }]}>
                Send OTP
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        {/* ── Create Account link ── */}
        <View style={styles.createRow}>
          <Text style={[styles.createText, { fontFamily: typography.fontFamily.regular }]}>
            New here?
          </Text>
          <TouchableOpacity onPress={() => router.push("/create-account")} activeOpacity={0.75}>
            <Text style={[styles.createLink, { fontFamily: typography.fontFamily.semiBold }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={[styles.orText, { fontFamily: typography.fontFamily.medium }]}>OR</Text>
          <View style={styles.orLine} />
        </View>

        {/* ── Guest / Skip ── */}
        <TouchableOpacity
          style={styles.guestBtn}
          activeOpacity={0.8}
          onPress={handleSkip}
        >
          <Ionicons name="eye-outline" size={18} color="#6B7280" />
          <Text style={[styles.guestText, { fontFamily: typography.fontFamily.medium }]}>
            Continue as Guest
          </Text>
        </TouchableOpacity>

        <Text style={[styles.guestWarning, { fontFamily: typography.fontFamily.regular }]}>
          Guest mode lets you browse but you'll need to sign in to place orders or add items to cart.
        </Text>

        {/* ── Terms ── */}
        <Text style={[styles.terms, { fontFamily: typography.fontFamily.regular }]}>
          By signing in, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {" "}and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  // ── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor:    BRAND_BLUE,
    flexDirection:      "row",
    alignItems:         "center",
    paddingHorizontal:  8,
    paddingBottom:      14,
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

  // ── Scroll ──────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop:        32,
    paddingBottom:     48,
    gap:               16,
  },

  // ── Welcome ─────────────────────────────────────────────────
  welcomeBlock: { gap: 6, marginBottom: 8 },
  welcomeTitle: { fontSize: 26, color: "#111827" },
  welcomeSub:   { fontSize: 14, color: "#6B7280", lineHeight: 20 },

  // ── Method toggle ───────────────────────────────────────────
  methodToggle: {
    flexDirection:   "row",
    backgroundColor: "#F3F4F6",
    borderRadius:    14,
    padding:         4,
    gap:             4,
  },
  methodTab: {
    flex:           1,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            7,
    paddingVertical: 11,
    borderRadius:   10,
  },
  methodTabActive: {
    backgroundColor: BRAND_BLUE,
    shadowColor:     BRAND_BLUE,
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.25,
    shadowRadius:    6,
    elevation:       3,
  },
  methodTabText:       { fontSize: 14, color: "#6B7280" },
  methodTabTextActive: { color: "#fff" },

  // ── Phone input ──────────────────────────────────────────────
  phoneRow: {
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1.5,
    borderColor:    "#E5E7EB",
    borderRadius:   14,
    overflow:       "hidden",
    backgroundColor:"#F9FAFB",
  },
  countryCode: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 14,
    paddingVertical:   16,
    borderRightWidth:  1,
    borderRightColor:  "#E5E7EB",
    backgroundColor:   "#F3F4F6",
  },
  flag:            { fontSize: 18 },
  countryCodeText: { fontSize: 15, color: "#111827" },
  phoneInput: {
    flex:              1,
    fontSize:          16,
    color:             "#111827",
    paddingHorizontal: 14,
    paddingVertical:   16,
    letterSpacing:     0.5,
  },

  // ── Email input ──────────────────────────────────────────────
  emailRow: {
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1.5,
    borderColor:    "#E5E7EB",
    borderRadius:   14,
    backgroundColor:"#F9FAFB",
    paddingHorizontal: 14,
  },
  emailIcon:  { marginRight: 8 },
  emailInput: {
    flex:           1,
    fontSize:       16,
    color:          "#111827",
    paddingVertical: 16,
  },

  // Clear button
  clearBtn: { padding: 8 },

  // ── Hint ────────────────────────────────────────────────────
  inputHint: { fontSize: 12, color: "#9CA3AF", marginTop: -6 },

  // ── Send OTP button ──────────────────────────────────────────
  sendBtn: {
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
  sendBtnDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity:   0,
    elevation:       0,
  },
  sendBtnText: { color: "#fff", fontSize: 16 },

  // ── Create account row ──────────────────────────────────────
  createRow: {
    flexDirection:  "row",
    justifyContent: "center",
    alignItems:     "center",
    gap:            6,
    marginTop:      -4,
  },
  createText: { fontSize: 13, color: "#6B7280" },
  createLink: { fontSize: 13, color: BRAND_BLUE },

  // ── OR divider ───────────────────────────────────────────────
  orRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  orLine:  { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  orText:  { fontSize: 12, color: "#9CA3AF" },

  // ── Guest button ─────────────────────────────────────────────
  guestBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             8,
    paddingVertical: 14,
    borderRadius:    16,
    borderWidth:     1.5,
    borderColor:     "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  guestText: { fontSize: 15, color: "#374151" },

  guestWarning: {
    fontSize:   12,
    color:      "#9CA3AF",
    textAlign:  "center",
    lineHeight: 18,
    marginTop:  -4,
  },

  // ── Terms ────────────────────────────────────────────────────
  terms: {
    fontSize:   11,
    color:      "#9CA3AF",
    textAlign:  "center",
    lineHeight: 17,
    marginTop:  8,
  },
  termsLink: { color: BRAND_BLUE },
});
