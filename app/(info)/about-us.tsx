// ============================================================
// ABOUT US — Apana Store (Customer App)
//
// Layout:
//   • Dark blue header bar (back + title + help icon)
//   • Mission card  — dark blue bg, "Our Mission" pill, headline, body
//   • Our Story     — section title + hero image placeholder with CTA overlay
//   • Connect       — Website pill + social icon row
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView }  from "react-native-safe-area-context";
import { Ionicons }      from "@expo/vector-icons";
import { useRouter }     from "expo-router";
import { goBackOr }      from "../../lib/goBack";
import { typography }    from "../../theme/typography";
import useTheme          from "../../theme/useTheme";

const BRAND_BLUE = "#0F4C81";
const CARD_BLUE  = "#1A5E9A";

// ── Social link row items ──────────────────────────────────────

export default function AboutUsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity onPress={() => goBackOr()} style={styles.headerBtn} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          About Us
        </Text>
        {/* Help button removed: there is no support channel — no monitored
            inbox and no number. An icon that apologises is worse than none,
            because someone stuck taps it believing help exists. Same call as
            the seller and partner apps. */}
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Mission card ── */}
        <View style={styles.missionCard}>
          <View style={styles.missionPill}>
            <Text style={[styles.missionPillText, { fontFamily: typography.fontFamily.semiBold }]}>
              Our Mission
            </Text>
          </View>

          <Text style={[styles.missionTitle, { fontFamily: typography.fontFamily.bold }]}>
            Empowering Local{"\n"}Commerce
          </Text>

          <Text style={[styles.missionBody, { fontFamily: typography.fontFamily.regular }]}>
            We believe shopping local should be as easy as shopping online. We bridge the gap
            between you and the store around the corner.
          </Text>
        </View>

        {/* ── Our Story ── */}
        <Text style={[styles.sectionTitle, { fontFamily: typography.fontFamily.bold, color: colors.text }]}>
          Our Story
        </Text>

        <View style={styles.storyCard}>
          {/* Image placeholder — replace with real <Image> when assets are ready */}
          <View style={styles.storyImg}>
            {/* Purple founder-photo placeholder */}
            <View style={styles.storyImgInner}>
              <Ionicons name="people" size={64} color="rgba(255,255,255,0.25)" />
            </View>
          </View>
        </View>

        {/* Connect (website + social) removed: none of those pages exist yet. */}

        {/* ── Version footer ── */}
        <Text style={[styles.version, { fontFamily: typography.fontFamily.regular, color: colors.subText }]}>
          Apana Store v1.0.0 · Made in India
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    // backgroundColor set inline from theme
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor:    BRAND_BLUE,
    flexDirection:      "row",
    alignItems:         "center",
    paddingHorizontal:  8,
    paddingBottom:      14,
    gap:                4,
  },
  headerBtn: {
    width:          44,
    height:         44,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:     1,
    fontSize: 17,
    color:    "#fff",
    textAlign: "center",
  },

  // ── Scroll ──────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     48,
    gap:               18,
  },

  // ── Mission card ────────────────────────────────────────────
  missionCard: {
    backgroundColor: CARD_BLUE,
    borderRadius:    18,
    padding:         22,
    gap:             12,
  },
  missionPill: {
    alignSelf:         "flex-start",
    backgroundColor:   "rgba(255,255,255,0.18)",
    borderRadius:      20,
    paddingHorizontal: 12,
    paddingVertical:   4,
  },
  missionPillText: {
    color:    "#fff",
    fontSize: 12,
  },
  missionTitle: {
    color:      "#fff",
    fontSize:   22,
    lineHeight: 30,
  },
  missionBody: {
    color:      "rgba(255,255,255,0.85)",
    fontSize:   14,
    lineHeight: 22,
  },

  // ── Section title ────────────────────────────────────────────
  sectionTitle: {
    fontSize: 18,
    // color set inline from theme
  },

  // ── Story card ───────────────────────────────────────────────
  storyCard: {
    borderRadius: 16,
    overflow:     "hidden",
    marginTop:    -4,
  },
  storyImg: {
    height:           220,
    backgroundColor:  "#6B21A8",
    alignItems:       "center",
    justifyContent:   "center",
    position:         "relative",
  },
  storyImgInner: {
    alignItems:     "center",
    justifyContent: "center",
    flex:           1,
    width:          "100%",
  },

  // ── Connect ─────────────────────────────────────────────────

  // ── Footer ──────────────────────────────────────────────────
  version: {
    fontSize:  12,
    // color set inline from theme
    textAlign: "center",
    marginTop: 4,
  },
});
