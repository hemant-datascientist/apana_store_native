// ============================================================
// CREATE ACCOUNT — Apana Store (Customer App)
//
// New user registration. Collects all 3 fields up front:
//   Name  — display name
//   Email — for notifications + login
//   Phone — +91, for OTP login + delivery updates
//
// OTP method toggle: choose whether OTP goes to Phone or Email.
// All 3 fields are saved to the account regardless.
//
// Flow:
//   Fill Name + Email + Phone
//   → Choose OTP method (Phone / Email)
//   → "Create Account" → POST /auth/send-otp
//   → navigates to /otp with { method, contact, display, name, flow: "register" }
//   → OTP verified → account created → router.replace("/(tabs)")
//
// Backend:
//   POST /auth/register  { name, email, phone, app: "customer" }
//   → 200 { otp_sent_to: "phone"|"email", expires_in: 300 }
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

const BRAND_BLUE = "#0F4C81";

type OtpMethod = "phone" | "email";

function isValidPhone(v: string) { return /^[6-9]\d{9}$/.test(v.replace(/\s/g, "")); }
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidName(v: string)  { return v.trim().length >= 2; }

export default function CreateAccountScreen() {
  const router = useRouter();

  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [otpMethod, setOtpMethod] = useState<OtpMethod>("phone");
  const [loading,   setLoading]   = useState(false);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const nameOk  = isValidName(name);
  const emailOk = isValidEmail(email);
  const phoneOk = isValidPhone(phone);
  const canSubmit = nameOk && emailOk && phoneOk;

  // Contact info for the chosen OTP method
  const otpContact = otpMethod === "phone"
    ? `+91${phone.replace(/\s/g, "")}`
    : email.trim();
  const otpDisplay = otpMethod === "phone"
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : email.trim();

  async function handleCreateAccount() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      // TODO: replace with real API call
      // const res = await fetch("https://api.apanastore.in/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     name: name.trim(),
      //     email: email.trim(),
      //     phone: `+91${phone.replace(/\s/g, "")}`,
      //     otp_method: otpMethod,
      //     app: "customer",
      //   }),
      // });
      // if (!res.ok) throw new Error("Registration failed");

      await new Promise(r => setTimeout(r, 800));

      router.push({
        pathname: "/otp",
        params: {
          method:  otpMethod,
          contact: otpContact,
          display: otpDisplay,
          name:    name.trim(),
          flow:    "register",
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
          Create Account
        </Text>
        <View style={styles.backBtn} />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Welcome ── */}
        <View style={styles.welcomeBlock}>
          <Text style={[styles.welcomeTitle, { fontFamily: typography.fontFamily.bold }]}>
            Join Apana Store 🛍️
          </Text>
          <Text style={[styles.welcomeSub, { fontFamily: typography.fontFamily.regular }]}>
            Create your account to order from local stores near you
          </Text>
        </View>

        {/* ── Name ── */}
        <View style={styles.fieldBlock}>
          <Text style={[styles.fieldLabel, { fontFamily: typography.fontFamily.medium }]}>
            Full Name
          </Text>
          <View style={[styles.inputRow, !nameOk && name.length > 0 && styles.inputRowError]}>
            <Ionicons name="person-outline" size={18} color="#9CA3AF" />
            <TextInput
              style={[styles.input, { fontFamily: typography.fontFamily.regular }]}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              autoFocus
            />
            {name.length > 0 && (
              <TouchableOpacity onPress={() => setName("")}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          {!nameOk && name.length > 0 && (
            <Text style={[styles.fieldError, { fontFamily: typography.fontFamily.regular }]}>
              Enter at least 2 characters
            </Text>
          )}
        </View>

        {/* ── Email ── */}
        <View style={styles.fieldBlock}>
          <Text style={[styles.fieldLabel, { fontFamily: typography.fontFamily.medium }]}>
            Email Address
          </Text>
          <View style={[styles.inputRow, !emailOk && email.length > 0 && styles.inputRowError]}>
            <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
            <TextInput
              ref={emailRef}
              style={[styles.input, { fontFamily: typography.fontFamily.regular }]}
              placeholder="Enter email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
            {email.length > 0 && (
              <TouchableOpacity onPress={() => setEmail("")}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          {!emailOk && email.length > 0 && (
            <Text style={[styles.fieldError, { fontFamily: typography.fontFamily.regular }]}>
              Enter a valid email address
            </Text>
          )}
        </View>

        {/* ── Phone ── */}
        <View style={styles.fieldBlock}>
          <Text style={[styles.fieldLabel, { fontFamily: typography.fontFamily.medium }]}>
            Mobile Number
          </Text>
          <View style={[styles.phoneRow, !phoneOk && phone.length > 0 && styles.inputRowError]}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇮🇳</Text>
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
              onSubmitEditing={canSubmit ? handleCreateAccount : undefined}
            />
            {phone.length > 0 && (
              <TouchableOpacity onPress={() => setPhone("")} style={{ paddingRight: 12 }}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          {!phoneOk && phone.length > 0 && (
            <Text style={[styles.fieldError, { fontFamily: typography.fontFamily.regular }]}>
              Enter a valid 10-digit mobile number
            </Text>
          )}
        </View>

        {/* ── OTP Method Picker ── */}
        <View style={styles.otpMethodBlock}>
          <Text style={[styles.fieldLabel, { fontFamily: typography.fontFamily.medium }]}>
            Receive OTP via
          </Text>
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[styles.methodTab, otpMethod === "phone" && styles.methodTabActive]}
              onPress={() => setOtpMethod("phone")}
              activeOpacity={0.8}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={15}
                color={otpMethod === "phone" ? "#fff" : "#6B7280"}
              />
              <Text style={[
                styles.methodTabText,
                { fontFamily: otpMethod === "phone" ? typography.fontFamily.bold : typography.fontFamily.medium },
                otpMethod === "phone" && styles.methodTabTextActive,
              ]}>
                Phone
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodTab, otpMethod === "email" && styles.methodTabActive]}
              onPress={() => setOtpMethod("email")}
              activeOpacity={0.8}
            >
              <Ionicons
                name="mail-outline"
                size={15}
                color={otpMethod === "email" ? "#fff" : "#6B7280"}
              />
              <Text style={[
                styles.methodTabText,
                { fontFamily: otpMethod === "email" ? typography.fontFamily.bold : typography.fontFamily.medium },
                otpMethod === "email" && styles.methodTabTextActive,
              ]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic hint showing where OTP will go */}
          {canSubmit && (
            <Text style={[styles.otpHint, { fontFamily: typography.fontFamily.regular }]}>
              OTP will be sent to{" "}
              <Text style={{ fontFamily: typography.fontFamily.semiBold, color: BRAND_BLUE }}>
                {otpDisplay}
              </Text>
            </Text>
          )}
        </View>

        {/* ── Create Account button ── */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          activeOpacity={canSubmit ? 0.88 : 1}
          onPress={canSubmit ? handleCreateAccount : undefined}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={[styles.submitBtnText, { fontFamily: typography.fontFamily.bold }]}>
                Create Account
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        {/* ── Sign in link ── */}
        <View style={styles.signinRow}>
          <Text style={[styles.signinText, { fontFamily: typography.fontFamily.regular }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.replace("/login")} activeOpacity={0.75}>
            <Text style={[styles.signinLink, { fontFamily: typography.fontFamily.semiBold }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Terms ── */}
        <Text style={[styles.terms, { fontFamily: typography.fontFamily.regular }]}>
          By creating an account, you agree to our{" "}
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

  // ── Scroll ──────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop:        28,
    paddingBottom:     48,
    gap:               18,
  },

  // ── Welcome ─────────────────────────────────────────────────
  welcomeBlock: { gap: 6 },
  welcomeTitle: { fontSize: 24, color: "#111827" },
  welcomeSub:   { fontSize: 14, color: "#6B7280", lineHeight: 20 },

  // ── Field blocks ────────────────────────────────────────────
  fieldBlock: { gap: 6 },
  fieldLabel: {
    fontSize: 13,
    color:    "#374151",
  },
  fieldError: {
    fontSize: 11,
    color:    "#EF4444",
  },

  // Generic input row
  inputRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    borderWidth:       1.5,
    borderColor:       "#E5E7EB",
    borderRadius:      14,
    backgroundColor:   "#F9FAFB",
    paddingHorizontal: 14,
  },
  inputRowError: {
    borderColor: "#EF4444",
  },
  input: {
    flex:            1,
    fontSize:        15,
    color:           "#111827",
    paddingVertical: 15,
  },

  // Phone row
  phoneRow: {
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1.5,
    borderColor:    "#E5E7EB",
    borderRadius:   14,
    overflow:       "hidden",
    backgroundColor: "#F9FAFB",
  },
  countryCode: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 12,
    paddingVertical:   15,
    borderRightWidth:  1,
    borderRightColor:  "#E5E7EB",
    backgroundColor:   "#F3F4F6",
  },
  flag:            { fontSize: 16 },
  countryCodeText: { fontSize: 14, color: "#111827" },
  phoneInput: {
    flex:              1,
    fontSize:          15,
    color:             "#111827",
    paddingHorizontal: 12,
    paddingVertical:   15,
    letterSpacing:     0.5,
  },

  // ── OTP method ──────────────────────────────────────────────
  otpMethodBlock: { gap: 8 },
  methodToggle: {
    flexDirection:   "row",
    backgroundColor: "#F3F4F6",
    borderRadius:    12,
    padding:         4,
    gap:             4,
  },
  methodTab: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             6,
    paddingVertical: 10,
    borderRadius:    9,
  },
  methodTabActive: {
    backgroundColor: BRAND_BLUE,
    shadowColor:     BRAND_BLUE,
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.22,
    shadowRadius:    5,
    elevation:       3,
  },
  methodTabText:       { fontSize: 13, color: "#6B7280" },
  methodTabTextActive: { color: "#fff" },
  otpHint: {
    fontSize:  12,
    color:     "#9CA3AF",
    textAlign: "center",
  },

  // ── Submit button ────────────────────────────────────────────
  submitBtn: {
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
  submitBtnDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity:   0,
    elevation:       0,
  },
  submitBtnText: { color: "#fff", fontSize: 16 },

  // ── Sign in row ──────────────────────────────────────────────
  signinRow: {
    flexDirection:  "row",
    justifyContent: "center",
    alignItems:     "center",
    gap:            6,
  },
  signinText: { fontSize: 13, color: "#6B7280" },
  signinLink: { fontSize: 13, color: BRAND_BLUE },

  // ── Terms ────────────────────────────────────────────────────
  terms: {
    fontSize:   11,
    color:      "#9CA3AF",
    textAlign:  "center",
    lineHeight: 17,
  },
  termsLink: { color: BRAND_BLUE },
});
