// ============================================================
// CONNECT — scan the backend's /connect QR to point this app at a live
// tunnel URL (unified_listing aside: solves the rotating quick-tunnel URL
// without a rebuild). Additive: default stays the baked URL.
//
// Open http://<tunnel>/connect on the dev machine → scan here.
// ============================================================

import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../theme/useTheme";
import { typography } from "../theme/typography";
import {
  parseConnectPayload, setOverrideOrigin, clearOverrideOrigin,
  effectiveOrigin, BAKED_ORIGIN,
} from "../lib/backendOverride";

export default function ConnectScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [current, setCurrent] = useState(effectiveOrigin());
  const handled = useRef(false);

  async function onScan(data: string) {
    if (handled.current) return;
    const origin = parseConnectPayload(data);
    if (!origin) return; // ignore non-Apana QRs; keep scanning
    handled.current = true;
    await setOverrideOrigin(origin);
    setCurrent(origin);
    Alert.alert("Connected", `App will use:\n${origin}`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  async function resetToBaked() {
    await clearOverrideOrigin();
    setCurrent(BAKED_ORIGIN);
    Alert.alert("Reset", `Back to the built-in URL:\n${BAKED_ORIGIN}`);
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
          Connect to backend
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.camWrap}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={(e) => onScan(e.data)}
          />
        ) : (
          <View style={styles.permBox}>
            <Text style={[styles.permText, { color: colors.subText }]}>
              Camera permission is needed to scan the connect QR.
            </Text>
            <TouchableOpacity
              style={[styles.permBtn, { backgroundColor: colors.primary }]}
              onPress={requestPermission}
            >
              <Text style={[styles.permBtnText, { color: colors.white }]}>Grant camera</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.reticle} pointerEvents="none" />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.hint, { color: colors.subText }]}>
          On your dev machine open the tunnel URL + <Text style={{ fontFamily: typography.fontFamily.semiBold }}>/connect</Text> and scan the QR.
        </Text>
        <Text style={[styles.current, { color: colors.text }]} numberOfLines={2}>
          Using: {current || "built-in"}
        </Text>
        <TouchableOpacity onPress={resetToBaked}>
          <Text style={[styles.reset, { color: colors.primary }]}>Reset to built-in URL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  title: { fontSize: typography.size.lg },
  camWrap: { flex: 1, margin: 16, borderRadius: 20, overflow: "hidden", backgroundColor: "#000" },
  reticle: {
    position: "absolute", alignSelf: "center", top: "28%",
    width: 220, height: 220, borderWidth: 3, borderColor: "#ffffffcc", borderRadius: 20,
  },
  permBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 14 },
  permText: { textAlign: "center", fontSize: typography.size.sm },
  permBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  permBtnText: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm },
  footer: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  hint: { fontSize: typography.size.xs, lineHeight: 18 },
  current: { fontSize: typography.size.xs },
  reset: { fontSize: typography.size.sm, fontFamily: typography.fontFamily.semiBold, marginTop: 4 },
});
