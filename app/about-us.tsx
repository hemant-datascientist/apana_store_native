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
  StyleSheet, StatusBar, Linking, Alert,
} from "react-native";
import { SafeAreaView }  from "react-native-safe-area-context";
import { Ionicons }      from "@expo/vector-icons";
import { useRouter }     from "expo-router";
import { typography }    from "../theme/typography";

const BRAND_BLUE = "#0F4C81";
const CARD_BLUE  = "#1A5E9A";

// ── Social link row items ──────────────────────────────────────
const SOCIALS = [
  { key: "twitter",   icon: "logo-twitter",   color: "#1DA1F2", label: "Twitter"   },
  { key: "facebook",  icon: "logo-facebook",  color: "#1877F2", label: "Facebook"  },
  { key: "youtube",   icon: "logo-youtube",   color: "#FF0000", label: "YouTube"   },
  { key: "instagram", icon: "logo-instagram", color: "#E1306C", label: "Instagram" },
  { key: "linkedin",  icon: "logo-linkedin",  color: "#0A66C2", label: "LinkedIn"  },
];

export default function AboutUsScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          About Us
        </Text>

        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.75}
          onPress={() => Alert.alert("Help", "Support coming soon.")}
        >
          <Ionicons name="help-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
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
        <Text style={[styles.sectionTitle, { fontFamily: typography.fontFamily.bold }]}>
          Our Story
        </Text>

        <View style={styles.storyCard}>
          {/* Image placeholder — replace with real <Image> when assets are ready */}
          <View style={styles.storyImg}>
            {/* Purple founder-photo placeholder */}
            <View style={styles.storyImgInner}>
              <Ionicons name="people" size={64} color="rgba(255,255,255,0.25)" />
            </View>

            {/* CTA overlay strip */}
            <TouchableOpacity
              style={styles.storyOverlay}
              activeOpacity={0.85}
              onPress={() => Alert.alert("Our Journey", "Full story page coming soon.")}
            >
              <Text style={[styles.storyOverlayText, { fontFamily: typography.fontFamily.semiBold }]}>
                Read our full journey
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Connect ── */}
        <Text style={[styles.sectionTitle, { fontFamily: typography.fontFamily.bold }]}>
          Connect
        </Text>

        <View style={styles.connectRow}>
          {/* Website pill */}
          <TouchableOpacity
            style={styles.websiteBtn}
            activeOpacity={0.82}
            onPress={() => Alert.alert("Website", "apanastore.in — coming soon.")}
          >
            <Text style={[styles.websiteBtnText, { fontFamily: typography.fontFamily.semiBold }]}>
              Website
            </Text>
          </TouchableOpacity>

          {/* Social icons */}
          {SOCIALS.map(s => (
            <TouchableOpacity
              key={s.key}
              style={styles.socialBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert(s.label, `${s.label} page coming soon.`)}
            >
              <Ionicons name={s.icon as any} size={22} color={s.color} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Version footer ── */}
        <Text style={[styles.version, { fontFamily: typography.fontFamily.regular }]}>
          Apana Store v1.0.0 · Made in India
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: "#F8FAFC",
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
    color:    "#111827",
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
  storyOverlay: {
    position:         "absolute",
    bottom:           0,
    left:             0,
    right:            0,
    backgroundColor:  "rgba(0,0,0,0.42)",
    paddingHorizontal: 16,
    paddingVertical:   12,
    flexDirection:    "row",
    alignItems:       "center",
    gap:              6,
  },
  storyOverlayText: {
    color:    "#fff",
    fontSize: 13,
    flex:     1,
  },

  // ── Connect ─────────────────────────────────────────────────
  connectRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
    flexWrap:      "wrap",
    marginTop:     -4,
  },
  websiteBtn: {
    backgroundColor:   BRAND_BLUE,
    borderRadius:      20,
    paddingHorizontal: 18,
    paddingVertical:   9,
  },
  websiteBtnText: {
    color:    "#fff",
    fontSize: 13,
  },
  socialBtn: {
    width:          42,
    height:         42,
    borderRadius:   21,
    backgroundColor: "#F1F5F9",
    alignItems:     "center",
    justifyContent: "center",
  },

  // ── Footer ──────────────────────────────────────────────────
  version: {
    fontSize:  12,
    color:     "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
  },
});
