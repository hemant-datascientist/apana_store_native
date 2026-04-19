// ============================================================
// SHARED LIST QR MODAL — Apana Store
//
// Bottom-sheet modal that shows a scannable QR code for a
// shared shopping list. The recipient scans it with the
// Apana Store app to instantly open and join the list.
//
// QR payload: { type, listId, listName, invitedBy }
// Brightness toggle: tap the QR card to go full-white (low-light)
// Share QR: captures the QR as a PNG via toDataURL → shares image file
// ============================================================

import React, { useState, useRef } from "react";
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  Pressable, Dimensions, Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as Sharing    from "expo-sharing";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { SharedList } from "../../data/sharedListData";

const { width: SW } = Dimensions.get("window");
const QR_SIZE       = SW * 0.55;

interface SharedListQrModalProps {
  visible: boolean;
  list:    SharedList;
  onClose: () => void;
}

export default function SharedListQrModal({ visible, list, onClose }: SharedListQrModalProps) {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();
  const [bright,   setBright]   = useState(false);
  const [sharing,  setSharing]  = useState(false);

  // ── Ref to the QRCode SVG (used for toDataURL capture) ───
  const qrRef = useRef<any>(null);

  // ── QR payload ────────────────────────────────────────────
  // Deep-link format; backend will resolve to the list screen.
  const qrValue = JSON.stringify({
    type:      "apana_shared_list",
    listId:    list.id,
    listName:  list.name,
    invitedBy: "Apana Store User",
  });

  // ── Share the QR code as a PNG image ─────────────────────
  // 1. Capture QR SVG → base64 PNG via toDataURL
  // 2. Write to a temp file in the app cache
  // 3. Hand off to the OS share sheet via expo-sharing
  async function handleShareQr() {
    if (!qrRef.current) {
      Alert.alert("Error", "QR code not ready yet. Please try again.");
      return;
    }

    setSharing(true);
    try {
      await new Promise<void>((resolve, reject) => {
        qrRef.current.toDataURL(async (base64: string) => {
          try {
            const filePath = `${FileSystem.cacheDirectory}shared-list-qr.png`;
            await FileSystem.writeAsStringAsync(filePath, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const canShare = await Sharing.isAvailableAsync();
            if (!canShare) {
              Alert.alert("Sharing not available", "Your device does not support sharing files.");
              resolve();
              return;
            }
            await Sharing.shareAsync(filePath, {
              mimeType:    "image/png",
              dialogTitle: `Share QR for ${list.name}`,
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });
    } catch {
      Alert.alert("Error", "Could not share QR code. Please try again.");
    } finally {
      setSharing(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>

      {/* Scrim */}
      <Pressable style={styles.scrim} onPress={onClose} />

      {/* Sheet */}
      <View style={[styles.sheet, {
        backgroundColor: colors.card,
        paddingBottom:   insets.bottom + 20,
      }]}>

        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              Share via QR
            </Text>
            <Text style={[styles.subtitle, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Let someone scan this to join your list
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.background }]}
            onPress={onClose}
          >
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* QR Card — tap to brighten */}
        <TouchableOpacity
          style={[styles.qrCard, bright && { backgroundColor: "#FFFFFF", opacity: 1 }]}
          onPress={() => setBright(b => !b)}
          activeOpacity={1}
        >
          {/* Corner accent dots in primary color */}
          <View style={[styles.dot, styles.TL, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, styles.TR, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, styles.BL, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, styles.BR, { backgroundColor: colors.primary }]} />

          <QRCode
            value={qrValue}
            size={QR_SIZE}
            color="#111827"
            backgroundColor="#FFFFFF"
            getRef={(c) => { qrRef.current = c; }}
          />

          {/* Brightness hint */}
          {!bright && (
            <View style={[styles.brightHint, { backgroundColor: colors.primary + "18" }]}>
              <Ionicons name="sunny-outline" size={12} color={colors.primary} />
              <Text style={[styles.brightText, { color: colors.primary, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                Tap to brighten
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* List info pill below QR */}
        <View style={[styles.listPill, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
          <Ionicons name="list-outline" size={14} color={colors.primary} />
          <Text style={[styles.listName, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]} numberOfLines={1}>
            {list.name}
          </Text>
          <Text style={[styles.itemCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {list.items.length} items
          </Text>
        </View>

        {/* Instruction note */}
        <View style={[styles.note, { backgroundColor: colors.background }]}>
          <Ionicons name="scan-outline" size={15} color={colors.subText} />
          <Text style={[styles.noteText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Recipient opens Apana Store → Scanner → scans this code to view and check off items together
          </Text>
        </View>

        {/* Share QR image button */}
        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: sharing ? colors.border : colors.primary }]}
          onPress={handleShareQr}
          activeOpacity={0.85}
          disabled={sharing}
        >
          <Ionicons name="share-outline" size={18} color="#fff" />
          <Text style={[styles.shareBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            {sharing ? "Preparing…" : "Share QR Code"}
          </Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    padding:              20,
    gap:                  16,
    alignItems:           "center",
  },

  handle: {
    width:        40,
    height:       4,
    borderRadius: 2,
    marginBottom: 4,
  },

  headerRow: {
    flexDirection:  "row",
    alignItems:     "flex-start",
    justifyContent: "space-between",
    alignSelf:      "stretch",
  },
  title:    {},
  subtitle: { marginTop: 3 },
  closeBtn: {
    width:          34,
    height:         34,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

  // QR card
  qrCard: {
    backgroundColor: "#FFFFFF",
    borderRadius:    20,
    padding:         18,
    alignItems:      "center",
    justifyContent:  "center",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.10,
    shadowRadius:    14,
    elevation:       6,
  },

  // Branded corner dots
  dot: { position: "absolute", width: 10, height: 10, borderRadius: 5 },
  TL:  { top: 10, left: 10  },
  TR:  { top: 10, right: 10 },
  BL:  { bottom: 10, left: 10  },
  BR:  { bottom: 10, right: 10 },

  // Brightness hint overlay
  brightHint: {
    position:          "absolute",
    bottom:            12,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  brightText: {},

  // List info pill
  listPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    alignSelf:         "stretch",
    paddingHorizontal: 14,
    paddingVertical:   10,
    borderRadius:      12,
    borderWidth:       1,
  },
  listName:  { flex: 1 },
  itemCount: {},

  // Instruction note
  note: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    alignSelf:         "stretch",
    padding:           12,
    borderRadius:      12,
  },
  noteText: { flex: 1, lineHeight: 17 },

  // Share button
  shareBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    alignSelf:         "stretch",
    paddingVertical:   14,
    borderRadius:      14,
  },
  shareBtnText: { color: "#fff" },
});
