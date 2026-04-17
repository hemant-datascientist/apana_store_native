// ============================================================
// STORE QR — Apana Store (Customer App)
//
// Full-screen camera for scanning a store's QR code to open
// its storefront directly. Different from the barcode scanner
// (which searches for products).
//
// Layout:
//   Camera fills the screen
//   Dark overlay + corner brackets on scan zone
//   Top bar  — back · "Store QR" title · flash · auto-focus icons
//   Bottom   — History | Scan (active) | Find tabs
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { BarcodeScanningResult }        from "expo-camera";
import { Ionicons }                          from "@expo/vector-icons";
import { SafeAreaView }                      from "react-native-safe-area-context";
import { useRouter }                         from "expo-router";
import * as Haptics                          from "expo-haptics";
import { typography }                        from "../theme/typography";

const { width: SW, height: SH } = Dimensions.get("window");
const SCAN_SIZE = SW * 0.68;
const SCAN_X    = (SW - SCAN_SIZE) / 2;
const SCAN_Y    = (SH - SCAN_SIZE) / 2 - 40;
const CORNER    = 26;
const THICK     = 3;
const RADIUS    = 8;
const OVERLAY   = "rgba(0,0,0,0.70)";
const BRAND_BLUE = "#0F4C81";

type BottomTab = "history" | "scan" | "find";

export default function StoreQRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const [torch,    setTorch]    = useState(false);
  const [scanned,  setScanned]  = useState(false);
  const [activeTab, setActiveTab] = useState<BottomTab>("scan");

  const scanAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scanLineY = scanAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, SCAN_SIZE - 2],
  });

  const handleScanned = useCallback((data: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(slideAnim, {
      toValue: 0, useNativeDriver: true, tension: 60, friction: 10,
    }).start();
  }, [scanned]);

  // ── No permission ──
  if (!permission) return <View style={styles.root} />;

  if (!permission.granted) {
    return (
      <View style={[styles.root, { alignItems: "center", justifyContent: "center", gap: 20 }]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Ionicons name="camera-outline" size={52} color="#fff" />
        <Text style={[styles.permText, { fontFamily: typography.fontFamily.semiBold }]}>
          Camera access required
        </Text>
        <TouchableOpacity
          style={styles.permBtn}
          onPress={requestPermission}
          activeOpacity={0.85}
        >
          <Text style={[styles.permBtnText, { fontFamily: typography.fontFamily.bold }]}>
            Allow Camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.goBack, { fontFamily: typography.fontFamily.regular }]}>
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Camera ── */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      {/* ── Dark overlay 4-panel ── */}
      <View style={[styles.overlay, { top: 0, left: 0, right: 0, height: SCAN_Y }]} />
      <View style={[styles.overlay, { top: SCAN_Y + SCAN_SIZE, left: 0, right: 0, bottom: 0 }]} />
      <View style={[styles.overlay, { top: SCAN_Y, left: 0, width: SCAN_X, height: SCAN_SIZE }]} />
      <View style={[styles.overlay, { top: SCAN_Y, right: 0, width: SCAN_X, height: SCAN_SIZE }]} />

      {/* ── Corner brackets ── */}
      <View style={[styles.corner, styles.TL, { top: SCAN_Y, left: SCAN_X }]} />
      <View style={[styles.corner, styles.TR, { top: SCAN_Y, left: SCAN_X + SCAN_SIZE - CORNER }]} />
      <View style={[styles.corner, styles.BL, { top: SCAN_Y + SCAN_SIZE - CORNER, left: SCAN_X }]} />
      <View style={[styles.corner, styles.BR, { top: SCAN_Y + SCAN_SIZE - CORNER, left: SCAN_X + SCAN_SIZE - CORNER }]} />

      {/* ── Scan line ── */}
      {!scanned && (
        <Animated.View style={[styles.scanLine, {
          top:       SCAN_Y,
          left:      SCAN_X + 6,
          width:     SCAN_SIZE - 12,
          transform: [{ translateY: scanLineY }],
        }]} />
      )}

      {/* ── Success checkmark ── */}
      {scanned && (
        <View style={[styles.successOverlay, {
          top: SCAN_Y, left: SCAN_X, width: SCAN_SIZE, height: SCAN_SIZE,
        }]}>
          <Ionicons name="checkmark-circle" size={56} color="#22C55E" />
        </View>
      )}

      {/* ── Hint below scan box ── */}
      <View style={[styles.hint, { top: SCAN_Y + SCAN_SIZE + 20 }]}>
        <Text style={[styles.hintText, { fontFamily: typography.fontFamily.semiBold }]}>
          {scanned ? "Store QR detected!" : "Point at a store's QR code"}
        </Text>
        <Text style={[styles.hintSub, { fontFamily: typography.fontFamily.regular }]}>
          {scanned ? "Opening store…" : "Tap Find to search by store name instead"}
        </Text>
      </View>

      {/* ── Top bar ── */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.topBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.topTitle, { fontFamily: typography.fontFamily.bold }]}>
            Store QR
          </Text>

          <View style={styles.topRight}>
            <TouchableOpacity
              style={[styles.topIconBtn, torch && styles.topIconActive]}
              onPress={() => setTorch(t => !t)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={torch ? "flash" : "flash-outline"}
                size={20}
                color={torch ? "#FCD34D" : "#fff"}
              />
            </TouchableOpacity>

            <View style={styles.topIconBtn}>
              <Text style={[styles.autoText, { fontFamily: typography.fontFamily.bold }]}>A</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Bottom tab bar ── */}
      <View style={styles.bottomBar}>
        {/* History */}
        <TouchableOpacity
          style={styles.bottomTab}
          activeOpacity={0.75}
          onPress={() => setActiveTab("history")}
        >
          <Ionicons
            name="time-outline"
            size={24}
            color={activeTab === "history" ? "#fff" : "rgba(255,255,255,0.45)"}
          />
          <Text style={[
            styles.bottomLabel,
            { fontFamily: typography.fontFamily.medium },
            activeTab === "history" && styles.bottomLabelActive,
          ]}>
            History
          </Text>
        </TouchableOpacity>

        {/* Scan — main active button */}
        <TouchableOpacity
          style={styles.bottomScanWrap}
          activeOpacity={0.85}
          onPress={() => { setScanned(false); setActiveTab("scan"); }}
        >
          <View style={styles.bottomScanBtn}>
            <Ionicons name="scan-outline" size={26} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Find */}
        <TouchableOpacity
          style={styles.bottomTab}
          activeOpacity={0.75}
          onPress={() => setActiveTab("find")}
        >
          <Ionicons
            name="search-outline"
            size={24}
            color={activeTab === "find" ? "#fff" : "rgba(255,255,255,0.45)"}
          />
          <Text style={[
            styles.bottomLabel,
            { fontFamily: typography.fontFamily.medium },
            activeTab === "find" && styles.bottomLabelActive,
          ]}>
            Find
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },

  // Overlay panels
  overlay: {
    position:        "absolute",
    backgroundColor: OVERLAY,
  },

  // Corner brackets
  corner: { position: "absolute", width: CORNER, height: CORNER },
  TL: { borderTopWidth: THICK, borderLeftWidth: THICK,   borderColor: "#fff", borderTopLeftRadius:     RADIUS },
  TR: { borderTopWidth: THICK, borderRightWidth: THICK,  borderColor: "#fff", borderTopRightRadius:    RADIUS },
  BL: { borderBottomWidth: THICK, borderLeftWidth: THICK,  borderColor: "#fff", borderBottomLeftRadius:  RADIUS },
  BR: { borderBottomWidth: THICK, borderRightWidth: THICK, borderColor: "#fff", borderBottomRightRadius: RADIUS },

  // Scan line
  scanLine: {
    position:        "absolute",
    height:          2,
    borderRadius:    1,
    backgroundColor: "#22C55E",
    shadowColor:     "#22C55E",
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.9,
    shadowRadius:    6,
    elevation:       4,
  },

  // Success overlay
  successOverlay: {
    position:        "absolute",
    backgroundColor: "rgba(34,197,94,0.14)",
    alignItems:      "center",
    justifyContent:  "center",
    borderRadius:    RADIUS,
  },

  // Hint
  hint: {
    position:  "absolute",
    left:      0,
    right:     0,
    alignItems: "center",
    gap:        5,
    paddingHorizontal: 32,
  },
  hintText: { color: "#fff",                   fontSize: 14, textAlign: "center" },
  hintSub:  { color: "rgba(255,255,255,0.45)", fontSize: 11.5, textAlign: "center" },

  // Top bar
  topBar: { position: "absolute", top: 0, left: 0, right: 0 },
  topRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   12,
  },
  topBtn: {
    width:          44,
    height:         44,
    borderRadius:   22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems:     "center",
    justifyContent: "center",
  },
  topTitle: {
    flex:      1,
    color:     "#fff",
    fontSize:  16,
    textAlign: "center",
  },
  topRight: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  topIconBtn: {
    width:          38,
    height:         38,
    borderRadius:   19,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems:     "center",
    justifyContent: "center",
  },
  topIconActive: { backgroundColor: "rgba(252,211,77,0.18)" },
  autoText: { color: "#fff", fontSize: 13 },

  // Bottom bar
  bottomBar: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    backgroundColor: "rgba(0,0,0,0.82)",
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "space-around",
    paddingVertical: 14,
    paddingBottom:   28,
    borderTopWidth:  1,
    borderTopColor:  "rgba(255,255,255,0.10)",
  },
  bottomTab: {
    flex:       1,
    alignItems: "center",
    gap:        4,
  },
  bottomLabel: {
    color:    "rgba(255,255,255,0.45)",
    fontSize: 11,
  },
  bottomLabelActive: {
    color: "#fff",
  },
  bottomScanWrap: {
    flex:       1,
    alignItems: "center",
  },
  bottomScanBtn: {
    width:          54,
    height:         54,
    borderRadius:   27,
    backgroundColor: BRAND_BLUE,
    alignItems:     "center",
    justifyContent: "center",
    borderWidth:    3,
    borderColor:    "rgba(255,255,255,0.25)",
  },

  // Permission fallback
  permText: { color: "#fff", fontSize: 16 },
  permBtn: {
    backgroundColor:   BRAND_BLUE,
    borderRadius:      12,
    paddingHorizontal: 28,
    paddingVertical:   13,
  },
  permBtnText: { color: "#fff", fontSize: 14 },
  goBack: { color: "rgba(255,255,255,0.45)", fontSize: 13 },
});
