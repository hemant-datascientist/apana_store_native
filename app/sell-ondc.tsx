// ============================================================
// SELL ON ONDC — Apana Store (Customer App)
//
// Informs customers about becoming a seller via Apana Store
// and explains the ONDC network benefits.
//
// Layout:
//   • Dark blue header  (back · "Sell on ONDC" · help)
//   • "Sell on Apana Store" action card  (icon · copy · chevron)
//   • "We are Part of ONDC Network" dark info card
//   • "Website" button
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter }    from "expo-router";
import { typography }   from "../theme/typography";

const BRAND_BLUE = "#0F4C81";
const CARD_BLUE  = "#1A5E9A";

export default function SellOndcScreen() {
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
          Sell on ONDC
        </Text>

        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.75}
          onPress={() => Alert.alert("Help", "Seller support coming soon.")}
        >
          <Ionicons name="help-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Sell on Apana Store action card ── */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.85}
          onPress={() => Alert.alert("Sell on Apana Store", "Seller registration coming soon.")}
        >
          <View style={styles.actionIconWrap}>
            <Ionicons name="trending-up" size={26} color={BRAND_BLUE} />
          </View>

          <View style={styles.actionBody}>
            <Text style={[styles.actionTitle, { fontFamily: typography.fontFamily.bold }]}>
              Sell on Apana Store
            </Text>
            <Text style={[styles.actionSub, { fontFamily: typography.fontFamily.regular }]}>
              Reach thousands of nearby customers and grow your business today.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#6B7280" />
        </TouchableOpacity>

        {/* ── ONDC info card ── */}
        <View style={styles.ondcCard}>
          <Text style={[styles.ondcTitle, { fontFamily: typography.fontFamily.bold }]}>
            We are Part of ONDC Network
          </Text>

          <Text style={[styles.ondcBody, { fontFamily: typography.fontFamily.regular }]}>
            Apana Stores serves as a gateway to India's Open Network for Digital Commerce (ONDC),
            providing a seamless "list once, sell everywhere" experience. By joining the network
            through the app, products instantly become discoverable to millions of customers across
            all major buyer apps like Apana Stores, Paytm, Pincode, and Magicpin, effectively
            turning the entire country into a storefront.{"\n\n"}
            Apana Stores ensures that margins can be maximized by bypassing the heavy commissions
            of traditional platforms in favor of ONDC's low-cost structure. With Apana Stores, you
            retain total autonomy over your pricing and data, gain access to an integrated
            nationwide logistics web (from Delhivery to local delivery), and benefit from AI-driven
            cataloging and multi-language support, all designed to help you scale your brand on your
            own terms.
          </Text>
        </View>

        {/* ── Website button ── */}
        <TouchableOpacity
          style={styles.websiteBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert("ONDC Website", "ondc.org — coming soon.")}
        >
          <Text style={[styles.websiteBtnText, { fontFamily: typography.fontFamily.semiBold }]}>
            Website
          </Text>
        </TouchableOpacity>

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
    flex:      1,
    fontSize:  17,
    color:     "#fff",
    textAlign: "center",
  },

  // ── Scroll ──────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop:        22,
    paddingBottom:     48,
    gap:               16,
    alignItems:        "stretch",
  },

  // ── Action card ─────────────────────────────────────────────
  actionCard: {
    flexDirection:   "row",
    alignItems:      "center",
    backgroundColor: "#fff",
    borderRadius:    16,
    padding:         16,
    gap:             14,
    borderWidth:     1,
    borderColor:     "#E5E7EB",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.07,
    shadowRadius:    4,
    elevation:       2,
  },
  actionIconWrap: {
    width:          50,
    height:         50,
    borderRadius:   14,
    backgroundColor: "#EFF6FF",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  actionBody: { flex: 1, gap: 3 },
  actionTitle: {
    fontSize: 15,
    color:    "#111827",
  },
  actionSub: {
    fontSize:   12.5,
    color:      "#6B7280",
    lineHeight: 18,
  },

  // ── ONDC info card ──────────────────────────────────────────
  ondcCard: {
    backgroundColor: CARD_BLUE,
    borderRadius:    18,
    padding:         22,
    gap:             14,
  },
  ondcTitle: {
    color:      "#fff",
    fontSize:   18,
    lineHeight: 26,
    textAlign:  "center",
  },
  ondcBody: {
    color:      "rgba(255,255,255,0.88)",
    fontSize:   13,
    lineHeight: 22,
  },

  // ── Website button ──────────────────────────────────────────
  websiteBtn: {
    backgroundColor:   BRAND_BLUE,
    borderRadius:      28,
    paddingVertical:   15,
    alignItems:        "center",
    justifyContent:    "center",
    marginTop:         4,
  },
  websiteBtnText: {
    color:    "#fff",
    fontSize: 15,
  },
});
