// ============================================================
// SHARED LIST QR MODAL — Apana Store
//
// Bottom-sheet modal that displays a scannable QR code for a
// shared shopping list and lets the user share it as an image.
//
// QR payload: { type, listId, listName, invitedBy }
// Brightness toggle: tap the QR card to go full-white (low-light)
// Share: QRShareButton receives the pre-generated PNG filePath
//        from the parent screen (via QRGenerator component).
// ============================================================

import React, { useState } from "react";
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  Pressable, Dimensions, Share,
} from "react-native";
import QRCode          from "react-native-qrcode-svg";
import { Ionicons }    from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme        from "../../theme/useTheme";
import { typography }  from "../../theme/typography";
import { SharedList, ShoppingItem } from "../../data/sharedListData";
import QRShareButton   from "../qr/QRShareButton";

const { width: SW } = Dimensions.get("window");
const QR_SIZE       = SW * 0.55;

interface SharedListQrModalProps {
  visible:    boolean;
  list:       SharedList;
  items:      ShoppingItem[];
  onClose:    () => void;
  qrFilePath: string | null;
}

export default function SharedListQrModal({
  visible, list, items, onClose, qrFilePath,
}: SharedListQrModalProps) {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();
  const [bright, setBright] = useState(false);

  // ── Share item list as a text message ─────────────────────
  async function handleShareText() {
    const lines = items
      .map(i => `${i.checked ? "✅" : "⬜"} ${i.name} (${i.qty})`)
      .join("\n");
    await Share.share({
      title:   `${list.name} — Apana Store`,
      message: `Shopping list: ${list.name}\n\n${lines}\n\nShared via Apana Store`,
    });
  }

  // ── QR payload (display only — QRGenerator uses the same value) ──
  const qrValue = JSON.stringify({
    type:      "apana_shared_list",
    listId:    list.id,
    listName:  list.name,
    invitedBy: "Apana Store User",
  });

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
            <Text style={[styles.title, {
              color:      colors.text,
              fontFamily: typography.fontFamily.bold,
              fontSize:   typography.size.lg,
            }]}>
              Share via QR
            </Text>
            <Text style={[styles.subtitle, {
              color:      colors.subText,
              fontFamily: typography.fontFamily.regular,
              fontSize:   typography.size.xs,
            }]}>
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

        {/* QR Card — tap to brighten for easier scanning in low light */}
        <TouchableOpacity
          style={[styles.qrCard, bright && styles.qrCardBright]}
          onPress={() => setBright(b => !b)}
          activeOpacity={1}
        >
          <View style={[styles.dot, styles.TL, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, styles.TR, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, styles.BL, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, styles.BR, { backgroundColor: colors.primary }]} />

          <QRCode
            value={qrValue}
            size={QR_SIZE}
            color="#111827"
            backgroundColor="#FFFFFF"
          />

          {!bright && (
            <View style={[styles.brightHint, { backgroundColor: colors.primary + "18" }]}>
              <Ionicons name="sunny-outline" size={12} color={colors.primary} />
              <Text style={[styles.brightText, {
                color:      colors.primary,
                fontFamily: typography.fontFamily.regular,
                fontSize:   typography.size.ss,
              }]}>
                Tap to brighten
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* List info pill */}
        <View style={[styles.listPill, {
          backgroundColor: colors.primary + "12",
          borderColor:     colors.primary + "30",
        }]}>
          <Ionicons name="list-outline" size={14} color={colors.primary} />
          <Text style={[styles.listName, {
            color:      colors.primary,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.sm,
          }]} numberOfLines={1}>
            {list.name}
          </Text>
          <Text style={[styles.itemCount, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}>
            {list.items.length} items
          </Text>
        </View>

        {/* Instruction note */}
        <View style={[styles.note, { backgroundColor: colors.background }]}>
          <Ionicons name="scan-outline" size={15} color={colors.subText} />
          <Text style={[styles.noteText, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}>
            Recipient opens Apana Store → Scanner → scans this code to view and check off items together
          </Text>
        </View>

        {/* Share QR image — QRShareButton handles all share logic */}
        <QRShareButton
          filePath={qrFilePath}
          dialogTitle={`Share QR for "${list.name}"`}
          color={colors.primary}
        />

        {/* Share item list as a separate text message */}
        <TouchableOpacity
          style={[styles.textShareBtn, { borderColor: colors.border }]}
          onPress={handleShareText}
          activeOpacity={0.8}
        >
          <Ionicons name="list-outline" size={16} color={colors.text} />
          <Text style={[styles.textShareLabel, {
            color:      colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.sm,
          }]}>
            Share Item List as Text
          </Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },

  sheet: {
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    padding:              20,
    gap:                  16,
    alignItems:           "center",
  },

  handle:   { width: 40, height: 4, borderRadius: 2, marginBottom: 4 },

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
  qrCardBright: { backgroundColor: "#FFFFFF", opacity: 1 },

  dot: { position: "absolute", width: 10, height: 10, borderRadius: 5 },
  TL:  { top: 10,    left: 10  },
  TR:  { top: 10,    right: 10 },
  BL:  { bottom: 10, left: 10  },
  BR:  { bottom: 10, right: 10 },

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

  note: {
    flexDirection:  "row",
    alignItems:     "flex-start",
    gap:            8,
    alignSelf:      "stretch",
    padding:        12,
    borderRadius:   12,
  },
  noteText: { flex: 1, lineHeight: 17 },

  textShareBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    alignSelf:         "stretch",
    paddingVertical:   13,
    borderRadius:      14,
    borderWidth:       1,
  },
  textShareLabel: {},
});
