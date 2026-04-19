// ============================================================
// QR GENERATOR — Apana Store
//
// Headless component: renders a hidden QR code, converts it to
// a PNG file in the app cache on mount, exposes the file path
// via onReady(), and deletes the file on unmount.
//
// Positioning rules (Android GPU rasterization):
//   - Must be inside the SAME native window (not a Modal)
//   - Must NOT use opacity:0 — Android skips SVG rasterization
//   - Must be within the viewport — use zIndex:-1 at (0,0)
//     so it sits behind the screen header and is never visible
//
// Usage:
//   <QRGenerator
//     value={qrPayload}
//     cacheKey="order-abc"
//     onReady={(path) => setQrFile(path)}
//   />
// ============================================================

import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import QRCode          from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system/legacy";

const HIDDEN_SIZE = 300;

interface QRGeneratorProps {
  value:     string;              // QR payload string
  cacheKey:  string;              // unique name for the cached PNG file
  onReady:   (filePath: string) => void;
  onError?:  (message: string)  => void;
}

export default function QRGenerator({
  value, cacheKey, onReady, onError,
}: QRGeneratorProps) {
  const svgRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      // Wait for the SVG to be fully rasterized by the GPU.
      // 800ms is enough even on slower devices.
      await new Promise(r => setTimeout(r, 800));
      if (cancelled || !svgRef.current) {
        onError?.("QR ref not available after mount");
        return;
      }

      svgRef.current.toDataURL(async (data: string) => {
        if (cancelled) return;

        if (!data || data.length < 100) {
          onError?.("toDataURL returned empty data — SVG may not have rendered");
          return;
        }

        try {
          // Strip the data-URI prefix when present (varies by RN SVG version)
          const base64   = data.includes(",") ? data.split(",")[1] : data;
          const filePath = `${FileSystem.cacheDirectory}apana-qr-${cacheKey}.png`;

          await FileSystem.writeAsStringAsync(filePath, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Sanity check — file must have real content
          const info = await FileSystem.getInfoAsync(filePath);
          if (!info.exists || (info as any).size < 100) {
            onError?.("Written PNG file is empty or missing");
            return;
          }

          if (!cancelled) onReady(filePath);
        } catch (err: any) {
          onError?.(err?.message ?? "File write failed");
        }
      });
    }

    generate();

    // Clean up cached PNG when the screen unmounts
    return () => {
      cancelled = true;
      const filePath = `${FileSystem.cacheDirectory}apana-qr-${cacheKey}.png`;
      FileSystem.deleteAsync(filePath, { idempotent: true }).catch(() => {});
    };
  }, [value, cacheKey]);

  // ── Hidden QR — rendered at top-left corner, behind the header ──
  // zIndex:-1 ensures it's always behind all visible UI.
  // It MUST be within the viewport (not off-screen) so Android
  // actually rasterizes the SVG before toDataURL is called.
  return (
    <View style={styles.hidden} pointerEvents="none" collapsable={false}>
      <QRCode
        value={value}
        size={HIDDEN_SIZE}
        color="#111827"
        backgroundColor="#FFFFFF"
        getRef={(ref) => { svgRef.current = ref; }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    position: "absolute",
    top:      0,
    left:     0,
    zIndex:   -1,
  },
});
