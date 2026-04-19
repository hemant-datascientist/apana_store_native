// ============================================================
// HANDSHAKE HERO — Apana Store
//
// Animated success visual for the Order Collected screen.
// Three concentric pulsing rings + icon + "QR Verified" badge.
// ============================================================

import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";

interface HandshakeHeroProps {
  icon:  string;   // Ionicons glyph
  color: string;
  bg:    string;
  title: string;
  subtitle: string;
}

export default function HandshakeHero({ icon, color, bg, title, subtitle }: HandshakeHeroProps) {
  // ── Pulse animations ──────────────────────────────────────
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const check = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    // Icon pop-in on mount
    Animated.spring(check, {
      toValue: 1, tension: 60, friction: 7, useNativeDriver: true,
    }).start();

    Animated.timing(slide, {
      toValue: 0, duration: 350, delay: 150, useNativeDriver: true,
    }).start();

    // Staggered infinite pulse rings
    function pulseRing(anim: Animated.Value, delay: number) {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0,    useNativeDriver: true }),
        ])
      ).start();
    }
    pulseRing(ring1, 0);
    pulseRing(ring2, 350);
    pulseRing(ring3, 700);
  }, []);

  function ringStyle(anim: Animated.Value) {
    return {
      opacity:   anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.35, 0] }),
      transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) }],
    };
  }

  return (
    <View style={styles.container}>

      {/* ── Pulse rings ── */}
      <Animated.View style={[styles.ring, { backgroundColor: color }, ringStyle(ring3)]} />
      <Animated.View style={[styles.ring, { backgroundColor: color }, ringStyle(ring2)]} />
      <Animated.View style={[styles.ring, { backgroundColor: color }, ringStyle(ring1)]} />

      {/* ── Main icon circle ── */}
      <Animated.View style={[
        styles.iconCircle,
        { backgroundColor: bg },
        { transform: [{ scale: check }] },
      ]}>
        <Ionicons name={icon as any} size={52} color={color} />
      </Animated.View>

      {/* ── QR Verified badge ── */}
      <Animated.View style={[
        styles.badge,
        { backgroundColor: color, transform: [{ translateY: slide }], opacity: check },
      ]}>
        <Ionicons name="qr-code-outline" size={12} color="#fff" />
        <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
          QR Verified
        </Text>
      </Animated.View>

      {/* ── Title & subtitle ── */}
      <Text style={[styles.title, { color: "#111827", fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: "#6B7280", fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 8,
    gap: 12,
  },
  // Pulse rings — same size as icon circle, positioned absolutely
  ring: {
    position:     "absolute",
    top:          32,             // matches paddingTop
    width:        120,
    height:       120,
    borderRadius: 60,
  },
  iconCircle: {
    width:          120,
    height:         120,
    borderRadius:   60,
    alignItems:     "center",
    justifyContent: "center",
    // Soft shadow
    shadowColor:    "#000",
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.10,
    shadowRadius:   12,
    elevation:      6,
  },
  badge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 12,
    paddingVertical:   5,
    borderRadius:      20,
    marginTop:         -8,
  },
  badgeText: { color: "#fff" },
  title: {
    textAlign:  "center",
    lineHeight: 28,
  },
  subtitle: {
    textAlign:   "center",
    lineHeight:  20,
    paddingHorizontal: 24,
  },
});
