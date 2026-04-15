// ============================================================
// BARCODE SCANNER SCREEN — Apana Store (Customer App)
//
// Full-screen camera scanner for barcodes and QR codes.
//
// Layout:
//   Camera fills the entire screen
//   Dark overlay with transparent scan zone (4-panel approach)
//   Animated scan line sweeps inside the zone
//   Corner bracket decorations on scan zone
//   Top bar  — back button · title · flash toggle
//   Bottom   — hint text · supported formats
//   Result   — slide-up card when a code is detected
//
// Permissions:
//   Not granted → ask UI
//   Denied      → open settings prompt
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar, Linking,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { BarcodeScanningResult } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { typography } from "../theme/typography";
import useTheme from "../theme/useTheme";

// ── Scan zone dimensions ──────────────────────────────────────
const { width: SW, height: SH } = Dimensions.get("window");
const SCAN_W  = SW * 0.72;
const SCAN_H  = SCAN_W * 0.62;   // wider-than-tall — good for both barcodes & QR
const SCAN_X  = (SW - SCAN_W) / 2;
const SCAN_Y  = (SH - SCAN_H) / 2 - 30;  // slightly above center

// Corner bracket size & thickness
const CORNER  = 22;
const THICK   = 3;
const RADIUS  = 6;

// Overlay opacity
const OVERLAY = "rgba(0,0,0,0.72)";

// Supported formats shown to the user
const FORMATS = ["QR Code", "EAN-13", "EAN-8", "UPC-A", "Code 128", "Code 39", "ITF-14"];

export default function ScannerScreen() {
  const router          = useRouter();
  const { colors }      = useTheme();
  const [permission, requestPermission] = useCameraPermissions();

  const [torch,   setTorch]   = useState(false);
  const [scanned, setScanned] = useState(false);
  const [result,  setResult]  = useState<BarcodeScanningResult | null>(null);

  // ── Scan line animation ──────────────────────────────────────
  const scanAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;  // result card

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue:         1,
          duration:        1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue:         0,
          duration:        1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scanLineY = scanAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, SCAN_H - 2],
  });

  // ── Handle scanned barcode ───────────────────────────────────
  const handleBarCodeScanned = useCallback((data: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    setResult(data);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Slide result card up
    Animated.spring(slideAnim, {
      toValue:         0,
      useNativeDriver: true,
      tension:         60,
      friction:        10,
    }).start();
  }, [scanned, slideAnim]);

  // ── Scan again ───────────────────────────────────────────────
  function handleScanAgain() {
    setScanned(false);
    setResult(null);
    slideAnim.setValue(300);
  }

  // ── Permission states ────────────────────────────────────────
  if (!permission) {
    // Still loading permission status
    return <View style={styles.permRoot} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permRoot, { backgroundColor: "#0A0A0A" }]}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <SafeAreaView style={styles.permSafe}>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.permContent}>
            <View style={[styles.permIconWrap, { backgroundColor: colors.primary + "22" }]}>
              <Ionicons name="camera-outline" size={52} color={colors.primary} />
            </View>

            <Text style={[styles.permTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              Camera Access
            </Text>
            <Text style={[styles.permSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
              Apana Store needs camera access to scan barcodes and QR codes for fast product search.
            </Text>

            {permission.canAskAgain ? (
              <TouchableOpacity
                style={[styles.permBtn, { backgroundColor: colors.primary }]}
                onPress={requestPermission}
                activeOpacity={0.85}
              >
                <Ionicons name="camera" size={18} color="#fff" />
                <Text style={[styles.permBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                  Allow Camera
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={[styles.permDenied, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  Camera permission was denied. Please enable it in your device settings.
                </Text>
                <TouchableOpacity
                  style={[styles.permBtn, { backgroundColor: colors.primary }]}
                  onPress={() => Linking.openSettings()}
                  activeOpacity={0.85}
                >
                  <Ionicons name="settings-outline" size={18} color="#fff" />
                  <Text style={[styles.permBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                    Open Settings
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={[styles.permSkip, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, color: "rgba(255,255,255,0.45)" }]}>
                Go back
              </Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </View>
    );
  }

  // ── Main scanner UI ──────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Camera ── */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr", "ean13", "ean8", "upc_a", "upc_e",
            "code128", "code39", "code93", "itf14",
            "datamatrix", "pdf417", "aztec",
          ],
        }}
      />

      {/* ── Dark overlay — 4 panels around scan zone ── */}
      {/* Top */}
      <View style={[styles.overlay, { top: 0, left: 0, right: 0, height: SCAN_Y }]} />
      {/* Bottom */}
      <View style={[styles.overlay, { top: SCAN_Y + SCAN_H, left: 0, right: 0, bottom: 0 }]} />
      {/* Left */}
      <View style={[styles.overlay, { top: SCAN_Y, left: 0, width: SCAN_X, height: SCAN_H }]} />
      {/* Right */}
      <View style={[styles.overlay, { top: SCAN_Y, right: 0, width: SCAN_X, height: SCAN_H }]} />

      {/* ── Scan zone border glow ── */}
      <View style={[styles.scanBorder, {
        top:    SCAN_Y - 1,
        left:   SCAN_X - 1,
        width:  SCAN_W + 2,
        height: SCAN_H + 2,
      }]} />

      {/* ── Corner brackets ── */}
      {/* Top-left */}
      <View style={[styles.corner, styles.cornerTL, { top: SCAN_Y, left: SCAN_X }]} />
      {/* Top-right */}
      <View style={[styles.corner, styles.cornerTR, { top: SCAN_Y, left: SCAN_X + SCAN_W - CORNER }]} />
      {/* Bottom-left */}
      <View style={[styles.corner, styles.cornerBL, { top: SCAN_Y + SCAN_H - CORNER, left: SCAN_X }]} />
      {/* Bottom-right */}
      <View style={[styles.corner, styles.cornerBR, { top: SCAN_Y + SCAN_H - CORNER, left: SCAN_X + SCAN_W - CORNER }]} />

      {/* ── Animated scan line ── */}
      {!scanned && (
        <Animated.View
          style={[
            styles.scanLine,
            {
              top:       SCAN_Y,
              left:      SCAN_X + 4,
              width:     SCAN_W - 8,
              transform: [{ translateY: scanLineY }],
            },
          ]}
        />
      )}

      {/* ── Scanned success pulse ── */}
      {scanned && (
        <View style={[styles.scannedOverlay, {
          top:    SCAN_Y,
          left:   SCAN_X,
          width:  SCAN_W,
          height: SCAN_H,
        }]}>
          <Ionicons name="checkmark-circle" size={52} color="#22C55E" />
        </View>
      )}

      {/* ── Top bar ── */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <View style={styles.topRow}>

          {/* Back */}
          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.topCenter}>
            <Text style={[styles.topTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
              Scan Code
            </Text>
            <Text style={[styles.topSub, { fontFamily: typography.fontFamily.regular, fontSize: 10 }]}>
              Barcode · QR Code
            </Text>
          </View>

          {/* Flash toggle */}
          <TouchableOpacity
            style={[styles.topBtn, torch && styles.topBtnActive]}
            onPress={() => setTorch(t => !t)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={torch ? "flash" : "flash-outline"}
              size={22}
              color={torch ? "#FCD34D" : "#fff"}
            />
          </TouchableOpacity>

        </View>
      </SafeAreaView>

      {/* ── Hint text below scan zone ── */}
      <View style={[styles.hintWrap, { top: SCAN_Y + SCAN_H + 24 }]}>
        <Text style={[styles.hintMain, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
          {scanned ? "Code detected!" : "Point camera at a barcode or QR code"}
        </Text>
        <Text style={[styles.hintSub, { fontFamily: typography.fontFamily.regular, fontSize: 10.5 }]}>
          {scanned ? "See result below" : FORMATS.join("  ·  ")}
        </Text>
      </View>

      {/* ── Result card ── */}
      {result && (
        <Animated.View
          style={[
            styles.resultCard,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.resultHandle} />

          {/* Success icon + type */}
          <View style={styles.resultHeader}>
            <View style={[styles.resultIconWrap, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="checkmark-circle" size={28} color="#16A34A" />
            </View>
            <View style={styles.resultHeaderText}>
              <Text style={[styles.resultType, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs, color: "#16A34A" }]}>
                {result.type?.toUpperCase().replace(/_/g, " ")} DETECTED
              </Text>
              <Text style={[styles.resultValue, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base, color: "#111827" }]}
                numberOfLines={2}
              >
                {result.data}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[styles.resultBtn, styles.resultBtnFill, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={() => {
                // Navigate to product search with scanned value
                router.back();
              }}
            >
              <Ionicons name="search-outline" size={16} color="#fff" />
              <Text style={[styles.resultBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: "#fff" }]}>
                Search Product
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultBtn, styles.resultBtnOutline, { borderColor: "#E5E7EB" }]}
              activeOpacity={0.75}
              onPress={handleScanAgain}
            >
              <Ionicons name="scan-outline" size={16} color="#374151" />
              <Text style={[styles.resultBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: "#374151" }]}>
                Scan Again
              </Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },

  // ── Overlay panels ──
  overlay: {
    position:        "absolute",
    backgroundColor: OVERLAY,
  },

  // ── Scan zone ──
  scanBorder: {
    position:     "absolute",
    borderWidth:  1,
    borderColor:  "rgba(255,255,255,0.15)",
    borderRadius: RADIUS,
  },

  // ── Corner brackets ──
  corner: {
    position: "absolute",
    width:    CORNER,
    height:   CORNER,
  },
  cornerTL: {
    borderTopWidth:    THICK,
    borderLeftWidth:   THICK,
    borderColor:       "#fff",
    borderTopLeftRadius: RADIUS,
  },
  cornerTR: {
    borderTopWidth:     THICK,
    borderRightWidth:   THICK,
    borderColor:        "#fff",
    borderTopRightRadius: RADIUS,
  },
  cornerBL: {
    borderBottomWidth:    THICK,
    borderLeftWidth:      THICK,
    borderColor:          "#fff",
    borderBottomLeftRadius: RADIUS,
  },
  cornerBR: {
    borderBottomWidth:     THICK,
    borderRightWidth:      THICK,
    borderColor:           "#fff",
    borderBottomRightRadius: RADIUS,
  },

  // ── Scan line ──
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

  // ── Scanned overlay ──
  scannedOverlay: {
    position:       "absolute",
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems:     "center",
    justifyContent: "center",
    borderRadius:   RADIUS,
  },

  // ── Top bar ──
  topBar: {
    position: "absolute",
    top:      0,
    left:     0,
    right:    0,
  },
  topRow: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  topBtn: {
    width:          42,
    height:         42,
    borderRadius:   21,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems:     "center",
    justifyContent: "center",
  },
  topBtnActive: {
    backgroundColor: "rgba(252,211,77,0.18)",
  },
  topCenter: { alignItems: "center" },
  topTitle:  { color: "#fff" },
  topSub:    { color: "rgba(255,255,255,0.55)", marginTop: 1 },

  // ── Hint text ──
  hintWrap: {
    position:  "absolute",
    left:      0,
    right:     0,
    alignItems: "center",
    gap:        5,
  },
  hintMain: { color: "#fff",                   textAlign: "center" },
  hintSub:  { color: "rgba(255,255,255,0.45)", textAlign: "center", paddingHorizontal: 24 },

  // ── Result card ──
  resultCard: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    backgroundColor: "#fff",
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingHorizontal:    20,
    paddingBottom:        36,
    paddingTop:           12,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: -4 },
    shadowOpacity:   0.15,
    shadowRadius:    12,
    elevation:       16,
  },
  resultHandle: {
    alignSelf:       "center",
    width:           36,
    height:          4,
    borderRadius:    2,
    backgroundColor: "#E5E7EB",
    marginBottom:    16,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           12,
    marginBottom:  20,
  },
  resultIconWrap: {
    width:          52,
    height:         52,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  resultHeaderText: { flex: 1, gap: 4 },
  resultType:       { letterSpacing: 0.5 },
  resultValue:      { lineHeight: 22 },

  resultActions: {
    flexDirection: "row",
    gap:           10,
  },
  resultBtn: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               6,
    paddingVertical:   13,
    borderRadius:      14,
  },
  resultBtnFill:    {},
  resultBtnOutline: { borderWidth: 1.5 },
  resultBtnText:    {},

  // ── Permission screen ──
  permRoot: {
    flex:            1,
    backgroundColor: "#0A0A0A",
  },
  permSafe: { flex: 1 },
  backBtn: {
    margin:          16,
    width:           42,
    height:          42,
    borderRadius:    21,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  permContent: {
    flex:              1,
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 32,
    gap:               16,
    marginTop:         -60,
  },
  permIconWrap: {
    width:          100,
    height:         100,
    borderRadius:   28,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   8,
  },
  permTitle:  { color: "#fff", textAlign: "center" },
  permSub:    { color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 22 },
  permDenied: { color: "#F87171", textAlign: "center", lineHeight: 20 },
  permBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    paddingHorizontal: 28,
    paddingVertical:   14,
    borderRadius:      14,
    marginTop:         8,
  },
  permBtnText: { color: "#fff" },
  permSkip:    { marginTop: 8 },
});
