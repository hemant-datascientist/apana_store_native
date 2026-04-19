// ============================================================
// QR GENERATOR — Apana Store
//
// Headless component: renders a hidden branded QR card (QR code
// + label + sublabel), captures it as a PNG via captureRef(),
// writes to app cache, exposes the path via onReady().
// Deletes the cached PNG on unmount.
//
// captureRef() vs toDataURL():
//   toDataURL captures only the SVG element (QR pixels, no text).
//   captureRef captures the whole View — QR + label + sublabel —
//   so the shared image contains all the context text too.
//
// Positioning rules (Android):
//   - Must be in the SAME native window as the screen (not Modal)
//   - Must NOT use opacity:0 — Android skips rendering it
//   - Use zIndex:-1 at top:0, left:0 — hidden behind the header
//
// Usage:
//   <QRGenerator
//     value={qrPayload}
//     cacheKey="order-abc"
//     label="Order #APX-123"
//     sublabel="Apana Store · Delivery Order"
//     onReady={(path) => setQrFile(path)}
//   />
// ============================================================

import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet }   from "react-native";
import QRCode          from "react-native-qrcode-svg";
import { captureRef }  from "react-native-view-shot";
import * as FileSystem from "expo-file-system/legacy";

const HIDDEN_QR_SIZE = 260;

interface QRGeneratorProps {
  value:      string;              // QR payload
  cacheKey:   string;              // unique key for cached PNG filename
  label?:     string;              // bold text below QR (e.g. list name or order ID)
  sublabel?:  string;              // small text below label (e.g. "Apana Store · Shared List")
  onReady:    (filePath: string) => void;
  onError?:   (message: string)  => void;
}

export default function QRGenerator({
  value, cacheKey, label, sublabel, onReady, onError,
}: QRGeneratorProps) {
  // ── Ref on the card View — captureRef screenshots the whole card ──
  const cardRef = useRef<View>(null);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      // Give the card time to fully render and rasterize
      await new Promise(r => setTimeout(r, 800));
      if (cancelled || !cardRef.current) {
        onError?.("Card ref not available after mount");
        return;
      }

      try {
        // captureRef screenshots the View (QR + text) as a PNG tmpfile
        const tmpUri = await captureRef(cardRef, {
          format:  "png",
          quality: 1,
          result:  "tmpfile",
        });

        // Copy tmpfile to a named cache path for stable sharing
        const filePath = `${FileSystem.cacheDirectory}apana-qr-${cacheKey}.png`;
        await FileSystem.copyAsync({ from: tmpUri, to: filePath });

        const info = await FileSystem.getInfoAsync(filePath);
        if (!info.exists || (info as any).size < 100) {
          onError?.("Captured PNG file is empty");
          return;
        }

        if (!cancelled) onReady(filePath);
      } catch (err: any) {
        if (!cancelled) onError?.(err?.message ?? "Capture failed");
      }
    }

    generate();

    // Delete cached PNG on screen unmount
    return () => {
      cancelled = true;
      const filePath = `${FileSystem.cacheDirectory}apana-qr-${cacheKey}.png`;
      FileSystem.deleteAsync(filePath, { idempotent: true }).catch(() => {});
    };
  }, [value, cacheKey]);

  // ── Hidden branded QR card ─────────────────────────────────
  // Positioned at zIndex:-1 so it sits behind the screen header.
  // Must be within the viewport — captureRef fails on off-screen
  // views on some Android devices.
  return (
    <View
      ref={cardRef}
      style={styles.hidden}
      pointerEvents="none"
      collapsable={false}
    >
      {/* White card background — captured as the shared image */}
      <View style={styles.card}>
        <QRCode
          value={value}
          size={HIDDEN_QR_SIZE}
          color="#111827"
          backgroundColor="#FFFFFF"
        />

        {/* Label — list name, order ID, etc. */}
        {!!label && (
          <Text style={styles.label} numberOfLines={2}>{label}</Text>
        )}

        {/* Sublabel — app + context branding */}
        {!!sublabel && (
          <Text style={styles.sublabel}>{sublabel}</Text>
        )}

        {/* Fixed app branding at the bottom */}
        <Text style={styles.brand}>Apana Store</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Positioned behind the header — not visible but within viewport
  hidden: {
    position: "absolute",
    top:      0,
    left:     0,
    zIndex:   -1,
  },

  // White card that gets captured as the shared PNG
  card: {
    backgroundColor: "#FFFFFF",
    padding:         24,
    alignItems:      "center",
    gap:             10,
    width:           HIDDEN_QR_SIZE + 48,
  },

  label: {
    color:      "#111827",
    fontSize:   15,
    fontFamily: "Poppins_700Bold",
    textAlign:  "center",
  },
  sublabel: {
    color:      "#6B7280",
    fontSize:   12,
    fontFamily: "Poppins_400Regular",
    textAlign:  "center",
  },
  brand: {
    color:      "#0F4C81",
    fontSize:   11,
    fontFamily: "Poppins_600SemiBold",
    marginTop:  4,
  },
});
