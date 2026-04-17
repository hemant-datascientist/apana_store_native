// ============================================================
// LOGIN PROMPT MODAL — Apana Store (Customer App)
//
// Bottom-sheet modal shown when a guest user tries to:
//   - Add to cart
//   - Proceed to checkout
//
// Props:
//   visible          — controls modal display
//   onClose          — dismiss (continues browsing)
//   onLogin          — navigates to /login
//   reason           — "cart" | "checkout" (changes copy)
//
// Usage:
//   <LoginPromptModal
//     visible={showLoginPrompt}
//     onClose={() => setShowLoginPrompt(false)}
//     onLogin={() => router.push("/login")}
//     reason="cart"
//   />
// ============================================================

import React, { useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  Animated, Pressable, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";

const BRAND_BLUE = "#0F4C81";
const { height: SH } = Dimensions.get("window");

type Reason = "cart" | "checkout" | "order";

interface LoginPromptModalProps {
  visible:  boolean;
  onClose:  () => void;
  onLogin:  () => void;
  reason?:  Reason;
}

const REASON_CONFIG: Record<Reason, { icon: string; title: string; body: string }> = {
  cart: {
    icon:  "bag-add-outline",
    title: "Login to Add to Cart",
    body:  "Sign in to save items, track orders, and enjoy a personalised shopping experience.",
  },
  checkout: {
    icon:  "card-outline",
    title: "Login to Checkout",
    body:  "Sign in to place your order, save your addresses, and track deliveries in real time.",
  },
  order: {
    icon:  "receipt-outline",
    title: "Login to Place Order",
    body:  "Sign in to complete your order. Guest mode lets you browse but not purchase.",
  },
};

export default function LoginPromptModal({
  visible,
  onClose,
  onLogin,
  reason = "cart",
}: LoginPromptModalProps) {
  const slideAnim = useRef(new Animated.Value(SH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const config = REASON_CONFIG[reason];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue:         0,
          duration:        300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue:         1,
          duration:        200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue:         SH,
          duration:        250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue:         0,
          duration:        200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* ── Backdrop ── */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* ── Sheet ── */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>

        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Icon */}
        <View style={styles.iconWrap}>
          <Ionicons name={config.icon as any} size={36} color={BRAND_BLUE} />
        </View>

        {/* Copy */}
        <Text style={[styles.title, { fontFamily: typography.fontFamily.bold }]}>
          {config.title}
        </Text>
        <Text style={[styles.body, { fontFamily: typography.fontFamily.regular }]}>
          {config.body}
        </Text>

        {/* Benefits row */}
        <View style={styles.benefitsRow}>
          {[
            { icon: "shield-checkmark-outline", text: "Secure & safe" },
            { icon: "flash-outline",            text: "Quick OTP login" },
            { icon: "heart-outline",            text: "Save favourites" },
          ].map((b, i) => (
            <View key={i} style={styles.benefit}>
              <Ionicons name={b.icon as any} size={18} color={BRAND_BLUE} />
              <Text style={[styles.benefitText, { fontFamily: typography.fontFamily.regular }]}>
                {b.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Login button */}
        <TouchableOpacity style={styles.loginBtn} activeOpacity={0.88} onPress={onLogin}>
          <Ionicons name="log-in-outline" size={20} color="#fff" />
          <Text style={[styles.loginBtnText, { fontFamily: typography.fontFamily.bold }]}>
            Sign In / Create Account
          </Text>
        </TouchableOpacity>

        {/* Continue browsing */}
        <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7} onPress={onClose}>
          <Text style={[styles.skipText, { fontFamily: typography.fontFamily.regular }]}>
            Continue browsing
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ── Backdrop ─────────────────────────────────────────────────
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  // ── Bottom sheet ─────────────────────────────────────────────
  sheet: {
    position:          "absolute",
    bottom:            0,
    left:              0,
    right:             0,
    backgroundColor:   "#fff",
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingBottom:     40,
    paddingTop:        12,
    alignItems:        "center",
    shadowColor:       "#000",
    shadowOffset:      { width: 0, height: -4 },
    shadowOpacity:     0.12,
    shadowRadius:      16,
    elevation:         20,
  },

  handle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: "#E5E7EB",
    marginBottom:    24,
  },

  // Icon
  iconWrap: {
    width:           72,
    height:          72,
    borderRadius:    22,
    backgroundColor: "#EFF6FF",
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    16,
  },

  // Copy
  title: {
    fontSize:     20,
    color:        "#111827",
    textAlign:    "center",
    marginBottom: 10,
  },
  body: {
    fontSize:     14,
    color:        "#6B7280",
    textAlign:    "center",
    lineHeight:   22,
    marginBottom: 20,
  },

  // Benefits
  benefitsRow: {
    flexDirection:  "row",
    gap:            16,
    marginBottom:   28,
  },
  benefit: {
    alignItems: "center",
    gap:        6,
    flex:       1,
  },
  benefitText: {
    fontSize:  11,
    color:     "#6B7280",
    textAlign: "center",
  },

  // Login button
  loginBtn: {
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
    marginBottom:    14,
  },
  loginBtnText: {
    color:    "#fff",
    fontSize: 15,
  },

  // Skip
  skipBtn: {
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 14,
    color:    "#9CA3AF",
    textDecorationLine: "underline",
  },
});
