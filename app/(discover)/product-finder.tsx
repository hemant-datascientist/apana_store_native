// ============================================================
// PRODUCT FINDER — Apana Store (Customer App)
//
// Lets customers look up authentic products by name or barcode.
// All products are GS1 India + FSSAI verified via ONDC Network.
//
// Layout:
//   • Dark blue header  (back · "Product Finder" · help)
//   • Empty-state circle  — bag + search icon
//   • "No products added yet" label
//   • "Look up by product name" primary button
//   • "Scan products" outline button
//   • Transaction / receipt number input field
//   • Trust badge card  — FSSAI · ONDC · GS1 text
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, TextInput, Alert, Dimensions,
} from "react-native";
import { SafeAreaView }  from "react-native-safe-area-context";
import { Ionicons }      from "@expo/vector-icons";
import { useRouter }     from "expo-router";
import { typography }    from "../../theme/typography";

const BRAND_BLUE = "#0F4C81";
const { width: SW } = Dimensions.get("window");
const CIRCLE_SIZE = SW * 0.42;

export default function ProductFinderScreen() {
  const router                            = useRouter();
  const [txnNumber, setTxnNumber]         = useState("");
  const [isFocused, setIsFocused]         = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          Product Finder
        </Text>

        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.75}
          onPress={() => Alert.alert("Help", "Product finder help coming soon.")}
        >
          <Ionicons name="help-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Empty state circle ── */}
        <View style={styles.circleWrap}>
          <View style={styles.circle}>
            <View style={styles.circleInner}>
              <Ionicons name="bag-outline"     size={CIRCLE_SIZE * 0.36} color="#fff" style={styles.bagIcon} />
              <View style={styles.searchBadge}>
                <Ionicons name="search" size={CIRCLE_SIZE * 0.16} color={BRAND_BLUE} />
              </View>
            </View>
          </View>

          <Text style={[styles.emptyTitle, { fontFamily: typography.fontFamily.semiBold }]}>
            No products added yet
          </Text>
        </View>

        {/* ── Lookup by name button ── */}
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert("Product Search", "Name-based search coming soon.")}
        >
          <Ionicons name="list-outline" size={20} color="#fff" />
          <Text style={[styles.primaryBtnText, { fontFamily: typography.fontFamily.semiBold }]}>
            Look up items by product name
          </Text>
        </TouchableOpacity>

        {/* ── Scan button ── */}
        <TouchableOpacity
          style={styles.outlineBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/scanner")}
        >
          <Ionicons name="scan-outline" size={20} color={BRAND_BLUE} />
          <Text style={[styles.outlineBtnText, { fontFamily: typography.fontFamily.semiBold }]}>
            Scan products
          </Text>
        </TouchableOpacity>

        {/* ── Transaction / receipt number ── */}
        <View style={[styles.inputWrap, isFocused && styles.inputFocused]}>
          <Text style={[styles.inputLabel, { fontFamily: typography.fontFamily.regular }]}>
            Transaction or receipt number (optional)
          </Text>
          <TextInput
            style={[styles.input, { fontFamily: typography.fontFamily.regular }]}
            placeholder="Enter transaction or receipt number"
            placeholderTextColor="#9CA3AF"
            value={txnNumber}
            onChangeText={setTxnNumber}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="done"
          />
        </View>

        {/* ── Trust badge card ── */}
        <View style={styles.trustCard}>
          <Text style={[styles.trustText, { fontFamily: typography.fontFamily.regular }]}>
            "Shop with confidence. Every product on Apana Store is verified via{" "}
            <Text style={[styles.trustBold, { fontFamily: typography.fontFamily.bold }]}>GS1 India</Text>
            {" "}and{" "}
            <Text style={[styles.trustBold, { fontFamily: typography.fontFamily.bold }]}>Fssai ✅</Text>
            , ensuring you receive only genuine, brand-certified items. No fakes, no errors—just authentic
            products from trusted sellers delivered straight to your door through the{" "}
            <Text style={[styles.trustBold, { fontFamily: typography.fontFamily.bold }]}>ONDC Network</Text>
            ."
          </Text>

          {/* Logo row */}
          <View style={styles.trustLogos}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#1D4746" />
              <Text style={[styles.logoText, { fontFamily: typography.fontFamily.bold, color: "#1D4746" }]}>
                fssai
              </Text>
            </View>
            <View style={styles.logoBadge}>
              <Ionicons name="globe-outline" size={16} color="#FF6600" />
              <Text style={[styles.logoText, { fontFamily: typography.fontFamily.bold, color: "#FF6600" }]}>
                ONDC
              </Text>
            </View>
            <View style={styles.logoBadge}>
              <Ionicons name="barcode-outline" size={16} color="#003087" />
              <Text style={[styles.logoText, { fontFamily: typography.fontFamily.bold, color: "#003087" }]}>
                GS1
              </Text>
            </View>
          </View>
        </View>

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
    paddingTop:        28,
    paddingBottom:     48,
    gap:               16,
    alignItems:        "stretch",
  },

  // ── Empty state ─────────────────────────────────────────────
  circleWrap: {
    alignItems: "center",
    gap:        16,
    marginBottom: 6,
  },
  circle: {
    width:          CIRCLE_SIZE,
    height:         CIRCLE_SIZE,
    borderRadius:   CIRCLE_SIZE / 2,
    backgroundColor: BRAND_BLUE,
    alignItems:     "center",
    justifyContent: "center",
  },
  circleInner: {
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
  },
  bagIcon: {
    // slightly nudge so search badge overlaps bottom-right
  },
  searchBadge: {
    position:        "absolute",
    bottom:          -CIRCLE_SIZE * 0.05,
    right:           -CIRCLE_SIZE * 0.10,
    width:           CIRCLE_SIZE * 0.28,
    height:          CIRCLE_SIZE * 0.28,
    borderRadius:    CIRCLE_SIZE * 0.14,
    backgroundColor: "#fff",
    alignItems:      "center",
    justifyContent:  "center",
    borderWidth:     2,
    borderColor:     BRAND_BLUE,
  },
  emptyTitle: {
    fontSize: 15,
    color:    "#374151",
  },

  // ── Primary button ──────────────────────────────────────────
  primaryBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    backgroundColor: BRAND_BLUE,
    borderRadius:    12,
    paddingVertical: 15,
  },
  primaryBtnText: {
    color:    "#fff",
    fontSize: 14,
  },

  // ── Outline button ──────────────────────────────────────────
  outlineBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    backgroundColor: "#fff",
    borderRadius:    12,
    paddingVertical: 14,
    borderWidth:     1.5,
    borderColor:     BRAND_BLUE,
  },
  outlineBtnText: {
    color:    BRAND_BLUE,
    fontSize: 14,
  },

  // ── Input ───────────────────────────────────────────────────
  inputWrap: {
    backgroundColor: "#fff",
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     "#E5E7EB",
    paddingHorizontal: 14,
    paddingTop:       12,
    paddingBottom:    10,
    gap:              4,
  },
  inputFocused: {
    borderColor: BRAND_BLUE,
  },
  inputLabel: {
    fontSize: 11.5,
    color:    "#9CA3AF",
  },
  input: {
    fontSize: 13.5,
    color:    "#111827",
    padding:  0,
  },

  // ── Trust card ──────────────────────────────────────────────
  trustCard: {
    backgroundColor: "#fff",
    borderRadius:    14,
    padding:         16,
    borderWidth:     1,
    borderColor:     "#E5E7EB",
    gap:             12,
  },
  trustText: {
    fontSize:   13,
    color:      "#374151",
    lineHeight: 21,
  },
  trustBold: {
    color: "#111827",
  },
  trustLogos: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "flex-end",
    gap:            10,
  },
  logoBadge: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      6,
    backgroundColor:   "#F1F5F9",
  },
  logoText: {
    fontSize:    11,
    letterSpacing: 0.3,
  },
});
